# syntax=docker/dockerfile:1

# ---- build stage: compile a static binary ----
FROM golang:1.27.1-alpine AS build
WORKDIR /src

# Download modules first so this layer is cached until go.mod/go.sum change.
COPY go.mod go.sum ./
RUN go mod download

COPY . .
# CGO off = a fully static binary that runs on an image with no libc.
RUN CGO_ENABLED=0 go build -trimpath -ldflags="-s -w" -o /out/notifications-service .

# ---- runtime stage: distroless, no shell, non-root ----
FROM gcr.io/distroless/static-debian13:nonroot
COPY --from=build /out/notifications-service /notifications-service
USER nonroot:nonroot
EXPOSE 8080
ENV PORT=8080
# No HEALTHCHECK: docker compose defines health checks (SPEC.md).
ENTRYPOINT ["/notifications-service"]
