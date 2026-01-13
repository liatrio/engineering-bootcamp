# E-Commerce Order System - Reference Solution

## Overview

This is the **refactored solution** for the e-commerce order refactoring exercise. It demonstrates proper application of:

- **Strategy Pattern** for payment and shipping calculations
- **Repository Pattern** for data access abstraction
- **Service Layer** for business logic orchestration
- **Factory Pattern** for strategy creation
- **Dependency Injection** for loose coupling
- **SOLID Principles** throughout

## What Changed from Starter?

### Architecture Transformation

**Before (Starter):**
```
Client → routes.ts (450 lines, God Object) → SQLite
         Everything happens in one file
```

**After (Solution):**
```
Client → HTTP Layer (routes) → Service Layer → Repository Layer → SQLite
                      ↓
                  Strategies (Payment, Shipping)
```

### Key Improvements

| Aspect | Before | After |
|--------|--------|-------|
| **Lines in routes** | ~450 lines | ~120 lines (but split across multiple focused files) |
| **Main HTTP handler** | 285 lines | 15 lines (delegates to service) |
| **Total files** | 4 files | 20+ files |
| **Largest function** | ~285 lines | < 50 lines |
| **To add Apple Pay** | Modify 3 files | Create 1 file |
| **Unit testing** | Requires Express + DB | Can mock repositories |

## Pattern Applications

### 1. Strategy Pattern (Payment & Shipping)

**Problem in Starter:**
```typescript
// Violates Open/Closed Principle
if (orderRequest.payment_type === 'credit_card') {
  paymentFee = subtotal * 0.03;
} else if (orderRequest.payment_type === 'paypal') {
  paymentFee = subtotal * 0.035;
} else if (orderRequest.payment_type === 'bitcoin') {
  paymentFee = 1.50;
}
```

**Solution:**
```typescript
// Open for extension, closed for modification
interface IPaymentStrategy {
  calculateFee(subtotal: number): number;
}

class CreditCardPayment implements IPaymentStrategy {
  calculateFee(subtotal: number): number {
    return subtotal * 0.03;
  }
}

// Usage
const strategy = paymentFactory.getStrategy(payment_type);
const fee = strategy.calculateFee(subtotal);
```

**Benefits:**
- ✅ Can add new payment types without modifying existing code
- ✅ Each strategy is independently testable
- ✅ Strategies are self-contained and reusable
- ✅ Eliminates if/else chains

**Extension Example: Adding Apple Pay**

Create one new file (`src/strategies/payment/ApplePayPayment.ts`):
```typescript
export class ApplePayPayment implements IPaymentStrategy {
  calculateFee(subtotal: number): number {
    return subtotal * 0.04; // 4% fee
  }
  getType(): string {
    return 'apple_pay';
  }
}
```

Register in factory (one line):
```typescript
paymentFactory.registerStrategy('apple_pay', () => new ApplePayPayment());
```

**No modifications to existing files required!** This demonstrates the Open/Closed Principle.

### 2. Repository Pattern (Data Access)

**Problem in Starter:**
```typescript
// Direct database access in business logic
const product = await dbGet<Product>(
  'SELECT * FROM products WHERE id = ?',
  [item.product_id]
);

await dbRun(
  'UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?',
  [item.quantity, item.product_id]
);
```

**Solution:**
```typescript
// Interface-based abstraction
interface IProductRepository {
  findById(id: number): Promise<Product | null>;
  updateStock(id: number, quantityChange: number): Promise<void>;
}

class ProductRepository implements IProductRepository {
  async findById(id: number): Promise<Product | null> {
    return await dbGet<Product>('SELECT * FROM products WHERE id = ?', [id]);
  }
  // ...
}

// Usage
const product = await productRepository.findById(productId);
await productRepository.updateStock(productId, -quantity);
```

**Benefits:**
- ✅ Business logic doesn't know about SQLite
- ✅ Can swap to PostgreSQL by creating PostgresProductRepository
- ✅ Can create MockProductRepository for testing
- ✅ Follows Dependency Inversion Principle

**Swap Database Example:**

Create `PostgresProductRepository.ts` implementing `IProductRepository`:
```typescript
class PostgresProductRepository implements IProductRepository {
  constructor(private pgClient: PgClient) {}
  
  async findById(id: number): Promise<Product | null> {
    // PostgreSQL implementation
  }
}
```

Update dependency injection:
```typescript
// Change one line in index.ts
const productRepository = new PostgresProductRepository(pgClient);
// Everything else works unchanged!
```

### 3. Service Layer (Business Logic)

