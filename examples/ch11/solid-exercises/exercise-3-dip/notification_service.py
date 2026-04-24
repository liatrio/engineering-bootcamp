"""
NotificationService - A class that violates the Dependency Inversion Principle.

This class directly instantiates concrete dependencies (SMTPClient, TwilioClient)
instead of depending on abstractions. This makes the class:
- Hard to test (requires real clients or complex mocking)
- Tightly coupled to specific implementations
- Difficult to extend with new notification channels

Your task: Refactor using dependency injection and abstractions so that
notification channels can be easily swapped and tested.
"""

from typing import Protocol


class User(Protocol):
    """Protocol defining what a User object should have."""

    email: str
    phone: str


class NotificationService:
    """
    A notification service that sends messages through multiple channels.

    This is an example of BAD design - the class directly creates its dependencies,
    violating the Dependency Inversion Principle.

    Problems with this approach:
    - Cannot test without the actual SMTPClient and TwilioClient
    - Cannot swap implementations (e.g., use SendGrid instead of SMTP)
    - High-level module (NotificationService) depends on low-level modules
    """

    def __init__(self) -> None:
        """
        Initialize the notification service.

        Notice how we directly instantiate concrete classes here!
        This is the DIP violation - we're creating our own dependencies
        instead of having them injected.
        """
        # Direct dependency on concrete class!
        from mock_clients import SMTPClient, TwilioClient

        self.email_client = SMTPClient()
        self.sms_client = TwilioClient()

    def notify(self, user: User, message: str) -> dict[str, bool]:
        """
        Send a notification to a user through all channels.

        Args:
            user: A user object with email and phone attributes
            message: The message to send

        Returns:
            A dictionary with the status of each channel
        """
        results: dict[str, bool] = {}

        # Send email notification
        print("\n--- Sending Email Notification ---")
        results["email"] = self.email_client.send(user.email, message)

        # Send SMS notification
        print("\n--- Sending SMS Notification ---")
        results["sms"] = self.sms_client.send(user.phone, message)

        return results

    def notify_email_only(self, user: User, message: str) -> bool:
        """Send notification via email only."""
        print("\n--- Sending Email Only ---")
        return self.email_client.send(user.email, message)

    def notify_sms_only(self, user: User, message: str) -> bool:
        """Send notification via SMS only."""
        print("\n--- Sending SMS Only ---")
        return self.sms_client.send(user.phone, message)
