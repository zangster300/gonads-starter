//go:build !dev
// +build !dev

package main

import (
	"embed"
	"net/http"
)

//go:embed static
var staticFS embed.FS

func static() http.Handler {
	return http.FileServerFS(staticFS)
}
