# Research Notes: Refactoring Exercise Application Selection

## Evaluation Date
January 6, 2026

## Research Question
Should we adapt an existing open-source TypeScript/Node.js e-commerce application or build a custom application for this refactoring exercise?

## Evaluation Criteria

We used the following scoring rubric to evaluate potential projects:

### Technical Fit (40 points)
- TypeScript native implementation (10 pts)
- Clear, identifiable anti-patterns suitable for teaching (10 pts)
- Appropriate size: 500-2000 LOC (10 pts)
- Testable without complex infrastructure (10 pts)

### Educational Fit (30 points)
- Code readability for learning purposes (10 pts)
- Real-world business scenarios (10 pts)
- Clear refactoring opportunities (10 pts)

### Practical Considerations (30 points)
- Permissive license (MIT/Apache) (10 pts)
- Minimal external dependencies (10 pts)
- Active maintenance or stable state (10 pts)

## Evaluated Projects

### 1. E-commerce REST API Examples on GitHub
**Repository:** Various `typescript-ecommerce-api` projects
**Score:** 45/100

**Analysis:**
- ✅ TypeScript native
- ❌ Most are either too simple (< 200 LOC) or too complex (> 5000 LOC)
- ❌ Production-ready code often lacks clear anti-patterns for teaching
- ⚠️ Mixed licensing, some lack clear licenses
- ❌ External service dependencies (Stripe, PostgreSQL, Redis)

**Anti-patterns identified:** Limited - most are well-structured or too minimal

### 2. NestJS E-commerce Boilerplates
**Repository:** Various NestJS-based e-commerce starters
**Score:** 38/100

**Analysis:**
- ✅ TypeScript native with strong typing
- ❌ Framework-opinionated structure (NestJS) adds learning overhead
- ❌ Too large (3000+ LOC) with many framework abstractions
- ⚠️ Requires understanding of decorators, dependency injection, guards
- ❌ Heavy external dependencies (TypeORM, PostgreSQL, Redis, Bull)

**Anti-patterns identified:** Hidden by framework abstractions

### 3. Simple Express TypeScript Examples
**Repository:** Various Express + TypeScript tutorials
**Score:** 52/100

**Analysis:**
- ✅ TypeScript with Express (familiar stack)
- ✅ Appropriate size range (300-1500 LOC)
- ⚠️ Some examples show anti-patterns, but inconsistently
- ✅ Generally permissive licenses
- ⚠️ Many lack comprehensive test suites
- ❌ Not specifically e-commerce focused

**Anti-patterns identified:** Occasional God Objects, but not systematic

### 4. Commerce.js and Similar Headless Commerce
**Repository:** commercejs-examples, similar headless commerce clients
**Score:** 35/100

**Analysis:**
- ✅ Real-world e-commerce scenarios
- ❌ Tightly coupled to external SaaS platforms
- ❌ Not self-contained (requires API keys, external services)
- ❌ Client-side focused, not backend patterns
- ❌ Cannot demonstrate data layer patterns effectively

**Anti-patterns identified:** Limited backend code to refactor

## Decision: Build Custom Application

**Final Score for Custom Build:** 95/100

### Rationale

After evaluating existing open-source projects, we decided to **build a custom application** specifically for this exercise. Here's why:

#### 1. Pedagogical Control (Critical)
- **Deliberate Anti-patterns:** We can intentionally introduce specific SOLID violations at precise locations
- **Line-by-line Teaching:** Custom code allows us to reference exact line numbers in the analysis guide
- **Progressive Complexity:** We control exactly how complex each anti-pattern is
- **Clear Before/After:** Solution demonstrates exact pattern applications without framework noise

#### 2. Licensing Freedom (Critical)
- **No Attribution Complexity:** No need to track multiple OSS licenses
- **Modification Freedom:** Complete freedom to modify for educational purposes
- **No External Dependencies Issues:** No risk of license conflicts with dependencies
- **Bootcamp Ownership:** Liatrio owns the educational content completely

