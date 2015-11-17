// Package controllers_test contains controller test for actions in controllers package
package controllers_test

import (
	"net/http"
	"net/http/cookiejar"
	"net/http/httptest"
	"os"
	"testing"

	"github.com/theplant/hsm-acem-survey-app/config/routes"

	// Ensure DB is reset
	_ "github.com/theplant/hsm-acem-survey-app/test/utils"
)

var (
	mux    *http.ServeMux
	server *httptest.Server
)

func init() {
	mux = routes.Mux()
}

// TestMain sets up a clean database and create a new server instance
// for every test case. It also close the server after done the test case.
func TestMain(m *testing.M) {
	server = httptest.NewServer(mux)

	retCode := m.Run()

	server.Close()
	os.Exit(retCode)
}

func newClient() *http.Client {
	client := http.Client{}
	jar, err := cookiejar.New(nil)
	if err != nil {
		panic(err)
	}
	client.Jar = jar
	return &client
}
