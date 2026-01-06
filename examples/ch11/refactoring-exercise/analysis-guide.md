# Analysis Guide: E-Commerce Order System Refactoring

This guide helps you systematically analyze the starter application to identify anti-patterns, SOLID violations, and code smells. Use it to plan your refactoring strategy before making changes.

## Step 1: Initial Assessment & Metrics Collection

### Collect Baseline Metrics

Run these commands to establish "before" metrics:

```bash
# Count total lines of code in routes.ts
wc -l src/routes.ts
# Expected: ~450 lines

# Count total files in src/
find src -type f | wc -l
# Expected: 4 files

# Count functions/methods in routes.ts
grep -c "async (" src/routes.ts
# Expected: 4 route handlers

# Find the largest function (manual inspection)
# The POST /orders handler spans lines 24-309 (~285 lines!)
```

**Record Your Metrics:**

| Metric | Before | After (Your Solution) |
|--------|--------|-----------------------|
| Total lines in routes.ts | ~450 | Target: < 50 |
| Total files in src/ | 4 | Target: 15-20+ |
| Largest function size | ~285 lines | Target: < 30 lines |
| To add new payment type | Modify: ??? files | Target: Create 1 file |

### Architecture Diagram Exercise

Draw the current architecture on paper or whiteboard:

```
Client → routes.ts → SQLite Database
           ↓
    (Everything happens here)
    - Validation
    - Business Logic
    - Fee Calculation
    - Shipping Calculation
    - Data Access
    - Response Formatting
```

**Question:** What layers are missing from a proper layered architecture?

---

## Step 2: SOLID Principle Violations

### Single Responsibility Principle (SRP)

> "A class should have only one reason to change."

**Location:** `src/routes.ts` - POST /orders handler (lines 24-309)

**Identify all reasons this code might change:**

1. ⚠️ **Validation rules change** (lines 28-68)
   - Example: New validation rule for customer credit limit
   - Lines to change: 28-68

2. ⚠️ **Payment types or fees change** (lines 144-172)
   - Example: Credit card fee changes from 3% to 3.5%
   - Lines to change: 144-172

3. ⚠️ **Shipping methods or costs change** (lines 176-214)
   - Example: Add new "same-day" shipping option
   - Lines to change: 176-214

4. ⚠️ **Database schema changes** (lines 72-80, 84-140, 224-266, 270-282)
   - Example: Change table name from "orders" to "customer_orders"
   - Lines to change: Throughout entire file

5. ⚠️ **Business logic changes** (lines 84-140, 218-220)
   - Example: Apply volume discounts for bulk orders
   - Lines to change: Subtotal calculation logic

6. ⚠️ **HTTP API format changes** (lines 286-304)
   - Example: Change response format to match API v2 specification
   - Lines to change: Response formatting section

7. ⚠️ **Error handling strategy changes** (lines 308-314)
   - Example: Add structured error codes instead of messages
   - Lines to change: Error handling throughout

**Count:** 7+ reasons to change → **VIOLATES SRP**

**Exercise:** For each reason, identify which class it should belong to in a refactored design.

### Open/Closed Principle (OCP)

> "Software entities should be open for extension, closed for modification."

**Test Case:** Add Apple Pay as a new payment method (4% fee)

**Current Implementation (lines 144-172):**
```typescript
if (orderRequest.payment_type === 'credit_card') {
  paymentFee = subtotal * 0.03;
} else if (orderRequest.payment_type === 'paypal') {
  paymentFee = subtotal * 0.035;
} else if (orderRequest.payment_type === 'bitcoin') {
  paymentFee = 1.50;
} else {
  // Error
}
```

**To add Apple Pay, you must:**
1. ❌ Modify lines 144-172 (add new else-if branch)
2. ❌ Modify lines 56-60 (add 'apple_pay' to validation array)
3. ❌ Update types.ts (add to payment_type union)

**Modifications required:** 3 files → **VIOLATES OCP**

**Question:** How could Strategy Pattern allow adding Apple Pay by creating ONE new file without modifying existing code?

### Liskov Substitution Principle (LSP)

**Current Status:** ✅ Not explicitly violated (no inheritance hierarchy)

