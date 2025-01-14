package main

import (
	"RTForum/functions"
	"log"
	"net/http"
)

func main() {
	// initiates database
	err := functions.InitDb()
	if err != nil {
		log.Fatalf("error connectiong to database: %v", err)
	}
	// closes db when everything ends
	defer functions.Db.Close()

	srv := &http.Server{
		Addr:    ":8080",
		Handler: Routes(),
	}

	println("starting at http://localhost:8080")
	if err := srv.ListenAndServe(); err != nil {
		log.Fatalf("error starting server: %v", err)
	}
}
