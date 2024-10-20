//go:build !dev
// +build !dev

package main

import (
	"embed"
	"io/fs"
	"log/slog"
	"net/http"
)

//go:embed web/static/*
var staticFS embed.FS
var staticRootFS, _ = fs.Sub(staticFS, "web/static")

func static(logger *slog.Logger) http.Handler {
	logger.Debug("Static assets are embedded")
	return http.FileServerFS(staticRootFS)
}
