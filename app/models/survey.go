package models

import (
	"database/sql"
	"net/http"
	"time"

	"github.com/HelloSundayMorning/hsm-acem-survey-app/serializer"
	"github.com/jinzhu/gorm"
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

	// Datetime of invalidation mail sent
	InvitationMailSentAt *time.Time     `sql:"index" json:"-"`
	InvitationMailError  sql.NullString `json:"-"`
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

// Score returns total score of survey.
func (s *Survey) Score() (score uint) {
	for _, a := range s.Answers {
		switch t := a["answer"].(map[string]interface{})["score"].(type) {
		case int: // FIXME score came from models_test.newSurvey test case is int type
			score = score + uint(t)
		case float64:
			score = score + uint(t)
		}
	}
	return
}

// SendInvitationMail sends out invalidation mail and
//   * logs the time of invalidation mail is sent
//   * logs the sending error if send mail failure
//
// It returns a database error.
func (s *Survey) SendInvitationMail(db *gorm.DB) error {
	score := s.Score()
	t := InvitationMailTemplate{
		Template:    InvitationTemplate,
		Email:       s.Email,
		Gender:      s.Gender,
		SurveyScore: &score,
	}

	now := time.Now()
	s.InvitationMailSentAt = &now

	err := SendInvitationMail(t)
	if err != nil {
		s.InvitationMailError = sql.NullString{String: err.Error(), Valid: true}
	}

	return db.Save(s).Error
}
