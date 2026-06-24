# Decorator Pattern Example: Coffee Shop

> **Pattern Category**: Structural  
> **SOLID Connection**: Open/Closed Principle, Single Responsibility  
> **Language**: Python 3.11+

## Overview

This example demonstrates the **Decorator Pattern** through a coffee shop system where customers can customize beverages with various add-ons. The pattern attaches additional responsibilities to objects dynamically, providing a flexible alternative to subclassing for extending functionality.

## The Decorator Pattern

The Decorator Pattern allows you to add new behaviors to objects by wrapping them in decorator objects. Decorators provide a more flexible alternative to inheritance for extending functionality.

### Key Components

1. **Component Interface** (`Beverage`): Defines the interface for objects that can have responsibilities added
2. **Concrete Components** (`Coffee`, `Espresso`, `Tea`): Base objects to which decorators can be attached
3. **Decorator Base Class** (`BeverageDecorator`): Maintains reference to a component and conforms to component interface
4. **Concrete Decorators** (`MilkDecorator`, `SugarDecorator`, etc.): Add specific responsibilities

## Connection to Open/Closed Principle

This implementation perfectly demonstrates the **Open/Closed Principle** from [SOLID Principles](../../../../docs/11-application-development/11.2.1-solid-principles.md#openclosed-principle-ocp):

### Closed for Modification

The base `Coffee`, `Espresso`, and `Tea` classes are **closed for modification** - you NEVER need to change them when adding new features:

```python
class Coffee(Beverage):
    def cost(self) -> float:
        return 2.00  # This never changes
    
    def description(self) -> str:
        return "Coffee"  # This never changes
```

### Open for Extension

The system is **open for extension** - you can add unlimited new decorators without touching existing code:

```python
# Adding a new feature is as simple as creating a new decorator
class HoneyDecorator(BeverageDecorator):
    def cost(self) -> float:
        return self._beverage.cost() + 0.40
    
    def description(self) -> str:
        return self._beverage.description() + ", Honey"

# Use it immediately without modifying Coffee
beverage = HoneyDecorator(Coffee())  # ✓ Extended without modification
```

### Before Decorator Pattern (Violates OCP)

Without the Decorator Pattern, you'd need a class for every combination:

```python
class Coffee(Beverage): pass
class CoffeeWithMilk(Beverage): pass
class CoffeeWithSugar(Beverage): pass
class CoffeeWithMilkAndSugar(Beverage): pass
class CoffeeWithMilkAndSugarAndWhippedCream(Beverage): pass
# This explodes combinatorially! With 5 add-ons, you'd need 32 classes!
```

**Problem**: Adding a new add-on requires creating many new classes. This violates OCP.

### With Decorator Pattern (Follows OCP)

```python
# Base classes never change
class Coffee(Beverage): pass

# Add features by wrapping
coffee = Coffee()
coffee = MilkDecorator(coffee)
coffee = SugarDecorator(coffee)
coffee = WhippedCreamDecorator(coffee)
# Unlimited combinations, zero class modifications!
```

**Solution**: Add features by creating decorators that wrap beverages. Zero modifications to base classes.

## Avoiding Class Explosion

One of the biggest benefits of Decorator Pattern is avoiding combinatorial explosion:

- **Without Decorator**: 5 add-ons = 2^5 = 32 classes needed
- **With Decorator**: 5 add-ons = 5 decorator classes + 1 base = 6 classes total

The Decorator Pattern scales linearly, not exponentially!

## Setup

### Prerequisites

- Python 3.11 or higher
- `uv` for dependency management (install with: `pip install uv`)

### Installation

```bash
# Navigate to this directory
cd examples/ch11/classical-patterns/decorator

# Install dependencies (including dev dependencies for testing)
uv sync --extra dev
```

## Running the Demo

```bash
# Run the demonstration
uv run src/main.py
```

Expected output shows:
- Plain beverages
- Single decorators
- Multiple decorators chained together
- Step-by-step building of complex beverages
- How decorators avoid class explosion

## Running Tests

```bash
# Run all tests
uv run pytest

# Run with verbose output
uv run pytest -v

# Run specific test file
uv run pytest tests/test_decorator.py -v

# Run with coverage
uv run pytest --cov=src
```

All tests should pass, demonstrating:
- Each decorator adds cost and description correctly
- Decorators can be chained in any order
- Same decorator can be applied multiple times
- Base classes are never modified (OCP)

## Project Structure

```
decorator/
├── src/
│   ├── decorator.py     # Component interface, decorators
│   └── main.py          # Executable demo
├── tests/
│   └── test_decorator.py # Unit tests
├── pyproject.toml       # Project configuration and dependencies
└── README.md            # This file
```

## When to Use Decorator Pattern

✅ **Use Decorator when**:
- You need to add responsibilities to objects dynamically
- Extension by subclassing is impractical (combinatorial explosion)
- You need to add/remove responsibilities at runtime
- Responsibilities can be combined in various ways

❌ **Don't use Decorator when**:
- You only have one or two add-ons (simple inheritance is fine)
- Add-ons are always used together (create a single composite class)
- The order of decorators matters semantically (use Chain of Responsibility)

## Real-World Applications

The Decorator Pattern is widely used in production code:

1. **I/O Streams**: Java's `BufferedReader(FileReader)`, Python's file wrappers
2. **HTTP Middleware**: Express.js, Django middleware chains
3. **UI Components**: Adding borders, scrollbars, shadows to components
4. **Caching Layers**: Wrapping service calls with caching
5. **Logging/Monitoring**: Adding logging to existing functions
6. **Compression**: Wrapping streams with compression (GZip, Deflate)
7. **Encryption**: Adding encryption layer to data streams
8. **Authentication**: Wrapping endpoints with auth checks

## Decorator vs Strategy

Both patterns involve wrapping, but serve different purposes:

| Decorator | Strategy |
|-----------|----------|
| Adds behavior/responsibilities | Swaps entire algorithm |
| Can be chained/stacked | Usually just one strategy |
| Changes what object does | Changes how object does it |
| Adds layers around object | Replaces object's core logic |

Example:
- **Decorator**: Coffee → +Milk → +Sugar (adding layers)
- **Strategy**: Payment → CreditCard OR PayPal (choosing one)

## Key Takeaways

1. **OCP in Action**: Decorator Pattern perfectly demonstrates Open/Closed Principle
2. **Runtime Flexibility**: Add/remove features without changing code
3. **Avoids Class Explosion**: Linear growth instead of exponential
4. **Single Responsibility**: Each decorator does one thing
5. **Composition over Inheritance**: Flexible alternative to subclassing

## Learning Exercise

Try extending this example:

1. Add new decorators (Honey, Cinnamon, Almond Milk, Oat Milk)
2. Add size variations (Small, Medium, Large) that multiply cost
3. Implement a "Remove Decorator" operation
4. Add a `getIngredients()` method that lists all ingredients
5. Implement decorator with state (e.g., temperature: hot vs iced)

Notice how you can do all of this **without modifying the Coffee, Espresso, or Tea classes**. That's the power of the Open/Closed Principle!

## Common Pitfalls

1. **Too Many Decorators**: Don't over-abstract. Simple inheritance is fine for simple cases.
2. **Decorator Order**: Order matters for description but shouldn't matter for cost. Be careful with stateful decorators.
3. **Type Identity**: Decorated objects have different types than base objects (use interfaces).
4. **Complexity**: Too many decorators can make code hard to debug. Keep it simple.

## Pattern Combination

Decorators work well with other patterns:

- **Factory**: Use factory to create pre-configured decorator chains
- **Strategy**: Decorators can wrap strategies to add logging/caching
- **Composite**: Decorators and composites both use recursive composition
- **Prototype**: Clone decorated objects to create similar instances

## Related Patterns

- **Proxy**: Similar structure but different intent (Proxy controls access, Decorator adds behavior)
- **Composite**: Both use recursive composition, but Composite represents part-whole hierarchies
- **Strategy**: Both involve wrapping, but Strategy swaps algorithms, Decorator adds layers
- **Chain of Responsibility**: Similar chaining, but CoR passes requests along a chain

## Further Reading

- [SOLID Principles - Open/Closed Principle](../../../../docs/11-application-development/11.2.1-solid-principles.md#openclosed-principle-ocp)
- [Gang of Four Design Patterns](https://en.wikipedia.org/wiki/Design_Patterns)
- [Refactoring Guru - Decorator Pattern](https://refactoring.guru/design-patterns/decorator)
- [Python Decorator Pattern](https://refactoring.guru/design-patterns/decorator/python/example)
