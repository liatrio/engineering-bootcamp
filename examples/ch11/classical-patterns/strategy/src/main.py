"""
Main demo for Strategy Pattern.

This demo shows how the Strategy Pattern allows swapping payment methods
at runtime without modifying the OrderProcessor class.
"""
from strategy import (
    Order,
    OrderProcessor,
    CreditCardPayment,
    PayPalPayment,
    BitcoinPayment,
    BankTransferPayment,
)


def main():
    """Demonstrate the Strategy Pattern with different payment methods."""
    
    # Create sample orders
    order1 = Order(order_id="ORD-001", total=99.99, customer_email="alice@example.com")
    order2 = Order(order_id="ORD-002", total=249.50, customer_email="bob@example.com")
    order3 = Order(order_id="ORD-003", total=1499.99, customer_email="charlie@example.com")
    order4 = Order(order_id="ORD-004", total=59.99, customer_email="diana@example.com")
    
    print("=== Strategy Pattern Demo: Payment Processing ===\n")
    
    # Example 1: Process order with Credit Card
    print("\n--- Example 1: Credit Card Payment ---")
    credit_card = CreditCardPayment(card_number="4532123456789012", cvv="123")
    processor = OrderProcessor(credit_card)
    processor.process_order(order1)
    
    # Example 2: Change strategy to PayPal at runtime
    print("\n--- Example 2: Switching to PayPal ---")
    paypal = PayPalPayment(email="bob@example.com")
    processor.set_payment_strategy(paypal)
    processor.process_order(order2)
    
    # Example 3: Create new processor with Bitcoin strategy
    print("\n--- Example 3: Bitcoin Payment ---")
    bitcoin = BitcoinPayment(wallet_address="1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa")
    bitcoin_processor = OrderProcessor(bitcoin)
    bitcoin_processor.process_order(order3)
    
    # Example 4: Bank Transfer payment
    print("\n--- Example 4: Bank Transfer Payment ---")
    bank_transfer = BankTransferPayment(
        account_number="9876543210",
        routing_number="123456789"
    )
    processor.set_payment_strategy(bank_transfer)
    processor.process_order(order4)
    
    # Example 5: Demonstrate runtime flexibility
    print("\n--- Example 5: Multiple Orders with Different Strategies ---")
    orders = [
        (order1, CreditCardPayment("4532111111111111", "456")),
        (order2, PayPalPayment("customer@email.com")),
        (order3, BitcoinPayment("bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh")),
    ]
    
    for order, strategy in orders:
        processor.set_payment_strategy(strategy)
        processor.process_order(order)
    
    print("\n" + "="*60)
    print("Demo completed!")
    print("="*60)
    print("\nKey Takeaway:")
    print("The OrderProcessor class was NEVER modified to add new payment methods.")
    print("We extended functionality by creating new strategy classes.")
    print("This is the Open/Closed Principle in action!")


if __name__ == "__main__":
    main()
