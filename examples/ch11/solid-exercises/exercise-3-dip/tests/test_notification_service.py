"""
Behavior-based tests for the NotificationService.

These tests validate the BEHAVIOR/OUTCOMES of notification sending:
- Both email and SMS channels are used
- Notifications are sent to the correct addresses
- Results are returned correctly

These tests are designed to work regardless of whether the code uses
the original tightly-coupled approach or a refactored dependency-injected version.

Note: These tests capture stdout to verify that the mock clients are called,
since the mock clients print to console.
"""

import io
import sys
from dataclasses import dataclass

from notification_service import NotificationService


@dataclass
class SampleUser:
    """Sample user with contact information for tests."""

    name: str
    email: str
    phone: str


class TestNotifyAllChannels:
    """Tests for sending notifications through all channels."""

    def test_notify_sends_to_both_channels(self) -> None:
        """Notify should send messages through both email and SMS."""
        service = NotificationService()
        user = SampleUser(
            name="Test User",
            email="test@example.com",
            phone="+1-555-000-0000",
        )

        # Capture stdout to verify both channels are called
        captured = io.StringIO()
        sys.stdout = captured

        try:
            results = service.notify(user, "Test message")
        finally:
            sys.stdout = sys.__stdout__

        _ = captured.getvalue()  # Capture output (not checked in this test)

        # Verify both channels were used
        assert "email" in results
        assert "sms" in results
        assert results["email"] is True
        assert results["sms"] is True

    def test_notify_sends_to_correct_email(self) -> None:
        """Notify should send to the user's email address."""
        service = NotificationService()
        user = SampleUser(
            name="Email User",
            email="specific@example.com",
            phone="+1-555-111-1111",
        )

        captured = io.StringIO()
        sys.stdout = captured

        try:
            service.notify(user, "Email test")
        finally:
            sys.stdout = sys.__stdout__

        output = captured.getvalue()
        assert "specific@example.com" in output

    def test_notify_sends_to_correct_phone(self) -> None:
        """Notify should send to the user's phone number."""
        service = NotificationService()
        user = SampleUser(
            name="Phone User",
            email="phone@example.com",
            phone="+1-555-222-2222",
        )

        captured = io.StringIO()
        sys.stdout = captured

        try:
            service.notify(user, "SMS test")
        finally:
            sys.stdout = sys.__stdout__

        output = captured.getvalue()
        assert "+1-555-222-2222" in output

    def test_notify_includes_message_content(self) -> None:
        """Notify should include the message in both channels."""
        service = NotificationService()
        user = SampleUser(
            name="Message User",
            email="message@example.com",
            phone="+1-555-333-3333",
        )
        test_message = "This is a unique test message 12345"

        captured = io.StringIO()
        sys.stdout = captured

        try:
            service.notify(user, test_message)
        finally:
            sys.stdout = sys.__stdout__

        output = captured.getvalue()
        # Message should appear twice (once for email, once for SMS)
        assert output.count(test_message) >= 2


class TestEmailOnlyNotification:
    """Tests for email-only notifications."""

    def test_email_only_sends_email(self) -> None:
        """Email-only notification should send via email."""
        service = NotificationService()
        user = SampleUser(
            name="Email Only User",
            email="emailonly@example.com",
            phone="+1-555-444-4444",
        )

        captured = io.StringIO()
        sys.stdout = captured

        try:
            result = service.notify_email_only(user, "Email only message")
        finally:
            sys.stdout = sys.__stdout__

        output = captured.getvalue()
        assert result is True
        assert "emailonly@example.com" in output

    def test_email_only_does_not_send_sms(self) -> None:
        """Email-only notification should not trigger SMS."""
        service = NotificationService()
        user = SampleUser(
            name="Email Only User",
            email="nophone@example.com",
            phone="+1-555-555-5555",
        )

        captured = io.StringIO()
        sys.stdout = captured

        try:
            service.notify_email_only(user, "Email only message")
        finally:
            sys.stdout = sys.__stdout__

        output = captured.getvalue()
        # Phone number should not appear in email-only notification
        assert "TwilioClient" not in output


class TestSMSOnlyNotification:
    """Tests for SMS-only notifications."""

    def test_sms_only_sends_sms(self) -> None:
        """SMS-only notification should send via SMS."""
        service = NotificationService()
        user = SampleUser(
            name="SMS Only User",
            email="smsonly@example.com",
            phone="+1-555-666-6666",
        )

        captured = io.StringIO()
        sys.stdout = captured

        try:
            result = service.notify_sms_only(user, "SMS only message")
        finally:
            sys.stdout = sys.__stdout__

        output = captured.getvalue()
        assert result is True
        assert "+1-555-666-6666" in output

    def test_sms_only_does_not_send_email(self) -> None:
        """SMS-only notification should not trigger email."""
        service = NotificationService()
        user = SampleUser(
            name="SMS Only User",
            email="noemail@example.com",
            phone="+1-555-777-7777",
        )

        captured = io.StringIO()
        sys.stdout = captured

        try:
            service.notify_sms_only(user, "SMS only message")
        finally:
            sys.stdout = sys.__stdout__

        output = captured.getvalue()
        # SMTPClient should not be mentioned in SMS-only
        # (Note: we check for specific email address not appearing)
        assert "noemail@example.com" not in output


class TestServiceInitialization:
    """Tests for service initialization."""

    def test_service_creates_successfully(self) -> None:
        """Service should initialize without errors."""
        captured = io.StringIO()
        sys.stdout = captured

        try:
            service = NotificationService()
        finally:
            sys.stdout = sys.__stdout__

        # Service should exist
        assert service is not None

    def test_service_initializes_both_clients(self) -> None:
        """Service should initialize both email and SMS clients."""
        captured = io.StringIO()
        sys.stdout = captured

        try:
            _ = NotificationService()
        finally:
            sys.stdout = sys.__stdout__

        output = captured.getvalue()
        # Both clients should have initialized (they print on init)
        assert "SMTPClient" in output
        assert "TwilioClient" in output
