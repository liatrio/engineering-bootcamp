FROM golang:1.26-alpine AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN go build -o /checkout-service .

FROM alpine:3.19
COPY --from=builder /checkout-service /checkout-service
EXPOSE 8080
ENTRYPOINT ["/checkout-service"]
