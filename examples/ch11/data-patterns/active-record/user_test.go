package main

import (
	"testing"
)

func setupTestDB(t *testing.T) {
	if err := InitDB(":memory:"); err != nil {
		t.Fatalf("Failed to initialize database: %v", err)
	}
}

func TestUserSave_Insert(t *testing.T) {
	setupTestDB(t)
	defer DB.Close()
	
	user := &User{Name: "Test User", Email: "test@example.com"}
	err := user.Save()
	if err != nil {
		t.Fatalf("Save failed: %v", err)
	}
	
	if user.ID == 0 {
		t.Error("Expected user ID to be set after save")
	}
}

func TestUserSave_Update(t *testing.T) {
	setupTestDB(t)
	defer DB.Close()
	
	user := &User{Name: "Test User", Email: "test@example.com"}
	if err := user.Save(); err != nil {
		t.Fatalf("Initial save failed: %v", err)
	}
	
	originalID := user.ID
	user.Name = "Updated User"
	
	if err := user.Save(); err != nil {
		t.Fatalf("Update save failed: %v", err)
	}
	
	if user.ID != originalID {
		t.Error("User ID should not change on update")
	}
	
	// Reload and verify
	if err := user.Reload(); err != nil {
		t.Fatalf("Reload failed: %v", err)
	}
	
	if user.Name != "Updated User" {
		t.Errorf("Expected name to be 'Updated User', got '%s'", user.Name)
	}
}

func TestFindUserByID(t *testing.T) {
	setupTestDB(t)
	defer DB.Close()
	
	user := &User{Name: "Test User", Email: "test@example.com"}
	if err := user.Save(); err != nil {
		t.Fatalf("Save failed: %v", err)
	}
	
	found, err := FindUserByID(user.ID)
	if err != nil {
		t.Fatalf("FindUserByID failed: %v", err)
	}
	
	if found.Name != user.Name || found.Email != user.Email {
		t.Errorf("Expected %+v, got %+v", user, found)
	}
}

func TestFindUserByEmail(t *testing.T) {
	setupTestDB(t)
	defer DB.Close()
	
	user := &User{Name: "Test User", Email: "test@example.com"}
	if err := user.Save(); err != nil {
		t.Fatalf("Save failed: %v", err)
	}
	
	found, err := FindUserByEmail(user.Email)
	if err != nil {
		t.Fatalf("FindUserByEmail failed: %v", err)
	}
	
	if found.ID != user.ID || found.Name != user.Name {
		t.Errorf("Expected %+v, got %+v", user, found)
	}
}

func TestAllUsers(t *testing.T) {
	setupTestDB(t)
	defer DB.Close()
	
	user1 := &User{Name: "User 1", Email: "user1@example.com"}
	user2 := &User{Name: "User 2", Email: "user2@example.com"}
	
	if err := user1.Save(); err != nil {
		t.Fatalf("Save user1 failed: %v", err)
	}
	if err := user2.Save(); err != nil {
		t.Fatalf("Save user2 failed: %v", err)
	}
	
	users, err := AllUsers()
	if err != nil {
		t.Fatalf("AllUsers failed: %v", err)
	}
	
	if len(users) != 2 {
		t.Errorf("Expected 2 users, got %d", len(users))
	}
}

func TestUserDelete(t *testing.T) {
	setupTestDB(t)
	defer DB.Close()
	
	user := &User{Name: "Test User", Email: "test@example.com"}
	if err := user.Save(); err != nil {
		t.Fatalf("Save failed: %v", err)
	}
	
	if err := user.Delete(); err != nil {
		t.Fatalf("Delete failed: %v", err)
	}
	
	_, err := FindUserByID(user.ID)
	if err == nil {
		t.Error("Expected error when finding deleted user")
	}
}

func TestUserValidate(t *testing.T) {
	tests := []struct {
		name      string
		user      *User
		expectErr bool
	}{
		{
			name:      "Valid user",
			user:      &User{Name: "Test", Email: "test@example.com"},
			expectErr: false,
		},
		{
			name:      "Empty name",
			user:      &User{Name: "", Email: "test@example.com"},
			expectErr: true,
		},
		{
			name:      "Empty email",
			user:      &User{Name: "Test", Email: ""},
			expectErr: true,
		},
	}
	
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			err := tt.user.Validate()
			if tt.expectErr && err == nil {
				t.Error("Expected validation error, got nil")
			}
			if !tt.expectErr && err != nil {
				t.Errorf("Expected no error, got %v", err)
			}
		})
	}
}

func TestUserReload(t *testing.T) {
	setupTestDB(t)
	defer DB.Close()
	
	user := &User{Name: "Original Name", Email: "test@example.com"}
	if err := user.Save(); err != nil {
		t.Fatalf("Save failed: %v", err)
	}
	
	// Manually update in database
	_, err := DB.Exec("UPDATE users SET name = ? WHERE id = ?", "Changed Name", user.ID)
	if err != nil {
		t.Fatalf("Manual update failed: %v", err)
	}
	
	// Reload should get the updated value
	if err := user.Reload(); err != nil {
		t.Fatalf("Reload failed: %v", err)
	}
	
	if user.Name != "Changed Name" {
		t.Errorf("Expected name to be 'Changed Name', got '%s'", user.Name)
	}
}
