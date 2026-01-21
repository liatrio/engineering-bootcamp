"""
Unit tests for Strategy Pattern implementation.

These tests verify that each payment strategy works correctly and that
the OrderProcessor can switch between strategies.
"""
import sys
from pathlib import Path

# Add src directory to path
sys.path.insert(0, str(Path(__file__).parent.parent / "src"))

import pytest
from strategy import (
    Order,
    OrderProcessor,
    CreditCardPayment,
    PayPalPayment,
    BitcoinPayment,
    BankTransferPayment,
)


@pytest.fixture
def sample_order():
    """Create a sample order for testing."""
    return Order(
        order_id="TEST-001",
        total=99.99,
        customer_email="test@example.com"
    )


class TestPaymentStrategies:
    """Test each payment strategy implementation."""
    
    def test_credit_card_payment(self, sample_order):
        """Test credit card payment strategy."""
        strategy = CreditCardPayment(card_number="4532123456789012", cvv="123")
        assert strategy.get_name() == "Credit Card"
        assert strategy.process(sample_order) is True
    
    def test_paypal_payment(self, sample_order):
        """Test PayPal payment strategy."""
        strategy = PayPalPayment(email="test@example.com")
        assert strategy.get_name() == "PayPal"
        assert strategy.process(sample_order) is True
    
    def test_bitcoin_payment(self, sample_order):
        """Test Bitcoin payment strategy."""
        strategy = BitcoinPayment(wallet_address="1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa")
        assert strategy.get_name() == "Bitcoin"
        assert strategy.process(sample_order) is True
    
    def test_bank_transfer_payment(self, sample_order):
        """Test bank transfer payment strategy."""
        strategy = BankTransferPayment(
            account_number="9876543210",
            routing_number="123456789"
        )
        assert strategy.get_name() == "Bank Transfer"
        assert strategy.process(sample_order) is True


class TestOrderProcessor:
    """Test the OrderProcessor context class."""
    
    def test_process_order_with_credit_card(self, sample_order):
        """Test processing an order with credit card."""
        strategy = CreditCardPayment(card_number="4532123456789012", cvv="123")
        processor = OrderProcessor(strategy)
        assert processor.process_order(sample_order) is True
    
    def test_process_order_with_paypal(self, sample_order):
        """Test processing an order with PayPal."""
        strategy = PayPalPayment(email="test@example.com")
        processor = OrderProcessor(strategy)
        assert processor.process_order(sample_order) is True
    
    def test_change_strategy_at_runtime(self, sample_order):
        """Test changing payment strategy at runtime."""
        # Start with credit card
        credit_card = CreditCardPayment(card_number="4532123456789012", cvv="123")
        processor = OrderProcessor(credit_card)
        assert processor.process_order(sample_order) is True
        
        # Switch to PayPal
        paypal = PayPalPayment(email="test@example.com")
        processor.set_payment_strategy(paypal)
        assert processor.process_order(sample_order) is True
        
        # Switch to Bitcoin
        bitcoin = BitcoinPayment(wallet_address="1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa")
        processor.set_payment_strategy(bitcoin)
        assert processor.process_order(sample_order) is True
    
    def test_multiple_processors_different_strategies(self):
        """Test multiple processors with different strategies work independently."""
        order1 = Order(order_id="ORD-001", total=50.00, customer_email="alice@example.com")
        order2 = Order(order_id="ORD-002", total=100.00, customer_email="bob@example.com")
        
        processor1 = OrderProcessor(CreditCardPayment("4532123456789012", "123"))
        processor2 = OrderProcessor(PayPalPayment("bob@example.com"))
        
        assert processor1.process_order(order1) is True
        assert processor2.process_order(order2) is True


class TestOpenClosedPrinciple:
    """Tests demonstrating the Open/Closed Principle."""
    
    def test_adding_new_strategy_does_not_modify_processor(self, sample_order):
        """
        Verify that adding a new payment strategy does not require
        modifying the OrderProcessor class (Open/Closed Principle).
        """
        # This test demonstrates OCP by showing that OrderProcessor
        # works with any PaymentStrategy implementation without modification
        
        # Original strategies work
        processor = OrderProcessor(CreditCardPayment("4532123456789012", "123"))
        assert processor.process_order(sample_order) is True
        
        # New strategy (BankTransfer) works without modifying OrderProcessor
        new_strategy = BankTransferPayment("9876543210", "123456789")
        processor.set_payment_strategy(new_strategy)
        assert processor.process_order(sample_order) is True
        
        # OrderProcessor code remains unchanged - it's closed for modification
        # but open for extension through new PaymentStrategy implementations