**Problem in Starter:**
```typescript
// Business logic mixed with HTTP handling
router.post('/orders', async (req: Request, res: Response) => {
  // Validation
  if (!orderRequest.customer_id) { ... }
  
  // Database queries
  const customer = await dbGet(...);
  
  // Business calculations
  const paymentFee = subtotal * 0.03;
  
  // More database queries
  await dbRun(...);
  
  // Response formatting
  return res.status(201).json(...);
});
```

**Solution:**
```typescript
// Thin HTTP layer
router.post('/orders', async (req: Request, res: Response) => {
  try {
    const result = await orderService.createOrder(req.body);
    return res.status(201).json(result);
  } catch (error) {
    // Error handling
  }
});

// Business logic in service
class OrderService {
  async createOrder(request: CreateOrderRequest): Promise<CreateOrderResponse> {
    this.validationService.validateOrderRequest(request);
    await this.inventoryService.checkAvailability(request.items);
    const paymentFee = paymentStrategy.calculateFee(subtotal);
    // ... orchestrate all business operations
  }
}
```

**Benefits:**
- ✅ Business logic separated from HTTP concerns
- ✅ Can test OrderService without Express server
- ✅ Can reuse OrderService in CLI, scheduled jobs, message queues
- ✅ Single Responsibility Principle: routes handle HTTP, services handle logic

**Testability Example:**
```typescript
// Unit test without HTTP or database
const mockOrderRepo = new MockOrderRepository();
const mockProductRepo = new MockProductRepository();
const service = new OrderService(mockOrderRepo, mockProductRepo, ...);

const result = await service.createOrder(request);
expect(result.total).toBe(115.97);
```

### 4. Dependency Injection (Wiring)

**Problem in Starter:**
```typescript
// Hard-coded dependencies
import { db } from './database';

// Inside function
const product = await dbGet('SELECT ...'); // Direct dependency
```

**Solution:**
```typescript
// Dependencies injected via constructor
class OrderService {
  constructor(
    private orderRepository: IOrderRepository,
    private productRepository: IProductRepository,
    private paymentFactory: PaymentStrategyFactory,
    // ...
  ) {}
}

// Wiring in index.ts
const orderRepository = new OrderRepository();
const productRepository = new ProductRepository();
const paymentFactory = new PaymentStrategyFactory();
const orderService = new OrderService(
  orderRepository,
  productRepository,
  paymentFactory,
  // ...
);
```

**Benefits:**
- ✅ Dependencies are explicit and visible
- ✅ Easy to swap implementations
- ✅ Easy to mock for testing
- ✅ Follows Dependency Inversion Principle

## Project Structure

```
solution/
├── src/
│   ├── domain/
│   │   └── types.ts                    # Domain models and interfaces
│   ├── strategies/
│   │   ├── payment/
│   │   │   ├── IPaymentStrategy.ts     # Payment strategy interface
│   │   │   ├── CreditCardPayment.ts    # 3% fee implementation
│   │   │   ├── PayPalPayment.ts        # 3.5% fee implementation
│   │   │   └── BitcoinPayment.ts       # $1.50 flat fee implementation
│   │   └── shipping/
│   │       ├── IShippingStrategy.ts    # Shipping strategy interface
│   │       ├── StandardShipping.ts     # $5.99, 7 days
│   │       ├── ExpressShipping.ts      # $12.99, 3 days
│   │       └── OvernightShipping.ts    # $24.99, 1 day
│   ├── repositories/
│   │   ├── IProductRepository.ts       # Product data access interface
│   │   ├── ProductRepository.ts        # SQLite product implementation
│   │   ├── IOrderRepository.ts         # Order data access interface
│   │   └── OrderRepository.ts          # SQLite order implementation
│   ├── services/
│   │   ├── ValidationService.ts        # Input validation logic
│   │   ├── InventoryService.ts         # Stock management logic
│   │   └── OrderService.ts             # Order creation orchestration
│   ├── factories/
│   │   ├── PaymentStrategyFactory.ts   # Creates payment strategies
│   │   └── ShippingStrategyFactory.ts  # Creates shipping strategies
│   ├── routes/
│   │   └── orderRoutes.ts              # Thin HTTP layer (120 lines)
│   ├── database.ts                     # SQLite connection and helpers
│   └── index.ts                        # Dependency injection wiring
├── tests/
│   ├── setup.ts                        # Test database setup
│   ├── order-creation.test.ts          # SAME as starter (behavior preserved!)
│   ├── payment.test.ts                 # SAME as starter
│   └── inventory.test.ts               # SAME as starter
├── schema.sql                          # Database schema and seed data
├── package.json
├── tsconfig.json
└── jest.config.js
```

