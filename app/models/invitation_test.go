package models_test

import (
	"database/sql"
	"testing"
	"time"

	"github.com/theplant/hsm-acem-survey-app/app/models"
	"github.com/theplant/hsm-acem-survey-app/db"
	u "github.com/theplant/hsm-acem-survey-app/test/utils"
)

func TestPreviousSurveys(t *testing.T) {
	u.Truncate(t, models.Survey{})

	pendingInvitationSurvey(t, 0)
	sentInvitationSurvey(t, 0)
	sentInvitationSurvey(t, -2)

	expectedSurveys := []*models.Survey{}
	expectedSurveys = append(expectedSurveys, pendingInvitationSurvey(t, -1))
	expectedSurveys = append(expectedSurveys, pendingInvitationSurvey(t, -3))

	surveys, err := models.PreviousSurveys(db.DB, time.Now())
	u.AssertNoErr(t, err)

	count := len(expectedSurveys)
	if len(surveys) != 2 {
		t.Fatalf("go %d surveys, but want 2", len(surveys))
	}

	// Default order is ID DESC.
	for i, s := range surveys {
		if got, want := s.ID, expectedSurveys[count-i-1].ID; got != want {
			t.Errorf("got survey ID %d, but want %d", got, want)
		}
	}
}

func TestPreviousSurveysReturnsSurveysWithEmail(t *testing.T) {
	u.Truncate(t, models.Survey{})

	expectedSurveys := []*models.Survey{}
	expectedSurveys = append(expectedSurveys, pendingInvitationSurvey(t, -1))
	createSurveyForInvitation(t, true, false, false, -1)

	surveys, err := models.PreviousSurveys(db.DB, time.Now())
	u.AssertNoErr(t, err)

	if got, want := len(surveys), 1; got != want {
		t.Fatalf("go unexpected surveys count: %d", got)
	}

	for _, s := range surveys {
		if s.Email == "" {
			t.Errorf("got unexpected survey.Email %v", s.Email)
		}
	}
}

func TestPreviousSurveysReturnsSurveysHaventSentInvitationMail(t *testing.T) {
	u.Truncate(t, models.Survey{})

	expectedSurveys := []*models.Survey{}
	expectedSurveys = append(expectedSurveys, pendingInvitationSurvey(t, -1))
	sentInvitationSurvey(t, -2)
	expectedSurveys = append(expectedSurveys, pendingInvitationSurvey(t, -3))

	surveys, err := models.PreviousSurveys(db.DB, time.Now())
	u.AssertNoErr(t, err)

	if got, want := len(surveys), 2; got != want {
		t.Fatalf("go unexpected surveys count: %d", got)
	}

	for _, s := range surveys {
		if s.InvitationMailSentAt != nil {
			t.Errorf("got unexpected survey.InvitationMailSentAt %v", s.InvitationMailSentAt)
		}
	}
}

func TestPreviousSurveysReturnsSurveysWithNoInvitationMailError(t *testing.T) {
	u.Truncate(t, models.Survey{})

	expectedSurveys := []*models.Survey{}
	expectedSurveys = append(expectedSurveys, pendingInvitationSurvey(t, -1))
	createSurveyForInvitation(t, false, false, true, -2)
	expectedSurveys = append(expectedSurveys, pendingInvitationSurvey(t, -3))

	surveys, err := models.PreviousSurveys(db.DB, time.Now())
	u.AssertNoErr(t, err)

	if got, want := len(surveys), 2; got != want {
		t.Fatalf("go unexpected surveys count: %d", got)
	}

	for _, s := range surveys {
		if s.InvitationMailError.Valid {
			t.Errorf("got unexpected survey.InvitationMailError: %v", s.InvitationMailError)
		}
	}
}

func TestSendInvitationMailsSuccess(t *testing.T) {
	u.Truncate(t, models.Survey{})
	u.SuccessMandrillConfigure()

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
	u.ErrorMandrillConfigure()

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
