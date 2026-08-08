# ADR 3: Use Multiple, Purpose-Specific Datastores (Polyglot Persistence)

> Example ADR written by analyzing the OpenTelemetry Demo Application. This is a worked example showing the level of detail expected in Exercise 3 — not an official OTel Demo document.

## Status

Accepted

## Context

Different services in the OTel Demo have very different data access patterns. The cart service needs extremely fast key-value reads/writes keyed by user session, with data that's disposable (carts expire, get abandoned, get cleared on checkout). The feature flag service needs structured, queryable, durable configuration data that operators edit directly. Forcing every service to share one general-purpose relational database would mean either over-provisioning that database for cart-service-level traffic, or under-serving services that actually need relational querying.

## Decision

Give each service the datastore that fits its access pattern, rather than standardizing on one database for the whole system: a Redis-compatible in-memory store (Valkey) for the cart service's ephemeral, high-throughput key-value data, and a relational database (PostgreSQL) for the feature flag service's structured, durable configuration data. Most other services hold their data in-memory or as static seed data, since the demo prioritizes clarity over persistence for catalog-style data.

## Consequences

**Positive:**

- Each datastore is a good fit for its owning service's actual access pattern — the cart service gets the low-latency key-value performance it needs without paying for relational query overhead it doesn't use.
- Services remain independently deployable and scalable — the cart's datastore can be scaled or reconfigured without touching the feature flag service's database, and vice versa.
- It's an honest, realistic demonstration: production microservice systems are almost always polyglot-persistence systems in practice, which makes the demo a more useful reference for students.

**Negative:**

- Operating multiple different kinds of datastores means more operational surface area — different backup strategies, different failure modes, different tools to monitor, compared to "just run backups on the one database."
- There's no single place to run a cross-service query or join — understanding "the whole picture" of system state requires knowing which service owns which piece of data and querying each independently.
- New engineers need to learn more than one datastore's operational quirks instead of specializing in a single technology.

## Alternatives Considered

- **Single shared relational database for everything:** simpler to operate and back up, but couples services through a shared schema (a classic distributed-monolith trap) and forces a one-size-fits-all performance profile onto services with very different needs.
- **Single shared NoSQL store for everything:** avoids the shared-schema coupling problem but still forces every service into one performance/consistency model, and doesn't fit the feature flag service's need for structured, queryable data.

## References

- [Polyglot Persistence (Martin Fowler)](https://martinfowler.com/bliki/PolyglotPersistence.html)
