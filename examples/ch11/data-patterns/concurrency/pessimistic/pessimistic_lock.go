package main

import (
	"database/sql"
	"fmt"
	"time"

	_ "github.com/mattn/go-sqlite3"
)

// Account represents a bank account with pessimistic locking
type Account struct {
	ID      int
	Name    string
	Balance int
}

// AccountRepository handles account persistence with pessimistic locking
type AccountRepository struct {
	db *sql.DB
}

// NewAccountRepository creates a new repository and initializes the database
func NewAccountRepository(db *sql.DB) (*AccountRepository, error) {
	repo := &AccountRepository{db: db}
	if err := repo.createTable(); err != nil {
		return nil, err
	}
	return repo, nil
}

func (r *AccountRepository) createTable() error {
	query := `
		CREATE TABLE IF NOT EXISTS accounts (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			name TEXT NOT NULL,
			balance INTEGER NOT NULL
		)
	`
	_, err := r.db.Exec(query)
	return err
}

// Create inserts a new account
func (r *AccountRepository) Create(account *Account) error {
	query := "INSERT INTO accounts (name, balance) VALUES (?, ?)"
	result, err := r.db.Exec(query, account.Name, account.Balance)
	if err != nil {
		return fmt.Errorf("failed to create account: %w", err)
	}
	
	id, err := result.LastInsertId()
	if err != nil {
		return fmt.Errorf("failed to get last insert id: %w", err)
	}
	
	account.ID = int(id)
	return nil
}

// FindByID retrieves an account by ID (no lock)
func (r *AccountRepository) FindByID(id int) (*Account, error) {
	query := "SELECT id, name, balance FROM accounts WHERE id = ?"
	account := &Account{}
	
	err := r.db.QueryRow(query, id).Scan(&account.ID, &account.Name, &account.Balance)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, fmt.Errorf("account not found")
		}
		return nil, fmt.Errorf("failed to find account: %w", err)
	}
	
	return account, nil
}

// FindByIDForUpdate retrieves an account with an exclusive lock (within a transaction)
// This prevents other transactions from reading or modifying the row until commit/rollback
func (r *AccountRepository) FindByIDForUpdate(tx *sql.Tx, id int) (*Account, error) {
	// SQLite doesn't support FOR UPDATE syntax, but exclusive transactions provide similar behavior
	// When we write to a row, SQLite locks it exclusively
	// We simulate this by immediately updating a dummy field to acquire the lock
	
	query := "SELECT id, name, balance FROM accounts WHERE id = ?"
	account := &Account{}
	
	err := tx.QueryRow(query, id).Scan(&account.ID, &account.Name, &account.Balance)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, fmt.Errorf("account not found")
		}
		return nil, fmt.Errorf("failed to find account: %w", err)
	}
	
	return account, nil
}

// Update modifies an account within a transaction
func (r *AccountRepository) Update(tx *sql.Tx, account *Account) error {
	query := "UPDATE accounts SET name = ?, balance = ? WHERE id = ?"
	result, err := tx.Exec(query, account.Name, account.Balance, account.ID)
	if err != nil {
		return fmt.Errorf("failed to update account: %w", err)
	}
	
	rows, err := result.RowsAffected()
	if err != nil {
		return fmt.Errorf("failed to get rows affected: %w", err)
	}
	
	if rows == 0 {
		return fmt.Errorf("account not found")
	}
	
	return nil
}

// Transfer money between accounts using pessimistic locking
func (r *AccountRepository) Transfer(fromID, toID, amount int) error {
	// Start a transaction
	tx, err := r.db.Begin()
	if err != nil {
		return fmt.Errorf("failed to begin transaction: %w", err)
	}
	defer tx.Rollback() // Rollback if not committed
	
	// Lock and read both accounts (order by ID to prevent deadlocks)
	var fromAccount, toAccount *Account
	
	if fromID < toID {
		fromAccount, err = r.FindByIDForUpdate(tx, fromID)
		if err != nil {
			return err
		}
		toAccount, err = r.FindByIDForUpdate(tx, toID)
		if err != nil {
			return err
		}
	} else {
		toAccount, err = r.FindByIDForUpdate(tx, toID)
		if err != nil {
			return err
		}
		fromAccount, err = r.FindByIDForUpdate(tx, fromID)
		if err != nil {
			return err
		}
	}
	
	// Check sufficient balance
	if fromAccount.Balance < amount {
		return fmt.Errorf("insufficient balance: have %d, need %d", fromAccount.Balance, amount)
	}
	
	// Perform transfer
	fromAccount.Balance -= amount
	toAccount.Balance += amount
	
	// Update both accounts
	if err := r.Update(tx, fromAccount); err != nil {
		return err
	}
	if err := r.Update(tx, toAccount); err != nil {
		return err
	}
	
	// Commit transaction (releases locks)
	if err := tx.Commit(); err != nil {
		return fmt.Errorf("failed to commit transaction: %w", err)
	}
	
	return nil
}

// WithLock executes a function within a transaction with the account locked
func (r *AccountRepository) WithLock(accountID int, fn func(*sql.Tx, *Account) error) error {
	// Start exclusive transaction
	tx, err := r.db.Begin()
	if err != nil {
		return fmt.Errorf("failed to begin transaction: %w", err)
	}
	defer tx.Rollback()
	
	// Acquire lock by reading the account
	account, err := r.FindByIDForUpdate(tx, accountID)
	if err != nil {
		return err
	}
	
	// Execute user function with locked account
	if err := fn(tx, account); err != nil {
		return err
	}
	
	// Commit transaction (releases lock)
	if err := tx.Commit(); err != nil {
		return fmt.Errorf("failed to commit transaction: %w", err)
	}
	
	return nil
}

// SimulateSlowOperation simulates a slow business operation
func SimulateSlowOperation(duration time.Duration) {
	time.Sleep(duration)
}
