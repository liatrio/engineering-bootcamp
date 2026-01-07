# 03-spec-databases.md

## Introduction/Overview

This specification defines the content and structure for Chapter 11.4: Databases & Data Persistence in the DevOps Bootcamp. This section teaches students how to design, implement, and work with databases in production applications. Students will learn SQL database design and normalization, understand when and how to use NoSQL databases, implement the Repository pattern with real databases using ORMs, and apply best practices for data persistence.

**Problem it Solves**: Many students learn database concepts in isolation (SQL queries in one class, data structures in another) but struggle to integrate databases into applications effectively. This section bridges that gap by showing how to design schemas, use ORMs properly, implement data access patterns, and avoid common pitfalls like N+1 queries.

**Primary Goal**: Enable students to design appropriate database schemas, implement data access layers using the Repository pattern with SQLAlchemy ORM, understand when to use SQL vs NoSQL databases, and write efficient queries while avoiding common performance problems.

## Goals

1. **Master SQL Database Design**: Teach students to design normalized database schemas (1NF-3NF), understand ACID properties, use transactions appropriately, and create effective indexes for performance.

2. **Implement Repository Pattern with Real Databases**: Build on the Repository pattern taught in 11.2.2, showing students how to implement it with SQLAlchemy ORM and real databases (SQLite/PostgreSQL), creating a clean separation between business logic and data access.

3. **Understand NoSQL Use Cases**: Teach students when and why to use NoSQL databases, with hands-on examples using 2-3 different types (document stores, key-value stores) to demonstrate different use cases.

4. **Apply Query Optimization Basics**: Introduce fundamental query optimization concepts including indexes, N+1 query problems, eager vs lazy loading, and basic query analysis to help students write performant data access code.

5. **Build Progressive Hands-On Skills**: Provide exercises that start simple (single table CRUD) and progressively build complexity (relationships, joins, transactions, optimization), with starting point codebases to help students focus on learning rather than setup.

## User Stories

**As a bootcamp student**, I want to learn proper database schema design so that I can create maintainable, normalized data models for applications.

**As a bootcamp student**, I want hands-on experience implementing the Repository pattern with a real ORM so that I understand how to properly separate data access from business logic in production code.

**As a bootcamp student**, I want to understand when to use NoSQL databases so that I can make informed technology decisions based on application requirements.

**As a bootcamp student**, I want to learn common query optimization pitfalls (like N+1 queries) so that I can write performant database code from the start.

**As a bootcamp student**, I want progressive exercises with starting point codebases so that I can focus on learning database concepts rather than struggling with application setup.

**As a bootcamp instructor**, I want this section to directly build on 11.2.2 Data Layer Patterns so that students see how abstract patterns map to concrete implementations with real databases.

**As a bootcamp instructor**, I want students to use industry-standard tools (SQLAlchemy) so that their skills transfer directly to professional work.

## Demoable Units of Work

### Unit 1: SQL Fundamentals and Schema Design

**Purpose:** Introduce SQL database concepts, normalization, and schema design principles. Students will design schemas, understand normalization forms, and implement basic CRUD operations.

**Functional Requirements:**
- The content shall explain relational database fundamentals including tables, rows, columns, primary keys, foreign keys, and relationships (one-to-many, many-to-many)
- The content shall teach normalization (1NF, 2NF, 3NF) with examples showing denormalized vs normalized schemas and explaining the benefits of normalization (data integrity, avoiding anomalies)
- The content shall explain ACID properties (Atomicity, Consistency, Isolation, Durability) and when transactions are necessary
- The content shall provide guidance on when to denormalize for performance (read-heavy workloads, reporting)
- The user shall complete a schema design exercise given a problem statement (e.g., "Design a schema for a library system with books, authors, members, and loans")
- The user shall implement the schema in SQLite, write raw SQL queries (SELECT, INSERT, UPDATE, DELETE) to perform CRUD operations, and demonstrate understanding of joins (INNER JOIN, LEFT JOIN)
- The system shall provide a starting point codebase with database connection setup and sample data

