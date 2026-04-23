const rawQuizdown = `
---
shuffleQuestions: true
shuffleAnswers: true
---

# Which design pattern is demonstrated by this Python code: \`class OrderProcessor:\n    def __init__(self, payment_strategy: PaymentStrategy):\n        self.strategy = payment_strategy\`?

1. [x] Strategy Pattern
	> Correct! The Strategy Pattern defines a family of algorithms, encapsulates each one, and makes them interchangeable. Here, PaymentStrategy is swapped via dependency injection.
1. [ ] Factory Pattern
	> Not quite. Factory Pattern deals with object creation, not swappable algorithms.
1. [ ] Observer Pattern
	> Not quite. Observer Pattern deals with event notification, not algorithm selection.
1. [ ] Decorator Pattern
	> Not quite. Decorator Pattern adds behavior by wrapping, not by swapping strategies.

# This Go code demonstrates which SOLID principle? \`func NewUserService(db Database) *UserService {\n    return &UserService{db: db}\n}\`

1. [x] Dependency Inversion Principle
	> Correct! UserService depends on the Database interface (abstraction), not a concrete implementation like MySQL. Dependencies are injected, following DIP.
1. [ ] Single Responsibility Principle
	> Not quite. While good design, the key here is depending on abstractions (DIP), not single responsibility.
1. [ ] Open/Closed Principle
	> Not quite. OCP deals with extension without modification. This code demonstrates DIP through dependency injection.
1. [ ] Interface Segregation Principle
	> Not quite. ISP deals with interface design. This code demonstrates DIP by depending on abstractions.

# In the Observer Pattern, when \`stock.setPrice(150)\` is called, what happens?

1. [x] All attached observers are automatically notified via their update() method
	> Correct! The Observer Pattern implements one-to-many dependencies. When the subject's state changes, all registered observers are notified automatically.
1. [ ] Only the most recently attached observer is notified
	> Not quite. Observer Pattern notifies ALL attached observers, not just the most recent one.
1. [ ] Observers must manually check for price changes
	> Not quite. Observer Pattern is push-based - the subject pushes notifications to observers.
1. [ ] The price is stored but no notifications occur
	> Not quite. The core purpose of Observer Pattern is automatic notification of state changes.

# This TypeScript code shows which pattern? \`class WhippedCreamDecorator extends BeverageDecorator {\n    cost() { return this._beverage.cost() + 0.70; }\n}\`

1. [x] Decorator Pattern
	> Correct! The Decorator Pattern wraps an object to add behavior. WhippedCreamDecorator wraps a beverage and adds cost/functionality without modifying the base class.
1. [ ] Strategy Pattern
	> Not quite. Strategy swaps entire algorithms. Decorator adds layers of behavior while maintaining the same interface.
1. [ ] Observer Pattern
	> Not quite. Observer handles event notification. This code wraps an object to add behavior.
1. [ ] Factory Pattern
	> Not quite. Factory handles object creation. This code wraps existing objects to extend behavior.

# Identify the pattern: \`factory := GetDatabaseFactory("mysql")\ndb := factory.CreateDatabase(config)\`

1. [x] Factory Pattern
	> Correct! The Factory Pattern abstracts object creation. GetDatabaseFactory returns a factory that creates database instances, decoupling creation from usage.
1. [ ] Builder Pattern
	> Not quite. While Builder also creates objects, Factory Pattern is specifically for creating objects through a common interface based on type.
1. [ ] Strategy Pattern
	> Not quite. Strategy swaps algorithms. This code is about creating objects, not swapping behavior.
1. [ ] Singleton Pattern
	> Not quite. Singleton ensures one instance. This code creates database instances through a factory.

# Which statement about the Strategy Pattern and Open/Closed Principle is TRUE?

1. [x] Adding a new payment strategy requires creating a new class, not modifying existing code
	> Correct! Strategy Pattern embodies OCP: closed for modification (OrderProcessor never changes), open for extension (add new strategies by creating new classes).
1. [ ] Adding a new payment strategy requires modifying the OrderProcessor class
	> Not quite. This would violate OCP. With Strategy Pattern, you create new strategy classes without modifying existing code.
1. [ ] Strategy Pattern violates Open/Closed Principle
	> Not quite. Strategy Pattern is a textbook implementation of OCP - it allows extension without modification.
1. [ ] You must modify the PaymentStrategy interface to add new strategies
	> Not quite. The interface remains unchanged. New strategies implement the existing interface.

# In Python's Decorator Pattern, what does \`MilkDecorator(SugarDecorator(Coffee()))\` create?

1. [x] Coffee with sugar, then milk added (decorators applied inside-out)
	> Correct! Decorators wrap from inside out. Coffee is wrapped by SugarDecorator, then that result is wrapped by MilkDecorator. Description would be "Coffee, Sugar, Milk".
1. [ ] Coffee with milk, then sugar added
	> Not quite. Decorators apply inside-out: Coffee → Sugar → Milk. The innermost is applied first.
1. [ ] A compile-time error because decorators must be applied in alphabetical order
	> Not quite. Decorators can be combined in any order at runtime - that's their power!
1. [ ] Only the milk decorator because it's outermost
	> Not quite. All decorators contribute. Each wraps the previous one, adding its own behavior.

# Why is the Observer Pattern said to demonstrate loose coupling?

1. [x] The subject only knows about the Observer interface, not concrete observer types
	> Correct! The subject depends on the Observer interface (Dependency Inversion), not concrete implementations. It doesn't know or care what observers do with notifications.
1. [ ] Observers can only be attached once
	> Not quite. Observers can be attached/detached dynamically. Loose coupling means minimal dependencies between subject and observers.
1. [ ] The subject creates the observer objects
	> Not quite. Observers are typically created externally and attached. Loose coupling means the subject doesn't create or manage observer lifecycles.
1. [ ] Observers share a single update method
	> Not quite. While they implement the same interface, loose coupling refers to the subject's independence from concrete observer types.

# Which code smell suggests you should use the Factory Pattern?

1. [x] Constructor calls like \`new MySQLDatabase()\` scattered throughout high-level code
	> Correct! When high-level code creates concrete instances directly, it violates DIP. Factory Pattern centralizes creation and allows high-level code to depend on abstractions.
1. [ ] A class with more than 5 methods
	> Not quite. This might suggest SRP violation, not a need for Factory Pattern. Factory addresses object creation, not class size.
1. [ ] Multiple if/else statements checking object types
	> Not quite. This suggests Strategy Pattern (use polymorphism instead of type checks), not Factory Pattern.
1. [ ] Methods that return void
	> Not quite. Return types don't indicate Factory Pattern. Look for tight coupling to concrete classes during object creation.

# What makes Decorator Pattern different from simple inheritance?

1. [x] Decorators allow adding behavior at runtime; inheritance is fixed at compile time
	> Correct! Decorator Pattern provides runtime flexibility to compose behaviors. Inheritance creates a fixed hierarchy at compile time and can lead to class explosion.
1. [ ] Decorators can only be used in Python
	> Not quite. Decorator Pattern is language-agnostic and works in any OO language (Python, Java, Go, TypeScript, etc.).
1. [ ] Inheritance is always better than decorators
	> Not quite. Decorators solve the problem of combinatorial class explosion. With inheritance, you'd need a class for every combination of features.
1. [ ] Decorators modify the base class code
	> Not quite. Decorators NEVER modify the base class - that's the point! They wrap objects to add behavior (OCP).

# A system where \`ChartDisplay\`, \`TableDisplay\`, and \`AlertSystem\` all update when stock price changes uses which pattern?

1. [x] Observer Pattern
	> Correct! Observer Pattern implements one-to-many dependencies. Multiple observers (displays, alerts) react to changes in a subject (stock price) automatically.
1. [ ] Strategy Pattern
	> Not quite. Strategy swaps algorithms. This scenario describes multiple objects reacting to state changes (Observer).
1. [ ] Factory Pattern
	> Not quite. Factory handles creation. This scenario describes notification of state changes (Observer).
1. [ ] Decorator Pattern
	> Not quite. Decorator wraps objects to add behavior. This scenario describes event notification (Observer).
`;

export { rawQuizdown }
