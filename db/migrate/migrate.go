// Package migrate provides useful helpers for migration used.
package migrate

import (
	"github.com/theplant/hsm-acem-survey-app/app/models"
	"github.com/theplant/hsm-acem-survey-app/db"
)

// Tables returns a slice of all tables.
var Tables = []interface{}{
	&models.User{},
	&models.Survey{},
	&models.Patient{},
}

func init() {
	AutoMigrate(Tables...)
}

// ResetDB function will truncate and auto migrate all the tables that listed `migrate.Tables`.
func ResetDB() {
	Truncate(Tables...)
	AutoMigrate(Tables...)
}

// AutoMigrate receives table arguments and create or update their table structure in database.
func AutoMigrate(tables ...interface{}) {
	for _, table := range tables {
		db.DB.AutoMigrate(table)
	}
}

// Truncate receives table arguments and truncate their content in database.
func Truncate(tables ...interface{}) {
	for _, table := range tables {
		if err := db.DB.DropTableIfExists(table).Error; err != nil {
			panic(err)
		}
	}
}
