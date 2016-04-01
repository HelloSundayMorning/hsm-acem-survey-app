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
