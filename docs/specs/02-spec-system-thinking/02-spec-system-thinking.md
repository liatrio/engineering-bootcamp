# 02-spec-system-thinking.md

## Introduction/Overview

This specification defines the content and structure for Chapter 11.3: System Thinking & Codebase Analysis in the DevOps Bootcamp. This section teaches students how to analyze, understand, and document existing applications—a critical skill for working with production codebases. Students will learn to create system diagrams, trace transactions through multi-service architectures, and communicate technical architecture effectively.

**Problem it Solves**: New developers often struggle to understand existing codebases, leading to poor architectural decisions, bugs, and difficulty contributing effectively. This section develops systematic approaches to codebase analysis and architecture comprehension.

**Primary Goal**: Enable students to independently analyze complex applications, create accurate system diagrams, trace transactions through microservices, and communicate architectural understanding through documentation and presentations.

## Goals

1. **Develop System-Level Thinking**: Train students to think beyond individual functions and files, understanding how components interact to deliver features across distributed systems.

2. **Master Multiple Diagram Types**: Teach students to create sequence diagrams (request/response flows), component diagrams (service boundaries), and data flow diagrams (information movement) using tools of their choice.

3. **Build Transaction Tracing Skills**: Enable students to trace requests through 3-5 services in a microservice architecture, understanding communication patterns, data transformations, and failure points.

4. **Practice Technical Communication**: Develop skills in writing architectural decision records (ADRs), README files, and delivering technical presentations that explain system architecture clearly.

5. **Establish Foundation for Production Work**: Prepare students for debugging and production development exercises (11.7-11.8) by building deep understanding of the OpenTelemetry Demo Application architecture.

## User Stories

**As a bootcamp student**, I want to learn systematic approaches for understanding unfamiliar codebases so that I can confidently work with production applications in my first job.

**As a bootcamp student**, I want hands-on experience creating system diagrams so that I can document and communicate architecture decisions effectively.

**As a bootcamp student**, I want to trace requests through microservice architectures so that I understand how distributed systems work and can debug issues across service boundaries.

**As a bootcamp student**, I want to practice technical documentation and presentations so that I can communicate architectural understanding to my team.

**As a bootcamp instructor**, I want students to deeply understand the OTel Demo Application so that they can successfully complete debugging and production exercises in later sections (11.7-11.8).

**As a bootcamp instructor**, I want progressive exercises that start simple and build to realistic complexity so that students develop confidence and skills incrementally.

## Demoable Units of Work

### Unit 1: Introduction to System Thinking & Simple Application Analysis

**Purpose:** Introduce system thinking concepts and diagram types using a simple custom application that students can fully understand. This builds confidence before tackling complex microservices.

**Functional Requirements:**
- The system shall provide a simple 2-3 service application (e.g., web frontend → API backend → database) as the initial analysis target
- The system shall include clear documentation explaining what the application does and its basic architecture
- The content shall define and explain three diagram types: sequence diagrams (showing request/response flows), component diagrams (showing service boundaries and dependencies), and data flow diagrams (showing information movement through the system)
- The content shall provide examples of each diagram type for the simple application
- The user shall complete a guided exercise creating all three diagram types for the simple application
- The user shall document the simple application's architecture in a README file following a provided template
- The content shall introduce tools available for diagramming (code-based: PlantUML/Mermaid; visual: Draw.io/Lucidchart) and allow students to choose their preferred tool

**Proof Artifacts:**
- Example application code: Demonstrates simple multi-service architecture students will analyze
- Three example diagrams (sequence, component, data flow): Demonstrates diagram types and quality standards
- README template: Demonstrates architecture documentation structure
- Exercise instructions: Demonstrates clear guidance for creating diagrams of the simple application

### Unit 2: Multi-Service Transaction Tracing

**Purpose:** Teach students to trace transactions through 3-5 services in the OpenTelemetry Demo Application, building skills for understanding realistic microservice architectures.

