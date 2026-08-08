# Presentation Outline Example: Product Recommendation Flow

> A filled-in example of the [presentation outline template](../templates/presentation-outline.md), showing the expected level of specificity.

## 1. Introduction (~1 min)

"I analyzed the product recommendation feature in the OTel Demo — the 'you might also like' section on each product page. It's a small feature, but it's a clean example of a service that exists purely to enrich another service's data, which makes it a good case study for service boundaries."

## 2. System Overview (~3 min)

- Show `diagrams/component.puml`
- Three components involved: Frontend, Recommendation Service, Product Catalog Service
- Explain: the Recommendation Service has no database of its own — it's stateless, computing fresh recommendations from the catalog on every call

## 3. Deep Dive (~6 min)

- Show `diagrams/sequence.puml`
- Walk through: shopper loads a product page → frontend asks the Recommendation Service for IDs → Recommendation Service asks the Product Catalog Service for the full list, filters, samples → returns just IDs → frontend calls `GetProduct` once per ID → renders the section
- Point out the loop in the diagram (N `GetProduct` calls) as the most "surprising" part of the trace — it wasn't obvious from the UI, only from reading the code

## 4. Trade-offs (~3 min)

- Present the ADR: why return IDs instead of full product data?
- Trade-off: extra round trips and duplicated catalog lookups, in exchange for a single source of truth for product data and a Recommendation Service that stays simple and swappable
- "If this were a performance-critical path instead of a 'nice to have' UI section, I'd revisit this — but for this feature, the coupling reduction is worth the extra calls."

## 5. Q&A (~2 min)

- Anticipated question: "Why not cache the product details in the Recommendation Service?" — answer: it would reintroduce a second source of truth for product data, and this feature isn't performance-sensitive enough to justify that yet.
