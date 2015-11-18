package models

import "github.com/theplant/hsm-acem-survey-app/serializer"

type Patient struct {
	Base

	Age      uint   `sql:"not null;" json:"age" binding:"required"`
	Gender   string `sql:"not null;" json:"gender" binding:"required"`
	Postcode string `sql:"not null;" json:"postcode" binding:"required"`
	Email    string `json:"email"`
	Mobile   string `json:"mobile"`
}

type Survey struct {
	Base

	Interviewer string `sql:"not null;" json:"interviewer" binding:"required"`

	PatientID int     `sql:"not null;" json:"-"`
	Patient   Patient `json:"patient" binding:"required"`

	Answers serializer.JSONArray `sql:"type:json;not null;default:'[]'" json:"answers" binding:"required"`
}
