// Package middleware contains generic middleware used for eg. logging, monitoring
package middleware

import (
	"fmt"
	"log"
	"net/url"
	"regexp"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	influxdb "github.com/influxdb/influxdb/client"
)

// Monitor is opaque type for monitoring middleware configuration
type Monitor struct {
	cfg      *influxdb.Config
	database string
}

// NewMonitor creates new monitoring client. monitorURL syntax is
// `https://<username>:<password>@<influx DB host>/<database>`
func NewMonitor(monitorURL string) (*Monitor, error) {
	u, err := url.Parse(monitorURL)
	if err != nil || !u.IsAbs() {
		log.Println("InfluxDB URL Parse Error", err)
		return nil, err
	}

	monitor := Monitor{
		database: strings.TrimLeft(u.Path, "/"),
		cfg: &influxdb.Config{
			URL: *u,
		},
	}

	// NewClient always returns a nil error
	client, _ := influxdb.NewClient(*monitor.cfg)

	// Ignore duration, version
	_, _, err = client.Ping()
	if err != nil {
		log.Println("Influx Error", err)
	}

	return &monitor, nil
}

// OperationMonitor returns Gin middleware that logs requests into
// an InfluxDB database
func OperationMonitor(cfg *Monitor) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		start := time.Now()
		defer func() {
			interval := time.Now().Sub(start)
			localCtx := ctx.Copy()
			go func() {
				tags := tagsForContext(localCtx)
				insertInfluxPoint(cfg, "request", start, interval, tags)
			}()
		}()

		ctx.Next()
	}
}

func tagsForContext(ctx *gin.Context) map[string]string {
	return map[string]string{
		"path":           scrubPath(ctx.Request.URL.Path),
		"request_method": ctx.Request.Method,
		"response_code":  fmt.Sprint(ctx.Writer.Status()),
	}
}

var idScrubber = regexp.MustCompile("[0-9]+")

func scrubPath(path string) string {
	return idScrubber.ReplaceAllString(path, ":id")
}

func insertInfluxPoint(
	monitor *Monitor,
	measurement string,
	start time.Time,
	duration time.Duration,
	tags map[string]string) {

	// NewClient always returns a nil error
	client, _ := influxdb.NewClient(*monitor.cfg)

	// Ignore response, we only care about write errors
	_, err := client.Write(influxdb.BatchPoints{
		Database: monitor.database,
		Points: []influxdb.Point{
			{
				Measurement: measurement,
				Tags:        tags,
				Fields: map[string]interface{}{
					"value": float64(duration / time.Millisecond),
				},
				Time: start,
			},
		},
	})

	if err != nil {
		log.Println("Influx Error:", err)
	}
}

// CountError logs a value in measurement, with the given error's
// message stored in an `error` tag.
func (monitor *Monitor) CountError(measurement string, value float64, err error) {
	data := map[string]string{"error": err.Error()}
	monitor.Count(measurement, value, data)
}

// CountSimple logs a value in measurement (with no tags)
func (monitor *Monitor) CountSimple(measurement string, value float64) {
	monitor.Count(measurement, value, nil)
}

// Count logs a value in measurement with given tags
func (monitor *Monitor) Count(
	measurement string,
	value float64,
	tags map[string]string) {

	// NewClient always returns a nil error
	client, _ := influxdb.NewClient(*monitor.cfg)

	// Ignore response, we only care about write errors
	_, err := client.Write(influxdb.BatchPoints{
		Database: monitor.database,
		Points: []influxdb.Point{
			{
				Measurement: measurement,
				Tags:        tags,
				Fields: map[string]interface{}{
					"value": value,
				},
				Time: time.Now(),
			},
		},
	})

	if err != nil {
		log.Println("Influx Error:", err)
	}
}
