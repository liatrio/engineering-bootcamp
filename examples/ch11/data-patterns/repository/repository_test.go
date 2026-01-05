package main

import (
	"database/sql"
	"testing"
)

func TestInMemoryUserRepository(t *testing.T) {
	repo := NewInMemoryUserRepository()
	testUserRepository(t, repo)
}

func TestSQLiteUserRepository(t *testing.T) {
	db, err := sql.Open("sqlite3", ":memory:")
	if err != nil {
		t.Fatalf("Failed to open database: %v", err)
	}
	defer db.Close()
	
	repo, err := NewSQLiteUserRepository(db)
	if err != nil {
		t.Fatalf("Failed to create repository: %v", err)
	}
	
	testUserRepository(t, repo)
}

func testUserRepository(t *testing.T, repo UserRepository) {
	// Test Create
	user := &User{Name: "Test User", Email: "test@example.com"}
	err := repo.Create(user)
	if err != nil {
		t.Fatalf("Create failed: %v", err)
	}
	if user.ID == 0 {
		t.Error("Expected user ID to be set after create")
	}
	
	// Test FindByID
	found, err := repo.FindByID(user.ID)
	if err != nil {
		t.Fatalf("FindByID failed: %v", err)
	}
	if found.Name != user.Name || found.Email != user.Email {
		t.Errorf("Expected %+v, got %+v", user, found)
	}
	
	// Test Update
	user.Name = "Updated User"
	err = repo.Update(user)
	if err != nil {
		t.Fatalf("Update failed: %v", err)
	}
	
	updated, err := repo.FindByID(user.ID)
	if err != nil {
		t.Fatalf("FindByID after update failed: %v", err)
	}
	if updated.Name != "Updated User" {
		t.Errorf("Expected name to be 'Updated User', got '%s'", updated.Name)
	}
	
	// Test FindAll
	user2 := &User{Name: "Second User", Email: "second@example.com"}
	err = repo.Create(user2)
	if err != nil {
		t.Fatalf("Create second user failed: %v", err)
	}
	
	users, err := repo.FindAll()
	if err != nil {
		t.Fatalf("FindAll failed: %v", err)
	}
	if len(users) != 2 {
		t.Errorf("Expected 2 users, got %d", len(users))
	}
	
	// Test Delete
	err = repo.Delete(user.ID)
	if err != nil {
		t.Fatalf("Delete failed: %v", err)
	}
	
	_, err = repo.FindByID(user.ID)
	if err == nil {
		t.Error("Expected error when finding deleted user")
	}
	
	// Test error cases
	err = repo.Update(&User{ID: 999, Name: "Non-existent", Email: "none@example.com"})
	if err == nil {
		t.Error("Expected error when updating non-existent user")
	}
	
	err = repo.Delete(999)
	if err == nil {
		t.Error("Expected error when deleting non-existent user")
	}
}

func TestUserService(t *testing.T) {
	repo := NewInMemoryUserRepository()
	service := NewUserService(repo)
	
	// Test RegisterUser with valid data
	user, err := service.RegisterUser("John Doe", "john@example.com")
	if err != nil {
		t.Fatalf("RegisterUser failed: %v", err)
	}
	if user.ID == 0 {
		t.Error("Expected user ID to be set")
	}
	
	// Test RegisterUser with empty name
	_, err = service.RegisterUser("", "test@example.com")
	if err == nil {
		t.Error("Expected error with empty name")
	}
	
	// Test RegisterUser with empty email
	_, err = service.RegisterUser("Test", "")
	if err == nil {
		t.Error("Expected error with empty email")
	}
	
	// Test GetUser
	retrieved, err := service.GetUser(user.ID)
	if err != nil {
		t.Fatalf("GetUser failed: %v", err)
	}
	if retrieved.Name != user.Name {
		t.Errorf("Expected name %s, got %s", user.Name, retrieved.Name)
	}
	
	// Test ListAllUsers
	users, err := service.ListAllUsers()
	if err != nil {
		t.Fatalf("ListAllUsers failed: %v", err)
	}
	if len(users) != 1 {
		t.Errorf("Expected 1 user, got %d", len(users))
	}
}
