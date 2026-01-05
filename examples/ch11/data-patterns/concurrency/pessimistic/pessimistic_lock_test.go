package main

import (
	"database/sql"
	"fmt"
	"testing"
)

func setupTestRepo(t *testing.T) *AccountRepository {
	db, err := sql.Open("sqlite3", ":memory:")
	if err != nil {
		t.Fatalf("Failed to open database: %v", err)
	}
	t.Cleanup(func() { db.Close() })
	
	repo, err := NewAccountRepository(db)
	if err != nil {
		t.Fatalf("Failed to create repository: %v", err)
	}
	
	return repo
}

func TestCreate(t *testing.T) {
	repo := setupTestRepo(t)
	
	account := &Account{Name: "Test Account", Balance: 1000}
	err := repo.Create(account)
	
	if err != nil {
		t.Fatalf("Create failed: %v", err)
	}
	
	if account.ID == 0 {
		t.Error("Expected account ID to be set")
	}
}

func TestFindByID(t *testing.T) {
	repo := setupTestRepo(t)
	
	account := &Account{Name: "Test Account", Balance: 1000}
	repo.Create(account)
	
	found, err := repo.FindByID(account.ID)
	if err != nil {
		t.Fatalf("FindByID failed: %v", err)
	}
	
	if found.Name != account.Name || found.Balance != account.Balance {
		t.Errorf("Expected %+v, got %+v", account, found)
	}
}

func TestTransfer_Success(t *testing.T) {
	repo := setupTestRepo(t)
	
	alice := &Account{Name: "Alice", Balance: 1000}
	bob := &Account{Name: "Bob", Balance: 500}
	
	repo.Create(alice)
	repo.Create(bob)
	
	err := repo.Transfer(alice.ID, bob.ID, 300)
	if err != nil {
		t.Fatalf("Transfer failed: %v", err)
	}
	
	aliceAfter, _ := repo.FindByID(alice.ID)
	bobAfter, _ := repo.FindByID(bob.ID)
	
	if aliceAfter.Balance != 700 {
		t.Errorf("Expected Alice balance 700, got %d", aliceAfter.Balance)
	}
	
	if bobAfter.Balance != 800 {
		t.Errorf("Expected Bob balance 800, got %d", bobAfter.Balance)
	}
	
	// Verify total is conserved
	total := aliceAfter.Balance + bobAfter.Balance
	if total != 1500 {
		t.Errorf("Expected total 1500, got %d", total)
	}
}

func TestTransfer_InsufficientFunds(t *testing.T) {
	repo := setupTestRepo(t)
	
	alice := &Account{Name: "Alice", Balance: 100}
	bob := &Account{Name: "Bob", Balance: 500}
	
	repo.Create(alice)
	repo.Create(bob)
	
	err := repo.Transfer(alice.ID, bob.ID, 500)
	if err == nil {
		t.Error("Expected error for insufficient funds")
	}
	
	// Verify balances unchanged
	aliceAfter, _ := repo.FindByID(alice.ID)
	bobAfter, _ := repo.FindByID(bob.ID)
	
	if aliceAfter.Balance != 100 {
		t.Errorf("Alice balance should be unchanged: %d", aliceAfter.Balance)
	}
	
	if bobAfter.Balance != 500 {
		t.Errorf("Bob balance should be unchanged: %d", bobAfter.Balance)
	}
}

func TestWithLock(t *testing.T) {
	repo := setupTestRepo(t)
	
	account := &Account{Name: "Test Account", Balance: 1000}
	repo.Create(account)
	
	// Use WithLock to perform atomic operation
	err := repo.WithLock(account.ID, func(tx *sql.Tx, acc *Account) error {
		acc.Balance += 500
		return repo.Update(tx, acc)
	})
	
	if err != nil {
		t.Fatalf("WithLock failed: %v", err)
	}
	
	// Verify update
	updated, _ := repo.FindByID(account.ID)
	if updated.Balance != 1500 {
		t.Errorf("Expected balance 1500, got %d", updated.Balance)
	}
}

func TestWithLock_Rollback(t *testing.T) {
	repo := setupTestRepo(t)
	
	account := &Account{Name: "Test Account", Balance: 1000}
	repo.Create(account)
	
	// Use WithLock but cause an error to trigger rollback
	err := repo.WithLock(account.ID, func(tx *sql.Tx, acc *Account) error {
		acc.Balance += 500
		repo.Update(tx, acc)
		// Return error to trigger rollback
		return fmt.Errorf("intentional error")
	})
	
	if err == nil {
		t.Error("Expected error from WithLock")
	}
	
	// Verify balance unchanged (rollback worked)
	unchanged, _ := repo.FindByID(account.ID)
	if unchanged.Balance != 1000 {
		t.Errorf("Expected balance to be unchanged (1000), got %d", unchanged.Balance)
	}
}

func TestTransfer_DeadlockPrevention(t *testing.T) {
	repo := setupTestRepo(t)
	
	alice := &Account{Name: "Alice", Balance: 1000}
	bob := &Account{Name: "Bob", Balance: 1000}
	
	repo.Create(alice)
	repo.Create(bob)
	
	// Transfer in both directions should work (locks acquired in consistent order)
	err1 := repo.Transfer(alice.ID, bob.ID, 100)
	err2 := repo.Transfer(bob.ID, alice.ID, 50)
	
	if err1 != nil {
		t.Errorf("First transfer failed: %v", err1)
	}
	
	if err2 != nil {
		t.Errorf("Second transfer failed: %v", err2)
	}
	
	// Verify final balances
	aliceFinal, _ := repo.FindByID(alice.ID)
	bobFinal, _ := repo.FindByID(bob.ID)
	
	expectedAlice := 1000 - 100 + 50  // 950
	expectedBob := 1000 + 100 - 50    // 1050
	
	if aliceFinal.Balance != expectedAlice {
		t.Errorf("Expected Alice balance %d, got %d", expectedAlice, aliceFinal.Balance)
	}
	
	if bobFinal.Balance != expectedBob {
		t.Errorf("Expected Bob balance %d, got %d", expectedBob, bobFinal.Balance)
	}
}
