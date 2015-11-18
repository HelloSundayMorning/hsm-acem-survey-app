package integration_test

import (
	"testing"
	"time"

	"github.com/onsi/gomega"
	"github.com/sclevine/agouti"
	"github.com/sclevine/agouti/matchers"
	"github.com/theplant/hsm-acem-survey-app/test/utils"
)

// TestAdminRequiredLogin tests case:
// - unlogged client visit admin should be redirect to login page
func TestAdminRequiredLogin(t *testing.T) {
	beforeEach(t)

	gomega.Expect(page.Navigate(adminURL)).To(gomega.Succeed())
	gomega.Eventually(page, requestTimeout).Should(matchers.HaveURL(newSessionsURL))
}

// TestAdminLoggedIn tests case:
// - logged as admin user should be redirect to admin page
func TestAdminLoggedIn(t *testing.T) {
	beforeEach(t)

	user := utils.CreateAdminUser(t)

	login(t, page, user.Email, utils.UserPassword)
	gomega.Expect(page).To(matchers.HaveURL(adminURL))
	gomega.Expect(page.Find(".mdl-layout-title")).To(matchers.HaveText("Admin"))
}

// TestUserLoggedIn tests cases:
// - logged as normal user should be redirect to root page
// - normal user can not visit root page
func TestUserLoggedIn(t *testing.T) {
	beforeEach(t)

	user := utils.CreateUser(t)

	login(t, page, user.Email, utils.UserPassword)
	gomega.Expect(page).To(matchers.HaveURL(rootURL))
	gomega.Expect(page.Navigate(adminURL)).To(gomega.Succeed())
	gomega.Eventually(page, requestTimeout).Should(matchers.HaveURL(rootURL))
}

// TestUserLoggedInFailure tests case:
// - using invalid password login should failure and raise error
func TestUserLoggedInFailure(t *testing.T) {
	beforeEach(t)

	user := utils.CreateUser(t)

	login(t, page, user.Email, "wrong password")
	gomega.Expect(page).To(matchers.HaveURL(sessionsURL))
	gomega.Expect(page.Find(".error")).To(matchers.HaveText("invalid email or password"))
}

// TestUserLogout tests case:
// - logged admin can logout in admin page
// - logout client should be redirect to root page
// - logout client should not able to visit admin page
func TestUserLogout(t *testing.T) {
	beforeEach(t)

	user := utils.CreateAdminUser(t)

	login(t, page, user.Email, utils.UserPassword)
	gomega.Expect(page.Navigate(destroySessionsURL)).To(gomega.Succeed())
	gomega.Eventually(page, requestTimeout).Should(matchers.HaveURL(rootURL))

	time.Sleep(requestTimeout)
	gomega.Expect(page.Navigate(adminURL)).To(gomega.Succeed())
	gomega.Eventually(page, requestTimeout).Should(matchers.HaveURL(newSessionsURL))
}

func login(t *testing.T, page *agouti.Page, email string, password string) {
	gomega.RegisterTestingT(t)

	gomega.Expect(page.Navigate(newSessionsURL)).To(gomega.Succeed())
	gomega.Expect(page.FindByName("Email").Fill(email)).To(gomega.Succeed())
	gomega.Expect(page.FindByName("Password").Fill(password)).To(gomega.Succeed())
	gomega.Expect(page.FindByButton("Sign In").Click()).To(gomega.Succeed())
	time.Sleep(requestTimeout)
}
