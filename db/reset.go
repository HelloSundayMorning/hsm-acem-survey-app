// +build ignore

// Package main provides as an executable script used to reset database.
package main

import "github.com/HelloSundayMorning/hsm-acem-survey-app/db/migrate"

var tables = migrate.Tables

func main() {
	migrate.Truncate(tables...)
	migrate.AutoMigrate(tables...)
}