**Functional Requirements:**
- The system shall provide the OpenTelemetry Demo Application as the analysis target (with setup instructions)
- The content shall explain transaction tracing methodology: starting from entry point, following HTTP calls, identifying data transformations, and mapping service dependencies
- The content shall provide a worked example tracing one complete transaction (e.g., "add item to cart") through 3-5 OTel Demo services
- The user shall complete a progressive discovery exercise: given a starting point (e.g., "checkout flow"), students trace the transaction through the system by reading code, examining logs, and identifying service communication patterns
- The user shall create a sequence diagram showing the complete transaction flow across all involved services
- The user shall document findings in a structured format identifying: entry point, services involved, APIs called, data transformations, and potential failure points

**Proof Artifacts:**
- OTel Demo setup guide: Demonstrates students can run the application locally
- Worked example trace: Demonstrates transaction tracing methodology with one complete example
- Progressive discovery exercise instructions: Demonstrates the "starting point" and guidance for student exploration
- Transaction tracing template: Demonstrates the structured format for documenting findings

### Unit 3: Architecture Documentation & Communication

**Purpose:** Develop technical communication skills by having students document architectural decisions and present their understanding of the OTel Demo Application.

**Functional Requirements:**
- The content shall explain Architectural Decision Records (ADRs): purpose, structure (context, decision, consequences), and when to write them
- The content shall provide ADR templates and examples relevant to the OTel Demo Application
- The user shall write 2-3 ADRs analyzing architectural decisions in the OTel Demo Application (e.g., "Why use gRPC between certain services?", "Why is the frontend server-side rendered?", "Why use multiple databases?")
- The user shall create or enhance a README file documenting the OTel Demo Application's architecture, including: system overview, service responsibilities, communication patterns, data storage, and key architectural decisions
- The user shall prepare and deliver (or record) a 10-15 minute walkthrough presentation explaining the OTel Demo Application architecture, demonstrating their diagrams, discussing transaction flows, and explaining architectural trade-offs
- The system shall provide a presentation rubric defining quality criteria: clarity, accuracy, completeness, and effective use of diagrams

**Proof Artifacts:**
- ADR template and examples: Demonstrates ADR structure and content quality
- README enhancement checklist: Demonstrates what sections students should include
- Presentation rubric: Demonstrates evaluation criteria for student presentations
- Example presentation outline: Demonstrates suggested structure for the walkthrough

### Unit 4: Integration Exercise & Assessment

**Purpose:** Synthesize all skills in a comprehensive exercise that prepares students for debugging and production work in later chapters.

**Functional Requirements:**
- The user shall select a feature or workflow in the OTel Demo Application not covered in previous exercises
- The user shall perform complete analysis including: creating all three diagram types (sequence, component, data flow), tracing transactions through all involved services, identifying architectural decisions and trade-offs, and documenting findings
- The user shall produce deliverables including: component diagram showing involved services, sequence diagram showing complete transaction flow, data flow diagram showing information movement, README section documenting the feature/workflow, ADR analyzing one architectural decision related to the feature, and recorded or live presentation (10-15 minutes) walking through their analysis
- The system shall provide a self-assessment checklist for students to verify completeness before submission
- The content shall include optional advanced extensions for students seeking additional challenge: analyzing failure scenarios and recovery mechanisms, comparing OTel Demo architecture to alternative approaches, proposing architectural improvements with justification

**Proof Artifacts:**
- Integration exercise instructions: Demonstrates the complete analysis task requirements
- Self-assessment checklist: Demonstrates quality criteria students should verify
- Example deliverable set: Demonstrates expected quality for all diagram types, documentation, and presentation
- Optional extensions guide: Demonstrates advanced topics for deeper exploration

## Non-Goals (Out of Scope)

1. **Code Implementation**: This section focuses on analysis and understanding, not building new services or modifying existing code. Implementation comes in later chapters.

2. **Deep Observability Instrumentation**: While students will work with the OTel Demo Application, this section does not cover implementing observability. That is covered in 11.7 (Debugging & Observability).

3. **Performance Analysis or Optimization**: Students will trace transactions to understand architecture, not to identify or fix performance bottlenecks.

4. **Deployment or Infrastructure**: Setting up the OTel Demo Application is included, but deep dives into Kubernetes, cloud platforms, or infrastructure concerns are out of scope.

