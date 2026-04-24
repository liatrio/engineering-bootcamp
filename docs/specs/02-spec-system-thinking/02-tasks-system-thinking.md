# 02 Tasks - System Thinking & Codebase Analysis

This task list breaks down the implementation of Chapter 11.3: System Thinking & Codebase Analysis specification into demoable units of work.

## Relevant Files

### Documentation

- `docs/11-application-development/11.3-system-thinking.md` - Main content page for Chapter 11.3 including all teaching content, exercises, and front-matter metadata

### Images and Diagrams

- `docs/11-application-development/img11/simple-system-sequence.png` - Rendered sequence diagram for simple example application
- `docs/11-application-development/img11/simple-system-component.png` - Rendered component diagram for simple example application
- `docs/11-application-development/img11/simple-system-dataflow.png` - Rendered data flow diagram for simple example application
- `docs/11-application-development/img11/otel-transaction-trace.png` - Rendered worked example transaction trace through OTel Demo services
- `docs/11-application-development/img11/diagram-types-comparison.png` - Visual comparing the three diagram types (optional)

### Simple Example Application

- `examples/ch11/simple-system/README.md` - Documentation explaining what the simple application does and its architecture
- `examples/ch11/simple-system/docker-compose.yml` - Multi-service orchestration configuration
- `examples/ch11/simple-system/frontend/app.py` - Flask frontend application (displays UI, calls backend API)
- `examples/ch11/simple-system/frontend/requirements.txt` - Python dependencies for frontend
- `examples/ch11/simple-system/frontend/pyproject.toml` - Python project configuration for frontend
- `examples/ch11/simple-system/frontend/templates/index.html` - Simple HTML template for frontend UI
- `examples/ch11/simple-system/backend/app.py` - Flask backend API application (business logic, database access)
- `examples/ch11/simple-system/backend/requirements.txt` - Python dependencies for backend
- `examples/ch11/simple-system/backend/pyproject.toml` - Python project configuration for backend
- `examples/ch11/simple-system/diagrams/sequence.puml` - PlantUML source for sequence diagram
- `examples/ch11/simple-system/diagrams/component.puml` - PlantUML source for component diagram
- `examples/ch11/simple-system/diagrams/dataflow.puml` - PlantUML source for data flow diagram
- `examples/ch11/simple-system/.gitignore` - Git ignore patterns for the example

### OTel Demo Setup and Tracing

- `examples/ch11/otel-demo-setup/README.md` - Setup guide with system requirements, installation instructions, and troubleshooting
- `examples/ch11/otel-demo-setup/docker-compose-subset.yml` - Optional simplified OTel Demo configuration with only 4-5 services enabled
- `examples/ch11/otel-demo-setup/diagrams/add-to-cart-trace.puml` - PlantUML source for worked example transaction trace

### Templates

- `examples/ch11/templates/architecture-readme-template.md` - Template structure for documenting application architecture
- `examples/ch11/templates/transaction-tracing-template.md` - Template for documenting transaction trace findings
- `examples/ch11/templates/adr-template.md` - Architectural Decision Record template
- `examples/ch11/templates/adr-example-grpc.md` - Example ADR analyzing "Why use gRPC between certain services?"
- `examples/ch11/templates/adr-example-frontend-ssr.md` - Example ADR analyzing "Why is the frontend server-side rendered?"
- `examples/ch11/templates/adr-example-multiple-databases.md` - Example ADR analyzing "Why use multiple databases?"
- `examples/ch11/templates/readme-enhancement-checklist.md` - Checklist of sections to include when documenting architecture
- `examples/ch11/templates/presentation-rubric.md` - Evaluation criteria for student presentations
- `examples/ch11/templates/presentation-outline.md` - Suggested structure for architecture walkthrough presentations

### Integration Exercise Materials

