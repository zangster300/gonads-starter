//go:build dev
// +build dev

package main

import (
	"log/slog"
	"net/http"
	"os"
)

func static() http.Handler {
	logger := slog.New(slog.NewJSONHandler(os.Stdout, nil))
	logger.Info("Static assets are being served from /static/")
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Cache-Control", "no-store")
		http.StripPrefix("/static/", http.FileServerFS(os.DirFS("static"))).ServeHTTP(w, r)
	})
}