**Note:** LSP applies to inheritance relationships. This code doesn't use classes or inheritance, so LSP isn't directly violated. However, the refactored design should maintain LSP when introducing interfaces.

### Interface Segregation Principle (ISP)

**Current Status:** ⚠️ Partially violated

**Issue:** No interfaces exist at all. The code directly depends on concrete implementations (SQLite database, Express Request/Response).

**Evidence:**
- Direct import of `db` from database.ts (line 2)
- Direct use of SQLite-specific methods (`db.run`, `db.get`, `db.all`)
- Tightly coupled to Express types

**Impact:** Cannot substitute different implementations (PostgreSQL, mock database for testing, etc.)

### Dependency Inversion Principle (DIP)

> "Depend on abstractions, not concretions."

**Violations Found:**

1. **Direct SQLite Dependency** (lines 72-80, 94-140, 224-266, 270-282)
   ```typescript
   const customer = await dbGet<Customer>(
     'SELECT * FROM customers WHERE id = ?',
     [orderRequest.customer_id]
   );
   ```
   - Depends on concrete `dbGet` function
   - Depends on SQLite-specific SQL syntax
   - Cannot swap to PostgreSQL without rewriting
   - Cannot unit test without real database

2. **Direct Express Dependency**
   ```typescript
   router.post('/orders', async (req: Request, res: Response) => {
   ```
   - Business logic tightly coupled to HTTP layer
   - Cannot reuse order creation logic in CLI tool, scheduled job, or message queue

3. **No Abstraction Layer**
   - No interfaces defined
   - No dependency injection
   - Concrete dependencies hard-coded

**Count:** 3+ major violations → **VIOLATES DIP**

---

## Step 3: Code Smells

### God Object Smell

**Definition:** A class/module that knows too much or does too much.

**Evidence:**
- ✅ 450+ lines in single file
- ✅ 7+ responsibilities
- ✅ Handles validation, business logic, data access, and HTTP concerns
- ✅ Cannot describe its purpose in one sentence without using "and"

**Diagnostic Question:** "What does routes.ts do?"

❌ Bad Answer: "It validates input AND calculates fees AND processes payments AND manages shipping AND accesses the database AND formats responses..."

✅ Good Answer (after refactoring): "It handles HTTP request routing and delegates to services."

### Type Code Smell (if/else chains)

**Location 1:** Payment fee calculation (lines 144-172)
- Pattern: if/else chain based on string type code
- Problem: Violates OCP, duplicates structure for shipping

**Location 2:** Shipping cost calculation (lines 176-214)
- Pattern: Identical structure to payment fees
- Problem: Adding new type requires code modification

**Refactoring:** Replace Conditional with Polymorphism using Strategy Pattern

### Missing Abstraction Layers

**Evidence:**
```
Current:
  HTTP (routes.ts) → SQLite

Missing:
  HTTP (routes) → Services → Repositories → SQLite
                   ↓
               Strategies (payment, shipping)
```

**Problems:**
- Cannot test business logic without HTTP server
- Cannot test without database
- Cannot reuse logic in different contexts
- Violates separation of concerns

### Long Method Smell

**Evidence:** POST /orders handler is ~285 lines

**Problems:**
- Difficult to understand
- Multiple levels of abstraction
- Hard to test specific behaviors
- Difficult to modify

**Target:** Functions should be < 30 lines, ideally < 20

### Duplicated Structure

**Evidence:** Payment and shipping calculations follow identical patterns:

```typescript
// Payment (lines 144-172)
if (type === 'A') { fee = calc1; }
else if (type === 'B') { fee = calc2; }
else if (type === 'C') { fee = calc3; }

// Shipping (lines 176-214)
if (method === 'A') { cost = calc1; }
else if (method === 'B') { cost = calc2; }
else if (method === 'C') { cost = calc3; }
```

**Refactoring:** Both should use Strategy Pattern

---

## Step 4: Testability Assessment

### Current Testability Problems

1. **Cannot Unit Test Business Logic**
   - Must use HTTP endpoints (Supertest)
   - Must have SQLite database
   - Cannot mock data access
   - Tests are integration tests, not unit tests

