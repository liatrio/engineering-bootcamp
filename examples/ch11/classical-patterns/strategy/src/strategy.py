"""
Strategy Pattern Example - Payment Processing

Demonstrates the Strategy Pattern by implementing different payment methods
that can be swapped at runtime. This pattern embodies the Open/Closed Principle:
the OrderProcessor is closed for modification (we never change it) but open
for extension (we can add new payment strategies).
"""
from abc import ABC, abstractmethod
from dataclasses import dataclass


@dataclass
class Order:
    """Represents a customer order."""
    order_id: str
    total: float
    customer_email: str


class PaymentStrategy(ABC):
    """
    Abstract strategy interface defining the contract for payment processing.
    
    This interface allows different payment implementations to be used
    interchangeably by the OrderProcessor.
    """
    
    @abstractmethod
    def process(self, order: Order) -> bool:
        """
        Process payment for the given order.
        
        Args:
            order: The order to process payment for
            
        Returns:
            True if payment successful, False otherwise
        """
        pass
    
    @abstractmethod
    def get_name(self) -> str:
        """Return the name of this payment method."""
        pass


class CreditCardPayment(PaymentStrategy):
    """Credit card payment strategy."""
    
    def __init__(self, card_number: str, cvv: str):
        self.card_number = card_number[-4:]  # Store only last 4 digits
        self.cvv = cvv
    
    def process(self, order: Order) -> bool:
        """Process credit card payment."""
        print(f"Processing ${order.total:.2f} via Credit Card ending in {self.card_number}")
        # In real implementation: call payment gateway API
        return True
    
    def get_name(self) -> str:
        return "Credit Card"


class PayPalPayment(PaymentStrategy):
    """PayPal payment strategy."""
    
    def __init__(self, email: str):
        self.email = email
    
    def process(self, order: Order) -> bool:
        """Process PayPal payment."""
        print(f"Processing ${order.total:.2f} via PayPal account {self.email}")
        # In real implementation: redirect to PayPal OAuth flow
        return True
    
    def get_name(self) -> str:
        return "PayPal"


class BitcoinPayment(PaymentStrategy):
    """Bitcoin payment strategy."""
    
    def __init__(self, wallet_address: str):
        self.wallet_address = wallet_address
    
    def process(self, order: Order) -> bool:
        """Process Bitcoin payment."""
        print(f"Processing ${order.total:.2f} via Bitcoin to wallet {self.wallet_address[:10]}...")
        # In real implementation: generate payment request on blockchain
        return True
    
    def get_name(self) -> str:
        return "Bitcoin"


class BankTransferPayment(PaymentStrategy):
    """Bank transfer payment strategy."""
    
    def __init__(self, account_number: str, routing_number: str):
        self.account_number = account_number[-4:]  # Store only last 4 digits
        self.routing_number = routing_number
    
    def process(self, order: Order) -> bool:
        """Process bank transfer payment."""
        print(f"Processing ${order.total:.2f} via Bank Transfer from account ending in {self.account_number}")
        # In real implementation: initiate ACH transfer
        return True
    
    def get_name(self) -> str:
        return "Bank Transfer"


class OrderProcessor:
    """
    Context class that uses a payment strategy.
    
    This class demonstrates the Open/Closed Principle:
    - CLOSED for modification: We never modify this class when adding new payment methods
    - OPEN for extension: We can add unlimited payment strategies without changing this code
    
    The strategy can be set at construction or changed at runtime, providing
    flexibility without coupling to specific payment implementations.
    """
    
    def __init__(self, payment_strategy: PaymentStrategy):
        """
        Initialize with a payment strategy.
        
        Args:
            payment_strategy: The payment strategy to use
        """
        self._payment_strategy = payment_strategy
    
    def set_payment_strategy(self, payment_strategy: PaymentStrategy) -> None:
        """
        Change the payment strategy at runtime.
        
        Args:
            payment_strategy: The new payment strategy to use
        """
        self._payment_strategy = payment_strategy
    
    def process_order(self, order: Order) -> bool:
        """
        Process an order using the current payment strategy.
        
        Args:
            order: The order to process
            
        Returns:
            True if order processed successfully, False otherwise
        """
        print(f"\n{'='*60}")
        print(f"Processing Order #{order.order_id}")
        print(f"Total: ${order.total:.2f}")
        print(f"Payment Method: {self._payment_strategy.get_name()}")
        print(f"{'='*60}")
        
        success = self._payment_strategy.process(order)
        
        if success:
            print(f"✓ Order #{order.order_id} processed successfully!")
            # In real implementation: send confirmation email, update inventory, etc.
        else:
            print(f"✗ Order #{order.order_id} failed!")
        
        return success
