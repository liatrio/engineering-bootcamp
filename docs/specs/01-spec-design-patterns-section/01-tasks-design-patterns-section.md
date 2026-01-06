# 01-tasks-design-patterns-section.md

This task list implements the Design Patterns subsections (11.2.2 - 11.2.5) for Chapter 11 of the DevOps Bootcamp, building on the completed SOLID Principles foundation (11.2.1).

## Tasks

### [ ] 1.0 Create Data Layer Patterns Documentation and Examples (11.2.2)

Implement comprehensive documentation for Repository, Active Record, and Concurrency patterns (Optimistic/Pessimistic Locking) with working Go examples and an interactive quiz.

#### 1.0 Proof Artifact(s)

- Documentation: `docs/11-application-development/11.2.2-data-layer-patterns.md` exists with complete content including front-matter, pattern explanations, decision guidance, and exercises
- Repository Pattern: `examples/ch11/data-patterns/repository/` contains working Go implementation with README, tests, and clear interface abstraction
- Active Record Pattern: `examples/ch11/data-patterns/active-record/` contains working Go implementation with README demonstrating domain objects with encapsulated data access
- Optimistic Locking: `examples/ch11/data-patterns/concurrency/optimistic/` contains SQLite-based demonstration with README showing version-based conflict detection
- Pessimistic Locking: `examples/ch11/data-patterns/concurrency/pessimistic/` contains SQLite-based demonstration with README showing exclusive access control
- Quiz: `src/quizzes/chapter-11/11.2.2/data-layer-patterns-quiz.js` exists with pattern recognition questions following quizdown format
- CLI: `go test ./...` passes in all example directories demonstrates working implementations
- Screenshot: Quiz renders correctly in Docsify demonstrates integration

#### 1.0 Tasks

- [ ] 1.1 Create documentation file `docs/11-application-development/11.2.2-data-layer-patterns.md` with front-matter (category: Application Development, technologies: Go/SQLite/Design Patterns, estReadingMinutes: 45, exercise definition)
- [ ] 1.2 Write Repository Pattern section explaining interface abstraction over data access, benefits (testability, flexibility), and when to use it
- [ ] 1.3 Write Active Record Pattern section explaining domain objects with encapsulated data access methods and when to use it
- [ ] 1.4 Write pattern comparison section with decision guidance based on domain complexity, testability requirements, and team preferences
- [ ] 1.5 Write Optimistic Locking section explaining version-based conflict detection with multi-user scenario examples
- [ ] 1.6 Write Pessimistic Locking section explaining exclusive access control with multi-user scenario examples
- [ ] 1.7 Write anti-patterns section showing problems with direct data access mixed with business logic
- [ ] 1.8 Add self-directed refactoring exercise description for converting direct data access to Repository pattern
- [ ] 1.9 Create Repository Pattern Go example in `examples/ch11/data-patterns/repository/` with main.go, go.mod, repository.go (interface + implementation), README.md, and repository_test.go
- [ ] 1.10 Create Active Record Pattern Go example in `examples/ch11/data-patterns/active-record/` with main.go, go.mod, user.go (domain object with data access methods), README.md, and user_test.go
- [ ] 1.11 Create Optimistic Locking Go example in `examples/ch11/data-patterns/concurrency/optimistic/` with main.go demonstrating multi-user simulation, SQLite version checking, README.md, and tests
- [ ] 1.12 Create Pessimistic Locking Go example in `examples/ch11/data-patterns/concurrency/pessimistic/` with main.go demonstrating exclusive locking, SQLite transaction control, README.md, and tests
- [ ] 1.13 Create interactive quiz `src/quizzes/chapter-11/11.2.2/data-layer-patterns-quiz.js` with 6-8 questions covering pattern recognition, concurrency scenarios, and when to use each pattern
- [ ] 1.14 Verify all Go examples run successfully with `go run main.go` and tests pass with `go test ./...`
- [ ] 1.15 Embed quiz in documentation using Docsify quiz syntax and verify it renders correctly with `npm start`

### [ ] 2.0 Create Business Logic Patterns Documentation and Examples (11.2.3)

Implement comprehensive documentation for Transaction Script, Domain Model, and Service Layer patterns with working TypeScript examples and an interactive quiz.

#### 2.0 Proof Artifact(s)

