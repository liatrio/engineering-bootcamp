"""
Main demo for Decorator Pattern.

This demo shows how the Decorator Pattern allows adding features to objects
dynamically without modifying their classes (Open/Closed Principle).
"""
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
    print_beverage,
)


def main():
    """Demonstrate the Decorator Pattern with coffee shop orders."""
    
    print("=== Decorator Pattern Demo: Coffee Shop ===")
    print()

    # Example 1: Plain beverages
    print("--- Example 1: Plain Beverages ---")
    print("Simple orders without decorators:")
    print()
    
    coffee = Coffee()
    print_beverage(coffee)
    
    espresso = Espresso()
    print_beverage(espresso)
    
    tea = Tea()
    print_beverage(tea)

    # Example 2: Single decorator
    print("--- Example 2: Single Decorator ---")
    print("Adding one modification:")
    print()
    
    coffee_with_milk = MilkDecorator(Coffee())
    print_beverage(coffee_with_milk)
    
    espresso_with_sugar = SugarDecorator(Espresso())
    print_beverage(espresso_with_sugar)

    # Example 3: Multiple decorators (the power of Decorator Pattern!)
    print("--- Example 3: Multiple Decorators (Chaining) ---")
    print("Building complex beverages by chaining decorators:")
    print()
    
    # Vanilla Latte: Coffee + Milk + Vanilla
    vanilla_latte = VanillaDecorator(MilkDecorator(Coffee()))
    print_beverage(vanilla_latte)
    
    # Caramel Macchiato: Espresso + Milk + Caramel + Whipped Cream
    caramel_macchiato = WhippedCreamDecorator(
        CaramelDecorator(
            MilkDecorator(
                Espresso()
            )
        )
    )
    print_beverage(caramel_macchiato)
    
    # Mocha: Coffee + Milk + Chocolate + Whipped Cream
    mocha = WhippedCreamDecorator(
        ChocolateDecorator(
            MilkDecorator(
                Coffee()
            )
        )
    )
    print_beverage(mocha)

    # Example 4: Building beverages step by step
    print("--- Example 4: Building Step by Step ---")
    print("Demonstrating how decorators wrap each other:")
    print()
    
    print("Step 1: Start with base")
    beverage = Coffee()
    print(f"  {beverage.description()} - ${beverage.cost():.2f}")
    
    print("Step 2: Add milk")
    beverage = MilkDecorator(beverage)
    print(f"  {beverage.description()} - ${beverage.cost():.2f}")
    
    print("Step 3: Add sugar")
    beverage = SugarDecorator(beverage)
    print(f"  {beverage.description()} - ${beverage.cost():.2f}")
    
    print("Step 4: Add whipped cream")
    beverage = WhippedCreamDecorator(beverage)
    print(f"  {beverage.description()} - ${beverage.cost():.2f}")
    print()

    # Example 5: Same decorator multiple times
    print("--- Example 5: Multiple Instances of Same Decorator ---")
    print("You can even apply the same decorator multiple times:")
    print()
    
    extra_strong = ExtraShotDecorator(
        ExtraShotDecorator(
            Espresso()
        )
    )
    print_beverage(extra_strong)

    # Example 6: The Ultimate Coffee
    print("--- Example 6: The Ultimate Coffee ---")
    print("Creating a complex order with many customizations:")
    print()
    
    ultimate_coffee = WhippedCreamDecorator(
        CaramelDecorator(
            ChocolateDecorator(
                VanillaDecorator(
                    MilkDecorator(
                        ExtraShotDecorator(
                            Coffee()
                        )
                    )
                )
            )
        )
    )
    print_beverage(ultimate_coffee)

    # Example 7: Different combinations, same base
    print("--- Example 7: Variations from Same Base ---")
    print("Different customers, different preferences:")
    print()
    
    orders = [
        ("Alice's order", ChocolateDecorator(MilkDecorator(Coffee()))),
        ("Bob's order", SugarDecorator(Coffee())),
        ("Charlie's order", WhippedCreamDecorator(CaramelDecorator(Espresso()))),
        ("Diana's order", VanillaDecorator(MilkDecorator(Tea()))),
    ]
    
    for customer, order in orders:
        print(f"{customer}:")
        print(f"  {order.description()}")
        print(f"  Price: ${order.cost():.2f}")
        print()

    # Summary
    print("=" * 60)
    print("Demo completed!")
    print("=" * 60)
    print()
    print("Key Takeaway:")
    print("The base beverage classes (Coffee, Espresso, Tea) were NEVER modified.")
    print("We added features by creating decorator classes that wrap beverages.")
    print("This is the Open/Closed Principle in action:")
    print("  - CLOSED for modification (never change Coffee class)")
    print("  - OPEN for extension (add unlimited decorators)")
    print()
    print("Benefits:")
    print("  1. Add features without modifying existing classes")
    print("  2. Combine features in any order at runtime")
    print("  3. Each decorator has single responsibility")
    print("  4. Avoid combinatorial class explosion")


if __name__ == "__main__":
    main()
