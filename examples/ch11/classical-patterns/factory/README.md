# Factory Pattern Example: Database Connections

> **Pattern Category**: Creational  
> **SOLID Connection**: Dependency Inversion Principle  
> **Language**: Go 1.21+

## Overview

This example demonstrates the **Factory Pattern** through a database connection system. The pattern abstracts object creation, allowing clients to work with database interfaces rather than concrete implementations (MySQL, PostgreSQL, SQLite).

## The Factory Pattern

The Factory Pattern defines an interface for creating objects but lets implementations decide which concrete class to instantiate. This decouples object creation from object usage.

### Key Components

1. **Product Interface** (`Database`): Defines the contract all database implementations must satisfy
2. **Concrete Products** (`MySQLDatabase`, `PostgreSQLDatabase`, `SQLiteDatabase`): Specific database implementations
3. **Factory Interface** (`DatabaseFactory`): Defines the creation contract
4. **Concrete Factories** (`MySQLFactory`, `PostgreSQLFactory`, `SQLiteFactory`): Create specific database instances
5. **Client** (`UserService`): Uses the Database interface without knowing concrete types

## Connection to Dependency Inversion Principle

This implementation perfectly demonstrates the **Dependency Inversion Principle** from [SOLID Principles](../../../../docs/11-application-development/11.2.1-solid-principles.md#dependency-inversion-principle-dip):

### High-Level Modules Depend on Abstractions

The `UserService` (high-level module) depends on the `Database` interface (abstraction), not on concrete implementations (MySQL, PostgreSQL):

```go
type UserService struct {
    db Database  // ✓ Depends on interface, not concrete type
}

func NewUserService(db Database) *UserService {
    return &UserService{db: db}
}
```

### Low-Level Modules Also Depend on Abstractions

Concrete database implementations (`MySQLDatabase`, `PostgreSQLDatabase`) implement the `Database` interface:

```go
type MySQLDatabase struct { /* ... */ }

func (db *MySQLDatabase) Connect() error { /* ... */ }
func (db *MySQLDatabase) Query(sql string) ([]map[string]interface{}, error) { /* ... */ }
// Implements Database interface
```

### Before Factory Pattern (Violates DIP)

Without the Factory Pattern, you'd have code like this:

```go
type UserService struct {
    db *MySQLDatabase  // ❌ Tightly coupled to MySQL
}

func NewUserService() *UserService {
    return &UserService{
        db: &MySQLDatabase{  // ❌ Creates concrete type internally
            host: "localhost",
            port: 3306,
        },
    }
}
```

**Problems**:
- UserService is tightly coupled to MySQL
- Can't test with mock database
- Can't switch databases without modifying UserService
- Violates DIP (high-level module depends on low-level module)

### With Factory Pattern (Follows DIP)

```go
// UserService depends on abstraction
type UserService struct {
    db Database  // ✓ Interface, not concrete type
}

// Dependency is injected from outside
func NewUserService(db Database) *UserService {
    return &UserService{db: db}
}

// Factory creates the concrete type
factory := GetDatabaseFactory("mysql")
db := factory.CreateDatabase(config)

// Client receives abstraction
service := NewUserService(db)  // ✓ Depends on interface
```

**Benefits**:
- ✅ **DIP Compliance**: High-level module (UserService) depends on abstraction (Database)
- ✅ **Testability**: Inject mock database for testing
- ✅ **Flexibility**: Switch databases via configuration
- ✅ **Maintainability**: Add new database types without changing UserService

## The Hollywood Principle

The Factory Pattern embodies the "Hollywood Principle": **"Don't call us, we'll call you"**

Instead of UserService creating its own dependencies (calling):
```go
// DON'T do this (calling)
service := &UserService{
    db: &MySQLDatabase{...},
}
```

Dependencies are provided to UserService (we'll call you):
```go
// DO this (we'll call you)
db := factory.CreateDatabase(config)
service := NewUserService(db)  // Dependency injected
```

## Setup

### Prerequisites

- Go 1.21 or higher
- Go modules enabled (default in modern Go)

### Installation

```bash
# Navigate to this directory
cd examples/ch11/classical-patterns/factory

# Download dependencies
go mod download

# Or use go mod tidy to clean up
go mod tidy
```

## Running the Demo

```bash
# Run the demonstration
go run .

# Or explicitly
go run main.go factory.go
```

Expected output shows:
- Creating different database instances using factories
- UserService working identically with different databases
- Demonstration of DIP and easy database switching

## Running Tests

```bash
# Run all tests
go test -v

# Run specific test
go test -v -run TestDependencyInversionPrinciple

# Run with coverage
go test -cover

# Run with detailed coverage
go test -coverprofile=coverage.out
go tool cover -html=coverage.out
```

All tests should pass, demonstrating:
- Each database factory works correctly
- Each database implementation satisfies the interface
- UserService works with any database (DIP)
- No dependency on concrete types

## Project Structure

```
factory/
├── factory.go       # Database interface, factories, and implementations
├── main.go          # Executable demo
├── factory_test.go  # Unit tests
├── go.mod           # Go module definition
└── README.md        # This file
```

## When to Use Factory Pattern

✅ **Use Factory when**:
- Object creation is complex or requires configuration
- You want to decouple creation from usage
- You need to create different types based on conditions
- You want to centralize creation logic

❌ **Don't use Factory when**:
- You're only creating one type of object
- Object creation is trivial (just `new()` or struct literal)
- The overhead outweighs the benefits (YAGNI)

## Real-World Applications

The Factory Pattern is ubiquitous in production code:

1. **Database Connections**: As demonstrated (MySQL, PostgreSQL, SQLite, MongoDB)
2. **HTTP Clients**: Creating clients for different APIs or services
3. **Cloud Providers**: AWS, GCP, Azure resource creation
4. **Loggers**: Creating different logger implementations (file, console, remote)
5. **Document Parsers**: JSON, XML, YAML, TOML parsers
6. **Payment Gateways**: Stripe, PayPal, Square clients
7. **Message Queues**: RabbitMQ, Kafka, SQS producers/consumers
8. **Authentication Providers**: OAuth, SAML, LDAP authenticators

## Key Takeaways

1. **DIP in Action**: Factory Pattern enables Dependency Inversion Principle
2. **Loose Coupling**: Clients depend on interfaces, not implementations
3. **Testability**: Easy to inject mocks for testing
4. **Flexibility**: Switch implementations via configuration
5. **Hollywood Principle**: Dependencies are injected, not created internally

## Learning Exercise

Try extending this example:

1. Add a new database type (e.g., MongoDB, Redis)
2. Add connection pooling to database implementations
3. Add error handling and retry logic
4. Implement a configuration file to select database type
5. Add metrics/logging to track database usage

Notice how you can do all of this **without modifying the UserService**. The service only knows about the `Database` interface. That's the power of the Dependency Inversion Principle!

## Testing with Mocks

One of the biggest benefits of DIP with Factory is easy testing:

```go
// Create a mock database for testing
type MockDatabase struct{}

func (m *MockDatabase) Connect() error { return nil }
func (m *MockDatabase) Query(sql string) ([]map[string]interface{}, error) {
    return []map[string]interface{}{{"id": 1, "name": "test"}}, nil
}
func (m *MockDatabase) Close() error { return nil }
func (m *MockDatabase) GetType() string { return "Mock" }

// Use it in tests
func TestUserService(t *testing.T) {
    mockDB := &MockDatabase{}
    service := NewUserService(mockDB)  // ✓ Works perfectly!
    // Test without real database
}
```

## Related Patterns

- **Abstract Factory**: Creates families of related objects
- **Builder**: Constructs complex objects step by step
- **Singleton**: Ensures only one instance exists (can combine with Factory)
- **Strategy**: Often created by factories (Factory + Strategy is powerful)

## Further Reading

- [SOLID Principles - Dependency Inversion Principle](../../../../docs/11-application-development/11.2.1-solid-principles.md#dependency-inversion-principle-dip)
- [Gang of Four Design Patterns](https://en.wikipedia.org/wiki/Design_Patterns)
- [Refactoring Guru - Factory Method](https://refactoring.guru/design-patterns/factory-method)
- [Go Interfaces and Dependency Injection](https://golang.org/doc/effective_go#interfaces)
