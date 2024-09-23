package database

import (
	"fmt"
	"log"

	"gorm.io/driver/sqlserver"
	"gorm.io/gorm"
)

var DB *gorm.DB

// Conexión a la base de datos
func ConnectDB() {
	server := "sql.bsite.net"
	user := "ajomuch92_to_do"
	password := "HolaMundo3192"
	database := "ajomuch92_to_do"
	instanceName := "MSSQL2016"

	// Construye el DSN (Data Source Name) para SQL Server
	// Se especifica el nombre de la instancia y el cifrado
	dsn := fmt.Sprintf("sqlserver://%s:%s@%s/%s?database=%s&encrypt=true&TrustServerCertificate=true",
		user, password, server, instanceName, database)
	println(dsn)
	var err error
	DB, err = gorm.Open(sqlserver.Open(dsn), &gorm.Config{
		SkipDefaultTransaction: true,
	})
	if err != nil {
		log.Fatal("No se pudo conectar a la base de datos", err)
	}
}
