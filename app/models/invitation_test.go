package models_test

import (
	"testing"
	"time"

	"github.com/theplant/hsm-acem-survey-app/app/models"
	"github.com/theplant/hsm-acem-survey-app/db"
	u "github.com/theplant/hsm-acem-survey-app/test/utils"
)

func TestPreviousSurveys(t *testing.T) {
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
	expectedSurveys := []*models.Survey{}
	expectedSurveys = append(expectedSurveys, pendingInvitationSurvey(t, -1))
	createSurveyForInvitation(t, true, false, -1)

	surveys, err := models.PreviousSurveys(db.DB, time.Now())
	u.AssertNoErr(t, err)

	for _, s := range surveys {
		if s.Email == "" {
			t.Errorf("got unexpected survey.Email %v", s.Email)
		}
	}
}

func TestPreviousSurveysReturnsSurveysHaventSentInvitationMail(t *testing.T) {
	expectedSurveys := []*models.Survey{}
	expectedSurveys = append(expectedSurveys, pendingInvitationSurvey(t, -1))
	sentInvitationSurvey(t, -2)
	expectedSurveys = append(expectedSurveys, pendingInvitationSurvey(t, -3))

	surveys, err := models.PreviousSurveys(db.DB, time.Now())
	u.AssertNoErr(t, err)

	for _, s := range surveys {
		if s.InvitationMailSentAt != nil {
			t.Errorf("got unexpected survey.InvitationMailSentAt %v", s.InvitationMailSentAt)
		}
	}
}

func TestSendInvitationMailsSuccess(t *testing.T) {
	u.SuccessMandrillConfigure()

	pendingInvitationSurvey(t, 0)
	pendingInvitationSurvey(t, -1)
	pendingInvitationSurvey(t, -2)

	surveys, err := models.PreviousSurveys(db.DB, time.Now())
	u.AssertNoErr(t, err)

	if len(surveys) == 0 {
		t.Fatalf("Expected 2 of surveys, but got %d", len(surveys))
	}

	err = models.SendInvitationMails()
	if err != nil {
		t.Fatalf("Unexpected error: %v", err)
	}

	surveysAfterSent, err := models.PreviousSurveys(db.DB, time.Now())
	u.AssertNoErr(t, err)

	if len(surveysAfterSent) != 0 {
		t.Fatalf("Expected 0 pending surveys, but got %d", len(surveysAfterSent))
	}
}

func TestSendInvitationMailsFailure(t *testing.T) {
	u.ErrorMandrillConfigure()

	pendingInvitationSurvey(t, 0)
	pendingInvitationSurvey(t, -1)
	pendingInvitationSurvey(t, -2)

	surveys, err := models.PreviousSurveys(db.DB, time.Now())
	u.AssertNoErr(t, err)

	if len(surveys) == 0 {
		t.Fatalf("Expected 2 of surveys, but got %d", len(surveys))
	}

	err = models.SendInvitationMails()
	if err == nil {
		t.Fatal("Expected sent mail failure, but it sent out successfully")
	}

	surveysAfterSent, err := models.PreviousSurveys(db.DB, time.Now())
	u.AssertNoErr(t, err)

	if len(surveysAfterSent) != 2 {
		t.Fatalf("Expected 2 pending surveys, but got %d", len(surveysAfterSent))
	}
}

func pendingInvitationSurvey(t *testing.T, offsetDays int) (survey *models.Survey) {
	return createSurveyForInvitation(t, false, false, offsetDays)
}

func sentInvitationSurvey(t *testing.T, offsetDays int) (survey *models.Survey) {
	return createSurveyForInvitation(t, false, true, offsetDays)
}

func createSurveyForInvitation(t *testing.T, withoutEmail bool, sentInvitationMail bool, offsetDays int) (survey *models.Survey) {
	survey = createSurvey(t)

	previousTime := time.Now().AddDate(0, 0, offsetDays)
	survey.CreatedAt = previousTime

	if withoutEmail {
		survey.Email = ""
	}

	if sentInvitationMail {
		survey.InvitationMailSentAt = &previousTime
	}
	u.AssertNoErr(t, db.DB.Save(survey).Error)

	return
}
