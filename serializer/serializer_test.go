// Package serializer_test testing all structs that provided ty serializer package
package serializer_test

import (
	"encoding/json"
	"testing"

	"github.com/HelloSundayMorning/hsm-acem-survey-app/db"
	"github.com/HelloSundayMorning/hsm-acem-survey-app/db/migrate"
	"github.com/HelloSundayMorning/hsm-acem-survey-app/serializer"
	"github.com/HelloSundayMorning/hsm-acem-survey-app/test/utils"
	"github.com/jinzhu/gorm"
)

type question struct {
	gorm.Model
	Options serializer.JSONArray `sql:"type:json;not null;default:'[]'"`
}

func TestJSONArrayFieldDefaultValueIsEmptyArray(t *testing.T) {
	setup(t)

	q := &question{}
	utils.AssertNoErr(t, db.DB.Save(q).Error)

	if !isEqualAsJSONString(t, []string{}, q.Options) {
		t.Error("a serializer.JSONArray field's default value should be a empty array")
	}
}

func TestJSONArrayFieldStoresAJSONArray(t *testing.T) {
	setup(t)

	var originJSON []map[string]interface{}
	err := json.Unmarshal([]byte(`
	  	[
		  	{ "A": "Golang is simple"}, 
		  	{ "B": "Golang is faster"}, 
		  	{ "C": "Golang is design for concurrency"}
	  	]
	`), &originJSON)
	utils.AssertNoErr(t, err)

	q := &question{}
	q.Options = serializer.JSONArray(originJSON)
	utils.AssertNoErr(t, db.DB.Save(q).Error)
	utils.AssertNoErr(t, db.DB.Last(q).Error)

	if !isEqualAsJSONString(t, originJSON, q.Options) {
		t.Fatal("a serializer.JSONArray field should be able store/fetch a JSON to/from database")
	}
}

func toJSONString(t *testing.T, value interface{}) string {
	jsonStr, err := json.Marshal(value)
	utils.AssertNoErr(t, err)

	return string(jsonStr)
}

func isEqualAsJSONString(t *testing.T, expectedValue interface{}, value interface{}) bool {
	expectedJSONStr := toJSONString(t, expectedValue)
	jsonStr := toJSONString(t, value)

	if jsonStr != expectedJSONStr {
		t.Logf("expected JSON string: \n%v\n, but got: \n%v\n", expectedJSONStr, jsonStr)
		return false
	}
	return true
}

func setup(t *testing.T) {
	migrate.AutoMigrate(&question{})
}
