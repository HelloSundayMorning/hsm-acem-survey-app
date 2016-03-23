package models

import (
	"fmt"
	"time"

	"github.com/jinzhu/gorm"
	"github.com/jinzhu/now"
	"github.com/theplant/hsm-acem-survey-app/db"
)

// SendInvitationMails sends out invitation mail for for all users that
// registered the previous day, send request to Mandrill for immediate
// send of "Register to HSM" with the following Variable made available
// to the template (Score, Gender).
//
// Refer: https://trello.com/c/1b6YdgIt/21-cron-job-for-daybreak-invitations
func SendInvitationMails() error {
	tx := db.DB.Begin()
	defer tx.Commit()

	surveys, err := PreviousSurveys(tx, time.Now())
	if err != nil {
		return err
	}

	errors := []error{}
	for _, survey := range surveys {
		err := survey.SendInvitationMail(tx)
		if err != nil {
			errors = append(errors, err)
		}
	}

	if len(errors) != 0 {
		return fmt.Errorf("%v", errors)
	}
	return nil
}

// PreviousSurveys returns surveys that haven't send out
// invitation mail and registered in previous days before
// the given day.
//
// It ignores surveys that with no email address or just
// created.
func PreviousSurveys(db *gorm.DB, today time.Time) (surveys []Survey, err error) {
	err = db.Where(`email <> '' AND invitation_mail_sent_at IS NULL AND created_at <= ?`, now.New(today).BeginningOfDay()).Find(&surveys).Error
	return
}
