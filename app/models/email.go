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

	// Total score of survey
	SurveyScore *uint `binding:"exists"` // `binding:"required"` rejects a value of 0, and "exists" requires a pointer to work correctly

	// Text fragment for risk factor (twice as likely, 3 times as likely, etc)
	RiskFactorString string `binding:"required"`

	// Number 0-100 that indicates percentage of similar population
	// that drinks less than the patient as indicated by their survey
	// results.
	PopulationPercentage uint `binding:"required"`

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
		"FREQUENCY_CHART":  t.FrequencyChart,
		"RISK_CHART":       t.RiskChart,
		"AUDIT_CHART":      t.AuditChart,
		"RISK_FACTOR":      t.RiskFactorString,
		"SURVEY_SCORE":     fmt.Sprintf("%d", *t.SurveyScore),
		"DRINK_PERCENTAGE": fmt.Sprintf("%d", t.PopulationPercentage),
	}

	message.GlobalMergeVars = mandrill.ConvertMapToVariables(data)

	responses, err := config.Mandrill.Client.MessagesSendTemplate(&message, t.Template, nil)
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
