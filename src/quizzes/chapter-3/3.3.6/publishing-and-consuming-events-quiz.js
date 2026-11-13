const rawQuizdown = `
---
shuffleQuestions: true
shuffleAnswers: true
---

# assignments-service publishes \`assignment.created\` before \`SaveChangesAsync()\`, and the save then fails on the unique index. What goes wrong?

- [x] Consumers react to an assignment that was never saved
  > That's a ghost event. Publishing after the commit avoids it, at the cost of possibly losing an event instead.
- [ ] The event is lost, because RabbitMQ drops events from failed requests
  > RabbitMQ knows nothing about your request or database. Once published, the event is delivered.
- [ ] Nothing, because the exception handler rolls back the published event
  > A published message can't be rolled back. The broker and the database don't share a transaction.
- [ ] The client gets a 201 even though the save failed
  > The save throws, so the client gets a 409. The problem is the event that already went out.

# Which change fixes the lost-event problem in employees-service?

- [x] Write the event to an outbox table in the same transaction
  > Both writes commit together or not at all. The relay retries publishing until RabbitMQ accepts it.
- [ ] Publish the event first, then commit the employee to the database
  > That swaps lost events for ghost events: consumers would hear about employees that failed to save.
- [ ] Fail the request with a 500 whenever the publish throws an exception
  > The employee is already committed, so the client would be told it failed when it didn't, and the event is still lost.
- [ ] Retry the publish in a loop inside the request until RabbitMQ is back
  > The request would hang for as long as the outage lasts, and a restart still loses the event.

# Why must the \`employee.deleted\` consumer be idempotent?

- [x] RabbitMQ can deliver the same message more than once
  > Delivery is at least once. A crash or dropped connection before the ack means the message comes again.
- [ ] employees-service publishes every event twice for safety
  > It publishes each event once. Duplicates come from redelivery, or later from an outbox relay.
- [ ] Idempotent handlers process messages faster than other handlers
  > Idempotency is about correctness under duplicates, not speed.
- [ ] The queue is durable, and durable queues duplicate every message
  > Durability means messages survive a broker restart. It doesn't duplicate them.

# The consumer receives a message whose body isn't valid JSON. What should it do?

- [x] Nack it without requeueing and log an error
  > It will fail the same way every time. Requeueing would loop forever and hold up the queue.
- [ ] Nack it with requeue, so it's retried until it parses
  > The body won't change between deliveries, so it will never parse.
- [ ] Ack it silently, since there's nothing useful in it
  > Dropping it is right, but silently hides a publisher bug. Log it, and with a dead-letter exchange it can be inspected.
- [ ] Stop consuming until someone fixes the message by hand
  > One bad message shouldn't block every good one behind it.

# Why does \`EmployeeDeletedConsumer\` create a new scope for each message?

- [x] It's a singleton, but the DbContext it needs is scoped
  > Background work has no HTTP request, so it makes a scope per message, just like DatabaseInitializer.
- [ ] RabbitMQ requires a new DI scope for every acknowledgement
  > RabbitMQ knows nothing about .NET's DI container.
- [ ] Scopes make the consumer process messages in parallel
  > Parallelism comes from prefetch and the consumer's dispatch, not from scopes.
- [ ] A scope keeps the channel open while the message is handled
  > The channel belongs to the consumer and lives as long as it does, whatever the scopes.
`;

export { rawQuizdown }
