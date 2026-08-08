# 03 Tasks - Databases & Data Persistence

This task list breaks down the implementation of Chapter 11.4: Databases & Data Persistence specification into demoable units of work. It follows the structure established in `docs/specs/01-spec-design-patterns-section/01-tasks-design-patterns-section.md` and `docs/specs/02-spec-system-thinking/02-tasks-system-thinking.md`.

Students are first-time learners partway through a six-month bootcamp, so exercise time estimates in front-matter are intentionally generous (they include reading, experimentation, and debugging time, not just "typing the solution" time).

## Relevant Files

### Documentation

- `docs/11-application-development/11.4-databases.md` - Main content page for Chapter 11.4 including all teaching content, exercises, and front-matter metadata
- `docs/11-application-development/img11/` - Directory for ER diagrams and architecture diagrams referenced by 11.4

### Images and Diagrams

- `docs/11-application-development/img11/library-schema-erd.png` - Rendered ER diagram for the Unit 1 library schema design exercise
- `docs/11-application-development/img11/repository-pattern-layers.png` - Rendered architecture diagram showing Repository pattern layers (11.2.2 abstract pattern next to concrete SQLAlchemy implementation)
- `docs/11-application-development/img11/n-plus-one-before-after.png` - Optional diagram/screenshot comparing query counts before/after fixing an N+1 problem

### Unit 1: SQL Fundamentals and Schema Design

- `examples/ch11/databases/unit-1-sql/README.md` - Setup instructions, exercise problem statement, and deliverables
- `examples/ch11/databases/unit-1-sql/requirements.txt` and `pyproject.toml` - Pinned Python 3.11+ dependencies (stdlib `sqlite3`, no external deps required for this unit)
- `examples/ch11/databases/unit-1-sql/starter/init_db.py` - Starting point script that creates an empty SQLite file and a connection helper
- `examples/ch11/databases/unit-1-sql/starter/sample_data.sql` - Sample data students can load into their schema once created
- `examples/ch11/databases/unit-1-sql/solution/schema.sql` - Complete, normalized (3NF) CREATE TABLE statements for the library system (books, authors, members, loans)
- `examples/ch11/databases/unit-1-sql/solution/queries.sql` - Complete sample CRUD and JOIN queries (INNER JOIN, LEFT JOIN) against the schema
- `examples/ch11/databases/unit-1-sql/solution/seed.py` - Script to create the SQLite file, apply schema.sql, and load sample data
- `examples/ch11/databases/unit-1-sql/.gitignore` - Ignore `*.db`, `__pycache__`, `.venv/`

### Unit 2: ORM Fundamentals with SQLAlchemy

- `examples/ch11/databases/unit-2-orm/README.md` - Setup instructions and exercise (convert Unit 1 schema to SQLAlchemy models)
- `examples/ch11/databases/unit-2-orm/requirements.txt` and `pyproject.toml` - Pinned Flask + SQLAlchemy>=2.0,<3.0 dependencies
- `examples/ch11/databases/unit-2-orm/starter/app.py` - Flask app skeleton with SQLAlchemy configured, TODO comments for model definitions
- `examples/ch11/databases/unit-2-orm/starter/models.py` - Partial SQLAlchemy declarative models (some fields/relationships left as TODOs)
- `examples/ch11/databases/unit-2-orm/solution/app.py` - Complete Flask app using SQLAlchemy 2.x declarative models
- `examples/ch11/databases/unit-2-orm/solution/models.py` - Complete models for Book, Author, Member, Loan with one-to-many and many-to-many relationships
- `examples/ch11/databases/unit-2-orm/solution/seed.py` - Script to create tables and seed sample data via the ORM
- `examples/ch11/databases/unit-2-orm/.gitignore` - Ignore `*.db`, `__pycache__`, `.venv/`

### Unit 3: Repository Pattern Implementation

- `examples/ch11/databases/unit-3-repository/README.md` - Setup instructions and refactoring exercise instructions, with explicit link back to `11.2.2-data-layer-patterns.md`
- `examples/ch11/databases/unit-3-repository/requirements.txt` and `pyproject.toml` - Pinned dependencies (Flask, SQLAlchemy)
- `examples/ch11/databases/unit-3-repository/starter/app.py` - Flask app using direct ORM/session access in route handlers (students refactor this)
- `examples/ch11/databases/unit-3-repository/starter/models.py` - SQLAlchemy models carried over from Unit 2
- `examples/ch11/databases/unit-3-repository/starter/repositories/base_repository.py` - Partial abstract Repository base class (some methods stubbed as TODOs)
- `examples/ch11/databases/unit-3-repository/solution/repositories/base_repository.py` - Complete abstract Repository defining `get_by_id`, `get_all`, `add`, `update`, `delete`
- `examples/ch11/databases/unit-3-repository/solution/repositories/book_repository.py` - Concrete Repository with entity-specific query methods (e.g., `get_by_isbn`)
- `examples/ch11/databases/unit-3-repository/solution/repositories/member_repository.py` - Concrete Repository with entity-specific query methods (e.g., `get_by_email`)
- `examples/ch11/databases/unit-3-repository/solution/app.py` - Flask app wired to use repositories instead of direct ORM access in route handlers
- `examples/ch11/databases/unit-3-repository/.gitignore` - Ignore `*.db`, `__pycache__`, `.venv/`

### Unit 4: Indexes and Query Optimization Basics

