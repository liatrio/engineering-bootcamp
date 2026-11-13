const rawQuizdown = `
---
shuffleQuestions: true
shuffleAnswers: true
---

# The API team renames a response field. The front end's tests pass because they stub the API, the API's tests pass, both deploy, and production breaks. Which kind of test catches this while still testing each service on its own?

- [x] Contract test
  > Both sides are tested against a shared contract, so a provider change that breaks what the consumer uses fails the provider's build.
- [ ] Broad integration test
  > It could catch it, but it needs live versions of every service, so neither is tested on its own.
- [ ] Component test
  > Each team's component tests used doubles that described the other service the way it used to be.
- [ ] Snapshot test
  > A snapshot of the API's response would change, but nothing tells the API team the front end depends on that field.

# In consumer-driven contract testing with Pact, where does the contract come from?

- [x] The consumer's tests, recorded in a pact file
  > The provider's build then replays every interaction against the real provider.
- [ ] The provider's OpenAPI specification
  > That's provider-driven, schema-based contract testing.
- [ ] The provider's tests, published to a Pact Broker
  > The broker shares the contract, but in consumer-driven testing the consumer's tests produce it.
- [ ] A recording of traffic between both services
  > Pact contracts come from the consumer's tests, not from captured production traffic.

# What are Pact provider states, such as "a product with ID 10 exists", for?

- [x] Setting up the data an interaction needs on the provider
  > Without the right data, the provider couldn't return the response the contract expects.
- [ ] Recording which provider version is currently deployed
  > The Pact Broker tracks versions. Provider states are about test data.
- [ ] Telling the consumer's mock server which response to send
  > The consumer's tests declare the responses. Provider states are used when the provider is verified.
- [ ] Checking the provider's business rules for each request
  > Contract tests don't check business logic.

# Your API is public, and you don't know who its consumers are. Which approach fits?

- [x] Check the implementation against a published OpenAPI spec
  > The provider publishes the contract. Consumer-driven contracts work best when you know your consumers and can run their tests.
- [ ] Collect consumer-driven pact files from every consumer
  > With unknown consumers, you can't collect their contracts.
- [ ] Run the Pact Broker's \`can-i-deploy\` check before release
  > \`can-i-deploy\` checks against known consumers' contracts, which you don't have.
- [ ] Rely on end-to-end tests of the API's main journeys
  > End-to-end tests can't cover consumers you don't know about.

# Which of these should a contract test check? Select all that apply.

- [x] The fields of a response that the consumer reads
  > Keep each interaction to the fields the consumer uses, so the provider stays free to change the rest.
- [x] The status code for a request the consumer sends
  > Status codes are part of the shape and meaning of an interaction.
- [ ] That the provider calculates order totals correctly
  > Business logic is checked by the provider's own unit, component, and integration tests.
- [ ] Every field the provider returns in its responses
  > That would stop the provider from changing fields no consumer reads.
`;

export { rawQuizdown }
