// Package config is ACEM Configuration
package config

import (
	"errors"
	"log"
	"os"
	"path/filepath"

	"github.com/gorilla/sessions"
	"github.com/keighl/mandrill"
	gobrake "gopkg.in/airbrake/gobrake.v1"

	"github.com/theplant/hsm-acem-survey-app/middleware"
)

var (
	// Root is application root path
	Root = os.Getenv("GOPATH") + "/src/github.com/theplant/hsm-acem-survey-app"

	// DB is global DB configuration data
	DB struct {
		Params string
		Debug  bool
	}

	// Monitor is InfluxDB monitor configuration
	Monitor *middleware.Monitor

	// Airbrake for error logging
	Airbrake struct {
		Client *gobrake.Notifier
	}

	// Mandrill is global client for sending emails with Mandrill
	Mandrill struct {
		Client                           *mandrill.Client
		SurveyCompletedEmailTemplateSlug string
	}

	// SessionStore is global app cookie store
	SessionStore *sessions.CookieStore

	// SessionKey is key used for session cookie
	SessionKey = "hsm-acem-survey-app"
)

func init() {
	Airbrake.Client = initAirbrake()

	initMandrill()

	loadDBConfig()

	initSessionStore()

	initMonitor()
}

// AbsolutePath receives a relative path argument and returns a absolute path.
func AbsolutePath(path string) string {
	return filepath.Join(Root, path)
}

func loadDBConfig() {
	params := os.Getenv("ACEM_DB_PARAMS")
	if params == "" {
		panic(errors.New("db params can not be blank"))
	}

	debug := false
	if os.Getenv("ACEM_DB_MODE") == "debug" {
		debug = true
	}

	DB.Params = params
	DB.Debug = debug
}

func initSessionStore() {
	sessionSecret := os.Getenv("ACEM_SESSION_SECRET")
	if sessionSecret == "" {
		log.Printf("[WARNING] haven't config a session secret base key")
	}
	SessionStore = sessions.NewCookieStore([]byte(sessionSecret))
}

func initMonitor() {
	influxdbURL := os.Getenv("INFLUXDB_URL")

	if influxdbURL == "" {
		return
	}

	monitor, err := middleware.NewMonitor(influxdbURL)

	if err != nil {
		log.Println("Monitor Error", err)
		return
	}

	Monitor = monitor
}

func initMandrill() {
	mandrillAPIKey := os.Getenv("MANDRILL_APIKEY")

	if mandrillAPIKey == "" {
		panic(errors.New("no mandrill api key"))
	}

	Mandrill.Client = mandrill.ClientWithKey(mandrillAPIKey)
}
