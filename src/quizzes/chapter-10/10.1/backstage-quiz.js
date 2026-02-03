const rawQuizdown = `
---
shuffleAnswers: true
shuffleQuestions: true
---

# What are the three main parts of a Backstage application?

1. [x] Core, App, and Plugins
	> Correct. Core is the base functionality, App is your customized instance, and Plugins extend functionality.
1. [ ] Frontend, Backend, and Database
	> Incorrect. While Backstage has these components, the three parts refer to Core, App, and Plugins.
1. [ ] API, CLI, and GUI
	> Incorrect. These are types of interfaces, not Backstage's architecture.
1. [ ] Dev, Stage, and Prod
	> Incorrect. These are environments, not Backstage components.

# What is the Software Catalog in Backstage?

1. [x] A comprehensive inventory system that tracks ownership, metadata, and relationships of all software components
	> Correct. The Software Catalog facilitates discovery and management of services, libraries, and more.
1. [ ] A marketplace for purchasing third-party software
	> Incorrect. The catalog tracks internal software, not external purchases.
1. [ ] A list of approved programming languages
	> Incorrect. The catalog tracks software components, not language policies.
1. [ ] A version control system
	> Incorrect. Backstage integrates with version control but the catalog is for tracking components.

# What do Software Templates provide in Backstage?

1. [x] Standardized scaffolding for creating new projects that follow organizational best practices
	> Correct. Templates ensure new software adheres to standards and streamline the development process.
1. [ ] Pre-written code that replaces the need for developers
	> Incorrect. Templates provide starting points, not complete applications.
1. [ ] Email templates for team communication
	> Incorrect. Software Templates are for creating new projects, not communication.
1. [ ] Database schema templates
	> Incorrect. While templates could include schemas, they're primarily for scaffolding entire projects.

# What is TechDocs in Backstage?

1. [x] An integrated knowledge hub where teams create and access technical documentation alongside their code
	> Correct. TechDocs enables seamless collaboration and information sharing across the organization.
1. [ ] A ticket tracking system
	> Incorrect. TechDocs is for documentation, not ticket tracking.
1. [ ] A code review tool
	> Incorrect. TechDocs handles documentation, not code reviews.
1. [ ] An API testing framework
	> Incorrect. TechDocs is for documentation, not testing.

# How are Plugins used in Backstage?

1. [x] As modular extensions that enhance functionality and integrate additional services like CI/CD and monitoring
	> Correct. Plugins allow teams to customize Backstage for their specific workflow needs.
1. [ ] They are required dependencies that cannot be removed
	> Incorrect. Plugins are optional extensions that can be added or removed.
1. [ ] They replace the core Backstage functionality
	> Incorrect. Plugins extend the core, they don't replace it.
1. [ ] They are only available from Spotify
	> Incorrect. Plugins can be community-sourced or internally developed.

# Who typically maintains a Backstage App instance?

1. [x] The Platform team
	> Correct. The App is the customized instance that is generally maintained by a Platform team.
1. [ ] Spotify's open source team
	> Incorrect. Spotify maintains the Core, but each organization maintains their own App.
1. [ ] Individual developers
	> Incorrect. While developers use Backstage, the Platform team typically maintains the instance.
1. [ ] Cloud providers
	> Incorrect. Backstage is self-hosted, not a cloud provider service.

# What programming language is Backstage written in?

1. [x] TypeScript
	> Correct. Backstage is a monorepo React application written in TypeScript.
1. [ ] Python
	> Incorrect. Backstage uses TypeScript.
1. [ ] Java
	> Incorrect. Backstage uses TypeScript.
1. [ ] Go
	> Incorrect. Backstage uses TypeScript.

`;

export { rawQuizdown }
