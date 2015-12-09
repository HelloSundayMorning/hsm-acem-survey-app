package controllers

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"

	"github.com/theplant/hsm-acem-survey-app/app/models"
	"github.com/theplant/hsm-acem-survey-app/config"
	"github.com/theplant/hsm-acem-survey-app/db"
)

// HTTPStatusUnprocessableEntity represents unprocesable entity http status
const HTTPStatusUnprocessableEntity = 422

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

// EmailSurvey accepts email survey template data, responds with 202
// Accepted, and spawns a goroutine to send an email via Mandrill
func EmailSurvey(ctx *gin.Context) {
	ctx.Header("Access-Control-Allow-Origin", "http://localhost:8000")
	ctx.Header("Access-Control-Allow-Headers", "Content-type")

	template := models.EmailTemplate{}

	if err := ctx.BindJSON(&template); err != nil {
		ctx.AbortWithStatus(HTTPStatusUnprocessableEntity)
		return
	}

	go func() {
		err := models.SendCompletedMail(template)
		if err != nil {
			config.AirbrakeNotify(fmt.Errorf("send survey completed mail failed, error: %v", err))
		}
	}()

	ctx.AbortWithStatus(http.StatusAccepted)
}

// SurveysOptions returns headers to allow JS applications to talk to
// the API directly via fetch/XHR requests.
func SurveysOptions(ctx *gin.Context) {
	ctx.Header("Access-Control-Allow-Origin", "http://localhost:8000")
	ctx.Header("Access-Control-Allow-Headers", "Content-type")
	ctx.AbortWithStatus(http.StatusOK)
}
