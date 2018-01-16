package models_test

import (
	"bytes"
	"encoding/json"
	"net/http"
	"strings"
	"testing"

	"github.com/HelloSundayMorning/hsm-acem-survey-app/app/models"
	"github.com/HelloSundayMorning/hsm-acem-survey-app/db"
	mu "github.com/HelloSundayMorning/hsm-acem-survey-app/mandrill/utils"
	"github.com/HelloSundayMorning/hsm-acem-survey-app/test/utils"
	"github.com/gin-gonic/gin/binding"
)

func TestSurveyBinding(t *testing.T) {
	surveyData := defaultRequestSurveyData(t)

	req := prepareRequest(t, surveyData)
	survey := models.Survey{}

	if err := binding.JSON.Bind(req, &survey); err != nil {
		t.Fatalf("Expected binding success, but it failed (%v).", err)
	}

	fields := []string{"interviewer", "location", "evaluation", "patient", "answers"}
	for _, field := range fields {
		surveyData := defaultRequestSurveyData(t)
		delete(surveyData, field)

		req := prepareRequest(t, surveyData)
		survey := models.Survey{}

		if err := binding.JSON.Bind(req, &survey); err == nil {
			t.Fatalf("Expected binding to fail on field %q, but it succeeded.", field)
		}
	}
}

func TestSurveyPatientBinding(t *testing.T) {
	fields := []string{"age", "gender", "postcode"}
	for _, field := range fields {
		surveyData := defaultRequestSurveyData(t)
		delete(surveyData["patient"].(map[string]interface{}), field)

		req := prepareRequest(t, surveyData)
		survey := models.Survey{}

		if err := binding.JSON.Bind(req, &survey); err == nil {
			t.Fatalf("Expected binding to fail on field patient.%q, but it succeeded.", field)
		}
	}
}

func defaultRequestSurveyData(t *testing.T) (surveyData map[string]interface{}) {
	surveyJSONStr := []byte(`
	  {
		"interviewer": "doctor",
		"location": "warrnambool",
		"evaluation": "unsure",
		"patient": { "age": 21, "gender": "male", "postcode": "012345678", "email": "person@patient.im", "mobile": "+8612345678901" },
		"answers": [
		   { "question": "Q1: How often do you have a drink containing alcohol?", "answer": {"text": "2-4 times a month", "score": 2} },
		   { "question": "Q2: How many standard drinks containing alcohol do you have in a typical day when you are drinking?", "answer": {"text": "1 or 2", "score": 0} },
		   { "question": "Q3: How often do you have six or more drinks on one occasion?", "answer": {"text": "Monthly or less", "score": 1} }
		]
	  }
	`)
	err := json.Unmarshal(surveyJSONStr, &surveyData)
	utils.AssertNoErr(t, err)

	return
}

func prepareRequest(t *testing.T, data interface{}) *http.Request {
	jsonData, err := json.Marshal(data)
	utils.AssertNoErr(t, err)

	req, err := http.NewRequest("POST", "/api/surveys", bytes.NewBuffer(jsonData))
	utils.AssertNoErr(t, err)

	req.Header.Set("Content-Type", "application/json")
	return req
}

func TestSurveyScore(t *testing.T) {
	survey := newSurvey()
	survey.Answers = []map[string]interface{}{
		map[string]interface{}{"answer": map[string]interface{}{"score": 1}},
		map[string]interface{}{"answer": map[string]interface{}{"score": 2}},
		map[string]interface{}{"answer": map[string]interface{}{"score": 3}},
	}
	utils.AssertNoErr(t, db.DB.Create(survey).Error)

	if got, want := survey.Score(), uint(6); got != want {
		t.Fatalf("got survey.Score() = %d, want %d", got, want)
	}
}

func TestSurveySendInvitationMailFailure(t *testing.T) {
	mu.ErrorMandrillConfigure()
	survey := createSurvey(t)

	utils.AssertNoErr(t, survey.SendInvitationMail(db.DB))

	if !survey.InvitationMailError.Valid {
		t.Fatal("Expected record error in InvitationMailError, but it doesn't.")
	}

	if got := survey.InvitationMailError.String; !strings.Contains(got, "SANDBOX_ERROR") {
		t.Fatalf("got unexpected invitation mail error: %v", got)
	}

	if survey.InvitationMailSentAt == nil {
		t.Fatalf("Unexpected survey.InvitationMailSentAt")
	}
}

func TestSurveySendInvitationMailWithNoEmail(t *testing.T) {
	mu.SuccessMandrillConfigure()

	survey := newSurvey()
	survey.Patient.Email = ""
	utils.AssertNoErr(t, db.DB.Create(survey).Error)

	utils.AssertNoErr(t, survey.SendInvitationMail(db.DB))

	if !survey.InvitationMailError.Valid {
		t.Fatal("Expected record error in InvitationMailError, but it doesn't.")
	}

	if got := survey.InvitationMailError.String; !strings.Contains(got, "Email") {
		t.Fatalf("got unexpected invitation mail error: %v", got)
	}

	if survey.InvitationMailSentAt == nil {
		t.Fatalf("Unexpected survey.InvitationMailSentAt")
	}
}

func TestSurveySendInvitationMailSuccess(t *testing.T) {
	mu.SuccessMandrillConfigure()
	survey := createSurvey(t)

	utils.AssertNoErr(t, survey.SendInvitationMail(db.DB))

	if survey.InvitationMailError.Valid {
		t.Fatal("Expected no error be recorded in InvitationMailError, but it doesn't.")
	}

	if survey.InvitationMailError.Valid {
		t.Fatalf("got unexpected invitation mail error: %v", survey.InvitationMailError.String)
	}

	if survey.InvitationMailSentAt == nil {
		t.Fatalf("Unexpected survey.InvitationMailSentAt")
	}
}

func newSurvey() *models.Survey {
	return &models.Survey{
		Interviewer: "doctor",
		Location:    "warrnambool",
		Answers: []map[string]interface{}{
			map[string]interface{}{
				"question": "Q1: How often do you have a drink containing alcohol?",
				"answer":   map[string]interface{}{"text": "2-4 times a month", "score": 2},
			},
			map[string]interface{}{
				"question": "Q2: How many standard drinks containing alcohol do you have in a typical day when you are drinking?",
				"answer":   map[string]interface{}{"text": "1 or 2", "score": 0},
			},
			map[string]interface{}{
				"question": "Q3: How often do you have six or more drinks on one occasion?",
				"answer":   map[string]interface{}{"text": "Monthly or less", "score": 1},
			},
		},
		Patient: models.Patient{
			Age:      21,
			Gender:   "male",
			Postcode: "0123456789",
			Email:    "patient@person.com",
			Mobile:   "+8612345678901",
		},
	}
}

func createSurvey(t *testing.T) (survey *models.Survey) {
	survey = newSurvey()
	err := db.DB.Create(survey).Error
	utils.AssertNoErr(t, err)
	return
}
