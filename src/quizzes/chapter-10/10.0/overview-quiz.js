const rawQuizdown = `
---
shuffleAnswers: true
shuffleQuestions: true
---

# What is an Internal Developer Platform (IDP)?

1. [x] A self-service tool that offers application teams standardized ways to accomplish common tasks
	> Correct. An IDP provides self-service tools that adhere to organizational standards and best practices.
1. [ ] A replacement for all DevOps engineers in an organization
	> Incorrect. Platform Engineering complements DevOps, it doesn't replace DevOps engineers on cross-functional teams.
1. [ ] A cloud provider's managed Kubernetes service
	> Incorrect. An IDP is an internal tool, not a cloud service.
1. [ ] A monitoring and alerting system
	> Incorrect. While an IDP may integrate with monitoring, that's not its primary purpose.

# What are "golden paths" (or paved pathways) in Platform Engineering?

1. [x] Templated, well-designed solutions for common tasks that follow organizational best practices
	> Correct. Golden paths provide standardized starting points that integrate nicely into the organization's platform.
1. [ ] The fastest network routes between data centers
	> Incorrect. Golden paths refer to development workflows, not networking.
1. [ ] Mandatory processes that all teams must follow without exception
	> Incorrect. Golden paths are recommended paths, but teams can still tread new ground when needed.
1. [ ] A certification program for platform engineers
	> Incorrect. Golden paths are about templated solutions, not certifications.

# What problem does Platform Engineering primarily solve?

1. [x] Reducing cognitive load and complexity sprawl across cross-functional teams
	> Correct. Platform Engineering addresses the complexity that comes from each team solving the same problems differently.
1. [ ] Eliminating the need for cloud infrastructure
	> Incorrect. Platform Engineering still relies on cloud infrastructure.
1. [ ] Replacing continuous integration systems
	> Incorrect. Platform Engineering typically provides standardized CI/CD, not replaces it.
1. [ ] Removing the need for application testing
	> Incorrect. Testing is still essential regardless of platform engineering.

# Why should a platform be treated as a product?

1. [x] To ensure it's designed with users (developers) in mind and evolves with their needs
	> Correct. Treating the platform as a product ensures internal adoption by making it a joy to use.
1. [ ] So it can be sold to external customers
	> Incorrect. An IDP is for internal users, not external sales.
1. [ ] To maximize the number of features regardless of usability
	> Incorrect. Product thinking prioritizes user needs over feature count.
1. [ ] To ensure only the platform team can make changes
	> Incorrect. Good platforms allow teams to collaboratively improve them.

# What is the relationship between a Platform team and application teams?

1. [x] Platform team is like "admin" providing tools, application teams are "users" who use and extend them
	> Correct. Platform teams ensure well-configured tools while application teams use them and evolve them as needed.
1. [ ] Platform team does all the work, application teams just write code
	> Incorrect. Application teams still own their CI/CD, infrastructure usage, and application evolution.
1. [ ] They are completely separate with no interaction
	> Incorrect. Platform teams build for application teams and should collaborate closely.
1. [ ] Application teams report to the platform team
	> Incorrect. They are peer teams with different responsibilities.

`;

export { rawQuizdown }
