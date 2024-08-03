package main

import "net/http"

func Routes() http.Handler {
	mux := http.NewServeMux()

	// different pages
	mux.HandleFunc("/", Mainpage)
	mux.HandleFunc("/api/register", Register)
	mux.HandleFunc("/api/login", Login)
	mux.HandleFunc("/api/posts", Posts)
	mux.HandleFunc("/api/newPost", NewPost)
	mux.HandleFunc("/api/newComment", newComment)
	mux.HandleFunc("/api/changeLikes", ChangeLikes)
	mux.HandleFunc("/api/websocket", newWebsocket)
	mux.HandleFunc("/api/getUsers", getUsers)
	mux.HandleFunc("/api/getMessages", getMessages)

	// so js scripts works
	fileServer := http.FileServer(http.Dir("./static"))
	mux.Handle("/static/", http.StripPrefix("/static", fileServer))
	return mux
}
