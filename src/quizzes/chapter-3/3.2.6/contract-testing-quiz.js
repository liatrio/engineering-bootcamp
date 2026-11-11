const rawQuizdown = `
---
shuffleQuestions: true
shuffleAnswers: true
---

# The API team renames a response field. The front-end team's tests pass because they stub the API, the API's tests pass, both deploy, and production breaks. Which kind of test catches this while still testing each service on its own?

- [x] Contract test
  > Both sides are tested against a shared contract, so a provider change that breaks what the consumer uses fails the provider's build.
- [ ] Unit test
  > Each team's unit tests used doubles that described the other service the way it used to be.
- [ ] End-to-end test
  > It could catch it, but it needs both services deployed together at compatible versions, and it's slow and brittle.
- [ ] Load test
  > Load tests measure behavior under traffic, not agreement between services.

# In consumer-driven contract testing with Pact, where does the contract come from?

- [x] The consumer's tests, which declare the interactions they expect and record them in a pact file
  > The provider then replays every interaction against the real provider.
- [ ] The provider's OpenAPI specification
  > That's provider-driven, schema-based contract testing.
- [ ] A shared end-to-end test environment
  > Contract tests avoid deploying the services together.
- [ ] The provider team writes it by hand from its source code
  > In the consumer-driven approach, the consumer's needs define the contract.

# What are Pact provider states, such as "a product with ID 10 exists", for?

- [x] They let the provider set up the data each interaction needs before the interaction is replayed
  > Without the right data, the provider couldn't return the response the contract expects.
- [ ] They record which version of the provider is deployed
  > The Pact Broker tracks versions. Provider states are about test data.
- [ ] They describe the provider's business logic
  > Contract tests don't check business logic.
- [ ] They replace the provider with a mock
  > The provider is real when it's verified. The *consumer* is tested against a mock.

# Your API is public, and you don't know who its consumers are. Which approach fits?

- [x] Provider-driven contracts, such as checking the implementation against a published OpenAPI specification
  > Consumer-driven contracts work best when you know your consumers and can run their tests.
- [ ] Consumer-driven contracts collected from every possible consumer
  > With unknown consumers, you can't collect their contracts.
- [ ] No contract testing; rely on unit tests
  > Unit tests can't tell you when you've broken a consumer.
- [ ] End-to-end tests against every consumer
  > You can't deploy consumers you don't know about.

# Which of these should a contract test check? Select all that apply.

- [x] The fields of a response the consumer actually reads
  > Keep each interaction to the fields the consumer uses, so the provider stays free to change the rest.
- [x] The status code returned for a request the consumer sends
  > Status codes are part of the shape and meaning of an interaction.
- [ ] That the provider calculates prices correctly
  > Business logic is checked by the provider's own unit, component, and integration tests.
- [ ] Every field the provider returns, including ones no consumer uses
  > That would stop the provider from changing anything, even fields nobody reads.
`;

export { rawQuizdown }
