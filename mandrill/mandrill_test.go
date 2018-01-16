package mandrill_test

import (
	"strings"
	"testing"

	"github.com/HelloSundayMorning/hsm-acem-survey-app/mandrill"
	mu "github.com/HelloSundayMorning/hsm-acem-survey-app/mandrill/utils"
)

func TestGetClient(t *testing.T) {
	mu.SuccessMandrillConfigure()
	client := mandrill.GetClient()

	if client == nil {
		t.Fatal("expect GetClient returns the mandrill's client, but it returns nil")
	}
}

func TestSetClientWithKey(t *testing.T) {
	mandrill.SetClientWithKey("MANDRILL_API_KEY")
	client := mandrill.GetClient()

	if client.Key != "MANDRILL_API_KEY" {
		t.Fatalf("expect SetClientWithKey sets mandrill's client with the given key, but got unexpected client key: %q", client.Key)
	}
}

func TestSetClient(t *testing.T) {
	mu.SuccessMandrillConfigure()
	client := mandrill.GetClient()

	if client == nil {
		t.Fatal("unexpected client")
	}

	mandrill.SetClient(nil)
	client = mandrill.GetClient()
	if client != nil {
		t.Fatalf("expect SetClient sets mandrill's client to nil, but got unexpected client: %v", client)
	}
}

func TestSendMailWithNoClient(t *testing.T) {
	mu.NilMandrillConfigure()

	err := sendMail()

	if err == nil || !strings.Contains("no mandrill client", err.Error()) {
		t.Fatalf("expect SendMail failure, but got unexpected SendMail error: %v", err)
	}
}

func TestSendMailSuccess(t *testing.T) {
	mu.SuccessMandrillConfigure()

	err := sendMail()

	if err != nil {
		t.Fatalf("expect SendMail successfully, but got unexpected SendMail error: %v", err)
	}
}

func TestSendMailFailure(t *testing.T) {
	mu.ErrorMandrillConfigure()

	err := sendMail()

	if err == nil || !strings.Contains("SANDBOX_ERROR", err.Error()) {
		t.Fatalf("expect SendMail failure, but got unexpected SendMail error: %v", err)
	}
}

func sendMail() error {
	return mandrill.SendMail([]string{"recipient@example.com"}, map[string]string{"ping": "pong"}, "template name")
}
