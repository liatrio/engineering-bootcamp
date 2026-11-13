// Package httpapi serves the notifications HTTP API.
package httpapi

import (
	"crypto/subtle"
	"encoding/json"
	"net/http"

	"go.opentelemetry.io/contrib/instrumentation/net/http/otelhttp"

	"github.com/liatrio/engineering-bootcamp/examples/company-app/starter/notifications-service/internal/store"
)

// Lister is the part of the store the API needs.
type Lister interface {
	List() []store.Notification
}

// NewHandler builds the HTTP handler.
//   - ready reports whether RabbitMQ is connected (for /readyz).
//   - authToken, when non-empty, protects /api/* with a bearer token.
func NewHandler(notifications Lister, ready func() bool, authToken string) http.Handler {
	mux := http.NewServeMux()

	// Go 1.22+ patterns include the method, so a POST here gets 405.
	mux.HandleFunc("GET /api/notifications", requireToken(authToken, func(w http.ResponseWriter, r *http.Request) {
		writeJSON(w, http.StatusOK, notifications.List())
	}))

	// Liveness: the process is up. Checks nothing else.
	mux.HandleFunc("GET /healthz", func(w http.ResponseWriter, r *http.Request) {
		writeJSON(w, http.StatusOK, map[string]string{"status": "ok"})
	})

	// Readiness: connected to RabbitMQ.
	mux.HandleFunc("GET /readyz", func(w http.ResponseWriter, r *http.Request) {
		if !ready() {
			writeJSON(w, http.StatusServiceUnavailable, map[string]string{"status": "unavailable", "rabbitmq": "disconnected"})
			return
		}
		writeJSON(w, http.StatusOK, map[string]string{"status": "ok", "rabbitmq": "connected"})
	})

	// otelhttp starts a server span per request and continues any incoming
	// traceparent. After the mux matches a route, otelhttp records it as
	// http.route and calls the formatter again, so spans are named
	// "GET /api/notifications". Health checks run every few seconds, so we
	// leave them out of the traces.
	return otelhttp.NewHandler(mux, "http.server",
		otelhttp.WithSpanNameFormatter(func(_ string, r *http.Request) string {
			if r.Pattern != "" {
				return r.Pattern
			}
			return r.Method
		}),
		otelhttp.WithFilter(func(r *http.Request) bool {
			return r.URL.Path != "/healthz" && r.URL.Path != "/readyz"
		}),
	)
}

// requireToken enforces "Authorization: Bearer <token>" when token is set.
// An empty token means auth is off (the Chapter 3 default).
func requireToken(token string, next http.HandlerFunc) http.HandlerFunc {
	if token == "" {
		return next
	}
	want := []byte("Bearer " + token)
	return func(w http.ResponseWriter, r *http.Request) {
		got := []byte(r.Header.Get("Authorization"))
		// Constant-time comparison avoids leaking the token through timing.
		if subtle.ConstantTimeCompare(got, want) != 1 {
			w.Header().Set("WWW-Authenticate", `Bearer realm="company"`)
			writeProblem(w, http.StatusUnauthorized, "Unauthorized",
				"A valid 'Authorization: Bearer <token>' header is required.")
			return
		}
		next(w, r)
	}
}

// problem is an RFC 9457 Problem Details body.
type problem struct {
	Type   string `json:"type"`
	Title  string `json:"title"`
	Status int    `json:"status"`
	Detail string `json:"detail,omitempty"`
}

func writeProblem(w http.ResponseWriter, status int, title, detail string) {
	w.Header().Set("Content-Type", "application/problem+json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(problem{Type: "about:blank", Title: title, Status: status, Detail: detail})
}

func writeJSON(w http.ResponseWriter, status int, v any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(v)
}
