# 01 Questions Round 1 - Design Patterns Section

Please answer each question below (select one or more options, or add your own notes). Feel free to add additional context under any question.

## 1. Integration with Existing Work

I notice that `examples/ch11/solid-exercises/` and `src/quizzes/chapter-11/11.2.1/solid-principles-quiz.js` already exist. How should this spec relate to the existing work?

- [ ] (A) The spec should incorporate and formalize the existing work as-is, treating it as already complete
- [ ] (B) The spec should review and potentially revise the existing work to ensure it meets all requirements
- [ ] (C) The spec should create entirely new examples and quizzes, ignoring what exists
- [x] (D) The spec should reference the existing work but focus only on the missing pieces (11.2.2-11.2.5)
- [ ] (E) Other (describe)

## 2. Documentation Files - What Already Exists?

Which of the following documentation files already exist in the codebase?

- [x] (A) `docs/11-application-development/11.2-design-patterns.md` exists but should be updated as we build out more sections
- [x] (B) `docs/11-application-development/11.2.1-solid-principles.md` exists
- [ ] (C) Neither file exists yet
- [ ] (D) Other (describe)

## 3. Code Example Completeness

Looking at the existing `examples/ch11/solid-exercises/`, what is the current state?

- [ ] (A) Only SRP, OCP, and DIP examples exist (exercises 1-3)
- [ ] (B) All five SOLID principles have examples
- [ ] (C) Examples exist but need enhancement (e.g., missing "before" versions, better documentation)
- [ ] (D) Not sure - need to review
- [x] (E) Other (describe) - Consider the solid section of this spec complete and focus on building out the design patterns sections (11.2.2-11.2.5)

## 4. Quiz Integration Strategy

The existing quiz at `src/quizzes/chapter-11/11.2.1/solid-principles-quiz.js` appears comprehensive. What should we do?

- [ ] (A) Use the existing quiz as-is for 11.2.1
- [ ] (B) Review and enhance the existing quiz based on the spec requirements
- [ ] (C) Replace it with a new quiz following the spec
- [x] (D) Other (describe) - 11.2.1 is considered done; focus on creating new quizzes for 11.2.2-11.2.5 as specified

## 5. Language Distribution - Flexibility

The spec proposes specific language assignments for each unit. Is this distribution flexible or fixed?

- [x] (A) The distribution is flexible - you can adjust based on what makes pedagogical sense
- [ ] (B) The distribution is fixed - follow exactly what the spec says (Python for SOLID, Go for Data, TypeScript for Business Logic)
- [ ] (C) The distribution should be reconsidered - suggest alternatives
- [ ] (D) Other (describe)

## 6. Implementation Priority

Which units should be prioritized for implementation?

- [ ] (A) Implement all units in sequence (0 → 1 → 2 → 3 → 4 → 5)
- [ ] (B) Focus on Units 0 and 1 first (overview and SOLID principles)
- [x] (C) Complete Units 2-5 assuming Unit 1 is done
- [ ] (D) Prioritize based on dependencies (e.g., quizzes can wait, docs and examples first)
- [ ] (E) Other (describe)

## 7. Sidebar Navigation - Current State

Does the `docs/_sidebar.md` currently have any Chapter 11 entries for design patterns?

- [x] (A) Yes, design patterns section exists in the sidebar, you will need to update it as new sub-units are added
- [ ] (B) No, only 11.0 Overview and 11.1 Layers exist
- [ ] (C) Not sure
- [ ] (D) Other (describe)

## 8. Proof Artifacts - What Constitutes "Done"?

For each unit, what level of verification is expected for proof artifacts?

- [ ] (A) Files exist at the specified locations (basic existence check)
- [x] (B) Files exist and contain reasonable content (manual review)
- [ ] (C) Files exist, content is complete, and code examples run successfully (full validation)
- [ ] (D) Files exist, tests pass, and documentation renders correctly in Docsify (comprehensive validation)
- [ ] (E) Other (describe)

## 9. Front-Matter Metadata - Existing Technologies

The spec mentions reusing existing categories and technologies from `docs/README.md`. What technologies already exist that we should reuse?

Please list any known technologies that should be reused, or indicate if this needs research:
- [ ] (A) Need to research existing technologies in the master record
- [ ] (B) Use the technologies as specified in the spec's front-matter templates
- [x] (C) Create new technologies as needed for design patterns content
- [ ] (D) Other (describe)

**Known technologies to reuse:** (fill in if known)

## 10. Refactoring Exercise (Unit 5) - Implementation Approach

The refactoring exercise (Unit 5) is the most complex deliverable. What approach should be taken?

- [ ] (A) Create a completely new e-commerce application from scratch with deliberate anti-patterns
- [ ] (B) Base it on the existing examples/ch11/example1 and example2 pattern but with e-commerce domain
- [ ] (C) Use a real-world open-source project and document its anti-patterns
- [ ] (D) Simplify the scope to a smaller domain than e-commerce
- [x] (E) Other (describe)h: This unit should start as a research task to identify a suitable open-source e-commerce project with known design issues that can be refactored. Otherwise build from scratch.

## 11. Docsify Integration - Testing

How should we verify that the documentation renders correctly in Docsify?

- [ ] (A) Run `npm start` and manually check each page
- [x] (B) Automated link checking is sufficient
- [ ] (C) Full manual review of rendered content including quizzes
- [ ] (D) Other (describe)

## 12. Timeline and Expectations

What is the expected timeline or urgency for this work?

- [ ] (A) This is exploratory - no specific timeline
- [x] (B) Needed for an upcoming bootcamp cohort (specify date if known): 1/12/2026
- [ ] (C) Part of ongoing curriculum development - implement incrementally
- [ ] (D) Other (describe)
