"""
Unit tests for Decorator Pattern implementation.

These tests verify that decorators can be combined in any order and that
the base beverage classes remain unchanged (Open/Closed Principle).
"""
import sys
from pathlib import Path

# Add src directory to path
sys.path.insert(0, str(Path(__file__).parent.parent / "src"))

import pytest
from decorator import (
    Coffee,
    Espresso,
    Tea,
    MilkDecorator,
    SugarDecorator,
    WhippedCreamDecorator,
    VanillaDecorator,
    CaramelDecorator,
    ChocolateDecorator,
    ExtraShotDecorator,
)


class TestBaseBeverages:
    """Test the base beverage classes."""
    
    def test_coffee_cost(self):
        """Test coffee base cost."""
        coffee = Coffee()
        assert coffee.cost() == 2.00
    
    def test_coffee_description(self):
        """Test coffee description."""
        coffee = Coffee()
        assert coffee.description() == "Coffee"
    
    def test_espresso_cost(self):
        """Test espresso base cost."""
        espresso = Espresso()
        assert espresso.cost() == 2.50
    
    def test_espresso_description(self):
        """Test espresso description."""
        espresso = Espresso()
        assert espresso.description() == "Espresso"
    
    def test_tea_cost(self):
        """Test tea base cost."""
        tea = Tea()
        assert tea.cost() == 1.75
    
    def test_tea_description(self):
        """Test tea description."""
        tea = Tea()
        assert tea.description() == "Tea"


class TestSingleDecorators:
    """Test individual decorators."""
    
    def test_milk_decorator(self):
        """Test milk decorator adds cost and description."""
        coffee = Coffee()
        with_milk = MilkDecorator(coffee)
        
        assert with_milk.cost() == 2.50  # 2.00 + 0.50
        assert with_milk.description() == "Coffee, Milk"
    
    def test_sugar_decorator(self):
        """Test sugar decorator."""
        coffee = Coffee()
        with_sugar = SugarDecorator(coffee)
        
        assert with_sugar.cost() == 2.30  # 2.00 + 0.30
        assert with_sugar.description() == "Coffee, Sugar"
    
    def test_whipped_cream_decorator(self):
        """Test whipped cream decorator."""
        coffee = Coffee()
        with_cream = WhippedCreamDecorator(coffee)
        
        assert with_cream.cost() == 2.70  # 2.00 + 0.70
        assert with_cream.description() == "Coffee, Whipped Cream"
    
    def test_vanilla_decorator(self):
        """Test vanilla decorator."""
        coffee = Coffee()
        with_vanilla = VanillaDecorator(coffee)
        
        assert with_vanilla.cost() == 2.60  # 2.00 + 0.60
        assert with_vanilla.description() == "Coffee, Vanilla"
    
    def test_caramel_decorator(self):
        """Test caramel decorator."""
        espresso = Espresso()
        with_caramel = CaramelDecorator(espresso)
        
        assert with_caramel.cost() == 3.15  # 2.50 + 0.65
        assert with_caramel.description() == "Espresso, Caramel"
    
    def test_chocolate_decorator(self):
        """Test chocolate decorator."""
        coffee = Coffee()
        with_chocolate = ChocolateDecorator(coffee)
        
        assert with_chocolate.cost() == 2.75  # 2.00 + 0.75
        assert with_chocolate.description() == "Coffee, Chocolate"
    
    def test_extra_shot_decorator(self):
        """Test extra shot decorator."""
        espresso = Espresso()
        with_shot = ExtraShotDecorator(espresso)
        
        assert with_shot.cost() == 3.50  # 2.50 + 1.00
        assert with_shot.description() == "Espresso, Extra Shot"


