# Integration Exercise Example: Product Recommendation Flow

> This is a worked example showing the expected depth and structure for Exercise 4 (Integration Exercise). It analyzes the "you might also like" product recommendation feature in the OpenTelemetry Demo Application — a feature not covered in the earlier worked examples in this chapter.

## Overview

When a shopper views a product page, the storefront shows a "you might also like" section with a handful of other products. This is powered by a dedicated recommendation service that looks at what's already in the shopper's view (or cart) and suggests other catalog items — a small but complete example of a service that exists purely to enrich another service's response, rather than to own its own core business data.

## Architecture

| Component | Responsibility |
|---|---|
| Frontend (Next.js) | Renders the product page; requests recommendations and their full details before rendering |
| Recommendation Service (Python, gRPC) | Given a list of product IDs already in view, returns a list of *other* product IDs to recommend |
| Product Catalog Service (Go, gRPC) | Source of truth for all product data; used both by the recommendation service (to know what exists) and the frontend (to get full details for the recommended IDs) |

See [`diagrams/component.puml`](diagrams/component.puml) for the full component diagram.

## Transaction Flow

1. Frontend renders a product page and calls the Recommendation Service's `ListRecommendations` RPC, passing the product ID(s) currently in view.
2. The Recommendation Service calls the Product Catalog Service's `ListProducts` RPC to get the full catalog of product IDs.
3. The Recommendation Service filters out the product(s) already in view, randomly selects a handful of the remainder, and returns just their **IDs** (not full product details) to the frontend.
4. The frontend calls the Product Catalog Service's `GetProduct` RPC once per recommended ID to fetch full details (name, price, image) for rendering.
5. The frontend renders the "you might also like" section.

See [`diagrams/sequence.puml`](diagrams/sequence.puml) for the complete sequence diagram, and [`diagrams/dataflow.puml`](diagrams/dataflow.puml) for how the data shape changes at each step.

## Data Storage

Neither the Recommendation Service nor this flow touch a database directly — the Product Catalog Service is the sole source of product data (served from an in-memory/static catalog in the demo). The recommendation logic itself is stateless and computed fresh on every request.

## Key Decisions

The recommendation service deliberately returns only product **IDs**, not full product objects, requiring the frontend to make follow-up calls to the Product Catalog Service. See [`adr-example.md`](adr-example.md) for the full analysis of why this boundary was drawn where it was, instead of having the recommendation service return complete product details directly.
