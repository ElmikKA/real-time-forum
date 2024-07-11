package main

import (
	"encoding/json"
	"fmt"
	"html/template"
	"log"
	"net/http"
)

func Mainpage(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path == "/" {
		tmpl, err := template.ParseFiles("templates/index.html")
		if err != nil {
			log.Fatal(err)
		}
		tmpl.Execute(w, nil)
	}
}

type Response struct {
	Error   bool   `json:"error"`
	Message string `json:"message"`
}

func Register(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST")

	if r.Method == "POST" {
		err := r.ParseMultipartForm(10 << 20)

		if err != nil {
			fmt.Println("error", err)
		}
		fmt.Println(r.Form)
		fmt.Println("form:", r.Form.Get("username"))

		username := r.Form.Get("username")

		if username == "1" {
			response := Response{
				Error:   true,
				Message: "Username already exists",
			}
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(response)
			return
		}
		response := Response{
			Error:   false,
			Message: "Registration successful",
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(response)
	}

}

// func Login(w http.ResponseWriter, r *http.Request) {
// 	if r.URL.Path == "/api/login" {

// 	}
// }