- `examples/ch11/databases/unit-4-optimization/README.md` - Setup instructions and exercise (find/fix N+1 queries, add indexes, measure improvement)
- `examples/ch11/databases/unit-4-optimization/requirements.txt` and `pyproject.toml` - Pinned dependencies (Flask, SQLAlchemy)
- `examples/ch11/databases/unit-4-optimization/starter/app.py` - Flask app with an intentional N+1 query problem (e.g., listing loans then accessing `.book.title` per row) and missing indexes on foreign key / lookup columns
- `examples/ch11/databases/unit-4-optimization/starter/models.py` - Models without `index=True` on frequently-queried columns
- `examples/ch11/databases/unit-4-optimization/solution/app.py` - Fixed app using `selectinload`/`joinedload` to eliminate N+1 queries
- `examples/ch11/databases/unit-4-optimization/solution/models.py` - Models with appropriate indexes added
- `examples/ch11/databases/unit-4-optimization/solution/query_log_before.txt` - Captured `echo=True` SQL log showing N+1 query pattern (before)
- `examples/ch11/databases/unit-4-optimization/solution/query_log_after.txt` - Captured `echo=True` SQL log showing single/batched query pattern (after)
- `examples/ch11/databases/unit-4-optimization/.gitignore` - Ignore `*.db`, `__pycache__`, `.venv/`

### Unit 5: NoSQL Databases

- `examples/ch11/databases/unit-5-nosql/redis-caching/README.md` - Setup instructions for the Redis caching exercise
- `examples/ch11/databases/unit-5-nosql/redis-caching/docker-compose.yml` - Redis service (redis:7-alpine, bound to localhost)
- `examples/ch11/databases/unit-5-nosql/redis-caching/requirements.txt` and `pyproject.toml` - Pinned Flask + redis-py dependencies
- `examples/ch11/databases/unit-5-nosql/redis-caching/starter/app.py` - Flask app with an expensive DB query and TODO comments for adding cache-aside logic
- `examples/ch11/databases/unit-5-nosql/redis-caching/solution/app.py` - Complete cache-aside implementation (check cache, fall back to DB, populate cache, TTL)
- `examples/ch11/databases/unit-5-nosql/redis-caching/.env.example` - Example environment variables (REDIS_HOST, REDIS_PORT) with no real secrets
- `examples/ch11/databases/unit-5-nosql/document-store/README.md` - Setup instructions for the document storage exercise
- `examples/ch11/databases/unit-5-nosql/document-store/docker-compose.yml` - MongoDB service (mongo:7) with basic auth configured, bound to localhost
- `examples/ch11/databases/unit-5-nosql/document-store/requirements.txt` and `pyproject.toml` - Pinned Flask + pymongo dependencies
- `examples/ch11/databases/unit-5-nosql/document-store/starter/app.py` - Flask app skeleton for storing/retrieving flexible-schema documents (e.g., user preferences)
- `examples/ch11/databases/unit-5-nosql/document-store/solution/app.py` - Complete document storage implementation (insert, query, update preference documents)
- `examples/ch11/databases/unit-5-nosql/document-store/.env.example` - Example environment variables (MONGO_USER, MONGO_PASSWORD placeholders) with no real secrets
- `examples/ch11/databases/unit-5-nosql/*/.gitignore` - Ignore `__pycache__`, `.venv/`, `.env`

### Unit 6: Integration Exercise

- `examples/ch11/databases/unit-6-integration/README.md` - Problem statement (blog platform: users, posts, comments, tags, categories), deliverables, and self-assessment pointer
- `examples/ch11/databases/unit-6-integration/requirements.txt` and `pyproject.toml` - Pinned Flask + SQLAlchemy (+ optional redis) dependencies
- `examples/ch11/databases/unit-6-integration/starter/app.py` - Flask app skeleton with basic routing/templates, no data layer implemented
- `examples/ch11/databases/unit-6-integration/starter/templates/` - Minimal Jinja templates so students focus on the data layer, not HTML
- `examples/ch11/databases/unit-6-integration/solution/models.py` - Complete SQLAlchemy models (4-6 entities, 3NF, proper relationships and indexes)
- `examples/ch11/databases/unit-6-integration/solution/repositories/` - Complete Repository implementations for all entities
- `examples/ch11/databases/unit-6-integration/solution/app.py` - Complete Flask app demonstrating CRUD via repositories, eager loading, and optional Redis caching
- `examples/ch11/databases/unit-6-integration/solution/docker-compose.yml` - Optional Redis service for the caching extension
- `examples/ch11/templates/database-self-assessment.md` - Self-assessment checklist covering schema design, ORM usage, Repository implementation, and optimization
- `examples/ch11/databases/unit-6-integration/.gitignore` - Ignore `*.db`, `__pycache__`, `.venv/`, `.env`

### Quiz

- `src/quizzes/chapter-11/11.4/databases-quiz.js` - Interactive quiz covering normalization identification, ACID scenarios, index usage, N+1 identification, and SQL vs NoSQL decision-making, following quizdown format

### Navigation

- `docs/_sidebar.md` - Update to add 11.4 Databases under the Application Development / Design Patterns navigation tree

### Notes

- All Python examples target Python 3.11+, are pinned in both `requirements.txt` and `pyproject.toml`, and are tested on ARM-based macOS (M1/M2/M3)
- SQLAlchemy is pinned to `SQLAlchemy>=2.0,<3.0` using 2.x declarative-style models across every unit
- Units 1-4 use SQLite only (file-based, no server); Unit 5 introduces docker-compose for Redis and MongoDB; Unit 6 optionally reuses the Unit 5 Redis compose file
- Every example directory is self-contained with its own README, `.gitignore`, and starter/solution split (Units 1-4, 6) or starter/solution split within each NoSQL subfolder (Unit 5)
- Front-matter metadata will be consolidated by the pre-commit hook into `docs/README.md` via `npm run refresh-front-matter`
- This section builds directly on `docs/11-application-development/11.2.2-data-layer-patterns.md` (Repository Pattern) - Unit 3 must explicitly cross-reference it

## Tasks

### [ ] 1.0 Create Unit 1: SQL Fundamentals and Schema Design

