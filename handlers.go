package main

import (
	"encoding/json"
	"fmt"
	"html/template"
	"log"
	"net/http"

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

func (app *application) Register(w http.ResponseWriter, r *http.Request) {

	responseData := make(map[string]interface{})
	if r.Method == "POST" {
		user := functions.Users{}

		// decode data sent from frontend
		err := json.NewDecoder(r.Body).Decode(&user)

		if err != nil {
			fmt.Println("error", err)
			responseData["register"] = "failure"
			responseData["message"] = "form error"
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(responseData)
			return
		}

		// checks if the username or email is already in use
		exists, err := functions.CheckUserExists(app.db, user.Name, user.Email)

		// if db error
		if err != nil {
			responseData["register"] = "failure"
			responseData["message"] = "unable to check database"
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(responseData)
			return
		}

		// if username/email is already in use
		if exists {
			responseData["register"] = "failure"
			responseData["message"] = "username or email already in use"
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(responseData)
			return
		} else {
			// if it's a new user it adds it to db
			functions.AddUser(app.db, user)
		}

		// responds success
		responseData["register"] = "success"

		// currently sending all user data including PASSWORD to frontend
		responseData["user"] = user

		// encodes the data and sends it to frontend
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(responseData)
	}
}

func (app *application) Login(w http.ResponseWriter, r *http.Request) {
	responseData := make(map[string]interface{})

	if r.Method == "POST" {
		creds := functions.LoginCredentials{}

		// decodes credentials sent from frontend
		err := json.NewDecoder(r.Body).Decode(&creds)

		if err != nil {
			fmt.Println("error", err)
			responseData["login"] = "failure"
			responseData["message"] = "form error"
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(responseData)
			return
		}

		// checks if the username|email + pass is correct
		valid, id, err := functions.CheckLogin(app.db, creds.User, creds.Pass)

		// error either on invalid credentials or db error
		if err != nil {
			responseData["login"] = "failure"
			responseData["message"] = "Invalid credentials"
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(responseData)
			return
		}

		// if invalid crenedtials
		if !valid {
			responseData["login"] = "failure"
			responseData["message"] = "Invalid credentials"
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(responseData)
			return
		}

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
			responseData["login"] = "failure"
			responseData["message"] = "session error"
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(responseData)
			return
		}

		// user logged in
		responseData["login"] = "success"
		responseData["message"] = "Logged in"

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(responseData)
	}
}

type PostRequest struct {
	PostNumber int `json:"postNumber"`
}

func (app *application) Posts(w http.ResponseWriter, r *http.Request) {
	responseData := make(map[string]interface{})

	// checks if logged in
	id, username, loggedIn := app.CheckLogin(w, r)

	responseData["loggedIn"] = loggedIn
	responseData["id"] = id
	responseData["username"] = username

	// if not logged in sends data["loggedIn"] as false
	if !loggedIn {
		responseData["posts"] = "failure"
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(responseData)
		return
	}

	// on post load with GET
	if r.Method == "GET" {

		// gets all posts
		posts, err := functions.GetPosts(app.db, id)
		if err != nil {
			fmt.Println("Posts error", err)
			responseData["posts"] = "failure"
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(responseData)
			return
		}
		// sends all posts
		responseData["allPosts"] = posts

		// gets all post likes separately with more info
		// (maybe not needed)
		post_likes, err := functions.GetAllPostLikes(app.db)
		if err != nil {
			fmt.Println("error postlikes", err)
			responseData["posts"] = "failure"
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(responseData)
			return
		}
		// sends all post likes
		responseData["post_likes"] = post_likes

		responseData["posts"] = "success"
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(responseData)
	} else if r.Method == "POST" {
		// POST method for when user opens up one post

		var post functions.Post

		// decodes the post id sent from js
		err := json.NewDecoder(r.Body).Decode(&post)

		if err != nil {
			fmt.Println("error", err)
			responseData["post"] = "failure"
			responseData["message"] = "form error"
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(responseData)
			return
		}

		// gets the post with post_id
		post, err = functions.GetOnePost(app.db, post.Id, id)
		if err != nil {
			fmt.Println("error getting onepost")
			responseData["post"] = "failure"
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(responseData)
			return
		}
		responseData["onePost"] = post

		// gets the additional information on likes of the post
		// (maybe not needed)
		post_likes, err := functions.GetOnePostLike(app.db, post.Id)
		if err != nil {
			fmt.Println("err getting one post like", err)
			responseData["post"] = "failure"
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(responseData)
			return
		}
		responseData["post_likes"] = post_likes

		// gets all comments for the post
		comments, err := functions.GetComments(app.db, post.Id, id)
		if err != nil {
			fmt.Println("error getting comments")
			responseData["post"] = "failure"
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(responseData)
			return
		}
		responseData["comments"] = comments

		// gets all additional information on comment likes for the post
		// (maybe not needed)
		comment_likes, err := functions.GetCommentLikes(app.db, post.Id)
		if err != nil {
			fmt.Println("error getting commentlikes", err)
			responseData["post"] = "failure"
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(responseData)
			return
		}
		responseData["comment_likes"] = comment_likes

		responseData["post"] = "success"
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(responseData)
	}
}

