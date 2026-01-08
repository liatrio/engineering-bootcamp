package main

import "fmt"

// InMemoryUserRepository is an alternative implementation using in-memory storage
// This struct implicitly satisfies the UserRepository interface
// by implementing all required methods
type InMemoryUserRepository struct {
	users  map[int]*User
	nextID int
}

// NewInMemoryUserRepository creates a new in-memory repository
func NewInMemoryUserRepository() *InMemoryUserRepository {
	return &InMemoryUserRepository{
		users:  make(map[int]*User),
		nextID: 1,
	}
}

func (r *InMemoryUserRepository) Create(user *User) (*User, error) {
	// Return a new User object with ID set, input remains unchanged
	created := &User{
		ID:    r.nextID,
		Name:  user.Name,
		Email: user.Email,
	}
	r.users[created.ID] = created
	r.nextID++
	return created, nil
}

func (r *InMemoryUserRepository) FindByID(id int) (*User, error) {
	user, exists := r.users[id]
	if !exists {
		return nil, fmt.Errorf("user not found")
	}
	return user, nil
}

func (r *InMemoryUserRepository) FindAll() ([]*User, error) {
	users := make([]*User, 0, len(r.users))
	for _, user := range r.users {
		users = append(users, user)
	}
	return users, nil
}

func (r *InMemoryUserRepository) Update(user *User) (*User, error) {
	if _, exists := r.users[user.ID]; !exists {
		return nil, fmt.Errorf("user not found")
	}
	// Return a new User object with updated values, input remains unchanged
	updated := &User{
		ID:    user.ID,
		Name:  user.Name,
		Email: user.Email,
	}
	r.users[user.ID] = updated
	return updated, nil
}

func (r *InMemoryUserRepository) Delete(id int) error {
	if _, exists := r.users[id]; !exists {
		return fmt.Errorf("user not found")
	}
	delete(r.users, id)
	return nil
}
