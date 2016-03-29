// Package config is ACEM Configuration
package config

import (
	"errors"
	"log"
	"os"
	"path/filepath"

	"github.com/gorilla/sessions"
	"github.com/keighl/mandrill"
)

var (
	// Root is application root path
	Root = os.Getenv("APP_ROOT")

	// DB is global DB configuration data
	DB struct {
		Params string
		Debug  bool
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
	initMandrill()

	loadDBConfig()

	initSessionStore()
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

func initMandrill() {
	mandrillAPIKey := os.Getenv("MANDRILL_APIKEY")

	if mandrillAPIKey == "" {
		panic(errors.New("no mandrill api key"))
	}

	Mandrill.Client = mandrill.ClientWithKey(mandrillAPIKey)
}