2. **Cannot Test Payment Calculation Independently**
   ```typescript
   // Impossible:
   const fee = calculatePaymentFee(100.00, 'credit_card');
   
   // Required instead:
   await request(app).post('/api/orders').send({...fullOrder});
   ```

3. **Cannot Test with Mock Data**
   - Always requires real database with seed data
   - Slow test execution
   - Difficult to test edge cases

### After Refactoring (Goals)

```typescript
// Unit test business logic
const fee = paymentStrategy.calculateFee(100.00);

// Unit test with mocks
const mockRepo = new MockOrderRepository();
const service = new OrderService(mockRepo, ...);
await service.createOrder(request);

// Integration tests remain for end-to-end validation
```

---

## Step 5: Refactoring Roadmap

### Phase 1: Define Interfaces (2-3 hours)

**Goal:** Create abstraction contracts without changing behavior.

**Tasks:**
1. Create `IPaymentStrategy` interface
   ```typescript
   interface IPaymentStrategy {
     calculateFee(subtotal: number): number;
   }
   ```

2. Create `IShippingStrategy` interface
   ```typescript
   interface IShippingStrategy {
     calculateCost(): number;
     getDeliveryDays(): number;
   }
   ```

3. Create `IOrderRepository` interface
   ```typescript
   interface IOrderRepository {
     create(order: OrderData): Promise<number>;
     findById(id: number): Promise<Order | null>;
     // ...
   }
   ```

4. Create `IProductRepository` interface
   ```typescript
   interface IProductRepository {
     findById(id: number): Promise<Product | null>;
     updateStock(id: number, quantity: number): Promise<void>;
     // ...
   }
   ```

**Checkpoint:** Interfaces defined, no implementation changes yet.

### Phase 2: Implement Strategy Pattern (3-4 hours)

**Goal:** Eliminate if/else chains for payment and shipping.

**Tasks:**
1. Create `src/strategies/payment/`
   - `CreditCardPayment.ts` (implements IPaymentStrategy)
   - `PayPalPayment.ts` (implements IPaymentStrategy)
   - `BitcoinPayment.ts` (implements IPaymentStrategy)

2. Create `src/strategies/shipping/`
   - `StandardShipping.ts` (implements IShippingStrategy)
   - `ExpressShipping.ts` (implements IShippingStrategy)
   - `OvernightShipping.ts` (implements IShippingStrategy)

3. Create `src/factories/`
   - `PaymentStrategyFactory.ts` - creates payment strategies
   - `ShippingStrategyFactory.ts` - creates shipping strategies

4. Replace if/else chains with strategy lookup

**Checkpoint:** `npm test` still passes, if/else chains eliminated.

### Phase 3: Implement Repository Pattern (2-3 hours)

**Goal:** Abstract data access layer.

**Tasks:**
1. Create `src/repositories/`
   - `OrderRepository.ts` (implements IOrderRepository)
   - `ProductRepository.ts` (implements IProductRepository)

2. Inject database connection into repositories
   ```typescript
   const orderRepo = new OrderRepository(db);
   ```

3. Replace direct `dbGet/dbRun` calls with repository methods

**Checkpoint:** `npm test` still passes, no direct database calls in routes.

### Phase 4: Implement Service Layer (3-4 hours)

**Goal:** Separate business logic from HTTP layer.

**Tasks:**
1. Create `src/services/`
   - `ValidationService.ts` - input validation
   - `InventoryService.ts` - stock management
   - `OrderService.ts` - orchestrates order creation

2. Move business logic from routes.ts to services
   ```typescript
   class OrderService {
     constructor(
       private orderRepo: IOrderRepository,
       private productRepo: IProductRepository,
       private paymentFactory: PaymentStrategyFactory,
       private shippingFactory: ShippingStrategyFactory,
       private validationService: ValidationService,
       private inventoryService: InventoryService
     ) {}
     
     async createOrder(request: CreateOrderRequest): Promise<CreateOrderResponse> {
       // Business logic here
     }
   }
   ```

3. Update routes to delegate to services

**Checkpoint:** `npm test` still passes, routes.ts < 100 lines.

### Phase 5: Simplify HTTP Layer (1-2 hours)

