package main

import "net/http"

func (app *application) Routes() http.Handler {
	mux := http.NewServeMux()

	// different pages
	mux.HandleFunc("/", app.Mainpage)
	mux.HandleFunc("/api/register", app.Register)
	mux.HandleFunc("/api/login", app.Login)
	mux.HandleFunc("/api/posts", app.Posts)
	mux.HandleFunc("/api/newPost", app.NewPost)
	mux.HandleFunc("/api/newComment", app.newComment)
	mux.HandleFunc("/api/changeLikes", app.ChangeLikes)

	// so js scripts works
	fileServer := http.FileServer(http.Dir("./static"))
	mux.Handle("/static/", http.StripPrefix("/static", fileServer))
	return mux
}
