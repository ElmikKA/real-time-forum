package main

import (
	"encoding/json"
	"fmt"
	"html/template"
	"log"
	"net/http"
	"strconv"

	"RTForum/functions"
)

func (app *application) Mainpage(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path == "/" {
		tmpl, err := template.ParseFiles("templates/index.html")
		if err != nil {
			log.Fatal(err)
		}
		tmpl.Execute(w, nil)
	}
}

type Response struct {
	Error    bool   `json:"error"`
	Message  string `json:"message"`
	LoggedIn bool   `json:"loggedIn"`
}

func (app *application) Register(w http.ResponseWriter, r *http.Request) {

	if r.Method == "POST" {
		err := r.ParseMultipartForm(10 << 20)
		if err != nil {
			fmt.Println("error", err)
		}
		age, _ := strconv.Atoi(r.FormValue("age"))

		user := functions.Users{
			Name:      r.Form.Get("username"),
			Age:       age,
			Gender:    r.Form.Get("gender"),
			FirstName: r.Form.Get("firstName"),
			LastName:  r.Form.Get("lastName"),
			Email:     r.Form.Get("email"),
			Password:  r.Form.Get("password"),
		}
		exists, err := functions.CheckUserExists(app.db, user.Name, user.Email)

		if err != nil {
			response := Response{
				Error:   true,
				Message: "unable to check database",
			}
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(response)
		}

		if exists {
			response := Response{
				Error:   true,
				Message: "Username or email already in use",
			}
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(response)
			return
		} else {
			functions.AddUser(app.db, user)
		}

		response := Response{
			Error:   false,
			Message: "Registration successful",
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(response)
	}

}

func (app *application) Login(w http.ResponseWriter, r *http.Request) {
	if r.Method == "POST" {
		err := r.ParseMultipartForm(10 << 20)
		if err != nil {
			http.Error(w, fmt.Sprintf("error parsing form: %v", err), http.StatusBadRequest)
			return
		}
		name := r.Form.Get("user")
		pass := r.Form.Get("password")
		valid, id, err := functions.CheckLogin(app.db, name, pass)
		response := Response{}
		if err != nil {
			response = Response{
				Error:   true,
				Message: "database error",
			}
		}
		if valid {
			response = Response{
				Error:   false,
				Message: "Logged in",
			}

			// session

			err = functions.DeleteUserSession(app.db, id)
			if err != nil {
				fmt.Println("error deleting session from user")
			}

			err = app.AddSession(w, r, id)
			if err != nil {
				fmt.Println("error adding session")
				return
			}

		} else {
			response = Response{
				Error:   true,
				Message: "Invalid credentials",
			}
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(response)
	}
}
