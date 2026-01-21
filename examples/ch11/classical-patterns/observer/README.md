# Observer Pattern Example: Stock Price Monitoring

> **Pattern Category**: Behavioral  
> **SOLID Connection**: Dependency Inversion Principle, Interface Segregation  
> **Language**: TypeScript / Node.js 20+

## Overview

This example demonstrates the **Observer Pattern** through a stock price monitoring system. The pattern establishes a one-to-many dependency between objects so that when one object (subject) changes state, all its dependents (observers) are notified and updated automatically.

## The Observer Pattern

The Observer Pattern defines a subscription mechanism where multiple observers can listen to events from a subject. When the subject's state changes, it automatically notifies all registered observers.

### Key Components

1. **Observer Interface** (`Observer`): Defines the contract for receiving updates
2. **Concrete Observers** (`ChartDisplay`, `TableDisplay`, `AlertSystem`, `Logger`): Different visualizations/actions for the same data
3. **Subject** (`StockPrice`): Maintains state and notifies observers of changes

## Connection to SOLID Principles

This implementation demonstrates multiple SOLID principles:

### Dependency Inversion Principle

The `StockPrice` subject depends on the `Observer` interface (abstraction), not on concrete observer implementations:

```typescript
class StockPrice {
  private observers: Observer[] = [];  // ✓ Depends on interface
  
  attach(observer: Observer): void {
    this.observers.push(observer);  // Accepts any Observer implementation
  }
}
```

### Interface Segregation Principle

The `Observer` interface is small and focused - just one method:

```typescript
interface Observer {
  update(price: number): void;  // ✓ Small, focused interface
  getName(): string;
}
```

Observers only need to implement what they use. There's no "fat interface" forcing unnecessary methods.

### Open/Closed Principle

You can add new observers without modifying the `StockPrice` class:

```typescript
// Add a new observer type without touching StockPrice
class EmailNotifier implements Observer {
  update(price: number): void {
    // Send email notification
  }
  getName(): string { return "Email Notifier"; }
}

// Use it immediately
stock.attach(new EmailNotifier());  // ✓ No modification to StockPrice
```

## Setup

### Prerequisites

- Node.js 20 or higher
- npm (comes with Node.js)

### Installation

```bash
# Navigate to this directory
cd examples/ch11/classical-patterns/observer

# Install dependencies
npm install
```

## Running the Demo

```bash
# Build and run
npm start

# Or build and run separately
npm run build
node dist/main.js
```

Expected output shows:
- Attaching/detaching observers dynamically
- All observers being notified when price changes
- Different observers reacting differently to the same event
- Multiple independent subjects with separate observer lists

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run with coverage
npm run test:coverage
```

All tests should pass, demonstrating:
- Observers receive notifications
- Dynamic attach/detach works
- Subject doesn't depend on concrete observer types (DIP)
- Multiple observers react independently

## Project Structure

```
observer/
├── src/
│   ├── observer.ts     # Observer interface and concrete observers
│   ├── subject.ts      # StockPrice subject implementation
│   └── main.ts         # Executable demo
├── tests/
│   └── observer.test.ts # Unit tests
├── package.json        # Dependencies and scripts
├── tsconfig.json       # TypeScript configuration
├── jest.config.js      # Jest testing configuration
└── README.md           # This file
```

## When to Use Observer Pattern

✅ **Use Observer when**:
- Multiple objects need to react to state changes
- You want loose coupling between subject and observers
- The set of observers can change at runtime
- You need to broadcast changes to unknown number of objects

❌ **Don't use Observer when**:
- You have one observer that never changes (just call it directly)
- Observers need to know about each other (use Mediator instead)
- The notification order matters critically (Observer doesn't guarantee order)

## Real-World Applications

The Observer Pattern is everywhere in modern software:

1. **UI Frameworks**: React, Vue, Angular (component updates when state changes)
2. **Event Systems**: DOM events, Node.js EventEmitter
3. **Pub/Sub Messaging**: RabbitMQ, Kafka, Redis pub/sub
4. **Model-View Updates**: MVC/MVVM architectures
5. **Stock Tickers**: As demonstrated (real-time price updates)
6. **Monitoring Systems**: Metrics publishing to multiple dashboards
7. **Chat Applications**: Message broadcasting to multiple clients
8. **WebSockets**: Server pushing updates to multiple connected clients

## Key Takeaways

1. **Loose Coupling**: Subject doesn't know concrete observer types (DIP)
2. **Dynamic Relationships**: Attach/detach observers at runtime
3. **Broadcast Communication**: One change notifies many observers
4. **Different Reactions**: Each observer can respond differently to the same event
5. **ISP Compliance**: Observer interface is small and focused

## Push vs Pull

This implementation uses **push** model - the subject pushes data to observers:

```typescript
// Push model (our implementation)
observer.update(price);  // Subject pushes price to observer
```

Alternative **pull** model where observers pull data from subject:

```typescript
// Pull model (alternative)
interface Observer {
  update(subject: StockPrice): void;  // Observer pulls data from subject
}

class ChartDisplay implements Observer {
  update(subject: StockPrice): void {
    const price = subject.getPrice();  // Observer pulls what it needs
  }
}
```

Push is simpler but less flexible. Pull gives observers control over what data they retrieve.

## Learning Exercise

Try extending this example:

1. Add a new observer type (e.g., `EmailNotifier`, `SMSNotifier`, `DatabaseLogger`)
2. Implement the pull model instead of push
3. Add priority levels to observers (high-priority observers notified first)
4. Implement unsubscribe-on-condition (observer auto-detaches after certain events)
5. Add error handling (what if an observer's update() throws an error?)

Notice how you can do all of this **without modifying the core StockPrice class**. That's loose coupling in action!

## Common Pitfalls

1. **Memory Leaks**: Forgetting to detach observers can cause memory leaks. Always detach when done.
2. **Notification Storms**: If observers trigger subject changes, you can get infinite loops. Be careful!
3. **Update Order**: Don't rely on notification order - Observer Pattern doesn't guarantee it.
4. **Synchronous vs Asynchronous**: Our implementation is synchronous. For async, consider promises or event queues.

## Related Patterns

- **Mediator**: When observers need to communicate with each other
- **Pub/Sub**: More decoupled version where publishers and subscribers don't know each other
- **Chain of Responsibility**: When observers need to process events in sequence
- **Command**: Can encapsulate state change notifications as command objects

## Further Reading

- [SOLID Principles - Dependency Inversion Principle](../../../../docs/11-application-development/11.2.1-solid-principles.md#dependency-inversion-principle-dip)
- [Gang of Four Design Patterns](https://en.wikipedia.org/wiki/Design_Patterns)
- [Refactoring Guru - Observer Pattern](https://refactoring.guru/design-patterns/observer)
- [Observer Pattern in JavaScript/TypeScript](https://www.patterns.dev/posts/observer-pattern/)
