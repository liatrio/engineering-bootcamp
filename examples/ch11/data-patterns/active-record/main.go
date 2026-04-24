package main

import (
	"fmt"
	"log"
)

func main() {
	fmt.Println("=== Active Record Pattern Demo ===")
	fmt.Println()
	
	// Initialize database
	if err := InitDB(":memory:"); err != nil {
		log.Fatal(err)
	}
	defer DB.Close()
	
	fmt.Println("--- Creating Users ---")
	
	// Create a new user - the object knows how to save itself
	alice := &User{
		Name:  "Alice",
		Email: "alice@example.com",
	}
	
	// Validate before saving
	if err := alice.Validate(); err != nil {
		log.Fatal(err)
	}

	// Save the user (insert) - returns new User with ID
	alice, err := alice.Save()
	if err != nil {
		log.Fatal(err)
	}
	fmt.Printf("Created user: %+v\n", alice)
	
	// Create another user
	bob := &User{
		Name:  "Bob",
		Email: "bob@example.com",
	}
	bob, err = bob.Save()
	if err != nil {
		log.Fatal(err)
	}
	fmt.Printf("Created user: %+v\n", bob)
	
	fmt.Println()
	fmt.Println("--- Finding Users ---")
	
	// Find user by ID
	found, err := FindUserByID(alice.ID)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Printf("Found by ID %d: %+v\n", alice.ID, found)
	
	// Find user by email
	foundByEmail, err := FindUserByEmail("bob@example.com")
	if err != nil {
		log.Fatal(err)
	}
	fmt.Printf("Found by email: %+v\n", foundByEmail)
	
	fmt.Println()
	fmt.Println("--- Updating Users ---")
	
	// Update a user - just change the object and call Save()
	alice.Name = "Alice Smith"
	alice, err = alice.Save()
	if err != nil {
		log.Fatal(err)
	}
	fmt.Printf("Updated user: %+v\n", alice)
	
	// Reload to verify the update persisted
	if err := alice.Reload(); err != nil {
		log.Fatal(err)
	}
	fmt.Printf("Reloaded user: %+v\n", alice)
	
	fmt.Println()
	fmt.Println("--- Listing All Users ---")
	
	users, err := AllUsers()
	if err != nil {
		log.Fatal(err)
	}
	fmt.Printf("Total users: %d\n", len(users))
	for _, u := range users {
		fmt.Printf("  - %+v\n", u)
	}
	
	fmt.Println()
	fmt.Println("--- Deleting Users ---")
	
	// Delete a user - the object knows how to delete itself
	if err := bob.Delete(); err != nil {
		log.Fatal(err)
	}
	fmt.Printf("Deleted user with ID %d\n", bob.ID)
	
	// Verify deletion
	remaining, _ := AllUsers()
	fmt.Printf("Remaining users: %d\n", len(remaining))
	
	fmt.Println()
	fmt.Println("--- Validation Example ---")
	
	// Try to create an invalid user
	invalidUser := &User{
		Name:  "",  // Invalid: empty name
		Email: "test@example.com",
	}
	
	if err := invalidUser.Validate(); err != nil {
		fmt.Printf("Validation error (expected): %v\n", err)
	}
	
	fmt.Println()
	fmt.Println("✓ Active Record pattern: domain objects that save themselves!")
}
