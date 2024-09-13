package handlers

import (
	"context"
	"errors"
	"fmt"
	"log/slog"
	"time"

	"github.com/delaneyj/toolbelt"
	"github.com/go-chi/chi/v5"
	"github.com/gorilla/sessions"
)

func SetupRoutes(logger *slog.Logger, router chi.Router) error {
	ns, err := toolbelt.NewEmbeddedNATsServer(context.Background(), true)
	if err != nil {
		return fmt.Errorf("error creating embedded nats server: %w", err)
	}
	ns.WaitForServer()

	sessionStore := sessions.NewCookieStore([]byte("gonads-session-secret"))
	sessionStore.MaxAge(int(24 * time.Hour / time.Second))

	if err := errors.Join(
		SetupIndexRoute(router, sessionStore, ns),
		SetupCounterRoute(router, sessionStore),
	); err != nil {
		return fmt.Errorf("error setting up routes: %w", err)
	}

	return nil
}
