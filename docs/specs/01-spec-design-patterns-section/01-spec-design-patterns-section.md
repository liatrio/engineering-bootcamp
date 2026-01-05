# 01-spec-design-patterns-section.md

## Introduction/Overview

This specification defines the remaining Design Patterns subsections for Chapter 11 (Application Development) of the DevOps Bootcamp. Building on the completed SOLID Principles foundation (11.2.1), this spec focuses on architectural patterns (data layer and business logic) and classical Gang of Four patterns that students will encounter in production applications.

The content teaches students to recognize and apply design patterns through practical examples and interactive exercises. Students will develop pattern recognition skills essential for understanding enterprise codebases and effectively collaborating with AI-assisted development workflows.

This specification covers four remaining subsections (11.2.2 - 11.2.5) with dedicated markdown documentation, code examples distributed across Python, Go, and TypeScript, interactive quizzes, and a comprehensive refactoring exercise that synthesizes all learned concepts.

**Status**: The parent section (11.2) and SOLID Principles (11.2.1) are complete. This spec focuses exclusively on the remaining subsections.

---

## Goals

1. **Teach Practical Data Layer Patterns**: Introduce Repository and Active Record patterns with concrete examples showing interface abstraction over data access operations.

2. **Demonstrate Concurrency Patterns**: Show Optimistic and Pessimistic Locking patterns with self-contained SQLite examples for multi-user scenarios.

3. **Compare Business Logic Approaches**: Contrast Transaction Script and Domain Model patterns, helping students understand trade-offs between simplicity and complexity management.

4. **Introduce Classical Patterns**: Teach Strategy, Factory, Observer, and Decorator patterns with explicit connections to SOLID principles learned in 11.2.1.

5. **Synthesize Through Refactoring**: Provide a comprehensive refactoring exercise where students apply multiple patterns to improve a poorly-structured codebase.

6. **Prepare for Production Development**: Ensure all patterns and examples reflect real-world enterprise patterns students will encounter professionally.

---

## User Stories

**US-1: Understanding Data Layer Patterns**
As a bootcamp apprentice learning production development, I want to understand Repository and Active Record patterns so that I can structure data access logic in enterprise applications.

**US-2: Managing Concurrent Data Access**
As a developer building multi-user applications, I want to understand Optimistic and Pessimistic Locking patterns so that I can handle concurrent data modifications safely.

**US-3: Organizing Business Logic**
As a developer facing design decisions, I want to understand when to use Transaction Script versus Domain Model patterns so that I can choose the appropriate approach for my application's complexity.

**US-4: Recognizing Classical Patterns**
As a senior CSCI student preparing for professional work, I want to recognize Strategy, Factory, Observer, and Decorator patterns in existing codebases so that I can understand and contribute to enterprise projects.

**US-5: Applying Multiple Patterns**
As a bootcamp apprentice practicing design patterns, I want to refactor a poorly-structured application using multiple patterns so that I can demonstrate cumulative understanding of architectural principles.

---

## Demoable Units of Work

### Unit 2: Architectural Patterns - Data Layer (11.2.2)

**Purpose:** Teach practical data layer patterns that students will encounter in production applications, building on the layered architecture foundation from 11.1.

**Estimated Time:** 2-3 hours

**Functional Requirements:**

| ID | Requirement |
|----|-------------|
| U2-FR1 | The system shall explain Repository Pattern with implementation examples showing interface abstraction over data access operations |
| U2-FR2 | The system shall explain Active Record Pattern with examples showing domain objects that encapsulate data access methods |
| U2-FR3 | The system shall provide decision guidance contrasting Repository vs Active Record based on domain complexity, testability requirements, and team preferences |
| U2-FR4 | The system shall demonstrate Optimistic Locking pattern with self-contained SQLite database examples showing version-based conflict detection |
| U2-FR5 | The system shall demonstrate Pessimistic Locking pattern with self-contained SQLite database examples showing exclusive access control |
| U2-FR6 | The system shall include multi-user scenario examples demonstrating when each concurrency pattern is appropriate |
| U2-FR7 | The system shall include anti-patterns showing pain points of direct data access mixed with business logic |
| U2-FR8 | The system shall provide a self-directed refactoring exercise for students to convert direct data access to Repository pattern |
| U2-FR9 | The system shall include an interactive quiz testing pattern recognition and decision-making for data layer patterns |

