// Package utils provides useful helpers that using in test.
package utils

import (
	"testing"

	"github.com/HelloSundayMorning/hsm-acem-survey-app/db"
	"github.com/HelloSundayMorning/hsm-acem-survey-app/db/migrate"
)

// Reset the database when this package is used
func init() {
	migrate.ResetDB()
}

// AssertNoErr makes current test case fatal if it receives a non-nil error
func AssertNoErr(t *testing.T, err error) {
	if err != nil {
		t.Fatal(err)
	}
}

// Truncate removes all records in the given table
func Truncate(t *testing.T, table interface{}) {
	AssertNoErr(t, db.DB.Unscoped().Where("true").Delete(table).Error)
}
