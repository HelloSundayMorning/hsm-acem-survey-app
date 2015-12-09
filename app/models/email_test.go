package models_test

import (
	"testing"

	"github.com/theplant/hsm-acem-survey-app/app/models"
	u "github.com/theplant/hsm-acem-survey-app/test/utils"
)

func TestSendWithoutEmail(t *testing.T) {
	u.SuccessMandrillConfigure()

	template := emailParams()
	template.Email = ""

	if err := models.SendCompletedMail(template); err != models.ErrNoEmailAddress {
		t.Fatalf("Unexpected error: %v", err)
	}
}

func TestSendMailFailure(t *testing.T) {
	u.ErrorMandrillConfigure()

	template := emailParams()

	if err := models.SendCompletedMail(template); err == nil {
		t.Fatal("Expected sent mail failure, but it sent out successfully")
	}
}

func TestSendMailSuccess(t *testing.T) {
	u.SuccessMandrillConfigure()

	template := emailParams()

	if err := models.SendCompletedMail(template); err != nil {
		t.Fatalf("Unexpected error: %v", err)
	}
}

func emailParams() models.EmailTemplate {
	return models.EmailTemplate{
		Email:          "test@example.com",
		Template:       "low-risk",
		FrequencyChart: `<img src="http://thecatapi.com/api/images/get?format=src&type=gif">`,
		AuditChart:     `<img src="http://thecatapi.com/api/images/get?format=src&type=gif">`,
		RiskChart:      `<img src="http://thecatapi.com/api/images/get?format=src&type=gif">`,
	}
}
