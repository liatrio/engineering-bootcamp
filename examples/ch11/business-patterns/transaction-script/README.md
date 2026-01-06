# Transaction Script Pattern Example

This example demonstrates the **Transaction Script** pattern for organizing business logic. Transaction Script organizes business logic as procedural functions where each function handles a complete transaction or use case.

## Pattern Overview

**Transaction Script** is a pattern where:
- Business logic is organized as procedural functions
- Each function handles one transaction from start to finish
- Minimal abstraction - straightforward and direct
- Best for simple domains with limited business rules

## When to Use

✅ **Good fit for:**
- Simple CRUD operations
- Straightforward business rules
- Small applications or MVPs
- Teams with limited OOP experience
- Rapid prototyping

❌ **Poor fit for:**
- Complex business rules with many interactions
- High code reuse requirements
- Long-term applications expecting significant growth

## Project Structure

```text
transaction-script/
├── src/
│   ├── order-processing.ts    # Transaction scripts for orders
│   └── main.ts                 # Demo application
├── tests/
│   └── order-processing.test.ts # Unit tests
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

### 1. Procedural Organization

Each business operation is a function:

```typescript
function validateOrder(orderData: OrderData): void { }
function calculateSubtotal(items: OrderItem[]): number { }
function calculateDiscount(subtotal: number, couponCode?: string): number { }
function processOrder(orderData: OrderData): ProcessedOrder { }
```

### 2. Transaction Flow

The `processOrder` function orchestrates the complete transaction:

1. Validate input data
2. Calculate subtotal
3. Apply discounts
4. Create order record
5. Save to database
6. Send confirmation

Each step is explicit and easy to follow.

### 3. Simple Data Structures

Uses simple interfaces for data:

```typescript
interface OrderData {
  customerId: number;
  customerName: string;
  items: OrderItem[];
  couponCode?: string;
}
```

No complex object hierarchies or encapsulation - just data and functions.

## Benefits of This Approach

1. **Simplicity**: Easy to understand and implement
2. **Directness**: Clear path from input to output
3. **Fast Development**: Quick to build simple features
4. **Low Overhead**: Minimal abstraction and indirection
5. **Easy Testing**: Functions are pure and testable

## Trade-offs

1. **Duplication**: Common logic may be repeated across functions
2. **Limited Reuse**: Hard to share behavior between transactions
3. **Scalability**: Becomes unwieldy as complexity grows
4. **Coupling**: Functions may become tightly coupled

## Example Usage

```typescript
import { processOrder } from './order-processing';

const orderData = {
  customerId: 101,
  customerName: 'Alice Johnson',
  items: [
    { productId: 1, productName: 'Laptop', price: 999.99, quantity: 1 },
    { productId: 2, productName: 'Mouse', price: 29.99, quantity: 2 }
  ],
  couponCode: 'SAVE10'
};

const processedOrder = processOrder(orderData);
console.log(`Order #${processedOrder.orderId} total: $${processedOrder.total}`);
```

## Running the Demo

The demo shows:
- Processing simple orders
- Applying discount coupons
- Viewing customer order history
- Calculating total revenue
- Error handling

```bash
npm start
```

Expected output:

```text
============================================================
Transaction Script Pattern - Order Processing Demo
============================================================

🔄 Processing order for Alice Johnson...
   Subtotal: $1059.97
   Discount (SAVE10): -$106.00
✅ Order #1 completed

...
```

## Running Tests

```bash
npm test
```

Tests cover:
- Order validation
- Subtotal calculation
- Discount calculation
- Order processing
- Customer order retrieval

## Comparison with Domain Model

| Aspect | Transaction Script | Domain Model |
| ------ | ------------------ | ------------ |
| Complexity | Low | Higher |
| Code Organization | Procedural functions | Object-oriented classes |
| Reusability | Limited | High |
| Learning Curve | Easy | Steeper |
| Best For | Simple domains | Complex domains |

## Next Steps

To see how this same problem can be solved with object-oriented Domain Model pattern, check out:
- [Domain Model Example](../domain-model/)
- [Comparison Example](../comparison/)

## Further Reading

- [Transaction Script Pattern](https://martinfowler.com/eaaCatalog/transactionScript.html) - Martin Fowler
- [Patterns of Enterprise Application Architecture](https://martinfowler.com/books/eaa.html)
