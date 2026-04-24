"""
Demonstration of the NotificationService class.

This script shows how the tightly-coupled NotificationService works.
Run with: uv run main.py
"""

from dataclasses import dataclass

from notification_service import NotificationService


@dataclass
class User:
    """Simple user class with contact information."""

    name: str
    email: str
    phone: str


def main() -> None:
    """Demonstrate the notification service sending messages."""
    print("=" * 60)
    print("Notification Service Demo")
    print("=" * 60)

    # Create a sample user
    user = User(
        name="Alice Smith",
        email="alice@example.com",
        phone="+1-555-123-4567",
    )

    print(f"\nUser: {user.name}")
    print(f"Email: {user.email}")
    print(f"Phone: {user.phone}")

    # Create the notification service
    # Notice: We can't inject different implementations here!
    print("\n" + "=" * 60)
    print("Creating NotificationService (dependencies created internally)")
    print("=" * 60)
    service = NotificationService()

    # Send a notification
    message = "Your order #12345 has been shipped!"

    print("\n" + "=" * 60)
    print("Sending notification through all channels")
    print("=" * 60)
    results = service.notify(user, message)

    print("\n" + "=" * 60)
    print("Results")
    print("=" * 60)
    for channel, success in results.items():
        status = "SUCCESS" if success else "FAILED"
        print(f"  {channel.upper()}: {status}")

    # Demonstrate the problem
    print("\n" + "=" * 60)
    print("Why this violates the Dependency Inversion Principle")
    print("=" * 60)
    print("""
The NotificationService class:
  - Creates SMTPClient() directly in __init__
  - Creates TwilioClient() directly in __init__

This means:
  1. We can't substitute different implementations
  2. We can't easily test without real clients
  3. Adding a new channel (Slack, Push) requires modifying the class
  4. High-level module depends on low-level implementations

To fix this:
  - Define abstract interfaces (MessageSender protocol)
  - Inject dependencies through the constructor
  - NotificationService should depend on abstractions, not concretions
""")


if __name__ == "__main__":
    main()
