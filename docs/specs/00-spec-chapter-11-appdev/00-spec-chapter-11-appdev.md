# 00-spec-chapter-11-appdev.md

## Introduction/Overview

This is the **parent specification** for the complete Chapter 11: Application Development expansion in the DevOps Bootcamp. This chapter transforms students from understanding basic programming and data structures into developers capable of building, analyzing, and maintaining production applications using AI-assisted workflows.

**Target Audience**: College CSCI students in their senior year with strong programming fundamentals but limited experience building production applications.

**Core Philosophy**: Give apprentices hands-on experience with application development using AI-assisted workflows, including Spec-Driven Development for large-scale changes.

This parent spec coordinates eight child specifications that build the chapter sequentially:

| Spec | Title | Status | Priority |
| ---- | ----- | ------ | -------- |
| **01** | Design Patterns (11.2.2-11.2.5) | 🔍 IN REVIEW (PRs #822, #824, #826) | P0 |
| **02** | System Thinking & Codebase Analysis (11.3) | 🚧 BUILT, ARM VALIDATION PENDING (PR #914, #920) | P1 |
| **03** | Databases & Data Persistence (11.4) | 📝 SPEC WRITTEN, TASKS IN PROGRESS (#919) | P1 |
| **04** | REST API Design & OpenAPI (11.5) | ❓ QUESTIONS IN FLIGHT (#918) | P1 |
| **05** | Authentication & Authorization (11.6) | 📋 PLANNED | P1 |
| **06** | Debugging & Observability (11.7) | 📋 PLANNED | P2 |
| **07** | Production Development & Digital Clone (11.8) | 📋 PLANNED | P2 |
| **08** | Infrastructure: Terraform/AWS One-Command OTel Demo Environment | 📋 PLANNED | P1 |

**Spec 08** is a standalone infrastructure spec consumed by Specs 06 and 07: it defines the committed-Terraform, one-command AWS environment those two production specs deploy into, so it must land before either is implemented.

**Deferred Topics** (to be specced later based on student needs):
- Front-end best practices & component design
- Dependency injection & lifecycle scopes
- Additional backend patterns (Mediator, CQRS)
- Application debugging (stepping through code)
- Frontend-to-backend integration patterns
- Development workflows
- Functional vs OOP considerations

---

## Goals

### Chapter-Level Learning Objectives

By the end of Chapter 11, students should be able to:

1. **Apply Design Patterns**: Understand and implement SOLID principles, data layer patterns (Repository, Active Record), business logic patterns (Transaction Script, Domain Model), and classical GoF patterns (Strategy, Factory, Observer, Decorator)

2. **Analyze Complex Codebases**: Develop system thinking skills to trace transactions through microservice architectures, create system diagrams, and understand existing applications

3. **Build Data-Driven Applications**: Design SQL databases, use NoSQL appropriately, implement ORMs, and apply data modeling best practices

4. **Design REST APIs**: Create well-designed REST APIs following OpenAPI specifications, with proper documentation and testing

5. **Implement Authentication & Authorization**: Apply OAuth/OIDC, understand frontend/backend auth patterns, and implement security best practices

6. **Debug Production Applications**: Leverage observability instrumentation (metrics, logs, traces) to diagnose and resolve issues in production-like environments

7. **Work in Production Contexts**: Develop and release fixes, implement features without triggering alerts, perform zero-downtime migrations, and rebuild services as digital clones

8. **Use Spec-Driven Development**: Follow spec-driven workflows to define application behavior and drive code changes with AI assistance for large-scale production work

9. **Collaborate in Shared Environments**: Work within shared dev/prod environments while maintaining high SLA through disciplined deployment and monitoring

### Strategic Goals

1. **Bridge Theory to Practice**: Connect academic computer science knowledge to real-world production application development

2. **Embrace AI-Assisted Development**: Teach students to work effectively with AI tools, using structured workflows (SDD) for complex changes

3. **Develop Production Mindset**: Instill practices around observability, safe deployments, and production operational excellence

4. **Build Pattern Recognition**: Enable students to recognize and apply proven patterns in existing codebases and new development

5. **Prepare for Professional Work**: Ensure students can contribute to enterprise applications on day one of their careers

---

## User Stories

**As a bootcamp student**, I want to understand how production applications are structured so that I can read and contribute to enterprise codebases.

**As a bootcamp student**, I want hands-on experience with databases, APIs, and authentication so that I have core skills needed for full-stack development.

**As a bootcamp student**, I want to practice debugging production issues using telemetry so that I can diagnose problems in real applications.

**As a bootcamp student**, I want to learn Spec-Driven Development so that I can collaborate with AI effectively on large-scale changes.

**As a bootcamp student**, I want to rebuild existing services as digital clones so that I gain confidence modernizing legacy applications.

**As a bootcamp instructor**, I want modular chapter sections so that I can adjust pacing and coverage based on student needs and time constraints.

**As a bootcamp instructor**, I want students working with realistic production scenarios so that they develop judgment about trade-offs and operational concerns.

---

## Chapter Structure & Sequencing

### Current State (Completed)

**11.0 Overview** ✅
- Introduction to application architecture
- Why architecture matters
- Chapter roadmap

**11.1 Layered Architecture** ✅
- Presentation, business logic, and data layers
- Hands-on comparison: tightly coupled vs layered
- Refactoring exercise: in-memory to SQLite
- Deliverables: understanding separation of concerns

**11.2 Design Patterns** ✅
- Overview connecting SOLID to patterns

**11.2.1 SOLID Principles** ✅
- Five principles with Python examples
- Interactive exercises and quizzes
- Code smell warnings and refactoring practice

**Spec 01: Design Patterns Subsections (11.2.2-11.2.5)** ✅ COMPLETE
- Data Layer Patterns (Repository, Active Record, concurrency)
- Business Logic Patterns (Transaction Script, Domain Model, Service Layer)
- Classical GoF Patterns (Strategy, Factory, Observer, Decorator)
- Integrated Refactoring Exercise

### Phase 1: Foundation (Understanding Applications)

**Spec 02: System Thinking & Codebase Analysis (11.3)** 📋 PLANNED
- Analyzing existing applications
- Creating system diagrams (sequence, component, data flow)
- Tracing transactions through services
- Documentation and communication skills
- Hands-on with realistic microservice architecture

**Why This Phase**: Students must learn to READ and UNDERSTAND code before effectively writing it. System thinking develops the mental models needed for production work.

### Phase 2: Foundational Topics (Core Production Skills)

**Spec 03: Databases & Data Persistence (11.4)** 📋 PLANNED
- SQL database design and normalization
- NoSQL patterns and use cases
- ORM usage and patterns
- Data modeling exercises
- Query optimization basics

**Spec 04: REST API Design & OpenAPI (11.5)** 📋 PLANNED
- REST principles and best practices
- OpenAPI/Swagger specification
- API versioning strategies
- Request/response design
- API testing and documentation
- Hands-on API design exercise

**Spec 05: Authentication & Authorization (11.6)** 📋 PLANNED
- OAuth 2.0 and OIDC flows
- JWT tokens and session management
- Frontend authentication patterns
- Backend authorization patterns
- Security best practices
- Hands-on auth implementation

**Why This Phase**: These three topics (Databases, APIs, Auth) are fundamental to nearly every production application. Students need solid understanding before tackling production scenarios.

### Phase 3: Production Work (Hands-On Experience)

**Spec 08: Infrastructure — Terraform/AWS One-Command OTel Demo Environment** 📋 PLANNED (standalone, consumed by Specs 06 & 07)
- Committed Terraform under `examples/` that provisions the OTel Demo App into the learner's own AWS account with a single command
- Single EC2 VM running the OTel Demo App's official Docker Compose (researched direction, see [issue #921](https://github.com/liatrio/engineering-bootcamp/issues/921)): ~$1/day while running, clean `terraform destroy` teardown
- k3s-on-EC2 fallback if Spec 07 needs pod/Service-level blue-green (same cost/teardown profile, real Kubernetes API)
- No GitHub Actions coupling — learners `cd` into the example directory and run `make`/`terraform apply` themselves

**Spec 06: Debugging & Observability (11.7)** 📋 PLANNED
- Introduction to production environments
- Working with OTel Demo App or similar
- Metrics, logs, and traces
- Using telemetry to diagnose issues
- Memory leak exercise (following OTel demo)
- Root cause analysis workflow
- **SDD Introduction**: First exposure to Spec-Driven Workflow integrated into production exercise

**Spec 07: Production Development & Digital Clone (11.8)** 📋 PLANNED
- Developing and releasing production fixes
- Implementing features without triggering alerts
- Maintaining SLA in shared environments
- Reverse-engineering existing services
- Rebuilding services as digital clones (new stack/framework)
- Zero-downtime migrations
- Automated testing for feature parity
- **SDD Application**: Using Spec-Driven Workflow for large-scale production changes

**Why This Phase**: Students apply all foundational knowledge in realistic scenarios. Production experience builds judgment about trade-offs, operational concerns, and safe deployment practices.

---

## Key Design Decisions

### 1. Sequential Phases Over Topic Organization

**Decision**: Organize specs by learning progression (Foundation → Topics → Production) rather than by topic similarity.

**Rationale**:
- Students need to understand applications before building them
- Core topics (DB, API, Auth) should be learned before production scenarios
- Production work synthesizes all previous learning
- Clear progression shows students their growth

### 2. Integrate SDD Into Production Exercises

**Decision**: Teach Spec-Driven Development through doing, starting in Spec 06 (Debugging & Observability).

**Rationale**:
- Learning by doing is more effective than abstract instruction
- Students see the value when applying SDD to real production scenarios
- Timing aligns with complexity that benefits from structured workflows
- Avoids front-loading methodology before students understand the problems it solves

### 3. Select Core Topics, Defer Advanced Topics

**Decision**: Include Databases, REST APIs, and Authentication in initial specs. Defer frontend patterns, additional backend patterns, and advanced topics.

**Rationale**:
- These three topics are universal in production applications
- Limited time requires prioritization
- Can add deferred topics based on student feedback and needs
- Avoids overwhelming students with too many concepts

### 4. Infrastructure Requirements Over Implementation

**Decision**: Specs define what infrastructure is needed (dev/prod environments, monitoring) but defer specific implementation decisions to task planning.

**Rationale**:
- Separates "what" from "how"
- Allows flexibility in implementation approach
- Can adapt to available resources and technologies
- Spec remains stable while implementation can evolve

### 5. Multi-Language Examples

**Decision**: Distribute code examples across Python, Go, and TypeScript based on pedagogical fit.

**Rationale**:
- Exposes students to multiple paradigms
- Matches language to pattern strengths (e.g., Go for interfaces, TypeScript for type safety)
- Prepares students for polyglot professional environments
- Existing chapter uses Python primarily, providing continuity

### 6. Use OTel Demo App for Production Exercises

**Decision**: Base production exercises (Spec 06-07) on OpenTelemetry Demo Application or similar.

**Rationale**:
- Already includes full observability instrumentation
- Realistic microservice architecture
- Well-documented with known exercises
- Active community support
- Students can continue exploration independently

### 7. AWS Infrastructure via Committed Terraform (No CI Coupling)

**Decision**: Production exercises (Specs 06-08) deploy to the learner's **own AWS account**, provisioned by **Terraform committed directly in the repo** under `examples/`. There is no GitHub Actions coupling — a learner `cd`s into the relevant example directory and runs a single command (`make` / `terraform apply`).

**Rationale**:
- The bootcamp is open source; a design that requires shared or CI-managed cloud credentials doesn't work once the repo is forked
- Self-contained `examples/` directories keep the "one command to run it" promise consistent with the rest of the chapter's examples
- Researched deployment direction ([issue #921](https://github.com/liatrio/engineering-bootcamp/issues/921)): a single EC2 VM running the OTel Demo App's official Docker Compose via thin Terraform is the primary path (~$1/day while running, $0 between exercises, clean `terraform destroy`); single-node k3s on EC2 is the fallback if Spec 07 needs pod/Service-level blue-green. EKS (managed or Fargate) and ECS/Fargate were ruled out — always-on control-plane cost, orphaned ELB/ENI teardown risk, and no supported compose→ECS translation
- Spec 08 (new, standalone) owns this infrastructure so Specs 06 and 07 can both consume it without duplicating Terraform

### 8. Framework-Agnostic, One Language Per Section

**Decision**: The chapter is framework-agnostic. Each section deliberately uses a different language to highlight one core principle, rather than standardizing on a single stack throughout.

**Rationale**:
- Keeps the pattern being taught distinct from the framework that happens to demonstrate it
- Matches language choice to the concept being taught (extends Decision #5's multi-language approach into an explicit per-section rule)
- Mirrors the polyglot reality of professional engineering organizations

### 9. Open Source — Anyone Can Take It

**Decision**: The bootcamp, including Chapter 11's production exercises, is open source. Anyone should be able to fork the repo and complete the chapter using only their own AWS account and free tooling — no Liatrio-internal access required.

**Rationale**:
- Rules out any solution coupled to Liatrio-internal CI/CD, secrets, or shared cloud accounts
- Directly motivates Decision #7 (committed Terraform, no CI coupling, self-contained `examples/`)
- Extends the bootcamp's reach beyond Liatrio's own cohorts

---

## Reference Materials

### Primary Sources

**dream-chapter-notes**: High-level vision and learning objectives for Chapter 11
- Defines overall goals: hands-on application development with AI-assisted workflows
- Outlines main sections: Design Patterns, System Thinking, Debugging, Production Work
- Lists topics for consideration (must-have and nice-to-have)
- Specifies audience: senior CSCI students with programming fundamentals

**patterns-of-enterprise-application-architecture-notes**: Detailed notes from Martin Fowler's book
- Three principal layers: Presentation, Domain Logic, Data Source
- Data layer patterns: Repository, Active Record, Gateway, Unit of Work, Identity Map
- Domain layer patterns: Transaction Script, Domain Model, Service Layer
- Concurrency patterns: Optimistic Locking, Pessimistic Locking, deadlock prevention
- Data mapping strategies and inheritance handling

### Existing Chapter Content

**11.0 Overview** (`docs/11-application-development/11.0-overview.md`)
- Introduction to application architecture
- Learning objectives for the chapter
- Motivation: maintainability, testability, flexibility, understandability

**11.1 Layers** (`docs/11-application-development/11.1-layers.md`)
- Layered architecture fundamentals
- Working examples: tightly coupled vs layered (Flask applications)
- Hands-on exercises: refactoring storage backends
- Demonstrates value of separation of concerns

**11.2 Design Patterns** (`docs/11-application-development/11.2-design-patterns.md`)
- Overview connecting SOLID to patterns
- Pattern categories: Creational, Structural, Behavioral
- Visual diagram showing connections

**11.2.1 SOLID Principles** (`docs/11-application-development/11.2.1-solid-principles.md`)
- Comprehensive coverage of five principles
- Python examples with before/after comparisons
- Code smell warnings
- Three hands-on exercises with test suites
- Interactive quiz

### Repository Standards

Based on `CLAUDE.md` and existing chapter structure:

**Content Organization**:
- Main docs in `docs/11-application-development/`
- Code examples in `examples/ch11/`
- Quizzes in `src/quizzes/chapter-11/`
- Images in `docs/11-application-development/img11/`

**Front-Matter Requirements**:
- YAML metadata with category, technologies, estReadingMinutes
- Exercises array with name, description, estMinutes, technologies

**Style Guidelines**:
- H2 headers for navigation (table of contents)
- H3 headers as default within sections
- HTML `<img>` tags for images
- Multi-column layouts using `grid2`, `grid3`, `grid4` classes

**Development Standards**:
- Python 3.11+ with `pyproject.toml`
- Go 1.21+ with Go modules
- Node.js 20+ with `package.json`
- SQLite for database examples (portability)
- All examples must be self-contained with README

---

## Success Metrics

### Completion Criteria

1. **All Eight Specs Complete**: Each child spec (01-08) has been generated, reviewed, and approved
2. **Documentation Coverage**: All planned sections (11.3-11.8) have markdown documentation
3. **Working Examples**: All code examples are self-contained, documented, and demonstrate concepts clearly
4. **Interactive Elements**: Quizzes exist for appropriate sections and render correctly in Docsify
5. **Production Exercises**: Students can work with realistic production scenarios using provided applications and infrastructure

### Learning Outcomes

Students completing Chapter 11 should demonstrate:

1. **Pattern Recognition**: Can identify SOLID violations and common design patterns in existing code
2. **System Understanding**: Can trace requests through microservice architectures and create accurate system diagrams
3. **Database Skills**: Can design SQL schemas, use ORMs, and apply data modeling patterns
4. **API Design**: Can design REST APIs following OpenAPI specifications
5. **Security Implementation**: Can implement authentication and authorization patterns
6. **Production Debugging**: Can use observability tools to diagnose and fix production issues
7. **SDD Proficiency**: Can follow Spec-Driven Development workflow for large-scale changes
8. **Professional Readiness**: Can contribute to enterprise codebases on day one of employment

### Quality Indicators

1. **Self-Contained Examples**: All code examples run without external dependencies beyond language tooling and SQLite
2. **Clear Learning Path**: Content builds sequentially with clear dependencies between sections
3. **Realistic Scenarios**: Production exercises reflect actual work students will encounter professionally
4. **Time Calibration**: Estimated times for reading and exercises are accurate based on target audience
5. **Accessibility**: Content assumes only senior-level CSCI knowledge, not production experience

---

## Dependencies & Constraints

### Technical Dependencies

- **Docsify**: Documentation system (no changes required)
- **Webpack**: Build system for bundling (no changes required)
- **Quiz Framework**: Existing JavaScript framework in `src/quizzes/`
- **Python 3.11+**: For Python examples and exercises
- **Go 1.21+**: For Go examples
- **Node.js 20+**: For TypeScript examples
- **SQLite**: For database examples (included with Python/Node, available for Go)
- **Git**: For version control and refactoring exercises
- **OTel Demo App**: For production exercises (Spec 06-07)
- **Terraform**: For committed, one-command infrastructure provisioning (Spec 08, consumed by Specs 06-07)
- **AWS Account (learner-owned)**: Target for Terraform-provisioned production exercises

### External Constraints

1. **Target Audience**: College seniors entering the bootcamp with strong general programming fundamentals but **no prior application-development exposure** — this is their first time building, deploying, or operating a real application.
2. **Time Constraints**: The bootcamp itself runs approximately **six months**, not a 2-3 week chapter budget. Chapter 11 has room to run its full sequential arc (Specs 01-08); overrunning the original 2-3 week estimate is acceptable — depth for first-time learners matters more than hitting a fixed calendar box.
3. **Platform**: Examples must work on modern ARM-based macOS (M1/M2/M3)
4. **AWS via Committed Terraform**: Production exercises (Specs 06-08) deploy to the **learner's own AWS account** using **Terraform committed in the repo** — no external/paid managed services beyond what that Terraform provisions, and no GitHub Actions coupling (the bootcamp is open source). Everything is self-contained under `examples/` so a learner can `cd` into the relevant directory and bring the environment up with one command (`make` / `terraform apply`). See Key Design Decision #7 and [issue #921](https://github.com/liatrio/engineering-bootcamp/issues/921) for the researched deployment direction (single EC2 VM + OTel Demo's Docker Compose, ~$1/day, clean teardown; k3s fallback).
5. **Bootcamp Context**: Fits within larger DevOps bootcamp curriculum (Chapters 1-10 completed)

### Content Constraints

1. **No Duplication**: Don't replicate content from Chapters 1-10 (containerization, CI/CD, etc.)
2. **Consistent Style**: Follow established bootcamp tone, structure, and formatting conventions
3. **Front-Matter Compliance**: All sections must include proper YAML metadata for analytics
4. **Generous Time Estimates**: Front-matter `estReadingMinutes` and exercise `estMinutes` must be **generous**, not optimistic — students are first-time application developers, and estimates should reflect that learning curve rather than an experienced engineer's pace
5. **Progressive Disclosure**: Start simple, increase complexity gradually
6. **Practical Focus**: Theory serves practice; every concept includes hands-on application

---

## Risks & Mitigations

### Risk 1: Scope Creep

**Risk**: Chapter expands beyond manageable size for bootcamp timeframe.

**Mitigation**:
- Clearly defined deferred topics
- Each spec is independently completable
- Instructors can skip Phase 3 if time constrained
- Specs 02-05 are individually optional based on student background

### Risk 2: Infrastructure Complexity

**Risk**: Production exercises (Spec 06-08) require complex infrastructure setup that becomes a barrier.

**Mitigation**:
- Use OTel Demo App's official Docker Compose, run on a single EC2 VM via thin, committed Terraform — the simplest option surveyed (see [issue #921](https://github.com/liatrio/engineering-bootcamp/issues/921))
- Standalone Spec 08 owns this infrastructure so Specs 06 and 07 consume a single, one-command environment instead of each solving deployment themselves
- Self-contained under `examples/`: `cd` in, run `make`/`terraform apply`, no GitHub Actions coupling to break for forks
- k3s-on-EC2 fallback only if pod-level blue-green is required later, at the same cost/teardown profile
- Extensive documentation and troubleshooting guides

### Risk 3: Outdated Technologies

**Risk**: Specific frameworks or tools become outdated, breaking examples.

**Mitigation**:
- Pin dependency versions in example projects
- Use stable, mature technologies (Flask, standard library, SQLite)
- OTel Demo App is actively maintained
- Examples focus on patterns (language-agnostic) not frameworks
- Version pins in `pyproject.toml`, `go.mod`, `package.json`

### Risk 4: Student Background Variation

**Risk**: Students have widely varying prior experience, making appropriate difficulty challenging.

**Mitigation**:
- Clear prerequisites stated at chapter start
- Self-assessment quiz to gauge readiness
- Optional foundational content for students needing review
- Advanced extensions for experienced students
- Instructors can adjust which specs to cover

### Risk 5: AI Workflow Adoption

**Risk**: Students struggle with AI-assisted development or Spec-Driven Workflow.

**Mitigation**:
- SDD introduced gradually starting in Spec 06
- Learning by doing rather than abstract instruction
- Clear examples and templates
- Not required for earlier sections (Specs 01-05)
- Alternative traditional approaches documented

---

## Timeline & Prioritization

### Priority Tiers

**P0 (Critical Path)**:
- 🔍 Spec 01: Design Patterns (content in review, PRs #822/#824/#826)

**P1 (Foundation & Topics)**:
- 🚧 Spec 02: System Thinking & Codebase Analysis (built in PR #914, ARM validation pending — #920)
- 📝 Spec 03: Databases & Data Persistence (spec written, tasks file in progress — #919)
- ❓ Spec 04: REST API Design & OpenAPI (round-1 questions in flight — #918)
- 📋 Spec 05: Authentication & Authorization
- 📋 Spec 08: Infrastructure (Terraform/AWS One-Command OTel Demo Environment) — must land before Specs 06-07 build

**P2 (Production Work)**:
- 📋 Spec 06: Debugging & Observability
- 📋 Spec 07: Production Development & Digital Clone

**Deferred (Future Work)**:
- Frontend best practices
- Dependency injection patterns
- Additional backend patterns
- Application debugging (IDE stepping)
- Development workflows
- Functional vs OOP

### Suggested Implementation Order

1. **Spec 02** (System Thinking) - Foundation for understanding applications
2. **Spec 03** (Databases) - Most universal topic
3. **Spec 04** (REST APIs) - Builds on database knowledge
4. **Spec 05** (Auth) - Integrates with APIs
5. **Spec 08** (Infrastructure) - Terraform/AWS one-command environment; must exist before Spec 06 build begins
6. **Spec 06** (Debugging & Observability) - Introduces production context and SDD, deploys via Spec 08's infrastructure
7. **Spec 07** (Production Development) - Synthesizes all learning, deploys via Spec 08's infrastructure

### Checkpoints

After each phase, validate:
- Content clarity with sample students
- Exercise time estimates
- Technical accuracy
- Integration with existing chapter content
- Learning objective achievement

---

## Open Questions

**Live tracking**: Open decisions for Chapter 11 are tracked on the wayfinder map, [issue #915](https://github.com/liatrio/engineering-bootcamp/issues/915), which lists closed decision tickets and what's still unspecified. The items below are this spec's local view of that map.

### For All Specs

1. **OTel Demo App Verification**: Has the OpenTelemetry Demo App been tested with current setup requirements? Are there alternative production-ready demo applications to consider? *(Partially resolved: ARM validation is tracked as [issue #920](https://github.com/liatrio/engineering-bootcamp/issues/920).)*

2. **Shared Environment Strategy**: Will students work in individual local environments only, or are shared dev/prod environments available for team exercises? *(Still open — see issue #915: "shared dev/prod cohort environment policy vs everyone-deploys-their-own.")*

3. ~~**Time Budget**: What is the actual time budget for Chapter 11?~~ **Resolved (2026-07-23 planning meeting)**: the bootcamp runs approximately six months; Chapter 11 can run its full sequential arc and overrunning the original 2-3 week chapter estimate is acceptable.

4. **Assessment Strategy**: How will student learning be assessed? Self-directed exercises only, or formal deliverables? *(Still open — see issue #915: "assessment strategy across the six months.")*

5. **AWS Cost Guidance**: What cost guidance or ceilings should the chapter give learners running Terraform-provisioned infrastructure in their own AWS accounts? *(Still open — see issue #915.)*

### Spec-Specific Questions

**Spec 02 (System Thinking)**:
- Which specific application/architecture should students analyze? OTel Demo? Custom example? Both?

**Spec 03 (Databases)**:
- Should NoSQL coverage include specific databases (MongoDB, Redis) or remain conceptual?

**Spec 04 (REST APIs)**:
- Should students build APIs from scratch or enhance existing APIs?

**Spec 05 (Auth)**:
- Should students integrate with real OAuth providers (GitHub, Google) or use mock implementations?

**Spec 06 (Debugging)**:
- Should the memory leak exercise exactly follow OTel Demo's example, or create a custom scenario?

**Spec 07 (Digital Clone)**:
- Which specific service from OTel Demo should students rebuild? Or provide options?

---

## Next Steps

### Immediate Actions

1. **Land Spec 01 content**: Review and merge PRs [#822](https://github.com/liatrio/engineering-bootcamp/pull/822), [#824](https://github.com/liatrio/engineering-bootcamp/pull/824), [#826](https://github.com/liatrio/engineering-bootcamp/pull/826) (Design Patterns content, ready for review)

2. **Close out Spec 02**: Merge PR [#914](https://github.com/liatrio/engineering-bootcamp/pull/914) (System Thinking content) and resolve [issue #920](https://github.com/liatrio/engineering-bootcamp/issues/920) (ARM validation of the OTel Demo setup)

3. **Finish Spec 03 tasks**: Spec is written (`docs/specs/03-spec-databases/`); write the tasks file per [issue #919](https://github.com/liatrio/engineering-bootcamp/issues/919)

4. **Answer Spec 04 questions**: Resolve the remaining round-1 questions per [issue #918](https://github.com/liatrio/engineering-bootcamp/issues/918), then write the Spec 04 spec

5. **Write Spec 08 (Infrastructure)**: Author the standalone Terraform/AWS one-command OTel Demo environment spec, using the research in [issue #921](https://github.com/liatrio/engineering-bootcamp/issues/921) as its technical basis

### Before Production Specs (06-07)

1. **Spec 08 must be written and reviewed first** — it is now the standalone dependency both specs consume, rather than something decided ad hoc within each
2. **Prepare SDD Materials**: Create templates and examples for Spec-Driven Workflow introduction

### Continuous

1. **Update Chapter Overview**: Revise 11.0-overview.md as structure becomes clearer
2. **Track Front-Matter**: Ensure all sections have consistent metadata, with generous time estimates for first-time learners
3. **Cross-Reference**: Link between sections appropriately
4. **Review Pacing**: Validate time estimates with actual student experience
5. **Track open decisions**: Keep the wayfinder map ([issue #915](https://github.com/liatrio/engineering-bootcamp/issues/915)) current as decision tickets close

---

## Revision History

| Version | Date | Author | Changes |
| ------- | ---- | ------ | ------- |
| 1.0 | 2026-01-05 | SDD System | Initial parent spec coordinating seven child specs |
| 2.0 | 2026-07-23 | 2026-07-23 planning meeting | Six-month bootcamp timeline (replaces 2-3 week budget) with generous front-matter time-estimate guideline; AWS-via-committed-Terraform infrastructure (replaces no-external-services/local-only constraint), no GitHub Actions coupling, everything self-contained under `examples/`; added framework-agnostic/one-language-per-section and open-source design decisions; added standalone Spec 08 (Infrastructure: Terraform/AWS One-Command OTel Demo Environment) consumed by Specs 06-07; corrected stale status tracking for Specs 01-04; linked wayfinder map (#915) |

---

## Child Spec Status Tracking

### Spec 01: Design Patterns (11.2.2-11.2.5)

- **Status**: 🔍 IN REVIEW
- **Location**: `docs/specs/01-spec-design-patterns-section/`
- **Sections Covered**: 11.2.2, 11.2.3, 11.2.4, 11.2.5
- **Notes**: Data layer patterns, business logic patterns, classical GoF patterns, integrated refactoring exercise. Content is in PRs [#822](https://github.com/liatrio/engineering-bootcamp/pull/822), [#824](https://github.com/liatrio/engineering-bootcamp/pull/824), [#826](https://github.com/liatrio/engineering-bootcamp/pull/826), ready for review.

### Spec 02: System Thinking & Codebase Analysis (11.3)

- **Status**: 🚧 BUILT, ARM VALIDATION PENDING
- **Location**: `docs/specs/02-spec-system-thinking/`
- **Sections Covered**: 11.3
- **Notes**: Spec and task list complete; content built in PR [#914](https://github.com/liatrio/engineering-bootcamp/pull/914). OTel Demo ARM (Apple Silicon) validation is still pending — see [issue #920](https://github.com/liatrio/engineering-bootcamp/issues/920).

### Spec 03: Databases & Data Persistence (11.4)

- **Status**: 📝 SPEC WRITTEN, TASKS IN PROGRESS
- **Location**: `docs/specs/03-spec-databases/`
- **Sections Covered**: 11.4
- **Notes**: SQL, NoSQL, ORMs, data modeling. Spec is written; the tasks file is in progress — see [issue #919](https://github.com/liatrio/engineering-bootcamp/issues/919).

### Spec 04: REST API Design & OpenAPI (11.5)

- **Status**: ❓ QUESTIONS IN FLIGHT
- **Location**: `docs/specs/04-spec-rest-api/` (to be created)
- **Sections Covered**: 11.5
- **Notes**: REST principles, OpenAPI spec, API design exercises. Round-1 questions are in flight — see [issue #918](https://github.com/liatrio/engineering-bootcamp/issues/918).

### Spec 05: Authentication & Authorization (11.6)

- **Status**: 📋 PLANNED
- **Location**: `docs/specs/05-spec-auth/` (to be created)
- **Sections Covered**: 11.6
- **Notes**: OAuth/OIDC, FE/BE auth patterns, security best practices

### Spec 06: Debugging & Observability (11.7)

- **Status**: 📋 PLANNED
- **Location**: `docs/specs/06-spec-debugging-observability/` (to be created)
- **Sections Covered**: 11.7
- **Notes**: OTel Demo App, telemetry, memory leak exercise, **introduces SDD**. Deploys via Spec 08's infrastructure.

### Spec 07: Production Development & Digital Clone (11.8)

- **Status**: 📋 PLANNED
- **Location**: `docs/specs/07-spec-production-development/` (to be created)
- **Sections Covered**: 11.8
- **Notes**: Production fixes, feature implementation, digital clone, zero-downtime migration, **applies SDD**. Deploys via Spec 08's infrastructure.

### Spec 08: Infrastructure — Terraform/AWS One-Command OTel Demo Environment

- **Status**: 📋 PLANNED
- **Location**: `docs/specs/08-spec-infrastructure/` (to be created)
- **Sections Covered**: N/A (standalone infrastructure spec supporting 11.7-11.8)
- **Notes**: Committed Terraform provisioning a single EC2 VM running the OTel Demo App's official Docker Compose into the learner's own AWS account (~$1/day, clean `terraform destroy`); k3s-on-EC2 fallback if pod-level blue-green is needed. Research complete in [issue #921](https://github.com/liatrio/engineering-bootcamp/issues/921); spec not yet written.

---

## Resuming Work

**If resuming after context loss**, reference this parent spec to:

1. **Understand Overall Vision**: Read Introduction, Goals, and User Stories sections
2. **Check Current Status**: Review Child Spec Status Tracking table
3. **Identify Next Spec**: Follow Priority Tiers and Suggested Implementation Order
4. **Gather Context**: Review Reference Materials section for source documents
5. **Apply Standards**: Follow Repository Standards and Technical Dependencies
6. **Check open decisions**: Review the wayfinder map ([issue #915](https://github.com/liatrio/engineering-bootcamp/issues/915)) for anything unresolved before continuing
7. **Continue**: Create or advance the next planned spec using the structure established in Spec 01

**Current State**: Spec 01 content is in review (PRs #822/#824/#826). Spec 02 content is built (PR #914) with ARM validation pending (#920). Spec 03 has a written spec with its tasks file in progress (#919). Spec 04 has round-1 questions in flight (#918). Specs 05-07 are planned. Spec 08 (Infrastructure) is newly added, planned, with its supporting research already complete (#921).

**Next Action**: Close out Spec 02's ARM validation (#920), finish Spec 03's tasks file (#919), resolve Spec 04's remaining questions (#918), and write Spec 08 so Specs 06-07 have infrastructure to build against. Track all of the above via the wayfinder map (#915).
