package main

import (
	"fmt"
	"net/http"
)

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
