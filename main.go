package main

import (
	"log"
	"net/http"

	"github.com/theplant/hsm-acem-survey-app/config/routes"

	// For DB Automigration
	_ "github.com/theplant/hsm-acem-survey-app/db/migrate"
)

func die(err error) {
	if err != nil {
		log.Fatal(err)
	}
}

func main() {
	mux := routes.Mux()
	die(http.ListenAndServe(":14000", mux))
}
