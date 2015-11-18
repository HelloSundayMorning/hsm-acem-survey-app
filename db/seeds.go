// +build ignore

// Package main provides as an executable script used to generate seeds data for system used.
package main

import (
	"github.com/theplant/hsm-acem-survey-app/app/models"
	"github.com/theplant/hsm-acem-survey-app/db"
)

func main() {
	createAdmin()
}

func createAdmin() {
	user := models.User{Email: "acem-dev@theplant.jp", Role: models.UserRoleAdmin, Password: "test"}
	if err := db.DB.Create(&user).Error; err != nil {
		panic(err)
	}
}
