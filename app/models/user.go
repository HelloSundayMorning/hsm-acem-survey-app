// Package models contains all structs that is mapping from the database tables
package models

import (
	"errors"

	"github.com/asaskevich/govalidator"
	"github.com/jinzhu/gorm"
	"github.com/qor/qor/validations"
	"github.com/theplant/hsm-acem-survey-app/db"
	"golang.org/x/crypto/bcrypt"
)

const (
	// UserRoleAdmin is constant value represent the user role is admin
	UserRoleAdmin = "Admin"
)

var (
	// UserRoles contains all possiable role value of a user
	UserRoles = []string{UserRoleAdmin}
)

// User represent users table in database
type User struct {
	Base

	Email             string `sql:"not null;unique_index" json:"email"`
	Name              string `sql:"not null" json:"name"`
	Role              string `sql:"not null" sql:"default:''" json:"-"`
	Password          string `sql:"-" json:"-"`
	EncryptedPassword string `sql:"not null" json:"-"`
}

// BeforeSave is a hook function provided by gorm package. It is used to:
// - update user password
func (user *User) BeforeSave(db *gorm.DB) (err error) {
	if user.Password != "" {
		if err = user.setEncryptedPassword(); err != nil {
			return
		}
	}

	return
}

// Validate is a hook function provided by qor/validations package.
// It is used to generate validation error message for QOR admin.
func (user *User) Validate(db *gorm.DB) {
	if user.Email == "" {
		db.AddError(validations.NewError(user, "Email", "Email can't be blank"))
	} else if !govalidator.IsEmail(user.Email) {
		db.AddError(validations.NewError(user, "Email", "Email is invalid"))
	}

	if user.ID == 0 && user.Password == "" {
		db.AddError(validations.NewError(user, "Password", "Password can't be blank"))
	}

	if !isLegalRole(user.Role) {
		db.AddError(validations.NewError(user, "Role", "Role is invalid"))
	}
}

// DisplayName is required for implement qor.CurrentUser interface.
func (user User) DisplayName() string {
	return user.Email
}

// IsAdmin returns a bool value that represent user is admin or not.
func (user User) IsAdmin() bool {
	return user.Role == UserRoleAdmin
}

func isLegalRole(role string) bool {
	if role == "" {
		return true
	}
	for _, legalRole := range UserRoles {
		if role == legalRole {
			return true
		}
	}
	return false
}

func (user *User) setEncryptedPassword() error {
	pw, err := bcrypt.GenerateFromPassword([]byte(user.Password), 0)
	if err != nil {
		return err
	}
	user.EncryptedPassword = string(pw)
	user.Password = ""
	return nil
}

// ErrInvalidEmailOrPassword returns an error. It's using in
// models.UserAuthenticate function when authenticate failure.
var ErrInvalidEmailOrPassword = errors.New("invalid email or password")

// UserAuthenticate receives a email and a password. Then find the user
// with email in database and validate the password. And returns a user
// instance and an error.
func UserAuthenticate(email string, password string) (User, error) {
	var user User
	if err := db.DB.Where("email = ?", email).First(&user).Error; err != nil {
		if err == gorm.RecordNotFound {
			return user, ErrInvalidEmailOrPassword
		}
		return user, err
	}
	if err := bcrypt.CompareHashAndPassword([]byte(user.EncryptedPassword), []byte(password)); err != nil {
		return user, ErrInvalidEmailOrPassword
	}
	return user, nil
}
