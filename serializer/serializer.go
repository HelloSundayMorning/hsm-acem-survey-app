// Package serializer provides a series of struct
// for easy encode/decode struct data to/from database
package serializer

import (
	"database/sql/driver"
	"encoding/json"
)

// JSONArray is a struct in order to serialize javascript's JSON array
// for example: [{"foo":"bar", "hello": "world"}]
type JSONArray []map[string]interface{}

// Scan is required to implement Scanner interface for database/sql/driver package
func (s *JSONArray) Scan(src interface{}) error {
	err := json.Unmarshal(src.([]byte), s)
	return err
}

// Value is required to implement Valuer interface for database/sql/driver package
func (s JSONArray) Value() (driver.Value, error) {
	return json.Marshal(s)
}

// JSON is a struct in order to serialize javascript's JSON object
// for example: {"foo":"bar", "hello": "world"}
type JSON map[string]interface{}

// Scan is required to implement Scanner interface for database/sql/driver package
func (j *JSON) Scan(src interface{}) error {
	err := json.Unmarshal(src.([]byte), j)
	return err
}

// Value is required to implement Valuer interface for database/sql/driver package
func (j JSON) Value() (driver.Value, error) {
	return json.Marshal(j)
}
