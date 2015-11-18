package controllers_test

import (
	"bufio"
	"bytes"
	"encoding/json"
	"io"
	"net/http"
	"testing"

	"github.com/theplant/hsm-acem-survey-app/app/controllers"
	"github.com/theplant/hsm-acem-survey-app/test/utils"
)

func TestSurveysCreate(t *testing.T) {
	surveyData := defaultSurveyData(t)

	req := prepareRequest(t, surveyData)
	res := doRequest(t, req)

	if res.StatusCode != http.StatusCreated {
		t.Fatalf("Unexpected status code: %d", res.StatusCode)
	}

	jsonData := jsonResponse(t, res)

	if jsonData["id"].(float64) <= 0 {
		t.Fatalf("Unexpected response: %v", jsonData)
	}

	patientData := jsonData["patient"].(map[string]interface{})
	if patientData["id"].(float64) <= 0 {
		t.Fatalf("Unexpected response: %v", jsonData)
	}
}

func TestSurveysCreateWithoutSurveyData(t *testing.T) {
	req := prepareRequest(t, nil)
	res := doRequest(t, req)

	if res.StatusCode != controllers.HTTPStatusUnprocessableEntity {
		t.Fatalf("Unexpected status code: %d", res.StatusCode)
	}
}

func TestSurveysCreateWithoutInterviewer(t *testing.T) {
	surveyData := defaultSurveyData(t)
	delete(surveyData, "interviewer")

	req := prepareRequest(t, surveyData)
	res := doRequest(t, req)

	if res.StatusCode != controllers.HTTPStatusUnprocessableEntity {
		t.Fatalf("Unexpected status code: %d", res.StatusCode)
	}
}

func TestSurveysCreateWithoutPatient(t *testing.T) {
	surveyData := defaultSurveyData(t)
	delete(surveyData, "patient")

	req := prepareRequest(t, surveyData)
	res := doRequest(t, req)

	if res.StatusCode != controllers.HTTPStatusUnprocessableEntity {
		t.Fatalf("Unexpected status code: %d", res.StatusCode)
	}
}

func TestSurveysCreateWithoutPatientAge(t *testing.T) {
	surveyData := defaultSurveyData(t)
	delete(surveyData["patient"].(map[string]interface{}), "age")

	req := prepareRequest(t, surveyData)
	res := doRequest(t, req)

	if res.StatusCode != controllers.HTTPStatusUnprocessableEntity {
		t.Fatalf("Unexpected status code: %d", res.StatusCode)
	}
}

func TestSurveysCreateWithoutPatientGender(t *testing.T) {
	surveyData := defaultSurveyData(t)
	delete(surveyData["patient"].(map[string]interface{}), "gender")

	req := prepareRequest(t, surveyData)
	res := doRequest(t, req)

	if res.StatusCode != controllers.HTTPStatusUnprocessableEntity {
		t.Fatalf("Unexpected status code: %d", res.StatusCode)
	}
}

func TestSurveysCreateWithoutPatientPostcode(t *testing.T) {
	surveyData := defaultSurveyData(t)
	delete(surveyData["patient"].(map[string]interface{}), "postcode")

	req := prepareRequest(t, surveyData)
	res := doRequest(t, req)

	if res.StatusCode != controllers.HTTPStatusUnprocessableEntity {
		t.Fatalf("Unexpected status code: %d", res.StatusCode)
	}
}

func TestSurveysCreateWithoutAnswers(t *testing.T) {
	surveyData := defaultSurveyData(t)
	delete(surveyData, "answers")

	req := prepareRequest(t, surveyData)
	res := doRequest(t, req)

	if res.StatusCode != controllers.HTTPStatusUnprocessableEntity {
		t.Fatalf("Unexpected status code: %d", res.StatusCode)
	}
}

func prepareRequest(t *testing.T, data interface{}) *http.Request {
	jsonData, err := json.Marshal(data)
	utils.AssertNoErr(t, err)

	req, err := http.NewRequest("POST", server.URL+"/api/surveys", bytes.NewBuffer(jsonData))
	utils.AssertNoErr(t, err)

	req.Header.Set("Content-Type", "application/json")
	return req
}

func doRequest(t *testing.T, req *http.Request) *http.Response {
	client := http.Client{}
	res, err := client.Do(req)
	utils.AssertNoErr(t, err)

	return res
}

func jsonResponse(t *testing.T, res *http.Response) map[string]interface{} {
	var s map[string]interface{}
	bytes, err := bufio.NewReader(res.Body).ReadBytes(0)
	if err != io.EOF {
		utils.AssertNoErr(t, err)
	}

	err = json.Unmarshal(bytes, &s)
	utils.AssertNoErr(t, err)
	return s
}

func defaultSurveyData(t *testing.T) (surveyData map[string]interface{}) {
	surveyJSONStr := []byte(`
	  {
		"interviewer": "doctor",
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
