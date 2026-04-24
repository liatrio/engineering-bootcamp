const rawQuizdown = `
---
shuffleQuestions: true
shuffleAnswers: true
---

# What is the primary benefit of the Repository Pattern?

1. [x] It abstracts data access logic behind an interface, allowing different storage implementations
	> Correct! The Repository Pattern provides an abstraction layer that lets you switch between different data sources (in-memory, SQL, NoSQL) without changing business logic.
1. [ ] It makes domain objects responsible for their own persistence
	> Not quite. That's the Active Record Pattern, where domain objects have methods to save themselves.
1. [ ] It prevents concurrent modifications using version numbers
	> Not quite. That's Optimistic Locking, which uses version fields to detect conflicts.
1. [ ] It locks data exclusively during transactions
	> Not quite. That's Pessimistic Locking, which holds exclusive locks during operations.

# In Active Record Pattern, where does the persistence logic live?

1. [x] Inside the domain object itself (e.g., user.Save(), user.Delete())
	> Correct! Active Record combines domain logic and persistence logic in the same object. The object knows how to save and delete itself.
1. [ ] In a separate repository class
	> Not quite. That's the Repository Pattern, where persistence is separated into repository classes.
1. [ ] In the database as stored procedures
	> Not quite. Active Record uses application code, not database procedures, for persistence logic.
1. [ ] In a service layer only
	> Not quite. While services may use Active Records, the persistence methods are on the domain objects themselves.

# You're building a financial system with frequent concurrent updates to the same accounts. Which locking strategy should you use?

1. [x] Pessimistic Locking - lock accounts exclusively during the entire transaction
	> Correct! For financial transactions where conflicts are common and retries are problematic, Pessimistic Locking ensures exclusive access and prevents conflicts entirely.
1. [ ] Optimistic Locking - check version numbers when saving
	> Not quite. While Optimistic Locking works for rare conflicts, financial transactions with frequent concurrent updates need the guarantees of Pessimistic Locking.
1. [ ] No locking - just save directly
	> Not quite. Without locking, concurrent updates will corrupt account balances.
1. [ ] Repository Pattern - use interface abstraction
	> Not quite. Repository Pattern is about data access abstraction, not concurrency control.

# What happens in Optimistic Locking when two users update the same record?

1. [x] The second user's update fails with a conflict error, and they must retry with fresh data
	> Correct! Optimistic Locking detects conflicts by checking version numbers. If the version changed, it means someone else modified the record, so the update fails and requires a retry.
1. [ ] Both updates succeed, and the last one wins
	> Not quite. Without version checking, this would happen, but Optimistic Locking prevents this by detecting the conflict.
1. [ ] The second user waits until the first user commits
	> Not quite. That's Pessimistic Locking behavior, where locks force waiting. Optimistic Locking doesn't use locks.
1. [ ] The changes are automatically merged
	> Not quite. Optimistic Locking detects conflicts but doesn't merge changes. The application must handle retries.

# When comparing Repository vs Active Record, which statement is TRUE?

1. [x] Repository separates domain objects from persistence logic, Active Record combines them
	> Correct! Repository keeps domain objects "persistence-ignorant" with separate repository classes. Active Record puts persistence methods directly on domain objects.
1. [ ] Repository is always faster than Active Record
	> Not quite. Performance depends on implementation details, not the pattern itself.
1. [ ] Active Record requires more boilerplate code than Repository
	> Not quite. Active Record typically requires less code since persistence is built into domain objects, while Repository requires separate repository classes.
1. [ ] Repository cannot be tested without a real database
	> Not quite. Actually, Repository is easier to test because you can mock the repository interface. Active Record is harder to test since persistence is in the domain object.

# A version field that increments on every update is a characteristic of:

1. [x] Optimistic Locking
	> Correct! Optimistic Locking uses a version field (or timestamp) to detect concurrent modifications. Each update increments the version.
1. [ ] Pessimistic Locking
	> Not quite. Pessimistic Locking uses database locks, not version fields.
1. [ ] Repository Pattern
	> Not quite. Repository Pattern is about data access abstraction, not versioning.
1. [ ] Active Record Pattern
	> Not quite. While Active Record objects can use Optimistic Locking, the version field is specific to the locking strategy, not the pattern.

# You have a read-heavy application where users occasionally update their profiles. Conflicts are rare. Which locking strategy is best?

1. [x] Optimistic Locking - no locks during reads, detect conflicts on write
	> Correct! For rare conflicts and high read concurrency, Optimistic Locking is ideal. It doesn't block reads and handles the occasional conflict with retry logic.
1. [ ] Pessimistic Locking - lock on every read
	> Not quite. Pessimistic Locking would block concurrent reads unnecessarily, hurting performance when conflicts are rare.
1. [ ] No locking needed - conflicts won't happen
	> Not quite. Even rare conflicts need handling, or you'll lose updates.
1. [ ] Active Record Pattern
	> Not quite. Active Record is about persistence structure, not concurrency control.

# Which code example demonstrates the Repository Pattern?

\`\`\`go
// Option A
type UserRepository interface {
    Create(user *User) error
    FindByID(id int) (*User, error)
}

// Option B
func (u *User) Save() error {
    db.Exec("INSERT INTO users...", u.Name)
}

// Option C
UPDATE products SET quantity = ? WHERE id = ? AND version = ?
\`\`\`

1. [x] Option A - Interface defining data access operations
	> Correct! Repository Pattern uses interfaces to abstract data access. The interface defines operations without specifying how they're implemented.
1. [ ] Option B - Domain object with Save() method
	> Not quite. This is Active Record Pattern, where the object saves itself.
1. [ ] Option C - Version-based conditional update
	> Not quite. This is Optimistic Locking, checking version to detect conflicts.
1. [ ] All of the above
	> Not quite. Each option demonstrates a different pattern.

# What is a key disadvantage of Pessimistic Locking?

1. [x] Lower concurrency - locks block other operations, reducing throughput
	> Correct! Pessimistic Locking holds exclusive locks during the entire transaction, forcing other operations to wait. This reduces concurrency compared to Optimistic Locking.
1. [ ] It cannot prevent data corruption
	> Not quite. Pessimistic Locking actually guarantees data integrity by preventing concurrent access.
1. [ ] It requires version fields in the database
	> Not quite. Version fields are used by Optimistic Locking, not Pessimistic Locking.
1. [ ] It doesn't work with transactions
	> Not quite. Pessimistic Locking relies on database transactions to hold locks.

# True or False: In Repository Pattern, business logic should never depend on concrete repository implementations, only on the repository interface.

1. [x] True
	> Correct! This is the Dependency Inversion Principle in action. Business logic depends on the repository abstraction (interface), not concrete implementations. This makes it easy to swap implementations (in-memory, SQL, NoSQL) and test with mocks.
1. [ ] False
	> Not quite. Depending on concrete implementations would violate the abstraction benefit of Repository Pattern and make testing harder.

# When implementing money transfers between accounts, you lock both accounts in ID order (smaller ID first). Why?

1. [x] To prevent deadlocks when multiple transfers happen concurrently
	> Correct! Consistent lock ordering prevents deadlocks. If Thread 1 locks A then B, and Thread 2 locks B then A, they can deadlock. Locking in consistent order (by ID) prevents this.
1. [ ] To improve database query performance
	> Not quite. Lock ordering is about deadlock prevention, not query performance.
1. [ ] To implement Optimistic Locking
	> Not quite. Optimistic Locking doesn't use locks at all.
1. [ ] Because SQL requires it
	> Not quite. Lock ordering is an application-level strategy to prevent deadlocks, not a database requirement.

# Which pattern would make it easiest to switch from using a PostgreSQL database to an in-memory cache for testing?

1. [x] Repository Pattern - implement the same interface with different storage backends
	> Correct! Repository Pattern's interface abstraction makes it trivial to swap implementations. Just create InMemoryRepository and SQLRepository both implementing UserRepository, and your tests use the in-memory version.
1. [ ] Active Record Pattern - objects save themselves
	> Not quite. With Active Record, the persistence logic is in the domain object, making it harder to swap storage backends.
1. [ ] Optimistic Locking - use version numbers
	> Not quite. Optimistic Locking is about concurrency control, not storage abstraction.
1. [ ] Pessimistic Locking - use transactions
	> Not quite. Pessimistic Locking is about concurrency control, not storage abstraction.
`;

export { rawQuizdown }
