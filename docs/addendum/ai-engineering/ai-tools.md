---
docs/addendum/ai-engineering/ai-tools.md:
  category: AI Engineering
  estReadingMinutes: 18
  exercises:
    - name: Exploring Model Capabilities
      description: Get familiar comparing different AI models based on their capabilities and characteristics
      estMinutes: 30
      technologies:
        - AI Tools
---

# Using AI Tools to Enhance Development

In modern development, the use of AI tools is becoming more and more of an encouraged practice. They help to write, explain, and review code based on existing sources on the internet.

It's important to note that AI tools are not capable of thinking, and are only trying to imitate what they have seen from the internet. You should never trust anything it gives you without verifying it somehow first.

## Types of AI Tools You May Encounter:

The landscape of AI tools is constantly evolving. Here are some key distinctions and categories you might encounter:

1. **'Vanilla' LLMs vs. Tool-Augmented Models:**
   - **Vanilla LLMs:** These are the base language models without additional capabilities beyond text generation. Examples include earlier versions of ChatGPT (3.5), locally-run models via Ollama (like Llama 2/3), or basic API access to foundation models. They're limited to knowledge from their training data and cannot access external information or perform actions.
   - **Tool-Augmented Models:** Modern systems that extend base LLMs with additional capabilities like web search, code execution, or API access. Most consumer-facing AI tools today fall into this category, including current versions of ChatGPT, Claude, Gemini, Grok, and Perplexity AI.

2. **Code-Specific Assistants:**
   - Tools like GitHub Copilot, Codeium, or Amazon CodeWhisperer are specifically fine-tuned on vast amounts of code.
   - They excel at understanding programming languages, generating boilerplate code, explaining code blocks, suggesting refactoring options, and helping debug errors directly within your development environment.
   - Their deep integration allows them to understand the context of your current project files.

3. **Agentic Tools:**
   - This emerging category includes tools that can perform more complex, multi-step actions autonomously.
   - They might be able to analyze an entire codebase, suggest large-scale refactoring, generate unit tests based on your code, or even attempt to automatically fix bugs based on test results.
   - These tools are generally LLMs given the ability to interface with external tooling.
   - Examples include Windsurf Cascade, experimental features in GitHub Copilot Workspace, or specialized tools built with frameworks like LangChain or AutoGPT.
   - These tools offer significant potential but require careful oversight and validation due to their ability to make substantial changes.

The lines between these categories are increasingly blurry, as many platforms now combine multiple capabilities. Understanding these distinctions helps you select the right tool for your specific needs.

## Choosing the Right AI Model:

Behind every AI tool is an underlying Large Language Model (LLM). Different models have different strengths, weaknesses, and characteristics. Selecting the right tool often means indirectly selecting a model suitable for your task. Here are some factors to consider:

1. **Task Suitability:**
   - Some models excel at creative tasks, others at logical reasoning or mathematical problems, and still others are specifically fine-tuned for code generation or translation. A tool designed for coding (like Copilot) likely uses a model optimized for that purpose. For general knowledge or explanation, a broader model might be better.

2. **Context Window Size:**
   - The "context window" refers to the amount of information (text, code) the model can consider at one time when generating a response. This is usually measured in tokens (roughly equivalent to words or parts of words).
   - A larger context window allows the model to understand more complex requests, maintain longer conversations, or analyze larger amounts of code simultaneously. This is crucial for tasks like summarizing long documents, understanding large codebases, or having extended debugging sessions.
   - However, larger context windows can sometimes be slower or more expensive to run.

