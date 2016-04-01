package controllers

import (
	"log"

	"github.com/gin-gonic/gin"
	"github.com/theplant/hsm-acem-survey-app/db"
	"github.com/theplant/hsm-acem-survey-app/template"
)

// Leaderboard receives [GET] /leaderboard
func Leaderboard(ctx *gin.Context) {
	locations := []string{"Warrnambool", "Clayton", "Fitzroy", "Geelong"}
	interviewers := []string{"nurse", "doctor", "allied", "other"}

	rawCounts := []struct {
		Location    string
		Interviewer string
		Count       int
	}{}

	if err := db.DB.Table("surveys").Select("location, interviewer, count(*) as count").Group("location, interviewer").Scan(&rawCounts).Error; err != nil {
		panic(err)
	}

	log.Println(rawCounts)

	type interviewerData map[string]int
	data := make(map[string]interviewerData)

	for _, l := range locations {
		data[l] = make(map[string]int)
	}

	for _, c := range rawCounts {
		log.Println(c, data)
		data[c.Location][c.Interviewer] = c.Count
	}

	template.Execute(ctx.Writer, "leaderboard/index", map[string]interface{}{
		"locations":    locations,
		"interviewers": interviewers,
		"counts":       data,
	})
}
