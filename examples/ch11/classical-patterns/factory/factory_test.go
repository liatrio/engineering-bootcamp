package main

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

// Test database factory creation
func TestGetDatabaseFactory(t *testing.T) {
	tests := []struct {
		name    string
		dbType  string
		wantErr bool
	}{
		{"MySQL factory", "mysql", false},
		{"PostgreSQL factory", "postgresql", false},
		{"Postgres alias", "postgres", false},
		{"SQLite factory", "sqlite", false},
		{"Invalid type", "invalid", true},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			factory, err := GetDatabaseFactory(tt.dbType)

			if tt.wantErr {
				assert.Error(t, err)
				assert.Nil(t, factory)
			} else {
				assert.NoError(t, err)
				assert.NotNil(t, factory)
			}
		})
	}
}

// Test MySQL implementation
func TestMySQLDatabase(t *testing.T) {
	config := DatabaseConfig{
		Host:     "localhost",
		Port:     3306,
		Database: "testdb",
	}

	factory := &MySQLFactory{}
	db, err := factory.CreateDatabase(config)
	require.NoError(t, err)
	require.NotNil(t, db)

	assert.Equal(t, "MySQL", db.GetType())

	// Test connection
	err = db.Connect()
	assert.NoError(t, err)

	// Test query
	results, err := db.Query("SELECT * FROM users")
	assert.NoError(t, err)
	assert.NotEmpty(t, results)

	// Test close
	err = db.Close()
	assert.NoError(t, err)
}

// Test PostgreSQL implementation
func TestPostgreSQLDatabase(t *testing.T) {
	config := DatabaseConfig{
		Host:     "localhost",
		Port:     5432,
		Database: "testdb",
	}

	factory := &PostgreSQLFactory{}
	db, err := factory.CreateDatabase(config)
	require.NoError(t, err)
	require.NotNil(t, db)

	assert.Equal(t, "PostgreSQL", db.GetType())

	err = db.Connect()
	assert.NoError(t, err)

	results, err := db.Query("SELECT * FROM users")
	assert.NoError(t, err)
	assert.NotEmpty(t, results)

	err = db.Close()
	assert.NoError(t, err)
}

// Test SQLite implementation
func TestSQLiteDatabase(t *testing.T) {
	config := DatabaseConfig{
		Database: "./test.db",
	}

	factory := &SQLiteFactory{}
	db, err := factory.CreateDatabase(config)
	require.NoError(t, err)
	require.NotNil(t, db)

	assert.Equal(t, "SQLite", db.GetType())

	err = db.Connect()
	assert.NoError(t, err)

	results, err := db.Query("SELECT * FROM users")
	assert.NoError(t, err)
	assert.NotEmpty(t, results)

	err = db.Close()
	assert.NoError(t, err)
}

// Test UserService with dependency injection
func TestUserService(t *testing.T) {
	config := DatabaseConfig{
		Host:     "localhost",
		Port:     3306,
		Database: "testdb",
	}

	factory := &MySQLFactory{}
	db, err := factory.CreateDatabase(config)
	require.NoError(t, err)

	// Create service with injected dependency
	service := NewUserService(db)
	assert.NotNil(t, service)

	// Test initialization
	err = service.Initialize()
	assert.NoError(t, err)

	// Test getting database type
	assert.Equal(t, "MySQL", service.GetDatabaseType())

	// Test retrieving users
	users, err := service.GetAllUsers()
	assert.NoError(t, err)
	assert.NotEmpty(t, users)

	// Test shutdown
	err = service.Shutdown()
	assert.NoError(t, err)
}

// Test Dependency Inversion Principle
// UserService should work with ANY database implementation
func TestDependencyInversionPrinciple(t *testing.T) {
	dbTypes := []string{"mysql", "postgresql", "sqlite"}

	for _, dbType := range dbTypes {
		t.Run(dbType, func(t *testing.T) {
			factory, err := GetDatabaseFactory(dbType)
			require.NoError(t, err)

			config := DatabaseConfig{
				Host:     "localhost",
				Port:     3306,
				Database: "test.db",
			}

			db, err := factory.CreateDatabase(config)
			require.NoError(t, err)

			// UserService works with ANY database without modification
			service := NewUserService(db)
			err = service.Initialize()
			assert.NoError(t, err)

			users, err := service.GetAllUsers()
			assert.NoError(t, err)
			assert.NotEmpty(t, users)

			err = service.Shutdown()
			assert.NoError(t, err)
		})
	}
}

// Test that UserService doesn't depend on concrete implementations
func TestUserServiceDoesNotDependOnConcreteTypes(t *testing.T) {
	// This test demonstrates that UserService only knows about the Database interface
	// It has no knowledge of MySQL, PostgreSQL, or SQLite concrete types

	// Create different database instances
	mysqlFactory, _ := GetDatabaseFactory("mysql")
	mysqlDB, _ := mysqlFactory.CreateDatabase(DatabaseConfig{})

	postgresFactory, _ := GetDatabaseFactory("postgresql")
	postgresDB, _ := postgresFactory.CreateDatabase(DatabaseConfig{})

	// UserService treats them identically through the interface
	service1 := NewUserService(mysqlDB)
	service2 := NewUserService(postgresDB)

	// Both services work the same way despite different underlying implementations
	assert.NotNil(t, service1)
	assert.NotNil(t, service2)

	// The services don't know or care about concrete types
	// They only depend on the Database interface (DIP in action!)
}
