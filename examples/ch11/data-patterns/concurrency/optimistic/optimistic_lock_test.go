package main

import (
	"database/sql"
	"testing"
)

func setupTestRepo(t *testing.T) *ProductRepository {
	db, err := sql.Open("sqlite3", ":memory:")
	if err != nil {
		t.Fatalf("Failed to open database: %v", err)
	}
	t.Cleanup(func() { db.Close() })
	
	repo, err := NewProductRepository(db)
	if err != nil {
		t.Fatalf("Failed to create repository: %v", err)
	}
	
	return repo
}

func TestCreate(t *testing.T) {
	repo := setupTestRepo(t)

	product := &Product{Name: "Test Product", Quantity: 100}
	createdProduct, err := repo.Create(product)

	if err != nil {
		t.Fatalf("Create failed: %v", err)
	}

	if createdProduct.ID == 0 {
		t.Error("Expected product ID to be set")
	}

	if createdProduct.Version != 1 {
		t.Errorf("Expected initial version to be 1, got %d", createdProduct.Version)
	}

	// Verify immutability: original product should not be modified
	if product.ID != 0 {
		t.Error("Expected original product ID to remain 0 (immutability)")
	}
}

func TestFindByID(t *testing.T) {
	repo := setupTestRepo(t)

	product := &Product{Name: "Test Product", Quantity: 100}
	product, err := repo.Create(product)
	if err != nil {
		t.Fatalf("Create failed: %v", err)
	}

	found, err := repo.FindByID(product.ID)
	if err != nil {
		t.Fatalf("FindByID failed: %v", err)
	}

	if found.Name != product.Name || found.Quantity != product.Quantity {
		t.Errorf("Expected %+v, got %+v", product, found)
	}
}

func TestUpdate_Success(t *testing.T) {
	repo := setupTestRepo(t)

	product := &Product{Name: "Test Product", Quantity: 100}
	var err error
	product, err = repo.Create(product)
	if err != nil {
		t.Fatalf("Create failed: %v", err)
	}

	initialVersion := product.Version
	product.Quantity = 90

	product, err = repo.Update(product)
	if err != nil {
		t.Fatalf("Update failed: %v", err)
	}

	if product.Version != initialVersion+1 {
		t.Errorf("Expected version to increment to %d, got %d", initialVersion+1, product.Version)
	}

	// Verify in database
	updated, _ := repo.FindByID(product.ID)
	if updated.Quantity != 90 {
		t.Errorf("Expected quantity 90, got %d", updated.Quantity)
	}
}

func TestUpdate_ConcurrentModificationDetection(t *testing.T) {
	repo := setupTestRepo(t)

	product := &Product{Name: "Test Product", Quantity: 100}
	var err error
	product, err = repo.Create(product)
	if err != nil {
		t.Fatalf("Create failed: %v", err)
	}

	// Two users read the same product
	user1, _ := repo.FindByID(product.ID)
	user2, _ := repo.FindByID(product.ID)

	// User 1 updates successfully
	user1.Quantity = 90
	user1, err = repo.Update(user1)
	if err != nil {
		t.Fatalf("User 1 update should succeed: %v", err)
	}

	// User 2 tries to update with old version - should fail
	user2.Quantity = 85
	_, err = repo.Update(user2)
	if err == nil {
		t.Error("User 2 update should fail due to concurrent modification")
	}
	
	// Verify the database has user1's update
	final, _ := repo.FindByID(product.ID)
	if final.Quantity != 90 {
		t.Errorf("Expected quantity 90 (user1's update), got %d", final.Quantity)
	}
}

func TestSafeUpdate_Success(t *testing.T) {
	repo := setupTestRepo(t)

	product := &Product{Name: "Test Product", Quantity: 100}
	var err error
	product, err = repo.Create(product)
	if err != nil {
		t.Fatalf("Create failed: %v", err)
	}

	_, err = repo.SafeUpdate(product.ID, func(p *Product) error {
		p.Quantity -= 10
		return nil
	})

	if err != nil {
		t.Fatalf("SafeUpdate failed: %v", err)
	}

	updated, _ := repo.FindByID(product.ID)
	if updated.Quantity != 90 {
		t.Errorf("Expected quantity 90, got %d", updated.Quantity)
	}
}

func TestSafeUpdate_WithRetry(t *testing.T) {
	repo := setupTestRepo(t)
	
	product := &Product{Name: "Test Product", Quantity: 100}
	var err error
	product, err = repo.Create(product)
	if err != nil {
		t.Fatalf("Create failed: %v", err)
	}

	// Simulate concurrent updates sequentially to avoid race conditions in test
	successCount := 0

	for i := 0; i < 5; i++ {
		_, err := repo.SafeUpdate(product.ID, func(p *Product) error {
			p.Quantity -= 10
			return nil
		})
		if err == nil {
			successCount++
		}
	}
	
	// Verify final state matches successful updates
	final, _ := repo.FindByID(product.ID)
	expected := 100 - (successCount * 10)
	
	if final.Quantity != expected {
		t.Errorf("Expected quantity %d, got %d", expected, final.Quantity)
	}
	
	// All updates should succeed when run sequentially
	if successCount != 5 {
		t.Errorf("Expected 5 successful updates, got %d", successCount)
	}
}

func TestOptimisticLocking_VersionIncrement(t *testing.T) {
	repo := setupTestRepo(t)
	
	product := &Product{Name: "Test Product", Quantity: 100}
	var err error
	product, err = repo.Create(product)
	if err != nil {
		t.Fatalf("Create failed: %v", err)
	}

	if product.Version != 1 {
		t.Errorf("Initial version should be 1, got %d", product.Version)
	}

	// Update 3 times
	for i := 1; i <= 3; i++ {
		product.Quantity -= 10
		product, err = repo.Update(product)
		if err != nil {
			t.Fatalf("Update %d failed: %v", i, err)
		}
		
		expectedVersion := i + 1
		if product.Version != expectedVersion {
			t.Errorf("After update %d, expected version %d, got %d", i, expectedVersion, product.Version)
		}
	}
	
	// Verify final version in database
	final, _ := repo.FindByID(product.ID)
	if final.Version != 4 {
		t.Errorf("Expected final version 4, got %d", final.Version)
	}
}
