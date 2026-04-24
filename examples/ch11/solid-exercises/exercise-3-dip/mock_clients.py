"""
Mock implementations of email and SMS clients.

These classes simulate external services by printing to the console
instead of actually sending messages. This allows the demonstration
to work without requiring real credentials.

In a real application, these would be actual clients for SMTP servers
and SMS services like Twilio.
"""


class SMTPClient:
    """
    Mock SMTP client that simulates sending emails.

    In production, this would connect to a real SMTP server
    and send actual emails.
    """

    def __init__(self, host: str = "smtp.example.com", port: int = 587) -> None:
        """
        Initialize the SMTP client.

        Args:
            host: SMTP server hostname (simulated)
            port: SMTP server port (simulated)
        """
        self.host = host
        self.port = port
        print(f"[SMTPClient] Initialized with {host}:{port}")

    def send(self, email: str, message: str) -> bool:
        """
        Send an email message.

        In production, this would actually send the email.
        For this demo, it just prints to the console.

        Args:
            email: The recipient's email address
            message: The message content to send

        Returns:
            True if the message was "sent" successfully
        """
        print(f"[SMTPClient] Sending email to: {email}")
        print(f"[SMTPClient] Message: {message}")
        print("[SMTPClient] Email sent successfully!")
        return True


class TwilioClient:
    """
    Mock Twilio client that simulates sending SMS messages.

    In production, this would use the Twilio API to send
    actual SMS messages.
    """

    def __init__(
        self,
        account_sid: str = "ACXXXXXXXXXX",
        auth_token: str = "[REDACTED]",
    ) -> None:
        """
        Initialize the Twilio client.

        Args:
            account_sid: Twilio account SID (simulated)
            auth_token: Twilio auth token (simulated)
        """
        self.account_sid = account_sid
        self.auth_token = auth_token
        print(f"[TwilioClient] Initialized with account: {account_sid}")

    def send(self, phone: str, message: str) -> bool:
        """
        Send an SMS message.

        In production, this would actually send the SMS via Twilio.
        For this demo, it just prints to the console.

        Args:
            phone: The recipient's phone number
            message: The message content to send

        Returns:
            True if the message was "sent" successfully
        """
        print(f"[TwilioClient] Sending SMS to: {phone}")
        print(f"[TwilioClient] Message: {message}")
        print("[TwilioClient] SMS sent successfully!")
        return True
