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

		data := make(map[string]interface{})

		if err != nil {
			data["register"] = "failure"
			data["message"] = "unable to check database"
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(data)
			return
		}

		if exists {
			data["register"] = "failure"
			data["message"] = "username or email already in use"
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(data)
			return
		} else {
			functions.AddUser(app.db, user)
		}
		data["register"] = "success"

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(data)
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
		data := make(map[string]interface{})

		if err != nil {
			data["login"] = "failure"
			data["message"] = "Invalid credentials"
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(data)
			return
		}
		if valid {

			data["login"] = "success"
			data["message"] = "Logged in"

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
			data["login"] = "failure"
			data["message"] = "Invalid credentials"
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(data)
	}
}

type PostRequest struct {
	PostNumber int `json:"postNumber"`
}

func (app *application) Posts(w http.ResponseWriter, r *http.Request) {
	data := make(map[string]interface{})
	if r.Method == "GET" {

		id, logggedIn := app.CheckLogin(w, r)

		data["loggedIn"] = logggedIn
		data["id"] = id

		posts, err := functions.GetPosts(app.db)
		if err != nil {
			fmt.Println("Posts error", err)
			data["posts"] = "failure"
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(data)
			return
		}
		data["data"] = posts
		fmt.Println(posts)

		post_likes, err := functions.GetAllPostLikes(app.db)
		if err != nil {
			fmt.Println("error postlikes", err)
			data["posts"] = "failure"
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(data)
			return
		}
		data["post_likes"] = post_likes

		data["posts"] = "success"
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(data)
	} else if r.Method == "POST" {
		id, logggedIn := app.CheckLogin(w, r)

		data["loggedIn"] = logggedIn
		data["id"] = id
		fmt.Println("here")
		var reqData PostRequest

		// right now its hard coded for id = 1

		// err := r.ParseMultipartForm(10 << 20)

		err := json.NewDecoder(r.Body).Decode(&reqData)

		if err != nil {
			http.Error(w, fmt.Sprintf("error parsing form: %v", err), http.StatusBadRequest)
			data["post"] = "failure"
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(data)
			return
		}
		fmt.Println(reqData.PostNumber)

		post, err := functions.GetOnePost(app.db, reqData.PostNumber)
		if err != nil {
			fmt.Println("error getting onepost")
			data["post"] = "failure"
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(data)
			return
		}
		data["data"] = post

		post_likes, err := functions.GetOnePostLike(app.db, post.Id)
		if err != nil {
			fmt.Println("err getting one post like", err)
			data["post"] = "failure"
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(data)
			return
		}
		data["post_likes"] = post_likes

		comments, err := functions.GetComments(app.db, post.Id)
		if err != nil {
			fmt.Println("error getting comments")
			data["post"] = "failure"
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(data)
			return
		}
		data["comments"] = comments

		comment_likes, err := functions.GetCommentLikes(app.db, post.Id)
		if err != nil {
			fmt.Println("error getting commentlikes", err)
			data["post"] = "failure"
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(data)
			return
		}
		data["comment_likes"] = comment_likes

		data["post"] = "success"
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(data)
	}
}

func (app *application) NewPost(w http.ResponseWriter, r *http.Request) {
	if r.Method == "POST" {
		data := make(map[string]interface{})
		id, logggedIn := app.CheckLogin(w, r)
		data["loggedIn"] = logggedIn
		data["id"] = id

	}
}
