"""
DiscountCalculator - A class that violates the Open/Closed Principle.

This class uses if/elif chains to handle different customer types.
Adding a new customer type requires modifying this class.

Your task: Refactor using abstract base classes and polymorphism so that
new customer types can be added without modifying existing code.
"""


class DiscountCalculator:
    """
    A discount calculator that uses conditional logic for customer types.

    This is an example of BAD design - adding new customer types requires
    modifying this class, violating the Open/Closed Principle.

    Current customer types and their discount rates:
    - regular: 5% (0.05)
    - premium: 10% (0.10)
    - vip: 15% (0.15)
    """

    def calculate_discount(self, customer_type: str, amount: float) -> float:
        """
        Calculate the discount amount for a given customer type and purchase amount.

        This method violates OCP because:
        - Adding a new customer type requires modifying this method
        - Each new type adds another elif branch
        - The class is not "closed for modification"

        Args:
            customer_type: The type of customer ("regular", "premium", or "vip")
            amount: The purchase amount to calculate discount for

        Returns:
            The discount amount (not the discounted price)

        Raises:
            ValueError: If the customer type is unknown
        """
        if amount < 0:
            raise ValueError("Amount cannot be negative")

        if customer_type == "regular":
            # Regular customers get 5% discount
            discount_rate = 0.05
        elif customer_type == "premium":
            # Premium customers get 10% discount
            discount_rate = 0.10
        elif customer_type == "vip":
            # VIP customers get 15% discount
            discount_rate = 0.15
        else:
            # What happens when we need to add a "platinum" customer?
            # We have to modify this class!
            raise ValueError(f"Unknown customer type: {customer_type}")

        return amount * discount_rate

    def get_final_price(self, customer_type: str, amount: float) -> float:
        """
        Calculate the final price after applying the discount.

        Args:
            customer_type: The type of customer
            amount: The original purchase amount

        Returns:
            The final price after discount
        """
        discount = self.calculate_discount(customer_type, amount)
        return amount - discount
