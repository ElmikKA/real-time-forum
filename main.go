package main

import (
	"RTForum/database"
	"RTForum/functions"
	"database/sql"
	"log"
	"net/http"
)

type application struct {
	db    *sql.DB
	users *functions.Users
}

func main() {
	var err error
	app := application{
		users: &functions.Users{},
	}
	app.db, err = database.InitDb()
	if err != nil {
		log.Fatalf("error connectiong to database: %v", err)
	}
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
