# Active Record Pattern Example

This example demonstrates the Active Record Pattern in Go, where domain objects encapsulate both their data and the logic to persist themselves.

## What is the Active Record Pattern?

The Active Record Pattern is a design pattern where domain objects contain both:
- **Data**: The object's properties/attributes
- **Persistence Logic**: Methods to save, update, delete, and find themselves in the database

This pattern was popularized by Ruby on Rails and is used in many ORM frameworks.

## Structure

- `user.go`: Contains the `User` struct with methods for:
  - `Save()`: Insert or update the user in the database
  - `Delete()`: Remove the user from the database
  - `Reload()`: Refresh the user's data from the database
  - `Validate()`: Check if the user's data is valid
  - Class methods: `FindUserByID()`, `FindUserByEmail()`, `AllUsers()`
- `main.go`: Demonstrates the Active Record pattern in action
- `user_test.go`: Tests all User methods

## Key Concepts

### Self-Persisting Objects

With Active Record, objects know how to save themselves:

```go
user := &User{Name: "Alice", Email: "alice@example.com"}
user.Save()  // Object saves itself to the database
```

No separate repository or DAO class needed!

### Class Methods for Queries

Static methods (functions) provide query functionality:

```go
user, err := FindUserByID(1)
allUsers, err := AllUsers()
```

### Business Logic in the Model

Validation and business rules live in the domain object:

```go
func (u *User) Validate() error {
    if u.Name == "" {
        return fmt.Errorf("name cannot be empty")
    }
    // ... more validation
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
1. Creating users with the Save() method
2. Finding users by ID and email
3. Updating users by modifying the object and calling Save()
4. Deleting users with the Delete() method
5. Validating user data before saving

### Run Tests

```bash
go test -v
```

The tests verify all CRUD operations and validation logic.

## Active Record vs Repository Pattern

| Aspect | Active Record | Repository |
|--------|--------------|------------|
| **Where is persistence logic?** | In the domain object | In a separate repository class |
| **Testability** | Harder - objects coupled to database | Easier - can mock repository interface |
| **Simplicity** | Simpler for CRUD operations | More abstraction overhead |
| **Domain model purity** | Domain objects know about persistence | Domain objects are persistence-ignorant |
| **Best for** | Simple CRUD apps, rapid prototyping | Complex domains, multiple data sources |

## When to Use Active Record Pattern

**Use Active Record when:**
- You have a simple domain model that maps closely to database tables
- You need rapid development with minimal boilerplate
- Your application is primarily CRUD operations
- You're using a framework that supports Active Record (Rails, Laravel, Django)

**Consider Repository Pattern instead when:**
- You need to support multiple data sources
- You want complete separation between domain and persistence
- Testing with mocks is critical
- Your domain model is complex and doesn't map 1:1 to database tables

## Key Takeaways

1. **Convenience**: Active Record provides a simple, intuitive API for data persistence
2. **Trade-offs**: You gain simplicity but lose separation of concerns
3. **Framework Support**: Many popular web frameworks use this pattern
4. **Evolution**: You can start with Active Record and refactor to Repository later if needed

## Next Steps

- Compare this with the Repository pattern example
- Explore concurrency patterns (Optimistic and Pessimistic Locking)
- Consider how Active Record fits with layered architecture from Chapter 11.1