class TestMultipleDecorators:
    """Test combining multiple decorators."""
    
    def test_two_decorators(self):
        """Test chaining two decorators."""
        coffee = Coffee()
        with_milk_and_sugar = SugarDecorator(MilkDecorator(coffee))
        
        assert with_milk_and_sugar.cost() == 2.80  # 2.00 + 0.50 + 0.30
        assert with_milk_and_sugar.description() == "Coffee, Milk, Sugar"
    
    def test_three_decorators(self):
        """Test chaining three decorators."""
        coffee = Coffee()
        latte = WhippedCreamDecorator(
            VanillaDecorator(
                MilkDecorator(coffee)
            )
        )
        
        assert latte.cost() == 3.80  # 2.00 + 0.50 + 0.60 + 0.70
        assert latte.description() == "Coffee, Milk, Vanilla, Whipped Cream"
    
    def test_order_matters_for_description(self):
        """Test that decorator order affects description."""
        coffee1 = VanillaDecorator(MilkDecorator(Coffee()))
        coffee2 = MilkDecorator(VanillaDecorator(Coffee()))
        
        # Costs are the same
        assert coffee1.cost() == coffee2.cost()
        
        # But descriptions are different
        assert coffee1.description() == "Coffee, Milk, Vanilla"
        assert coffee2.description() == "Coffee, Vanilla, Milk"
    
    def test_same_decorator_multiple_times(self):
        """Test applying the same decorator multiple times."""
        espresso = Espresso()
        double_shot = ExtraShotDecorator(ExtraShotDecorator(espresso))
        
        assert double_shot.cost() == 4.50  # 2.50 + 1.00 + 1.00
        assert double_shot.description() == "Espresso, Extra Shot, Extra Shot"


class TestComplexBeverages:
    """Test complex beverage combinations."""
    
    def test_vanilla_latte(self):
        """Test vanilla latte recipe."""
        vanilla_latte = VanillaDecorator(MilkDecorator(Coffee()))
        
        assert vanilla_latte.cost() == 3.10  # 2.00 + 0.50 + 0.60
        assert vanilla_latte.description() == "Coffee, Milk, Vanilla"
    
    def test_mocha(self):
        """Test mocha recipe."""
        mocha = WhippedCreamDecorator(
            ChocolateDecorator(
                MilkDecorator(Coffee())
            )
        )
        
        assert mocha.cost() == 3.95  # 2.00 + 0.50 + 0.75 + 0.70
        assert mocha.description() == "Coffee, Milk, Chocolate, Whipped Cream"
    
    def test_caramel_macchiato(self):
        """Test caramel macchiato recipe."""
        caramel_macchiato = WhippedCreamDecorator(
            CaramelDecorator(
                MilkDecorator(Espresso())
            )
        )
        
        assert caramel_macchiato.cost() == 4.35  # 2.50 + 0.50 + 0.65 + 0.70
        assert caramel_macchiato.description() == "Espresso, Milk, Caramel, Whipped Cream"


class TestOpenClosedPrinciple:
    """Tests demonstrating the Open/Closed Principle."""
    
    def test_adding_new_decorator_does_not_modify_base(self):
        """
        Verify that adding new decorators does not require modifying
        base beverage classes (Open/Closed Principle).
        """
        # Base coffee works
        coffee = Coffee()
        assert coffee.cost() == 2.00
        
        # Adding decorators doesn't change the base class
        decorated = MilkDecorator(coffee)
        assert coffee.cost() == 2.00  # Base unchanged
        assert decorated.cost() == 2.50  # Decorator adds cost
        
        # We can add more decorators without touching Coffee class
        more_decorated = SugarDecorator(decorated)
        assert coffee.cost() == 2.00  # Base still unchanged
        assert more_decorated.cost() == 2.80
        
        # Coffee class code remains unchanged - it's closed for modification
        # but we extended functionality by adding decorators - open for extension
    
    def test_unlimited_combinations_without_modifying_classes(self):
        """Test that we can create unlimited combinations without new classes."""
        # All these combinations work without creating new beverage classes
        combinations = [
            MilkDecorator(Coffee()),
            SugarDecorator(MilkDecorator(Coffee())),
            WhippedCreamDecorator(SugarDecorator(MilkDecorator(Coffee()))),
            VanillaDecorator(Coffee()),
            ChocolateDecorator(MilkDecorator(Coffee())),
            CaramelDecorator(WhippedCreamDecorator(Coffee())),
        ]
        
        # All work without modifying base classes
        for combo in combinations:
            assert combo.cost() > 0
            assert len(combo.description()) > 0
        
        # We achieved this without creating CoffeeWithMilk, CoffeeWithSugar, etc.
        # This avoids the combinatorial explosion of subclasses!
