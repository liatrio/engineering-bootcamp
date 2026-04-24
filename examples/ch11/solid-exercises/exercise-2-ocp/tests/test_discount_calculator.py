"""
Behavior-based tests for the DiscountCalculator.

These tests validate the BEHAVIOR/OUTCOMES of discount calculations:
- Regular customers get 5% discount
- Premium customers get 10% discount
- VIP customers get 15% discount
- Invalid inputs are handled correctly

These tests are designed to work regardless of whether the code uses
the original if/elif approach or a refactored polymorphic version.
"""

import pytest

from discount_calculator import DiscountCalculator


class TestRegularCustomerDiscount:
    """Tests for regular customer discount calculations."""

    def test_regular_customer_gets_5_percent_discount(self) -> None:
        """Regular customers should receive a 5% discount."""
        calculator = DiscountCalculator()
        amount = 100.00

        discount = calculator.calculate_discount("regular", amount)

        assert discount == pytest.approx(5.00)

    def test_regular_customer_discount_on_large_amount(self) -> None:
        """Regular customer discount should scale with amount."""
        calculator = DiscountCalculator()
        amount = 1000.00

        discount = calculator.calculate_discount("regular", amount)

        assert discount == pytest.approx(50.00)

    def test_regular_customer_final_price(self) -> None:
        """Final price should be original minus discount."""
        calculator = DiscountCalculator()
        amount = 200.00

        final_price = calculator.get_final_price("regular", amount)

        # 200 - (200 * 0.05) = 200 - 10 = 190
        assert final_price == pytest.approx(190.00)


class TestPremiumCustomerDiscount:
    """Tests for premium customer discount calculations."""

    def test_premium_customer_gets_10_percent_discount(self) -> None:
        """Premium customers should receive a 10% discount."""
        calculator = DiscountCalculator()
        amount = 100.00

        discount = calculator.calculate_discount("premium", amount)

        assert discount == pytest.approx(10.00)

    def test_premium_customer_discount_on_large_amount(self) -> None:
        """Premium customer discount should scale with amount."""
        calculator = DiscountCalculator()
        amount = 500.00

        discount = calculator.calculate_discount("premium", amount)

        assert discount == pytest.approx(50.00)

    def test_premium_customer_final_price(self) -> None:
        """Final price should be original minus discount."""
        calculator = DiscountCalculator()
        amount = 300.00

        final_price = calculator.get_final_price("premium", amount)

        # 300 - (300 * 0.10) = 300 - 30 = 270
        assert final_price == pytest.approx(270.00)


class TestVIPCustomerDiscount:
    """Tests for VIP customer discount calculations."""

    def test_vip_customer_gets_15_percent_discount(self) -> None:
        """VIP customers should receive a 15% discount."""
        calculator = DiscountCalculator()
        amount = 100.00

        discount = calculator.calculate_discount("vip", amount)

        assert discount == pytest.approx(15.00)

    def test_vip_customer_discount_on_large_amount(self) -> None:
        """VIP customer discount should scale with amount."""
        calculator = DiscountCalculator()
        amount = 1000.00

        discount = calculator.calculate_discount("vip", amount)

        assert discount == pytest.approx(150.00)

    def test_vip_customer_final_price(self) -> None:
        """Final price should be original minus discount."""
        calculator = DiscountCalculator()
        amount = 400.00

        final_price = calculator.get_final_price("vip", amount)

        # 400 - (400 * 0.15) = 400 - 60 = 340
        assert final_price == pytest.approx(340.00)


class TestEdgeCases:
    """Tests for edge cases and error handling."""

    def test_zero_amount_returns_zero_discount(self) -> None:
        """Zero amount should return zero discount."""
        calculator = DiscountCalculator()

        discount = calculator.calculate_discount("regular", 0.00)

        assert discount == pytest.approx(0.00)

    def test_negative_amount_raises_error(self) -> None:
        """Negative amounts should raise an error."""
        calculator = DiscountCalculator()

        with pytest.raises(ValueError, match="negative"):
            calculator.calculate_discount("regular", -100.00)

    def test_unknown_customer_type_raises_error(self) -> None:
        """Unknown customer types should raise an error."""
        calculator = DiscountCalculator()

        with pytest.raises(ValueError, match="Unknown customer type"):
            calculator.calculate_discount("platinum", 100.00)

    def test_small_decimal_amounts(self) -> None:
        """Discount should handle small decimal amounts correctly."""
        calculator = DiscountCalculator()

        discount = calculator.calculate_discount("premium", 0.50)

        # 0.50 * 0.10 = 0.05
        assert discount == pytest.approx(0.05)


class TestDiscountComparison:
    """Tests comparing discounts across customer types."""

    def test_vip_gets_higher_discount_than_premium(self) -> None:
        """VIP customers should get higher discounts than premium."""
        calculator = DiscountCalculator()
        amount = 100.00

        vip_discount = calculator.calculate_discount("vip", amount)
        premium_discount = calculator.calculate_discount("premium", amount)

        assert vip_discount > premium_discount

    def test_premium_gets_higher_discount_than_regular(self) -> None:
        """Premium customers should get higher discounts than regular."""
        calculator = DiscountCalculator()
        amount = 100.00

        premium_discount = calculator.calculate_discount("premium", amount)
        regular_discount = calculator.calculate_discount("regular", amount)

        assert premium_discount > regular_discount

    def test_discount_rates_are_correct_ratios(self) -> None:
        """Discount rates should maintain correct ratios."""
        calculator = DiscountCalculator()
        amount = 100.00

        regular = calculator.calculate_discount("regular", amount)
        premium = calculator.calculate_discount("premium", amount)
        vip = calculator.calculate_discount("vip", amount)

        # Regular: 5%, Premium: 10%, VIP: 15%
        # Premium should be 2x regular
        assert premium == pytest.approx(regular * 2)
        # VIP should be 3x regular
        assert vip == pytest.approx(regular * 3)
