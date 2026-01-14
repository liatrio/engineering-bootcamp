# Repository Pattern Example

This example demonstrates the Repository Pattern in Go, showing how to abstract data access logic behind an interface.

## What is the Repository Pattern?

The Repository Pattern provides an abstraction layer between the business logic and data access logic. It allows you to:

- **Switch implementations easily**: Change from in-memory to SQL database without touching business logic
- **Improve testability**: Mock the repository interface in tests
- **Centralize data access**: All queries in one place instead of scattered throughout the application
- **Follow SOLID principles**: Particularly Dependency Inversion Principle (depend on abstractions, not concrete implementations)

## Structure

This example follows Go best practices with a clear file structure:

- `models.go`: Defines the `User` domain model
- `service.go`: Defines the `UserRepository` interface and `UserService` business logic
  - **Important**: The interface is defined where it's USED (in the service), not where it's implemented
  - This follows Go's convention: "Accept interfaces, return structs"
- `impl_sqlite.go`: SQLite implementation of UserRepository
  - Uses SQLite database for persistence
  - Implicitly satisfies the UserRepository interface
- `impl_memory.go`: In-memory implementation of UserRepository
  - Uses in-memory map for storage
  - Implicitly satisfies the UserRepository interface
- `main.go`: Demo code showing both implementations in action
- `repository_test.go`: Tests both implementations through the same interface

**Why this structure?** The `impl_` prefix makes implementations explicit and easy to identify. Each implementation is in its own file, making it clear that these are separate, interchangeable components that satisfy the same interface contract.

## Key Concepts

### Immutability Over Mutation

This implementation follows immutability principles: **Create and Update return new User objects instead of mutating inputs**.

```go
// Good: Returns new object, input unchanged
created, err := repo.Create(&User{Name: "Alice", Email: "alice@example.com"})
fmt.Println(created.ID)  // Has ID set

// Bad alternative (not used here): Mutates input
user := &User{Name: "Alice", Email: "alice@example.com"}
repo.Create(user)  // user.ID now set (surprising side effect!)
```

**Why this approach?**

1. **Principle of Least Surprise**: Callers don't expect their inputs to change
2. **Concurrency Safety**: Immutability makes concurrent code safer
3. **Testability**: Side effects complicate tests
4. **Functional Programming**: Aligns with modern Go practices

**Performance concerns?** For small structs like User (~24 bytes), the overhead is negligible (nanoseconds) compared to database I/O (milliseconds). Only consider mutation for truly large objects (megabytes) or extreme performance scenarios.

### Interface Abstraction

```go
type UserRepository interface {
    Create(user *User) (*User, error)  // Returns new user with ID
    FindByID(id int) (*User, error)
    FindAll() ([]*User, error)
    Update(user *User) (*User, error)  // Returns updated user
    Delete(id int) error
}
```

The interface defines **what** operations are available, not **how** they're implemented. Notice that Create and Update return new User objects, following immutability principles.

### Multiple Implementations

Both `SQLiteUserRepository` and `InMemoryUserRepository` implement the same interface, making them interchangeable:

```go
var repo UserRepository
repo = NewInMemoryUserRepository()        // or
repo = NewSQLiteUserRepository(db)        // Business logic doesn't care!
```

### Implicit Interface Satisfaction (Go Convention)

Unlike languages like C# or Java, Go uses **implicit interface satisfaction**. A type automatically satisfies an interface if it implements all required methods - no explicit declaration needed:

```go
// No "implements" keyword needed!
// SQLiteUserRepository satisfies UserRepository because it has all the methods

type SQLiteUserRepository struct { db *sql.DB }

func (r *SQLiteUserRepository) Create(user *User) error { /* ... */ }
func (r *SQLiteUserRepository) FindByID(id int) (*User, error) { /* ... */ }
// ... etc
```

This is why we separate implementations into their own files with the `impl_` prefix - it makes the implicit relationship more explicit and easier to understand.

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
