package main

import (
	"database/sql"
	"fmt"
	"log"
	"sync"
)

func main() {
	fmt.Println("=== Optimistic Locking Pattern Demo ===")
	fmt.Println()
	
	// Initialize database
	db, err := sql.Open("sqlite3", ":memory:")
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()
	
	repo, err := NewProductRepository(db)
	if err != nil {
		log.Fatal(err)
	}
	
	// Demo 1: Basic Optimistic Locking
	fmt.Println("--- Demo 1: Basic Optimistic Locking ---")
	demoBasicOptimisticLocking(repo)
	
	// Demo 2: Concurrent Modification Detection
	fmt.Println()
	fmt.Println("--- Demo 2: Detecting Concurrent Modifications ---")
	demoConcurrentModification(repo)
	
	// Demo 3: Safe Update with Retry
	fmt.Println()
	fmt.Println("--- Demo 3: Safe Update with Automatic Retry ---")
	demoSafeUpdate(repo)
	
	// Demo 4: Multi-user Scenario
	fmt.Println()
	fmt.Println("--- Demo 4: Multi-User Concurrent Updates ---")
	demoMultiUser(repo)
}

func demoBasicOptimisticLocking(repo *ProductRepository) {
	// Create a product
	product := &Product{
		Name:     "Widget",
		Quantity: 100,
	}
	
	if err := repo.Create(product); err != nil {
		log.Fatal(err)
	}
	fmt.Printf("Created product: ID=%d, Name=%s, Quantity=%d, Version=%d\n",
		product.ID, product.Name, product.Quantity, product.Version)
	
	// Update the product
	product.Quantity = 90
	if err := repo.Update(product); err != nil {
		log.Fatal(err)
	}
	fmt.Printf("Updated product: ID=%d, Quantity=%d, Version=%d\n",
		product.ID, product.Quantity, product.Version)
	
	// Update again
	product.Quantity = 80
	if err := repo.Update(product); err != nil {
		log.Fatal(err)
	}
	fmt.Printf("Updated again: ID=%d, Quantity=%d, Version=%d\n",
		product.ID, product.Quantity, product.Version)
}

func demoConcurrentModification(repo *ProductRepository) {
	// Create a product
	product := &Product{
		Name:     "Gadget",
		Quantity: 50,
	}
	repo.Create(product)
	fmt.Printf("Created product: ID=%d, Version=%d\n", product.ID, product.Version)
	
	// Simulate two users reading the same product
	user1Product, _ := repo.FindByID(product.ID)
	user2Product, _ := repo.FindByID(product.ID)
	
	fmt.Printf("User 1 reads: Version=%d, Quantity=%d\n", user1Product.Version, user1Product.Quantity)
	fmt.Printf("User 2 reads: Version=%d, Quantity=%d\n", user2Product.Version, user2Product.Quantity)
	
	// User 1 updates first
	user1Product.Quantity = 40
	if err := repo.Update(user1Product); err != nil {
		log.Fatal(err)
	}
	fmt.Printf("User 1 updates successfully: Version=%d, Quantity=%d\n",
		user1Product.Version, user1Product.Quantity)
	
	// User 2 tries to update with old version
	user2Product.Quantity = 45
	err := repo.Update(user2Product)
	if err != nil {
		fmt.Printf("User 2 update FAILED (expected): %v\n", err)
		fmt.Println("✓ Concurrent modification was detected!")
	} else {
		fmt.Println("ERROR: Should have detected concurrent modification!")
	}
}

func demoSafeUpdate(repo *ProductRepository) {
	// Create a product
	product := &Product{
		Name:     "Doohickey",
		Quantity: 100,
	}
	repo.Create(product)
	fmt.Printf("Created product: ID=%d, Quantity=%d\n", product.ID, product.Quantity)
	
	// Use SafeUpdate which handles retries automatically
	err := repo.SafeUpdate(product.ID, func(p *Product) error {
		p.Quantity -= 10  // Decrease quantity
		fmt.Printf("Applying update: new quantity = %d\n", p.Quantity)
		return nil
	})
	
	if err != nil {
		log.Fatal(err)
	}
	
	// Verify the update
	updated, _ := repo.FindByID(product.ID)
	fmt.Printf("Updated successfully: Quantity=%d, Version=%d\n", updated.Quantity, updated.Version)
}

func demoMultiUser(repo *ProductRepository) {
	// Create a product
	product := &Product{
		Name:     "Popular Item",
		Quantity: 100,
	}
	repo.Create(product)
	fmt.Printf("Created product: ID=%d, Initial Quantity=%d\n", product.ID, product.Quantity)
	
	// Simulate multiple users trying to decrease quantity concurrently
	var wg sync.WaitGroup
	successCount := 0
	failureCount := 0
	var mu sync.Mutex
	
	// 10 users try to decrease quantity by 10 each
	for i := 1; i <= 10; i++ {
		wg.Add(1)
		userID := i
		
		go func() {
			defer wg.Done()
			
			err := repo.SafeUpdate(product.ID, func(p *Product) error {
				if p.Quantity < 10 {
					return fmt.Errorf("insufficient quantity")
				}
				p.Quantity -= 10
				return nil
			})
			
			mu.Lock()
			if err != nil {
				failureCount++
				fmt.Printf("User %d: FAILED - %v\n", userID, err)
			} else {
				successCount++
				fmt.Printf("User %d: SUCCESS - decreased quantity by 10\n", userID)
			}
			mu.Unlock()
		}()
	}
	
	wg.Wait()
	
	// Check final state
	final, _ := repo.FindByID(product.ID)
	fmt.Println()
	fmt.Printf("Final state: Quantity=%d, Version=%d\n", final.Quantity, final.Version)
	fmt.Printf("Successful updates: %d, Failed updates: %d\n", successCount, failureCount)
	fmt.Printf("Expected quantity: 100 - (%d × 10) = %d\n", successCount, 100-(successCount*10))
	
	if final.Quantity == 100-(successCount*10) {
		fmt.Println("✓ Optimistic locking prevented data corruption!")
	}
}
