package controllers_test

import (
	"bufio"
	"bytes"
	"encoding/json"
	"io"
	"net/http"
	"testing"

	"github.com/HelloSundayMorning/hsm-acem-survey-app/app/controllers"
	"github.com/HelloSundayMorning/hsm-acem-survey-app/app/models"
	"github.com/HelloSundayMorning/hsm-acem-survey-app/db"
	mu "github.com/HelloSundayMorning/hsm-acem-survey-app/mandrill/utils"
	u "github.com/HelloSundayMorning/hsm-acem-survey-app/test/utils"
	au "github.com/theplant/airbraker/utils"
)

func TestSurveysCreate(t *testing.T) {
	surveyData := defaultRequestSurveyData(t)

	req := prepareSurveyRequest(t, surveyData)
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
	req := prepareSurveyRequest(t, nil)
	res := doRequest(t, req)

	if res.StatusCode != controllers.HTTPStatusUnprocessableEntity {
		t.Fatalf("Unexpected status code: %d", res.StatusCode)
	}
}

func TestSurveysCreateLogRequestHeader(t *testing.T) {
	surveyData := defaultRequestSurveyData(t)

	req := prepareSurveyRequest(t, surveyData)
	req.Header.Set("My-Custom-Header", "foobar")

	res := doRequest(t, req)

	if res.StatusCode != http.StatusCreated {
		t.Fatalf("Unexpected status code: %d", res.StatusCode)
	}

	jsonData := jsonResponse(t, res)

	survey := models.Survey{}

	// Why `Last` and not `First`?
	// Because the `First` with id return the wrong record
	u.AssertNoErr(t, db.DB.Last(&survey).Error)
	surveyID := jsonData["id"].(float64)
	if survey.ID != uint(surveyID) {
		t.Fatalf("Unexpected survey data: %+v", survey)
	}

	header := survey.RequestData["header"]

	if _, ok := header.(map[string]interface{})["My-Custom-Header"]; !ok {
		t.Fatalf("Unexpected request data: %v", survey.RequestData)
	}
}

func TestSurveysCreateLogRequestIP(t *testing.T) {
	surveyData := defaultRequestSurveyData(t)

	req := prepareSurveyRequest(t, surveyData)
	res := doRequest(t, req)

	if res.StatusCode != http.StatusCreated {
		t.Fatalf("Unexpected status code: %d", res.StatusCode)
	}

	jsonData := jsonResponse(t, res)

	survey := models.Survey{}
	u.AssertNoErr(t, db.DB.Find(&survey, jsonData["id"].(float64)).Error)

	if survey.RequestData["ip"] == "" {
		t.Fatalf("Unexpected request data: %v", survey.RequestData)
	}
}

func TestSendEmail(t *testing.T) {
	mu.SuccessMandrillConfigure()

	req := prepareEmailRequest(t, emailParams())
	res := doRequest(t, req)

	if res.StatusCode != http.StatusAccepted {
		t.Fatalf("Unexpected status code: %d", res.StatusCode)
	}
}

func TestSendEmailWithZeroParams(t *testing.T) {
	mu.SuccessMandrillConfigure()

	params := emailParams()
	zero := uint(0)
	params.SurveyScore = &zero
	params.PopulationPercentage = &zero

	req := prepareEmailRequest(t, params)
	res := doRequest(t, req)

	if res.StatusCode != http.StatusAccepted {
		t.Fatalf("Unexpected status code: %d", res.StatusCode)
	}
}

func TestSendEmailInvalidParams(t *testing.T) {
	mu.NilMandrillConfigure()

	req := prepareEmailRequest(t, nil)
	res := doRequest(t, req)

	// FIXME check no email was sent

	if res.StatusCode != controllers.HTTPStatusUnprocessableEntity {
		t.Fatalf("Unexpected status code: %d", res.StatusCode)
	}
}

func TestSendEmailFailingMandrill(t *testing.T) {
	mu.ErrorMandrillConfigure()
	au.ClearBuffer(notifier)

	req := prepareEmailRequest(t, emailParams())
	res := doRequest(t, req)

	if res.StatusCode != http.StatusAccepted {
		t.Fatalf("Unexpected status code: %d", res.StatusCode)
	}

	if !au.AssertNotice(notifier, "SANDBOX_ERROR") {
		t.Fatal("Expected logging into Airbrake, but it doesn't.")
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

func TestSendFeedbackMail(t *testing.T) {
	mu.SuccessMandrillConfigure()

	req := prepareFeedbackRequest(t, feedbackMailParams())
	res := doRequest(t, req)

	if res.StatusCode != http.StatusAccepted {
		t.Fatalf("Unexpected status code: %d", res.StatusCode)
	}
}

func TestSendFeedbackMailInvalidParams(t *testing.T) {
	mu.NilMandrillConfigure()

	req := prepareFeedbackRequest(t, nil)
	res := doRequest(t, req)

	// FIXME check no email was sent

	if res.StatusCode != controllers.HTTPStatusUnprocessableEntity {
		t.Fatalf("Unexpected status code: %d", res.StatusCode)
	}
}

func TestSendFeedbackMailFailingMandrill(t *testing.T) {
	mu.ErrorMandrillConfigure()
	au.ClearBuffer(notifier)

	req := prepareFeedbackRequest(t, feedbackMailParams())
	res := doRequest(t, req)

	if res.StatusCode != http.StatusAccepted {
		t.Fatalf("Unexpected status code: %d", res.StatusCode)
	}

	if !au.AssertNotice(notifier, "SANDBOX_ERROR") {
		t.Fatal("Expected logging into Airbrake, but it doesn't.")
	}
}

func feedbackMailParams() models.FeedbackMailTemplate {
	return models.FeedbackMailTemplate{
		Emails:   []string{"test@example.com"},
		Template: "feedback",
		FreeText: "Put feedback as free text here.",
	}
}

func prepareSurveyRequest(t *testing.T, data interface{}) *http.Request {
	return prepareRequest(t, data, "/surveys")
}

func prepareEmailRequest(t *testing.T, data interface{}) *http.Request {
	return prepareRequest(t, data, "/surveys/email")
}

func prepareFeedbackRequest(t *testing.T, data interface{}) *http.Request {
	return prepareRequest(t, data, "/surveys/feedback")
}

func prepareRequest(t *testing.T, data interface{}, path string) *http.Request {
	jsonData, err := json.Marshal(data)
	u.AssertNoErr(t, err)

	req, err := http.NewRequest("POST", server.URL+path, bytes.NewBuffer(jsonData))
	u.AssertNoErr(t, err)

	req.Header.Set("Content-Type", "application/json")
	return req
}

func doRequest(t *testing.T, req *http.Request) *http.Response {
	client := http.Client{}
	res, err := client.Do(req)
	u.AssertNoErr(t, err)

	return res
}

func jsonResponse(t *testing.T, res *http.Response) map[string]interface{} {
	var s map[string]interface{}
	bytes, err := bufio.NewReader(res.Body).ReadBytes(0)
	if err != io.EOF {
		u.AssertNoErr(t, err)
	}

	err = json.Unmarshal(bytes, &s)
	u.AssertNoErr(t, err)
	return s
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
	u.AssertNoErr(t, err)

	return
}