- Documentation: `docs/11-application-development/11.2.3-business-logic-patterns.md` exists with complete content including front-matter, pattern explanations, comparative analysis, and exercises
- Transaction Script: `examples/ch11/business-patterns/transaction-script/` contains working TypeScript implementation with README showing procedural organization
- Domain Model: `examples/ch11/business-patterns/domain-model/` contains working TypeScript implementation with README showing OOP encapsulation
- Comparative Example: `examples/ch11/business-patterns/comparison/` contains same business problem solved with both patterns, with README explaining trade-offs
- Service Layer: `examples/ch11/business-patterns/service-layer/` contains working TypeScript implementation with README demonstrating orchestration
- Quiz: `src/quizzes/chapter-11/11.2.3/business-logic-patterns-quiz.js` exists with decision-making questions following quizdown format
- CLI: `npm test` passes in all example directories demonstrates working implementations
- Screenshot: Quiz renders correctly in Docsify demonstrates integration

#### 2.0 Tasks

- [ ] 2.1 Create documentation file `docs/11-application-development/11.2.3-business-logic-patterns.md` with front-matter (category: Application Development, technologies: TypeScript/Design Patterns, estReadingMinutes: 30, exercise definition)
- [ ] 2.2 Write Transaction Script Pattern section explaining procedural organization of business logic, benefits (simplicity, directness), and when to use it (simple domains)
- [ ] 2.3 Write Domain Model Pattern section explaining object-oriented encapsulation of business rules, benefits (rich behavior, maintainability), and when to use it (complex domains)
- [ ] 2.4 Write Service Layer Pattern section explaining orchestration of domain objects, transaction boundaries, and API exposure patterns
- [ ] 2.5 Write comparative analysis section contrasting Transaction Script vs Domain Model with decision criteria based on complexity, team experience, and maintenance expectations
- [ ] 2.6 Write anti-patterns section showing business logic scattered across layers (controllers, views, data access)
- [ ] 2.7 Add self-directed exercise description for implementing business logic using pattern appropriate for given complexity level
- [ ] 2.8 Create Transaction Script TypeScript example in `examples/ch11/business-patterns/transaction-script/` with package.json, tsconfig.json, src/order-processing.ts (procedural functions), src/main.ts, README.md, and tests
- [ ] 2.9 Create Domain Model TypeScript example in `examples/ch11/business-patterns/domain-model/` with package.json, tsconfig.json, src/order.ts, src/customer.ts (rich domain objects), src/main.ts, README.md, and tests
- [ ] 2.10 Create comparative example in `examples/ch11/business-patterns/comparison/` showing same business problem (e.g., order discounting) solved with both Transaction Script and Domain Model approaches, with detailed README comparing trade-offs
- [ ] 2.11 Create Service Layer TypeScript example in `examples/ch11/business-patterns/service-layer/` with package.json, tsconfig.json, src/services/order-service.ts (orchestration), src/domain/ (domain objects), src/main.ts, README.md, and tests
- [ ] 2.12 Create interactive quiz `src/quizzes/chapter-11/11.2.3/business-logic-patterns-quiz.js` with 6-8 questions covering pattern selection decisions, recognizing patterns in code, and understanding trade-offs
- [ ] 2.13 Verify all TypeScript examples run successfully with `npm run start` and tests pass with `npm test`
- [ ] 2.14 Embed quiz in documentation using Docsify quiz syntax and verify it renders correctly with `npm start`

### [ ] 3.0 Create Classical GoF Patterns Documentation and Examples (11.2.4)

Implement comprehensive documentation for Strategy, Factory, Observer, and Decorator patterns with working examples distributed across languages, explicit SOLID connections, and an interactive quiz.

#### 3.0 Proof Artifact(s)

