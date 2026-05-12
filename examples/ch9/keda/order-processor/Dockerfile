FROM golang:1.26-alpine AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN go build -o /order-processor .

FROM alpine:3.19
COPY --from=builder /order-processor /order-processor
ENTRYPOINT ["/order-processor"]
