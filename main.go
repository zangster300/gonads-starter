// package main

// import (
// 	"context"
// 	"fmt"
// 	"gonads-starter/routes"
// 	"log/slog"
// 	"net/http"
// 	"os"
// 	"os/signal"

// 	"github.com/go-chi/chi/v5"
// 	"github.com/go-chi/chi/v5/middleware"
// 	"golang.org/x/sync/errgroup"
// )

// const port = 8080

// func main() {
// 	logger := slog.New(slog.NewJSONHandler(os.Stdout, nil))
// 	logger.Info(fmt.Sprintf("Starting Server @:%d", port))
// 	defer logger.Info("Stopping Server")

// 	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt)
// 	defer stop()

// 	if err := run(ctx, logger); err != nil {
// 		logger.Error("Error running server", slog.Any("err", err))
// 		os.Exit(1)
// 	}
// }

// func run(ctx context.Context, logger *slog.Logger) error {
// 	g, ctx := errgroup.WithContext(ctx)

// 	g.Go(startServer(ctx, logger, port))

// 	if err := g.Wait(); err != nil {
// 		return fmt.Errorf("error running server: %w", err)
// 	}

// 	return nil
// }

// func startServer(ctx context.Context, logger *slog.Logger, port int) func() error {
// 	return func() error {
// 		router := chi.NewMux()

// 		router.Use(
// 			middleware.Logger,
// 			middleware.Recoverer,
// 		)

// 		router.Handle("/static/*", http.StripPrefix("/static/", static(logger)))

// 		routes.SetupRoutes(logger, router)

// 		srv := &http.Server{
// 			Addr:    fmt.Sprintf("localhost:%d", port),
// 			Handler: router,
// 		}

// 		go func() {
// 			<-ctx.Done()
// 			srv.Shutdown(context.Background())
// 		}()

// 		return srv.ListenAndServe()
// 	}
// }

package main

import (
	"fmt"
	"log"
	"net/http"

	convex "gonads-starter/db_functions"
	"gonads-starter/web/components"

	"github.com/delaneyj/datastar"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
)

type User struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

func main() {

	db := convex.NewConvexDB("https://peaceful-ptarmigan-526.convex.cloud")

	// Example: Load all task

	router := chi.NewMux()
	router.Use(middleware.Logger)

	router.Get("/", func(w http.ResponseWriter, r *http.Request) {
		tasks, err := db.LoadAllTasks()
		if err != nil {
			log.Fatalf("Failed to load tasks: %v", err)
		}

		// Print all tasks
		for _, task := range tasks {
			fmt.Printf("Task ID: %s, Text: %s, Completed: %t\n", task.ID, task.Text, task.IsCompleted)
		}

		taskComponents := make([]*components.Task, len(tasks))
		for i, task := range tasks {
			taskComponents[i] = &components.Task{ID: task.ID, Text: task.Text, Completed: task.IsCompleted}
		}

		components.TaskContainer(taskComponents).Render(r.Context(), w)
	})

	router.Post("/api/tasks/{id}/toggle", func(w http.ResponseWriter, r *http.Request) {
		id := chi.URLParam(r, "id")
		fmt.Println("Toggling task with ID:", id)
		err := db.ToggleTask(id)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		task, err := db.LoadTask(id)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		sse := datastar.NewSSE(w, r)

		c := components.TaskItem(task.ID, task.Text, task.IsCompleted)
		datastar.RenderFragmentTempl(sse, c)
	})

	http.ListenAndServe(":4000", router)

}
