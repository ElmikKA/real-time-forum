package main

import (
	"fmt"
	"net/http"
)

// WIP

// func (app *application) requireLogin(handler http.HandlerFunc) http.HandlerFunc {
// 	return func(w http.ResponseWriter, r *http.Request) {
// 		loggedIn := functions.CheckRequireLogin(app.db, w, r)
// 		if !loggedIn {
// 			response := Response{
// 				Error:   true,
// 				Message: "Invalid credentials",
// 			}
// 			w.Header().Set("Content-Type", "application/json")
// 			json.NewEncoder(w).Encode(response)
// 		} else {
// 			handler.ServeHTTP(w, r)
// 		}
// 	}
// }

func (app *application) CheckLogin(w http.ResponseWriter, r *http.Request) (int, bool) {

	cookie, err := r.Cookie("session")
	if err != nil {
		// fmt.Println("error getting cookie", err)
		return 0, false
	}
	query := `SELECT id FROM sessions WHERE cookie = ?`
	var id int
	err = app.db.QueryRow(query, cookie.Value).Scan(&id)
	if err != nil {
		fmt.Println("error querying db", err)
		return 0, false
	}
	return id, true
}
