// Package routes is a commen place to put all applicatioin routes.
// In order to easy setup routes for application and testing.
package routes

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/theplant/airbraker"
	"github.com/theplant/hsm-acem-survey-app/app/controllers"
	"github.com/theplant/hsm-acem-survey-app/config"
	"github.com/theplant/hsm-acem-survey-app/config/admin"
	"github.com/theplant/monitor"
)

// Mux returns a server mux that includes all application routes.
func Mux() *http.ServeMux {
	engine := gin.Default()
	engine.LoadHTMLGlob(config.AbsolutePath("app/views/**/*"))

	engine.Use(monitor.OperationMonitor())

	engine.Use(airbraker.Recover())

	engine.OPTIONS("/surveys", controllers.SurveysOptions)
	engine.POST("/surveys", controllers.SurveysCreate)
	engine.OPTIONS("/surveys/email", controllers.SurveysOptions)
	engine.POST("/surveys/email", controllers.EmailSurvey)
	engine.OPTIONS("/surveys/feedback", controllers.SurveysOptions)
	engine.POST("/surveys/feedback", controllers.FeedbackSurvey)

	// Need to run SetCurrentUser middleware for QOR admin
	engine.Group("/admin", controllers.SetCurrentUser)

	sessions := engine.Group("/sessions", controllers.SetCurrentUser)
	sessions.GET("/new", controllers.SessionsNew)
	sessions.POST("/", controllers.SessionsCreate)
	sessions.GET("/destroy", controllers.SessionsDestroy)

	engine.GET("/leaderboard", controllers.Leaderboard)

	mux := http.NewServeMux()
	mux.Handle("/", engine)
	admin.Admin.MountTo("/admin", mux)

	return mux
}
