# Task 1.0 — Go Application Services: Proof Artifacts

## CLI Output: checkout-service Docker Build

```
docker build -t checkout-service:local ./checkout-service

#12 [builder 6/6] RUN go build -o /checkout-service .
#12 DONE 6.2s
#14 naming to docker.io/library/checkout-service:local done
Exit code: 0
```

## CLI Output: order-processor Docker Build

```
docker build -t order-processor:local ./order-processor

#12 [builder 6/6] RUN go build -o /order-processor .
#12 DONE 5.9s
#14 naming to docker.io/library/order-processor:local done
Exit code: 0
```

## Docker Images Present

```
$ docker images | grep -E "checkout-service|order-processor"
checkout-service:local    9e50ba44af6e   17.3MB
order-processor:local     4cfc058beca4   15.8MB
```

## Notes

- Both images use `golang:1.26-alpine` builder → `alpine:3.19` final stage (multi-stage)
- go.mod pinned to `go 1.26.1` matching local toolchain; Dockerfile updated to `golang:1.26-alpine`
- `/checkout` endpoint and end-to-end Redis flow verified after cluster deploy (Task 2.0)