**Proof Artifacts:**
- Schema design examples: ER diagrams and SQL CREATE TABLE statements demonstrate proper normalization and relationships
- Exercise starter codebase: Python application with SQLite connection demonstrates students have a working starting point
- Exercise instructions: Problem statement and deliverables demonstrate clear guidance for schema design task
- Sample solution: Complete schema implementation demonstrates expected quality

### Unit 2: ORM Fundamentals with SQLAlchemy

**Purpose:** Introduce Object-Relational Mapping concepts and teach SQLAlchemy basics, showing students how to map Python classes to database tables and perform CRUD operations through the ORM.

**Functional Requirements:**
- The content shall explain what ORMs are, why they're used (type safety, reduced boilerplate, database abstraction), and trade-offs (learning curve, potential for inefficient queries)
- The content shall introduce SQLAlchemy Core vs ORM distinction, with focus on ORM for this section
- The content shall teach SQLAlchemy models: defining classes that inherit from declarative base, mapping columns with types, defining relationships (one-to-many, many-to-many using association tables)
- The content shall teach sessions: creating sessions, adding/committing objects, querying, and managing transactions
- The content shall explain relationship loading strategies: lazy loading (default), eager loading (joinedload, selectinload), and when to use each
- The user shall complete an exercise converting their SQL schema from Unit 1 to SQLAlchemy models
- The user shall implement CRUD operations using the ORM instead of raw SQL
- The system shall provide a starting point codebase with SQLAlchemy configured and sample model definitions

**Proof Artifacts:**
- SQLAlchemy tutorial content: Explains models, sessions, relationships, loading strategies demonstrates comprehensive ORM coverage
- Exercise starter codebase: Flask app with SQLAlchemy configured demonstrates working starting point
- Exercise instructions: Conversion task from SQL to ORM demonstrates hands-on practice
- Code examples: Complete SQLAlchemy models with relationships demonstrates expected patterns

### Unit 3: Repository Pattern Implementation

**Purpose:** Implement the Repository pattern (taught in 11.2.2) with SQLAlchemy, showing students how to create a clean data access layer that separates persistence concerns from business logic.

