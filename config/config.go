// Package config is ACEM Configuration
package config

import (
	"errors"
	"log"
	"os"
	"path/filepath"

	"github.com/gorilla/sessions"
)

var (
	// Root is application root path
	Root = os.Getenv("GOPATH") + "/src/github.com/theplant/hsm-acem-survey-app"

	// DB is global DB configuration data
	DB struct {
		Params string
		Debug  bool
	}

	// SessionStore is global app cookie store
	SessionStore *sessions.CookieStore

	// SessionKey is key used for session cookie
	SessionKey = "hsm-acem-survey-app"

	ServeStaticAssets = os.Getenv("SERVE_STATIC_ASSETS") != ""
)

func init() {
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
