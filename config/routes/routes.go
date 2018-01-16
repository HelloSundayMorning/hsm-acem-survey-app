// Package routes is a commen place to put all applicatioin routes.
// In order to easy setup routes for application and testing.
package routes

import (
	"log"
	"net/http"
	"strings"

	"github.com/HelloSundayMorning/hsm-acem-survey-app/app/controllers"
	"github.com/HelloSundayMorning/hsm-acem-survey-app/config"
	"github.com/HelloSundayMorning/hsm-acem-survey-app/config/admin"
	"github.com/gin-gonic/gin"
	"github.com/theplant/airbraker"
	"github.com/theplant/monitor"

	// Initialise the asset manifest and template handler
	_ "github.com/HelloSundayMorning/hsm-acem-survey-app/assets"
)

// Mux returns a server mux that includes all application routes.
func Mux() *http.ServeMux {
	engine := gin.Default()

	engine.GET("/info", func(c *gin.Context) {
		c.Redirect(http.StatusMovedPermanently, "/")
	})

	engine.GET("/audit", func(c *gin.Context) {
		c.Redirect(http.StatusMovedPermanently, "/")
	})

	engine.GET("/feedback", func(c *gin.Context) {
		c.Redirect(http.StatusMovedPermanently, "/")
	})

	engine.GET("/frames", func(c *gin.Context) {
		c.Redirect(http.StatusMovedPermanently, "/")
	})

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

	engine.GET("/leaderboards", controllers.Leaderboard)

	mux := http.NewServeMux()

	if config.ServeStaticAssets {
		assetDir := http.Dir(strings.Join([]string{config.Root, "public"}, "/"))
		log.Printf("Serving static assets from %s at /assets", assetDir)
		mux.Handle("/assets/", http.FileServer(assetDir))
	}

	mux.Handle("/", engine)
	admin.Admin.MountTo("/admin", mux)

	return mux
}
