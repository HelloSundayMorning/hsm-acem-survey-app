package models

import "time"

// Base is the basic model struct to replace the gorm.Model struct.
// The fields are all copied from gorm.Model in order to add json
// struct tags.
type Base struct {
	ID        uint       `gorm:"primary_key" json:"id"`
	CreatedAt time.Time  `sql:"not null" json:"-"`
	UpdatedAt time.Time  `sql:"not null" json:"-"`
	DeletedAt *time.Time `sql:"index" json:"-"`
}