**Purpose:** Introduce relational database fundamentals, normalization (1NF-3NF), ACID properties, and transactions, then have students design and implement a normalized schema in SQLite with raw SQL CRUD and JOIN queries.

#### 1.0 Proof Artifact(s)

- File: `docs/11-application-development/11.4-databases.md` exists with front-matter and an "SQL Fundamentals and Schema Design" section covering tables/keys/relationships, normalization (1NF-3NF), ACID, and denormalization guidance
- Diagram: `docs/11-application-development/img11/library-schema-erd.png` shows a normalized ER diagram for the library system example (books, authors, members, loans)
- Directory: `examples/ch11/databases/unit-1-sql/` contains a starter codebase (`starter/init_db.py`, `starter/sample_data.sql`) and a complete solution (`solution/schema.sql`, `solution/queries.sql`, `solution/seed.py`)
- CLI: `python solution/seed.py` in `unit-1-sql/` creates a SQLite file, applies the schema, and loads sample data without errors
- CLI: Running the sample queries in `solution/queries.sql` against the seeded database returns expected rows (verified manually with `sqlite3` CLI)

#### 1.0 Tasks

- [ ] 1.1 Add front-matter to `docs/11-application-development/11.4-databases.md` (category: Software Development, estReadingMinutes: 40) with the six exercises from the spec's Front-Matter Requirements section (SQL Schema Design 90min, SQLAlchemy ORM Implementation 120min, Repository Pattern Refactoring 120min, Query Optimization 90min, NoSQL Integration 90min, Integration Exercise 180min), reusing existing technology tags from `docs/README.md` where they already exist (e.g., SQL, Python, Docker) and only introducing new tags the spec requires (SQLite, SQLAlchemy, ORM, Repository Pattern, Query Optimization, Redis, NoSQL, Caching, Database Design)
- [ ] 1.2 Write H2 section "Databases & Data Persistence" introduction explaining the problem this section solves (bridging isolated SQL knowledge and real application data layers) and learning objectives, with an H3 "Prerequisites" note linking to 11.2 (especially 11.2.2 Data Layer Patterns)
- [ ] 1.3 Write H2 section "Relational Database Fundamentals" (H3 subsections: tables/rows/columns, primary keys, foreign keys, one-to-many relationships, many-to-many relationships) with small SQL snippets illustrating each concept
- [ ] 1.4 Write H2 section "Normalization: 1NF, 2NF, 3NF" showing a denormalized example table, then progressively normalizing it to 3NF, explaining what anomaly each step fixes (update/insert/delete anomalies) and when denormalizing for read-heavy/reporting workloads is acceptable
- [ ] 1.5 Write H2 section "Transactions and ACID Properties" explaining Atomicity, Consistency, Isolation, Durability with a concrete example (e.g., transferring a book copy between two locations) showing why the operations must be wrapped in a transaction
- [ ] 1.6 Write H2 section "Exercise 1: SQL Schema Design" with the problem statement ("Design a schema for a library system with books, authors, members, and loans"), required deliverables (ER diagram, CREATE TABLE statements, sample CRUD queries, at least one INNER JOIN and one LEFT JOIN query), and a link to the starter codebase in `examples/ch11/databases/unit-1-sql/`
- [ ] 1.7 Create `examples/ch11/databases/unit-1-sql/starter/init_db.py` with a connection helper function (opens/creates a SQLite file, enables foreign key enforcement with `PRAGMA foreign_keys = ON`) and a TODO comment block describing what students must build
- [ ] 1.8 Create `examples/ch11/databases/unit-1-sql/starter/sample_data.sql` with a handful of INSERT statements matching the target schema shape (authors, books, members) that students can adapt once their schema exists
- [ ] 1.9 Create `examples/ch11/databases/unit-1-sql/README.md` documenting the exercise problem statement, setup (`python3 -m venv`, no external deps needed), how to run `init_db.py`, and the deliverables checklist
- [ ] 1.10 Create `examples/ch11/databases/unit-1-sql/requirements.txt` (empty or stdlib-only note) and `pyproject.toml` declaring `requires-python = ">=3.11"`
- [ ] 1.11 Create `examples/ch11/databases/unit-1-sql/.gitignore` with `*.db`, `__pycache__/`, `.venv/`
- [ ] 1.12 Create `examples/ch11/databases/unit-1-sql/solution/schema.sql` with normalized (3NF) CREATE TABLE statements for authors, books, members, and loans, including primary keys, foreign keys, and a many-to-many join table for book/author if applicable
- [ ] 1.13 Create `examples/ch11/databases/unit-1-sql/solution/queries.sql` with commented SELECT/INSERT/UPDATE/DELETE examples plus at least one INNER JOIN (books with authors) and one LEFT JOIN (members with their loans, including members with zero loans)
- [ ] 1.14 Create `examples/ch11/databases/unit-1-sql/solution/seed.py` that creates the SQLite file, executes `schema.sql`, loads sample data, and prints a confirmation summary (row counts per table)
- [ ] 1.15 Design and export an ER diagram for the library schema (PlantUML or draw.io source, then export) and save the rendered image as `docs/11-application-development/img11/library-schema-erd.png`
- [ ] 1.16 Embed the ER diagram in the "Exercise 1" section of `11.4-databases.md` using an HTML `<img>` tag with descriptive alt text
- [ ] 1.17 Manually verify: run `python examples/ch11/databases/unit-1-sql/solution/seed.py`, then run the queries in `solution/queries.sql` against the resulting `.db` file with the `sqlite3` CLI and confirm expected row counts and join results

---

### [ ] 2.0 Create Unit 2: ORM Fundamentals with SQLAlchemy