- Documentation: `docs/11-application-development/11.2.4-classical-patterns.md` exists with complete content including front-matter, pattern explanations organized by category (Creational/Behavioral/Structural), SOLID connections, and exercises
- Strategy Pattern: `examples/ch11/classical-patterns/strategy/` contains working implementation with README and explicit connection to Open/Closed Principle
- Factory Pattern: `examples/ch11/classical-patterns/factory/` contains working implementation with README and explicit connection to Dependency Inversion Principle
- Observer Pattern: `examples/ch11/classical-patterns/observer/` contains working implementation with README demonstrating event-driven communication
- Decorator Pattern: `examples/ch11/classical-patterns/decorator/` contains working implementation with README and explicit connection to Open/Closed Principle
- Quiz: `src/quizzes/chapter-11/11.2.4/classical-patterns-quiz.js` exists with multi-language pattern recognition questions following quizdown format
- CLI: Tests pass in all example directories (using appropriate test command per language) demonstrates working implementations
- Diff: Each pattern README includes explicit cross-reference to relevant section in 11.2.1 demonstrates SOLID integration

#### 3.0 Tasks

- [ ] 3.1 Create documentation file `docs/11-application-development/11.2.4-classical-patterns.md` with front-matter (category: Application Development, technologies: Python/Go/TypeScript/Design Patterns, estReadingMinutes: 45, exercise definition)
- [ ] 3.2 Write introduction explaining Gang of Four patterns, their organization (Creational/Behavioral/Structural), and focus on patterns most relevant to SOLID principles
- [ ] 3.3 Write Strategy Pattern section (Behavioral) explaining swappable algorithms, explicit connection to Open/Closed Principle (extending behavior without modification), and cross-reference to 11.2.1
- [ ] 3.4 Write Factory Pattern section (Creational) explaining object creation abstraction, explicit connection to Dependency Inversion Principle (depending on abstractions), and cross-reference to 11.2.1
- [ ] 3.5 Write Observer Pattern section (Behavioral) explaining event-driven communication, one-to-many dependencies, and use cases (UI updates, event systems)
- [ ] 3.6 Write Decorator Pattern section (Structural) explaining dynamic behavior extension, explicit connection to Open/Closed Principle (adding responsibilities without modification), and cross-reference to 11.2.1
- [ ] 3.7 Add pattern recognition section with guidance on identifying these patterns in production codebases
- [ ] 3.8 Add self-directed exercise description for students to identify patterns in a production codebase of their choice
- [ ] 3.9 Create Strategy Pattern Python example in `examples/ch11/classical-patterns/strategy/` with pyproject.toml, src/ (different algorithm implementations), README.md with OCP connection, and tests
- [ ] 3.10 Create Factory Pattern Go example in `examples/ch11/classical-patterns/factory/` with go.mod, factory.go (creation abstraction), README.md with DIP connection, and tests
- [ ] 3.11 Create Observer Pattern TypeScript example in `examples/ch11/classical-patterns/observer/` with package.json, tsconfig.json, src/ (subject/observer implementation), README.md, and tests
- [ ] 3.12 Create Decorator Pattern Python example in `examples/ch11/classical-patterns/decorator/` with pyproject.toml, src/ (base component + decorators), README.md with OCP connection, and tests
- [ ] 3.13 Create interactive quiz `src/quizzes/chapter-11/11.2.4/classical-patterns-quiz.js` with 8-10 questions covering pattern recognition from code snippets in multiple languages, SOLID connections, and when to use each pattern
- [ ] 3.14 Verify Strategy and Decorator Python examples run successfully with `uv run main.py` and tests pass with `uv run pytest`
- [ ] 3.15 Verify Factory Go example runs successfully with `go run main.go` and tests pass with `go test ./...`
- [ ] 3.16 Verify Observer TypeScript example runs successfully with `npm run start` and tests pass with `npm test`
- [ ] 3.17 Embed quiz in documentation using Docsify quiz syntax and verify it renders correctly with `npm start`

### [ ] 4.0 Create Integrated Refactoring Exercise (11.2.5)

Implement comprehensive refactoring exercise with TypeScript e-commerce starter application containing deliberate design flaws (God Object, if/else chains, tight coupling), comprehensive behavior-based test suite, guided analysis, and reference solution demonstrating Strategy, Repository, and Service Layer patterns.

#### 4.0 Proof Artifact(s)

