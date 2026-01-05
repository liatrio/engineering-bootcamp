package main

import (
	"database/sql"
	"fmt"

	_ "github.com/mattn/go-sqlite3"
)

// DB is a package-level database connection shared by all active records
var DB *sql.DB

// InitDB initializes the database connection and creates the users table
func InitDB(dbPath string) error {
	var err error
	DB, err = sql.Open("sqlite3", dbPath)
	if err != nil {
		return fmt.Errorf("failed to open database: %w", err)
	}
	
	// Create users table
	query := `
		CREATE TABLE IF NOT EXISTS users (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			name TEXT NOT NULL,
			email TEXT NOT NULL UNIQUE
		)
	`
	_, err = DB.Exec(query)
	if err != nil {
		return fmt.Errorf("failed to create table: %w", err)
	}
	
	return nil
}

// User is an Active Record - it contains both data and methods to persist itself
type User struct {
	ID    int
	Name  string
	Email string
}

// Save persists the user to the database (insert or update)
func (u *User) Save() error {
	if u.ID == 0 {
		return u.insert()
	}
	return u.update()
}

// insert creates a new user record in the database
func (u *User) insert() error {
	query := "INSERT INTO users (name, email) VALUES (?, ?)"
	result, err := DB.Exec(query, u.Name, u.Email)
	if err != nil {
		return fmt.Errorf("failed to insert user: %w", err)
	}
	
	id, err := result.LastInsertId()
	if err != nil {
		return fmt.Errorf("failed to get last insert id: %w", err)
	}
	
	u.ID = int(id)
	return nil
}

// update modifies an existing user record in the database
func (u *User) update() error {
	query := "UPDATE users SET name = ?, email = ? WHERE id = ?"
	result, err := DB.Exec(query, u.Name, u.Email, u.ID)
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

// Delete removes the user from the database
func (u *User) Delete() error {
	query := "DELETE FROM users WHERE id = ?"
	result, err := DB.Exec(query, u.ID)
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

// Reload refreshes the user's data from the database
func (u *User) Reload() error {
	query := "SELECT id, name, email FROM users WHERE id = ?"
	err := DB.QueryRow(query, u.ID).Scan(&u.ID, &u.Name, &u.Email)
	if err != nil {
		return fmt.Errorf("failed to reload user: %w", err)
	}
	return nil
}

// FindUserByID loads a user from the database by ID (class method)
func FindUserByID(id int) (*User, error) {
	query := "SELECT id, name, email FROM users WHERE id = ?"
	user := &User{}
	
	err := DB.QueryRow(query, id).Scan(&user.ID, &user.Name, &user.Email)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, fmt.Errorf("user not found")
		}
		return nil, fmt.Errorf("failed to find user: %w", err)
	}
	
	return user, nil
}

// FindUserByEmail loads a user from the database by email (class method)
func FindUserByEmail(email string) (*User, error) {
	query := "SELECT id, name, email FROM users WHERE email = ?"
	user := &User{}
	
	err := DB.QueryRow(query, email).Scan(&user.ID, &user.Name, &user.Email)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, fmt.Errorf("user not found")
		}
		return nil, fmt.Errorf("failed to find user: %w", err)
	}
	
	return user, nil
}

// AllUsers returns all users from the database (class method)
func AllUsers() ([]*User, error) {
	query := "SELECT id, name, email FROM users"
	rows, err := DB.Query(query)
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

// Validate checks if the user's data is valid (business logic in the model)
func (u *User) Validate() error {
	if u.Name == "" {
		return fmt.Errorf("name cannot be empty")
	}
	if u.Email == "" {
		return fmt.Errorf("email cannot be empty")
	}
	// In a real app, you might check email format, uniqueness, etc.
	return nil
}
