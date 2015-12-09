package models_test

import (
	"bytes"
	"encoding/json"
	"net/http"
	"testing"

	"github.com/theplant/hsm-acem-survey-app/app/models"
	"github.com/theplant/hsm-acem-survey-app/test/utils"

	"github.com/gin-gonic/gin/binding"
)

func newSurvey() *models.Survey {
	return &models.Survey{
		Interviewer: "doctor",
		Location:    "warrnambool",
		Answers: []map[string]interface{}{
			map[string]interface{}{"question": "How other do you drink?", "answer": "Monthly or less"},
			map[string]interface{}{"question": "How many standard drinks containing alcohol do you have in a typical day?", "answer": "1 or 2"},
			map[string]interface{}{"question": "Have you or someone else been injured as a result of your drinking?", "answer": nil},
		},
		Patient: models.Patient{Age: 21, Gender: "male", Postcode: "0123456789", Email: "patient@person.com", Mobile: "+8612345678901"},
	}
}

func TestSurveyBindingSuccess(t *testing.T) {
	surveyData := defaultRequestSurveyData(t)

	req := prepareRequest(t, surveyData)
	survey := models.Survey{}

	if err := binding.JSON.Bind(req, &survey); err != nil {
		t.Fatalf("Expected binding success, but it failed (%v).", err)
	}
}

func TestSurveyBindingWithoutInterviewer(t *testing.T) {
	surveyData := defaultRequestSurveyData(t)
	delete(surveyData, "interviewer")

	req := prepareRequest(t, surveyData)
	survey := models.Survey{}

	if err := binding.JSON.Bind(req, &survey); err == nil {
		t.Fatal("Expected binding failed, but it success.")
	}
}

func TestSurveyBindingWithoutLocation(t *testing.T) {
	surveyData := defaultRequestSurveyData(t)
	delete(surveyData, "location")

	req := prepareRequest(t, surveyData)
	survey := models.Survey{}

	if err := binding.JSON.Bind(req, &survey); err == nil {
		t.Fatal("Expected binding failed, but it success.")
	}
}

func TestSurveyBindingWithoutPatient(t *testing.T) {
	surveyData := defaultRequestSurveyData(t)
	delete(surveyData, "patient")

	req := prepareRequest(t, surveyData)
	survey := models.Survey{}

	if err := binding.JSON.Bind(req, &survey); err == nil {
		t.Fatal("Expected binding failed, but it success.")
	}
}

func TestSurveyBindingWithoutPatientAge(t *testing.T) {
	surveyData := defaultRequestSurveyData(t)
	delete(surveyData["patient"].(map[string]interface{}), "age")

	req := prepareRequest(t, surveyData)
	survey := models.Survey{}

	if err := binding.JSON.Bind(req, &survey); err == nil {
		t.Fatal("Expected binding failed, but it success.")
	}
}

func TestSurveyBindingWithoutPatientGender(t *testing.T) {
	surveyData := defaultRequestSurveyData(t)
	delete(surveyData["patient"].(map[string]interface{}), "gender")

	req := prepareRequest(t, surveyData)
	survey := models.Survey{}

	if err := binding.JSON.Bind(req, &survey); err == nil {
		t.Fatal("Expected binding failed, but it success.")
	}
}

func TestSurveyBindingWithoutPatientPostcode(t *testing.T) {
	surveyData := defaultRequestSurveyData(t)
	delete(surveyData["patient"].(map[string]interface{}), "postcode")

	req := prepareRequest(t, surveyData)
	survey := models.Survey{}

	if err := binding.JSON.Bind(req, &survey); err == nil {
		t.Fatal("Expected binding failed, but it success.")
	}
}

func TestSurveyBindingWithoutAnswers(t *testing.T) {
	surveyData := defaultRequestSurveyData(t)
	delete(surveyData, "answers")

	req := prepareRequest(t, surveyData)
	survey := models.Survey{}

	if err := binding.JSON.Bind(req, &survey); err == nil {
		t.Fatal("Expected binding failed, but it success.")
	}
}

func defaultRequestSurveyData(t *testing.T) (surveyData map[string]interface{}) {
	surveyJSONStr := []byte(`
	  {
		"interviewer": "doctor",
		"location": "warrnambool",
		"patient": { "age": 21, "gender": "male", "postcode": "012345678", "email": "person@patient.im", "mobile": "+8612345678901" },
		"answers": [
		   { "question": "How other do you drink?", "answer": "Monthly or less" },
		   { "question": "How many standard drinks containing alcohol do you have in a typical day?", "answer": "1 or 2" }
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