- Documentation: `docs/11-application-development/11.2.5-refactoring-exercise.md` exists with 5-phase structure (Analysis/Planning/Implementation/Verification/Comparison), front-matter, setup steps, and 180-minute exercise estimate
- Research Notes: `examples/ch11/refactoring-exercise/research-notes.md` documents OSS project evaluation and justification for custom TypeScript build based on pedagogical control and licensing freedom
- Starter Application: `examples/ch11/refactoring-exercise/starter/` contains TypeScript application with package.json, tsconfig.json, jest.config.js, src/routes.ts (450-line God Object), behavior-based tests, and README
- Analysis Guide: `examples/ch11/refactoring-exercise/analysis-guide.md` includes metrics collection, SOLID violations with specific line numbers, code smell checklist, and phase-by-phase refactoring roadmap
- Starter Tests Pass: `cd starter && npm test` passes all tests demonstrating baseline functionality with order creation, payment processing (CreditCard/PayPal/Bitcoin), and inventory management
- Solution Application: `examples/ch11/refactoring-exercise/solution/` contains refactored implementation with strategies/, repositories/, services/, factories/, routes/ directories and same test suite
- Solution Tests Pass: `cd solution && npm test` passes all tests with SAME test files demonstrating behavior preservation
- Extension Test: Adding ApplePayPayment.ts in solution requires zero modifications to existing files demonstrating Open/Closed Principle
- Metrics Documented: Solution README includes before/after metrics (routes.ts: 450 lines → 20 lines, files: 4 → 20+, to add Apple Pay: modify 3 files → create 1 file)
- CLI: `npm start` serves documentation with 11.2.5 accessible and properly formatted

#### 4.0 Tasks

**Research and Decision (2 tasks)**
- [ ] 4.1 Research open-source e-commerce TypeScript/Node.js applications evaluating 3-5 candidates using scoring rubric: Technical Fit (40pts), Educational Fit (30pts), Practical (30pts), threshold 70+ for OSS use
- [ ] 4.2 Create `research-notes.md` documenting evaluated projects, scoring, and decision rationale (recommended: build custom for pedagogical control, licensing, bootcamp integration)

**Starter Application (6 tasks)**
- [ ] 4.3 Create starter structure with package.json (express, sqlite3, typescript, jest, supertest), tsconfig.json (strict), jest.config.js, schema.sql (products, customers, orders, order_items with seed data)
- [ ] 4.4 Create `starter/src/` with index.ts, routes.ts (450-line God Object with POST /orders), database.ts, types.ts (Product, Customer, Order, OrderItem, CreateOrderRequest interfaces)
- [ ] 4.5 Implement anti-patterns in routes.ts: direct validation (lines 15-25), if/else chains for payment types - credit_card (3%), paypal (3.5%), bitcoin ($1.50) (lines 50-70), if/else chains for shipping - standard ($5.99, 7d), express ($12.99, 3d), overnight ($24.99, 1d) (lines 75-90), direct SQLite queries (lines 30-110)
- [ ] 4.6 Create behavior-based test suite in `starter/tests/` with order-creation.test.ts, payment.test.ts (3 payment types), inventory.test.ts validating outcomes not implementation
- [ ] 4.7 Create `starter/README.md` with sections: Overview, Setup (npm install/db:init/dev), Running Tests, Testing API (curl example), Your Task (reference analysis-guide.md), Success Criteria
- [ ] 4.8 Create `analysis-guide.md` with Step 1: Metrics (LOC/function count commands), Step 2: SOLID Violations (SRP/OCP/DIP with line numbers), Step 3: Code Smells (God Object, if/else chains), Step 4: Testability, Step 5: Refactoring Roadmap (5 phases), Step 6: Verification checklist

**Reference Solution (8 tasks)**
- [ ] 4.9 Create solution structure with src/strategies/payment/ (IPaymentStrategy.ts, CreditCardPayment.ts, PayPalPayment.ts, BitcoinPayment.ts) and src/strategies/shipping/ (IShippingStrategy.ts, StandardShipping.ts, ExpressShipping.ts, OvernightShipping.ts)
- [ ] 4.10 Create Repository Pattern in solution/src/repositories/ with IOrderRepository.ts, OrderRepository.ts (SQLite impl), IProductRepository.ts, ProductRepository.ts
- [ ] 4.11 Create Service Layer in solution/src/services/ with ValidationService.ts, InventoryService.ts (uses ProductRepository), OrderService.ts (orchestrates validation, inventory, payment strategy, shipping strategy, repositories)
- [ ] 4.12 Create Factory Pattern in solution/src/factories/ with PaymentStrategyFactory.ts (getStrategy, registerStrategy), ShippingStrategyFactory.ts
- [ ] 4.13 Create thin HTTP layer in solution/src/routes/orderRoutes.ts (20 lines: parse request, call orderService.createOrder(), format response, handle errors)
- [ ] 4.14 Create dependency injection wiring in solution/src/index.ts (instantiate Database, repositories, factories, services, routes with injection)
- [ ] 4.15 Copy test suite from starter to solution/tests/ (SAME files: order-creation.test.ts, payment.test.ts, inventory.test.ts with NO modifications)
- [ ] 4.16 Create `solution/README.md` with Architecture Overview (before/after diagrams), Pattern Applications (Strategy: OCP with Apple Pay, Repository: DIP with PostgreSQL swap, Service Layer: SRP with testability), Before/After Metrics (450 lines → 20 lines)

