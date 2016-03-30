// Package mandrill provides a way to easy send mail via mandrill.
package mandrill

import (
	"errors"
	"fmt"
	"log"
	"os"
	"sync"

	"github.com/keighl/mandrill"
)

var (
	// client is a global mandrill client that used for sending mail.
	client   *mandrill.Client
	clientMu sync.Mutex

	errNoClient = errors.New("no mandrill client")
)

func init() {
	mandrillAPIKey := os.Getenv("MANDRILL_APIKEY")

	if mandrillAPIKey != "" {
		SetClientWithKey(mandrillAPIKey)
	} else {
		log.Println("[WARNING] No Mandrill API key.")
	}
}

// GetClient returns the global mandrill client.
func GetClient() *mandrill.Client {
	clientMu.Lock()
	defer clientMu.Unlock()
	return client
}

// SetClient sets the given mandrill client as global.
func SetClient(c *mandrill.Client) {
	clientMu.Lock()
	defer clientMu.Unlock()
	client = c
}

// SetClientWithKey sets the global mandrill client with
// the given api key.
func SetClientWithKey(mandrillAPIKey string) {
	SetClient(mandrill.ClientWithKey(mandrillAPIKey))
}

// SendMail sends mandrill template with the given `MergeVars`
// to the given recipients.
//
// It returns an error if no global client or the mandrill api
// response is *invalid* or *rejected*.
func SendMail(recipients []string, variables map[string]string, templateName string) (err error) {
	c := GetClient()

	if c == nil {
		err = errNoClient
		return
	}

	message := mandrill.Message{}
	for _, recipient := range recipients {
		message.AddRecipient(recipient, recipient, "to")
	}

	message.GlobalMergeVars = mandrill.ConvertMapToVariables(variables)

	responses, err := c.MessagesSendTemplate(&message, templateName, nil)
	if err != nil {
		return
	}

	for _, resp := range responses {
		if resp.Status == "invalid" || resp.Status == "rejected" {
			err = fmt.Errorf("send email via mandrill api failed (%s) response: %#v", resp.Status, resp)
		}
	}
	return
}
