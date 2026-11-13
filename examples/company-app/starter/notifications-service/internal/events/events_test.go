package events

import (
	"encoding/json"
	"testing"
)

func TestMessage(t *testing.T) {
	tests := []struct {
		eventType string
		data      map[string]any
		want      string
	}{
		{"employee.created", map[string]any{"name": "Ada Lovelace"}, "Employee Ada Lovelace was created"},
		{"employee.updated", map[string]any{"name": "Grace Hopper"}, "Employee Grace Hopper was updated"},
		{"employee.deleted", map[string]any{"id": "33333333-3333-4333-8333-333333333333"},
			"Employee 33333333-3333-4333-8333-333333333333 was deleted"},
		{"assignment.created", map[string]any{
			"employeeId": "11111111-1111-4111-8111-111111111111",
			"projectId":  "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
			"role":       "Tech Lead",
		}, "Employee 11111111-1111-4111-8111-111111111111 was assigned to project aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa as Tech Lead"},
		{"project.archived", nil, "Received project.archived"},
		{"employee.created", map[string]any{}, "Employee (unknown) was created"},
		{"employee.created", nil, "Employee (unknown) was created"},
		{"employee.deleted", map[string]any{"id": 42.0}, "Employee 42 was deleted"},
	}
	for _, tt := range tests {
		t.Run(tt.eventType+"/"+tt.want, func(t *testing.T) {
			if got := Message(tt.eventType, tt.data); got != tt.want {
				t.Fatalf("got %q, want %q", got, tt.want)
			}
		})
	}
}

func TestEnvelopeDecodesSpecExample(t *testing.T) {
	body := `{"eventId":"e1","type":"employee.deleted","occurredAt":"2026-01-05T10:00:00Z",
	          "source":"employees-service","data":{"id":"x"}}`
	var env Envelope
	if err := json.Unmarshal([]byte(body), &env); err != nil {
		t.Fatal(err)
	}
	if env.Type != "employee.deleted" || env.Data["id"] != "x" || env.OccurredAt.IsZero() {
		t.Fatalf("decoded %+v", env)
	}
}
