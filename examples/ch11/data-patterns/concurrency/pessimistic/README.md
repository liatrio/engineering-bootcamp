# Pessimistic Locking Pattern Example

This example demonstrates Pessimistic Locking in Go using SQLite transactions, showing how to ensure exclusive access to data.

## What is Pessimistic Locking?

Pessimistic Locking is a concurrency control strategy that assumes conflicts are likely. It:

1. Acquires an exclusive lock **before** reading data
2. Holds the lock during the entire operation
3. Prevents other transactions from reading or modifying locked data
4. Releases the lock when the transaction commits or rolls back

This guarantees no other transaction can interfere while you work.

## How It Works

### Database Transactions

Pessimistic locking uses database transactions to lock rows:

```go
// Begin transaction
tx, _ := db.Begin()

// Read with lock (other transactions must wait)
account := FindByIDForUpdate(tx, accountID)

// Modify data (still locked)
account.Balance += 100

// Update (still locked)
Update(tx, account)

// Commit (releases lock)
tx.Commit()
```

### Lock Duration

The lock is held for the **entire transaction**, ensuring atomicity:

- **Read**: Lock acquired
- **Business logic**: Lock held
- **Write**: Lock held
- **Commit**: Lock released

## Structure

- `pessimistic_lock.go`: Implements pessimistic locking with:
  - `FindByIDForUpdate()`: Reads with exclusive lock within a transaction
  - `Transfer()`: Atomic money transfer between accounts
  - `WithLock()`: Helper function for locked operations
- `main.go`: Demonstrates four scenarios:
  1. Basic transaction with locking
  2. Safe money transfer
  3. Preventing concurrent modifications
  4. Using the WithLock helper pattern
- `pessimistic_lock_test.go`: Tests all locking scenarios

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
1. Locking an account for exclusive access
2. Transferring money between accounts atomically
3. Multiple goroutines safely modifying the same account
4. Using the WithLock helper for complex operations

### Run Tests

```bash
go test -v
```

The tests verify transaction atomicity, rollback behavior, and deadlock prevention.

## Money Transfer Scenario

**The Problem**: Without locking, concurrent transfers can corrupt data:

```text
Alice: $1000, Bob: $500

Transaction 1: Transfer $300 from Alice to Bob
  - Read Alice: $1000
  - Read Bob: $500
  
Transaction 2: Transfer $200 from Alice to Bob (concurrent!)
  - Read Alice: $1000  ← Still sees $1000!
  - Read Bob: $500
  
Transaction 1 commits: Alice = $700, Bob = $800
Transaction 2 commits: Alice = $800, Bob = $700  ← Overwrites T1!

Result: Lost $300! 💸
```

**The Solution**: Pessimistic locking prevents this:

```text
Transaction 1: Acquires lock on Alice and Bob
  - Lock acquired
  - Read Alice: $1000
  - Read Bob: $500
  - Update Alice: $700
  - Update Bob: $800
  - Commit (releases lock)

Transaction 2: Waits for lock
  - Lock acquired (after T1 commits)
  - Read Alice: $700  ← Sees updated value
  - Read Bob: $800
  - Update Alice: $500
  - Update Bob: $1000
  - Commit

Result: Correct balances! ✅
```

## When to Use Pessimistic Locking

**Use Pessimistic Locking when:**
- Conflicts are common (many concurrent updates to same data)
- The cost of conflicts is high (financial transactions, inventory)
- Operations must complete without retries
- Immediate consistency is critical

**Example Use Cases:**
- Banking transactions (money transfers, withdrawals)
- Seat reservations (planes, theaters)
- Inventory allocation (e-commerce order fulfillment)
- Critical configuration updates

**Consider Optimistic Locking instead when:**
- Conflicts are rare
- Read concurrency is high with occasional writes
- Retries are acceptable
- Lock contention would hurt performance

## Deadlock Prevention

When locking multiple resources, always acquire locks in a consistent order:

```go
// Bad: Can cause deadlock
Thread 1: Lock A, then Lock B
Thread 2: Lock B, then Lock A  ← Deadlock!

// Good: Always lock in same order
if accountA.ID < accountB.ID {
    Lock A, then Lock B
} else {
    Lock B, then Lock A
}
```

Our `Transfer()` method implements this by always locking accounts in ID order.

## Key Takeaways

1. **Exclusive Access**: Lock acquired before reading, held until commit
2. **Atomicity**: All-or-nothing operations with automatic rollback on errors
3. **Consistency**: Guaranteed no concurrent modifications during transaction
4. **Performance Trade-off**: Better consistency but lower concurrency than optimistic locking
5. **Deadlock Awareness**: Always acquire multiple locks in consistent order

## Comparison: Optimistic vs Pessimistic

| Aspect | Optimistic | Pessimistic |
|--------|------------|-------------|
| **Assumption** | Conflicts are rare | Conflicts are common |
| **Lock timing** | No lock until write | Lock on read |
| **Concurrency** | High (no blocking) | Lower (blocking) |
| **Retries** | Required on conflict | Not needed |
| **Best for** | Read-heavy workloads | Write-heavy workloads |

## Next Steps

- Compare this with the Optimistic Locking example
- Explore how this integrates with Repository pattern
- Consider combining with Unit of Work pattern for complex transactions
- Study database-specific locking features (FOR UPDATE, SERIALIZABLE isolation)
