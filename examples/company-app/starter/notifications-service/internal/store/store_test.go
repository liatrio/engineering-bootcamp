package store

import (
	"strconv"
	"sync"
	"testing"
)

func add(s *Store, ids ...int) {
	for _, i := range ids {
		s.Add(Notification{ID: strconv.Itoa(i)})
	}
}

func ids(ns []Notification) []string {
	out := make([]string, len(ns))
	for i, n := range ns {
		out[i] = n.ID
	}
	return out
}

func TestListEmptyIsNotNil(t *testing.T) {
	if got := New(3).List(); got == nil || len(got) != 0 {
		t.Fatalf("want empty non-nil slice, got %#v", got)
	}
}

func TestListNewestFirst(t *testing.T) {
	s := New(3)
	add(s, 1, 2)
	if got := ids(s.List()); len(got) != 2 || got[0] != "2" || got[1] != "1" {
		t.Fatalf("got %v, want [2 1]", got)
	}
}

func TestOldestIsEvictedWhenFull(t *testing.T) {
	s := New(3)
	add(s, 1, 2, 3, 4, 5)
	got := ids(s.List())
	want := []string{"5", "4", "3"}
	for i := range want {
		if got[i] != want[i] {
			t.Fatalf("got %v, want %v", got, want)
		}
	}
	if len(got) != 3 {
		t.Fatalf("got %d items, want 3", len(got))
	}
}

func TestDefaultCapacityIs100(t *testing.T) {
	s := New(0)
	for i := range 150 {
		add(s, i)
	}
	got := s.List()
	if len(got) != Capacity || got[0].ID != "149" || got[99].ID != "50" {
		t.Fatalf("len=%d first=%s last=%s", len(got), got[0].ID, got[len(got)-1].ID)
	}
}

func TestListReturnsACopy(t *testing.T) {
	s := New(2)
	add(s, 1)
	s.List()[0].ID = "changed"
	if s.List()[0].ID != "1" {
		t.Fatal("List must not expose internal storage")
	}
}

// Run with -race to prove readers and writers don't collide.
func TestConcurrentAccess(t *testing.T) {
	s := New(10)
	var wg sync.WaitGroup
	for i := range 50 {
		wg.Add(2)
		go func() { defer wg.Done(); add(s, i) }()
		go func() { defer wg.Done(); _ = s.List() }()
	}
	wg.Wait()
	if len(s.List()) != 10 {
		t.Fatalf("want 10, got %d", len(s.List()))
	}
}
