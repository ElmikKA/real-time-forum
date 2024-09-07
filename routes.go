package main

import (
	"net/http"
	"strings"
)

func Routes() http.Handler {
	mux := http.NewServeMux()

	// different pages
	mux.HandleFunc("/", Mainpage)
	mux.HandleFunc("/api/register", Register)
	mux.HandleFunc("/api/login", Login)
	mux.HandleFunc("/api/logout", LogOut)
	mux.HandleFunc("/api/posts", Posts)
	mux.HandleFunc("/api/newPost", NewPost)
	mux.HandleFunc("/api/newComment", newComment)
	mux.HandleFunc("/api/changeLikes", ChangeLikes)
	mux.HandleFunc("/api/websocket", newWebsocket)
	mux.HandleFunc("/api/getUsers", getUsers)
	mux.HandleFunc("/api/getMessages", getMessages)
	mux.HandleFunc("/api/deletePost", deletePost)
	mux.HandleFunc("/api/checkLoggedIn", checkLoggedIn)

	// so js scripts works
	mux.Handle("/static/", http.StripPrefix("/static", http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Set MIME type for .js files
		if strings.HasSuffix(r.URL.Path, ".js") {
			w.Header().Set("Content-Type", "application/javascript")
		}
		http.FileServer(http.Dir("./frontend/static")).ServeHTTP(w, r)
	})))
	return mux
}
