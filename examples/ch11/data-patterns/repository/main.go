package main

import (
	"database/sql"
	"fmt"
	"log"
	"os"
)

// UserService demonstrates business logic using the repository pattern
type UserService struct {
	repo UserRepository
}

func NewUserService(repo UserRepository) *UserService {
	return &UserService{repo: repo}
}

func (s *UserService) RegisterUser(name, email string) (*User, error) {
	// Business logic: validation
	if name == "" {
		return nil, fmt.Errorf("name cannot be empty")
	}
	if email == "" {
		return nil, fmt.Errorf("email cannot be empty")
	}
	
	user := &User{
		Name:  name,
		Email: email,
	}
	
	// Delegate to repository for data access
	if err := s.repo.Create(user); err != nil {
		return nil, fmt.Errorf("failed to register user: %w", err)
	}
	
	return user, nil
}

func (s *UserService) GetUser(id int) (*User, error) {
	return s.repo.FindByID(id)
}

func (s *UserService) ListAllUsers() ([]*User, error) {
	return s.repo.FindAll()
}

func main() {
	fmt.Println("=== Repository Pattern Demo ===")
	fmt.Println()
	
	// Demo 1: Using in-memory repository
	fmt.Println("--- Demo 1: In-Memory Repository ---")
	inMemoryRepo := NewInMemoryUserRepository()
	demoRepository(inMemoryRepo)
	fmt.Println()
	fmt.Println("--- Demo 2: SQLite Repository ---")
	db, err := sql.Open("sqlite3", ":memory:")
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()
	
	sqliteRepo, err := NewSQLiteUserRepository(db)
	if err != nil {
		log.Fatal(err)
	}
	demoRepository(sqliteRepo)
	
	fmt.Println()
	fmt.Println("--- Demo 3: Service Layer with Repository ---")
	service := NewUserService(inMemoryRepo)
	
	user, err := service.RegisterUser("Charlie Brown", "charlie@example.com")
	if err != nil {
		log.Fatal(err)
	}
	fmt.Printf("Registered user: %+v\n", user)
	
	allUsers, err := service.ListAllUsers()
	if err != nil {
		log.Fatal(err)
	}
	fmt.Printf("Total users: %d\n", len(allUsers))
	
	fmt.Println()
	fmt.Println("✓ Repository pattern allows easy switching between storage implementations!")
}

func demoRepository(repo UserRepository) {
	// Create users
	user1 := &User{Name: "Alice", Email: "alice@example.com"}
	if err := repo.Create(user1); err != nil {
		fmt.Fprintf(os.Stderr, "Error creating user: %v\n", err)
		return
	}
	fmt.Printf("Created user: %+v\n", user1)
	
	user2 := &User{Name: "Bob", Email: "bob@example.com"}
	if err := repo.Create(user2); err != nil {
		fmt.Fprintf(os.Stderr, "Error creating user: %v\n", err)
		return
	}
	fmt.Printf("Created user: %+v\n", user2)
	
	// Find by ID
	found, err := repo.FindByID(user1.ID)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error finding user: %v\n", err)
		return
	}
	fmt.Printf("Found user by ID %d: %+v\n", user1.ID, found)
	
	// Update user
	user1.Name = "Alice Smith"
	if err := repo.Update(user1); err != nil {
		fmt.Fprintf(os.Stderr, "Error updating user: %v\n", err)
		return
	}
	fmt.Printf("Updated user: %+v\n", user1)
	
	// List all
	users, err := repo.FindAll()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error listing users: %v\n", err)
		return
	}
	fmt.Printf("All users (%d total):\n", len(users))
	for _, u := range users {
		fmt.Printf("  - %+v\n", u)
	}
	
	// Delete user
	if err := repo.Delete(user2.ID); err != nil {
		fmt.Fprintf(os.Stderr, "Error deleting user: %v\n", err)
		return
	}
	fmt.Printf("Deleted user with ID %d\n", user2.ID)
	
	// Verify deletion
	remaining, _ := repo.FindAll()
	fmt.Printf("Remaining users: %d\n", len(remaining))
}
