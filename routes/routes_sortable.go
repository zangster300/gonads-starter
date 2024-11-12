package routes

import (
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/zangster300/northstar/web/components"
)

func setupSortableRoute(router chi.Router) error {
	router.Get("/sortable", func(w http.ResponseWriter, r *http.Request) {
		components.SortableInitial().Render(r.Context(), w)
		return
	})

	return nil
}
