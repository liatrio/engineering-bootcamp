// Package factory demonstrates the Factory Pattern for creating database connections.
//
// The Factory Pattern embodies the Dependency Inversion Principle by ensuring
// that high-level code (like UserService) depends on abstractions (Database interface)
// rather than concrete implementations (MySQL, PostgreSQL, etc.).
package main

import (
	"fmt"
	"strings"
)

// Database defines the interface that all database implementations must satisfy.
// This abstraction allows different database types to be used interchangeably.
type Database interface {
	Connect() error
	Query(sql string) ([]map[string]interface{}, error)
	Close() error
	GetType() string
}

// DatabaseConfig holds configuration for database connections
type DatabaseConfig struct {
	Host     string
	Port     int
	Username string
	Password string
	Database string
}

// DatabaseFactory defines the interface for creating databases.
// This allows different factory implementations for different database types.
type DatabaseFactory interface {
	CreateDatabase(config DatabaseConfig) (Database, error)
}

// =============================================================================
// MySQL Implementation
// =============================================================================

// MySQLDatabase implements the Database interface for MySQL
type MySQLDatabase struct {
	config    DatabaseConfig
	connected bool
}

// Connect establishes a MySQL connection
func (db *MySQLDatabase) Connect() error {
	fmt.Printf("Connecting to MySQL at %s:%d...\n", db.config.Host, db.config.Port)
	// In real implementation: open actual MySQL connection
	db.connected = true
	fmt.Println("✓ MySQL connection established")
	return nil
}

// Query executes a SQL query on MySQL
func (db *MySQLDatabase) Query(sql string) ([]map[string]interface{}, error) {
	if !db.connected {
		return nil, fmt.Errorf("database not connected")
	}
	fmt.Printf("MySQL Query: %s\n", sql)
	// In real implementation: execute actual query
	return []map[string]interface{}{
		{"id": 1, "name": "Alice"},
		{"id": 2, "name": "Bob"},
	}, nil
}

// Close closes the MySQL connection
func (db *MySQLDatabase) Close() error {
	fmt.Println("Closing MySQL connection")
	db.connected = false
	return nil
}

// GetType returns the database type
func (db *MySQLDatabase) GetType() string {
	return "MySQL"
}

// MySQLFactory creates MySQL database instances
type MySQLFactory struct{}

// CreateDatabase creates a new MySQL database instance
func (f *MySQLFactory) CreateDatabase(config DatabaseConfig) (Database, error) {
	fmt.Println("Factory: Creating MySQL database instance")
	return &MySQLDatabase{
		config:    config,
		connected: false,
	}, nil
}

// =============================================================================
// PostgreSQL Implementation
// =============================================================================

// PostgreSQLDatabase implements the Database interface for PostgreSQL
type PostgreSQLDatabase struct {
	config    DatabaseConfig
	connected bool
}

// Connect establishes a PostgreSQL connection
func (db *PostgreSQLDatabase) Connect() error {
	fmt.Printf("Connecting to PostgreSQL at %s:%d...\n", db.config.Host, db.config.Port)
	// In real implementation: open actual PostgreSQL connection
	db.connected = true
	fmt.Println("✓ PostgreSQL connection established")
	return nil
}

// Query executes a SQL query on PostgreSQL
func (db *PostgreSQLDatabase) Query(sql string) ([]map[string]interface{}, error) {
	if !db.connected {
		return nil, fmt.Errorf("database not connected")
	}
	fmt.Printf("PostgreSQL Query: %s\n", sql)
	// In real implementation: execute actual query
	return []map[string]interface{}{
		{"id": 1, "name": "Charlie"},
		{"id": 2, "name": "Diana"},
	}, nil
}

// Close closes the PostgreSQL connection
func (db *PostgreSQLDatabase) Close() error {
	fmt.Println("Closing PostgreSQL connection")
	db.connected = false
	return nil
}

