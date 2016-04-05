package models_test

import (
	"database/sql"
	"strings"
	"testing"
	"time"

	"github.com/theplant/hsm-acem-survey-app/app/models"
	"github.com/theplant/hsm-acem-survey-app/db"
	mu "github.com/theplant/hsm-acem-survey-app/mandrill/utils"
	u "github.com/theplant/hsm-acem-survey-app/test/utils"
)

func TestPreviousSurveys(t *testing.T) {
	u.Truncate(t, models.Survey{})

	surveyCreatedToday := pendingInvitationSurvey(t, 0)
	surveySentInvitation := sentInvitationSurvey(t, -1)
	surveyPendingInvitationOne := pendingInvitationSurvey(t, -1)
	surveyWithNoEmail := createSurveyForInvitation(t, true, false, false, -1)
	surveyPendingInvitationTwo := pendingInvitationSurvey(t, -2)

	expectedSurveys := []*models.Survey{}
	expectedSurveys = append(expectedSurveys, surveyPendingInvitationOne)
	expectedSurveys = append(expectedSurveys, surveyPendingInvitationTwo)

	surveys, err := models.PreviousSurveys(db.DB, time.Now())
	u.AssertNoErr(t, err)

	count := len(expectedSurveys)
	if got, want := len(surveys), count; got != want {
		t.Fatalf("got %d of surveys, but want %d", got, want)
	}

	for i, s := range surveys {
		// Default order is ID DESC.
		if got, want := s.ID, expectedSurveys[count-i-1].ID; got != want {
			t.Errorf("got survey ID %d, but want %d", got, want)
		}

		if s.ID == surveyCreatedToday.ID {
			t.Errorf("got unexpected survey (%d) that created today.", s.ID)
		}

		if s.ID == surveySentInvitation.ID {
			t.Errorf("got unexpected survey (%d) that sent invitation mail.", s.ID)
		}

		if s.ID == surveyWithNoEmail.ID {
			t.Errorf("got unexpected survey (%d) with no email.", s.ID)
		}
	}
}

func TestSendInvitationMailsSuccess(t *testing.T) {
	u.Truncate(t, models.Survey{})
	mu.SuccessMandrillConfigure()

	pendingInvitationSurvey(t, 0)
	pendingInvitationSurvey(t, -1)
	pendingInvitationSurvey(t, -2)

	surveys, err := models.PreviousSurveys(db.DB, time.Now())
	u.AssertNoErr(t, err)

	if got, want := len(surveys), 2; got != want {
		t.Fatalf("Expected %d of surveys, but got %d", want, got)
	}
	u.AssertNoErr(t, models.SendInvitationMails())

	surveysAfterSent, err := models.PreviousSurveys(db.DB, time.Now())
	u.AssertNoErr(t, err)

	if len(surveysAfterSent) != 0 {
		t.Fatalf("Expected 0 pending surveys, but got %d", len(surveysAfterSent))
	}
}

func TestSendInvitationMailsFailure(t *testing.T) {
	u.Truncate(t, models.Survey{})
	mu.ErrorMandrillConfigure()

	pendingInvitationSurvey(t, 0)
	pendingInvitationSurvey(t, -1)
	pendingInvitationSurvey(t, -2)

	surveys, err := models.PreviousSurveys(db.DB, time.Now())
	u.AssertNoErr(t, err)

	if got, want := len(surveys), 2; got != want {
		t.Fatalf("Expected %d of surveys, but got %d", want, got)
	}

	if err := models.SendInvitationMails(); err == nil || !strings.Contains(err.Error(), "len(errors) = 2") {
		t.Fatalf("Expected send invitation mails failure with 2 errors, but got unexpected error: %v", err)
	}

	surveysAfterSent, err := models.PreviousSurveys(db.DB, time.Now())
	u.AssertNoErr(t, err)

	if len(surveysAfterSent) != 0 {
		t.Fatalf("Expected 0 pending surveys, but got %d", len(surveysAfterSent))
	}

	var surveysWithError []models.Survey
	u.AssertNoErr(t, db.DB.Where("invitation_mail_error IS NOT NULL").Find(&surveysWithError).Error)
	if got, want := len(surveysWithError), 2; got != want {
		t.Fatalf("Expected %d of surveys with invitation_mail_error, but got %d", want, got)
	}
}

func pendingInvitationSurvey(t *testing.T, offsetDays int) (survey *models.Survey) {
	return createSurveyForInvitation(t, false, false, false, offsetDays)
}

func sentInvitationSurvey(t *testing.T, offsetDays int) (survey *models.Survey) {
	return createSurveyForInvitation(t, false, true, false, offsetDays)
}

func createSurveyForInvitation(t *testing.T, withoutEmail bool, sentInvitationMail bool, withError bool, offsetDays int) (survey *models.Survey) {
	survey = createSurvey(t)

	previousTime := time.Now().AddDate(0, 0, offsetDays)
	survey.CreatedAt = previousTime

	if withoutEmail {
		survey.Email = ""
	}

	if sentInvitationMail {
		survey.InvitationMailSentAt = &previousTime
	}

	if withError {
		survey.InvitationMailError = sql.NullString{String: "invalidation mail error", Valid: true}
	}

	u.AssertNoErr(t, db.DB.Save(survey).Error)

	return
}
