package main

import "fmt"

// UserRepository defines the interface for user data access
// This abstraction allows for different implementations (in-memory, SQL, NoSQL, etc.)
// Go convention: Define interfaces where they're USED, not where they're IMPLEMENTED
//
// Design Note: Create and Update return new User objects instead of mutating inputs.
// This follows immutability principles, avoids surprising side effects, and is safer
// for concurrent use. The performance overhead is negligible compared to database I/O.
type UserRepository interface {
	Create(user *User) (*User, error)
	FindByID(id int) (*User, error)
	FindAll() ([]*User, error)
	Update(user *User) (*User, error)
	Delete(id int) error
}

// UserService demonstrates business logic using the repository pattern
// It depends on the UserRepository INTERFACE, not concrete implementations
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
	// Repository returns a new User object with ID set
	created, err := s.repo.Create(user)
	if err != nil {
		return nil, fmt.Errorf("failed to register user: %w", err)
	}

	return created, nil
}

func (s *UserService) GetUser(id int) (*User, error) {
	return s.repo.FindByID(id)
}

func (s *UserService) ListAllUsers() ([]*User, error) {
	return s.repo.FindAll()
}
