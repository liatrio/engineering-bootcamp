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
	// Test Create - returns new user with ID set
	created, err := repo.Create(&User{Name: "Test User", Email: "test@example.com"})
	if err != nil {
		t.Fatalf("Create failed: %v", err)
	}
	if created.ID == 0 {
		t.Error("Expected user ID to be set after create")
	}

	// Test that input wasn't mutated
	input := &User{Name: "Test Input", Email: "testinput@example.com"}
	result, err := repo.Create(input)
	if err != nil {
		t.Fatalf("Create failed: %v", err)
	}
	if input.ID != 0 {
		t.Error("Expected input to remain unchanged (ID should be 0)")
	}
	if result.ID == 0 {
		t.Error("Expected returned user to have ID set")
	}

	// Test FindByID
	found, err := repo.FindByID(created.ID)
	if err != nil {
		t.Fatalf("FindByID failed: %v", err)
	}
	if found.Name != created.Name || found.Email != created.Email {
		t.Errorf("Expected %+v, got %+v", created, found)
	}

	// Test Update - returns updated user
	updated, err := repo.Update(&User{ID: created.ID, Name: "Updated User", Email: created.Email})
	if err != nil {
		t.Fatalf("Update failed: %v", err)
	}
	if updated.Name != "Updated User" {
		t.Errorf("Expected returned user name to be 'Updated User', got '%s'", updated.Name)
	}

	// Verify update persisted
	fetched, err := repo.FindByID(created.ID)
	if err != nil {
		t.Fatalf("FindByID after update failed: %v", err)
	}
	if fetched.Name != "Updated User" {
		t.Errorf("Expected name to be 'Updated User', got '%s'", fetched.Name)
	}

	// Test FindAll
	_, err = repo.Create(&User{Name: "Second User", Email: "second@example.com"})
	if err != nil {
		t.Fatalf("Create second user failed: %v", err)
	}

	users, err := repo.FindAll()
	if err != nil {
		t.Fatalf("FindAll failed: %v", err)
	}
	if len(users) != 3 { // created, result, user2
		t.Errorf("Expected 3 users, got %d", len(users))
	}

	// Test Delete
	err = repo.Delete(created.ID)
	if err != nil {
		t.Fatalf("Delete failed: %v", err)
	}

	_, err = repo.FindByID(created.ID)
	if err == nil {
		t.Error("Expected error when finding deleted user")
	}

	// Test error cases
	_, err = repo.Update(&User{ID: 999, Name: "Non-existent", Email: "none@example.com"})
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