- `examples/ch11/templates/integration-self-assessment.md` - Self-assessment checklist for integration exercise
- `examples/ch11/integration-example/README.md` - Example README section documenting a feature/workflow
- `examples/ch11/integration-example/diagrams/sequence.puml` - Example sequence diagram for integration exercise
- `examples/ch11/integration-example/diagrams/component.puml` - Example component diagram for integration exercise
- `examples/ch11/integration-example/diagrams/dataflow.puml` - Example data flow diagram for integration exercise
- `examples/ch11/integration-example/adr-example.md` - Example ADR for integration exercise
- `examples/ch11/integration-example/presentation-outline.md` - Example presentation outline for integration exercise

### Notes

- PlantUML source files (.puml) are kept alongside examples so students can reference the diagram source code
- Rendered PNG images go in `docs/11-application-development/img11/` for inclusion in documentation
- All examples follow bootcamp patterns: Python 3.11+, Flask, SQLite, docker-compose, self-contained with README
- Front-matter metadata will be consolidated by pre-commit hook into `docs/README.md`

## Tasks

### [ ] 1.0 Create Introduction Section with Simple Application Example

**Purpose:** Build the foundation by creating the main documentation page with system thinking concepts, and provide a simple 2-3 service example application that students can analyze to learn diagram types.

#### 1.0 Proof Artifact(s)

- File: `docs/11-application-development/11.3-system-thinking.md` exists with introduction, learning objectives, and diagram type explanations demonstrates core educational content is complete
- Directory: `examples/ch11/simple-system/` contains working 2-3 service application (frontend, backend, database) with docker-compose demonstrates students have a concrete example to analyze
- Images: `docs/11-application-development/img11/` contains three example diagrams (sequence, component, data flow) for the simple application demonstrates visual examples of quality standards
- File: `examples/ch11/templates/architecture-readme-template.md` demonstrates students have guidance for documentation structure
- Running: `docker-compose up` in simple-system successfully starts all services and application is accessible demonstrates example is functional

#### 1.0 Tasks

- [ ] 1.1 Create `docs/11-application-development/11.3-system-thinking.md` with front-matter (category: Software Development, estReadingMinutes: 30), H2 section "System Thinking & Codebase Analysis", introduction explaining the importance of understanding existing codebases, and learning objectives
- [ ] 1.2 Add H2 section "Understanding System Diagrams" to `11.3-system-thinking.md` explaining the three diagram types: sequence diagrams (request/response flows with time dimension), component diagrams (service boundaries and dependencies), and data flow diagrams (information movement through system)
- [ ] 1.3 Add H2 section "Diagramming Tools" to `11.3-system-thinking.md` introducing code-based tools (PlantUML, Mermaid) and visual tools (Draw.io, Lucidchart), with pros/cons of each approach and links to getting started guides
- [ ] 1.4 Create directory structure `examples/ch11/simple-system/` with subdirectories for `frontend/`, `backend/`, and `diagrams/`
- [ ] 1.5 Create `examples/ch11/simple-system/README.md` documenting what the application does (e.g., "Simple task list application with web UI, REST API, and SQLite database"), its architecture (3 components: frontend, backend, database), and how to run it with docker-compose
- [ ] 1.6 Create `examples/ch11/simple-system/frontend/app.py` with a simple Flask application serving HTML templates and making HTTP requests to the backend API (e.g., display task list, add new task)
- [ ] 1.7 Create `examples/ch11/simple-system/frontend/templates/index.html` with a simple UI showing the application functionality (form to add items, list display)
- [ ] 1.8 Create `examples/ch11/simple-system/frontend/requirements.txt` and `frontend/pyproject.toml` with Flask dependency and Python 3.11+ requirement
- [ ] 1.9 Create `examples/ch11/simple-system/backend/app.py` with a Flask REST API providing endpoints (e.g., GET /tasks, POST /tasks) and using SQLite for data persistence
- [ ] 1.10 Create `examples/ch11/simple-system/backend/requirements.txt` and `backend/pyproject.toml` with Flask dependency and Python 3.11+ requirement
- [ ] 1.11 Create `examples/ch11/simple-system/docker-compose.yml` orchestrating frontend and backend services with appropriate port mappings and health checks
- [ ] 1.12 Create `examples/ch11/simple-system/.gitignore` with common patterns (*.pyc, __pycache__, .venv/, *.db, .DS_Store)
- [ ] 1.13 Create `examples/ch11/simple-system/diagrams/sequence.puml` with PlantUML source showing a complete request flow (User → Frontend → Backend → Database → Backend → Frontend → User)
- [ ] 1.14 Create `examples/ch11/simple-system/diagrams/component.puml` with PlantUML source showing the three components (Frontend, Backend, Database) with their dependencies and interfaces
- [ ] 1.15 Create `examples/ch11/simple-system/diagrams/dataflow.puml` with PlantUML source showing how data flows through the system (user input → form data → API request → database write → query → API response → UI display)
- [ ] 1.16 Render all three PlantUML diagrams to PNG and save in `docs/11-application-development/img11/` as `simple-system-sequence.png`, `simple-system-component.png`, `simple-system-dataflow.png`
- [ ] 1.17 Add H2 section "Exercise 1: Simple Application Analysis" to `11.3-system-thinking.md` with instructions to run the simple-system application, examine its code, and create all three diagram types with reference to the example diagrams
- [ ] 1.18 Embed the three example diagram images in `11.3-system-thinking.md` using HTML img tags with proper alt text, showing students what quality diagrams look like
- [ ] 1.19 Create `examples/ch11/templates/architecture-readme-template.md` with sections: Overview (what does it do?), Architecture (components and their responsibilities), Communication Patterns (how components interact), Data Storage (what data is stored and where), Key Decisions (why was it built this way?)
- [ ] 1.20 Test that `docker-compose up` in `examples/ch11/simple-system/` successfully starts all services, and verify the application is accessible and functional (can add/view items)

