package httpapi

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"go.opentelemetry.io/otel"
	sdktrace "go.opentelemetry.io/otel/sdk/trace"
	"go.opentelemetry.io/otel/sdk/trace/tracetest"

	"github.com/liatrio/engineering-bootcamp/examples/company-app/starter/notifications-service/internal/store"
)

func seeded() *store.Store {
	s := store.New(10)
	s.Add(store.Notification{ID: "a", Type: "employee.created", Message: "first", OccurredAt: time.Date(2026, 1, 5, 10, 0, 0, 0, time.UTC)})
	s.Add(store.Notification{ID: "b", Type: "employee.deleted", Message: "second", TraceID: "4bf92f3577b34da6a3ce929d0e0e4736"})
	return s
}

func do(t *testing.T, h http.Handler, method, path, auth string) *httptest.ResponseRecorder {
	t.Helper()
	req := httptest.NewRequest(method, path, nil)
	if auth != "" {
		req.Header.Set("Authorization", auth)
	}
	rec := httptest.NewRecorder()
	h.ServeHTTP(rec, req)
	return rec
}

func alwaysReady() bool { return true }

func TestListNotificationsNewestFirst(t *testing.T) {
	rec := do(t, NewHandler(seeded(), alwaysReady, ""), "GET", "/api/notifications", "")
	if rec.Code != 200 || rec.Header().Get("Content-Type") != "application/json" {
		t.Fatalf("status %d, content-type %q", rec.Code, rec.Header().Get("Content-Type"))
	}
	var got []map[string]any
	if err := json.Unmarshal(rec.Body.Bytes(), &got); err != nil {
		t.Fatal(err)
	}
	if len(got) != 2 || got[0]["id"] != "b" || got[1]["id"] != "a" {
		t.Fatalf("got %v", got)
	}
	// camelCase field names from SPEC.md
	for _, k := range []string{"id", "type", "message", "occurredAt", "traceId"} {
		if _, ok := got[0][k]; !ok {
			t.Errorf("missing field %q", k)
		}
	}
	if got[1]["occurredAt"] != "2026-01-05T10:00:00Z" {
		t.Errorf("occurredAt = %v", got[1]["occurredAt"])
	}
}

func TestListEmptyIsArray(t *testing.T) {
	rec := do(t, NewHandler(store.New(1), alwaysReady, ""), "GET", "/api/notifications", "")
	if body := rec.Body.String(); body != "[]\n" {
		t.Fatalf("body = %q, want []", body)
	}
}

func TestMethodNotAllowed(t *testing.T) {
	rec := do(t, NewHandler(seeded(), alwaysReady, ""), "POST", "/api/notifications", "")
	if rec.Code != http.StatusMethodNotAllowed {
		t.Fatalf("status %d", rec.Code)
	}
}

func TestHealthz(t *testing.T) {
	rec := do(t, NewHandler(seeded(), func() bool { return false }, "tok"), "GET", "/healthz", "")
	if rec.Code != 200 || rec.Body.String() != "{\"status\":\"ok\"}\n" {
		t.Fatalf("status %d body %q", rec.Code, rec.Body.String())
	}
}

func TestReadyz(t *testing.T) {
	ready := false
	h := NewHandler(seeded(), func() bool { return ready }, "tok")
	if rec := do(t, h, "GET", "/readyz", ""); rec.Code != http.StatusServiceUnavailable {
		t.Fatalf("not connected: status %d", rec.Code)
	}
	ready = true
	if rec := do(t, h, "GET", "/readyz", ""); rec.Code != http.StatusOK {
		t.Fatalf("connected: status %d", rec.Code)
	}
}

func TestAuth(t *testing.T) {
	h := NewHandler(seeded(), alwaysReady, "s3cret")
	tests := []struct {
		name, auth string
		want       int
	}{
		{"no header", "", 401},
		{"wrong token", "Bearer nope", 401},
		{"wrong scheme", "Basic s3cret", 401},
		{"valid token", "Bearer s3cret", 200},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			rec := do(t, h, "GET", "/api/notifications", tt.auth)
			if rec.Code != tt.want {
				t.Fatalf("status %d, want %d", rec.Code, tt.want)
			}
			if tt.want == 401 && rec.Header().Get("Content-Type") != "application/problem+json" {
				t.Fatalf("401 must be problem+json, got %q", rec.Header().Get("Content-Type"))
			}
		})
	}
}

func TestServerSpanIsNamedAfterRoute(t *testing.T) {
	rec := tracetest.NewSpanRecorder()
	prev := otel.GetTracerProvider()
	otel.SetTracerProvider(sdktrace.NewTracerProvider(sdktrace.WithSpanProcessor(rec)))
	t.Cleanup(func() { otel.SetTracerProvider(prev) })

	h := NewHandler(seeded(), alwaysReady, "")
	do(t, h, "GET", "/api/notifications", "")
	do(t, h, "GET", "/healthz", "") // filtered out

	ended := rec.Ended()
	if len(ended) != 1 || ended[0].Name() != "GET /api/notifications" {
		names := []string{}
		for _, s := range ended {
			names = append(names, s.Name())
		}
		t.Fatalf("spans = %v, want [GET /api/notifications]", names)
	}
}
