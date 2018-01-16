package main

import (
	"flag"
	"fmt"
	"log"
	"net/http"

	"github.com/HelloSundayMorning/hsm-acem-survey-app/app/models"
	"github.com/HelloSundayMorning/hsm-acem-survey-app/config/routes"
	// For DB Automigration
	_ "github.com/HelloSundayMorning/hsm-acem-survey-app/db/migrate"

	"github.com/theplant/airbraker"
)

func die(err error) {
	if err != nil {
		log.Fatal(err)
	}
}

func main() {
	var sendInvitation bool
	flag.BoolVar(&sendInvitation, "send-invitation-mail", false, "Send Invitation Mail for surveys and exit")
	flag.Parse()
	if sendInvitation {
		if err := models.SendInvitationMails(); err != nil {
			airbraker.Notify(fmt.Errorf("error delivering invitation mail: %s", err), nil)
		}
		return
	}

	mux := routes.Mux()
	die(http.ListenAndServe(":14000", mux))
}
