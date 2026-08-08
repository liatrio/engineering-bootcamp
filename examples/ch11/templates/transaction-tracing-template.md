# Transaction Trace: [Transaction Name]

> Copy this template and fill in each section as you trace a transaction through a multi-service system. Delete the guidance text (in blockquotes) as you go.

## Transaction Name

> A short, specific name for the user-facing action you're tracing, e.g. "Add item to cart" or "Place order."

## Entry Point

> The URL/endpoint and HTTP method a client first calls to kick off this transaction, e.g. `POST /api/cart` on the frontend.

## Services Involved

> List every service the transaction touches, in the order it touches them, with a one-line description of that service's role in this transaction.

| Service | Role in this transaction |
|---|---|
| | |

## Request Flow

> Step-by-step, service → service, with the protocol and the operation called. Number each step.

1. `Client` → `ServiceA`: ...
2. `ServiceA` → `ServiceB`: ...

## Data Transformations

> What does the data look like at each step? Where does its shape or content change (form data → JSON → protobuf → SQL row, etc.)?

## Potential Failure Points

> Where could this transaction break? What happens if a downstream service is slow, returns an error, or is unreachable? Does the caller retry, time out, or fail the whole request?

## Notes

> Anything else worth recording: surprising design choices, dead ends you investigated, questions you couldn't answer from the code alone.
