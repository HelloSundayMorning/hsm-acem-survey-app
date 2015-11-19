package models

import (
	"errors"
	"fmt"
	"net/http"
	"strings"

	"github.com/jinzhu/gorm"
	"github.com/keighl/mandrill"
	"github.com/theplant/hsm-acem-survey-app/config"
	"github.com/theplant/hsm-acem-survey-app/serializer"
)

// Patient is survey's creator
type Patient struct {
	Age      uint   `sql:"not null;" json:"age" binding:"required"`
	Gender   string `sql:"not null;" json:"gender" binding:"required"`
	Postcode string `sql:"not null;" json:"postcode" binding:"required"`
	Email    string `json:"email"`
	Mobile   string `json:"mobile"`
}

// Survey stores all information that capture from survey result.
type Survey struct {
	Base

	Interviewer string `sql:"not null;" json:"interviewer" binding:"required"`
	Patient     `json:"patient" binding:"required"`
	Answers     serializer.JSONArray `sql:"type:json;not null;default:'[]'" json:"answers" binding:"required"`
	RequestData serializer.JSON      `sql:"type:json;not null;default:'{}'" json:"-"`
}

// AfterCreate a survey, it sends out completed email to patient automatically.
func (s *Survey) AfterCreate(db *gorm.DB) (err error) {
	go func() {
		err := s.SendCompletedMail()
		if err != nil {
			config.AirbrakeNotify(fmt.Errorf("send survey (%d) completed mail failed, error: %v", s.ID, err))
		}
	}()
	return
}

var (
	// ErrNoMandrillClient represents no mandrill client configuration.
	ErrNoMandrillClient = errors.New("no mandrill client")
	// ErrNoEmailAddress represents no email address as recipient.
	ErrNoEmailAddress = errors.New("no email address")
)

// SendCompletedMail sends mandrill email template `survey-completed` to survey's patient.
func (s Survey) SendCompletedMail() (err error) {
	if config.Mandrill.Client == nil {
		err = ErrNoMandrillClient
		return
	}

	email := s.Patient.Email
	if email == "" {
		err = ErrNoEmailAddress
		return
	}

	message := &mandrill.Message{}
	message.AddRecipient(email, email, "to")

	responses, err := config.Mandrill.Client.MessagesSendTemplate(message, config.Mandrill.SurveyCompletedTemplateSlug, nil)
	if err != nil {
		return
	}

	for _, resp := range responses {
		if resp.Status == "invalid" || resp.Status == "rejected" {
			err = fmt.Errorf("send email via mandrill api failed (%s) response: %#v", resp.Status, resp)
		}
	}
	return
}

func (s *Survey) SetRequestData(req *http.Request) (err error) {
	requestData := serializer.JSON{}
	requestData["header"] = req.Header
	requestData["ip"] = strings.Split(req.RemoteAddr, ":")[0]

	s.RequestData = requestData
	return
}
