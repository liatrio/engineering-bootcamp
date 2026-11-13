// Package store keeps the most recent notifications in memory.
//
// Notifications are a read model: a view built from events that live
// elsewhere (in the employees and assignments databases). Losing this view
// on restart is acceptable, so a fixed-size in-memory ring buffer is enough.
package store

import (
	"sync"
	"time"
)

// Capacity is how many notifications the service remembers (SPEC.md).
const Capacity = 100

// Notification is one entry in GET /api/notifications.
type Notification struct {
	ID         string    `json:"id"`
	Type       string    `json:"type"`
	Message    string    `json:"message"`
	OccurredAt time.Time `json:"occurredAt"`
	TraceID    string    `json:"traceId"`
}

// Store is a thread-safe ring buffer. The consumer goroutine writes to it
// while HTTP handlers read from it, so every access takes the mutex.
type Store struct {
	mu    sync.RWMutex
	items []Notification // fixed length = capacity once full
	next  int            // index the next Add writes to
	count int            // how many slots hold data (<= capacity)
}

// New returns a store that holds up to capacity notifications.
// A capacity below 1 falls back to Capacity.
func New(capacity int) *Store {
	if capacity < 1 {
		capacity = Capacity
	}
	return &Store{items: make([]Notification, capacity)}
}

// Add records n, overwriting the oldest entry once the buffer is full.
func (s *Store) Add(n Notification) {
	s.mu.Lock()
	defer s.mu.Unlock()
	s.items[s.next] = n
	s.next = (s.next + 1) % len(s.items)
	if s.count < len(s.items) {
		s.count++
	}
}

// List returns a copy of the stored notifications, newest first.
// It never returns nil, so the JSON response is [] rather than null.
func (s *Store) List() []Notification {
	s.mu.RLock()
	defer s.mu.RUnlock()
	out := make([]Notification, 0, s.count)
	for i := 1; i <= s.count; i++ {
		// Walk backwards from the most recently written slot.
		idx := (s.next - i + len(s.items)) % len(s.items)
		out = append(out, s.items[idx])
	}
	return out
}
