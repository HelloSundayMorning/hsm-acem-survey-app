package models

import (
	"net/http"

	"github.com/theplant/hsm-acem-survey-app/serializer"
)

// Patient is a part of a survey.
type Patient struct {
	Age      uint   `sql:"not null;" json:"age" binding:"required"`
	Gender   string `sql:"not null;" json:"gender" binding:"required"`
	Postcode string `sql:"not null;" json:"postcode" binding:"required"`
	Email    string `json:"email"`
	Mobile   string `json:"mobile"`
}

// Survey stores all information about a survey. In incldues
// patient information, survey results and http request information.
type Survey struct {
	Base

	Interviewer string `sql:"not null;" json:"interviewer" binding:"required"`
	Location    string `sql:"not null;" json:"location" binding:"required"`
	Evaluation  string `json:"evaluation" binding:"required"`
	Patient     `json:"patient" binding:"required"`
	Answers     serializer.JSONArray `sql:"type:json;not null;default:'[]'" json:"answers" binding:"required"`
	RequestData serializer.JSON      `sql:"type:json;not null;default:'{}'" json:"-"`
}

// SetRequestData exchange the http request header and ip information
// to json format and pass to survey.RequestData.
func (s *Survey) SetRequestData(req *http.Request) {
	requestData := serializer.JSON{}
	requestData["header"] = req.Header
	requestData["ip"] = req.RemoteAddr

	s.RequestData = requestData
	return
}