3. **Performance Benchmarks:**
   - Various standardized benchmarks (like MMLU for general knowledge, HumanEval for coding, GSM8K for math reasoning) attempt to measure and compare the performance of different models on specific tasks.
   - Resources like [https://llm-stats.com/](https://llm-stats.com/) aggregate results from these benchmarks, providing a way to compare models quantitatively.
   - **LiveBench:** [LiveBench.ai](https://livebench.ai/#/details) offers a different approach to model evaluation, focusing on reducing contamination issues. Traditional benchmarks can be "trained for", resulting in inflated scores. LiveBench regularly updates its evaluations using recent arXiv papers, movies, and news articles, ensuring each question has a verifiable grounded truth to evaluate against. This provides a more objective measure of how models perform on truly novel information.
   - **LM Arena:** [LMArena.ai](https://lmarena.ai/) takes a user-centric approach with its "vibe test." It allows users to blind taste test responses from top models and vote for the answer they prefer. This creates a leaderboard that ranks models based on which ones give users the best subjective experience, rather than just technical metrics. Both LiveBench and LM Arena are open-source projects that offer valuable alternative perspectives on model performance.
   - Keep in mind that benchmarks don't always perfectly reflect real-world performance on your specific tasks, but using a combination of different evaluation approaches can provide a more complete picture.

4. **AI Reasoning Capabilities: A User's Perspective**
   - **When to Use Reasoning Models:** As a user, reasoning models are most valuable for specific types of problems:
     - Complex multi-step problems (mathematical calculations, logical puzzles, debugging)
     - Tasks requiring careful analysis and evaluation of options
     - Problems where the process matters as much as the answer
     - Situations where you need to verify the AI's thinking process
     - Planning tasks with dependencies and constraints

   - **Interfacing with Reasoning Models:** Users don't directly interact with the underlying reasoning mechanisms (Tree of Thought, Multi-Agent Reasoning, etc.). Instead, we interact through:
     - The outputs the model chooses to show us (which may or may not reveal its full reasoning process)
     - The prompting techniques we use to elicit better reasoning
     - The tools integrated with the model (calculators, web search, etc.)

   - **Effective Prompting for Reasoning Models:**
     - **Explicit Instructions:** "Think step-by-step" or "Let's work through this systematically" can trigger more deliberate reasoning.
     - **Problem Decomposition:** Break complex problems into smaller parts: "First, let's understand X. Then, we'll analyze Y."
     - **Verification Requests:** Ask the model to verify its own work: "Double-check your calculation" or "Are there any assumptions we should question?"
     - **Alternative Perspectives:** Request the model to consider different approaches: "What's another way to solve this?" or "What would be a counterargument?"
     - **Tool Integration:** For specialized tasks, prompt the model to use appropriate tools: "Use a calculator to verify this result" or "Let's search for the latest information on this topic."

   - **Practical Applications:**
     - **Debugging Code:** "Analyze this function step-by-step and identify potential issues."
     - **System Design:** "Let's think through the components needed for this architecture."
     - **Decision Analysis:** "What are the pros and cons of each approach? Which would you recommend and why?"
     - **Research Synthesis:** For tasks requiring analysis across multiple sources, combine reasoning capabilities with web search and a methodical approach to breaking down the research question.

Choosing the right tool and understanding the underlying model's capabilities helps you leverage AI more effectively and efficiently.

# Exercise: Exploring Model Capabilities

This exercise aims to familiarize you with comparing different AI models based on standardized benchmarks and characteristics.

**Instructions:**

1. Open your web browser and navigate to: [https://llm-stats.com/](https://llm-stats.com/)
2. Explore the tables and data presented on the site. Pay attention to the different models listed and the various benchmarks used to evaluate them (e.g., coding, reasoning, general knowledge).
3. Using the information available on [llm-stats.com](https://llm-stats.com/), answer the following questions:

   - **Task 1: Coding Prowess:** Identify the model that currently holds the top score on the **HumanEval** benchmark (a common benchmark for evaluating code generation capabilities). Note down the model's name and its score.
   - **Task 2: Context Capacity:** Find the model listed with the **largest context window** (measured in tokens). Note down the model's name and its context window size.
   - **Task 3: Reasoning Skills:** Identify the model that currently achieves the highest score on the **GSM8K** benchmark (often used to assess mathematical and logical reasoning). Note down the model's name and its score.

**Note:** The landscape of AI models changes rapidly! The specific models and their scores might change frequently. The goal of this exercise is to practice navigating resources like [llm-stats.com](https://llm-stats.com/) to find relevant information for comparing models based on metrics like benchmark performance and context window size. Remember that benchmarks provide a standardized comparison but may not always perfectly reflect performance on your specific, real-world tasks.

# Deliverables

- How do AI tools contribute to your coding environment?
- How do you use these tools to get usable information?
