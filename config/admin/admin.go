// Package admin is a configure file for QOR admin
package admin

import (
	"net/http"

	"github.com/qor/qor"
	"github.com/qor/qor/admin"
	"github.com/qor/qor/roles"

	"github.com/theplant/hsm-acem-survey-app/app/models"
	"github.com/theplant/hsm-acem-survey-app/db"
)

// Admin variable is a instance of QOR admin.
// It is used for mount to router outsize the package.
var Admin *admin.Admin

func init() {
	Admin = admin.New(&qor.Config{DB: db.DB})
	Admin.SetSiteName("HSM ACEM Survey App")
	Admin.SetAuth(Auth{})

	// Register roles "admin"
	roles.Register("admin", func(req *http.Request, currentUser qor.CurrentUser) bool {
		if currentUser != nil && currentUser.(*models.User).IsAdmin() {
			return true
		}
		return false
	})

	// Add Dashboard
	Admin.AddMenu(&admin.Menu{Name: "Dashboard", Link: "/admin"})

	// Add User
	user := Admin.AddResource(&models.User{})
	user.IndexAttrs("ID", "Email", "Role")
	user.EditAttrs("Email", "Role", "Password")
	user.NewAttrs("Email", "Role", "Password")
	user.Meta(&admin.Meta{Name: "Password", Label: "Password", Type: "password"})
	user.Meta(&admin.Meta{Name: "Role", Type: "select_one", Collection: func(resource interface{}, context *qor.Context) (results [][]string) {
		for _, role := range models.UserRoles {
			results = append(results, []string{role, role})
		}
		return
	}})

	// Add Survey
	survey := Admin.AddResource(&models.Survey{}, &admin.Config{Permission: roles.Deny(roles.Create, "admin").Deny(roles.Update, "admin")})
	survey.IndexAttrs("ID", "Interviewer", "Age", "Gender", "Postcode", "Email", "Mobile")
}