**Goal:** Thin routes that only handle request/response.

**Tasks:**
1. Create `src/routes/orderRoutes.ts` (replace monolithic routes.ts)
   ```typescript
   router.post('/orders', async (req, res) => {
     try {
       const result = await orderService.createOrder(req.body);
       res.status(201).json(result);
     } catch (error) {
       // Error handling
     }
   });
   ```

2. Wire dependency injection in `src/index.ts`
   ```typescript
   const db = new Database(dbPath);
   const orderRepo = new OrderRepository(db);
   const productRepo = new ProductRepository(db);
   const paymentFactory = new PaymentStrategyFactory();
   const shippingFactory = new ShippingStrategyFactory();
   const validationService = new ValidationService();
   const inventoryService = new InventoryService(productRepo);
   const orderService = new OrderService(
     orderRepo,
     productRepo,
     paymentFactory,
     shippingFactory,
     validationService,
     inventoryService
   );
   const orderRoutes = createOrderRoutes(orderService);
   app.use('/api', orderRoutes);
   ```

**Checkpoint:** `npm test` still passes, routes.ts < 50 lines.

---

## Step 6: Verification Checklist

After completing your refactoring, verify:

### Behavioral Verification
- [ ] All tests pass without modification: `npm test`
- [ ] Can create orders with same API
- [ ] Payment fees calculate correctly (credit_card, paypal, bitcoin)
- [ ] Shipping costs calculate correctly (standard, express, overnight)
- [ ] Inventory decrements after successful orders

### Architecture Verification
- [ ] routes.ts (or equivalent) < 50 lines
- [ ] No if/else chains for payment or shipping types
- [ ] Business logic separated from HTTP layer
- [ ] Data access separated into repositories
- [ ] All major classes follow SRP (one responsibility)

### Extensibility Verification (OCP Test)
- [ ] Can add Apple Pay by creating ONE new file:
  ```bash
  # Create ApplePayPayment.ts
  # Register in PaymentStrategyFactory
  # No modifications to existing files required
  ```

### Testability Verification
- [ ] Can unit test OrderService without Express
- [ ] Can unit test with mock repositories
- [ ] Can test payment calculations without database

### Metrics Verification

| Metric | Before | After | ✓ |
|--------|--------|-------|---|
| Lines in routes | ~450 | < 50 | [ ] |
| Total files | 4 | 15-20+ | [ ] |
| Largest function | ~285 lines | < 30 lines | [ ] |
| To add payment type | Modify 3 files | Create 1 file | [ ] |

---

## Common Pitfalls to Avoid

1. **Don't change test files** - Tests validate behavior, which must be preserved
2. **Don't optimize prematurely** - Focus on patterns, not performance
3. **Don't add functionality** - This is refactoring, not feature development
4. **Don't skip interfaces** - Interfaces are key to DIP and testability
5. **Don't forget dependency injection** - Services should receive dependencies, not create them
6. **Don't make it too complex** - This is educational code, not enterprise architecture

---

## Success Criteria

Your refactored solution should:

✅ **Preserve all behavior** - Tests pass without modification
✅ **Follow SOLID principles** - No major violations remaining
✅ **Use design patterns correctly** - Strategy, Repository, Service Layer, Factory
✅ **Be measurably better** - Metrics show improvement
✅ **Be extensible** - Can add new payment/shipping types easily
✅ **Be testable** - Business logic can be unit tested

When complete, compare your solution to `../solution/` to see the reference implementation.

---

## Reflection Questions

After completing the refactoring, answer these:

1. **How much easier is the refactored code to understand compared to the original?**
   - Rate on scale of 1-10
   - What makes it easier?

2. **What trade-offs did you make?**
   - More files vs. less complexity per file
   - More abstraction vs. directness
   - Flexibility vs. simplicity

3. **Where would this refactoring approach apply in your real-world work?**
   - Identify a "God Object" in your codebase
   - Plan how you'd apply these patterns

4. **How did the tests help or hinder the refactoring process?**
   - When did tests catch breaking changes?
   - Were tests granular enough?

5. **What would you do differently in a production refactoring?**
   - Feature flags for gradual rollout?
   - Additional monitoring?
   - Performance testing?