func (app *application) NewPost(w http.ResponseWriter, r *http.Request) {

	responseData := make(map[string]interface{})

	// checks if logged in
	id, username, loggedIn := app.CheckLogin(w, r)

	responseData["loggedIn"] = loggedIn
	responseData["id"] = id
	responseData["username"] = username

	// if not logged in sends responseData["loggedIn"] as false
	if !loggedIn {
		responseData["newPost"] = "failure"
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(responseData)
		return
	}

	if r.Method == "POST" {
		// creates a new post

		post := functions.Post{}

		// decodes data sent from frontend
		err := json.NewDecoder(r.Body).Decode(&post)
		if err != nil {
			fmt.Println("error", err)
			responseData["newPost"] = "failure"
			responseData["message"] = "form error"
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(responseData)
			return
		}

		// adds user id and username to the post struct
		post.User_id = id
		post.Creator = username

		// create post in db
		err = functions.CreatePost(app.db, post)
		if err != nil {
			responseData["newPost"] = "failure"
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(responseData)
			return
		}

		responseData["newPost"] = "success"
		responseData["postData"] = post

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(responseData)
		return
	}
}

func (app *application) newComment(w http.ResponseWriter, r *http.Request) {
	responseData := make(map[string]interface{})
	// checks if logged in
	id, username, loggedIn := app.CheckLogin(w, r)

	responseData["loggedIn"] = loggedIn
	responseData["id"] = id
	responseData["username"] = username

	// if not logged in sends responeData["loggedIn"] as false
	if !loggedIn {
		responseData["newComment"] = "failure"
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(responseData)
		return
	}

	if r.Method == "POST" {
		comment := functions.Comment{}

		// decodes json sent by js
		err := json.NewDecoder(r.Body).Decode(&comment)
		if err != nil {
			fmt.Println("error", err)
			responseData["newComment"] = "failure"
			responseData["message"] = "form error"
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(responseData)
			return
		}

		comment.User_id = id

		// gets username from db
		user, err := functions.GetUser(app.db, id)
		if err != nil {
			responseData["newComment"] = "failure"
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(responseData)
			return
		}

		comment.Creator = user.Name

		// marshal for testing purposes so the printed comment is more readable
		out, _ := json.Marshal(comment)
		fmt.Println(string(out))

		// adds comment to db
		err = functions.CreateComment(app.db, comment)
		if err != nil {
			responseData["newComment"] = "failure"
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(responseData)
			return
		}

		responseData["newComment"] = "success"
		responseData["comment"] = comment
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(responseData)

	}
}

func (app *application) ChangeLikes(w http.ResponseWriter, r *http.Request) {
	responseData := make(map[string]interface{})
	// checks if logged in
	id, username, loggedIn := app.CheckLogin(w, r)

	responseData["loggedIn"] = loggedIn
	responseData["id"] = id
	responseData["username"] = username

	// if not logged in sends responeData["loggedIn"] as false
	if !loggedIn {
		fmt.Println("not logged in")
		responseData["changeLikes"] = "failure"
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(responseData)
		return
	}

	if r.Method == "POST" {
		var like functions.Change_like
		err := json.NewDecoder(r.Body).Decode(&like)
		if err != nil {
			fmt.Println("error", err)
			responseData["changeLikes"] = "failure"
			responseData["message"] = "form error"
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(responseData)
			return
		}

		// if a post is being liked
		if like.Post {
			err := functions.AddPostLike(app.db, like.Post_id, id, like.Like)
			if err != nil {
				responseData["like"] = "failure"
				w.Header().Set("Content-Type", "application/json")
				json.NewEncoder(w).Encode(responseData)
				return
			}
		}

		// if a comment is getting liked
		if like.Comment {
			err := functions.AddCommentLike(app.db, like.Post_id, like.Comment_id, id, like.Like)
			if err != nil {
				responseData["like"] = "failure"
				w.Header().Set("Content-Type", "application/json")
				json.NewEncoder(w).Encode(responseData)
				return
			}
		}

		responseData["like"] = "success"

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(responseData)
	}
}