5. **Specific Diagramming Tool Training**: Content introduces available tools but does not provide comprehensive tutorials for specific tools. Students choose and learn tools independently.

6. **Front-End Architecture Deep Dive**: Analysis focuses on service-to-service interactions and system-level architecture, not front-end component design or state management patterns.

## Design Considerations

**Learning Materials Format:**
- Main content in `docs/11-application-development/11.3-system-thinking.md` following established chapter structure
- Use H2 headers for navigation (table of contents), H3 headers for content sections
- Include visual examples of all three diagram types using images in `docs/11-application-development/img11/`
- Use multi-column layouts (`grid2`, `grid3`) where appropriate for comparing diagram types or showing before/after examples

**Example Application (Unit 1):**
- Create a simple 2-3 service application in `examples/ch11/simple-system/`
- Use Python (Flask) for consistency with previous chapter examples
- Include clear README, docker-compose.yml for easy setup
- Provide example diagrams in multiple formats (PlantUML source + rendered images)

**OTel Demo Integration:**
- Link to official OTel Demo repository rather than duplicating code
- Provide bootcamp-specific setup guide in `examples/ch11/otel-demo-setup/`
- Create worked example diagrams and traces for the bootcamp repository
- Ensure version pinning for reproducibility

**Templates and Rubrics:**
- Provide downloadable templates (ADR, README structure, presentation outline) in `examples/ch11/templates/`
- Include rubrics for self-assessment and instructor evaluation

## Repository Standards

**Content Organization:**
- Main documentation: `docs/11-application-development/11.3-system-thinking.md`
- Code examples: `examples/ch11/simple-system/`, `examples/ch11/otel-demo-setup/`
- Images: `docs/11-application-development/img11/`
- Templates: `examples/ch11/templates/`

**Front-Matter Requirements:**
```yaml
---
docs/11-application-development/11.3-system-thinking.md:
  category: Software Development
  estReadingMinutes: 30
  exercises:
    -
      name: Simple Application Analysis
      description: Create sequence, component, and data flow diagrams for a simple multi-service application
      estMinutes: 90
      technologies:
      - System Design
      - Diagramming
      - Architecture Documentation
    -
      name: Transaction Tracing in OTel Demo
      description: Trace a transaction through 3-5 services in the OpenTelemetry Demo Application
      estMinutes: 120
      technologies:
      - Microservices
      - OpenTelemetry
      - System Design
    -
      name: Architecture Documentation & Presentation
      description: Write ADRs and README documentation, deliver walkthrough presentation
      estMinutes: 150
      technologies:
      - Technical Writing
      - Architecture Documentation
      - Communication
    -
      name: Integration Exercise
      description: Complete analysis of a feature including all diagram types, documentation, and presentation
      estMinutes: 180
      technologies:
      - System Design
      - Microservices
      - OpenTelemetry
      - Technical Writing
---
```

**Style Guidelines:**
- Follow Docsify markdown conventions
- Use HTML `<img>` tags for images with proper alt text
- Include code blocks with language-specific syntax highlighting
- Use callout boxes for important notes and warnings

**Example Standards:**
- All examples must be self-contained with README
- Use docker-compose for multi-service examples
- Pin all dependency versions
- Test on ARM-based macOS (M1/M2/M3)

**Existing Patterns to Follow:**
- Hands-on, practical focus (like 11.1-layers.md exercises)
- Progressive complexity (like SOLID exercises in 11.2.1)
- Clear learning objectives and deliverables
- Interactive elements where appropriate (quizzes if beneficial)

## Technical Considerations

