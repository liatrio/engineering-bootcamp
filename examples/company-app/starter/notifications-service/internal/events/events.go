// Package events describes the envelope every Company event is wrapped in
// and turns events into human-readable notification text.
package events

import (
	"fmt"
	"time"
)

// Envelope wraps every event published to the company.events exchange
// (SPEC.md, "Events (RabbitMQ)").
type Envelope struct {
	EventID    string         `json:"eventId"`
	Type       string         `json:"type"`
	OccurredAt time.Time      `json:"occurredAt"`
	Source     string         `json:"source"`
	Data       map[string]any `json:"data"`
}

// Message returns the notification text for an event. Unknown event types
// still produce a notification, so new publishers show up without a code
// change here.
func Message(eventType string, data map[string]any) string {
	switch eventType {
	case "employee.created":
		return fmt.Sprintf("Employee %s was created", field(data, "name"))
	case "employee.updated":
		return fmt.Sprintf("Employee %s was updated", field(data, "name"))
	case "employee.deleted":
		return fmt.Sprintf("Employee %s was deleted", field(data, "id"))
	case "assignment.created":
		return fmt.Sprintf("Employee %s was assigned to project %s as %s",
			field(data, "employeeId"), field(data, "projectId"), field(data, "role"))
	default:
		return fmt.Sprintf("Received %s", eventType)
	}
}

// field reads a value from the event data as text. A missing field becomes
// "(unknown)" so a sloppy publisher can't produce "Employee  was created".
func field(data map[string]any, key string) string {
	v, ok := data[key]
	if !ok || v == nil {
		return "(unknown)"
	}
	if s, ok := v.(string); ok {
		if s == "" {
			return "(unknown)"
		}
		return s
	}
	return fmt.Sprint(v)
}
