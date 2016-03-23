package models_test

import (
	"fmt"
	"strings"
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
	u.SuccessMandrillConfigure()

	template := feedbackParams()
	template.Emails = []string{}

	if err := models.SendFeedbackMail(template); err != models.ErrNoEmailAddress {
		t.Fatalf("Unexpected error: %v", err)
	}
}

func TestSendFeedbackMailFailure(t *testing.T) {
	u.ErrorMandrillConfigure()

	template := feedbackParams()

	if err := models.SendFeedbackMail(template); err == nil {
		t.Fatal("Expected sent mail failure, but it sent out successfully")
	}
}

func TestSendFeedbackMailSuccess(t *testing.T) {
	u.SuccessMandrillConfigure()

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

func TestSendInvitationMailMissingFields(t *testing.T) {
	u.SuccessMandrillConfigure()

	cases := []struct {
		field    string
		template models.InvitationMailTemplate
	}{
		{field: "Email", template: func() (t models.InvitationMailTemplate) { t = invitationParams(); t.Email = ""; return }()},
		{field: "Template", template: func() (t models.InvitationMailTemplate) { t = invitationParams(); t.Template = ""; return }()},
		{field: "Gender", template: func() (t models.InvitationMailTemplate) { t = invitationParams(); t.Gender = ""; return }()},
		{field: "SurveyScore", template: func() (t models.InvitationMailTemplate) { t = invitationParams(); t.SurveyScore = nil; return }()},
	}

	for _, c := range cases {
		if err := models.SendInvitationMail(c.template); !strings.Contains(fmt.Sprint(err), c.field) {
			t.Fatalf("Unexpected error: %v", err)
		}
	}
}

func TestSendInvitationMailFailure(t *testing.T) {
	u.ErrorMandrillConfigure()

	template := invitationParams()

	if err := models.SendInvitationMail(template); err == nil {
		t.Fatal("Expected sent invalidation mail failure, but it sent out successfully")
	}
}

func TestSendInvitationMailSuccess(t *testing.T) {
	u.SuccessMandrillConfigure()

	template := invitationParams()

	if err := models.SendInvitationMail(template); err != nil {
		t.Fatalf("Unexpected error: %v", err)
	}
}

func invitationParams() models.InvitationMailTemplate {
	var score uint = 10
	return models.InvitationMailTemplate{
		Email:       "test@example.com",
		Template:    "register-to-hsm",
		Gender:      "male",
		SurveyScore: &score,
	}
}
