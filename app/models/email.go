package models

import (
	"errors"
	"fmt"

	"github.com/HelloSundayMorning/hsm-acem-survey-app/mandrill"
	"github.com/gin-gonic/gin/binding"
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
	PopulationPercentage *uint `binding:"exists"` // `binding:"required"` rejects a value of 0, and "exists" requires a pointer to work correctly

	// Chart image tags that link to (deprecated) Google Static Charts
	FrequencyChart string `binding:"required"`
	AuditChart     string `binding:"required"`
	RiskChart      string `binding:"required"`
}

// SendCompletedMail sends survey completed mail to the the given email address
func SendCompletedMail(t EmailTemplate) error {
	if t.Email == "" {
		return ErrNoEmailAddress
	}

	data := map[string]string{
		"FREQUENCY_CHART":  t.FrequencyChart,
		"RISK_CHART":       t.RiskChart,
		"AUDIT_CHART":      t.AuditChart,
		"RISK_FACTOR":      t.RiskFactorString,
		"SURVEY_SCORE":     fmt.Sprintf("%d", *t.SurveyScore),
		"DRINK_PERCENTAGE": fmt.Sprintf("%d", *t.PopulationPercentage),
	}

	return mandrill.SendMail([]string{t.Email}, data, t.Template)
}

// FeedbackMailTemplate describes data that will be passed on to
// Mandrill for sending feedback mail.
type FeedbackMailTemplate struct {
	// Recipient email addresses
	Emails []string `binding:"required"`

	// Mandrill template to use
	Template string `binding:"required"`

	// Feedback content text
	FreeText string `binding:"required"`
}

// NewFeedbackMailTemplate returns a default FeedbackMailTemplate
// with recipient emails and mandrill template.
func NewFeedbackMailTemplate() (template FeedbackMailTemplate) {
	return FeedbackMailTemplate{
		Emails:   []string{"alex@hellosundaymorning.org", "pieter@hellosundaymorning.org"},
		Template: "feedback",
	}
}

// SendFeedbackMail sends survey feedback mail to the the given
// email address.
func SendFeedbackMail(t FeedbackMailTemplate) error {
	if len(t.Emails) == 0 {
		return ErrNoEmailAddress
	}

	data := map[string]string{
		"FREE_TEXT": t.FreeText,
	}

	return mandrill.SendMail(t.Emails, data, t.Template)
}

// InvitationTemplate is the mandrill template slug that used for invitation mail.
// The template slug is specified in: https://trello.com/c/1b6YdgIt/21-cron-job-for-daybreak-invitations#comment-5701b820e1f5b205d411df94
const InvitationTemplate = "just-checking-in"

// InvitationMailTemplate describes data that will be passed on to Mandrill
type InvitationMailTemplate struct {
	// Recipient email address
	Email string `binding:"required,email"`

	// Mandrill template to use
	Template string `binding:"required"`

	// Gender of survey
	Gender string `binding:"required"`

	// Total score of survey
	SurveyScore *uint `binding:"exists"` // `binding:"required"` rejects a value of 0, and "exists" requires a pointer to work correctly
}

// SendInvitationMail sends "Register to HSM" mail to the the given email address
func SendInvitationMail(t InvitationMailTemplate) error {
	if err := binding.Validator.ValidateStruct(t); err != nil {
		return err
	}

	data := map[string]string{
		"GENDER":       t.Gender,
		"SURVEY_SCORE": fmt.Sprintf("%d", *t.SurveyScore),
	}

	return mandrill.SendMail([]string{t.Email}, data, t.Template)
}
