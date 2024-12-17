package routes

import (
	"context"
	"errors"
	"fmt"
	"log/slog"
	"time"

	"github.com/delaneyj/toolbelt"
	"github.com/delaneyj/toolbelt/embeddednats"
	"github.com/go-chi/chi/v5"
	"github.com/gorilla/sessions"
	natsserver "github.com/nats-io/nats-server/v2/server"
)

func SetupRoutes(ctx context.Context, logger *slog.Logger, router chi.Router) (cleanup func() error, err error) {
	natsPort, err := toolbelt.FreePort()
	if err != nil {
		return nil, fmt.Errorf("error getting free port: %w", err)
	}

	ns, err := embeddednats.New(ctx, embeddednats.WithNATSServerOptions(&natsserver.Options{
		JetStream: true,
		Port:      natsPort,
	}))

	if err != nil {
		return nil, fmt.Errorf("error creating embedded nats server: %w", err)
	}

	ns.WaitForServer()

	cleanup = func() error {
		return errors.Join(
			ns.Close(),
		)
	}

	sessionStore := sessions.NewCookieStore([]byte("session-secret"))
	sessionStore.MaxAge(int(24 * time.Hour / time.Second))

	if err := errors.Join(
		setupIndexRoute(router, sessionStore, ns),
		setupCounterRoute(router, sessionStore),
		setupMonitorRoute(logger, router),
		setupSortableRoute(router),
	); err != nil {
		return cleanup, fmt.Errorf("error setting up routes: %w", err)
	}

	return cleanup, nil
}
