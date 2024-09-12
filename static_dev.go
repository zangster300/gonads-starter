//go:build dev
// +build dev

package main

import (
	"fmt"
	"net/http"
	"os"
)

func static() http.Handler {
	fmt.Println("static files setup for development")
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Cache-Control", "no-store")
		http.StripPrefix("/static/", http.FileServerFS(os.DirFS("static"))).ServeHTTP(w, r)
	})
}
