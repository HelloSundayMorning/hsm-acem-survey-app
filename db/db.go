// Package db is a interface to access to database
package db

import (
	"fmt"

	// Using postgres sql driver
	_ "github.com/lib/pq"
	"github.com/qor/qor/validations"

	"github.com/jinzhu/gorm"
	"github.com/theplant/hsm-acem-survey-app/config"
)

var (
	// DB returns a gorm.DB interface, it is used to access to database
	DB *gorm.DB
)

func init() {
	var err error
	var db gorm.DB

	dbConfig := config.DB
	db, err = gorm.Open("postgres", fmt.Sprintf(dbConfig.Params))
	if err == nil {
		DB = &db
		DB.LogMode(dbConfig.Debug)
	} else {
		panic(err)
	}

	// Register callbacks from validations package, this is
	// required to using QOR admin validations
	// Reference: https://github.com/qor/qor/blob/master/validations/validation_test.go#L81
	validations.RegisterCallbacks(DB)
}
