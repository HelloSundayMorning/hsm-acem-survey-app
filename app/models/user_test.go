// Package models_test contains unit tests for package models.
package models_test

import (
	"testing"

	"github.com/theplant/hsm-acem-survey-app/app/models"
	"github.com/theplant/hsm-acem-survey-app/db"
	"github.com/theplant/hsm-acem-survey-app/test/utils"
)

// TestUserDisplayName testing User.DisplayName function.
func TestUserDisplayName(t *testing.T) {
	user := utils.NewUser()

	if got := user.DisplayName(); got == "" {
		t.Error("user.DisplayName() should not be empty")
	}
}

// TestUserIsAdmin testing User.IsAdmin function.
func TestUserIsAdmin(t *testing.T) {
	cases := []struct {
		in   string
		want bool
	}{
		{"", false},
		{"Admin", true},
		{"Normal", false},
	}

	for _, c := range cases {
		user := utils.NewUser()
		user.Role = c.in
		got := user.IsAdmin()
		if got != c.want {
			t.Errorf("user.Role = %q, got user.IsAdmin() = %v, want %v", c.in, got, c.want)
		}
	}
}

// TestUserAuthenticate testing models.UserAuthenticate function.
func TestUserAuthenticate(t *testing.T) {
	user := utils.NewUser()
	user.Email = "tester@hsm.com"
	user.Password = "test"
	if err := db.DB.Create(&user).Error; err != nil {
		t.Fatalf("create user failure, got error = %v", err)
	}

	cases := []struct {
		email, password string
		want            bool
	}{
		{"non-exists-email@hsm.com", "test", false},
		{"tester@hsm.com", "incorrect-password", false},
		{"tester@hsm.com", "test", true},
	}

	for _, c := range cases {
		signedUser, err := models.UserAuthenticate(c.email, c.password)
		signStatus := err == nil
		if got := signStatus; got != c.want {
			t.Errorf("models.UserAuthenticate(%q, %q) got sign in status = %v, want %v", c.email, c.password, got, c.want)
		}

		if got, want := signedUser.Email, user.Email; signStatus == true && got != want {
			t.Errorf("models.UserAuthenticate(%q, %q) got a user.Email = %q, want %q", c.email, c.password, got, want)
		}
	}
}

// TestUserValidateWithNotEmail tests user email presence validation
func TestUserValidateWithNotEmail(t *testing.T) {
	user := utils.NewUser()
	user.Email = ""

	if err := db.DB.Create(&user).Error; err == nil {
		t.Error("user should be invalid with empty email")
	}
}

// TestUserValidateWithInvalidEmail tests user email format validation
func TestUserValidateWithInvalidEmail(t *testing.T) {
	user := utils.NewUser()
	user.Email = "invalid-email-address"

	if err := db.DB.Create(&user).Error; err == nil {
		t.Errorf("user should be invalid with email = %q", user.Email)
	}
}

// TestUserValidateWithDuplicatedEmail tests user email DB UNIQUE constraint
func TestUserValidateWithDuplicatedEmail(t *testing.T) {
	userOne := utils.NewUser()
	userOne.Email = "a-token-email-address@gmail.com"
	if err := db.DB.Create(&userOne).Error; err != nil {
		t.Fatalf("create user failure, got error = %v", err)
	}

	userTwo := utils.NewUser()
	userTwo.Email = userOne.Email
	if err := db.DB.Create(&userTwo).Error; err == nil {
		t.Error("user should be invalid with a token email")
	}
}

// TestUserCreateValidateWithNoPassword tests user password presence validation on create
func TestUserCreateValidateWithNoPassword(t *testing.T) {
	user := utils.NewUser()
	user.Password = ""

	if err := db.DB.Create(&user).Error; err == nil {
		t.Error("create user should be failed with empty password")
	}
}

// TestUserUpdateValidateWithNoPassword tests user password presence validation on create
func TestUserUpdateValidateWithNoPassword(t *testing.T) {
	user := utils.CreateUser(t)
	user.Password = ""

	if err := db.DB.Save(&user).Error; err != nil {
		t.Errorf("update user should not be failed with empty password, but got error = %v", err)
	}
}

// TestUserValidateWithInvalidRole tests user role inclusion validation
func TestUserValidateWithInvalidRole(t *testing.T) {
	user := utils.NewUser()
	user.Role = "invalid role"

	if err := db.DB.Create(&user).Error; err == nil {
		t.Errorf("user should be failed with invalid role = %q", user.Role)
	}
}
