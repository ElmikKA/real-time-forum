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

// executes the single html file
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
		// parses the data from the form
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
		// checks if the username or email is already in use
		exists, err := functions.CheckUserExists(app.db, user.Name, user.Email)

		// variable to return to js with all data
		data := make(map[string]interface{})

		// if db error
		if err != nil {
			data["register"] = "failure"
			data["message"] = "unable to check database"
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(data)
			return
		}

		// if username/email is already in use
		if exists {
			data["register"] = "failure"
			data["message"] = "username or email already in use"
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(data)
			return
		} else {
			// if it's a new user it adds it to db
			functions.AddUser(app.db, user)
		}
		// responds success
		data["register"] = "success"

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(data)
	}
}

func (app *application) Login(w http.ResponseWriter, r *http.Request) {
	if r.Method == "POST" {
		// parses the data from login form
		err := r.ParseMultipartForm(10 << 20)
		if err != nil {
			http.Error(w, fmt.Sprintf("error parsing form: %v", err), http.StatusBadRequest)
			return
		}
		name := r.Form.Get("user")
		pass := r.Form.Get("password")
		// checks if the username/email + pass is correct
		valid, id, err := functions.CheckLogin(app.db, name, pass)
		data := make(map[string]interface{})

		// error either on invalid credentials or db error
		if err != nil {
			data["login"] = "failure"
			data["message"] = "Invalid credentials"
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(data)
			return
		}

		// user logged in
		if valid {
			data["login"] = "success"
			data["message"] = "Logged in"

			// adds user session to db

			// removes any previous sessions on this user id
			err = functions.DeleteUserSession(app.db, id)
			if err != nil {
				fmt.Println("error deleting session from user")
			}

			// adds new session for this user id
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
	// checks if logged in
	id, loggedIn := app.CheckLogin(w, r)

	data["loggedIn"] = loggedIn
	data["id"] = id

	// if not logged in sends data["loggedIn"] as false
	if !loggedIn {
		data["posts"] = "failure"
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(data)
		return
	}
	if r.Method == "GET" {
		// on post load with GET

		// gets all posts
		posts, err := functions.GetPosts(app.db, id)
		if err != nil {
			fmt.Println("Posts error", err)
			data["posts"] = "failure"
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(data)
			return
		}
		// sends all posts
		data["data"] = posts
		fmt.Println(posts)

		// gets all post likes
		post_likes, err := functions.GetAllPostLikes(app.db)
		if err != nil {
			fmt.Println("error postlikes", err)
			data["posts"] = "failure"
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(data)
			return
		}
		// sends all post likes
		data["post_likes"] = post_likes

		data["posts"] = "success"
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(data)
	} else if r.Method == "POST" {
		fmt.Println("here")
		var reqData PostRequest

		// right now its hard coded for id = 1

		// err := r.ParseMultipartForm(10 << 20)

		// decodes the post id sent from js
		err := json.NewDecoder(r.Body).Decode(&reqData)

		if err != nil {
			http.Error(w, fmt.Sprintf("error parsing form: %v", err), http.StatusBadRequest)
			data["post"] = "failure"
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(data)
			return
		}
		fmt.Println(reqData.PostNumber)

		// gets the post with post_id
		post, err := functions.GetOnePost(app.db, reqData.PostNumber, id)
		if err != nil {
			fmt.Println("error getting onepost")
			data["post"] = "failure"
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(data)
			return
		}
		data["data"] = post

		// gets the likes of the post
		post_likes, err := functions.GetOnePostLike(app.db, post.Id)
		if err != nil {
			fmt.Println("err getting one post like", err)
			data["post"] = "failure"
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(data)
			return
		}
		data["post_likes"] = post_likes

		// gets all comments for the post
		fmt.Println(id)
		comments, err := functions.GetComments(app.db, post.Id, id)
		if err != nil {
			fmt.Println("error getting comments")
			data["post"] = "failure"
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(data)
			return
		}
		data["comments"] = comments

		// gets all comments for the post
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

	data := make(map[string]interface{})
	// checks if logged in
	id, loggedIn := app.CheckLogin(w, r)

	data["loggedIn"] = loggedIn
	data["id"] = id

	// if not logged in sends data["loggedIn"] as false
	if !loggedIn {
		data["posts"] = "failure"
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(data)
		return
	}
	if r.Method == "POST" {
		// creates a new post

		post := functions.Post{}

		// the decode is for data sent as JSON, the upper parseform is if data is sent from a <form>. It's better to use json
		err := json.NewDecoder(r.Body).Decode(&post)
		if err != nil {
			http.Error(w, fmt.Sprintf("error parsing form: %v", err), http.StatusBadRequest)
			return
		}

		fmt.Println(id)
		// gets username of the poster
		user, err := functions.GetUser(app.db, id)
		if err != nil {
			data["newPost"] = "failure"
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(data)
			return
		}

		post.User_id = id
		post.Creator = user.Name

		// the marshal printing is for testing purposes so the entire post is printed out (will be removed)
		out, _ := json.Marshal(post)
		fmt.Println(string(out))

		// create post in db
		err = functions.CreatePost(app.db, post)
		if err != nil {
			data["newPost"] = "failure"
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(data)
			return
		}

		data["newPost"] = "success"

		data["data"] = post
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(data)
		return
	}
}

func (app *application) newComment(w http.ResponseWriter, r *http.Request) {
	data := make(map[string]interface{})
	// checks if logged in
	id, loggedIn := app.CheckLogin(w, r)

	data["loggedIn"] = loggedIn
	data["id"] = id

	// if not logged in sends data["loggedIn"] as false
	if !loggedIn {
		data["posts"] = "failure"
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(data)
		return
	}
	if r.Method == "POST" {
		fmt.Println("new comment")

		comment := functions.Comment{}

		// decodes json sent by js
		err := json.NewDecoder(r.Body).Decode(&comment)
		if err != nil {
			http.Error(w, fmt.Sprintf("error parsing form: %v", err), http.StatusBadRequest)
			return
		}

		comment.User_id = id

		// gets username from db
		user, err := functions.GetUser(app.db, id)
		if err != nil {
			data["newComment"] = "failure"
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(data)
			return
		}

		comment.Creator = user.Name

		// marshal for testing purposes so the printed comment is more readable
		out, _ := json.Marshal(comment)
		fmt.Println(string(out))

		// adds comment to db
		err = functions.CreateComment(app.db, comment)
		if err != nil {
			data["newComment"] = "failure"
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(data)
			return
		}

		data["newComment"] = "success"
		data["comment"] = comment
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(data)

	}
}

type Like struct {
	Post       bool `json:"post"`
	Post_id    int  `json:"post_id"`
	Comment    bool `json:"comment"`
	Comment_id int  `json:"comment_id"`
	Like       int  `json:"like"`
}

func (app *application) ChangeLikes(w http.ResponseWriter, r *http.Request) {
	data := make(map[string]interface{})
	// checks if logged in
	id, loggedIn := app.CheckLogin(w, r)

	data["loggedIn"] = loggedIn
	data["id"] = id

	// if not logged in sends data["loggedIn"] as false
	if !loggedIn {
		fmt.Println("not logged in")
		data["posts"] = "failure"
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(data)
		return
	}

	if r.Method == "POST" {
		fmt.Println("post")
		var like Like
		err := json.NewDecoder(r.Body).Decode(&like)
		if err != nil {
			fmt.Println("error here")
			data["changeLikes"] = "failure"
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(data)
			return
		}

		// if a post is being liked
		if like.Post {
			fmt.Println("liking post")
			functions.AddPostLike(app.db, like.Post_id, id, like.Like)
		}
		// if a comment is getting liked
		if like.Comment {
			fmt.Println("comment")
			functions.AddCommentLike(app.db, like.Post_id, like.Comment_id, id, like.Like)
		}

		// prints out for testing
		out, _ := json.Marshal(like)
		fmt.Println(string(out))

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(data)
	}
}
