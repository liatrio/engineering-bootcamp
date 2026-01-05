package main

import (
	"database/sql"
	"errors"
	"fmt"

	_ "github.com/mattn/go-sqlite3"
)

// User represents a domain model
type User struct {
	ID    int
	Name  string
	Email string
}

// UserRepository defines the interface for user data access
// This abstraction allows for different implementations (in-memory, SQL, NoSQL, etc.)
type UserRepository interface {
	Create(user *User) error
	FindByID(id int) (*User, error)
	FindAll() ([]*User, error)
	Update(user *User) error
	Delete(id int) error
}

// SQLiteUserRepository is a concrete implementation using SQLite
type SQLiteUserRepository struct {
	db *sql.DB
}

// NewSQLiteUserRepository creates a new SQLite-based repository
func NewSQLiteUserRepository(db *sql.DB) (*SQLiteUserRepository, error) {
	repo := &SQLiteUserRepository{db: db}
	if err := repo.createTable(); err != nil {
		return nil, err
	}
	return repo, nil
}

func (r *SQLiteUserRepository) createTable() error {
	query := `
		CREATE TABLE IF NOT EXISTS users (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			name TEXT NOT NULL,
			email TEXT NOT NULL UNIQUE
		)
	`
	_, err := r.db.Exec(query)
	return err
}

func (r *SQLiteUserRepository) Create(user *User) error {
	query := "INSERT INTO users (name, email) VALUES (?, ?)"
	result, err := r.db.Exec(query, user.Name, user.Email)
	if err != nil {
		return fmt.Errorf("failed to create user: %w", err)
	}
	
	id, err := result.LastInsertId()
	if err != nil {
		return fmt.Errorf("failed to get last insert id: %w", err)
	}
	
	user.ID = int(id)
	return nil
}

func (r *SQLiteUserRepository) FindByID(id int) (*User, error) {
	query := "SELECT id, name, email FROM users WHERE id = ?"
	user := &User{}
	
	err := r.db.QueryRow(query, id).Scan(&user.ID, &user.Name, &user.Email)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, fmt.Errorf("user not found")
		}
		return nil, fmt.Errorf("failed to find user: %w", err)
	}
	
	return user, nil
}

func (r *SQLiteUserRepository) FindAll() ([]*User, error) {
	query := "SELECT id, name, email FROM users"
	rows, err := r.db.Query(query)
	if err != nil {
		return nil, fmt.Errorf("failed to query users: %w", err)
	}
	defer rows.Close()
	
	var users []*User
	for rows.Next() {
		user := &User{}
		if err := rows.Scan(&user.ID, &user.Name, &user.Email); err != nil {
			return nil, fmt.Errorf("failed to scan user: %w", err)
		}
		users = append(users, user)
	}
	
	return users, nil
}

func (r *SQLiteUserRepository) Update(user *User) error {
	query := "UPDATE users SET name = ?, email = ? WHERE id = ?"
	result, err := r.db.Exec(query, user.Name, user.Email, user.ID)
	if err != nil {
		return fmt.Errorf("failed to update user: %w", err)
	}
	
	rows, err := result.RowsAffected()
	if err != nil {
		return fmt.Errorf("failed to get rows affected: %w", err)
	}
	
	if rows == 0 {
		return fmt.Errorf("user not found")
	}
	
	return nil
}

func (r *SQLiteUserRepository) Delete(id int) error {
	query := "DELETE FROM users WHERE id = ?"
	result, err := r.db.Exec(query, id)
	if err != nil {
		return fmt.Errorf("failed to delete user: %w", err)
	}
	
	rows, err := result.RowsAffected()
	if err != nil {
		return fmt.Errorf("failed to get rows affected: %w", err)
	}
	
	if rows == 0 {
		return fmt.Errorf("user not found")
	}
	
	return nil
}

// InMemoryUserRepository is an alternative implementation using in-memory storage
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

func (r *InMemoryUserRepository) Create(user *User) error {
	user.ID = r.nextID
	r.users[user.ID] = user
	r.nextID++
	return nil
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

func (r *InMemoryUserRepository) Update(user *User) error {
	if _, exists := r.users[user.ID]; !exists {
		return fmt.Errorf("user not found")
	}
	r.users[user.ID] = user
	return nil
}

func (r *InMemoryUserRepository) Delete(id int) error {
	if _, exists := r.users[id]; !exists {
		return fmt.Errorf("user not found")
	}
	delete(r.users, id)
	return nil
}
