package main

import (
	"database/sql"
	"fmt"

	_ "github.com/mattn/go-sqlite3"
)

// Product represents an item with optimistic locking using a version field
type Product struct {
	ID       int
	Name     string
	Quantity int
	Version  int  // Version field for optimistic locking
}

// ProductRepository handles product persistence with optimistic locking
type ProductRepository struct {
	db *sql.DB
}

// NewProductRepository creates a new repository and initializes the database
func NewProductRepository(db *sql.DB) (*ProductRepository, error) {
	repo := &ProductRepository{db: db}
	if err := repo.createTable(); err != nil {
		return nil, err
	}
	return repo, nil
}

func (r *ProductRepository) createTable() error {
	query := `
		CREATE TABLE IF NOT EXISTS products (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			name TEXT NOT NULL,
			quantity INTEGER NOT NULL,
			version INTEGER NOT NULL DEFAULT 1
		)
	`
	_, err := r.db.Exec(query)
	return err
}

// Create inserts a new product with version 1
func (r *ProductRepository) Create(product *Product) error {
	query := "INSERT INTO products (name, quantity, version) VALUES (?, ?, 1)"
	result, err := r.db.Exec(query, product.Name, product.Quantity)
	if err != nil {
		return fmt.Errorf("failed to create product: %w", err)
	}
	
	id, err := result.LastInsertId()
	if err != nil {
		return fmt.Errorf("failed to get last insert id: %w", err)
	}
	
	product.ID = int(id)
	product.Version = 1
	return nil
}

// FindByID retrieves a product by ID
func (r *ProductRepository) FindByID(id int) (*Product, error) {
	query := "SELECT id, name, quantity, version FROM products WHERE id = ?"
	product := &Product{}
	
	err := r.db.QueryRow(query, id).Scan(&product.ID, &product.Name, &product.Quantity, &product.Version)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, fmt.Errorf("product not found")
		}
		return nil, fmt.Errorf("failed to find product: %w", err)
	}
	
	return product, nil
}

// Update uses optimistic locking to prevent conflicting updates
// It only updates if the version in the database matches the product's version
// Returns an error if the version doesn't match (indicating a concurrent modification)
func (r *ProductRepository) Update(product *Product) error {
	// Update only if version matches (optimistic lock check)
	query := `
		UPDATE products 
		SET name = ?, quantity = ?, version = version + 1
		WHERE id = ? AND version = ?
	`
	
	result, err := r.db.Exec(query, product.Name, product.Quantity, product.ID, product.Version)
	if err != nil {
		return fmt.Errorf("failed to update product: %w", err)
	}
	
	rows, err := result.RowsAffected()
	if err != nil {
		return fmt.Errorf("failed to get rows affected: %w", err)
	}
	
	// No rows affected means version didn't match - concurrent modification detected!
	if rows == 0 {
		return fmt.Errorf("concurrent modification detected - product has been modified by another transaction")
	}
	
	// Increment version on successful update
	product.Version++
	return nil
}

// ConflictError represents a concurrency conflict
type ConflictError struct {
	Message string
}

func (e *ConflictError) Error() string {
	return e.Message
}

// SafeUpdate attempts to update with retry logic for handling conflicts
func (r *ProductRepository) SafeUpdate(productID int, updateFn func(*Product) error) error {
	maxRetries := 3
	
	for attempt := 1; attempt <= maxRetries; attempt++ {
		// Read the latest version
		product, err := r.FindByID(productID)
		if err != nil {
			return err
		}
		
		// Apply the update function (business logic)
		if err := updateFn(product); err != nil {
			return err
		}
		
		// Try to save with optimistic lock
		err = r.Update(product)
		if err == nil {
			// Success!
			return nil
		}
		
		// Check if it's a concurrency error
		if err.Error() == "concurrent modification detected - product has been modified by another transaction" {
			if attempt == maxRetries {
				return &ConflictError{
					Message: fmt.Sprintf("failed to update after %d retries due to concurrent modifications", maxRetries),
				}
			}
			// Retry with fresh data
			continue
		}
		
		// Other error - don't retry
		return err
	}
	
	return nil
}
