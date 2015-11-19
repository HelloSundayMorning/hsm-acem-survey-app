package config

import (
	"log"
	"net/http"
	"os"
	"runtime/debug"
	"strconv"

	gobrake "gopkg.in/airbrake/gobrake.v1"
)

func initAirbrake() (airbrake *gobrake.Notifier) {
	projectIDStr := os.Getenv("AIRBRAKE_PROJECT_ID")
	token := os.Getenv("AIRBRAKE_TOKEN")
	env := os.Getenv("AIRBRAKE_ENV")

	if env == "" {
		env = "dev"
	}

	projectID, err := strconv.ParseInt(projectIDStr, 10, 64)
	if token == "" {
		return
	} else if err != nil {
		log.Printf("Airbrake Configuration Error: %v\n", err)
	} else {
		airbrake = gobrake.NewNotifier(projectID, token)
		airbrake.SetContext("environment", env)
		log.Printf("Logging errors to Airbrake '%s' env on project %v\n", env, projectID)
	}

	return
}

// AirbrakeNotify is used for easy report message to airbrake service manually.
func AirbrakeNotify(e interface{}) {
	log.Println("[ERROR]", e)

	debug.PrintStack()

	if Airbrake.Client == nil {
		log.Println("[WARNING] Report error failed (no airbrake client) reporting error:", e)
		return
	}

	var req *http.Request

	// not using goroutine here in order to keep the whole backtrace in
	// airbrake report
	Airbrake.Client.Notify(e, req)
}
