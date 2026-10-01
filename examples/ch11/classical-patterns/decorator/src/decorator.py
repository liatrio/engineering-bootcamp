"""
Decorator Pattern Example - Coffee Shop

Demonstrates the Decorator Pattern by implementing a coffee shop system where
customers can customize their beverages with various add-ons. This pattern embodies
the Open/Closed Principle: the base Beverage is closed for modification (we never
change Coffee or Espresso), but open for extension (we can add unlimited decorators).
"""
from abc import ABC, abstractmethod


class Beverage(ABC):
    """
    Abstract component defining the interface for beverages.
    Both concrete beverages and decorators must implement this interface.
    """
    
    @abstractmethod
    def cost(self) -> float:
        """Return the cost of this beverage."""
        pass
    
    @abstractmethod
    def description(self) -> str:
        """Return a description of this beverage."""
        pass


# ============================================================================
# Concrete Components (Base Beverages)
# ============================================================================

class Coffee(Beverage):
    """Basic coffee beverage."""
    
    def cost(self) -> float:
        return 2.00
    
    def description(self) -> str:
        return "Coffee"


class Espresso(Beverage):
    """Espresso beverage."""
    
    def cost(self) -> float:
        return 2.50
    
    def description(self) -> str:
        return "Espresso"


class Tea(Beverage):
    """Tea beverage."""
    
    def cost(self) -> float:
        return 1.75
    
    def description(self) -> str:
        return "Tea"


# ============================================================================
# Decorator Base Class
# ============================================================================

class BeverageDecorator(Beverage):
    """
    Abstract decorator class that wraps a Beverage.
    
    This class maintains a reference to a Beverage object and delegates
    to it. Concrete decorators extend this class to add behavior.
    
    Key characteristic: A decorator IS-A Beverage and HAS-A Beverage.
    """
    
    def __init__(self, beverage: Beverage):
        self._beverage = beverage
    
    @abstractmethod
    def cost(self) -> float:
        """Subclasses must implement to add their cost."""
        pass
    
    @abstractmethod
    def description(self) -> str:
        """Subclasses must implement to add their description."""
        pass


# ============================================================================
# Concrete Decorators (Add-ons)
# ============================================================================

class MilkDecorator(BeverageDecorator):
    """Add milk to a beverage."""
    
    def cost(self) -> float:
        return self._beverage.cost() + 0.50
    
    def description(self) -> str:
        return self._beverage.description() + ", Milk"


class SugarDecorator(BeverageDecorator):
    """Add sugar to a beverage."""
    
    def cost(self) -> float:
        return self._beverage.cost() + 0.30
    
    def description(self) -> str:
        return self._beverage.description() + ", Sugar"


class WhippedCreamDecorator(BeverageDecorator):
    """Add whipped cream to a beverage."""
    
    def cost(self) -> float:
        return self._beverage.cost() + 0.70
    
    def description(self) -> str:
        return self._beverage.description() + ", Whipped Cream"


class VanillaDecorator(BeverageDecorator):
    """Add vanilla syrup to a beverage."""
    
    def cost(self) -> float:
        return self._beverage.cost() + 0.60
    
    def description(self) -> str:
        return self._beverage.description() + ", Vanilla"


class CaramelDecorator(BeverageDecorator):
    """Add caramel syrup to a beverage."""
    
    def cost(self) -> float:
        return self._beverage.cost() + 0.65
    
    def description(self) -> str:
        return self._beverage.description() + ", Caramel"


class ChocolateDecorator(BeverageDecorator):
    """Add chocolate to a beverage."""
    
    def cost(self) -> float:
        return self._beverage.cost() + 0.75
    
    def description(self) -> str:
        return self._beverage.description() + ", Chocolate"


class ExtraShotDecorator(BeverageDecorator):
    """Add an extra shot of espresso to a beverage."""
    
    def cost(self) -> float:
        return self._beverage.cost() + 1.00
    
    def description(self) -> str:
        return self._beverage.description() + ", Extra Shot"


# ============================================================================
# Helper Functions
# ============================================================================

def print_beverage(beverage: Beverage) -> None:
    """Print a nicely formatted beverage order."""
    print(f"  {beverage.description()}")
    print(f"  Price: ${beverage.cost():.2f}")
    print()
