package routes

import (
	"gonads-starter/web/components"
	"net/http"

	"github.com/go-chi/chi/v5"
)

func setupSortableRoute(router chi.Router) error {
	router.Get("/sortable", func(w http.ResponseWriter, r *http.Request) {
		components.SortableInitial().Render(r.Context(), w)
		return
	})

	return nil
}
