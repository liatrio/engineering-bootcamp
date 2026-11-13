// Command notifications-service consumes every event on the company.events
// RabbitMQ exchange and serves the latest 100 as GET /api/notifications.
package main

import (
	"context"
	"errors"
	"fmt"
	"log/slog"
	"net/http"
	"os"
	"os/signal"
	"strconv"
	"sync"
	"syscall"
	"time"

	"github.com/liatrio/engineering-bootcamp/examples/company-app/starter/notifications-service/internal/config"
	"github.com/liatrio/engineering-bootcamp/examples/company-app/starter/notifications-service/internal/consumer"
	"github.com/liatrio/engineering-bootcamp/examples/company-app/starter/notifications-service/internal/httpapi"
	"github.com/liatrio/engineering-bootcamp/examples/company-app/starter/notifications-service/internal/store"
	"github.com/liatrio/engineering-bootcamp/examples/company-app/starter/notifications-service/internal/telemetry"
)

func main() {
	if err := run(); err != nil {
		slog.Error("notifications-service stopped", "error", err)
		os.Exit(1)
	}
}

func run() error {
	// Cancel ctx on Ctrl+C or `docker stop` (SIGTERM) for a graceful shutdown.
	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()

	cfg, err := config.Load()
	if err != nil {
		return err
	}

	log, shutdownTelemetry, err := telemetry.Setup(ctx, cfg.ServiceName, os.Stdout)
	if err != nil {
		return fmt.Errorf("telemetry: %w", err)
	}
	slog.SetDefault(log)
	defer func() {
		// Flush buffered spans, metrics, and logs before exiting.
		flushCtx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()
		if err := shutdownTelemetry(flushCtx); err != nil {
			fmt.Fprintln(os.Stderr, "telemetry shutdown:", err)
		}
	}()

	notifications := store.New(store.Capacity)
	events := consumer.New(cfg.RabbitMQURL, notifications, log)

	// The consumer runs in the background and reconnects on its own, so the
	// HTTP server starts even when RabbitMQ isn't up yet.
	var wg sync.WaitGroup
	wg.Go(func() { events.Run(ctx) })

	srv := &http.Server{
		Addr:              ":" + strconv.Itoa(cfg.Port),
		Handler:           httpapi.NewHandler(notifications, events.Ready, cfg.AuthToken),
		ReadHeaderTimeout: 5 * time.Second,
	}
	serveErr := make(chan error, 1)
	go func() {
		log.Info("listening", "port", cfg.Port, "auth", cfg.AuthToken != "")
		serveErr <- srv.ListenAndServe()
	}()

	select {
	case err := <-serveErr:
		stop()
		wg.Wait()
		return err
	case <-ctx.Done():
	}

	log.Info("shutting down")
	shutdownCtx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	err = srv.Shutdown(shutdownCtx) // finish in-flight requests
	wg.Wait()                       // consumer closes its channel and connection
	if errors.Is(err, http.ErrServerClosed) {
		err = nil
	}
	return err
}