**Purpose:** Introduce ORM concepts and SQLAlchemy 2.x declarative models, sessions, and relationship loading strategies, then have students convert their Unit 1 SQL schema into SQLAlchemy models and reimplement CRUD through the ORM.

#### 2.0 Proof Artifact(s)

- File: `docs/11-application-development/11.4-databases.md` includes an "ORM Fundamentals with SQLAlchemy" section covering what ORMs are, SQLAlchemy Core vs ORM, models, sessions, and lazy vs eager loading
- Directory: `examples/ch11/databases/unit-2-orm/` contains a starter codebase (`starter/app.py`, `starter/models.py` with TODOs) and a complete solution (`solution/app.py`, `solution/models.py`, `solution/seed.py`)
- CLI: `python solution/seed.py` in `unit-2-orm/` creates tables via SQLAlchemy `Base.metadata.create_all()` and seeds sample data without errors
- Diff: `solution/models.py` demonstrates one-to-many (Author -> Book) and many-to-many (Book <-> Category, or similar) relationships using SQLAlchemy 2.x declarative syntax

#### 2.0 Tasks

- [ ] 2.1 Write H2 section "ORM Fundamentals with SQLAlchemy" explaining what ORMs are, why they're used (type safety, reduced boilerplate, database abstraction), and trade-offs (learning curve, risk of inefficient generated queries)
- [ ] 2.2 Write H3 subsection "SQLAlchemy Core vs ORM" briefly contrasting the two layers and stating this section focuses on the ORM layer
- [ ] 2.3 Write H3 subsection "Defining Models" showing SQLAlchemy 2.x declarative class syntax (`DeclarativeBase`, `Mapped`, `mapped_column`), column type mapping, and defining one-to-many and many-to-many (association table) relationships
- [ ] 2.4 Write H3 subsection "Sessions and Transactions" explaining session creation, adding/committing objects, basic querying with `select()`, and rollback on error
- [ ] 2.5 Write H3 subsection "Relationship Loading Strategies" explaining lazy loading (default), eager loading (`joinedload`, `selectinload`), and guidance on when to use each (preview only - full treatment is in Unit 4)
- [ ] 2.6 Write H2 section "Exercise 2: Convert to SQLAlchemy Models" with instructions to convert the Unit 1 library schema into SQLAlchemy models and reimplement the Unit 1 CRUD operations through the ORM, linking to `examples/ch11/databases/unit-2-orm/`
- [ ] 2.7 Create `examples/ch11/databases/unit-2-orm/starter/models.py` with a partial declarative `Base`, one complete model (e.g., `Author`) as an example, and TODO comments for the remaining models (`Book`, `Member`, `Loan`) and their relationships
- [ ] 2.8 Create `examples/ch11/databases/unit-2-orm/starter/app.py` with a Flask app factory, SQLAlchemy engine/session configured against a local SQLite file, and TODO comments marking where CRUD routes should be added
- [ ] 2.9 Create `examples/ch11/databases/unit-2-orm/README.md` documenting the conversion exercise, setup (`pip install -r requirements.txt` or `uv sync`), how to run the Flask dev server, and the deliverables checklist
- [ ] 2.10 Create `examples/ch11/databases/unit-2-orm/requirements.txt` (Flask, SQLAlchemy>=2.0,<3.0) and `pyproject.toml` with `requires-python = ">=3.11"` and pinned versions
- [ ] 2.11 Create `examples/ch11/databases/unit-2-orm/.gitignore` with `*.db`, `__pycache__/`, `.venv/`
- [ ] 2.12 Create `examples/ch11/databases/unit-2-orm/solution/models.py` with complete SQLAlchemy 2.x declarative models for Author, Book, Member, and Loan, including a one-to-many relationship (Author -> Book) and a many-to-many relationship using an association table
- [ ] 2.13 Create `examples/ch11/databases/unit-2-orm/solution/app.py` with a complete Flask app exposing CRUD routes for at least Books and Members using SQLAlchemy sessions directly (Repository pattern comes in Unit 3)
- [ ] 2.14 Create `examples/ch11/databases/unit-2-orm/solution/seed.py` that calls `Base.metadata.create_all()` and seeds the same sample data used in Unit 1, so students can compare raw SQL vs ORM results
- [ ] 2.15 Manually verify: run `python examples/ch11/databases/unit-2-orm/solution/seed.py` then start `solution/app.py` and exercise each CRUD route with `curl`, confirming expected JSON responses

---

### [ ] 3.0 Create Unit 3: Repository Pattern Implementation

**Purpose:** Implement the Repository pattern from 11.2.2 with SQLAlchemy, showing students how to build a clean data access layer, then have them refactor their Unit 2 ORM application to use repositories.

#### 3.0 Proof Artifact(s)

- File: `docs/11-application-development/11.4-databases.md` includes a "Repository Pattern with a Real Database" section that explicitly references and links to `11.2.2-data-layer-patterns.md`
- Diagram: `docs/11-application-development/img11/repository-pattern-layers.png` shows the abstract Repository pattern (from 11.2.2) alongside the concrete SQLAlchemy implementation
- Directory: `examples/ch11/databases/unit-3-repository/` contains a starter codebase with direct ORM access in routes (`starter/app.py`) and a partial abstract Repository (`starter/repositories/base_repository.py`), plus a complete solution with at least two concrete repositories
- CLI: `python -c "from solution.repositories.book_repository import BookRepository"` (or equivalent smoke import/test) succeeds without errors, demonstrating the repositories are wired correctly

#### 3.0 Tasks

