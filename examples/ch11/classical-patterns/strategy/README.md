# Strategy Pattern Example: Payment Processing

> **Pattern Category**: Behavioral  
> **SOLID Connection**: Open/Closed Principle  
> **Language**: Python 3.11+

## Overview

This example demonstrates the **Strategy Pattern** through a payment processing system. The pattern allows swapping payment methods (credit card, PayPal, Bitcoin, bank transfer) at runtime without modifying the core `OrderProcessor` class.

## The Strategy Pattern

The Strategy Pattern defines a family of algorithms (payment methods), encapsulates each one behind a common interface (`PaymentStrategy`), and makes them interchangeable. The algorithm varies independently from clients that use it.

### Key Components

1. **Strategy Interface** (`PaymentStrategy`): Defines the contract all payment strategies must implement
2. **Concrete Strategies** (`CreditCardPayment`, `PayPalPayment`, etc.): Implement specific payment methods
3. **Context** (`OrderProcessor`): Uses a strategy to process orders, can switch strategies at runtime

## Connection to Open/Closed Principle

This implementation perfectly demonstrates the **Open/Closed Principle** from [SOLID Principles](../../../../docs/11-application-development/11.2.1-solid-principles.md#openclosed-principle-ocp):

### Closed for Modification

The `OrderProcessor` class is **closed for modification** - you NEVER need to change it when adding new payment methods:

```python
class OrderProcessor:
    def __init__(self, payment_strategy: PaymentStrategy):
        self._payment_strategy = payment_strategy
    
    def process_order(self, order: Order) -> bool:
        # This method never changes, regardless of how many
        # payment strategies we add
        return self._payment_strategy.process(order)
```

### Open for Extension

The system is **open for extension** - you can add unlimited new payment strategies without touching existing code:

```python
# Adding a new payment method is as simple as creating a new class
class ApplePayPayment(PaymentStrategy):
    def process(self, order: Order) -> bool:
        # Apple Pay specific logic
        return True
    
    def get_name(self) -> str:
        return "Apple Pay"

# Use it immediately without modifying OrderProcessor
processor = OrderProcessor(ApplePayPayment())
processor.process_order(my_order)
```

### Before Strategy Pattern (Violates OCP)

Without the Strategy Pattern, you'd have code like this:

```python
class OrderProcessor:
    def process_order(self, order, payment_type):
        if payment_type == "credit_card":
            # Process credit card
        elif payment_type == "paypal":
            # Process PayPal
        elif payment_type == "bitcoin":
            # Process Bitcoin
        # Every new payment type requires modifying this method!
```

**Problem**: Adding a new payment method requires modifying the `OrderProcessor` class, violating OCP.

### With Strategy Pattern (Follows OCP)

```python
# OrderProcessor never changes
class OrderProcessor:
    def __init__(self, payment_strategy: PaymentStrategy):
        self._payment_strategy = payment_strategy
    
    def process_order(self, order: Order) -> bool:
        return self._payment_strategy.process(order)

# Add new payment methods by creating new classes
class NewPaymentMethod(PaymentStrategy):
    def process(self, order: Order) -> bool:
        # Implementation
        return True
```

**Solution**: New payment methods are new classes implementing `PaymentStrategy`. Zero modifications to `OrderProcessor`.

## Setup

### Prerequisites

- Python 3.11 or higher
- `uv` for dependency management (install with: `pip install uv`)

### Installation

```bash
# Navigate to this directory
cd examples/ch11/classical-patterns/strategy

# Install dependencies (including dev dependencies for testing)
uv sync --extra dev
```

## Running the Demo

```bash
# Run the demonstration
uv run src/main.py
```

Expected output shows:
- Processing orders with different payment methods
- Switching payment strategies at runtime
- How OrderProcessor remains unchanged when adding payment methods

## Running Tests

```bash
# Run all tests
uv run pytest

# Run with verbose output
uv run pytest -v

# Run specific test file
uv run pytest tests/test_strategy.py -v

# Run with coverage
uv run pytest --cov=src
```

All tests should pass, demonstrating:
- Each payment strategy works correctly
- Strategies are interchangeable
- Runtime strategy switching works
- OrderProcessor is never modified (OCP)

## Project Structure

```
strategy/
├── src/
│   ├── strategy.py      # Strategy interface and concrete implementations
│   └── main.py          # Executable demo
├── tests/
│   └── test_strategy.py # Unit tests
├── pyproject.toml       # Project configuration and dependencies
└── README.md            # This file
```

## When to Use Strategy Pattern

✅ **Use Strategy when**:
- You have multiple algorithms for a specific task
- Algorithms should be interchangeable at runtime
- You want to avoid conditional logic for algorithm selection
- Different variants of an algorithm need to coexist

❌ **Don't use Strategy when**:
- You only have one algorithm with no plans for more (YAGNI)
- The algorithm never changes
- The overhead of the pattern outweighs the benefits

## Real-World Applications

The Strategy Pattern is widely used in production code:

1. **Payment Processing**: As demonstrated (Stripe, PayPal, cryptocurrency)
2. **Sorting Algorithms**: QuickSort vs MergeSort vs HeapSort
3. **Compression**: ZIP vs GZIP vs BZIP2
4. **Routing**: Different pathfinding algorithms (Dijkstra, A*, BFS)
5. **Authentication**: OAuth, SAML, Basic Auth, JWT
6. **File Export**: PDF, CSV, JSON, XML formatters
7. **Validation**: Different validation rules per context
8. **Pricing**: Regular, seasonal, member, bulk pricing strategies

## Key Takeaways

1. **OCP in Action**: Strategy Pattern perfectly demonstrates Open/Closed Principle
2. **Runtime Flexibility**: Change behavior without changing code
3. **Testability**: Each strategy can be tested in isolation
4. **Maintainability**: Adding features doesn't risk breaking existing code
5. **Scalability**: Unlimited strategies without code modification

## Learning Exercise

Try extending this example:

1. Add a new payment strategy (e.g., Apple Pay, Google Pay, cryptocurrency wallet)
2. Add validation to payment strategies (e.g., check card expiration, wallet balance)
3. Add a logging decorator to track payment attempts
4. Implement a factory to select strategies based on configuration

Notice how you can do all of this **without modifying the OrderProcessor class**. That's the power of the Open/Closed Principle!

## Related Patterns

- **Factory Pattern**: Often used to create the appropriate strategy
- **Decorator Pattern**: Can wrap strategies to add behavior (logging, validation)
- **State Pattern**: Similar structure but strategies represent states with transitions

## Further Reading

- [SOLID Principles - Open/Closed Principle](../../../../docs/11-application-development/11.2.1-solid-principles.md#openclosed-principle-ocp)
- [Gang of Four Design Patterns](https://en.wikipedia.org/wiki/Design_Patterns)
- [Refactoring Guru - Strategy Pattern](https://refactoring.guru/design-patterns/strategy)
