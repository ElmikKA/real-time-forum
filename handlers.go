package main

import (
	"encoding/json"
	"fmt"
	"html/template"
	"net/http"
	"sync"
	"time"

	"RTForum/functions"

	"github.com/gorilla/websocket"
)

// executes the single html file
func Mainpage(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path == "/" {
		tmpl, err := template.ParseFiles("templates/index.html")
		if err != nil {
			fmt.Println("error parsing template")
		}
		tmpl.Execute(w, nil)
	}
}

func Register(w http.ResponseWriter, r *http.Request) {

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
		exists, err := functions.CheckUserExists(user.Name, user.Email)

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
			err := functions.AddUser(user)
			if err != nil {
				responseData["register"] = "failure"
				responseData["message"] = "error adding user to database"
				w.Header().Set("Content-Type", "application/json")
				json.NewEncoder(w).Encode(responseData)
				return
			}
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

func Login(w http.ResponseWriter, r *http.Request) {
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
		valid, id, err := functions.CheckCredentials(creds.User, creds.Pass)

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
		err = functions.DeleteUserSession(id)
		if err != nil {
			fmt.Println("error deleting session from user")
		}

		// adds new session for this user id
		err = functions.AddSession(w, r, id)
		if err != nil {
			fmt.Println("error adding session")
			responseData["login"] = "failure"
			responseData["message"] = "session error"
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(responseData)
			return
		}

		responseData["user"], err = functions.GetUser(id)

		if err != nil {
			fmt.Println("error getting user username", err)
			responseData["login"] = "failure"
			responseData["message"] = "error getting username from id"
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

func Posts(w http.ResponseWriter, r *http.Request) {
	responseData := make(map[string]interface{})

	// checks if logged in
	id, username, loggedIn := functions.CheckLogin(w, r)

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
		posts, err := functions.GetPosts(id)
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
		post_likes, err := functions.GetAllPostLikes()
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
		post, err = functions.GetOnePost(post.Id, id)
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
		post_likes, err := functions.GetOnePostLike(post.Id)
		if err != nil {
			fmt.Println("err getting one post like", err)
			responseData["post"] = "failure"
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(responseData)
			return
		}
		responseData["post_likes"] = post_likes

		// gets all comments for the post
		comments, err := functions.GetComments(post.Id, id)
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
		comment_likes, err := functions.GetCommentLikes(post.Id)
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

func NewPost(w http.ResponseWriter, r *http.Request) {

	responseData := make(map[string]interface{})

	// checks if logged in
	id, username, loggedIn := functions.CheckLogin(w, r)

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
		err = functions.CreatePost(post)
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

func newComment(w http.ResponseWriter, r *http.Request) {
	responseData := make(map[string]interface{})
	// checks if logged in
	id, username, loggedIn := functions.CheckLogin(w, r)

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
		user, err := functions.GetUser(id)
		if err != nil {
			responseData["newComment"] = "failure"
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(responseData)
			return
		}

		comment.Creator = user.Name

		// adds comment to db
		err = functions.CreateComment(comment)
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

func ChangeLikes(w http.ResponseWriter, r *http.Request) {
	responseData := make(map[string]interface{})
	// checks if logged in
	id, username, loggedIn := functions.CheckLogin(w, r)

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
			err := functions.AddPostLike(like.Post_id, id, like.Like)
			if err != nil {
				responseData["like"] = "failure"
				w.Header().Set("Content-Type", "application/json")
				json.NewEncoder(w).Encode(responseData)
				return
			}
		}

		// if a comment is getting liked
		if like.Comment {
			err := functions.AddCommentLike(like.Post_id, like.Comment_id, id, like.Like)
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

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}

var (
	connections = make(map[*websocket.Conn]map[string]interface{})
	mu          sync.Mutex
)

func newWebsocket(w http.ResponseWriter, r *http.Request) {

	responseData := make(map[string]interface{})
	// checks if logged in
	id, username, loggedIn := functions.CheckLogin(w, r)

	responseData["loggedIn"] = loggedIn
	responseData["id"] = id
	responseData["username"] = username

	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		fmt.Println("error upgrading", err)
		return
	}
	defer func() {
		mu.Lock()
		fmt.Println("leaving connection", connections[conn])
		delete(connections, conn)
		conn.Close()
		err = functions.ChangeOnline(id, -1)
		if err != nil {
			fmt.Println("error changing online status -1", err)
		}
		// send status change to every online user

		for msgConn, value := range connections {
			statusChangeResponse := make(map[string]interface{})
			statusChangeResponse["statusChange"] = true
			statusChangeResponse["username"] = value["username"]
			statusChangeResponse["id"] = value["id"]
			statusChangeResponse["statusChangeUsername"] = username
			statusChangeResponse["statusChangeId"] = id
			statusChangeResponse["online"] = -1

			// msgType := value["messageType"]

			jsonMsg, err := json.Marshal(statusChangeResponse)

			if err != nil {
				fmt.Println("error marshaling", msgConn, err)
			}

			if err := msgConn.WriteMessage(1, jsonMsg); err != nil {
				fmt.Println("error writing message")
			}
		}
		mu.Unlock()
	}()

	if !loggedIn {
		responseData["error"] = "not logged in"
		jsonResponse, err := json.Marshal(responseData)
		if err != nil {
			fmt.Println("error marshaling !login responsedata", err)
			return
		}
		conn.WriteMessage(websocket.TextMessage, jsonResponse)
		return
	}
	fmt.Println("connections:")
	mu.Lock()
	fmt.Println(connections)
	mu.Unlock()

	// make online
	err = functions.ChangeOnline(id, 1)
	if err != nil {
		fmt.Println("error changing online status", err)
	}

	// send online status change

	mu.Lock()
	for msgConn, value := range connections {
		// if msgConn == conn {
		// 	return
		// }
		statusChangeResponse := make(map[string]interface{})
		statusChangeResponse["statusChange"] = true
		statusChangeResponse["username"] = value["username"]
		statusChangeResponse["id"] = value["id"]
		statusChangeResponse["statusChangeUsername"] = username
		statusChangeResponse["statusChangeId"] = id
		statusChangeResponse["online"] = 1

		jsonMsg, err := json.Marshal(statusChangeResponse)

		if err != nil {
			fmt.Println("error marshaling", msgConn, err)
		}

		if err := msgConn.WriteMessage(1, jsonMsg); err != nil {
			fmt.Println("error writing message")
		}
	}
	mu.Unlock()
	mu.Lock()
	connections[conn] = map[string]interface{}{
		"id":       id,
		"username": username,
	}
	mu.Unlock()
	for {
		messageType, p, err := conn.ReadMessage()
		if err != nil {
			fmt.Println("err reading message", err)
			return
		}
		// mu.Lock()
		// connections[conn]["messageType"] = messageType
		// mu.Unlock()

		var msgData functions.MessageData

		err = json.Unmarshal(p, &msgData)

		if err != nil {
			fmt.Println("error unmarshaling msgdata", err)
		}

		fmt.Println("message received:", msgData)

		// add message to db

		err = functions.AddMessage(msgData.Message, msgData.Receiver_id, id)
		if err != nil {
			fmt.Println("error adding message to db", err)
		}

		// send message to receiver

		mu.Lock()

		for msgConn, value := range connections {
			if value["id"] == msgData.Receiver_id {
				msgResponseData := make(map[string]interface{})
				msgResponseData["message"] = msgData.Message
				if msgData.Receiver_id == id {
					msgResponseData["receiver"] = false
				} else {
					msgResponseData["receiver"] = true
				}
				msgResponseData["written_at"] = time.Now()
				msgResponseData["msgResponse"] = true
				msgResponseData["written_by"] = username
				msgResponseData["writer_id"] = id
				receiverName, _ := functions.GetUser(msgData.Receiver_id)
				msgResponseData["username"] = receiverName.Name
				msgResponseData["statusChange"] = false

				jsonMsg, err := json.Marshal(msgResponseData)

				if err != nil {
					fmt.Println("error marshaling", msgConn, err)
				}

				if err := msgConn.WriteMessage(messageType, jsonMsg); err != nil {
					fmt.Println("error writing message")
				}
			}
		}

		mu.Unlock()

		responseData["message"] = msgData.Message
		responseData["receiver_id"] = msgData.Receiver_id
		responseData["sender_id"] = id
		responseData["written_at"] = time.Now()
		responseData["websocket"] = "success"
		responseData["msgResponse"] = false
		responseData["written_by"] = username
		if msgData.Receiver_id == id {
			responseData["receiver"] = true
		} else {
			responseData["receiver"] = false
		}
		responseData["statusChange"] = false
		// responseData["message"] = string(p)

		jsonResponse, err := json.Marshal(responseData)
		if err != nil {
			fmt.Println("error marshaling responsedata", err)
		}

		if err := conn.WriteMessage(messageType, jsonResponse); err != nil {
			fmt.Println("error writing message", err)
			return
		}

	}

}

func getUsers(w http.ResponseWriter, r *http.Request) {

	responseData := make(map[string]interface{})
	// checks if logged in
	id, username, loggedIn := functions.CheckLogin(w, r)

	responseData["loggedIn"] = loggedIn
	responseData["id"] = id
	responseData["username"] = username

	// if not logged in sends responeData["loggedIn"] as false
	if !loggedIn {
		fmt.Println("not logged in")
		responseData["getUsers"] = "failure"
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(responseData)
		return
	}

	if r.Method == "GET" {
		users, err := functions.GetAllUsers()
		if err != nil {
			fmt.Println("error getting all users", err)
			responseData["getUsers"] = "failure"
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(responseData)
			return
		}

		latestMessagedUsers, err := functions.GetLatestMessages(id)
		if err != nil {
			fmt.Println("error getting latest messages", err)
			responseData["getUsers"] = "failure"
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(responseData)
			return
		}

		sortedUsers, err := functions.SortUsers(users, latestMessagedUsers, id)
		if err != nil {
			fmt.Println("error sorting users", err)
			responseData["getUsers"] = "failure"
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(responseData)
			return
		}
		fmt.Println(latestMessagedUsers)
		fmt.Println(sortedUsers)

		responseData["allUsers"] = sortedUsers
		responseData["getUsers"] = "success"
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(responseData)
	}
}

func getMessages(w http.ResponseWriter, r *http.Request) {

	responseData := make(map[string]interface{})
	// checks if logged in
	id, username, loggedIn := functions.CheckLogin(w, r)

	responseData["loggedIn"] = loggedIn
	responseData["id"] = id
	responseData["username"] = username

	// if not logged in sends responeData["loggedIn"] as false
	if !loggedIn {
		fmt.Println("not logged in")
		responseData["getMessages"] = "failure"
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(responseData)
		return
	}

	if r.Method == "POST" {
		fmt.Println()

		var requestMessage functions.RequestMessage

		err := json.NewDecoder(r.Body).Decode(&requestMessage)

		if err != nil {
			fmt.Println("error getMessages", err)
			responseData["getMessages"] = "failure"
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(responseData)
			return
		}
		messages, err := functions.GetAllMessages(id, requestMessage.Id)

		if err != nil {
			fmt.Println("error getMessages", err)
			responseData["getMessages"] = "failure"
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(responseData)
			return
		}
		fmt.Println(messages)

		msgPartner, _ := functions.GetUser(requestMessage.Id)

		responseData["messagePartner"] = msgPartner.Name
		responseData["getMessages"] = "success"
		responseData["messages"] = messages
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(responseData)
	}
}