- [ ] 3.1 Write H2 section "Repository Pattern with a Real Database" opening with an explicit callback: "In 11.2.2 you learned the Repository Pattern in the abstract - now we'll implement it against a real SQLAlchemy-backed database," with a direct markdown link to `11.2.2-data-layer-patterns.md`
- [ ] 3.2 Write H3 subsection "Why Repositories with Databases" explaining testability (mocking repositories in unit tests), separation of concerns (business logic stays database-agnostic), and flexibility (swapping SQLite for PostgreSQL without touching callers)
- [ ] 3.3 Write H3 subsection "Building an Abstract Repository" showing a base Repository class/interface defining `get_by_id`, `get_all`, `add`, `update`, `delete`, followed by a concrete SQLAlchemy-backed implementation for one entity
- [ ] 3.4 Write H3 subsection "Entity-Specific Query Methods" showing how concrete repositories add methods beyond the base interface (e.g., `BookRepository.get_by_isbn`, `MemberRepository.get_by_email`)
- [ ] 3.5 Write H3 subsection "Wiring Repositories into Flask" showing how to instantiate repositories in the application factory and use them in route handlers instead of direct session/query access
- [ ] 3.6 Write H2 section "Exercise 3: Refactor to Repository Pattern" with instructions to refactor the Unit 2 Flask app to use repositories for at least two entities, linking to `examples/ch11/databases/unit-3-repository/`
- [ ] 3.7 Produce a diagram (PlantUML or draw.io) showing the abstract Repository pattern layered diagram from 11.2.2 next to the concrete SQLAlchemy version for this section, export and save as `docs/11-application-development/img11/repository-pattern-layers.png`, and embed it in the "Repository Pattern with a Real Database" section with alt text
- [ ] 3.8 Create `examples/ch11/databases/unit-3-repository/starter/models.py` carried over from the Unit 2 solution models (Author, Book, Member, Loan)
- [ ] 3.9 Create `examples/ch11/databases/unit-3-repository/starter/app.py` with Flask routes that access the SQLAlchemy session and models directly (no repository abstraction), representative of the "before" state students refactor
- [ ] 3.10 Create `examples/ch11/databases/unit-3-repository/starter/repositories/base_repository.py` with an abstract base class where `get_by_id` and `get_all` are implemented but `add`, `update`, and `delete` are left as `raise NotImplementedError` TODOs for students to complete
- [ ] 3.11 Create `examples/ch11/databases/unit-3-repository/README.md` documenting the refactoring exercise, explicit reference to 11.2.2, setup instructions, and a deliverables checklist (at least 2 repositories implemented, routes updated to use them)
- [ ] 3.12 Create `examples/ch11/databases/unit-3-repository/requirements.txt` and `pyproject.toml` matching Unit 2's pinned Flask/SQLAlchemy versions
- [ ] 3.13 Create `examples/ch11/databases/unit-3-repository/.gitignore` with `*.db`, `__pycache__/`, `.venv/`
- [ ] 3.14 Create `examples/ch11/databases/unit-3-repository/solution/repositories/base_repository.py` with the complete abstract Repository (`get_by_id`, `get_all`, `add`, `update`, `delete`) using a SQLAlchemy `Session`
- [ ] 3.15 Create `examples/ch11/databases/unit-3-repository/solution/repositories/book_repository.py` and `solution/repositories/member_repository.py`, each extending the base and adding at least one entity-specific query method
- [ ] 3.16 Create `examples/ch11/databases/unit-3-repository/solution/app.py` with the Flask app factory instantiating repositories and using them exclusively in route handlers (no direct session queries in routes)
- [ ] 3.17 Manually verify: start `solution/app.py`, exercise the CRUD routes with `curl`, and confirm behavior matches the Unit 2 solution while route handler code only calls repository methods

---

### [ ] 4.0 Create Unit 4: Indexes and Query Optimization Basics

**Purpose:** Teach indexes, the N+1 query problem, and eager loading solutions, then have students identify and fix N+1 queries and missing indexes in a provided codebase, measuring the improvement.

#### 4.0 Proof Artifact(s)

- File: `docs/11-application-development/11.4-databases.md` includes a "Query Optimization Basics" section covering indexes, the N+1 problem, eager loading, and `echo=True` query analysis
- Directory: `examples/ch11/databases/unit-4-optimization/` contains a starter codebase with an intentional N+1 query problem and missing indexes, plus a solution with eager loading and indexes applied
- File: `solution/query_log_before.txt` and `solution/query_log_after.txt` capture the actual SQL emitted (via `echo=True`) demonstrating N queries reduced to 1-2 queries
- CLI: Running `starter/app.py` with `SQLALCHEMY_ECHO=True` against the seeded data visibly emits N+1 queries for a list-then-loop-relationship-access route; running `solution/app.py` the same way emits a single batched query for the same route

#### 4.0 Tasks

