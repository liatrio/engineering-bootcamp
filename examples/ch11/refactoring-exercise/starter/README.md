# E-Commerce Order System - Starter Version

## ⚠️ Warning: This Code Contains Intentional Anti-Patterns

This application was deliberately designed with **poor structure and design flaws** for educational purposes. It demonstrates common anti-patterns found in real-world codebases that violate SOLID principles.

**Your mission:** Refactor this application to follow design patterns and SOLID principles while maintaining all existing behavior.

## Overview

This is a simple e-commerce order processing system built with TypeScript, Express, and SQLite. The system allows customers to:

- Browse products
- Create orders with multiple items
- Process payments (credit card, PayPal, Bitcoin)
- Calculate shipping costs (standard, express, overnight)
- Manage inventory automatically

## What's Wrong with This Code?

The `src/routes.ts` file is a **God Object** containing:
- **450+ lines** of code in a single file
- **7+ reasons to change** (violates Single Responsibility Principle)
- **if/else chains** for payment and shipping types (violates Open/Closed Principle)
- **Direct database access** mixed with business logic (violates Dependency Inversion Principle)
- **No abstraction layers** - HTTP, validation, business logic, and data access all mixed together
- **Impossible to extend** - Adding Apple Pay requires modifying existing code
- **Impossible to test** - Cannot test business logic without Express server and SQLite

**See `../analysis-guide.md` for detailed analysis with specific line numbers and SOLID violations.**

## Setup

### Prerequisites

- Node.js 18+ and npm
- SQLite3 (comes pre-installed on macOS and most Linux distributions)

### Installation

```bash
# Install dependencies
npm install

# Initialize the database
npm run db:reset

# This creates orders.db with tables and seed data
```

## Running the Application

### Start the development server

```bash
npm run dev
```

The server will start on `http://localhost:3000`.

### Build and run production version

```bash
npm run build
npm start
```

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch
```

**Important:** All tests should **pass** in this starter version. After refactoring, the exact same tests should still pass, demonstrating that you've preserved behavior.

## Testing the API

### Create an order

```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customer_id": 1,
    "items": [
      { "product_id": 1, "quantity": 2 },
      { "product_id": 2, "quantity": 1 }
    ],
    "payment_type": "credit_card",
    "shipping_method": "standard"
  }'
```

### Get order details

```bash
curl http://localhost:3000/api/orders/1
```

### List products

```bash
curl http://localhost:3000/api/products
```

## Payment Types and Fees

| Payment Type | Fee Structure |
|--------------|---------------|
| `credit_card` | 3% of subtotal |
| `paypal` | 3.5% of subtotal |
| `bitcoin` | $1.50 flat fee |

## Shipping Methods and Costs

| Shipping Method | Cost | Delivery Days |
|-----------------|------|---------------|
| `standard` | $5.99 | 7 days |
| `express` | $12.99 | 3 days |
| `overnight` | $24.99 | 1 day |

## Project Structure

```
starter/
├── src/
│   ├── index.ts       # Express server setup
│   ├── routes.ts      # 🔴 GOD OBJECT - ALL LOGIC HERE (450+ lines)
│   ├── database.ts    # SQLite connection
│   └── types.ts       # TypeScript interfaces
├── tests/
│   ├── setup.ts               # Test database setup
│   ├── order-creation.test.ts # Order workflow tests
│   ├── payment.test.ts        # Payment fee calculation tests
│   └── inventory.test.ts      # Stock management tests
├── schema.sql         # Database schema and seed data
├── package.json
├── tsconfig.json
└── jest.config.js
```

## Your Task

### Step 1: Read the Analysis Guide

Before starting, read `../analysis-guide.md` which provides:
- Specific SOLID principle violations with line numbers
- Code smells to identify
- Metrics to collect (lines of code, function complexity)
- Step-by-step refactoring roadmap

### Step 2: Follow the Refactoring Roadmap

The analysis guide provides a 5-phase approach:

1. **Define Interfaces** - Create Strategy and Repository interfaces
2. **Implement Strategies** - Refactor payment and shipping logic
3. **Implement Repositories** - Abstract data access layer
4. **Create Service Layer** - Separate business logic orchestration
5. **Simplify Routes** - Thin HTTP layer that delegates to services

### Step 3: Verify Your Refactoring

After each phase, run the tests to ensure behavior is preserved:

```bash
npm test
```

All tests must continue to pass without modification.

## Success Criteria

Your refactored solution should achieve:

- ✅ **All tests pass** without modification
- ✅ **routes.ts < 50 lines** (down from 450+)
- ✅ **Can add Apple Pay** by creating ONE new file (no modifications to existing code)
- ✅ **Can test OrderService** without Express server or database (using mocks)
- ✅ **No if/else chains** for payment or shipping types
- ✅ **Business logic separated** from HTTP, validation, and data access

## Metrics to Track

Collect these metrics before and after refactoring:

| Metric | Before (Starter) | After (Your Solution) |
|--------|------------------|----------------------|
| Lines in routes.ts | ~450 | < 50 |
| Total files | 4 | 15-20+ |
| Largest function | ~100 lines | < 30 lines |
| To add Apple Pay | Modify 3 files | Create 1 file |
| Test business logic | Requires Express + SQLite | Unit test with mocks |

## Anti-Patterns Demonstrated

This code intentionally includes:

1. **God Object** - `routes.ts` does everything
2. **Type Code** - if/else chains for payment/shipping types
3. **Direct Database Access** - No abstraction over SQLite
4. **Mixed Concerns** - HTTP + validation + business logic + data access
5. **Impossible to Extend** - Violates Open/Closed Principle
6. **Hard Dependencies** - Violates Dependency Inversion Principle
7. **Too Many Responsibilities** - Violates Single Responsibility Principle

## Learning Objectives

By refactoring this code, you will:

- ✓ Identify SOLID principle violations in real code
- ✓ Apply **Strategy Pattern** to eliminate if/else chains
- ✓ Apply **Repository Pattern** to abstract data access
- ✓ Apply **Service Layer** to organize business logic
- ✓ Use **Dependency Injection** to wire components
- ✓ Write **behavior-based tests** that survive refactoring
- ✓ Measure **code metrics** before and after

## Need Help?

1. Review the analysis guide: `../analysis-guide.md`
2. Review the main exercise documentation: `docs/11-application-development/11.2.5-refactoring-exercise.md`
3. Check the reference solution: `../solution/` (only after attempting yourself!)

## License

MIT
