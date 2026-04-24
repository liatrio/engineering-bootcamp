# Exercise 2: Open/Closed Principle (OCP)

> "Software entities should be open for extension but closed for modification." - Robert C. Martin

## Overview

This exercise demonstrates a class that **violates** the Open/Closed Principle. Your task is to refactor it using abstract base classes and polymorphism so that new customer types can be added without modifying existing code.

## The Problem

The `DiscountCalculator` class in `discount_calculator.py` uses **if/elif chains** to handle different customer types:

```python
if customer_type == "regular":
    discount_rate = 0.05
elif customer_type == "premium":
    discount_rate = 0.10
elif customer_type == "vip":
    discount_rate = 0.15
else:
    raise ValueError(...)
```

This design has several problems:
- Adding a new customer type (e.g., "platinum") requires modifying the class
- The conditional chain grows with each new type
- Risk of breaking existing functionality when adding new types
- Difficult to test individual discount strategies in isolation
- String-based type checking is error-prone

## Setup

```bash
# Navigate to this directory
cd examples/ch11/solid-exercises/exercise-2-ocp

# Install dependencies
uv sync

# Run the demo to see the current implementation
uv run main.py

# Run the tests to verify behavior
uv run --extra dev pytest

# Run type checking
uv run --extra dev mypy .

# Run linting
uv run --extra dev ruff check .
```

## Your Task

Refactor `discount_calculator.py` to follow OCP using polymorphism:

### Suggested Refactoring

1. **Create an abstract base class `CustomerDiscount`**:
   ```python
   from abc import ABC, abstractmethod

   class CustomerDiscount(ABC):
       @abstractmethod
       def get_discount_rate(self) -> float:
           pass

       def calculate_discount(self, amount: float) -> float:
           return amount * self.get_discount_rate()
   ```

2. **Create concrete implementations for each customer type**:
   - `RegularCustomerDiscount` - returns 0.05
   - `PremiumCustomerDiscount` - returns 0.10
   - `VIPCustomerDiscount` - returns 0.15

3. **Refactor `DiscountCalculator`** to work with `CustomerDiscount` instances:
   ```python
   class DiscountCalculator:
       def calculate_discount(
           self,
           customer: CustomerDiscount,
           amount: float
       ) -> float:
           return customer.calculate_discount(amount)
   ```

4. **Adding new types is now easy**:
   ```python
   class PlatinumCustomerDiscount(CustomerDiscount):
       def get_discount_rate(self) -> float:
           return 0.20
   ```

## Success Criteria

After refactoring:
- Adding a new customer type requires **only** creating a new class
- The `DiscountCalculator` class should **never need modification**
- All existing tests should still pass (`uv run --extra dev pytest`)
- Type checking passes (`uv run --extra dev mypy .`)
- Linting passes (`uv run --extra dev ruff check .`)

## Learning Objectives

After completing this exercise, you should understand:

1. Why if/elif chains for type checking violate OCP
2. How abstract base classes enable extension without modification
3. How polymorphism replaces conditional logic
4. The benefits of "closed for modification, open for extension"
5. Why string-based type systems are fragile

## Code Smells to Watch For

- `if/elif` chains that check object types
- String comparisons for type discrimination (`if type == "something"`)
- Switch statements that grow with each new variant
- Functions that need modification when new types are added
- `isinstance()` checks scattered throughout the code

## Hints

- Use Python's `abc` module for abstract base classes
- The `@abstractmethod` decorator enforces implementation in subclasses
- Consider a factory function or dictionary mapping for creating instances
- The tests validate behavior, not implementation - they should pass unchanged
- Think about how a new "platinum" customer type would be added in both designs