- [ ] 4.1 Write H2 section "Indexes" explaining what indexes are, B-tree basics at a conceptual level, and when to add them (frequently filtered/joined columns, foreign keys), including SQLAlchemy syntax for `index=True` on a column and standalone `Index()` constructs
- [ ] 4.2 Write H2 section "The N+1 Query Problem" with a concrete before/after code example: loading a list of Loans then accessing `loan.book.title` in a loop (N+1 queries) vs the same loop with `selectinload(Loan.book)` (1-2 queries)
- [ ] 4.3 Write H3 subsection "Solutions to N+1" covering eager loading (`joinedload`, `selectinload`), writing explicit joins, and batch loading, with guidance on choosing between them
- [ ] 4.4 Write H3 subsection "Basic Query Analysis" showing how to enable `echo=True` on the SQLAlchemy engine to log emitted SQL and how to read the log to spot repeated near-identical queries
- [ ] 4.5 Write H3 subsection "Optimization Guidelines" as a bulleted callout: always eager load relationships used in list views, paginate large result sets, avoid loading unnecessary columns with `defer()`
- [ ] 4.6 Write H2 section "Exercise 4: Find and Fix N+1 Queries" with instructions to run the starter app with query logging enabled, identify the N+1 problem(s), fix them with eager loading, add missing indexes, and capture before/after query logs, linking to `examples/ch11/databases/unit-4-optimization/`
- [ ] 4.7 Create `examples/ch11/databases/unit-4-optimization/starter/models.py` reusing the Unit 2/3 models but without `index=True` on the foreign key / lookup columns (e.g., `Loan.member_id`, `Loan.book_id`)
- [ ] 4.8 Create `examples/ch11/databases/unit-4-optimization/starter/app.py` with a route that lists Loans and accesses `loan.book.title` and `loan.member.name` in a loop without eager loading, intentionally causing N+1 queries, with a comment marking it as the bug to find
- [ ] 4.9 Create `examples/ch11/databases/unit-4-optimization/README.md` documenting the exercise, how to enable `echo=True` (env var or config flag), the deliverables (fixed code + before/after query logs), and how to add indexes
- [ ] 4.10 Create `examples/ch11/databases/unit-4-optimization/requirements.txt` and `pyproject.toml` matching prior units' pinned Flask/SQLAlchemy versions
- [ ] 4.11 Create `examples/ch11/databases/unit-4-optimization/.gitignore` with `*.db`, `__pycache__/`, `.venv/`
- [ ] 4.12 Create `examples/ch11/databases/unit-4-optimization/solution/models.py` with `index=True` added to foreign key and frequently-filtered columns
- [ ] 4.13 Create `examples/ch11/databases/unit-4-optimization/solution/app.py` with the same list route rewritten to use `selectinload` (or `joinedload`) to eliminate the N+1 pattern
- [ ] 4.14 Run the starter app with `echo=True` against seeded data, capture the emitted SQL for the list route, and save it as `examples/ch11/databases/unit-4-optimization/solution/query_log_before.txt`
- [ ] 4.15 Run the solution app with `echo=True` against the same seeded data, capture the emitted SQL for the same route, and save it as `examples/ch11/databases/unit-4-optimization/solution/query_log_after.txt`, confirming a visible reduction in query count
- [ ] 4.16 Optionally create a simple before/after comparison image or table summarizing query counts and save as `docs/11-application-development/img11/n-plus-one-before-after.png`, embedding it in the "N+1 Query Problem" section

---

### [ ] 5.0 Create Unit 5: NoSQL Databases - Redis Caching and Document Storage

**Purpose:** Teach the CAP theorem basics, NoSQL categories, and SQL-vs-NoSQL decision criteria, then provide hands-on Redis caching and document storage exercises with docker-compose setups.

#### 5.0 Proof Artifact(s)

- File: `docs/11-application-development/11.4-databases.md` includes a "NoSQL Databases" section covering CAP theorem basics, NoSQL categories (document, key-value, column-family, graph), and SQL vs NoSQL decision criteria
- Directory: `examples/ch11/databases/unit-5-nosql/redis-caching/` contains a working starter/solution pair with `docker-compose.yml` running `redis:7-alpine` bound to localhost
- Directory: `examples/ch11/databases/unit-5-nosql/document-store/` contains a working starter/solution pair with `docker-compose.yml` running `mongo:7` with basic auth configured
- CLI: `docker compose up -d` in both `redis-caching/` and `document-store/` starts successfully, and the solution apps in each connect and perform their respective caching/document operations without errors

#### 5.0 Tasks

- [ ] 5.1 Write H2 section "NoSQL Databases" introducing the CAP theorem (Consistency, Availability, Partition tolerance) at a conceptual level and how NoSQL databases make different trade-offs than relational databases
- [ ] 5.2 Write H3 subsection "Types of NoSQL Databases" categorizing document stores (MongoDB), key-value stores (Redis), column-family (Cassandra), and graph databases (Neo4j) with one sentence on primary use case for each
- [ ] 5.3 Write H3 subsection "SQL vs NoSQL: Decision Criteria" with a grid2/grid3 comparison table: use SQL for structured data with complex relationships and transactional integrity; use NoSQL for flexible schemas, horizontal scaling, or specialized access patterns
- [ ] 5.4 Write H2 section "Hands-On: Redis for Caching" explaining cache-aside pattern (check cache, fall back to DB on miss, populate cache, set TTL) and use cases (session storage, API response caching, rate limiting)
- [ ] 5.5 Write H2 section "Exercise 5a: Add Redis Caching" with instructions to add caching to an expensive query from a previous unit's application, linking to `examples/ch11/databases/unit-5-nosql/redis-caching/`
- [ ] 5.6 Create `examples/ch11/databases/unit-5-nosql/redis-caching/docker-compose.yml` running `redis:7-alpine`, port-mapped to `127.0.0.1:6379:6379` only (not exposed to the network)
- [ ] 5.7 Create `examples/ch11/databases/unit-5-nosql/redis-caching/starter/app.py` with a Flask route performing an intentionally slow DB query (e.g., `time.sleep(0.5)` simulated latency) and a TODO comment block for adding cache-aside logic with redis-py
- [ ] 5.8 Create `examples/ch11/databases/unit-5-nosql/redis-caching/solution/app.py` with the complete cache-aside implementation: check Redis first, on miss query DB and populate cache with a TTL, on hit return cached value directly
- [ ] 5.9 Create `examples/ch11/databases/unit-5-nosql/redis-caching/README.md`, `requirements.txt` (Flask, redis pinned), `pyproject.toml`, `.env.example` (REDIS_HOST=localhost, REDIS_PORT=6379), and `.gitignore` (`__pycache__/`, `.venv/`, `.env`)
- [ ] 5.10 Write H2 section "Hands-On: Document Storage" explaining flexible-schema JSON-like documents and a concrete use case (storing user preferences or activity logs)
- [ ] 5.11 Write H2 section "Exercise 5b: Document Storage" with instructions to implement storing and retrieving user preference documents using a document store, linking to `examples/ch11/databases/unit-5-nosql/document-store/`
- [ ] 5.12 Create `examples/ch11/databases/unit-5-nosql/document-store/docker-compose.yml` running `mongo:7` with `MONGO_INITDB_ROOT_USERNAME`/`MONGO_INITDB_ROOT_PASSWORD` set from environment variables (documented as development-only credentials), port-mapped to localhost only
- [ ] 5.13 Create `examples/ch11/databases/unit-5-nosql/document-store/starter/app.py` with a Flask app skeleton connected to MongoDB via `pymongo` and TODO comments for insert/query/update operations on a `preferences` collection
- [ ] 5.14 Create `examples/ch11/databases/unit-5-nosql/document-store/solution/app.py` with complete routes to create, retrieve, and update flexible-schema preference documents
- [ ] 5.15 Create `examples/ch11/databases/unit-5-nosql/document-store/README.md`, `requirements.txt` (Flask, pymongo pinned), `pyproject.toml`, `.env.example` (MONGO_USER, MONGO_PASSWORD placeholders clearly labeled "development only"), and `.gitignore` (`__pycache__/`, `.venv/`, `.env`)
- [ ] 5.16 Manually verify: `docker compose up -d` in both `redis-caching/` and `document-store/`, run each solution app, and exercise the routes with `curl` confirming cache hits/misses behave correctly and documents persist and retrieve correctly; then `docker compose down` to confirm clean teardown

