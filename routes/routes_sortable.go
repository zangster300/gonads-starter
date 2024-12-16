package routes

import (
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/zangster300/northstar/web/pages"
)

func setupSortableRoute(router chi.Router) error {
	router.Get("/sortable", func(w http.ResponseWriter, r *http.Request) {
		pages.SortableInitial().Render(r.Context(), w)
		return
	})

	return nil
}
