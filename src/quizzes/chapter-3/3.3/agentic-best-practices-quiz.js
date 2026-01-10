const rawQuizdown = `

# What is the primary reason for documenting prompts when working with LLMs?

1. [ ] To comply with company security policies
   > While security compliance might benefit from documentation, it's not the primary reason.
1. [x] To provide a record of what prompts were used and what results were obtained for future reference
1. [ ] To prevent LLM hallucinations
   > Documentation doesn't prevent hallucinations, though it may help identify them.
1. [ ] To reduce token usage and costs
   > Documentation doesn't directly affect token usage or costs.

# In Spec-Driven Development (SDD), what is the correct sequence of stages?

1. [ ] Task Breakdown, Generate Spec, Validate, Execute with Management
   > This order is incorrect. The workflow always starts with generating a specification.
1. [ ] Execute with Management, Generate Spec, Task Breakdown, Validate
   > This order is incorrect. Execution cannot begin before planning stages.
1. [x] Generate Spec, Task Breakdown, Execute with Management, Validate
1. [ ] Generate Spec, Execute with Management, Task Breakdown, Validate
   > This order is incorrect. Task breakdown must happen before execution begins.

# What is the "Second Opinion" technique primarily used for?

1. [ ] Generating initial code for a new feature
   > This technique is applied to existing work, not for initial generation.
1. [ ] Finding bugs in existing code
   > While it might identify bugs, this isn't its primary purpose.
1. [x] Reviewing existing technical work to find simpler or more idiomatic solutions
1. [ ] Automating unit test creation
   > This isn't the focus of the Second Opinion technique.

# Why are LLMs described as "dumber than they look" in the context of professional software development?

1. [ ] They can't write code as well as human developers
   > This isn't the core reason for the description.
1. [ ] They take longer to complete tasks than humans
   > Speed isn't the issue being addressed.
1. [ ] They require constant supervision
   > While supervision is important, this doesn't capture the core limitation.
1. [x] They are statistical text predictors without true understanding, and suffer from issues like context rot when context windows become cluttered

# What's the recommended approach when using LLMs for a complex development task?

1. [ ] Ask the LLM to complete the entire task at once
   > This approach doesn't maintain sufficient control over the process.
1. [x] Break down the task into small, well-defined steps and use the LLM for each step with human oversight
1. [ ] Have multiple LLMs work on different parts simultaneously
   > This doesn't address the core need for human oversight and integration.
1. [ ] Generate as many variations as possible and pick the best one
   > This is inefficient and doesn't leverage structured workflows.

# What is the "Throwaway Debugging Scripts" technique best used for?

1. [ ] Creating production-ready utilities
   > These scripts are explicitly not intended for production use.
1. [ ] Documenting code
   > Documentation isn't the primary purpose of these scripts.
1. [x] Automating specific debugging steps without requiring codebase integration
1. [ ] Generating test data
   > While it could be used for this, it's not the primary purpose.

# When using LLMs to "plug technical gaps" in unfamiliar domains, what is a critical best practice?

1. [ ] Only use the most advanced LLM available
   > The specific LLM is less important than proper review.
1. [ ] Generate at least three alternatives for every solution
   > Multiple alternatives aren't necessarily required if proper review is conducted.
1. [ ] Immediately implement the solution in production
   > This would be dangerous without proper review.
1. [x] Have the generated code reviewed by a domain expert

# What happens when context window utilization exceeds 40%?

1. [ ] The AI assistant becomes more accurate with additional context
   > Additional context beyond 40% actually degrades performance.
1. [ ] Token costs increase exponentially
   > While costs may increase, the primary issue is performance degradation.
1. [x] The AI enters a "dumb zone" where performance and accuracy significantly degrade
1. [ ] The context window automatically resets to prevent errors
   > There is no automatic reset; the degradation continues until you manually address it.

# When should you trigger intentional compaction during development?

1. [ ] As soon as any context is added to the window
   > This is too early; some context is necessary for the AI to function effectively.
1. [ ] Only when you've completed the entire project
   > This is too late; performance will have already degraded significantly.
1. [x] When context utilization reaches around 60% or when the context becomes cluttered with irrelevant information
1. [ ] Never - the AI will automatically manage context
   > The AI does not automatically manage context; this is a developer responsibility.

# What is the progressive disclosure pattern in context engineering?

1. [ ] Loading all possible context at the start of a conversation
   > This is the opposite of progressive disclosure and leads to context bloat.
1. [x] Loading context on-demand as needed rather than front-loading everything
1. [ ] Gradually reducing context as the conversation progresses
   > This describes context reduction, not progressive disclosure.
1. [ ] Revealing project requirements to stakeholders incrementally
   > This describes a project management technique, not context engineering.

# What is the purpose of proof artifacts in Spec-Driven Development (SDD)?

1. [ ] To replace the need for code documentation
   > Proof artifacts complement but don't replace documentation.
1. [ ] To increase the size of the git repository
   > While they do add to repository size, this is not their purpose.
1. [x] To demonstrate functionality and provide evidence for validation that requirements have been met
1. [ ] To satisfy compliance requirements
   > While they may help with compliance, their primary purpose is validation.

`;

export { rawQuizdown }
