const rawQuizdown = `
---
shuffleQuestions: true
shuffleAnswers: true
---

# A class that handles user authentication, database queries, and email sending violates which principle?

1. [x] Single Responsibility Principle
	> Correct! The Single Responsibility Principle states that a class should have only one reason to change. This class has at least three responsibilities: authentication, data persistence, and notifications.
1. [ ] Open/Closed Principle
	> Not quite. While this might make the class harder to extend, the main issue is that it has multiple responsibilities.
1. [ ] Liskov Substitution Principle
	> Not quite. LSP deals with inheritance and substitutability of subclasses for their parent classes.
1. [ ] Interface Segregation Principle
	> Not quite. ISP deals with avoiding fat interfaces that force classes to implement methods they don't need.

# You need to add a new payment method to your application. Following OCP, you should:

1. [x] Create a new class that implements the PaymentMethod interface
	> Correct! The Open/Closed Principle says software should be open for extension but closed for modification. Creating a new class that implements an existing interface extends functionality without modifying existing code.
1. [ ] Add a new elif branch to the existing payment processor
	> Not quite. This violates OCP because you're modifying existing code to add new functionality.
1. [ ] Modify the base PaymentMethod class to include the new logic
	> Not quite. This violates OCP by requiring changes to existing, tested code.
1. [ ] Create a global function for the new payment type
	> Not quite. This doesn't follow OCP and creates tight coupling between the payment logic and the rest of the system.

# Which code smell is the most obvious sign of violating the Single Responsibility Principle?

1. [x] A class with more than 200-300 lines or 5-7 methods
	> Correct! While not a hard rule, classes that grow very large often indicate they're handling multiple responsibilities. If you can't describe a class's purpose in one sentence without using "and", it's likely violating SRP.
1. [ ] A class that uses dependency injection
	> Not quite. Dependency injection is actually a good practice that helps with testability and follows SOLID principles.
1. [ ] A class with abstract methods
	> Not quite. Abstract methods are used to define interfaces and are not inherently a code smell.
1. [ ] A class that implements multiple interfaces
	> Not quite. Implementing multiple focused interfaces (like Workable and Eatable) is actually good design following Interface Segregation Principle.

# What is the main benefit of Dependency Injection?

1. [x] It makes code more testable and flexible
	> Correct! Dependency Injection allows you to swap implementations easily, including using mock objects for testing. This makes code more testable and flexible without changing business logic.
1. [ ] It makes code run faster
	> Not quite. DI is about design and maintainability, not performance optimization.
1. [ ] It reduces the number of classes needed
	> Not quite. DI often requires creating more classes (interfaces, implementations), but this improves code organization.
1. [ ] It eliminates the need for interfaces
	> Not quite. Actually, DI works best when depending on abstractions (interfaces), not concrete implementations.

# A Robot class that inherits from Worker but throws NotImplementedError for eat() and sleep() violates:

1. [x] Interface Segregation Principle
	> Correct! The Interface Segregation Principle states that clients should not be forced to depend on interfaces they don't use. The Worker interface is too broad for Robot, forcing it to implement methods it doesn't need.
1. [ ] Single Responsibility Principle
	> Not quite. While the Worker interface might have multiple responsibilities, the main issue is that Robot is forced to implement unnecessary methods.
1. [ ] Open/Closed Principle
	> Not quite. OCP deals with extending functionality without modifying existing code.
1. [ ] Dependency Inversion Principle
	> Not quite. DIP deals with depending on abstractions rather than concrete implementations.

# Which statement best describes the Liskov Substitution Principle?

1. [x] Subclasses must be usable in place of their parent class without breaking the program
	> Correct! LSP ensures that objects of a superclass can be replaced with objects of a subclass without affecting the correctness of the program. The behavior must remain consistent.
1. [ ] Classes should be substituted with interfaces
	> Not quite. This is more related to Dependency Inversion Principle.
1. [ ] All classes should extend a common base class
	> Not quite. This would create unnecessary coupling and isn't required by LSP.
1. [ ] Inheritance should be avoided in favor of composition
	> Not quite. While composition is often preferred ("composition over inheritance"), LSP is about how to use inheritance correctly, not avoid it.

# If you see constructor calls like MySQLDatabase() or SMTPClient() inside your business logic, you're likely violating:

1. [x] Dependency Inversion Principle
	> Correct! DIP states that high-level modules should not depend on low-level modules directly. Dependencies should be injected (provided to you), not created internally. This is the "Hollywood Principle": "don't call us, we'll call you."
1. [ ] Single Responsibility Principle
	> Not quite. While creating dependencies internally might indicate too many responsibilities, the main issue is the tight coupling to concrete implementations.
1. [ ] Open/Closed Principle
	> Not quite. OCP deals with extending functionality without modification.
1. [ ] Liskov Substitution Principle
	> Not quite. LSP deals with inheritance and substitutability of subclasses.

# True or False: Using if/elif chains or switch statements to check object types (like if isinstance(obj, CreditCard)) is usually a sign you should use polymorphism instead.

1. [x] True
	> Correct! Type-checking with isinstance() or type strings is often a code smell indicating you should use polymorphism. Each new type requires modifying the switch statement, violating OCP. Let each type handle its own behavior through interfaces.
1. [ ] False
	> Not quite. While sometimes necessary, frequent type checking usually indicates you should use polymorphic interfaces where each type implements its own behavior.

# The classic Square-Rectangle problem demonstrates which principle?

1. [x] Liskov Substitution Principle
	> Correct! The Square-Rectangle problem shows that just because Square "is a" Rectangle mathematically doesn't mean Square should inherit from Rectangle in code. When Square overrides setWidth() to also change height, it breaks the expected behavior of Rectangle, violating LSP.
1. [ ] Single Responsibility Principle
	> Not quite. While you could argue about responsibilities, the main issue is about inheritance and behavioral compatibility.
1. [ ] Interface Segregation Principle
	> Not quite. ISP deals with interface design, not inheritance hierarchies.
1. [ ] Open/Closed Principle
	> Not quite. OCP deals with extension without modification.

# True or False: If your code is hard to test, you're likely violating SOLID principles somewhere.

1. [x] True
	> Correct! Testability is an excellent indicator of design quality. Can't mock it? → Violating DIP. Need to test multiple concerns? → Violating SRP. Tests break when adding features? → Violating OCP. Test setup requires elaborate mocking? → Violating ISP.
1. [ ] False
	> Not quite. Hard-to-test code is one of the strongest signals of design problems. SOLID principles naturally lead to testable code, and TDD naturally leads to SOLID designs.

# When might you intentionally violate SOLID principles?

1. [x] When you have a stable, small class with only 2 simple cases and no plans to extend
	> Correct! SOLID principles are guidelines, not laws. If you have 2 payment types with no plans for more, a simple if/else beats creating 5 interfaces. Don't over-engineer for current needs. Follow SOLID when you see variation patterns emerging, not speculatively.
1. [ ] When you're working on a production system
	> Not quite. Production systems especially benefit from SOLID principles for maintainability and reliability.
1. [ ] When you're using Python instead of Java
	> Not quite. SOLID principles apply to all object-oriented languages, including Python.
1. [ ] Never - SOLID principles should always be followed strictly
	> Not quite. Pragmatism matters. Premature abstraction is worse than premature optimization. Code should be easy to change when needed, not pre-changed for every possible future.
`;

export { rawQuizdown }
