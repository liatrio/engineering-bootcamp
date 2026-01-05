# Domain Model Pattern Example

This example demonstrates the **Domain Model** pattern for organizing business logic. Domain Model encapsulates business rules and behavior within rich domain objects that represent concepts from your business domain.

## Pattern Overview

**Domain Model** is a pattern where:
- Business logic is encapsulated in domain objects
- Objects contain both data and behavior (not just data holders)
- Rich object collaboration to fulfill business rules
- Follows object-oriented design principles

## When to Use

✅ **Good fit for:**
- Complex business rules and workflows
- Applications expected to grow in complexity
- Teams with strong OOP experience
- Long-term maintainability is a priority
- Need for extensive code reuse

❌ **Poor fit for:**
- Simple CRUD applications
- Teams lacking OOP expertise
- Rapid prototyping with minimal business logic
- Short-term or throwaway projects

## Project Structure

```
domain-model/
├── src/
│   ├── customer.ts    # Customer domain object
│   ├── product.ts     # Product domain object
│   ├── coupon.ts      # Coupon domain object
│   ├── order.ts       # Order domain object (aggregate root)
│   └── main.ts        # Demo application
├── tests/
│   └── order.test.ts  # Comprehensive unit tests
├── package.json
├── tsconfig.json
└── README.md
```

## Setup and Installation

```bash
# Install dependencies
npm install

# Build the TypeScript code
npm run build

# Run the demo
npm start

# Run tests
npm test
```

## Key Concepts Demonstrated

### 1. Rich Domain Objects

Objects encapsulate both data and behavior:

```typescript
class Order {
  addItem(product: Product, quantity: number): void { }
  applyCoupon(coupon: Coupon): void { }
  calculateTotal(): number { }
  process(): void { }
}
```

Business logic lives with the data it operates on, not in separate functions.

### 2. Encapsulation

Data is private, accessed only through methods:

```typescript
class Customer {
  constructor(
    private readonly id: number,
    private readonly name: string,
    private readonly vipStatus: boolean
  ) {}
  
  isVIP(): boolean {
    return this.vipStatus;
  }
  
  getDiscountRate(): number {
    return this.vipStatus ? 0.05 : 0;
  }
}
```

### 3. Object Collaboration

Objects work together to implement business rules:

```typescript
class Order {
  calculateTotalDiscount(): number {
    const subtotal = this.calculateSubtotal();
    let discount = 0;
    
    // Coupon provides its own discount calculation
    if (this.coupon) {
      discount += this.coupon.calculateDiscount(subtotal);
    }
    
    // Customer provides their discount rate
    discount += subtotal * this.customer.getDiscountRate();
    
    return discount;
  }
}
```

### 4. Validation and Business Rules

Domain objects enforce their own invariants:

```typescript
class OrderItem {
  constructor(product: Product, quantity: number) {
    if (quantity <= 0) {
      throw new Error('Quantity must be greater than 0');
    }
    this.product = product;
    this.quantity = quantity;
  }
}
```

### 5. State Management

Objects manage their own state transitions:

```typescript
enum OrderStatus {
  PENDING, PROCESSING, COMPLETED, CANCELLED
}

class Order {
  process(): void {
    if (this.status !== OrderStatus.PENDING) {
      throw new Error('Order has already been processed');
    }
    this.status = OrderStatus.PROCESSING;
  }
}
```

## Benefits of This Approach

1. **Encapsulation**: Business rules live with the data they operate on
2. **Reusability**: Behavior can be inherited and composed
3. **Maintainability**: Changes are localized to specific objects
4. **Expressiveness**: Code reads like the business domain
5. **Testability**: Each object can be tested in isolation

## Trade-offs

1. **Complexity**: More objects and relationships to manage
2. **Learning Curve**: Requires solid OOP understanding
3. **Overhead**: May be excessive for simple domains
4. **Performance**: More object creation and method calls

## Example Usage

```typescript
import { Customer, Product, Coupon, Order } from './domain-model';

// Create domain objects
const customer = new Customer(1, 'Alice', 'alice@example.com', true);
const laptop = new Product(101, 'Laptop', 999.99, 'Electronics');
const coupon = new Coupon('SAVE20', 20, new Date('2026-12-31'));

// Create and process order
const order = new Order(customer);
order.addItem(laptop, 1);
order.applyCoupon(coupon);
order.process();
order.complete();

console.log(order.getSummary());
```

## Running the Demo

The demo shows:
- Creating domain objects with business behavior
- Processing orders with VIP discounts
- Applying coupons with validation
- Stacking multiple discounts
- Order modification and state management
- Error handling and business rule enforcement

```bash
npm start
```

Expected output:
```
============================================================
Domain Model Pattern - Order Processing Demo
============================================================

--- Example 1: VIP Customer Order ---

📦 Processing Order #1
   Customer: Alice Johnson
   Items: 2
   Subtotal: $1059.97
   Discount: -$53.00
   Total: $1006.97
✅ Order #1 completed
...
```

## Running Tests

```bash
npm test
```

Tests cover:
- Customer VIP discount behavior
- Product validation
- Coupon validation and discount calculation
- Order item totals
- Order discount stacking
- Order state transitions
- Business rule enforcement
- Encapsulation protection

## Comparison with Transaction Script

| Aspect | Domain Model | Transaction Script |
|--------|--------------|-------------------|
| Organization | Objects with behavior | Procedural functions |
| Complexity | Higher | Lower |
| Reusability | Excellent | Limited |
| Testability | Each object testable | Functions testable |
| Maintainability | High (for complex domains) | High (for simple domains) |
| Learning Curve | Steeper | Easier |

## Design Patterns Used

This example demonstrates several OOP design patterns:

1. **Encapsulation** - Data hiding and public interfaces
2. **Information Expert** - Objects responsible for data they own
3. **Value Object** - Immutable objects (Product, Customer)
4. **State Pattern** - Order status management
5. **Strategy Pattern** - Discount calculation strategies

## Next Steps

To see how this compares with the procedural Transaction Script approach, check out:
- [Transaction Script Example](../transaction-script/)
- [Comparison Example](../comparison/)
- [Service Layer Example](../service-layer/)

## Further Reading

- [Domain Model Pattern](https://martinfowler.com/eaaCatalog/domainModel.html) - Martin Fowler
- [Domain-Driven Design](https://www.domainlanguage.com/ddd/) - Eric Evans
- [Patterns of Enterprise Application Architecture](https://martinfowler.com/books/eaa.html)
