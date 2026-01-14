# Optimistic Locking Pattern Example

This example demonstrates Optimistic Locking in Go using SQLite, showing how to handle concurrent modifications safely.

## What is Optimistic Locking?

Optimistic Locking is a concurrency control strategy that assumes conflicts are rare. Instead of locking resources upfront (like Pessimistic Locking), it:

1. Reads data without locks
2. Tracks a version number for each record
3. When updating, checks if the version has changed
4. If the version changed → reject the update (conflict detected)
5. If the version matches → apply update and increment version

## How It Works

### Version Field

Each record has a `version` field that increments on every update:

```sql
CREATE TABLE products (
    id INTEGER PRIMARY KEY,
    name TEXT,
    quantity INTEGER,
    version INTEGER DEFAULT 1  -- Version for optimistic locking
)
```

### Conditional Update

Updates only succeed if the version matches:

```sql
UPDATE products 
SET quantity = ?, version = version + 1
WHERE id = ? AND version = ?  -- Only update if version matches
```

If zero rows are affected, a concurrent modification was detected!

## Structure

- `optimistic_lock.go`: Implements optimistic locking with:
  - `Update()`: Updates only if version matches (fails on conflict)
  - `SafeUpdate()`: Automatically retries on conflicts
- `main.go`: Demonstrates four scenarios:
  1. Basic optimistic locking with version tracking
  2. Detecting concurrent modifications
  3. Safe updates with automatic retry
  4. Multi-user concurrent updates
- `optimistic_lock_test.go`: Tests all locking scenarios

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
1. Version numbers incrementing with each update
2. Concurrent modification detection when two users update the same record
3. Automatic retry logic handling conflicts
4. Multiple goroutines updating concurrently

### Run Tests

```bash
go test -v
```

The tests verify version tracking, conflict detection, and retry logic.

## Multi-User Scenario

Imagine an e-commerce system where multiple users purchase the same product:

**Without Optimistic Locking:**
- User A reads quantity: 10
- User B reads quantity: 10
- User A buys 5 → sets quantity to 5
- User B buys 3 → sets quantity to 7
- **Problem**: User A's purchase is lost!

**With Optimistic Locking:**
- User A reads: quantity=10, version=1
- User B reads: quantity=10, version=1
- User A updates: quantity=5, version=2 ✓ Success
- User B tries to update with version=1 ✗ Conflict detected!
- User B retries: reads quantity=5, version=2
- User B updates: quantity=2, version=3 ✓ Success

## When to Use Optimistic Locking

**Use Optimistic Locking when:**
- Conflicts are rare (most updates won't collide)
- High read concurrency with occasional writes
- You want better performance than pessimistic locking
- Users can retry failed operations easily

**Example Use Cases:**
- E-commerce inventory updates
- Document editing (like Google Docs conflict detection)
- Configuration updates
- Profile updates

**Consider Pessimistic Locking instead when:**
- Conflicts are common (many concurrent updates)
- Retries are expensive or not user-friendly
- You need guaranteed exclusive access
- Financial transactions requiring immediate consistency

## Retry Strategies

The `SafeUpdate()` method demonstrates retry logic:

```go
func SafeUpdate(productID int, updateFn func(*Product) error) error {
    for attempt := 1; attempt <= maxRetries; attempt++ {
        product := FindByID(productID)  // Get latest version
        updateFn(product)               // Apply changes
        err := Update(product)          // Try to save
        
        if err == nil {
            return nil  // Success!
        }
        
        if isConcurrencyError(err) {
            continue  // Retry with fresh data
        }
        
        return err  // Other error - don't retry
    }
}
```

## Immutability in Concurrent Code

### Why Immutability Matters for Concurrency

This implementation uses **immutable updates** - methods return new objects instead of mutating:

```go
// Good: Returns new Product with incremented version
product, err := repo.Update(product)

// Bad: Mutates input product
repo.Update(product)  // modifies product.Version internally
```

**Critical for Concurrency:**
1. **Race Condition Prevention**: Prevents multiple goroutines from modifying the same object
2. **Predictable State**: Each goroutine works with its own immutable snapshot
3. **Retry Safety**: Retries can safely start with fresh, unmodified data
4. **Clear Ownership**: Return values make data flow explicit

### Example: Safe Concurrent Updates

```go
// Each goroutine gets its own product instance
go func() {
    product, err := repo.SafeUpdate(productID, func(p *Product) error {
        p.Quantity -= 10  // Modify local copy
        return nil
    })
    // product is a NEW instance, not shared
}()
```

Without immutability, multiple goroutines modifying the same `product` object would cause race conditions.

## Key Takeaways

1. **No Locks Required**: Read without locking, detect conflicts on write
2. **Version Tracking**: Each update increments a version counter
3. **Conflict Detection**: Compare versions to detect concurrent modifications
4. **Retry Logic**: Automatically retry with fresh data when conflicts occur
5. **Performance**: Better than pessimistic locking when conflicts are rare
6. **Immutability**: Return new objects to prevent race conditions in concurrent code

## Next Steps

- Compare with Pessimistic Locking pattern (exclusive locks)
- Explore how this fits with Repository and Active Record patterns
- Consider combining with transaction management for complex operations
