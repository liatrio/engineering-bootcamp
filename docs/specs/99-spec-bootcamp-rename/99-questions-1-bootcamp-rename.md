# 99 Questions Round 1 - Bootcamp Rename

Please answer each question below (select one or more options, or add your own notes). Feel free to add additional context under any question.

## 1. Scope of Name Changes

What aspects of the project name should be changed from "DevOps Bootcamp" to "Liatrio Engineering Bootcamp"?

- [x] (A) All user-facing text (documentation content, UI elements, page titles)
- [x] (B) All technical identifiers (package.json name, Docker image names, file paths)
- [ ] (C) All GitHub repository references (URLs, clone commands)
- [ ] (D) All of the above - comprehensive rename across all contexts
- [ ] (E) Other (describe)

**Additional context:**

## 2. GitHub Repository Handling

The current codebase references `github.com/liatrio/devops-bootcamp` in 33+ locations. What should happen with the GitHub repository?

- [x] (A) The GitHub repository will be renamed to `liatrio/engineering-bootcamp` (I will handle the GitHub rename separately). Use the gh cli to create an issue for all references to be updated. Leverage a sub-agent to find all locations that need to be updated and enumerate them in the issue.
- [ ] (B) The GitHub repository will remain `liatrio/devops-bootcamp` but all display names/titles will change
- [ ] (C) Update URLs to a new repository name that you specify (please specify below)
- [ ] (D) Leave all GitHub URLs as-is for now, only update display text
- [ ] (E) Other (describe)

**If you selected (C), what is the new repository name?**

## 3. Package and Docker Naming

The project has technical identifiers in package.json (`name: "devops-bootcamp"`) and Docker commands (`docker build . -t devops-bootcamp`). Should these be updated?

- [x] (A) Update package name to `engineering-bootcamp` and Docker image to `engineering-bootcamp`
- [ ] (B) Update package name to `liatrio-engineering-bootcamp` and Docker image to `liatrio-engineering-bootcamp`
- [ ] (C) Keep existing technical names for backward compatibility, only change display text
- [ ] (D) Update to a different naming scheme (please specify below)
- [ ] (E) Other (describe)

**If you selected (D), what naming scheme should be used?**

## 4. "DevOps" Term Retention

The bootcamp covers DevOps topics. Should the term "DevOps" be retained in any context?

- [ ] (A) Remove "DevOps" entirely - it's now "Liatrio Engineering Bootcamp" covering engineering topics
- [ ] (B) Keep "DevOps" in descriptions/metadata (e.g., "Engineering Bootcamp covering DevOps practices")
- [x] (C) Keep "DevOps" in chapter content where technically accurate, but change main branding
- [ ] (D) Replace with "Engineering" everywhere, update content to reflect broader scope
- [ ] (E) Other (describe)

**Additional context:**

## 5. Rollout and Breaking Changes

This rename may affect existing users, bookmarks, documentation links, etc. How should we handle the transition?

- [ ] (A) Make all changes at once - clean break to new name
- [x] (B) Prioritize user-facing changes first, technical identifiers can be updated gradually
- [ ] (C) Include redirect notes or migration guidance in documentation
- [ ] (D) Need to coordinate with other teams/systems before implementing
- [ ] (E) Other (describe)

**Additional concerns or coordination needs:**
I will cut over the domain from devops-bootcamp.liatr.io to engineering-bootcamp.liatr.io once all changes are done so links to the bootcamp can be changed. As mentioned in question 2 I will handle the GitHub repo rename separately.

## 6. Content Scope Beyond Name

Should we update any content beyond the name itself?

- [ ] (A) Only update the name - keep all existing content and structure
- [ ] (B) Update descriptions/metadata to reflect "Engineering" scope (e.g., package.json description)
- [x] (C) Update introductory content to explain the broader "Engineering Bootcamp" concept. The bootcamp will still largely be DevOps-focused but framed in a broader engineering context since we are starting to introduce more software development topics.
- [ ] (D) This rename is part of a larger content update (please describe)
- [ ] (E) Other (describe)

**Additional content considerations:**

## 7. Proof Artifacts

How should we demonstrate this rename is complete and working?

- [ ] (A) Screenshots of main pages showing new name (homepage, navigation)
- [x] (B) CLI output showing npm/docker commands work with new naming
- [x] (C) Grep/search output showing no remaining "DevOps Bootcamp" references (except where intentional)
- [ ] (D) All of the above - comprehensive verification
- [ ] (E) Other verification approach (describe)

**Specific areas you want verified:**
