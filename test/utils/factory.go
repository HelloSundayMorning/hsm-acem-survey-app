// Package utils provides useful helpers that using in test.
package utils

import (
	"fmt"
	"testing"
	"time"

	"github.com/HelloSundayMorning/hsm-acem-survey-app/app/models"
	"github.com/HelloSundayMorning/hsm-acem-survey-app/db"
	randomdata "github.com/Pallinder/go-randomdata"
)

const (
	// UserPassword is a common password. It is used to generate fake user.
	UserPassword = "test"
)

// NewUser returns a User instance.
func NewUser() (user *models.User) {
	user = &models.User{
		Email:    fmt.Sprintf("%s-%v@gmail.com", randomdata.SillyName(), time.Now().UnixNano()),
		Name:     randomdata.SillyName(),
		Password: UserPassword,
	}
	return
}

// NewAdminUser returns an admin User instance.
func NewAdminUser() (user *models.User) {
	user = NewUser()

	user.Role = models.UserRoleAdmin

	return
}

// CreateUser returns a user that existing in database.
func CreateUser(t *testing.T) (user *models.User) {
	user = NewUser()

	AssertNoErr(t, db.DB.Create(user).Error)

	return
}

// CreateAdminUser returns an admin user that existing in database.
func CreateAdminUser(t *testing.T) (user *models.User) {
	user = NewAdminUser()

	AssertNoErr(t, db.DB.Create(user).Error)

	return
}
