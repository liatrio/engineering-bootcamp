package main

import (
	"database/sql"
	"errors"
	"fmt"

	_ "github.com/mattn/go-sqlite3"
)

// SQLiteUserRepository is a concrete implementation using SQLite
// This struct implicitly satisfies the UserRepository interface
// by implementing all required methods
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

func (r *SQLiteUserRepository) Create(user *User) (*User, error) {
	query := "INSERT INTO users (name, email) VALUES (?, ?)"
	result, err := r.db.Exec(query, user.Name, user.Email)
	if err != nil {
		return nil, fmt.Errorf("failed to create user: %w", err)
	}

	id, err := result.LastInsertId()
	if err != nil {
		return nil, fmt.Errorf("failed to get last insert id: %w", err)
	}

	// Return a new User object with ID set, input remains unchanged
	created := &User{
		ID:    int(id),
		Name:  user.Name,
		Email: user.Email,
	}
	return created, nil
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

func (r *SQLiteUserRepository) Update(user *User) (*User, error) {
	query := "UPDATE users SET name = ?, email = ? WHERE id = ?"
	result, err := r.db.Exec(query, user.Name, user.Email, user.ID)
	if err != nil {
		return nil, fmt.Errorf("failed to update user: %w", err)
	}

	rows, err := result.RowsAffected()
	if err != nil {
		return nil, fmt.Errorf("failed to get rows affected: %w", err)
	}

	if rows == 0 {
		return nil, fmt.Errorf("user not found")
	}

	// Return a new User object with updated values, input remains unchanged
	updated := &User{
		ID:    user.ID,
		Name:  user.Name,
		Email: user.Email,
	}
	return updated, nil
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
