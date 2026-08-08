# Service Layer Pattern Example

This example demonstrates the **Service Layer** pattern for organizing application logic. Service Layer defines the application's boundary and provides a clear API for operations while coordinating domain objects and managing transaction boundaries.

## Pattern Overview

**Service Layer** is a pattern where:
- Application logic is organized in service classes
- Services orchestrate domain objects and repositories
- Transaction boundaries are clearly defined
- Provides a facade for the presentation layer (API, UI)
- Coordinates cross-cutting concerns (email, logging, etc.)

## When to Use

✅ **Good fit for:**
- Applications with multiple client types (web, mobile, API)
- Need for explicit transaction management
- Coordinating multiple domain objects
- Separating application logic from domain logic
- Testing business operations without UI/API layer

❌ **Poor fit for:**
- Extremely simple CRUD applications
- Single-page applications with minimal logic
- When overhead of additional layer isn't justified

## Project Structure

```text
service-layer/
├── src/
│   ├── domain/
│   │   └── entities.ts           # Domain objects
│   ├── repositories/
│   │   └── repositories.ts       # Data access layer
│   ├── services/
│   │   └── order-service.ts      # Service layer (orchestration)
│   └── main.ts                    # Demo application
├── tests/
│   └── order-service.test.ts     # Service tests
├── package.json
├── tsconfig.json
└── README.md
```

## Architecture Layers

```text
┌─────────────────────────────────────┐
│     Presentation Layer (API/UI)     │
├─────────────────────────────────────┤
│       Service Layer ← YOU ARE HERE   │  ← Orchestration & Transactions
├─────────────────────────────────────┤
│        Domain Layer                 │  ← Business Logic
├─────────────────────────────────────┤
│     Data Access Layer (Repos)       │  ← Persistence
└─────────────────────────────────────┘
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

### 1. Service as Application Boundary

The `OrderService` defines what operations the application can perform:

```typescript
class OrderService {
  async createOrder(request: CreateOrderRequest): Promise<OrderDTO>
  async getOrder(orderId: number): Promise<OrderDTO | null>
  async getCustomerOrders(customerId: number): Promise<OrderDTO[]>
}
```

External clients (API controllers, CLI, etc.) only interact with the service, not directly with domain objects or repositories.

### 2. Transaction Boundaries

Services define where transactions start and end:

```typescript
async createOrder(request: CreateOrderRequest): Promise<OrderDTO> {
  // Transaction starts
  try {
    // 1. Validate customer
    // 2. Validate products  
    // 3. Check inventory
    // 4. Create order
    // 5. Reserve stock
    // 6. Save order
    // 7. Send email
    return dto;
  } catch (error) {
    // Rollback transaction
    throw error;
  }
  // Transaction ends
}
```

### 3. Coordination of Domain Objects

Services orchestrate multiple domain objects and repositories:

```typescript
async createOrder(request: CreateOrderRequest): Promise<OrderDTO> {
  const customer = await this.customerRepository.findById(...);
  const product = await this.productRepository.findById(...);
  const order = new Order(...);
  
  await this.inventoryService.reserveStock(...);
  await this.orderRepository.save(order);
  await this.emailService.sendConfirmation(...);
  
  return dto;
}
```

### 4. Data Transfer Objects (DTOs)

Services return DTOs, not domain objects:

```typescript
interface OrderDTO {
  orderId: number;
  customerName: string;
  items: Array<{...}>;
  total: number;
}
```

**Why DTOs?**
- Protect domain object encapsulation
- Control what data crosses boundaries
- Decouple presentation from domain model
- Enable API versioning

### 5. Dependency Injection

Services depend on abstractions (interfaces), not concrete implementations:

```typescript
constructor(
  private orderRepository: OrderRepository,      // Interface
  private productRepository: ProductRepository,  // Interface
  private customerRepository: CustomerRepository,// Interface
  private emailService: EmailService,            // Interface
  private inventoryService: InventoryService     // Interface
) {}
```

This makes services highly testable with mock implementations.

## Benefits of This Approach

1. **Clear Application Boundary**: Services define what the app can do
2. **Transaction Management**: Explicit transaction boundaries
3. **Coordination**: Orchestrates multiple domain objects
4. **Testability**: Easy to test with mock dependencies
5. **Reusability**: Multiple clients can use the same services
6. **Separation of Concerns**: Application logic separated from domain logic

## Trade-offs

1. **Additional Layer**: More code to write and maintain
2. **Indirection**: One more hop between presentation and domain
3. **Can Become Bloated**: Risk of "god service" anti-pattern
4. **Learning Curve**: Need to understand layer responsibilities

## Running the Demo

```bash
npm start
```

The demo shows:
- Creating orders with validation
- Inventory reservation
- Email notifications
- Order retrieval
- Customer order history
- Error handling and transaction rollback

Expected output:

```text
======================================================================
Service Layer Pattern - Order Processing Demo
======================================================================

--- Example 1: Create Simple Order ---

📦 Creating order for customer 101...
   ✓ Reserved 1x Laptop
   ✓ Reserved 2x Mouse
   ✓ Order #1 saved
   📧 Email sent to alice@example.com: Order #1 confirmed ($1059.97)
   ✓ Order #1 completed - Total: $1059.97

✅ Order created: {
  orderId: 1,
  customer: 'Alice Johnson',
  total: '$1059.97',
  itemCount: 2
}
...
```

## Running Tests

```bash
npm test
```

Tests demonstrate:
- Service creates orders correctly
- Validation works (customer, product, inventory)
- Inventory is reserved
- Orders can be retrieved
- Transaction boundaries are respected
- Error handling works properly

## Service Layer vs Other Patterns

| Aspect | Service Layer | Transaction Script | Domain Model |
| ------ | ------------- | ------------------ | ------------ |
| **Purpose** | Orchestration | Business logic | Business logic |
| **Scope** | Application operations | Single transactions | Domain concepts |
| **Coordinates** | Multiple objects | Procedural flow | Rich objects |
| **Transaction** | Explicit boundaries | Implicit | Not concerned |

## Common Pitfalls

### ❌ Anemic Services

```typescript
// BAD: Service with no logic, just pass-through
class OrderService {
  async createOrder(order: Order) {
    return this.orderRepository.save(order);
  }
}
```

### ✅ Rich Services

```typescript
// GOOD: Service coordinates and enforces rules
class OrderService {
  async createOrder(request: CreateOrderRequest) {
    // Validation, coordination, transaction management
  }
}
```

### ❌ God Services

```typescript
// BAD: One service doing everything
class ApplicationService {
  createOrder() { }
  createCustomer() { }
  processPayment() { }
  generateReport() { }
  sendEmail() { }
  // ...100 more methods
}
```

### ✅ Focused Services

```typescript
// GOOD: Separate services by domain
class OrderService { }
class CustomerService { }
class PaymentService { }
class ReportService { }
```

## Design Patterns Used

This example demonstrates:

1. **Service Layer** - Main pattern
2. **Repository** - Data access abstraction
3. **DTO** - Data transfer across boundaries
4. **Dependency Injection** - Loose coupling
5. **Facade** - Simplified interface to complex subsystems

## Next Steps

- See how this builds on [Domain Model](../domain-model/)
- Compare with [Transaction Script](../transaction-script/)
- Review the [Comparison](../comparison/) to understand trade-offs

## Further Reading

- [Service Layer Pattern](https://martinfowler.com/eaaCatalog/serviceLayer.html) - Martin Fowler
- [Domain-Driven Design](https://www.domainlanguage.com/ddd/) - Service vs Domain
- [Patterns of Enterprise Application Architecture](https://martinfowler.com/books/eaa.html)
