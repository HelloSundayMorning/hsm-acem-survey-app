// Package integration_test contains all integration test cases.
package integration_test

import (
	"fmt"
	"net/http"
	"os"
	"time"

	"testing"

	"github.com/onsi/gomega"
	"github.com/sclevine/agouti"

	"github.com/theplant/hsm-acem-survey-app/config/routes"

	// Ensure DB is reset
	_ "github.com/theplant/hsm-acem-survey-app/test/utils"
)

const (
	port = 4444
)

var (
	driver *agouti.WebDriver
	page   *agouti.Page

	requestTimeout = 1 * time.Second

	serverURL          = fmt.Sprintf("http://localhost:%v", port)
	rootURL            = serverURL + "/"
	adminURL           = serverURL + "/admin"
	sessionsURL        = serverURL + "/sessions/"
	newSessionsURL     = serverURL + "/sessions/new"
	destroySessionsURL = serverURL + "/sessions/destroy"
)

// TestMain provides a clean database and a new page before testing.
func TestMain(m *testing.M) {
	driver = agouti.ChromeDriver()
	driver.Start()
	go func() {
		if err := http.ListenAndServe(fmt.Sprintf(":%d", port), routes.Mux()); err != nil {
			panic(err)
		}
	}()

	var err error
	page, err = driver.NewPage()
	if err != nil {
		panic(err)
	}

	test := m.Run()

	driver.Stop()
	os.Exit(test)
}

// beforeEach provides a clean page for every test cases.
func beforeEach(t *testing.T) {
	gomega.RegisterTestingT(t)
	if err := page.ClearCookies(); err != nil {
		t.Fatal(err)
	}
}
