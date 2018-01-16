package assets

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"

	"github.com/HelloSundayMorning/hsm-acem-survey-app/template"
)

func init() {

	template.FuncMap["asset"] = idAsset

	raw, err := ioutil.ReadFile("./public/assets/manifest.json")
	if err != nil {
		log.Printf("Couldn't read asset file: %v", err)
		return
	}

	var result map[string]string
	err = json.Unmarshal(raw, &result)
	if err != nil {
		log.Printf("Couldn't unmarshal asset file: %v", err)
		return
	}

	template.FuncMap["asset"] = asset(result)
}

// idAsset: "id" => identity (ie. do nothing)
func idAsset(asset string) (string, error) {
	return asset, nil
}

func asset(assets map[string]string) func(string) (string, error) {
	return func(name string) (string, error) {
		asset, ok := assets[name]
		if !ok {
			return "", fmt.Errorf("Unknown asset %q", name)
		}
		return fmt.Sprintf("/assets/%s", asset), nil
	}
}
