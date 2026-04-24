# Exercise 3: Dependency Inversion Principle (DIP)

> "High-level modules should not depend on low-level modules. Both should depend on abstractions." - Robert C. Martin

## Overview

This exercise demonstrates a class that **violates** the Dependency Inversion Principle. Your task is to refactor it using dependency injection and abstractions so that notification channels can be easily swapped and tested.

## The Problem

The `NotificationService` class in `notification_service.py` directly instantiates its dependencies:

```python
class NotificationService:
    def __init__(self):
        # Direct dependency on concrete classes!
        self.email_client = SMTPClient()
        self.sms_client = TwilioClient()
```

This design has several problems:
- Cannot test without real SMTP and Twilio clients
- Cannot swap implementations (e.g., use SendGrid instead of SMTP)
- Adding a new channel requires modifying the class
- High-level business logic (NotificationService) depends on low-level details
- Cannot easily configure different services for dev/staging/production

## Setup

```bash
# Navigate to this directory
cd examples/ch11/solid-exercises/exercise-3-dip

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

Refactor `notification_service.py` to follow DIP using dependency injection:

### Suggested Refactoring

1. **Define an abstraction (Protocol) for message sending**:
   ```python
   from typing import Protocol

   class MessageSender(Protocol):
       def send(self, recipient: str, message: str) -> bool:
           ...
   ```

2. **Make existing clients implement the protocol** (they already do!):
   ```python
   # SMTPClient.send(email, message) already matches!
   # TwilioClient.send(phone, message) already matches!
   ```

3. **Refactor NotificationService to accept dependencies**:
   ```python
   class NotificationService:
       def __init__(
           self,
           email_sender: MessageSender,
           sms_sender: MessageSender,
       ) -> None:
           # Dependencies are INJECTED, not created
           self.email_sender = email_sender
           self.sms_sender = sms_sender
   ```

4. **Create instances with injected dependencies**:
   ```python
   # Production
   service = NotificationService(
       email_sender=SMTPClient(),
       sms_sender=TwilioClient(),
   )

   # Testing
   service = NotificationService(
       email_sender=MockEmailSender(),
       sms_sender=MockSMSSender(),
   )
   ```

## Success Criteria

After refactoring:
- `NotificationService` should **not** import or instantiate concrete clients
- Dependencies should be **injected** through the constructor
- You should be able to create a `NotificationService` with mock implementations
- All existing tests should still pass (`uv run --extra dev pytest`)
- Type checking passes (`uv run --extra dev mypy .`)
- Linting passes (`uv run --extra dev ruff check .`)

## Learning Objectives

After completing this exercise, you should understand:

1. Why direct instantiation of dependencies creates tight coupling
2. How to use Python's `Protocol` for structural subtyping (duck typing with type hints)
3. The difference between Dependency Injection and Dependency Inversion
4. How DIP enables testing with mock implementations
5. Why constructor injection is preferred over property/method injection

## Code Smells to Watch For

- `import` statements for concrete classes inside `__init__`
- Direct instantiation of external services (`SMTPClient()`, `TwilioClient()`)
- Classes that are hard to test without real external services
- Business logic that knows about specific implementation details
- Constructor signatures with no parameters for classes that have dependencies

## Types of Dependency Injection

```python
# 1. Constructor Injection (preferred)
class NotificationService:
    def __init__(self, email_sender: MessageSender):
        self.email_sender = email_sender

# 2. Method Injection
class NotificationService:
    def notify(self, email_sender: MessageSender, user: User, message: str):
        email_sender.send(user.email, message)

# 3. Property Injection (avoid if possible)
class NotificationService:
    email_sender: MessageSender | None = None
```

## Hints

- Python's `Protocol` (from `typing`) provides structural subtyping
- The mock clients already have the right interface (`send(recipient, message)`)
- Think about what should be configurable vs. what should be fixed
- Consider how you would test the service with fake implementations
- Factory functions can help create properly-configured service instances
