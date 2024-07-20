package main

import (
	"RTForum/functions"
	"encoding/json"
	"net/http"
)

// WIP

func (app *application) requireLogin(handler http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		loggedIn := functions.CheckRequireLogin(app.db, w, r)
		if !loggedIn {
			response := Response{
				Error:   true,
				Message: "Invalid credentials",
			}
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(response)
		} else {
			handler.ServeHTTP(w, r)
		}
	}
}
