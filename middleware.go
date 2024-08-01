package main

import (
	"fmt"
	"net/http"
)

func (app *application) CheckLogin(w http.ResponseWriter, r *http.Request) (int, string, bool) {
	cookie, err := r.Cookie("session")
	if err != nil {
		return 0, "", false
	}
	query := `
	SELECT 
		s.id,
		u.username
	FROM 
		sessions s
	LEFT JOIN 
		users u ON s.id = u.id	
	WHERE 
		s.cookie = ?
	`
	var id int
	var username string
	err = app.db.QueryRow(query, cookie.Value).Scan(&id, &username)
	if err != nil {
		fmt.Println("error querying db", err)
		return 0, "", false
	}

	return id, username, true
}
