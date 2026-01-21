package main

import (
	"fmt"
	"log"
	"strings"
)

func main() {
	fmt.Println("=== Factory Pattern Demo: Database Connections ===")
	fmt.Println()

	// Configuration
	config := DatabaseConfig{
		Host:     "localhost",
		Port:     3306,
		Username: "admin",
		Password: "secret",
		Database: "myapp",
	}

	// Example 1: MySQL using Factory
	fmt.Println("--- Example 1: MySQL Database ---")
	runExample("mysql", config)

	fmt.Println()

	// Example 2: PostgreSQL using Factory
	fmt.Println("--- Example 2: PostgreSQL Database ---")
	postgresConfig := config
	postgresConfig.Port = 5432
	runExample("postgresql", postgresConfig)

	fmt.Println()

	// Example 3: SQLite using Factory
	fmt.Println("--- Example 3: SQLite Database ---")
	sqliteConfig := DatabaseConfig{
		Database: "./myapp.db",
	}
	runExample("sqlite", sqliteConfig)

	fmt.Println()

	// Example 4: Demonstrating Dependency Inversion Principle
	fmt.Println("--- Example 4: Dependency Inversion Principle ---")
	demonstrateDIP()

	fmt.Println("\n" + strings.Repeat("=", 60))
	fmt.Println("Demo completed!")
	fmt.Println(strings.Repeat("=", 60))
	fmt.Println("\nKey Takeaway:")
	fmt.Println("UserService depends on the Database INTERFACE, not concrete implementations.")
	fmt.Println("This is the Dependency Inversion Principle in action!")
	fmt.Println("The factory provides the concrete instance, but the client only knows the interface.")
}

func runExample(dbType string, config DatabaseConfig) {
	// Get the appropriate factory
	factory, err := GetDatabaseFactory(dbType)
	if err != nil {
		log.Fatalf("Error getting factory: %v", err)
	}

	// Create database instance using factory
	db, err := factory.CreateDatabase(config)
	if err != nil {
		log.Fatalf("Error creating database: %v", err)
	}

	// Create service with dependency injection
	service := NewUserService(db)

	// Use the service
	if err := service.Initialize(); err != nil {
		log.Fatalf("Error initializing service: %v", err)
	}

	fmt.Printf("Service is using: %s\n", service.GetDatabaseType())

	users, err := service.GetAllUsers()
	if err != nil {
		log.Fatalf("Error getting users: %v", err)
	}

	fmt.Printf("Retrieved %d users\n", len(users))

	if err := service.Shutdown(); err != nil {
		log.Fatalf("Error shutting down: %v", err)
	}

	fmt.Println("✓ Example completed successfully")
}

func demonstrateDIP() {
	fmt.Println("\nWithout Factory Pattern (VIOLATES DIP):")
	fmt.Println("  service := &UserService{")
	fmt.Println("    db: &MySQLDatabase{...},  // ❌ Tight coupling to MySQL")
	fmt.Println("  }")
	fmt.Println("  Problem: UserService is tightly coupled to MySQL")

	fmt.Println("\nWith Factory Pattern (FOLLOWS DIP):")
	fmt.Println("  factory := GetDatabaseFactory(\"mysql\")")
	fmt.Println("  db := factory.CreateDatabase(config)")
	fmt.Println("  service := NewUserService(db)  // ✓ Depends on interface")
	fmt.Println("  Solution: UserService depends on Database interface")

	fmt.Println("\nBenefits of DIP with Factory:")
	fmt.Println("  1. Easy to switch databases via configuration")
	fmt.Println("  2. Easy to test with mock databases")
	fmt.Println("  3. UserService never changes when adding new database types")
	fmt.Println("  4. Dependencies are injected, not created internally")

	// Demonstrate switching databases easily
	fmt.Println("\nDemonstrating easy database switching:")

	databases := []string{"mysql", "postgresql", "sqlite"}
	for _, dbType := range databases {
		factory, _ := GetDatabaseFactory(dbType)
		db, _ := factory.CreateDatabase(DatabaseConfig{
			Host:     "localhost",
			Port:     3306,
			Database: "test.db",
		})

		// Same UserService code works with ANY database!
		service := NewUserService(db)
		fmt.Printf("  - Created service with %s (no code changes!)\n", service.GetDatabaseType())
	}
}
