package models

import "time"

// Modelo ToDo
type ToDo struct {
	Id           uint      `gorm:"primaryKey" json:"id"`
	Title        string    `json:"title"`
	Description  string    `json:"description"`
	Status       string    `json:"status"`
	CreationDate time.Time `json:"creationDate"`
}

func (ToDo) TableName() string {
	return "ToDo"
}
