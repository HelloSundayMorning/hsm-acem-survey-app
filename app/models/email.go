package models

import (
	"errors"
	"fmt"

	"github.com/keighl/mandrill"
	"github.com/theplant/hsm-acem-survey-app/config"
)

var (
	// ErrNoEmailAddress represents no email address as recipient.
	ErrNoEmailAddress = errors.New("no email address")
)

// EmailTemplate describes data that will be passed on to Mandrill
type EmailTemplate struct {
	// Recipient email address
	Email string `binding:"required"`

	// Mandrill template to use
	Template string `binding:"required"`

	// Chart image tags that link to (deprecated) Google Static Charts
	FrequencyChart string `binding:"required"`
	AuditChart     string `binding:"required"`
	RiskChart      string `binding:"required"`
}

// SendCompletedMail sends survey completed mail to the the given email address
func SendCompletedMail(t EmailTemplate) (err error) {
	if t.Email == "" {
		return ErrNoEmailAddress
	}

	message := mandrill.Message{}
	message.AddRecipient(t.Email, t.Email, "to")

	data := map[string]string{
		"frequency-chart": t.FrequencyChart,
		"risk-chart":      t.RiskChart,
		"audit-chart":     t.AuditChart,
	}

	responses, err := config.Mandrill.Client.MessagesSendTemplate(&message, t.Template, data)
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