**Documentation (11 tasks)**
- [ ] 4.17 Create `docs/11-application-development/11.2.5-refactoring-exercise.md` with front-matter (category: Software Development, estReadingMinutes: 20, exercises: 180 minutes, technologies: TypeScript/Design Patterns)
- [ ] 4.18 Write Overview, Learning Objectives (identify SOLID violations, apply patterns, verify behavior, measure success), Prerequisites (links to 11.2.1-11.2.4), Domain Description (e-commerce features, starter architecture diagram)
- [ ] 4.19 Write Phase 1: Code Analysis (Task 1.1: Complete analysis-guide.md, Task 1.2: Draw architecture diagram, Task 1.3: Document Apple Pay changes required)
- [ ] 4.20 Write Phase 2: Planning (Task 2.1: Define IPaymentStrategy/IShippingStrategy/IOrderRepository/IProductRepository, Task 2.2: Plan refactoring order, Task 2.3: Set up directories)
- [ ] 4.21 Write Phase 3: Implementation (Tasks 3.1-3.6: Strategy Pattern for payments/shipping, Repository Pattern, Service Layer, thin routes, DI wiring with test-your-progress checkpoints)
- [ ] 4.22 Write Phase 4: Verification (Task 4.1: Run tests, Task 4.2: Compare metrics, Task 4.3: Extension Test for Apple Pay, Task 4.4: Testability Assessment)
- [ ] 4.23 Write Phase 5: Comparing Solutions (Task 5.1: Review reference, Task 5.2: Compare architectures, Task 5.3: Diff key files)
- [ ] 4.24 Add Git Workflow (8-commit strategy, refactor: prefix templates with SOLID principles/patterns/benefits/tests)
- [ ] 4.25 Add Success Criteria checklist (tests pass, routes.ts <50 lines, Apple Pay one file, test OrderService without database, no if/else chains)
- [ ] 4.26 Add Reflection Questions (5 questions: improvements, complexity trade-offs, real-world, pattern selection, testing impact)
- [ ] 4.27 Add Additional Challenges (Challenge 1: Apple Pay 4% fee, Challenge 2: Discount strategy, Challenge 3: PostgreSQL swap, Challenge 4: API v2 versioning)

**Verification (3 tasks)**
- [ ] 4.28 Verify starter: Run `cd starter && npm install && npm test` confirming all tests pass (exit 0) with order creation, payment calculations, inventory management
- [ ] 4.29 Verify solution: Run `cd solution && npm install && npm test` confirming all tests pass with SAME test files demonstrating behavior preservation
- [ ] 4.30 Verify extension: Create `solution/src/strategies/payment/ApplePayPayment.ts` with 4% fee, register in factory, run tests confirming zero modifications to existing files (OCP demonstrated)

### [ ] 5.0 Update Navigation and Integration

Update sidebar navigation to include all new subsections and verify end-to-end integration of documentation, examples, and quizzes.

#### 5.0 Proof Artifact(s)

- Diff: `docs/_sidebar.md` includes entries for 11.2.2, 11.2.3, 11.2.4, and 11.2.5 under the Design Patterns section demonstrates navigation completeness
- CLI: `npm start` successfully builds and serves documentation with all new pages accessible demonstrates Docsify integration
- Screenshot: All new pages render correctly with proper formatting, front-matter metadata, and quiz integration demonstrates quality
- CLI: `npm run lint` passes on all new markdown files demonstrates adherence to style guidelines
- CLI: `npm run refresh-front-matter` successfully consolidates new front-matter into `docs/README.md` demonstrates metadata integration