// GetType returns the database type
func (db *PostgreSQLDatabase) GetType() string {
	return "PostgreSQL"
}

// PostgreSQLFactory creates PostgreSQL database instances
type PostgreSQLFactory struct{}

// CreateDatabase creates a new PostgreSQL database instance
func (f *PostgreSQLFactory) CreateDatabase(config DatabaseConfig) (Database, error) {
	fmt.Println("Factory: Creating PostgreSQL database instance")
	return &PostgreSQLDatabase{
		config:    config,
		connected: false,
	}, nil
}

// =============================================================================
// SQLite Implementation
// =============================================================================

// SQLiteDatabase implements the Database interface for SQLite
type SQLiteDatabase struct {
	config    DatabaseConfig
	connected bool
}

// Connect establishes a SQLite connection
func (db *SQLiteDatabase) Connect() error {
	fmt.Printf("Opening SQLite database: %s\n", db.config.Database)
	// In real implementation: open actual SQLite file
	db.connected = true
	fmt.Println("✓ SQLite database opened")
	return nil
}

// Query executes a SQL query on SQLite
func (db *SQLiteDatabase) Query(sql string) ([]map[string]interface{}, error) {
	if !db.connected {
		return nil, fmt.Errorf("database not connected")
	}
	fmt.Printf("SQLite Query: %s\n", sql)
	// In real implementation: execute actual query
	return []map[string]interface{}{
		{"id": 1, "name": "Eve"},
		{"id": 2, "name": "Frank"},
	}, nil
}

// Close closes the SQLite database
func (db *SQLiteDatabase) Close() error {
	fmt.Println("Closing SQLite database")
	db.connected = false
	return nil
}

// GetType returns the database type
func (db *SQLiteDatabase) GetType() string {
	return "SQLite"
}

// SQLiteFactory creates SQLite database instances
type SQLiteFactory struct{}

// CreateDatabase creates a new SQLite database instance
func (f *SQLiteFactory) CreateDatabase(config DatabaseConfig) (Database, error) {
	fmt.Println("Factory: Creating SQLite database instance")
	return &SQLiteDatabase{
		config:    config,
		connected: false,
	}, nil
}

// =============================================================================
// Factory Registry (Simple Factory Pattern)
// =============================================================================

// GetDatabaseFactory returns the appropriate factory for the given database type.
// This is a simple factory that creates factory instances.
func GetDatabaseFactory(dbType string) (DatabaseFactory, error) {
	switch strings.ToLower(dbType) {
	case "mysql":
		return &MySQLFactory{}, nil
	case "postgresql", "postgres":
		return &PostgreSQLFactory{}, nil
	case "sqlite":
		return &SQLiteFactory{}, nil
	default:
		return nil, fmt.Errorf("unsupported database type: %s", dbType)
	}
}

// =============================================================================
// UserService (Demonstrates Dependency Inversion Principle)
// =============================================================================

// UserService is a high-level service that depends on the Database abstraction.
// This demonstrates the Dependency Inversion Principle:
// - High-level module (UserService) does NOT depend on low-level modules (MySQL, PostgreSQL)
// - Both depend on abstraction (Database interface)
type UserService struct {
	db Database
}

// NewUserService creates a new UserService with dependency injection.
// The database is injected (provided from outside) rather than created internally.
// This is the "Hollywood Principle": "Don't call us, we'll call you"
func NewUserService(db Database) *UserService {
	return &UserService{db: db}
}

// Initialize connects to the database
func (s *UserService) Initialize() error {
	return s.db.Connect()
}

// GetAllUsers retrieves all users from the database
func (s *UserService) GetAllUsers() ([]map[string]interface{}, error) {
	return s.db.Query("SELECT * FROM users")
}

// Shutdown closes the database connection
func (s *UserService) Shutdown() error {
	return s.db.Close()
}

// GetDatabaseType returns the type of database being used
func (s *UserService) GetDatabaseType() string {
	return s.db.GetType()
}