**Proof Artifacts:**

| Artifact | Location | Verification |
|----------|----------|--------------|
| Data Layer Patterns documentation | `docs/11-application-development/11.2.2-data-layer-patterns.md` | File exists with complete content |
| Repository Pattern examples | `examples/ch11/data-patterns/repository/` | Contains working implementation with README |
| Active Record Pattern examples | `examples/ch11/data-patterns/active-record/` | Contains working implementation with README |
| Optimistic Locking examples | `examples/ch11/data-patterns/concurrency/optimistic/` | Contains SQLite-based demonstration with README |
| Pessimistic Locking examples | `examples/ch11/data-patterns/concurrency/pessimistic/` | Contains SQLite-based demonstration with README |
| Interactive quiz | `src/quizzes/chapter-11/11.2.2/data-layer-patterns-quiz.js` | Quiz file exists with pattern recognition questions |

---

### Unit 3: Business Logic Patterns (11.2.3)

**Purpose:** Introduce patterns for organizing business logic, helping students understand trade-offs between simplicity and complexity management.

**Estimated Time:** 1-2 hours

**Functional Requirements:**

| ID | Requirement |
|----|-------------|
| U3-FR1 | The system shall explain Transaction Script Pattern with examples showing procedural organization of business logic |
| U3-FR2 | The system shall explain Domain Model Pattern with examples showing object-oriented encapsulation of business rules |
| U3-FR3 | The system shall provide comparative examples solving the same business problem with both Transaction Script and Domain Model approaches |
| U3-FR4 | The system shall include decision guidance on pattern selection based on domain complexity, team experience, and maintenance expectations |
| U3-FR5 | The system shall demonstrate Service Layer pattern for orchestrating domain objects and transaction boundaries |
| U3-FR6 | The system shall include anti-patterns showing business logic scattered across layers |
| U3-FR7 | The system shall provide a self-directed exercise for students to implement business logic using the pattern appropriate for given complexity |
| U3-FR8 | The system shall include an interactive quiz testing conceptual understanding and decision-making for business logic patterns |

**Proof Artifacts:**

| Artifact | Location | Verification |
|----------|----------|--------------|
| Business Logic Patterns documentation | `docs/11-application-development/11.2.3-business-logic-patterns.md` | File exists with complete content |
| Transaction Script examples | `examples/ch11/business-patterns/transaction-script/` | Contains working implementation with README |
| Domain Model examples | `examples/ch11/business-patterns/domain-model/` | Contains working implementation with README |
| Comparative examples | `examples/ch11/business-patterns/comparison/` | Contains same problem solved both ways with README |
| Service Layer examples | `examples/ch11/business-patterns/service-layer/` | Contains working implementation with README |
| Interactive quiz | `src/quizzes/chapter-11/11.2.3/business-logic-patterns-quiz.js` | Quiz file exists with decision-making questions |

---

### Unit 4: Classical Design Patterns - GoF (11.2.4)

**Purpose:** Introduce selected Gang of Four patterns that directly relate to SOLID principles and are commonly used in production applications.

**Estimated Time:** 2-3 hours

**Functional Requirements:**

