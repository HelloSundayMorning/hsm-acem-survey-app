package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/sessions"
	"github.com/theplant/hsm-acem-survey-app/app/models"
	"github.com/theplant/hsm-acem-survey-app/config"
	"github.com/theplant/hsm-acem-survey-app/template"
)

// SessionsNew receives [GET] /sessions/new
func SessionsNew(ctx *gin.Context) {
	if value, ok := ctx.Get("current_user"); ok {
		user, _ := value.(models.User)
		ctx.Redirect(http.StatusSeeOther, getRedirectToByUser(user))
		return
	}

	template.Execute(ctx.Writer, "sessions/new", nil)
}

// SessionsCreate receives [POST] /sessions
func SessionsCreate(ctx *gin.Context) {
	var (
		email    = ctx.Request.FormValue("Email")
		password = ctx.Request.FormValue("Password")
	)

	user, err := models.UserAuthenticate(email, password)
	if err != nil {
		ctx.Status(http.StatusUnauthorized)
		template.Execute(ctx.Writer, "sessions/new", gin.H{
			"Email":    email,
			"Password": password,
			"Error":    err.Error(),
		})
		return
	}

	session, err := newSession(ctx.Request, &user)
	if err != nil {
		panic(err)
	}
	if err := session.Save(ctx.Request, ctx.Writer); err != nil {
		panic(err)
	}
	ctx.Redirect(http.StatusSeeOther, getRedirectToByUser(user))
	return
}

// SessionsDestroy receives [GET] /sessions/destroy
func SessionsDestroy(ctx *gin.Context) {
	if err := destroySession(ctx.Request, ctx.Writer); err != nil {
		panic(err)
	}
	ctx.Redirect(http.StatusSeeOther, "/")
}

func newSession(request *http.Request, user *models.User) (session *sessions.Session, err error) {
	session, err = config.SessionStore.Get(request, config.SessionKey)
	if err != nil {
		return
	}
	if user != nil {
		session.Values["user_id"] = user.ID
	}
	session.Options = &sessions.Options{
		Path: "/",
	}
	return
}

func destroySession(request *http.Request, writer http.ResponseWriter) error {
	session, err := config.SessionStore.Get(request, config.SessionKey)
	if err != nil {
		return err
	}

	if session.IsNew {
		return nil
	}

	session.Values = nil
	return session.Save(request, writer)
}

// Redirect to root path when logged user is no admin.
// This can avoid non-admin logged user loop redirection
// when visit /admin path.
func getRedirectToByUser(user models.User) string {
	if user.IsAdmin() {
		return "/admin"
	}
	return "/"
}
