# ADR 1: Use gRPC for Internal Service-to-Service Communication

> Example ADR written by analyzing the OpenTelemetry Demo Application. This is a worked example showing the level of detail expected in Exercise 3 — not an official OTel Demo document.

## Status

Accepted

## Context

The OTel Demo is composed of ~15 backend services written in a deliberately wide mix of languages (Go, .NET, Java, Python, Node.js, Rust, C++, Ruby, Kotlin, PHP) to demonstrate OpenTelemetry instrumentation across ecosystems. These services need to call each other constantly and synchronously — the frontend calls the cart service, the checkout service calls product catalog, currency, shipping, payment, and email services, and so on. With that many polyglot services, two problems show up immediately: (1) without a shared contract, it's easy for services to drift on request/response shapes as they evolve independently, and (2) JSON-over-HTTP works but has real serialization overhead when a single user action can trigger a dozen internal calls.

## Decision

Use gRPC, with `.proto` files as the shared source of truth for service contracts, for all internal (service-to-service) communication. External-facing traffic (browser to frontend) remains plain HTTP/JSON, since browsers don't speak gRPC natively.

## Consequences

**Positive:**

- A single `.proto` definition generates strongly-typed client/server code in every language used across the demo, so a Go service and a Ruby service can call each other without hand-written serialization code drifting apart.
- Protobuf's binary wire format is meaningfully smaller and faster to (de)serialize than JSON, which matters when a checkout can fan out to 6+ internal calls.
- Contract changes are visible in code review as diffs to `.proto` files, making breaking changes easier to catch before they ship.

**Negative:**

- gRPC is harder to poke at manually than REST — you can't just `curl` an endpoint and read the response; you need a gRPC-aware client (like `grpcurl`) or generated code.
- Debugging requires understanding both the gRPC framework and protobuf serialization, which is a steeper learning curve for engineers who've only worked with REST APIs.
- The frontend still needs an HTTP-to-gRPC translation layer for browser traffic, adding a component (and a place for bugs) that a pure-REST architecture wouldn't need.

## Alternatives Considered

- **REST/JSON everywhere:** simpler to debug and universally supported, but loses compile-time contract safety across 10 different languages and adds serialization overhead on the hot path.
- **A single shared language:** would simplify communication but defeats the demo's explicit goal of showing OpenTelemetry instrumentation across a realistic polyglot stack.

## References

- [gRPC documentation](https://grpc.io/docs/)
- OTel Demo `pb/` directory (shared `.proto` definitions)
