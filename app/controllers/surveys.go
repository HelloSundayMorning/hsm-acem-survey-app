package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/theplant/hsm-acem-survey-app/app/models"
	"github.com/theplant/hsm-acem-survey-app/db"
)

// HTTPStatusUnprocessableEntity represents unprocesable entity http status
const HTTPStatusUnprocessableEntity = 422

// SurveysCreate receives survey result data and store them
// into database.
func SurveysCreate(ctx *gin.Context) {
	survey := models.Survey{}
	if ctx.BindJSON(&survey) != nil {
		ctx.JSON(HTTPStatusUnprocessableEntity, gin.H{"error": `Missing required attributes.`})
		return
	}

	err := db.DB.Create(&survey).Error
	if err != nil {
		panic(err)
	}

	ctx.JSON(http.StatusCreated, survey)
}