#### 5.0 Tasks

- [ ] 5.1 Update `docs/_sidebar.md` to add new subsections under "11.2 - Design Patterns": 11.2.2 Data Layer Patterns, 11.2.3 Business Logic Patterns, 11.2.4 Classical Patterns, 11.2.5 Refactoring Exercise
- [ ] 5.2 Verify all four new documentation pages (11.2.2, 11.2.3, 11.2.4, 11.2.5) are accessible through sidebar navigation with `npm start`
- [ ] 5.3 Verify all documentation pages render correctly with proper markdown formatting, images (if any), embedded quizzes, and code examples
- [ ] 5.4 Run `npm run lint` on all new markdown files and fix any linting issues
- [ ] 5.5 Run `npm run refresh-front-matter` to consolidate new exercise metadata into `docs/README.md` and verify successful integration
- [ ] 5.6 Verify front-matter data appears correctly in the master record with proper categories (Application Development) and technologies (Go, TypeScript, Python, SQLite, Design Patterns)
- [ ] 5.7 Test complete documentation site end-to-end by navigating through all new sections, clicking quiz questions, and verifying examples are properly linked
- [ ] 5.8 Verify all code example READMEs are properly linked from documentation pages and contain working setup instructions

---

## Relevant Files

### Documentation Files (NEW)

- `docs/11-application-development/11.2.2-data-layer-patterns.md` - Data Layer Patterns documentation with Repository, Active Record, and concurrency patterns
- `docs/11-application-development/11.2.3-business-logic-patterns.md` - Business Logic Patterns documentation with Transaction Script, Domain Model, and Service Layer
- `docs/11-application-development/11.2.4-classical-patterns.md` - Classical GoF Patterns documentation with Strategy, Factory, Observer, and Decorator
- `docs/11-application-development/11.2.5-refactoring-exercise.md` - Integrated Refactoring Exercise documentation with instructions and guided workflow

### Quiz Files (NEW)

- `src/quizzes/chapter-11/11.2.2/data-layer-patterns-quiz.js` - Interactive quiz for data layer patterns following quizdown format
- `src/quizzes/chapter-11/11.2.3/business-logic-patterns-quiz.js` - Interactive quiz for business logic patterns following quizdown format
- `src/quizzes/chapter-11/11.2.4/classical-patterns-quiz.js` - Interactive quiz for classical patterns following quizdown format

### Navigation (MODIFY)

- `docs/_sidebar.md` - Update to include new subsections 11.2.2, 11.2.3, 11.2.4, and 11.2.5 under Design Patterns section

### Data Layer Pattern Examples (NEW)

- `examples/ch11/data-patterns/repository/` - Go implementation demonstrating Repository pattern with interface abstraction
  - `main.go` - Executable demonstration
  - `go.mod` - Go module definition
  - `README.md` - Setup instructions and pattern explanation
  - `repository.go` - Repository interface and implementation
  - `repository_test.go` - Unit tests

- `examples/ch11/data-patterns/active-record/` - Go implementation demonstrating Active Record pattern
  - `main.go` - Executable demonstration
  - `go.mod` - Go module definition
  - `README.md` - Setup instructions and pattern explanation
  - `user.go` - Domain object with encapsulated data access
  - `user_test.go` - Unit tests

- `examples/ch11/data-patterns/concurrency/optimistic/` - SQLite-based Optimistic Locking demonstration
  - `main.go` - Multi-user simulation showing version-based conflict detection
  - `go.mod` - Go module definition
  - `README.md` - Setup instructions and concurrency pattern explanation
  - `optimistic_lock.go` - Implementation with version checking
  - `optimistic_lock_test.go` - Unit tests

- `examples/ch11/data-patterns/concurrency/pessimistic/` - SQLite-based Pessimistic Locking demonstration
  - `main.go` - Multi-user simulation showing exclusive access control
  - `go.mod` - Go module definition
  - `README.md` - Setup instructions and concurrency pattern explanation
  - `pessimistic_lock.go` - Implementation with locking
  - `pessimistic_lock_test.go` - Unit tests

### Business Logic Pattern Examples (NEW)

