# ADR: Recommendation Service Returns Product IDs, Not Full Product Data

> Example ADR for the integration exercise worked example (Product Recommendation Flow).

## Status

Accepted

## Context

The Recommendation Service needs to tell the frontend which products to show in a "you might also like" section. It has access to the full product catalog (it calls the Product Catalog Service's `ListProducts` to compute recommendations), so it technically *could* return complete product objects — name, price, description, image — directly to the frontend, saving the frontend from making follow-up calls.

## Decision

The Recommendation Service returns only a list of recommended product **IDs**. The frontend is responsible for calling the Product Catalog Service's `GetProduct` separately for each recommended ID to get full details.

## Consequences

**Positive:**

- **Single source of truth for product data.** Only the Product Catalog Service ever returns full product details, so there's exactly one place product data can drift out of date or be formatted inconsistently.
- **Looser coupling.** The Recommendation Service's contract doesn't need to change if the Product Catalog Service adds new fields to its product schema — it never touches that data beyond IDs and whatever it needs internally to filter.
- **Simpler recommendation logic.** The service's only job is "which IDs," which keeps it small, easy to reason about, and easy to swap out (e.g. for a real ML-based recommender later) without touching how product details are served.

**Negative:**

- **Extra round trips.** The frontend now makes N additional gRPC calls (one per recommended product) instead of getting everything in one response from the Recommendation Service — more network hops, more places for partial failure (one `GetProduct` call failing shouldn't break the whole section, but that has to be handled explicitly).
- **Duplicated catalog lookups.** Both the Recommendation Service (to compute recommendations) and the frontend (to render them) end up calling into the Product Catalog Service for related data, within the same user-facing request.

## Alternatives Considered

- **Return full product objects from the Recommendation Service:** fewer round trips for the frontend, but couples the recommendation contract to the full product schema and duplicates "what does a product look like" logic across two services.
- **Have the frontend call `ListProducts` directly and do its own filtering client-side:** would remove the Recommendation Service's value entirely — the whole point of the service is to own the (eventually more sophisticated) recommendation logic in one place.

## References

- [`diagrams/sequence.puml`](diagrams/sequence.puml) — shows the extra `GetProduct` round trips this decision introduces