---

### [ ] 6.0 Create Unit 6: Integration Exercise - Building a Complete Data Layer

**Purpose:** Synthesize schema design, SQLAlchemy ORM, Repository pattern, query optimization, and optional NoSQL caching into a single comprehensive exercise building a blog platform data layer.

#### 6.0 Proof Artifact(s)

- File: `docs/11-application-development/11.4-databases.md` includes an "Integration Exercise" section with the blog platform problem statement, required deliverables, and a link to the self-assessment checklist
- File: `examples/ch11/templates/database-self-assessment.md` exists with quality criteria for schema design, ORM usage, Repository implementation, and optimization
- Directory: `examples/ch11/databases/unit-6-integration/` contains a starter Flask skeleton (routing/templates only, no data layer) and a complete reference solution with models, repositories, and optional Redis caching for a blog platform (users, posts, comments, tags, categories)
- CLI: `python solution/seed.py` followed by running `solution/app.py` in `unit-6-integration/` demonstrates working CRUD for all 4-6 entities via the Repository pattern with eager loading applied to list views

#### 6.0 Tasks

- [ ] 6.1 Write H2 section "Integration Exercise: Building a Complete Data Layer" with the problem statement ("Build a blog platform with users, posts, comments, tags, and categories"), explicitly framing it as synthesizing Units 1-5
- [ ] 6.2 Write the required deliverables list: normalized (3NF) schema with 4-6 entities, SQLAlchemy models with proper relationships, Repository pattern for all entities, appropriate indexes, working CRUD for all entities, N+1 prevention via eager loading, and optional Redis caching for frequently accessed data
- [ ] 6.3 Add a link to the self-assessment checklist (`examples/ch11/templates/database-self-assessment.md`) and to the starter codebase in `examples/ch11/databases/unit-6-integration/`
- [ ] 6.4 Create `examples/ch11/databases/unit-6-integration/starter/app.py` with a Flask app factory, basic routing structure (e.g., `/posts`, `/posts/<id>`), and minimal Jinja templates under `starter/templates/`, with no data layer implemented yet (TODO comments marking where models/repositories/routes go)
- [ ] 6.5 Create `examples/ch11/databases/unit-6-integration/README.md` with the full problem statement, setup instructions, deliverables checklist, and a note that the self-assessment checklist should be used before considering the exercise complete
- [ ] 6.6 Create `examples/ch11/databases/unit-6-integration/requirements.txt` and `pyproject.toml` (Flask, SQLAlchemy>=2.0,<3.0, redis optional/commented) and `.gitignore` (`*.db`, `__pycache__/`, `.venv/`, `.env`)
- [ ] 6.7 Create `examples/ch11/databases/unit-6-integration/solution/models.py` with normalized (3NF) SQLAlchemy models for User, Post, Comment, Tag, and Category, including a many-to-many relationship (Post <-> Tag) and appropriate indexes on foreign keys and lookup columns
- [ ] 6.8 Create `examples/ch11/databases/unit-6-integration/solution/repositories/` with a `base_repository.py` and concrete repositories for at least User, Post, and Comment, each with at least one entity-specific query method
- [ ] 6.9 Create `examples/ch11/databases/unit-6-integration/solution/app.py` implementing full CRUD routes for all entities via repositories, using `selectinload`/`joinedload` on list views to prevent N+1 queries
- [ ] 6.10 Create `examples/ch11/databases/unit-6-integration/solution/seed.py` seeding realistic fictional sample data (no real names/emails) across all entities
- [ ] 6.11 Optionally add Redis caching to one frequently-accessed route (e.g., popular posts) in `solution/app.py`, with `examples/ch11/databases/unit-6-integration/solution/docker-compose.yml` providing the Redis service (reusing the Unit 5 pattern), clearly marked as an optional extension
- [ ] 6.12 Create `examples/ch11/templates/database-self-assessment.md` with a checklist organized by category: Schema Design (3NF? appropriate relationships? constraints?), ORM Usage (models correctly mapped? relationships defined?), Repository Pattern (base + concrete repositories implemented for all entities? routes use repositories, not direct session access?), Optimization (indexes added? N+1 queries prevented? eager loading used on list views?), and Overall (references 11.2.2 concepts? application runs end-to-end?)
- [ ] 6.13 Manually verify: run `python solution/seed.py` then start `solution/app.py`, exercise CRUD routes for every entity with `curl`, confirm eager loading prevents N+1 by checking `echo=True` logs on a list route, and walk through `database-self-assessment.md` confirming every item is satisfied

