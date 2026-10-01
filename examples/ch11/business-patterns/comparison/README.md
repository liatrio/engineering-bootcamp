# Pattern Comparison: Transaction Script vs Domain Model

This example demonstrates **the same business problem solved with both Transaction Script and Domain Model** approaches, allowing you to directly compare their trade-offs.

## The Problem

**Business Rules for Order Discount Calculation:**

1. **Volume Discount** (based on order total):
   - 5% for orders over $100
   - 10% for orders over $200
   - 15% for orders over $500

2. **Customer Type Discount**:
   - VIP customers get 10% discount
   - Regular customers get no additional discount

3. **Bulk Item Discount**:
   - 5% discount for orders with 10+ items

4. **Coupon Discounts**:
   - SAVE15: 15% off
   - SAVE25: 25% off
   - FIRSTORDER: 20% off

5. **Maximum Discount Cap**: Total discount cannot exceed 40% of order total

## Project Structure

```text
comparison/
├── src/
│   ├── transaction-script/
│   │   └── discount-calculator.ts    # Procedural approach
│   ├── domain-model/
│   │   └── discount-calculator.ts    # OOP approach with Strategy pattern
│   └── main.ts                        # Side-by-side comparison demo
├── tests/
│   └── comparison.test.ts             # Verifies both produce same results
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

# Run the comparison demo
npm start

# Run tests
npm test
```

## Approach 1: Transaction Script

**Characteristics:**
- Business logic organized as procedural functions
- Each function handles one aspect of discount calculation
- Simple and direct

**Code Example:**

```typescript
function calculateOrderDiscount(data: OrderDiscountData): number {
  let totalDiscount = 0;
  
  totalDiscount += calculateVolumeDiscount(data.orderTotal);
  totalDiscount += calculateCustomerDiscount(data.orderTotal, data.customerType);
  totalDiscount += calculateBulkDiscount(data.orderTotal, data.itemCount);
  totalDiscount += applyCouponDiscount(data.orderTotal, data.couponCode);
  
  // Apply 40% cap
  const maxDiscount = data.orderTotal * 0.40;
  return Math.min(totalDiscount, maxDiscount);
}
```

**Pros:**
- ✅ Simple and straightforward
- ✅ Easy to understand
- ✅ Fast to implement
- ✅ Low overhead

**Cons:**
- ❌ Discount logic scattered across functions
- ❌ Hard to add new discount types without modifying existing code
- ❌ No built-in breakdown of applied discounts
- ❌ Difficult to reuse individual discount calculations

## Approach 2: Domain Model

**Characteristics:**
- Business logic encapsulated in objects
- Uses Strategy pattern for discount types
- Rich domain model with behavior

**Code Example:**

```typescript
// Each discount type is a strategy
class VolumeDiscount implements DiscountStrategy {
  calculate(order: Order): number {
    const total = order.getTotal();
    if (total > 500) return total * 0.15;
    if (total > 200) return total * 0.10;
    if (total > 100) return total * 0.05;
    return 0;
  }
}

// Order manages its discount policy
class Order {
  calculateDiscount(): number {
    return this.discountPolicy.calculateTotalDiscount(this);
  }
  
  getDiscountBreakdown(): Array<{description: string; amount: number}> {
    return this.discountPolicy.getAppliedDiscounts(this);
  }
}
```

**Pros:**
- ✅ Each discount type is isolated and testable
- ✅ Easy to add new discount strategies (Open/Closed Principle)
- ✅ Built-in discount breakdown
- ✅ Business rules are explicit and named
- ✅ Highly maintainable and extensible

**Cons:**
- ❌ More classes and code to write
- ❌ Requires OOP understanding
- ❌ Higher initial complexity
- ❌ May be overkill for simple cases

## Running the Demo

```bash
npm start
```

The demo shows both approaches side-by-side for multiple test cases:

1. **Regular customer, small order** - Minimal discounts
2. **VIP customer, medium order** - Volume + VIP discounts
3. **Large order with coupon** - Multiple discounts, testing cap
4. **VIP with maximum discounts** - Hitting the 40% cap

Example output:

```text
======================================================================
Transaction Script vs Domain Model - Discount Calculation
======================================================================

📦 Test Case 2: VIP customer, medium order ($250, 5 items)
----------------------------------------------------------------------

Transaction Script:
  Volume Discount: $25.00
  VIP Discount: $25.00
  Total Discount: $50.00
  Final Price: $200.00

Domain Model:
  Total Discount: $50.00
  Final Price: $200.00
  Breakdown:
    - Volume Discount (5-15% based on order total): $25.00
    - VIP Customer Discount (10%): $25.00
```

## Running Tests

```bash
npm test
```

Tests verify that:
- Both approaches produce identical results for all test cases
- Discount caps are applied correctly
- Individual discount calculations work as expected
- Domain Model provides extensibility for new strategies

## Key Comparisons

### Code Organization

| Aspect | Transaction Script | Domain Model |
| ------ | ------------------ | ------------ |
| **Structure** | Functions | Classes + Interfaces |
| **Coupling** | Functions call each other | Objects collaborate |
| **Extensibility** | Modify functions | Add new strategies |

### Adding a New Discount Type

**Transaction Script:** Would require:
1. Adding a new function
2. Modifying `calculateOrderDiscount` to call it
3. Risk of breaking existing code

**Domain Model:** Would require:
1. Creating a new class implementing `DiscountStrategy`
2. Adding it to the discount policy
3. No changes to existing code (Open/Closed Principle)

### Testing

**Transaction Script:**
- Test each function individually
- Test the orchestration function
- 5-6 test suites

**Domain Model:**
- Test each strategy independently
- Test the policy and order classes
- Test object collaboration
- More granular, isolated tests

### Debugging

**Transaction Script:**
- Follow function call chain
- Add logging to see discount calculations
- Simple call stack

**Domain Model:**
- Inspect discount breakdown
- Each strategy can be debugged separately
- Use polymorphism debugger features

## Decision Guide

**Choose Transaction Script when:**
- Business rules are simple and stable
- Team has limited OOP experience
- Rapid development is the priority
- The domain won't grow in complexity

**Choose Domain Model when:**
- Business rules are complex or will grow
- Need to support multiple discount types that change independently
- Team has OOP experience
- Long-term maintainability is important
- You need to explain applied discounts to users

## Learning Exercise

Try extending both implementations with a new discount type:

**New Requirement:** Add "First-Time Customer" discount (8% off for customers who have never ordered before)

1. Implement it in Transaction Script approach
2. Implement it in Domain Model approach
3. Compare the changes required
4. Which approach made it easier?

## Further Reading

- [Transaction Script Pattern](https://martinfowler.com/eaaCatalog/transactionScript.html)
- [Domain Model Pattern](https://martinfowler.com/eaaCatalog/domainModel.html)
- [Strategy Pattern](https://refactoring.guru/design-patterns/strategy)
- [Open/Closed Principle](https://en.wikipedia.org/wiki/Open%E2%80%93closed_principle)
