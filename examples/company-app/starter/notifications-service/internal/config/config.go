// Package config reads the service's settings from environment variables.
//
// Every setting comes from the environment (see SPEC.md, "Conventions for
// every backend service"), so the same container image runs unchanged on a
// laptop, in docker compose, and in Kubernetes.
package config

import (
	"errors"
	"os"
	"strconv"
)

// Config holds everything the service needs to start.
type Config struct {
	// Port is the HTTP listen port (PORT, default 8080).
	Port int
	// RabbitMQURL is the AMQP connection string (RABBITMQ_URL, required).
	RabbitMQURL string
	// AuthToken, when non-empty, protects /api/* with a bearer token
	// (AUTH_TOKEN, default unset = no auth).
	AuthToken string
	// ServiceName names this service in telemetry (OTEL_SERVICE_NAME).
	ServiceName string
}

// DefaultServiceName is used when OTEL_SERVICE_NAME is not set.
const DefaultServiceName = "notifications-service"

// Load reads the configuration using os.Getenv.
func Load() (Config, error) {
	return LoadFrom(os.Getenv)
}

// LoadFrom reads the configuration through getenv, which makes it easy to
// test without touching the real process environment.
func LoadFrom(getenv func(string) string) (Config, error) {
	cfg := Config{
		Port:        8080,
		RabbitMQURL: getenv("RABBITMQ_URL"),
		AuthToken:   getenv("AUTH_TOKEN"),
		ServiceName: getenv("OTEL_SERVICE_NAME"),
	}
	if cfg.ServiceName == "" {
		cfg.ServiceName = DefaultServiceName
	}
	if p := getenv("PORT"); p != "" {
		port, err := strconv.Atoi(p)
		if err != nil || port < 1 || port > 65535 {
			return Config{}, errors.New("PORT must be a number between 1 and 65535")
		}
		cfg.Port = port
	}
	if cfg.RabbitMQURL == "" {
		return Config{}, errors.New("RABBITMQ_URL is required, e.g. amqp://guest:guest@localhost:5672/")
	}
	return cfg, nil
}
