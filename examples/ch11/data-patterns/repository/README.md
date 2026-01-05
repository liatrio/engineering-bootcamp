# Repository Pattern Example

This example demonstrates the Repository Pattern in Go, showing how to abstract data access logic behind an interface.

## What is the Repository Pattern?

The Repository Pattern provides an abstraction layer between the business logic and data access logic. It allows you to:

- **Switch implementations easily**: Change from in-memory to SQL database without touching business logic
- **Improve testability**: Mock the repository interface in tests
- **Centralize data access**: All queries in one place instead of scattered throughout the application
- **Follow SOLID principles**: Particularly Dependency Inversion Principle (depend on abstractions, not concrete implementations)

## Structure

- `repository.go`: Defines the `UserRepository` interface and two implementations:
  - `SQLiteUserRepository`: Uses SQLite database for persistence
  - `InMemoryUserRepository`: Uses in-memory map for storage
- `main.go`: Demonstrates using both implementations interchangeably
- `repository_test.go`: Tests both implementations through the same interface

## Key Concepts

### Interface Abstraction

```go
type UserRepository interface {
    Create(user *User) error
    FindByID(id int) (*User, error)
    FindAll() ([]*User, error)
    Update(user *User) error
    Delete(id int) error
}
```

The interface defines **what** operations are available, not **how** they're implemented.

### Multiple Implementations

Both `SQLiteUserRepository` and `InMemoryUserRepository` implement the same interface, making them interchangeable:

```go
var repo UserRepository
repo = NewInMemoryUserRepository()        // or
repo = NewSQLiteUserRepository(db)        // Business logic doesn't care!
```

### Service Layer Integration

The `UserService` depends on the `UserRepository` interface, not concrete implementations:

```go
type UserService struct {
    repo UserRepository  // Depends on abstraction, not implementation
}
```

## Running the Example

### Install Dependencies

```bash
go mod download
```

### Run the Demonstration

```bash
go run .
```

This will demonstrate:
1. Creating users with in-memory repository
2. Creating users with SQLite repository
3. Using the service layer with repository pattern

### Run Tests

```bash
go test -v
```

The tests verify both implementations work identically through the interface.

## When to Use Repository Pattern

**Use Repository Pattern when:**
- You need to switch between different data sources (SQL, NoSQL, APIs, etc.)
- You want to test business logic without a real database
- You have complex queries that should be centralized
- Your domain model is separate from your data model

**Consider alternatives when:**
- Your application is very simple with minimal data access
- You're using an ORM that already provides repository-like features
- The overhead of abstraction isn't justified by your use case

## Key Takeaways

1. **Abstraction Benefits**: The repository interface lets you change storage mechanisms without touching business logic
2. **Testability**: You can easily create mock repositories for testing
3. **Single Responsibility**: Each repository handles data access for one entity type
4. **Dependency Inversion**: Business logic depends on abstractions (interfaces), not concrete implementations

## Next Steps

- Compare with Active Record pattern (where domain objects handle their own persistence)
- Explore how repositories fit with Unit of Work pattern for transaction management
- Consider how repositories interact with service layers and domain models