**Functional Requirements:**
- The content shall explicitly reference section 11.2.2 Repository Pattern, showing "Now we'll implement this pattern with a real database"
- The content shall explain Repository pattern benefits in the context of databases: testability (can mock repositories), separation of concerns (business logic doesn't know about database), flexibility (can swap data sources)
- The content shall provide a complete Repository implementation example showing: abstract base Repository class defining common operations (get_by_id, get_all, add, update, delete), concrete Repository implementations for specific entities using SQLAlchemy sessions, query methods specific to each repository (e.g., UserRepository.get_by_email)
- The content shall show how to integrate Repositories with Flask applications: creating repositories in app setup, passing repositories to route handlers, using repositories instead of direct ORM access
- The user shall refactor their Unit 2 ORM application to use the Repository pattern
- The user shall implement at least 2 repositories for different entities, demonstrating proper separation of concerns
- The system shall provide a starting point codebase with partial Repository implementation to guide the refactoring

**Proof Artifacts:**
- Repository pattern tutorial: Explains pattern implementation with SQLAlchemy demonstrates concrete pattern application
- Exercise starter codebase: Flask app with ORM access that students will refactor demonstrates starting point
- Exercise instructions: Refactoring task to implement Repository pattern demonstrates hands-on practice
- Reference implementation: Complete Repository examples demonstrates proper pattern implementation
- Explicit link to 11.2.2: Content references previous section demonstrates integration

### Unit 4: Indexes and Query Optimization Basics

**Purpose:** Teach fundamental query optimization concepts including indexes, N+1 query problems, and query analysis to help students write performant database code.

**Functional Requirements:**
- The content shall explain what indexes are, how they work (B-tree basics), and when to add indexes (frequent WHERE/JOIN columns, foreign keys)
- The content shall show how to create indexes in SQLAlchemy using index=True or Index() constructs
- The content shall explain the N+1 query problem with a concrete example: loading a list of objects then accessing relationships in a loop causes N additional queries
- The content shall demonstrate solutions to N+1 problems: using eager loading (joinedload, selectinload), writing explicit joins, batch loading
- The content shall introduce basic query analysis: using SQLAlchemy's echo=True to log SQL queries, examining query patterns, identifying performance issues
- The content shall provide guidelines for avoiding common pitfalls: always eager load relationships when displaying lists, use pagination for large result sets, avoid loading unnecessary columns with defer()
- The user shall complete an exercise identifying and fixing N+1 queries in a provided codebase
- The user shall add appropriate indexes to their schema and measure the performance improvement
- The system shall provide a starting point codebase with intentional N+1 query problems and missing indexes

**Proof Artifacts:**
- Query optimization tutorial: Explains indexes, N+1 problems, eager loading demonstrates optimization fundamentals
- Exercise starter codebase: Flask app with N+1 problems demonstrates realistic optimization scenario
- Exercise instructions: Problem identification and fixing task demonstrates hands-on optimization practice
- Before/after examples: Code showing N+1 problem and solutions demonstrates improvement patterns

### Unit 5: NoSQL Databases - When and How to Use Them

**Purpose:** Introduce NoSQL databases, teach students when to use them vs SQL databases, and provide hands-on examples with 2-3 different NoSQL types.

**Functional Requirements:**
- The content shall explain the CAP theorem basics (Consistency, Availability, Partition tolerance) and how NoSQL databases make different trade-offs than SQL databases
- The content shall categorize NoSQL databases: document stores (MongoDB), key-value stores (Redis), column-family (Cassandra), graph databases (Neo4j)
- The content shall provide decision criteria for SQL vs NoSQL: use SQL for structured data with complex relationships and transactions; use NoSQL for flexible schemas, horizontal scaling needs, or specialized access patterns
- The content shall provide hands-on examples with 2 NoSQL types: Redis for caching (session storage, API response caching, rate limiting), MongoDB or similar for document storage (flexible schema, JSON-like documents)
- The user shall complete an exercise adding Redis caching to their Flask application from previous units to cache expensive database queries
- The user shall complete an exercise implementing a simple document storage use case (e.g., storing user preferences, activity logs, or configuration data) using a document store
- The system shall provide starting point codebases with Redis and document store configured for local development (docker-compose)

**Proof Artifacts:**
- NoSQL tutorial content: Explains types, use cases, trade-offs demonstrates comprehensive overview
- Redis caching example: Flask app with Redis caching demonstrates key-value store usage
- Document store example: Application using document database demonstrates document storage patterns
- Exercise starter codebases: Apps with NoSQL configured demonstrates working starting points
- Docker Compose files: Local development setup for Redis and document store demonstrates easy setup

### Unit 6: Integration Exercise - Building a Complete Data Layer

**Purpose:** Synthesize all skills in a comprehensive exercise where students design a schema, implement it with SQLAlchemy, use the Repository pattern, optimize queries, and optionally integrate NoSQL caching.

**Functional Requirements:**
- The user shall be given a problem statement for a moderate-complexity application (e.g., "Build a blog platform with users, posts, comments, tags, and categories")
- The user shall design a normalized database schema (3NF) with 4-6 entities and appropriate relationships
- The user shall implement the schema using SQLAlchemy models with proper relationship definitions
- The user shall implement Repository pattern for all entities with appropriate query methods
- The user shall add appropriate indexes for performance
- The user shall demonstrate the application works with CRUD operations for all entities
- The user shall identify and prevent potential N+1 query problems using eager loading
- The user shall optionally add Redis caching for frequently accessed data
- The system shall provide a starting point Flask application with basic routing and templates, allowing students to focus on the data layer
- The system shall provide a self-assessment checklist for students to verify completeness

**Proof Artifacts:**
- Integration exercise instructions: Complete problem statement and deliverables demonstrate comprehensive task
- Starter codebase: Flask application skeleton demonstrates proper starting point
- Self-assessment checklist: Quality criteria for schema design, ORM usage, Repository implementation, and optimization demonstrates evaluation guidance
- Reference solution: Complete implementation demonstrates expected quality and patterns
- Example deliverables: Schema diagrams, code samples, working application demonstrates what students should produce

## Non-Goals (Out of Scope)

1. **Advanced Query Optimization**: Deep query optimization topics like execution plan analysis, database-specific features, query hints, and advanced indexing strategies are out of scope. Focus is on fundamental concepts (indexes, N+1 queries) that prevent common problems.

2. **Database Administration**: Topics like backup/restore, replication, sharding, database tuning parameters, and infrastructure management are out of scope. This is application development focused, not DBA training.

3. **Multiple SQL Databases**: While SQLAlchemy supports many databases, exercises will use SQLite for development (simple, no server) and PostgreSQL for production examples. MySQL, SQL Server, Oracle are out of scope.

4. **ORM Alternatives**: While ORMs are the focus, alternative approaches (query builders, raw SQL with proper parameterization) are out of scope. Students will use SQLAlchemy ORM exclusively.

5. **Database Migrations**: While database migrations are important for production applications, detailed coverage of migration tools (Alembic) and migration strategies is deferred to later sections or production exercises.

6. **Graph Databases and Time-Series Databases**: While mentioned in NoSQL overview, hands-on exercises with specialized databases like Neo4j or InfluxDB are out of scope. Focus is on Redis (key-value) and document stores.

7. **Frontend Database Integration**: This section focuses on backend data layers. Frontend concerns (displaying data, forms, client-side state) are covered minimally only as needed to demonstrate the data layer.

## Design Considerations

**Learning Materials Format:**
- Main content in `docs/11-application-development/11.4-databases.md` following established chapter structure
- Use H2 headers for navigation (table of contents), H3 headers for content sections
- Include diagrams: ER diagrams for schema examples, architecture diagrams showing Repository pattern layers
- Use multi-column layouts (`grid2`, `grid3`) for comparing SQL vs NoSQL, showing before/after optimization examples

**Example Applications:**
- Progressive Flask applications in `examples/ch11/databases/`
- Each unit has its own example with clear README and docker-compose for dependencies
- Starting point codebases for each exercise with TODO comments guiding students
- Complete reference solutions showing expected implementation quality

**Code Examples:**
- Primary language: Python 3.11+ with Flask and SQLAlchemy
- Database: SQLite for development (no server needed), PostgreSQL mentioned for production
- NoSQL: Redis (docker), document store TBD (MongoDB or similar)
- All examples use docker-compose for easy local setup

**Integration with 11.2.2:**
- Explicit references to Repository pattern from 11.2.2
- Show side-by-side: abstract pattern diagram from 11.2.2 → concrete SQLAlchemy implementation
- Reinforce that patterns are universal, implementations are specific

**Quiz Integration:**
- Include interactive quiz covering: normalization identification, ACID property scenarios, when to use indexes, identifying N+1 query problems, SQL vs NoSQL decision making

## Repository Standards

**Content Organization:**
- Main documentation: `docs/11-application-development/11.4-databases.md`
- Code examples: `examples/ch11/databases/unit-1-sql/`, `examples/ch11/databases/unit-2-orm/`, etc.
- Images: `docs/11-application-development/img11/`
- Templates: `examples/ch11/templates/` (reuse from other sections)

**Front-Matter Requirements:**
```yaml
---
docs/11-application-development/11.4-databases.md:
  category: Software Development
  estReadingMinutes: 40
  exercises:
    -
      name: SQL Schema Design
      description: Design and implement a normalized database schema with relationships and CRUD operations
      estMinutes: 90
      technologies:
      - SQL
      - SQLite
      - Database Design
    -
      name: SQLAlchemy ORM Implementation
      description: Convert SQL schema to SQLAlchemy models and implement ORM-based CRUD operations
      estMinutes: 120
      technologies:
      - Python
      - SQLAlchemy
      - ORM
    -
      name: Repository Pattern Refactoring
      description: Refactor ORM application to use Repository pattern for clean data access layer
      estMinutes: 120
      technologies:
      - Design Patterns
      - Repository Pattern
      - SQLAlchemy
    -
      name: Query Optimization
      description: Identify and fix N+1 queries, add indexes, measure performance improvements
      estMinutes: 90
      technologies:
      - SQL
      - Query Optimization
      - Performance
    -
      name: NoSQL Integration
      description: Add Redis caching and implement document storage use case
      estMinutes: 90
      technologies:
      - Redis
      - NoSQL
      - Caching
    -
      name: Integration Exercise
      description: Build complete data layer with schema design, ORM, Repository pattern, and optimization
      estMinutes: 180
      technologies:
      - SQL
      - SQLAlchemy
      - Repository Pattern
      - Query Optimization
---
```

**Style Guidelines:**
- Follow Docsify markdown conventions
- Use HTML `<img>` tags for images with proper alt text
- Include code blocks with language-specific syntax highlighting
- Use callout boxes for important notes (performance tips, common pitfalls)

**Example Standards:**
- All examples must be self-contained with README
- Use docker-compose for databases (PostgreSQL, Redis, document store)
- Pin all dependency versions in requirements.txt and pyproject.toml
- Test on ARM-based macOS (M1/M2/M3)
- Include .gitignore for *.db files, __pycache__, .venv/

**Existing Patterns to Follow:**
- Hands-on, practical focus (like 11.1-layers.md exercises)
- Progressive complexity (like SOLID exercises in 11.2.1)
- Clear learning objectives and deliverables
- Starting point codebases (like existing chapter 11 examples)

## Technical Considerations

**Database Selection:**
- **SQLite**: Primary database for exercises (file-based, no server, perfect for learning)
- **PostgreSQL**: Mentioned in examples as production alternative, used in docker-compose setups
- All SQLAlchemy examples should work with both databases without code changes (use database-agnostic features)

**ORM Framework:**
- **SQLAlchemy 2.x**: Use modern SQLAlchemy with new-style declarative syntax
- Document both synchronous (default) and async options (mention only, don't require)
- Pin to SQLAlchemy 2.x in requirements (SQLAlchemy>=2.0,<3.0)

**NoSQL Databases:**
- **Redis**: Use redis-py client library, docker image redis:7-alpine
- **Document Store**: MongoDB (docker image mongo:7) or alternative if preferred
- Provide docker-compose.yml for each so students don't need to install locally

**Flask Integration:**
- Use Flask-SQLAlchemy extension for easier integration
- Show proper application factory pattern with SQLAlchemy initialization
- Demonstrate request lifecycle: session management, commit/rollback

**Development Environment:**
- Python 3.11+ required
- Docker and Docker Compose for databases
- Recommended: VS Code with SQLite extension for viewing databases
- All examples tested on ARM-based macOS

**Prerequisites:**
- Requires completion of 11.2 (especially 11.2.2 Data Layer Patterns)
- Assumes basic Python knowledge from earlier chapters
- Assumes Docker knowledge from earlier bootcamp chapters
- SQL knowledge helpful but not required (will be taught)

## Security Considerations

**SQL Injection Prevention:**
- All examples MUST use parameterized queries or ORM (never string concatenation for SQL)
- Explicitly warn about SQL injection with bad examples (commented as "DON'T DO THIS")
- Show proper parameter binding in raw SQL examples
- SQLAlchemy ORM is safe by default when used properly

**Database Credentials:**
- Never commit database credentials to repositories
- Use environment variables for connection strings
- Provide .env.example files showing format without real credentials
- For exercises, use simple local credentials (e.g., "postgres"/"password") clearly labeled as "development only"

**Data Privacy:**
- Exercise data should be fictional (no real names, emails, addresses)
- Warn students not to use personal information in database exercises
- No sensitive data in example applications (no passwords, payment info, SSNs)

**NoSQL Security:**
- Redis in exercises should bind to localhost only (not exposed to network)
- Document stores should use basic authentication even in development
- Provide secure default configurations in docker-compose files

**No production deployment**: Exercises are for local development only. Production deployment considerations (SSL, connection pooling, secrets management) are deferred to later sections.

## Success Metrics

1. **Schema Design Quality**: Students create properly normalized schemas (3NF) with appropriate relationships and constraints. Target: 80%+ of student schemas are normalized and use foreign keys correctly.

2. **Repository Pattern Implementation**: Students successfully implement Repository pattern with SQLAlchemy, demonstrating clean separation between data access and business logic. Target: Working Repository implementations for all required entities.

3. **Query Optimization Understanding**: Students can identify N+1 query problems, apply eager loading correctly, and add appropriate indexes. Target: 80%+ of students fix N+1 problems in provided codebase.

4. **NoSQL Decision Making**: Students can articulate when to use SQL vs NoSQL and successfully implement caching with Redis. Target: 70%+ of students successfully add caching to application.

5. **Working Applications**: All exercises result in working applications that can be run with `docker-compose up` and tested locally. Target: 90%+ success rate on running exercise codebases.

6. **Time Calibration**: Exercises align with estimated times (11 hours total across 6 exercises). Target: 70%+ of students complete core exercises (Units 1-4) within estimated time.

7. **Integration with Previous Sections**: Students explicitly connect this section to 11.2.2 Repository Pattern in their implementations. Target: Implementations reference pattern concepts from 11.2.2.

8. **Student Confidence**: Post-section surveys show students feel confident designing schemas and implementing data access layers. Target: 4+ on 5-point confidence scale for "I can design a database schema" and "I can implement Repository pattern with an ORM."

## Open Questions

1. **Document Store Selection**: Should we use MongoDB (most popular, widely known) or alternative like CouchDB, RethinkDB, or even PostgreSQL's JSONB as a document store? MongoDB requires more resources but is industry standard.

2. **SQLAlchemy Async**: Should we mention async SQLAlchemy patterns, or keep everything synchronous for simplicity? Async is increasingly common but adds complexity.

3. **Database Migrations**: Should Unit 3 or 6 include basic Alembic usage for database migrations, or defer this entirely to later sections? Migrations are important but add scope.

4. **Quiz Timing**: Should the interactive quiz come after Unit 4 (optimization) or at the end after Unit 6? Mid-chapter quizzes reinforce learning, end-of-chapter quizzes assess overall understanding.

5. **PostgreSQL Depth**: How much should PostgreSQL-specific features be covered vs staying database-agnostic? Array types, JSONB, full-text search are powerful but not portable.

6. **Unit 5 Second NoSQL Type**: For the document store example, should it be MongoDB (de facto standard), or leverage PostgreSQL JSONB (students already have PostgreSQL), or use a lighter option?

7. **Integration Exercise Problem Domain**: What specific application domain for Unit 6 integration exercise? Blog platform, e-commerce, task management, social media clone? Should align with student interests and demonstrate realistic complexity.

8. **Reference Material**: Should we provide links to external resources (SQLAlchemy docs, PostgreSQL tutorial, Redis guides) or keep everything self-contained in bootcamp? External links are valuable but can be overwhelming.
