package controllers_test

import (
	"bufio"
	"bytes"
	"encoding/json"
	"io"
	"net/http"
	"testing"

	"github.com/theplant/hsm-acem-survey-app/app/controllers"
	"github.com/theplant/hsm-acem-survey-app/app/models"
	"github.com/theplant/hsm-acem-survey-app/db"
	"github.com/theplant/hsm-acem-survey-app/test/utils"
)

func TestSurveysCreate(t *testing.T) {
	surveyData := defaultRequestSurveyData(t)

	req := prepareRequest(t, surveyData)
	res := doRequest(t, req)

	if res.StatusCode != http.StatusCreated {
		t.Fatalf("Unexpected status code: %d", res.StatusCode)
	}

	jsonData := jsonResponse(t, res)

	if jsonData["id"].(float64) <= 0 {
		t.Fatalf("Unexpected response: %v", jsonData)
	}

	answersData := jsonData["answers"].([]interface{})
	if len(answersData) == 0 {
		t.Fatalf("Unexpected response: %v", jsonData)
	}

	patientData := jsonData["patient"].(map[string]interface{})
	if len(patientData) == 0 {
		t.Fatalf("Unexpected response: %v", jsonData)
	}
}

func TestSurveysCreateWithInValidSurveyData(t *testing.T) {
	req := prepareRequest(t, nil)
	res := doRequest(t, req)

	if res.StatusCode != controllers.HTTPStatusUnprocessableEntity {
		t.Fatalf("Unexpected status code: %d", res.StatusCode)
	}
}

func TestSurveysCreateLogRequestHeader(t *testing.T) {
	surveyData := defaultRequestSurveyData(t)

	req := prepareRequest(t, surveyData)
	req.Header.Set("My-Custom-Header", "foobar")

	res := doRequest(t, req)

	if res.StatusCode != http.StatusCreated {
		t.Fatalf("Unexpected status code: %d", res.StatusCode)
	}

	jsonData := jsonResponse(t, res)

	survey := models.Survey{}
	utils.AssertNoErr(t, db.DB.Find(&survey, jsonData["id"].(float64)).Error)
	header := survey.RequestData["header"]

	if _, ok := header.(map[string]interface{})["My-Custom-Header"]; !ok {
		t.Fatalf("Unexpected request data: %v", survey.RequestData)
	}
}

func TestSurveysCreateLogRequestIP(t *testing.T) {
	surveyData := defaultRequestSurveyData(t)

	req := prepareRequest(t, surveyData)
	res := doRequest(t, req)

	if res.StatusCode != http.StatusCreated {
		t.Fatalf("Unexpected status code: %d", res.StatusCode)
	}

	jsonData := jsonResponse(t, res)

	survey := models.Survey{}
	utils.AssertNoErr(t, db.DB.Find(&survey, jsonData["id"].(float64)).Error)

	if survey.RequestData["ip"] == "" {
		t.Fatalf("Unexpected request data: %v", survey.RequestData)
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
