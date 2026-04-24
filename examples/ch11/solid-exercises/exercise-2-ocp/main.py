"""
Demonstration of the DiscountCalculator class.

This script shows how the if/elif-based DiscountCalculator works.
Run with: uv run main.py
"""

from discount_calculator import DiscountCalculator


def main() -> None:
    """Demonstrate discount calculations for different customer types."""
    calculator = DiscountCalculator()

    # Sample purchase amounts
    amounts = [100.00, 250.00, 500.00, 1000.00]

    # Customer types to demonstrate
    customer_types = ["regular", "premium", "vip"]

    print("=" * 60)
    print("Discount Calculator Demo")
    print("=" * 60)
    print()

    for customer_type in customer_types:
        print(f"Customer Type: {customer_type.upper()}")
        print("-" * 40)

        for amount in amounts:
            discount = calculator.calculate_discount(customer_type, amount)
            final_price = calculator.get_final_price(customer_type, amount)

            print(f"  Original: ${amount:>8.2f}")
            print(f"  Discount: ${discount:>8.2f}")
            print(f"  Final:    ${final_price:>8.2f}")
            print()

        print()

    # Show what happens with an unknown type
    print("What happens when we need a new customer type?")
    print("-" * 40)
    print("Try adding a 'platinum' customer type...")
    print("You'll need to modify the DiscountCalculator class!")
    print()
    print("This violates the Open/Closed Principle:")
    print("  - The class is NOT closed for modification")
    print("  - Every new type requires changing existing code")


if __name__ == "__main__":
    main()
