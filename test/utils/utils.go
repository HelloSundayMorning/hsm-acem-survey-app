// Package utils provides useful helpers that using in test.
package utils

import (
	"testing"

	"github.com/keighl/mandrill"

	"github.com/theplant/hsm-acem-survey-app/config"
	"github.com/theplant/hsm-acem-survey-app/db"
	"github.com/theplant/hsm-acem-survey-app/db/migrate"
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

// SuccessMandrillConfigure configures a Mandrill client that always
// returns success when sending emails
func SuccessMandrillConfigure() {
	config.Mandrill.Set(mandrill.ClientWithKey("SANDBOX_SUCCESS"))
}

// ErrorMandrillConfigure configures a Mandrill client that always
// returns an error when sending emails
func ErrorMandrillConfigure() {
	config.Mandrill.Set(mandrill.ClientWithKey("SANDBOX_ERROR"))
}

// NilMandrillConfigure configures a nil Mandrill client so that any
// attempt to send an email will panic due to nil pointer
func NilMandrillConfigure() {
	config.Mandrill.Set(nil)
}
