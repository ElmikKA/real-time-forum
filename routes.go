package main

import "net/http"

func Routes() http.Handler {
	mux := http.NewServeMux()

	// different pages
	mux.HandleFunc("/", Mainpage)
	mux.HandleFunc("/api/register", Register)
	// mux.HandleFunc("/api/login", Login)

	// so js scripts wor
	fileServer := http.FileServer(http.Dir("./static"))
	mux.Handle("/static/", http.StripPrefix("/static", fileServer))
	return mux
}
