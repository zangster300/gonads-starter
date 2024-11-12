package routes

import (
	"net/http"
	"sync/atomic"

	"github.com/Jeffail/gabs/v2"
	"github.com/delaneyj/datastar"
	"github.com/go-chi/chi/v5"
	"github.com/gorilla/sessions"
	"github.com/zangster300/northstar/web/components"
)

func setupCounterRoute(router chi.Router, sessionStore sessions.Store) error {

	router.Get("/counter", func(w http.ResponseWriter, r *http.Request) {
		components.CounterInitial().Render(r.Context(), w)
	})

	var globalCounter atomic.Uint32
	const (
		sessionKey = "counter"
		countKey   = "count"
	)

	GetUserValue := func(r *http.Request) (uint32, *sessions.Session, error) {
		session, err := sessionStore.Get(r, sessionKey)
		if err != nil {
			return 0, nil, err
		}

		val, ok := session.Values[countKey].(uint32)
		if !ok {
			val = 0
		}
		return val, session, nil
	}

	router.Get("/counter/data", func(w http.ResponseWriter, r *http.Request) {
		userCount, _, err := GetUserValue(r)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
		}

		store := components.CounterStore{
			Global: globalCounter.Load(),
			User:   userCount,
		}

		sse := datastar.NewSSE(w, r)
		datastar.RenderFragmentTempl(sse, components.Counter(store))
	})

	updateGlobal := func(store *gabs.Container) {
		store.Set(globalCounter.Add(1), "global")
	}

	router.Route("/counter/increment", func(incrementRouter chi.Router) {
		incrementRouter.Post("/global", func(w http.ResponseWriter, r *http.Request) {
			update := gabs.New()
			updateGlobal(update)

			sse := datastar.NewSSE(w, r)
			datastar.PatchStore(sse, update)
		})

		incrementRouter.Post("/user", func(w http.ResponseWriter, r *http.Request) {
			val, sess, err := GetUserValue(r)
			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
			}

			val++
			sess.Values[countKey] = val
			if err := sess.Save(r, w); err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
			}

			update := gabs.New()
			updateGlobal(update)
			update.Set(val, "user")

			sse := datastar.NewSSE(w, r)
			datastar.PatchStore(sse, update)
		})
	})

	return nil
}
