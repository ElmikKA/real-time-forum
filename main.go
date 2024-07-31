package main

import (
	"RTForum/database"
	"database/sql"
	"log"
	"net/http"
)

type application struct {
	db *sql.DB
}

func main() {
	var err error
	app := application{}
	// initiates database
	app.db, err = database.InitDb()
	if err != nil {
		log.Fatalf("error connectiong to database: %v", err)
	}
	// closes db when everything ends
	defer app.db.Close()

	srv := &http.Server{
		Addr:    ":8080",
		Handler: app.Routes(),
	}
	println("starting at http://localhost:8080")
	if err := srv.ListenAndServe(); err != nil {
		log.Fatalf("error starting server: %v", err)
	}
}
