package main

import (
	"database/sql"
	"fmt"
	"log"
	"sync"
	"time"
)

func main() {
	fmt.Println("=== Pessimistic Locking Pattern Demo ===")
	fmt.Println()
	
	// Initialize database
	db, err := sql.Open("sqlite3", ":memory:")
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()
	
	repo, err := NewAccountRepository(db)
	if err != nil {
		log.Fatal(err)
	}
	
	// Demo 1: Basic Transaction with Locking
	fmt.Println("--- Demo 1: Basic Transaction with Locking ---")
	demoBasicLocking(repo)
	
	// Demo 2: Money Transfer with Pessimistic Locking
	fmt.Println()
	fmt.Println("--- Demo 2: Safe Money Transfer ---")
	demoMoneyTransfer(repo)
	
	// Demo 3: Concurrent Access with Locking
	fmt.Println()
	fmt.Println("--- Demo 3: Preventing Concurrent Modifications ---")
	demoConcurrentAccess(repo)
	
	// Demo 4: WithLock Helper Pattern
	fmt.Println()
	fmt.Println("--- Demo 4: Using WithLock Helper ---")
	demoWithLockHelper(repo)
}

func demoBasicLocking(repo *AccountRepository) {
	// Create an account
	account := &Account{
		Name:    "Alice",
		Balance: 1000,
	}
	
	if err := repo.Create(account); err != nil {
		log.Fatal(err)
	}
	fmt.Printf("Created account: ID=%d, Name=%s, Balance=%d\n",
		account.ID, account.Name, account.Balance)
	
	// Update within a transaction (with implicit lock)
	err := repo.WithLock(account.ID, func(tx *sql.Tx, acc *Account) error {
		fmt.Printf("Lock acquired for account %d\n", acc.ID)
		
		// Perform some business logic
		acc.Balance += 500
		
		// Save changes
		return repo.Update(tx, acc)
	})
	
	if err != nil {
		log.Fatal(err)
	}
	
	// Verify the update
	updated, _ := repo.FindByID(account.ID)
	fmt.Printf("Updated account: Balance=%d\n", updated.Balance)
}

func demoMoneyTransfer(repo *AccountRepository) {
	// Create two accounts
	alice := &Account{Name: "Alice", Balance: 1000}
	bob := &Account{Name: "Bob", Balance: 500}
	
	repo.Create(alice)
	repo.Create(bob)
	
	fmt.Printf("Initial balances: Alice=%d, Bob=%d\n", alice.Balance, bob.Balance)
	
	// Transfer money from Alice to Bob
	amount := 300
	fmt.Printf("Transferring %d from Alice to Bob...\n", amount)
	
	err := repo.Transfer(alice.ID, bob.ID, amount)
	if err != nil {
		log.Fatal(err)
	}
	
	// Verify balances
	aliceAfter, _ := repo.FindByID(alice.ID)
	bobAfter, _ := repo.FindByID(bob.ID)
	
	fmt.Printf("Final balances: Alice=%d, Bob=%d\n", aliceAfter.Balance, bobAfter.Balance)
	fmt.Printf("Total: %d (should be %d)\n",
		aliceAfter.Balance+bobAfter.Balance, alice.Balance+bob.Balance)
	
	// Try transfer with insufficient funds
	fmt.Println()
	fmt.Println("Attempting transfer with insufficient funds...")
	err = repo.Transfer(alice.ID, bob.ID, 10000)
	if err != nil {
		fmt.Printf("Transfer failed (expected): %v\n", err)
	}
}

func demoConcurrentAccess(repo *AccountRepository) {
	// Create a shared account
	account := &Account{Name: "Shared Account", Balance: 1000}
	repo.Create(account)
	
	fmt.Printf("Initial balance: %d\n", account.Balance)
	
	// Simulate concurrent withdrawals
	var wg sync.WaitGroup
	successCount := 0
	var mu sync.Mutex
	
	withdrawAmount := 100
	numOperations := 5
	
	fmt.Printf("Starting %d concurrent withdrawals of %d each...\n", numOperations, withdrawAmount)
	
	for i := 1; i <= numOperations; i++ {
		wg.Add(1)
		operationID := i
		
		go func() {
			defer wg.Done()
			
			err := repo.WithLock(account.ID, func(tx *sql.Tx, acc *Account) error {
				// Simulate some processing time
				SimulateSlowOperation(10 * time.Millisecond)
				
				// Check balance
				if acc.Balance < withdrawAmount {
					return fmt.Errorf("insufficient funds")
				}
				
				// Withdraw
				acc.Balance -= withdrawAmount
				
				return repo.Update(tx, acc)
			})
			
			mu.Lock()
			if err != nil {
				fmt.Printf("Operation %d: FAILED - %v\n", operationID, err)
			} else {
				successCount++
				fmt.Printf("Operation %d: SUCCESS - withdrew %d\n", operationID, withdrawAmount)
			}
			mu.Unlock()
		}()
	}
	
	wg.Wait()
	
	// Check final balance
	final, _ := repo.FindByID(account.ID)
	expected := 1000 - (successCount * withdrawAmount)
	
	fmt.Println()
	fmt.Printf("Final balance: %d\n", final.Balance)
	fmt.Printf("Expected balance: %d\n", expected)
	fmt.Printf("Successful operations: %d\n", successCount)
	
	if final.Balance == expected {
		fmt.Println("✓ Pessimistic locking prevented concurrent modification errors!")
	}
}

func demoWithLockHelper(repo *AccountRepository) {
	// Create an account
	account := &Account{Name: "Test Account", Balance: 1000}
	repo.Create(account)
	
	fmt.Printf("Initial balance: %d\n", account.Balance)
	
	// Use WithLock to perform multiple operations atomically
	err := repo.WithLock(account.ID, func(tx *sql.Tx, acc *Account) error {
		fmt.Println("Lock acquired - performing complex operation...")
		
		// Business logic: apply fee, then add interest
		fee := 50
		interest := 100
		
		acc.Balance -= fee
		fmt.Printf("After fee: %d\n", acc.Balance)
		
		acc.Balance += interest
		fmt.Printf("After interest: %d\n", acc.Balance)
		
		return repo.Update(tx, acc)
	})
	
	if err != nil {
		log.Fatal(err)
	}
	
	// Verify final state
	final, _ := repo.FindByID(account.ID)
	fmt.Printf("Final balance: %d\n", final.Balance)
	fmt.Println("✓ All operations completed atomically within the lock!")
}