| ID | Requirement |
|----|-------------|
| U4-FR1 | The system shall explain Strategy Pattern with examples demonstrating swappable algorithms and explicit connection to Open/Closed Principle |
| U4-FR2 | The system shall explain Factory Pattern with examples demonstrating object creation abstraction and explicit connection to Dependency Inversion Principle |
| U4-FR3 | The system shall explain Observer Pattern with examples demonstrating event-driven communication between objects |
| U4-FR4 | The system shall explain Decorator Pattern with examples demonstrating behavior extension and explicit connection to Open/Closed Principle |
| U4-FR5 | The system shall organize pattern explanations by problem domain: Creational (Factory), Behavioral (Strategy, Observer), Structural (Decorator) |
| U4-FR6 | The system shall explicitly connect each pattern to relevant SOLID principles with cross-references to 11.2.1 content |
| U4-FR7 | The system shall provide pattern recognition exercises using real-world code snippets |
| U4-FR8 | The system shall include a self-directed exercise for students to identify patterns in a production codebase of their choice |
| U4-FR9 | The system shall include an interactive quiz testing pattern recognition across code snippets in multiple languages |

**Proof Artifacts:**

| Artifact | Location | Verification |
|----------|----------|--------------|
| Classical Patterns documentation | `docs/11-application-development/11.2.4-classical-patterns.md` | File exists with complete content |
| Strategy Pattern examples | `examples/ch11/classical-patterns/strategy/` | Contains working implementation with README |
| Factory Pattern examples | `examples/ch11/classical-patterns/factory/` | Contains working implementation with README |
| Observer Pattern examples | `examples/ch11/classical-patterns/observer/` | Contains working implementation with README |
| Decorator Pattern examples | `examples/ch11/classical-patterns/decorator/` | Contains working implementation with README |
| Interactive quiz | `src/quizzes/chapter-11/11.2.4/classical-patterns-quiz.js` | Quiz file exists with pattern recognition questions |

---

### Unit 5: Integrated Refactoring Exercise (11.2.5)

**Purpose:** Synthesize learning by refactoring a realistic poorly-structured application using multiple patterns, demonstrating cumulative value of design patterns.

**Estimated Time:** 2-3 hours

**Functional Requirements:**

| ID | Requirement |
|----|-------------|
| U5-FR1 | The system shall provide starter application code with deliberately introduced design issues including: mixed concerns, tight coupling, poor testability, and SOLID violations |
| U5-FR2 | The application shall represent a realistic domain (e-commerce order processing or similar) with interconnected components |
| U5-FR3 | The system shall include comprehensive automated tests that validate business behavior and must pass before and after refactoring |
| U5-FR4 | The system shall provide a guided analysis document helping students identify specific anti-patterns and SOLID violations |
| U5-FR5 | The system shall include instructions for students to create a refactoring plan specifying which patterns to apply and justification |
| U5-FR6 | The system shall guide students to apply multiple patterns: Repository (data access), Service Layer (orchestration), and Strategy or Factory (flexibility) |
| U5-FR7 | The system shall include git commit message guidelines for documenting refactoring decisions |
| U5-FR8 | The system shall provide a reference solution showing one valid refactored implementation |
| U5-FR9 | The exercise shall be self-directed with students working in their own Git repositories |
| U5-FR10 | The implementation shall begin with research to identify a suitable open-source application with known design issues, or create from scratch if no suitable project is found |

**Proof Artifacts:**

| Artifact | Location | Verification |
|----------|----------|--------------|
| Refactoring Exercise documentation | `docs/11-application-development/11.2.5-refactoring-exercise.md` | File exists with complete instructions |
| Research findings (if OSS project identified) | `examples/ch11/refactoring-exercise/research-notes.md` | Documents evaluated projects and selection rationale |
| Starter application | `examples/ch11/refactoring-exercise/starter/` | Contains deliberately problematic code with passing tests and README |
| Analysis guide | `examples/ch11/refactoring-exercise/analysis-guide.md` | Documents anti-patterns for students to find |
| Reference solution | `examples/ch11/refactoring-exercise/solution/` | Contains refactored implementation with passing tests and README |
| Test suite | `examples/ch11/refactoring-exercise/starter/tests/` | Tests pass on starter code |

---

## Non-Goals (Out of Scope)

1. **Unit 0 and Unit 1**: The parent overview section (11.2) and SOLID Principles (11.2.1) are complete and will not be modified by this spec.

