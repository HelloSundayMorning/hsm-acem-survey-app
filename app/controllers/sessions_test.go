package controllers_test

import (
	"net/http"
	"net/url"
	"testing"

	"github.com/HelloSundayMorning/hsm-acem-survey-app/test/utils"
)

// TestSessionsNew testing controllers.SessionsNew action.
func TestSessionsNew(t *testing.T) {
	res, err := http.Get(server.URL + "/sessions/new")
	if err != nil {
		t.Fatal(err)
	}
	if res.StatusCode != http.StatusOK {
		t.Errorf("Unexpected status code: %d", res.StatusCode)
	}
}

// TestSessionsCreate testing controllers.SessionsCreate action.
func TestSessionsCreate(t *testing.T) {
	user := utils.CreateUser(t)
	admin := utils.CreateAdminUser(t)

	cases := []struct {
		email, password, redirectTo string
		want                        int
	}{
		{user.Email, "invalid password", "", http.StatusUnauthorized},
		{user.Email, "test", "/", http.StatusNotFound},
		{admin.Email, "test", "/admin", http.StatusOK},
	}

	for _, c := range cases {
		client := newClient()
		client.CheckRedirect = func(req *http.Request, via []*http.Request) error {
			if got, want := req.URL.Path, c.redirectTo; got != want {
				t.Errorf("unexpected redirect URL: %q, want %q", got, want)
			}
			return nil
		}
		res, err := client.PostForm(server.URL+"/sessions/", url.Values{"Email": []string{c.email}, "Password": []string{c.password}})
		if err != nil {
			t.Fatal(err)
		}
		if got, want := res.StatusCode, c.want; got != want {
			t.Errorf("unexpected status code: %d, want %d", got, want)
		}
	}
}

// TestSessionsDestroy testing controllers.SessionsDestroy action.
func TestSessionsDestroy(t *testing.T) {
	res, err := http.Get(server.URL + "/sessions/destroy")
	if err != nil {
		t.Fatal(err)
	}
	if res.StatusCode != http.StatusNotFound {
		t.Errorf("Unexpected status code: %d", res.StatusCode)
	}
}
