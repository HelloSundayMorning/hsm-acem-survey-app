// Package controllers contains middlewares and controller actions.
package controllers

import (
	"regexp"

	"github.com/gin-gonic/gin"
	"github.com/theplant/hsm-acem-survey-app/app/models"
	"github.com/theplant/hsm-acem-survey-app/config"
	"github.com/theplant/hsm-acem-survey-app/db"
)

var regexpID = regexp.MustCompile(`\d+`)

// SetCurrentUser middleware sets up a current_user instance in current context.
func SetCurrentUser(ctx *gin.Context) {
	s, err := config.SessionStore.Get(ctx.Request, config.SessionKey)
	if err != nil || s.IsNew {
		return
	}

	var user models.User
	if err := db.DB.Where("id = ?", s.Values["user_id"]).First(&user).Error; err != nil {
		return
	}
	ctx.Set("current_user", user)
}
