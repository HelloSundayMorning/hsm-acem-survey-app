// Package routes is a commen place to put all applicatioin routes.
// In order to easy setup routes for application and testing.
package routes

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/theplant/hsm-acem-survey-app/app/controllers"
	"github.com/theplant/hsm-acem-survey-app/config"
	"github.com/theplant/hsm-acem-survey-app/config/admin"
	"github.com/theplant/hsm-acem-survey-app/middleware"
)

// Mux returns a server mux that includes all application routes.
func Mux() *http.ServeMux {
	engine := gin.Default()
	engine.LoadHTMLGlob(config.AbsolutePath("app/views/**/*"))

	if config.Monitor != nil {
		engine.Use(middleware.OperationMonitor(config.Monitor))
	} else {
		log.Println("No Monitoring Client")
	}

	if config.Airbrake.Client != nil {
		engine.Use(middleware.Recover(config.Airbrake.Client))
	} else {
		log.Println("No Airbrake Client")
	}

	engine.OPTIONS("/surveys", controllers.SurveysOptions)
	engine.POST("/surveys", controllers.SurveysCreate)

	// Need to run SetCurrentUser middleware for QOR admin
	engine.Group("/admin", controllers.SetCurrentUser)

	sessions := engine.Group("/sessions", controllers.SetCurrentUser)
	sessions.GET("/new", controllers.SessionsNew)
	sessions.POST("/", controllers.SessionsCreate)
	sessions.GET("/destroy", controllers.SessionsDestroy)

	mux := http.NewServeMux()
	mux.Handle("/", engine)
	admin.Admin.MountTo("/admin", mux)

	return mux
}
