const rawQuizdown = `
---
shuffleQuestions: true
shuffleAnswers: true
---

# You're building a simple CRUD application for managing blog posts with basic create, read, update, delete operations. Which pattern is most appropriate?

1. [x] Transaction Script
	> Correct! For simple CRUD operations with minimal business logic, Transaction Script is perfect. It's direct, easy to understand, and doesn't add unnecessary complexity.
1. [ ] Domain Model
	> Not quite. Domain Model would be overkill for simple CRUD operations. The complexity of rich domain objects isn't justified when you just need basic data operations.
1. [ ] Service Layer
	> Not quite. While you might use a thin service layer for API exposure, the business logic itself should use Transaction Script for this simple scenario.
1. [ ] All patterns should always be used together
	> Not quite. Different patterns are appropriate for different complexity levels. Simple problems need simple solutions.

# You're building an e-commerce system with complex pricing rules, inventory management, shipping calculations, and promotional discounts that vary by customer type. Which pattern is most appropriate?

1. [x] Domain Model
	> Correct! Complex business rules with many interactions benefit from Domain Model's encapsulation and object collaboration. Each concept (Product, Customer, Discount) can have rich behavior.
1. [ ] Transaction Script
	> Not quite. While you could use Transaction Script, it would become unwieldy with complex rules. Code duplication and hard-to-maintain procedural logic would emerge.
1. [ ] Repository Pattern
	> Not quite. Repository is for data access, not business logic organization. You'd use Repository with Domain Model.
1. [ ] No pattern needed
	> Not quite. Complex business logic definitely needs a pattern to stay maintainable. Without one, you'll have scattered logic and high coupling.

# In the following code, which pattern is being used?

\`\`\`typescript
function processPayment(amount, customerId, paymentMethod) {
  // Validate input
  if (amount <= 0) throw new Error('Invalid amount');
  
  // Fetch customer
  const customer = db.query('SELECT * FROM customers WHERE id = ?', customerId);
  
  // Calculate fees
  const fee = paymentMethod === 'CREDIT_CARD' ? amount * 0.03 : 0;
  
  // Process payment
  const total = amount + fee;
  paymentGateway.charge(paymentMethod, total);
  
  // Save transaction
  db.execute('INSERT INTO transactions ...', [customerId, amount, fee]);
  
  // Send receipt
  emailService.send(customer.email, 'Receipt', \`Total: $\${total}\`);
}
\`\`\`

1. [x] Transaction Script
	> Correct! This is Transaction Script - a procedural function that handles the complete transaction from start to finish with each step performed in sequence.
1. [ ] Domain Model
	> Not quite. This is procedural code, not object-oriented. Domain Model would have objects like Payment, Customer, and Transaction with encapsulated behavior.
1. [ ] Service Layer
	> Not quite. While this could be inside a service, the pattern shown is Transaction Script. Service Layer would coordinate domain objects rather than perform all logic itself.
1. [ ] Data Mapper Pattern
	> Not quite. Data Mapper is about mapping between objects and database tables. This code is showing business logic organization.

# What is the primary benefit of the Service Layer pattern?

1. [x] It provides a clear application boundary and defines transaction boundaries
	> Correct! Service Layer acts as a facade that defines what operations the application can perform and where transactions start/end. This makes it easy for multiple clients to use the same business operations.
1. [ ] It makes the code run faster
	> Not quite. Service Layer is about organization and boundaries, not performance. It might even add a tiny bit of overhead due to the extra layer.
1. [ ] It eliminates the need for domain objects
	> Not quite. Service Layer actually works best when coordinating rich domain objects. It doesn't replace them.
1. [ ] It stores data in the database
	> Not quite. That's the responsibility of the Repository pattern. Service Layer orchestrates, it doesn't handle data access directly.

# Which code demonstrates proper use of Domain Model pattern?

1. [x] A class with \`calculateDiscount()\` method that uses the object's own customer type and order total
	> Correct! This shows encapsulation - the object has both data and behavior. Business logic lives with the data it operates on.
1. [ ] A function that takes all data as parameters and returns a calculated value
	> Not quite. This is Transaction Script - procedural code where functions operate on data passed to them.
1. [ ] A class with only getters and setters, no business logic
	> Not quite. This is an "anemic domain model" anti-pattern. True Domain Model has rich behavior, not just data.
1. [ ] A database table with stored procedures
	> Not quite. This is putting business logic in the database, which violates separation of concerns and isn't Domain Model.

# Your team needs to support both a web application and a mobile app, and both need the same order processing logic. What's the best approach?

1. [x] Create a Service Layer that both clients can use
	> Correct! Service Layer provides a reusable API that multiple clients can call. Both web and mobile can use the same services without duplicating business logic.
1. [ ] Copy the business logic into both applications
	> Not quite. This violates DRY (Don't Repeat Yourself). Changes would need to be made in two places, leading to inconsistencies.
1. [ ] Put all logic in the web app and have mobile call it via HTTP
	> Not quite. While this could work, it's better to have a shared service layer that both can use directly rather than creating an artificial web-to-mobile dependency.
1. [ ] Use Transaction Script separately in each app
	> Not quite. This leads to duplication. Transaction Script is for organizing logic, not for sharing it across applications.

# What is a Data Transfer Object (DTO) and why use it with Service Layer?

1. [x] An object that carries data across application boundaries without exposing domain objects
	> Correct! DTOs protect domain object encapsulation and provide a stable contract for external clients. You can change domain objects without breaking the API.
1. [ ] Another name for domain objects
	> Not quite. DTOs are specifically for data transfer across boundaries. Domain objects contain business logic and should not be exposed directly.
1. [ ] A database table mapping
	> Not quite. That's more related to the Repository pattern. DTOs are about transferring data between layers.
1. [ ] A performance optimization technique
	> Not quite. While DTOs can affect performance, their primary purpose is to decouple the external API from internal domain models.

# You have business logic scattered across controllers, views, and database stored procedures. What's the main problem?

1. [x] Business logic is not properly separated and will be hard to test, reuse, and maintain
	> Correct! This violates separation of concerns. Business logic should live in one place (business layer), not scattered across presentation, view, and data layers.
1. [ ] The code will be too slow
	> Not quite. While scattered logic can have performance implications, the main issue is maintainability and testability.
1. [ ] It uses too many design patterns
	> Not quite. Actually, it's not using patterns properly. Proper patterns would organize the logic better.
1. [ ] Controllers shouldn't exist in applications
	> Not quite. Controllers are fine - they just shouldn't contain business logic. They should delegate to the business layer.

# When would you choose Transaction Script over Domain Model?

1. [x] When business rules are simple, straightforward, and unlikely to change frequently
	> Correct! Transaction Script excels with simple, stable domains where the overhead of object-oriented design isn't justified. Think basic CRUD operations.
1. [ ] When you have complex business rules with many interactions
	> Not quite. Complex rules are exactly when you'd choose Domain Model over Transaction Script. Complexity is where object-oriented design shines.
1. [ ] When you want to use the most advanced pattern available
	> Not quite. Choose patterns based on problem complexity, not on what's most advanced. Simpler problems deserve simpler solutions.
1. [ ] Transaction Script should never be used
	> Not quite. Transaction Script is perfectly valid for simple domains. Not every application needs the complexity of Domain Model.

# In a Service Layer, what should the service do when an operation fails partway through?

1. [x] Roll back any changes made during the transaction to maintain data consistency
	> Correct! Services define transaction boundaries. If an operation fails, everything in that transaction should be rolled back to keep the system in a consistent state.
1. [ ] Save what succeeded and report what failed
	> Not quite. This violates the ACID principle of transactions. Either the whole operation succeeds or none of it does.
1. [ ] Continue trying until it succeeds
	> Not quite. Automatic retry might be appropriate for transient errors, but not for business rule violations. And when retrying fails, you still need rollback.
1. [ ] Delete all related data to clean up
	> Not quite. You don't delete data; you rollback changes to restore the state before the transaction started.
`;

if (typeof window !== 'undefined' && window.quizdown) {
  const quizContainer = document.getElementById('quiz-11-2-3');
  if (quizContainer) {
    window.quizdown.register(quizContainer).then(() => {
      window.quizdown.createApp(rawQuizdown, quizContainer, {
        startOnLoad: true,
        shuffleAnswers: true,
        shuffleQuestions: true,
        nQuestions: 10
      });
    });
  }
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = rawQuizdown;
}
