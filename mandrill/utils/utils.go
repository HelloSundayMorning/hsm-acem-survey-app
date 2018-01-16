// Package utils provides useful helpers to easy set up general
// mandrill client.
package utils

import (
	"github.com/HelloSundayMorning/hsm-acem-survey-app/mandrill"
)

// SuccessMandrillConfigure configures a Mandrill client that always
// returns success when sending emails
func SuccessMandrillConfigure() {
	mandrill.SetClientWithKey("SANDBOX_SUCCESS")
}

// ErrorMandrillConfigure configures a Mandrill client that always
// returns an error when sending emails
func ErrorMandrillConfigure() {
	mandrill.SetClientWithKey("SANDBOX_ERROR")
}

// NilMandrillConfigure configures a nil Mandrill client so that any
// attempt to send an email will returns a *no mandrill client* error.
func NilMandrillConfigure() {
	mandrill.SetClient(nil)
}