---

### [ ] 7.0 Create Interactive Quiz

**Purpose:** Provide an interactive quiz reinforcing normalization identification, ACID scenarios, index usage, N+1 identification, and SQL vs NoSQL decision-making, embedded at the end of the chapter.

#### 7.0 Proof Artifact(s)

- File: `src/quizzes/chapter-11/11.4/databases-quiz.js` exists, follows the quizdown format used by `src/quizzes/chapter-11/11.2.2/data-layer-patterns-quiz.js`, and ends with `export { rawQuizdown }`
- Diff: `docs/11-application-development/11.4-databases.md` embeds the quiz via `<div class="quizdown"><div id="chapter-11/11.4/databases-quiz.js"></div></div>`
- CLI: `npm start` serves the docs site and the quiz renders and is answerable at the bottom of the 11.4 page

#### 7.0 Tasks

- [ ] 7.1 Create `src/quizzes/chapter-11/11.4/databases-quiz.js` following the exact `rawQuizdown` template-literal + quizdown-markdown format used in `src/quizzes/chapter-11/11.2.2/data-layer-patterns-quiz.js`, including the `shuffleQuestions: true` / `shuffleAnswers: true` front-matter block
- [ ] 7.2 Write 2 questions on normalization identification (given a denormalized table, identify the anomaly or the correct normal form)
- [ ] 7.3 Write 2 questions on ACID properties and transaction scenarios (e.g., "which property guarantees a committed transaction survives a crash?")
- [ ] 7.4 Write 1-2 questions on when to add an index and how to recognize an N+1 query problem from a code snippet
- [ ] 7.5 Write 1-2 questions on SQL vs NoSQL decision-making given a described application requirement
- [ ] 7.6 Ensure the file ends with exactly `export { rawQuizdown }` and contains 6-8 total questions with plausible distractors and explanation text (`>` blockquote) for every option, matching the style of the 11.2.2 quiz
- [ ] 7.7 Add the quiz embed `<div class="quizdown"><div id="chapter-11/11.4/databases-quiz.js"></div></div>` at the end of `11.4-databases.md`, after the Integration Exercise section
- [ ] 7.8 Run `npm start`, navigate to the 11.4 page, and manually verify the quiz renders, questions display, and answer selection/feedback works correctly

---

### [ ] 8.0 Update Navigation and Verify Integration

**Purpose:** Wire the new section into site navigation, consolidate front-matter into the master record, and verify the complete chapter lints cleanly and functions end-to-end.

#### 8.0 Proof Artifact(s)

- Diff: `docs/_sidebar.md` includes an entry for `11.4 - Databases & Data Persistence` under the Chapter 11 navigation tree
- CLI: `npm start` successfully builds and serves the documentation with `11.4-databases.md` accessible from the sidebar
- CLI: `npm run lint` passes with no errors on `docs/11-application-development/11.4-databases.md`
- CLI: `npm run refresh-front-matter` successfully consolidates the 11.4 front-matter into `docs/README.md`
- Diff: `docs/README.md` contains the consolidated front-matter entry for `docs/11-application-development/11.4-databases.md` with all six exercises

#### 8.0 Tasks

- [ ] 8.1 Update `docs/_sidebar.md` to add `- [11.4 - Databases & Data Persistence](11-application-development/11.4-databases.md)` immediately after the existing 11.2.2 entry (or after the last existing 11.x entry if additional sections have since been added)
- [ ] 8.2 Run `npm start` and verify `11.4-databases.md` is reachable from the sidebar, all H2 sections appear in the in-page table of contents, all embedded images render, and all internal links (to 11.2.2, to example READMEs if linked) resolve
- [ ] 8.3 Run `npm run lint` against the repository and fix any markdown linting issues in `11.4-databases.md` and any other files touched in this task list
- [ ] 8.4 Run `npm run refresh-front-matter` and verify `docs/README.md` now includes the consolidated front-matter block for `docs/11-application-development/11.4-databases.md` with all six exercises and correct technologies
- [ ] 8.5 Do a final end-to-end pass: follow the chapter in order (read content, run Unit 1 through Unit 6 example apps, complete the quiz) confirming every exercise's starter codebase runs, every solution codebase runs and matches its README, and no broken links or missing images remain

---

## Notes

This implementation focuses on creating educational content, runnable example applications, templates, and exercise instructions rather than production features. The proof artifacts emphasize demonstrating that students have everything needed to complete the learning objectives independently.

All content follows established bootcamp patterns:
- Documentation in `docs/11-application-development/`
- Examples in `examples/ch11/databases/`
- Images in `docs/11-application-development/img11/`
- Quiz in `src/quizzes/chapter-11/11.4/`
- Front-matter metadata for analytics, consolidated via the pre-commit hook
- Explicit integration with 11.2.2 Data Layer Patterns (Repository pattern)
- Generous time estimates reflecting a six-month bootcamp for first-time learners with no prior database exposure

### Testing Commands

- `python examples/ch11/databases/unit-N-*/solution/seed.py` - Seed each unit's database with sample data
- `docker compose up -d` (in `unit-5-nosql/redis-caching/` and `unit-5-nosql/document-store/`) - Verify NoSQL dependencies start
- `SQLALCHEMY_ECHO=True python examples/ch11/databases/unit-4-optimization/starter/app.py` vs `solution/app.py` - Compare query logs
- `npm run lint` - Verify markdown formatting follows repository standards
- `npm run refresh-front-matter` - Consolidate front-matter into `docs/README.md`
- `npm start` - Manual review of rendered content, images, and quiz
