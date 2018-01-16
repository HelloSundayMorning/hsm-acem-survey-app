package admin

import (
	"github.com/qor/admin"
	"github.com/qor/qor"

	"github.com/HelloSundayMorning/hsm-acem-survey-app/app/models"
	"github.com/HelloSundayMorning/hsm-acem-survey-app/config"
	"github.com/HelloSundayMorning/hsm-acem-survey-app/db"
)

// Auth is a struct that implement admin.Auth interface.
// It is required to setup a QOR admin.
type Auth struct{}

// LoginURL is required for implement admin.Auth interface.
// It is used for user login when GetCurrentUser return nil.
func (Auth) LoginURL(c *admin.Context) string {
	return "/sessions/new"
}

// LogoutURL is required for implement admin.Auth interface.
// It is used in QOR admin front-end for logout.
func (Auth) LogoutURL(c *admin.Context) string {
	return "/sessions/destroy"
}

// GetCurrentUser is required for implement admin.Auth interface.
// It is used to limit only admin user can login QOR admin.
func (Auth) GetCurrentUser(c *admin.Context) qor.CurrentUser {
	session, err := config.SessionStore.Get(c.Request, config.SessionKey)
	if err != nil || session.IsNew {
		return nil
	}

	var user models.User
	if err := db.DB.Where("id = ?", session.Values["user_id"]).First(&user).Error; err != nil || !user.IsAdmin() {
		return nil
	}
	return &user
}
