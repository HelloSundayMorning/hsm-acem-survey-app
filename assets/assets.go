package assets

import (
	"encoding/json"
	"fmt"
	"io/ioutil"

	"github.com/theplant/hsm-acem-survey-app/template"
)

func init() {
	var result map[string]string

	raw, err := ioutil.ReadFile("./public/assets/manifest.json")
	if err != nil {
		panic(err)
	}

	err = json.Unmarshal(raw, &result)
	if err != nil {
		panic(err)
	}

	template.FuncMap["asset"] = asset(result)
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
