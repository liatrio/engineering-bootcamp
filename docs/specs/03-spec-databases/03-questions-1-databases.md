# 03 Questions Round 1 - Databases & Data Persistence

Please answer each question below (select one or more options, or add your own notes). Feel free to add additional context under any question.

## 1. SQL Database Coverage Depth

What level of SQL database design and normalization should be covered?

- [ ] (A) Basic: Simple tables, primary keys, foreign keys, basic SQL queries (SELECT, INSERT, UPDATE, DELETE) - suitable for students with no database experience
- [x] (B) Intermediate: Above plus normalization (1NF-3NF), indexes, transactions, ACID properties - assumes some database coursework
- [ ] (C) Advanced: Above plus query optimization, execution plans, database-specific features, performance tuning - for students with database experience
- [ ] (D) Focus on data modeling patterns only: Emphasize how to design schemas for applications, less focus on query writing
- [ ] (E) Other (describe)

## 2. NoSQL Coverage Approach

How should NoSQL databases be covered in this section?

- [ ] (A) Conceptual only: Explain when to use NoSQL vs SQL, different types (document, key-value, graph, column-family), but no hands-on implementation
- [ ] (B) Single NoSQL type with hands-on: Pick one type (e.g., document store like MongoDB or key-value like Redis) and provide practical exercises
- [x] (C) Multiple NoSQL types with examples: Cover 2-3 types with small examples showing different use cases
- [ ] (D) Skip NoSQL entirely: Focus only on SQL/relational databases in depth
- [ ] (E) Other (describe)

## 3. ORM Framework Selection

Which ORM framework(s) should be used for teaching and examples?

- [x] (A) Python: SQLAlchemy (most popular, comprehensive, used in industry) mention that ORM concepts apply broadly
- [ ] (B) Python: Django ORM (simpler, but tied to Django framework)
- [ ] (C) Go: GORM (popular Go ORM with active record pattern)
- [ ] (D) TypeScript: TypeORM or Prisma (modern, type-safe ORMs)
- [ ] (E) Multiple ORMs across languages: Show patterns in 2-3 languages to demonstrate ORM concepts are universal
- [ ] (F) Other (describe)

## 4. Hands-On Exercise Complexity

What level of complexity should the hands-on database exercises have?

- [ ] (A) Simple: Single entity exercises (e.g., "Build a task list with SQLite" - one table, basic CRUD)
- [ ] (B) Moderate: 2-3 related entities with relationships (e.g., "Blog system with users, posts, comments" - foreign keys, joins)
- [ ] (C) Realistic: 5-7 entities modeling a small application (e.g., "E-commerce system with users, products, orders, reviews, inventory")
- [x] (D) Progressive: Start simple, build up complexity through multiple exercises (e.g., Exercise 1: single table, Exercise 2: add relationships, Exercise 3: add complex queries)
- [ ] (E) Other (describe)

## 5. Data Modeling Patterns Emphasis

Which data modeling patterns should be emphasized?

- [x] (A) Repository Pattern focus: Deep dive on Repository pattern from 11.2.2, show how it works with real databases
- [ ] (B) Active Record Pattern focus: Emphasize Active Record pattern (ORM entities with data access methods)
- [ ] (C) Both Repository and Active Record: Compare and contrast both approaches, show when to use each
- [ ] (D) Include Unit of Work and Identity Map: Cover additional data persistence patterns beyond Repository/Active Record
- [ ] (E) Focus on schema design patterns: Normalization, denormalization, inheritance strategies, many-to-many relationships
- [ ] (F) Other (describe)

## 6. Query Optimization Coverage

How much should query optimization be covered?

- [ ] (A) Not covered: Keep focus on design and basic usage, skip optimization
- [x] (B) Basic concepts only: Explain indexes, N+1 queries, basic query analysis - no deep performance tuning
- [ ] (C) Moderate depth: Above plus EXPLAIN/ANALYZE, query plans, identifying slow queries
- [ ] (D) Advanced: Include performance profiling, database-specific optimizations, caching strategies
- [ ] (E) Other (describe)

## 7. Proof Artifacts and Demonstrable Outcomes

What proof artifacts would best demonstrate student learning for this section?

- [x] (A) Working application: Students build a small app with a proper database schema, demonstrating CRUD operations. Students should be given a starting point codebase to build upon.
- [ ] (B) Schema design deliverable: Students submit an ER diagram and SQL schema for a given problem
- [ ] (C) Query showcase: Students write and demonstrate complex queries (joins, aggregations, subqueries)
- [ ] (D) ORM implementation: Students implement data access layer using an ORM with proper patterns (Repository or Active Record)
- [ ] (E) All of the above: Comprehensive project including schema design, ORM usage, and working application
- [ ] (F) Other (describe)

## 8. Integration with Previous Sections

How should this section build on 11.2.2 Data Layer Patterns?

- [x] (A) Direct continuation: Explicitly reference and build on Repository/Active Record patterns taught in 11.2.2, showing "here's how to implement these with a real database"
- [ ] (B) Parallel teaching: Re-teach data layer patterns in the context of databases, can stand alone without 11.2.2
- [ ] (C) Quick refresher: Assume students remember 11.2.2, give a brief recap, then dive into database specifics
- [ ] (D) Other (describe)