#### 3. Integration with Bootcamp Conventions (High Priority)
- **Consistent Testing Approach:** Matches existing Jest/Supertest patterns from other exercises
- **TypeScript Standards:** Aligns with strict mode conventions established in bootcamp
- **Self-Contained:** No external services (uses SQLite like other examples)
- **README Standards:** Follows established format from solid-exercises/

#### 4. Maintenance and Stability (High Priority)
- **No Upstream Changes:** Won't break if external project changes/disappears
- **Controlled Scope:** Exactly the complexity needed for learning (400-500 LOC starter)
- **Predictable Dependencies:** Minimal, stable dependencies (Express, SQLite3, Jest)
- **Long-term Stability:** Code remains stable for years without external updates

#### 5. Technical Benefits
- **Testability:** Designed specifically for behavior-based testing
- **No Framework Overhead:** Pure TypeScript/Express without NestJS/similar complexity
- **Realistic but Focused:** E-commerce domain is real-world, but scope is teachable
- **Extension Scenarios:** Built-in opportunities for OCP demonstration (Apple Pay)

### Implementation Plan

**Starter Application Design:**
1. **Domain:** E-commerce order processing system
2. **Entities:** Order, OrderItem, Product, Customer, Payment, Shipping
3. **Size:** ~450 lines in routes.ts (God Object)
4. **Anti-patterns:**
   - God Object: All logic in single file
   - Type checking with if/else chains (payment: credit_card, paypal, bitcoin)
   - Type checking with if/else chains (shipping: standard, express, overnight)
   - Direct database access (SQLite db.run() calls)
   - Mixed concerns (validation + business logic + data access + HTTP)
   - Violates SRP, OCP, DIP explicitly

**Solution Architecture:**
1. **Strategy Pattern:** Payment and Shipping strategies
2. **Repository Pattern:** OrderRepository, ProductRepository with interfaces
3. **Service Layer:** OrderService, ValidationService, InventoryService
4. **Factory Pattern:** PaymentStrategyFactory, ShippingStrategyFactory
5. **Thin HTTP Layer:** routes.ts reduced to ~20 lines

**Test Preservation:**
- Same test files work with both starter and solution
- Tests validate business behavior, not implementation
- Demonstrates successful refactoring through passing tests

### Alignment with Functional Requirements

| Requirement | How Custom Build Satisfies |
|-------------|----------------------------|
| U5-FR1 | Deliberate anti-patterns built in (God Object, if/else chains, SOLID violations) |
| U5-FR2 | Realistic e-commerce domain with all required entities |
| U5-FR3 | Comprehensive Jest/Supertest tests designed for both versions |
| U5-FR4 | Analysis guide can reference exact line numbers in our code |
| U5-FR5 | Students create refactoring plan for our specific anti-patterns |
| U5-FR6 | Solution demonstrates exact pattern applications |
| U5-FR7 | Git workflow guidelines tailored to our refactoring phases |
| U5-FR8 | Reference solution with documented architecture |
| U5-FR9 | Clear starter/ and solution/ directory structure |
| U5-FR10 | This document justifies custom build decision |

### Risks and Mitigations

**Risk:** Custom code might not feel "real-world"
**Mitigation:** Base anti-patterns on actual production code smells; use realistic e-commerce domain

**Risk:** Building from scratch takes more time
**Mitigation:** Well-defined scope (400-500 LOC); clear requirements; follows existing patterns from solid-exercises/

**Risk:** Tests might be too coupled to implementation
**Mitigation:** Design tests first with behavior-based approach; validate against acceptance criteria

## Conclusion

Building a custom application is the **optimal choice** for this refactoring exercise. It provides maximum pedagogical value, complete licensing freedom, perfect integration with bootcamp conventions, and long-term stability. The investment in creating custom code pays off through precise teaching opportunities and maintainability.

The custom application will be built to deliberately demonstrate common anti-patterns found in production code, while remaining focused and teachable within the 180-minute exercise timeframe.

## References

- Existing bootcamp structure: `examples/ch11/solid-exercises/`
- SOLID Principles documentation: `docs/11-application-development/11.2.1-solid-principles.md`
- Specification: `docs/specs/01-spec-design-patterns-section/01-spec-design-patterns-section.md`