**OpenTelemetry Demo Application:**
- Use the official OTel Demo App (https://github.com/open-telemetry/opentelemetry-demo)
- Verify compatibility with ARM-based macOS
- Provide alternative setup methods (Docker Compose, Kubernetes) with Docker Compose as default
- Document minimum system requirements (RAM, CPU, disk)
- Pin to a specific release version for stability

**Simple Example Application:**
- Keep it minimal: 2-3 services maximum
- Use familiar technologies: Python (Flask), SQLite
- Ensure it runs without external dependencies (no cloud APIs, no paid services)
- Make the architecture clear and easy to understand (intentionally simple, not production-realistic)

**Diagramming Tools:**
- Recommend both code-based (PlantUML, Mermaid) and visual (Draw.io, Lucidchart) options
- Provide example diagrams in PlantUML format (can be rendered by Docsify plugins)
- Ensure students on free tiers can complete all exercises (no paid tool requirements)

**Video Recording (for presentations):**
- Support multiple recording methods: Zoom, Loom, OBS, native OS tools
- Provide guidance on screen recording best practices
- Allow live presentations as alternative to recorded

**Prerequisites:**
- Requires completion of 11.0-11.2 (layered architecture, design patterns, SOLID principles)
- Assumes Docker and container knowledge from earlier bootcamp chapters
- Assumes HTTP/REST API understanding from earlier chapters
- If gaps exist, provide quick refresher links

## Security Considerations

**OTel Demo Application:**
- The OTel Demo Application is designed for demonstration purposes and should only be run locally
- Students should not expose OTel Demo services to the public internet
- No real payment processing or sensitive data should be used with the demo application

**Presentation Recordings:**
- Students should be informed if presentations will be shared publicly or kept private
- Ensure students do not accidentally share personal information (file paths with usernames, API keys in environment variables) when recording screens
- Provide guidance on sanitizing recordings before submission

**Documentation and Diagrams:**
- Diagrams and documentation are safe to commit to repositories
- No secrets, credentials, or sensitive configuration should appear in documentation

**No specific security implementations required in this section** - focus is on analysis, not building secure systems.

## Success Metrics

1. **Diagram Quality**: Students create accurate, clear diagrams that correctly represent system architecture. Diagrams are validated against actual code behavior and communication patterns.

2. **Transaction Tracing Accuracy**: Students successfully trace complete transactions through multi-service architectures without missing service hops or misunderstanding communication patterns.

3. **Documentation Clarity**: ADRs and README files are well-structured, clearly written, and provide useful architectural insights. Technical reviewers can understand the system from student documentation.

4. **Presentation Effectiveness**: Student walkthroughs clearly explain architecture using diagrams, demonstrate understanding of trade-offs, and effectively communicate technical concepts. Target: 10-15 minute presentations covering all required topics.

5. **Preparation for Later Chapters**: Students demonstrate sufficient understanding of the OTel Demo Application to successfully complete debugging exercises (11.7) and production development work (11.8). Target: 80%+ of students feel confident proceeding to production exercises.

6. **Time Calibration**: Exercises align with estimated times (4-8 hours total). Target: 80%+ of students complete core exercises within estimated time ranges.

7. **Student Confidence**: Self-assessment surveys show students feel significantly more confident analyzing unfamiliar codebases after completing this section. Target: 4+ on 5-point confidence scale.

## Open Questions

1. **OTel Demo Version**: Which specific version/release of the OpenTelemetry Demo Application should be pinned for this bootcamp? Need to verify stability and ARM compatibility.

2. **Grading and Feedback**: Will student presentations be graded by instructors, self-assessed, or peer-reviewed? This affects rubric design and submission process.

3. **Tool Recommendations**: While students have tool choice, should the bootcamp officially recommend specific tools (e.g., "we recommend starting with Mermaid or Draw.io")? This could reduce tool-selection paralysis.

4. **Quiz Integration**: Should this section include an interactive quiz (like 11.2.1-solid-principles.md)? If yes, what concepts should be tested?

5. **OTel Demo Simplification**: Should the bootcamp provide a "simplified subset" configuration of the OTel Demo (e.g., only 4-5 services enabled) to reduce complexity and system requirements, or use the full demo?

6. **Live Presentation Logistics**: If students deliver live presentations, what is the format? One-on-one with instructor? Small groups? Recorded for async review?

7. **Example Selection for Unit 2**: Which specific transaction/feature in the OTel Demo should be used for the worked example? Should align with student interests and demonstrate key concepts effectively.

8. **Integration with Spec 01**: Should this section explicitly reference or build on design patterns from 11.2.2-11.2.5, or remain independent?
