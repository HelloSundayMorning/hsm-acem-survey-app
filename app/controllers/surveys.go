package controllers

import (
	"errors"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/keighl/mandrill"

	"github.com/theplant/hsm-acem-survey-app/app/models"
	"github.com/theplant/hsm-acem-survey-app/config"
	"github.com/theplant/hsm-acem-survey-app/db"
)

// HTTPStatusUnprocessableEntity represents unprocesable entity http status
const HTTPStatusUnprocessableEntity = 422

var (
	// ErrNoEmailAddress represents no email address as recipient.
	ErrNoEmailAddress = errors.New("no email address")
)

// SurveysCreate captures a survey results and email the survey's patient.
func SurveysCreate(ctx *gin.Context) {
	survey := models.Survey{}

	ctx.Header("Access-Control-Allow-Origin", "http://localhost:8000")
	ctx.Header("Access-Control-Allow-Headers", "Content-type")

	if err := ctx.BindJSON(&survey); err != nil {
		//		ctx.JSON(HTTPStatusUnprocessableEntity, gin.H{"error": `Missing required attributes.`})
		fmt.Println(err)
		ctx.String(HTTPStatusUnprocessableEntity, err.Error())
		return
	}

	// Log http request header and ip information
	survey.SetRequestData(ctx.Request)

	err := db.DB.Create(&survey).Error
	if err != nil {
		panic(err)
	}

	ctx.JSON(http.StatusCreated, survey)

}

type emailTemplate struct {
	Email          string `binding:"required"`
	Template       string `binding:"required"`
	FrequencyChart string `binding:"required"`
	AuditChart     string `binding:"required"`
	RiskChart      string `binding:"required"`
}

func EmailSurvey(ctx *gin.Context) {
	ctx.Header("Access-Control-Allow-Origin", "http://localhost:8000")
	ctx.Header("Access-Control-Allow-Headers", "Content-type")

	template := emailTemplate{}

	if err := ctx.BindJSON(&template); err != nil {
		fmt.Println(err)
		ctx.AbortWithStatus(HTTPStatusUnprocessableEntity)
		return
	}

	go func() {
		err := SendCompletedMail(template)
		if err != nil {
			config.AirbrakeNotify(fmt.Errorf("send survey completed mail failed, error: %v", err))
		}
	}()

	ctx.AbortWithStatus(http.StatusAccepted)
}

func SurveysOptions(ctx *gin.Context) {
	ctx.Header("Access-Control-Allow-Origin", "http://localhost:8000")
	ctx.Header("Access-Control-Allow-Headers", "Content-type")
	ctx.AbortWithStatus(http.StatusOK)
}

// SendCompletedMail sends survey completed mail to the survey's patient.
func SendCompletedMail(t emailTemplate) (err error) {
	if t.Email == "" {
		return ErrNoEmailAddress
	}

	message := mandrill.Message{}
	message.AddRecipient(t.Email, t.Email, "to")

	data := map[string]string{
		"frequency-chart": t.FrequencyChart,
		"risk-chart":      t.RiskChart,
		"audit-chart":     t.AuditChart,
	}

	fmt.Println(data)

	responses, err := config.Mandrill.Client.MessagesSendTemplate(&message, t.Template, data)
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