## SOLID Principles Applied

### ✅ Single Responsibility Principle (SRP)

Each class has exactly one reason to change:

- `ValidationService` - changes only when validation rules change
- `OrderService` - changes only when order workflow changes
- `ProductRepository` - changes only when product data access changes
- `CreditCardPayment` - changes only when credit card fee structure changes

**Before:** routes.ts had 7+ reasons to change
**After:** Each class has 1 reason to change

### ✅ Open/Closed Principle (OCP)

System is open for extension, closed for modification:

- Add new payment type: Create 1 file, register in factory
- Add new shipping method: Create 1 file, register in factory
- Add new validation rule: Modify only ValidationService

**Before:** Adding Apple Pay requires modifying 3 files
**After:** Adding Apple Pay requires creating 1 file

### ✅ Liskov Substitution Principle (LSP)

All implementations are substitutable for their interfaces:

- Any `IPaymentStrategy` works wherever payment calculation is needed
- Any `IProductRepository` works wherever product data access is needed
- Swap implementations without breaking behavior

### ✅ Interface Segregation Principle (ISP)

Interfaces are focused and minimal:

- `IPaymentStrategy` has 2 methods (calculateFee, getType)
- `IShippingStrategy` has 3 methods (calculateCost, getDeliveryDays, getMethod)
- `IProductRepository` has only product-related methods
- No "fat interfaces" with unused methods

### ✅ Dependency Inversion Principle (DIP)

High-level modules depend on abstractions, not concrete implementations:

- `OrderService` depends on `IOrderRepository`, not `OrderRepository`
- `InventoryService` depends on `IProductRepository`, not `ProductRepository`
- Can swap SQLite for PostgreSQL, MongoDB, or mocks without changing services

## Setup & Running

### Installation
```bash
npm install
npm run db:reset
```

### Run Application
```bash
npm run dev
```

### Run Tests
```bash
npm test
```

**All 37 tests pass - same tests as starter!** This proves behavior preservation during refactoring.

## Success Metrics

| Criterion | Status |
|-----------|--------|
| All tests pass without modification | ✅ 37/37 passing |
| routes.ts < 50 lines (main handler) | ✅ 15 lines |
| Can add Apple Pay with 1 file | ✅ Demonstrated |
| Can test without database | ✅ Mockable repositories |
| No if/else chains | ✅ Strategy Pattern |
| SOLID compliant | ✅ All principles followed |

## Comparison with Starter

### Code Organization

**Starter:** Monolithic file
- 1 file with 450 lines
- All concerns mixed together
- Difficult to navigate and understand

**Solution:** Layered architecture
- 20+ focused files
- Each file < 100 lines
- Clear separation of concerns
- Easy to locate specific functionality

### Extensibility

**Starter:** Closed for extension
- Must modify existing code to add features
- Risk of breaking existing functionality
- Changes ripple across entire file

**Solution:** Open for extension
- Add new strategies without modification
- Extend via interfaces
- Changes are isolated

### Testability

**Starter:** Integration tests only
- Requires Express server
- Requires SQLite database
- Slow test execution
- Difficult to test edge cases

**Solution:** Unit testable
- Can mock dependencies
- Test business logic independently
- Fast test execution
- Easy to test edge cases

### Maintainability

**Starter:** High coupling
- Changes affect multiple concerns
- Difficult to understand impact
- Hard to refactor safely

**Solution:** Low coupling
- Changes isolated to specific classes
- Easy to understand impact
- Safe to refactor

## Learning Outcomes

By studying this solution, you should understand:

1. **How Strategy Pattern eliminates if/else chains** and enables OCP
2. **How Repository Pattern abstracts data access** and enables DIP
3. **How Service Layer separates business logic** from infrastructure concerns
4. **How Dependency Injection** makes code flexible and testable
5. **How SOLID principles work together** to create maintainable software
6. **Why behavior-preserving tests** are essential for safe refactoring

## Next Steps

### Try the Extension Challenge

Add Apple Pay support:
1. Create `src/strategies/payment/ApplePayPayment.ts`
2. Register in `PaymentStrategyFactory`
3. Run tests - they should all pass without modification!

### Try the Database Swap Challenge

Create a PostgreSQL implementation:
1. Create `PostgresProductRepository` implementing `IProductRepository`
2. Create `PostgresOrderRepository` implementing `IOrderRepository`
3. Update dependency injection in `index.ts`
4. Everything else works unchanged!

### Try the Unit Testing Challenge

Write unit tests for `OrderService`:
1. Create mock implementations of repositories
2. Test business logic without database
3. Verify calculations, error handling, edge cases

## License

MIT