2. **Comprehensive GoF Catalog**: This section covers only Strategy, Factory, Observer, and Decorator patterns. The remaining 19 Gang of Four patterns are not included.

3. **Framework-Specific Patterns**: Patterns specific to frameworks (React hooks, Spring annotations, Django signals, etc.) are not covered. Focus remains on language-agnostic patterns.

4. **Performance Optimization Patterns**: Patterns primarily focused on performance (Object Pool, Flyweight, Lazy Loading) are not included unless directly related to core architectural concerns.

5. **Advanced Architectural Patterns**: Microservices patterns, event sourcing, CQRS, saga patterns, and distributed systems patterns are not covered in this section.

6. **Complete ORM Implementation**: While Repository and Active Record patterns are covered conceptually, building a full ORM or covering all data mapping patterns from Fowler's Patterns of Enterprise Application Architecture is not in scope.

7. **Integration with Existing Examples**: Code examples are completely standalone and do not build upon or integrate with existing `examples/ch11/example1` or `examples/ch11/example2` code.

8. **Formal Assessment**: Student exercises are self-directed learning activities. No formal submission, grading, or assessment infrastructure is included.

9. **Multi-Language per Pattern**: Each pattern is demonstrated in one language (distributed across Python, Go, TypeScript). Implementing every pattern in all three languages is not in scope.

10. **Full Test Coverage**: While examples include tests to demonstrate testability, comprehensive test suites covering all edge cases are not required.

---

## Design Considerations

### Language Distribution (Flexible)

Code examples will be distributed across Python, Go, and TypeScript based on what makes pedagogical sense:

| Unit | Suggested Language(s) | Rationale |
|------|----------------------|-----------|
| 11.2.2: Data Layer Patterns | Go | Strong typing beneficial for interface patterns; SQLite integration straightforward |
| 11.2.3: Business Logic Patterns | TypeScript | Class-based OOP with type safety; good for demonstrating service layers |
| 11.2.4: Classical Patterns | Mixed (one per pattern) | Variety exposes students to pattern implementation across paradigms |
| 11.2.5: Refactoring Exercise | Python or language of chosen OSS project | Consistency with Chapter 11 examples; accessible syntax |

**Note**: These assignments are flexible and can be adjusted based on what makes the most pedagogical sense during implementation.

### Pedagogical Approach

The section follows a deliberate progression:
1. **Data Layer First**: Repository and Active Record build on 11.1 layered architecture concepts
2. **Business Logic Second**: Transaction Script and Domain Model provide organizational patterns
3. **Classical Patterns Third**: GoF patterns connect explicitly to SOLID principles from 11.2.1
4. **Cumulative Synthesis**: The final refactoring exercise requires applying multiple concepts together

### Refactoring Exercise Strategy

Unit 5 implementation should:
1. **Begin with Research**: Investigate open-source e-commerce or similar applications with known design issues
2. **Evaluate Candidates**: Look for projects with clear anti-patterns, existing test coverage, and appropriate complexity
3. **Build if Necessary**: If no suitable OSS project is found, create a starter application from scratch with deliberate design flaws
4. **Document Selection**: Record research findings and rationale for project selection or custom build decision

### Connection to Existing Content

The section builds on existing Chapter 11 content:
- **11.1 Layered Architecture**: Data layer patterns expand on the data access layer concept
- **11.2.1 SOLID Principles**: Classical patterns explicitly reference SOLID principles learned earlier
- Unit structure mirrors established bootcamp conventions (parent → numbered subsections)

---

## Repository Standards

Based on the DevOps Bootcamp project conventions:

### Code Example Standards