- `examples/ch11/business-patterns/transaction-script/` - TypeScript implementation of Transaction Script pattern
  - `package.json` - Node.js dependencies and scripts
  - `tsconfig.json` - TypeScript configuration
  - `README.md` - Setup instructions and pattern explanation
  - `src/order-processing.ts` - Procedural business logic
  - `src/main.ts` - Executable demonstration
  - `tests/order-processing.test.ts` - Unit tests

- `examples/ch11/business-patterns/domain-model/` - TypeScript implementation of Domain Model pattern
  - `package.json` - Node.js dependencies and scripts
  - `tsconfig.json` - TypeScript configuration
  - `README.md` - Setup instructions and pattern explanation
  - `src/order.ts` - Domain object with encapsulated logic
  - `src/customer.ts` - Domain object
  - `src/main.ts` - Executable demonstration
  - `tests/order.test.ts` - Unit tests

- `examples/ch11/business-patterns/comparison/` - Comparative example showing both approaches
  - `package.json` - Node.js dependencies and scripts
  - `tsconfig.json` - TypeScript configuration
  - `README.md` - Detailed comparison and trade-off analysis
  - `src/transaction-script/` - Transaction Script solution
  - `src/domain-model/` - Domain Model solution
  - `src/main.ts` - Side-by-side demonstration
  - `tests/` - Tests for both approaches

- `examples/ch11/business-patterns/service-layer/` - TypeScript implementation of Service Layer pattern
  - `package.json` - Node.js dependencies and scripts
  - `tsconfig.json` - TypeScript configuration
  - `README.md` - Setup instructions and pattern explanation
  - `src/services/order-service.ts` - Service layer orchestrating domain objects
  - `src/domain/` - Domain objects
  - `src/main.ts` - Executable demonstration
  - `tests/order-service.test.ts` - Unit tests

### Classical Pattern Examples (NEW)

- `examples/ch11/classical-patterns/strategy/` - Strategy pattern implementation (Python recommended)
  - Pattern-specific files (pyproject.toml or equivalent)
  - `README.md` - Setup, explanation, and explicit OCP connection
  - Source and test files

- `examples/ch11/classical-patterns/factory/` - Factory pattern implementation (Go recommended)
  - Pattern-specific files (go.mod or equivalent)
  - `README.md` - Setup, explanation, and explicit DIP connection
  - Source and test files

- `examples/ch11/classical-patterns/observer/` - Observer pattern implementation (TypeScript recommended)
  - Pattern-specific files (package.json or equivalent)
  - `README.md` - Setup and explanation of event-driven communication
  - Source and test files

- `examples/ch11/classical-patterns/decorator/` - Decorator pattern implementation (Python recommended)
  - Pattern-specific files (pyproject.toml or equivalent)
  - `README.md` - Setup, explanation, and explicit OCP connection
  - Source and test files

### Refactoring Exercise Files (NEW)

- `examples/ch11/refactoring-exercise/research-notes.md` - Documents evaluated OSS projects and selection rationale
- `examples/ch11/refactoring-exercise/analysis-guide.md` - Documents anti-patterns and SOLID violations for students to identify
- `examples/ch11/refactoring-exercise/starter/` - Starter application with deliberate design flaws
  - `README.md` - Setup instructions
  - `pyproject.toml` (or equivalent) - Dependency management
  - `src/` - Application source code with anti-patterns
  - `tests/` - Test suite that must pass
- `examples/ch11/refactoring-exercise/solution/` - Reference solution with refactored code
  - `README.md` - Explanation of refactoring decisions
  - `pyproject.toml` (or equivalent) - Dependency management
  - `src/` - Refactored application code
  - `tests/` - Test suite (same behavior, different structure)

### Notes

- Unit tests should be placed alongside the code they test or in dedicated test directories following language conventions
- Use repository's established testing patterns: Go (`go test ./...`), TypeScript (`npm test`), Python (`uv run pytest`)
- Follow existing bootcamp conventions for dependency management: Python (uv/pyproject.toml), Go (go modules), TypeScript (npm/package.json)
- All examples must be self-contained and runnable on ARM-based macOS without external service dependencies
- Quiz format must match existing quizdown syntax in `src/quizzes/chapter-11/11.2.1/solid-principles-quiz.js`
- Front-matter must include category, technologies, estReadingMinutes, and exercises fields
- Use SQLite for all database examples to maintain portability
