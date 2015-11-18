package models_test

import (
	"testing"

	"github.com/keighl/mandrill"
	"github.com/theplant/hsm-acem-survey-app/app/models"
	"github.com/theplant/hsm-acem-survey-app/config"
)

func TestSurveySendCompletedMailWithoutMandrillClient(t *testing.T) {
	noMandrillConfigure()

	survey := newSurvey()

	if err := survey.SendCompletedMail(); err != models.ErrNoMandrillClient {
		t.Fatalf("Unexpected error: %v", err)
	}
}

func TestSurveySendCompletedMailWithoutPatientEmail(t *testing.T) {
	successMandrillConfigure()

	survey := newSurvey()
	survey.Patient.Email = ""

	if err := survey.SendCompletedMail(); err != models.ErrNoEmailAddress {
		t.Fatalf("Unexpected error: %v", err)
	}
}

func TestSurveySendCompletedMailFailure(t *testing.T) {
	errorMandrillConfigure()

	survey := newSurvey()

	if err := survey.SendCompletedMail(); err == nil {
		t.Fatal("Expected sent mail failure, but it sent out successfully")
	}
}

func TestSurveySendCompletedMailSuccess(t *testing.T) {
	successMandrillConfigure()

	survey := newSurvey()

	if err := survey.SendCompletedMail(); err != nil {
		t.Fatalf("Unexpected error: %v", err)
	}
}

func newSurvey() *models.Survey {
	return &models.Survey{
		Interviewer: "doctor",
		Answers: []map[string]interface{}{
			map[string]interface{}{"question": "How other do you drink?", "answer": "Monthly or less"},
			map[string]interface{}{"question": "How many standard drinks containing alcohol do you have in a typical day?", "answer": "1 or 2"},
			map[string]interface{}{"question": "Have you or someone else been injured as a result of your drinking?", "answer": nil},
		},
		Patient: models.Patient{Age: 21, Gender: "male", Postcode: "0123456789", Email: "patient@person.com", Mobile: "+8612345678901"},
	}
}

func noMandrillConfigure() {
	config.Mandrill.Client = nil
}

func successMandrillConfigure() {
	config.Mandrill.Client = mandrill.ClientWithKey("SANDBOX_SUCCESS")
}

func errorMandrillConfigure() {
	config.Mandrill.Client = mandrill.ClientWithKey("SANDBOX_ERROR")
}