| Standard | Requirement |
|----------|-------------|
| **Project Structure** | All examples shall be self-contained with `src/`, `tests/`, `README.md`, `.gitignore` |
| **README Requirements** | Include setup instructions, dependency installation, and commands to run examples and tests |
| **Development Environment** | Assume modern ARM-based macOS; avoid external service dependencies |
| **Database** | Use SQLite or in-memory storage for portability |
| **Before/After Pattern** | Include "before" (anti-pattern) and "after" (pattern applied) versions where applicable |
| **Python** | Python 3.11+ with `pyproject.toml` for dependency management |
| **Go** | Go 1.21+ with Go modules |
| **TypeScript** | Node.js 20+ with `package.json` and TypeScript configuration |

### Documentation Standards

| Standard | Requirement |
|----------|-------------|
| **Front-Matter** | Include YAML metadata following bootcamp conventions |
| **Metadata Fields** | category, technologies, estReadingMinutes, exercises (with title, description, estMinutes) |
| **Technologies** | Create new technology tags as needed for design patterns content |
| **Header Levels** | Use H2 (`##`) for navigation-visible sections, H3 (`###`) as default within sections |
| **Images** | Use HTML `<img>` tags, place in `docs/11-application-development/img11/` |
| **Cross-References** | Link to 11.2.1 when referencing SOLID principles |

### Quiz Standards

| Standard | Requirement |
|----------|-------------|
| **Format** | Follow existing bootcamp quiz patterns in `src/quizzes/` |
| **Question Types** | Include pattern recognition (with code snippets), conceptual understanding, and decision-making scenarios |
| **Feedback** | Provide immediate feedback explaining correct and incorrect answers |
| **Integration** | Ensure quizzes render correctly within Docsify documentation |

---

## Technical Considerations

### Development Dependencies

- **Docsify**: Existing documentation system (no changes required)
- **Quiz Framework**: Existing JavaScript framework in `src/quizzes/` (follow established patterns)
- **Webpack**: Existing build system (no changes required)
- **Programming Languages**: Python 3.11+, Go 1.21+, Node.js 20+
- **Database**: SQLite (included with Python/Node, available via Go drivers)
- **Version Control**: Git (for refactoring exercise workflow)

### File Structure

```
docs/11-application-development/
├── 11.0-overview.md (existing)
├── 11.1-layers.md (existing)
├── 11.2-design-patterns.md (existing - may need minor updates)
├── 11.2.1-solid-principles.md (existing - complete)
├── 11.2.2-data-layer-patterns.md (NEW)
├── 11.2.3-business-logic-patterns.md (NEW)
├── 11.2.4-classical-patterns.md (NEW)
├── 11.2.5-refactoring-exercise.md (NEW)
└── img11/
    └── [pattern diagrams as needed]

examples/ch11/
├── example1/ (existing)
├── example2/ (existing)
├── solid-exercises/ (existing - complete)
├── data-patterns/ (NEW)
│   ├── repository/
│   ├── active-record/
│   └── concurrency/
│       ├── optimistic/
│       └── pessimistic/
├── business-patterns/ (NEW)
│   ├── transaction-script/
│   ├── domain-model/
│   ├── comparison/
│   └── service-layer/
├── classical-patterns/ (NEW)
│   ├── strategy/
│   ├── factory/
│   ├── observer/
│   └── decorator/
└── refactoring-exercise/ (NEW)
    ├── research-notes.md (if OSS project evaluated)
    ├── starter/
    │   ├── src/
    │   ├── tests/
    │   ├── README.md
    │   └── .gitignore
    ├── solution/
    │   ├── src/
    │   ├── tests/
    │   ├── README.md
    │   └── .gitignore
    └── analysis-guide.md

src/quizzes/chapter-11/
├── 11.2.1/ (existing - complete)
│   └── solid-principles-quiz.js
├── 11.2.2/ (NEW)
│   └── data-layer-patterns-quiz.js
├── 11.2.3/ (NEW)
│   └── business-logic-patterns-quiz.js
└── 11.2.4/ (NEW)
    └── classical-patterns-quiz.js
```

### Sidebar Navigation Update

Update `docs/_sidebar.md` to add new subsections under the existing Design Patterns entry:

```markdown
- 11 Application Development
  - [11.0 Overview](docs/11-application-development/11.0-overview.md)
  - [11.1 Layered Architecture](docs/11-application-development/11.1-layers.md)
  - [11.2 Design Patterns](docs/11-application-development/11.2-design-patterns.md)
    - [11.2.1 SOLID Principles](docs/11-application-development/11.2.1-solid-principles.md)
    - [11.2.2 Data Layer Patterns](docs/11-application-development/11.2.2-data-layer-patterns.md) ← NEW
    - [11.2.3 Business Logic Patterns](docs/11-application-development/11.2.3-business-logic-patterns.md) ← NEW
    - [11.2.4 Classical Patterns](docs/11-application-development/11.2.4-classical-patterns.md) ← NEW
    - [11.2.5 Refactoring Exercise](docs/11-application-development/11.2.5-refactoring-exercise.md) ← NEW
```

---

## Security Considerations

No specific security considerations identified for this educational content. The code examples are self-contained demonstrations without external service dependencies or sensitive data handling requirements.

All examples use local SQLite databases or in-memory storage. No API keys, tokens, or credentials are required.

---

## Success Metrics

1. **Documentation Completeness**: All four new markdown files (11.2.2-11.2.5) exist with complete content following bootcamp conventions
2. **Code Example Quality**: All code examples are self-contained, include READMEs, and demonstrate the pattern clearly
3. **Quiz Functionality**: All three new quizzes load correctly and include pattern recognition, conceptual, and decision-making questions
4. **Refactoring Exercise Viability**: Starter application contains identifiable anti-patterns and test suite passes on both starter and solution code
5. **Learning Objectives**: Students can recognize and apply Repository, Active Record, Transaction Script, Domain Model, Strategy, Factory, Observer, and Decorator patterns
6. **Timeline**: All deliverables complete by January 12, 2026

---

## Open Questions

1. **Unit 5 Research**: What open-source projects should be evaluated for the refactoring exercise? Are there any known codebases with documented design issues that would work well?

2. **Parent Section Updates**: Does `docs/11-application-development/11.2-design-patterns.md` need content updates to reflect the new subsections, or is it already structured as a navigational overview?

3. **Cross-References**: Should the new sections include explicit backward references to 11.1 Layered Architecture concepts, or are forward references from 11.1 sufficient?

---

## Front-Matter Templates

### 11.2.2 Data Layer Patterns

```yaml
---
docs/11-application-development/11.2.2-data-layer-patterns.md:
  category: Application Development
  estReadingMinutes: 45
  technologies:
    - Go
    - SQLite
    - Design Patterns
  exercises:
    -
      title: Repository Pattern Refactoring
      description: Convert direct data access to Repository pattern
      estMinutes: 60
---
```

### 11.2.3 Business Logic Patterns

```yaml
---
docs/11-application-development/11.2.3-business-logic-patterns.md:
  category: Application Development
  estReadingMinutes: 30
  technologies:
    - TypeScript
    - Design Patterns
  exercises:
    -
      title: Business Logic Implementation
      description: Implement business logic using appropriate pattern
      estMinutes: 45
---
```

### 11.2.4 Classical Patterns

```yaml
---
docs/11-application-development/11.2.4-classical-patterns.md:
  category: Application Development
  estReadingMinutes: 45
  technologies:
    - Python
    - Go
    - TypeScript
    - Design Patterns
  exercises:
    -
      title: Pattern Recognition
      description: Identify patterns in production codebase
      estMinutes: 30
---
```

### 11.2.5 Refactoring Exercise

```yaml
---
docs/11-application-development/11.2.5-refactoring-exercise.md:
  category: Application Development
  estReadingMinutes: 20
  technologies:
    - Python
    - Git
    - Design Patterns
  exercises:
    -
      title: Application Refactoring
      description: Refactor tightly-coupled application using multiple patterns
      estMinutes: 120
---
```

---

## Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-01-05 | SDD System | Initial specification focusing on Units 2-5 |