---

### [ ] 2.0 Create OTel Demo Integration Content and Transaction Tracing Materials

**Purpose:** Provide setup guidance and worked examples for analyzing the OpenTelemetry Demo Application, enabling students to trace multi-service transactions.

#### 2.0 Proof Artifact(s)

- File: `examples/ch11/otel-demo-setup/README.md` with setup instructions, system requirements, and troubleshooting demonstrates students can run OTel Demo locally
- File: Section in `docs/11-application-development/11.3-system-thinking.md` explaining transaction tracing methodology demonstrates teaching content for the skill
- Images: `docs/11-application-development/img11/` contains worked example sequence diagram tracing a complete transaction through 3-5 OTel Demo services demonstrates transaction tracing quality standard
- File: `examples/ch11/templates/transaction-tracing-template.md` with structured format for documenting findings demonstrates students have guidance for documenting traces
- File: Exercise instructions in `11.3-system-thinking.md` for progressive discovery exercise demonstrates clear task assignment for students

#### 2.0 Tasks

- [ ] 2.1 Create directory `examples/ch11/otel-demo-setup/` with subdirectory `diagrams/`
- [ ] 2.2 Create `examples/ch11/otel-demo-setup/README.md` with introduction to the OTel Demo Application (what it is, why we're using it), system requirements (Docker, RAM, CPU, disk), and links to official repository
- [ ] 2.3 Add setup instructions to `otel-demo-setup/README.md` covering: cloning the official OTel Demo repository, pinning to a specific stable release (research and specify version), running with docker-compose, and verifying all services are healthy
- [ ] 2.4 Add troubleshooting section to `otel-demo-setup/README.md` covering common issues: insufficient RAM (recommend 8GB+), port conflicts, ARM compatibility notes for M1/M2/M3 Macs, and container startup failures
- [ ] 2.5 Create optional `examples/ch11/otel-demo-setup/docker-compose-subset.yml` with a simplified configuration running only 4-5 core services to reduce system requirements (document which services and why in README)
- [ ] 2.6 Add H2 section "Transaction Tracing Methodology" to `docs/11-application-development/11.3-system-thinking.md` explaining the systematic approach: identify entry point, follow HTTP/gRPC calls, examine request/response payloads, identify data transformations, map service dependencies, and document findings
- [ ] 2.7 Add H2 section "Worked Example: Tracing 'Add to Cart' in OTel Demo" to `11.3-system-thinking.md` with step-by-step walkthrough of tracing a transaction through 3-5 services (e.g., Frontend → Cart Service → Product Catalog Service → Redis)
- [ ] 2.8 Create `examples/ch11/otel-demo-setup/diagrams/add-to-cart-trace.puml` with PlantUML source showing the complete sequence diagram for the worked example transaction
- [ ] 2.9 Render `add-to-cart-trace.puml` to PNG and save as `docs/11-application-development/img11/otel-transaction-trace.png`
- [ ] 2.10 Embed the worked example diagram in the "Worked Example" section of `11.3-system-thinking.md` using HTML img tag with alt text
- [ ] 2.11 Create `examples/ch11/templates/transaction-tracing-template.md` with structured sections: Transaction Name, Entry Point (URL/endpoint and HTTP method), Services Involved (list with brief role description), Request Flow (step-by-step with service → service arrows), Data Transformations (what data changes at each step), Potential Failure Points (where could this break?), and Notes
- [ ] 2.12 Add H2 section "Exercise 2: Transaction Tracing in OTel Demo" to `11.3-system-thinking.md` with progressive discovery exercise instructions: starting point (e.g., "Trace the checkout flow starting from the 'Place Order' button"), guidance on using code search and logs to discover the flow, and requirement to create a sequence diagram and document using the tracing template
- [ ] 2.13 Add guidance in the exercise section about how to explore the codebase: using grep/ripgrep to find API endpoints, examining service READMEs for architecture info, using docker logs to see service communication, and following code from controllers to service layers

---

### [ ] 3.0 Create Architecture Documentation and Communication Teaching Materials

**Purpose:** Develop content teaching ADRs, README documentation, and presentation skills, with templates and rubrics to guide student work.

#### 3.0 Proof Artifact(s)

- File: Section in `docs/11-application-development/11.3-system-thinking.md` explaining ADRs (purpose, structure, when to write) demonstrates teaching content for technical writing
- File: `examples/ch11/templates/adr-template.md` with proper ADR structure demonstrates template students will use
- Files: `examples/ch11/templates/adr-example-*.md` (2-3 examples analyzing OTel Demo decisions) demonstrates ADR quality standards
- File: `examples/ch11/templates/readme-enhancement-checklist.md` demonstrates what sections students should include when documenting architecture
- File: `examples/ch11/templates/presentation-rubric.md` with evaluation criteria demonstrates quality standards for presentations
- File: `examples/ch11/templates/presentation-outline.md` demonstrates suggested presentation structure

#### 3.0 Tasks

- [ ] 3.1 Add H2 section "Architectural Decision Records (ADRs)" to `docs/11-application-development/11.3-system-thinking.md` explaining what ADRs are (documents capturing important architectural decisions), why they matter (historical record, knowledge transfer, decision rationale), and when to write them (significant decisions affecting structure, technology choices, design patterns)
- [ ] 3.2 Explain ADR structure in the ADR section: Title (short descriptive name), Status (proposed/accepted/deprecated), Context (what's the situation requiring a decision?), Decision (what did we decide?), Consequences (what are the positive and negative outcomes?), and optional sections (Alternatives Considered, References)
- [ ] 3.3 Create `examples/ch11/templates/adr-template.md` with the proper structure outlined in 3.2, including guidance comments for each section explaining what content to include
- [ ] 3.4 Create `examples/ch11/templates/adr-example-grpc.md` analyzing the decision "Why use gRPC between certain services in OTel Demo?" with realistic context (need for efficient inter-service communication), decision (use gRPC for internal service-to-service calls), and consequences (pros: type safety, performance; cons: complexity, debugging difficulty)
- [ ] 3.5 Create `examples/ch11/templates/adr-example-frontend-ssr.md` analyzing "Why is the frontend server-side rendered?" with context (need for good performance and SEO), decision (use server-side rendering with Next.js), and consequences
- [ ] 3.6 Create `examples/ch11/templates/adr-example-multiple-databases.md` analyzing "Why use multiple databases?" with context (different data access patterns for different services), decision (polyglot persistence approach), and consequences
- [ ] 3.7 Add H2 section "Documenting Architecture in README Files" to `11.3-system-thinking.md` explaining the purpose of architecture documentation, what makes good documentation (clear, concise, up-to-date, audience-appropriate), and common sections to include
- [ ] 3.8 Create `examples/ch11/templates/readme-enhancement-checklist.md` with checkboxes for: System Overview (1-2 paragraph description), Architecture Diagram (component or system diagram), Service Responsibilities (what does each service do?), Communication Patterns (how do services talk to each other?), Data Storage (databases, caches, message queues), Technology Stack (languages, frameworks, key libraries), Key Architectural Decisions (link to ADRs or brief explanations), Setup and Running (how to get it working locally)
- [ ] 3.9 Add H2 section "Presenting Technical Architecture" to `11.3-system-thinking.md` explaining why presentation skills matter (communicating with team, onboarding new members, design reviews), effective presentation structure (start with overview, zoom into details, show diagrams, explain trade-offs), and best practices (know your audience, tell a story, use visuals, practice)
- [ ] 3.10 Create `examples/ch11/templates/presentation-outline.md` with suggested structure: Introduction (1-2 min: what system/feature are you presenting?), System Overview (2-3 min: show component diagram, explain high-level architecture), Deep Dive (5-7 min: show sequence diagram, walk through a transaction, explain key decisions), Trade-offs and Alternatives (2-3 min: what are the pros/cons, what else was considered?), Q&A (2-3 min: be prepared for questions about decisions and details)
- [ ] 3.11 Create `examples/ch11/templates/presentation-rubric.md` with evaluation criteria and scoring (1-5 scale): Clarity (easy to follow, well-organized, clear speech), Accuracy (technically correct, no major misunderstandings), Completeness (covers all required topics, sufficient depth), Effective Use of Diagrams (diagrams are clear, properly explained, support the narrative), Time Management (within 10-15 minute target), Q&A Handling (answers questions confidently, acknowledges unknowns appropriately)
- [ ] 3.12 Add H2 section "Exercise 3: Architecture Documentation & Presentation" to `11.3-system-thinking.md` with instructions for students to: write 2-3 ADRs analyzing architectural decisions in OTel Demo (provide example prompts), create or enhance a README section documenting OTel Demo architecture (specify which sections to include), prepare and deliver/record a 10-15 minute walkthrough presentation (specify required content: overview, diagrams, transaction flow, trade-offs), and use the provided templates and rubric for self-assessment

---

### [ ] 4.0 Create Integration Exercise and Assessment Materials

**Purpose:** Provide comprehensive integration exercise that synthesizes all skills, with self-assessment tools and optional extensions for advanced students.

#### 4.0 Proof Artifact(s)

- File: Section in `docs/11-application-development/11.3-system-thinking.md` with complete integration exercise instructions demonstrates clear assignment for students
- File: `examples/ch11/templates/integration-self-assessment.md` with checklist of quality criteria demonstrates students can verify completeness
- Directory: `examples/ch11/integration-example/` containing example deliverables (all three diagram types, README section, ADR, presentation outline) demonstrates expected quality
- File: Section in `11.3-system-thinking.md` with optional advanced extensions demonstrates enrichment opportunities
- File: `docs/11-application-development/11.3-system-thinking.md` has complete front-matter with all four exercises and proper metadata demonstrates section is ready for bootcamp integration

#### 4.0 Tasks

- [ ] 4.1 Add H2 section "Exercise 4: Integration Exercise" to `docs/11-application-development/11.3-system-thinking.md` explaining this is a comprehensive exercise synthesizing all skills from the chapter
- [ ] 4.2 Add integration exercise instructions to `11.3-system-thinking.md`: students select a feature or workflow in OTel Demo not covered in previous exercises (provide examples: "product recommendation flow", "payment processing", "email notification system"), perform complete analysis, and produce all deliverables
- [ ] 4.3 Specify required deliverables in exercise instructions: component diagram showing all involved services and their dependencies, sequence diagram showing complete transaction flow with all service interactions, data flow diagram showing information movement and transformations, README section documenting the feature/workflow (following checklist), ADR analyzing one architectural decision related to the feature, and recorded or live presentation (10-15 minutes) walking through the analysis
- [ ] 4.4 Create directory `examples/ch11/integration-example/` with subdirectory `diagrams/`
- [ ] 4.5 Create `examples/ch11/integration-example/README.md` documenting an example feature analysis (e.g., "Product Recommendation System") with all required sections: overview, architecture, services involved, transaction flow, key decisions
- [ ] 4.6 Create `examples/ch11/integration-example/diagrams/component.puml` showing an example component diagram for the chosen feature with 3-5 services and their relationships
- [ ] 4.7 Create `examples/ch11/integration-example/diagrams/sequence.puml` showing an example sequence diagram for a complete transaction in the chosen feature
- [ ] 4.8 Create `examples/ch11/integration-example/diagrams/dataflow.puml` showing an example data flow diagram for the chosen feature
- [ ] 4.9 Render all three integration example diagrams to PNG and save in `docs/11-application-development/img11/` with appropriate names (e.g., `integration-example-component.png`)
- [ ] 4.10 Create `examples/ch11/integration-example/adr-example.md` analyzing one architectural decision from the example feature (e.g., "Why use a separate recommendation service?")
- [ ] 4.11 Create `examples/ch11/integration-example/presentation-outline.md` showing a complete presentation outline for the example feature analysis with all sections filled in
- [ ] 4.12 Create `examples/ch11/templates/integration-self-assessment.md` with checklist organized by deliverable type: Diagrams (all three types created? clear and accurate? follow conventions?), Documentation (README includes all sections? ADR follows template? writing is clear?), Presentation (within time limit? covers all topics? effective use of diagrams? prepared for questions?), and Overall (demonstrates understanding of architecture? identifies trade-offs? shows system-level thinking?)
- [ ] 4.13 Add H2 section "Optional Advanced Extensions" to `11.3-system-thinking.md` with enrichment activities: analyze failure scenarios and recovery mechanisms (what happens when a service goes down? how does the system recover?), compare OTel Demo architecture to alternative approaches (monolith vs microservices, synchronous vs event-driven), propose architectural improvements with justification (what would you change and why? what are the trade-offs?), and implement a simplified version of one service as a learning exercise
- [ ] 4.14 Add front-matter metadata to the top of `docs/11-application-development/11.3-system-thinking.md` following the spec requirements: category "Software Development", estReadingMinutes 30, and exercises array with all four exercises (Simple Application Analysis: 90 min, Transaction Tracing: 120 min, Documentation & Presentation: 150 min, Integration Exercise: 180 min) with proper technologies listed
- [ ] 4.15 Add H2 section "Summary and Next Steps" to `11.3-system-thinking.md` reviewing what students learned (system-level thinking, diagram types, transaction tracing, technical communication) and previewing how these skills will be used in later chapters (11.7 Debugging & Observability, 11.8 Production Development)
- [ ] 4.16 Review the complete `11.3-system-thinking.md` file for consistency, proper markdown formatting (H2 for navigation sections, H3 for content subsections), internal cross-references, and ensure all images are properly embedded with alt text
- [ ] 4.17 Verify all template files exist and are complete, all example diagrams are rendered, and all exercise instructions are clear and actionable
- [ ] 4.18 Test the complete learning path by following the exercises in order: run simple-system, create diagrams, set up OTel Demo, trace a transaction, write documentation, review templates and examples - ensure everything works as documented

---

## Notes

This implementation focuses on creating educational content, example applications, templates, and exercise instructions rather than building production features. The proof artifacts emphasize demonstrating that students will have all materials needed to complete the learning objectives.

All content follows established bootcamp patterns:
- Documentation in `docs/11-application-development/`
- Examples in `examples/ch11/`
- Images in `docs/11-application-development/img11/`
- Front-matter metadata for analytics
- Progressive complexity building on 11.0-11.2

### Testing Commands

- `docker-compose up` in `examples/ch11/simple-system/` - Verify example application runs
- `plantuml *.puml` or use online PlantUML renderer - Generate diagram PNGs from source
- `npm run lint` - Verify markdown formatting follows repository standards
- Manual review of all content for clarity, accuracy, and completeness
