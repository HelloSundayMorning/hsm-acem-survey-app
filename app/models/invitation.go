package models

import (
	"errors"
	"fmt"
	"log"
	"time"

	"github.com/jinzhu/gorm"
	"github.com/jinzhu/now"
	"github.com/theplant/hsm-acem-survey-app/db"
	"github.com/theplant/monitor"
)

// SendInvitationMails sends out invitation mail for for all users that
// registered the previous day, send request to Mandrill for immediate
// send of "Register to HSM" with the following Variable made available
// to the template (Score, Gender).
//
// Refer: https://trello.com/c/1b6YdgIt/21-cron-job-for-daybreak-invitations
func SendInvitationMails() error {
	surveys, err := PreviousSurveys(db.DB, time.Now())
	if err != nil {
		log.Printf("Error querying surveys for invitation: %v", err)
		monitor.CountError("invitation_delivery_error", 1, err)
		return err
	}

	errs := []error{}
	for _, survey := range surveys {
		err := survey.SendInvitationMail(db.DB)

		if err == nil && survey.InvitationMailError.Valid {
			err = errors.New(survey.InvitationMailError.String)
		}

		if err != nil {
			monitor.CountError("invitation_delivery_error", 1, err)

			errDetail := fmt.Errorf("Error delivering invitation to survey %d: %v", survey.ID, err)
			log.Println(errDetail)

			errs = append(errs, errDetail)
		} else {
			monitor.CountSimple("invitation_delivery", 1)
		}
	}

	if count := len(errs); count != 0 {
		return fmt.Errorf("len(errors) = %d, errors: %v", count, errs)
	}
	return nil
}

// PreviousSurveys returns surveys that haven't send out
// invitation mail and registered in previous days before
// the given day.
//
// It ignores surveys that
//   1. with no email address
//   2. sent mail
//   3. created after the given time
func PreviousSurveys(db *gorm.DB, today time.Time) (surveys []Survey, err error) {
	err = db.Where(`email <> '' AND invitation_mail_sent_at IS NULL AND created_at <= ?`, now.New(today).BeginningOfDay()).Find(&surveys).Error
	return
}
