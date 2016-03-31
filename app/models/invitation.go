package models

import (
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
	tx := db.DB.Begin()
	defer tx.Commit()

	surveys, err := PreviousSurveys(tx, time.Now())
	if err != nil {
		log.Printf("Error querying surveys for invitation: %v", err)
		monitor.Count("invitation_delivery_error", 1, map[string]string{"error": err.Error()})
		return err
	}

	errors := []error{}
	for _, survey := range surveys {
		err := survey.SendInvitationMail(tx)

		logData := map[string]string{}
		logData["survey_id"] = fmt.Sprintf("%d", survey.ID)
		logData["email"] = survey.Email

		if err != nil {
			logData["error"] = err.Error()
			monitor.Count("invitation_delivery_error", 1, logData)

			errDetail := fmt.Errorf("Error delivering invitation to survey %d (%q): %v", survey.ID, survey.Email, err)
			log.Println(errDetail)

			errors = append(errors, errDetail)
		} else {
			monitor.Count("invitation_delivery", 1, logData)
		}
	}

	if len(errors) != 0 {
		return fmt.Errorf("len(errors) = %d, errors: %v", len(errors), errors)
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
