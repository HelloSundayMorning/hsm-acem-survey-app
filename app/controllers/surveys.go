package controllers

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/theplant/hsm-acem-survey-app/app/models"
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

func SurveysOptions(ctx *gin.Context) {
	ctx.Header("Access-Control-Allow-Origin", "http://localhost:8000")
	ctx.Header("Access-Control-Allow-Headers", "Content-type")
	ctx.AbortWithStatus(http.StatusOK)
}
