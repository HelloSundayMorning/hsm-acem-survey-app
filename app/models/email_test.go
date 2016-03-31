package models_test

import (
	"testing"

	"github.com/theplant/hsm-acem-survey-app/app/models"
	mu "github.com/theplant/hsm-acem-survey-app/mandrill/utils"
)

func TestSendWithoutEmail(t *testing.T) {
	mu.SuccessMandrillConfigure()

	template := emailParams()
	template.Email = ""

	if err := models.SendCompletedMail(template); err != models.ErrNoEmailAddress {
		t.Fatalf("Unexpected error: %v", err)
	}
}

func TestSendMailFailure(t *testing.T) {
	mu.ErrorMandrillConfigure()

	template := emailParams()

	if err := models.SendCompletedMail(template); err == nil {
		t.Fatal("Expected sent mail failure, but it sent out successfully")
	}
}

func TestSendMailSuccess(t *testing.T) {
	mu.SuccessMandrillConfigure()

	template := emailParams()

	if err := models.SendCompletedMail(template); err != nil {
		t.Fatalf("Unexpected error: %v", err)
	}
}

func emailParams() models.EmailTemplate {
	var score uint = 10
	return models.EmailTemplate{
		Email:                "test@example.com",
		Template:             "low-risk",
		FrequencyChart:       "http://thecatapi.com/api/images/get?format=src&type=gif",
		AuditChart:           "http://thecatapi.com/api/images/get?format=src&type=gif",
		RiskChart:            "http://thecatapi.com/api/images/get?format=src&type=gif",
		SurveyScore:          &score,
		RiskFactorString:     "twice as likely",
		PopulationPercentage: &score,
	}
}

func TestSendFeedbackMailWithNoEmails(t *testing.T) {
	mu.SuccessMandrillConfigure()

	template := feedbackParams()
	template.Emails = []string{}

	if err := models.SendFeedbackMail(template); err != models.ErrNoEmailAddress {
		t.Fatalf("Unexpected error: %v", err)
	}
}

func TestSendFeedbackMailFailure(t *testing.T) {
	mu.ErrorMandrillConfigure()

	template := feedbackParams()

	if err := models.SendFeedbackMail(template); err == nil {
		t.Fatal("Expected sent mail failure, but it sent out successfully")
	}
}

func TestSendFeedbackMailSuccess(t *testing.T) {
	mu.SuccessMandrillConfigure()

	template := feedbackParams()

	if err := models.SendFeedbackMail(template); err != nil {
		t.Fatalf("Unexpected error: %v", err)
	}
}

func feedbackParams() models.FeedbackMailTemplate {
	return models.FeedbackMailTemplate{
		Emails:   []string{"test@example.com"},
		Template: "feedback",
		FreeText: "Put free text here",
	}
}
