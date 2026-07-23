# 04 Questions Round 1 - REST API Design & OpenAPI

Please answer each question below (select one or more options, or add your own notes). Feel free to add additional context under any question.

## 1. REST Principles Coverage Depth

What level of REST principles and architectural constraints should be covered?

- [ ] (A) Basic: HTTP methods (GET, POST, PUT, DELETE), status codes (200, 404, 500), resource naming - suitable for students with no API experience
- [x] (B) Intermediate: Above plus Richardson Maturity Model (Levels 0-3), HATEOAS concepts, idempotency, proper use of HTTP headers (Content-Type, Accept, caching headers)
- [ ] (C) Advanced: Above plus REST constraints (statelessness, cacheability, layered system), deep dive on hypermedia, advanced caching strategies, content negotiation
- [ ] (D) Practical focus only: Focus on how to design good APIs in practice, less emphasis on REST theory and architectural constraints
- [ ] (E) Other (describe)

## 2. OpenAPI Specification Approach

How should OpenAPI (Swagger) specification be taught and used?

- [ ] (A) Manual YAML writing: Teach students to hand-write OpenAPI 3.x specs in YAML, understanding all components (paths, schemas, parameters, responses)
- [ ] (B) Code-first with generation: Write API code first, then generate OpenAPI spec from code annotations/decorators (e.g., using Flask-RESTX, FastAPI)
- [ ] (C) Spec-first design: Write OpenAPI spec first, then implement API to match the spec (design-first approach)
- [ ] (D) Hybrid: Introduce OpenAPI concepts with manual YAML, then show code generation tools for real projects
- [ ] (E) Use visual tools: Leverage Swagger Editor or Stoplight for visual spec creation, export to YAML
- [ ] (F) Other (describe)

## 3. API Framework Selection

Which Python framework should be used for REST API examples and exercises?

- [ ] (A) Flask with Flask-RESTX: Lightweight, students already used Flask in databases section, Flask-RESTX adds OpenAPI generation
- [ ] (B) FastAPI: Modern, automatic OpenAPI generation, type hints, async support, increasingly popular
- [ ] (C) Django REST Framework: Comprehensive, powerful, but tied to Django
- [ ] (D) Plain Flask: Keep it simple with basic Flask, manually implement REST patterns
- [ ] (E) Multiple frameworks: Show concepts in 2 frameworks to demonstrate patterns are framework-agnostic
- [ ] (F) Other (describe)

## 4. API Design Exercise Complexity

What should students build for hands-on API design exercises?

- [ ] (A) Extend databases exercise: Take the data layer from 11.4 (spec-03) and add REST API on top, building naturally from previous work
- [ ] (B) New standalone API: Design a new API from scratch (e.g., "Task Management API", "Library API") independent of previous exercises
- [ ] (C) Redesign existing API: Given a poorly designed API, students refactor it following REST best practices
- [ ] (D) Progressive build: Multiple exercises building up complexity (Exercise 1: simple CRUD, Exercise 2: add filtering/pagination, Exercise 3: add relationships)
- [ ] (E) Real-world API clone: Students design an API similar to a well-known public API (GitHub, Stripe, Twitter) learning from real examples
- [ ] (F) Other (describe)

## 5. API Versioning Strategy

How much should API versioning be covered?

- [ ] (A) Not covered: Skip versioning, focus on initial API design
- [ ] (B) Concepts only: Explain why versioning is needed, mention common approaches (URL path, header, query param) but don't implement
- [ ] (C) Implement one strategy: Choose one versioning approach (e.g., URL path versioning like `/v1/users`) and have students implement it
- [ ] (D) Compare strategies: Show multiple versioning approaches, discuss trade-offs, let students choose one to implement
- [ ] (E) Other (describe)

## 6. Request/Response Design Topics

Which request/response design topics should be emphasized?

- [ ] (A) Pagination: Offset/limit, cursor-based pagination, page-based pagination
- [ ] (B) Filtering and searching: Query parameters for filtering collections (e.g., `?status=active&sort=created_at`)
- [ ] (C) Sorting: Ascending/descending, multiple sort fields
- [ ] (D) Field selection: Sparse fieldsets (e.g., `?fields=id,name,email` to return only specific fields)
- [ ] (E) Error responses: Consistent error format, error codes, validation errors, problem details (RFC 7807)
- [ ] (F) Relationships: How to represent related resources (embedding, linking, side-loading)
- [ ] (G) All of the above: Comprehensive coverage of common request/response patterns
- [ ] (H) Other (describe)

## 7. API Testing Coverage

What level of API testing should be taught?

- [ ] (A) Manual testing only: Using Postman, curl, or HTTP clients for manual API testing
- [ ] (B) Unit testing: Testing individual API endpoints with pytest and test client
- [ ] (C) Integration testing: Testing full request/response cycles including database interactions
- [ ] (D) Contract testing: Testing that API matches OpenAPI spec using tools like Schemathesis or Dredd
- [ ] (E) All of the above: Comprehensive testing approach covering manual, automated, and contract testing
- [ ] (F) Other (describe)

## 8. API Documentation Approach

How should API documentation be generated and presented?

- [ ] (A) OpenAPI spec only: OpenAPI YAML is the documentation, use Swagger UI to render it
- [ ] (B) OpenAPI + written docs: OpenAPI for reference, plus written guides (getting started, authentication, common use cases)
- [ ] (C) Interactive documentation: Use tools like Swagger UI or ReDoc for interactive API exploration
- [ ] (D) Postman collections: Provide Postman collection for import and testing
- [ ] (E) Multiple formats: OpenAPI spec, Swagger UI, written guides, and Postman collection
- [ ] (F) Other (describe)

## 9. Authentication & Authorization Coverage

How much auth should be covered in this section vs deferred to 11.6 (Authentication & Authorization)?

- [ ] (A) Skip entirely: Authentication covered in 11.6, this section focuses only on API design without auth
- [ ] (B) Basic auth for exercises: Use simple API key or Basic auth just to make exercises functional, deep coverage in 11.6
- [ ] (C) Show auth patterns: Explain where auth fits in API design (headers, middleware), but implementation details in 11.6
- [ ] (D) Implement JWT: Since APIs often use JWT, implement it here and expand in 11.6
- [ ] (E) Other (describe)

## 10. Integration with Previous Sections

How should this section build on previous content?

- [ ] (A) Direct extension of 11.4 databases: "Take your database + Repository pattern from 11.4, now add REST API on top" - shows full stack
- [ ] (B) Standalone with references: Can work independently but references databases and Repository pattern when discussing data access
- [ ] (C) New example domain: Fresh start with new domain to reinforce that patterns apply universally, not just to previous exercises
- [ ] (D) Other (describe)

## 11. API Design Best Practices Emphasis

Which API design best practices should be most emphasized?

- [ ] (A) Resource naming: Plural nouns, nested resources, avoiding verbs in URLs
- [ ] (B) HTTP method semantics: GET is safe/idempotent, POST creates, PUT replaces, PATCH updates, DELETE removes
- [ ] (C) Status codes: Proper use of 2xx, 4xx, 5xx codes for different scenarios
- [ ] (D) Idempotency: Understanding which operations should be idempotent and why
- [ ] (E) Consistency: Maintaining consistent patterns across the API (naming, structure, errors)
- [ ] (F) All of the above: Comprehensive best practices coverage
- [ ] (G) Other (describe)
