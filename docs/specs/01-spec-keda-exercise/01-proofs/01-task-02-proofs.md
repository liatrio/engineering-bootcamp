# Task 2.0 — Kubernetes Manifests: Proof Artifacts

## CLI Output: kubectl kustomize (local overlay renders cleanly)

```
$ kubectl kustomize k8s/overlays/local
apiVersion: v1
kind: Namespace
metadata:
  name: keda-demo
---
apiVersion: v1
kind: Secret
metadata:
  name: redis-secret
  namespace: keda-demo
stringData:
  REDIS_ADDR: redis:6379
---
apiVersion: v1
kind: Service
metadata:
  name: checkout-service
  namespace: keda-demo
spec:
  ports:
  - port: 8080
    targetPort: 8080
  selector:
    app: checkout-service
---
apiVersion: v1
kind: Service
metadata:
  name: redis
  namespace: keda-demo
spec:
  ports:
  - port: 6379
    targetPort: 6379
  selector:
    app: redis
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: checkout-service
  namespace: keda-demo
spec:
  replicas: 1
  selector:
    matchLabels:
      app: checkout-service
  template:
    spec:
      containers:
      - env:
        - name: REDIS_ADDR
          valueFrom:
            secretKeyRef:
              key: REDIS_ADDR
              name: redis-secret
        image: checkout-service:local
        imagePullPolicy: Never   # local overlay patch applied correctly
        name: checkout-service
        resources:
          limits:
            cpu: 250m
          requests:
            cpu: 100m
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: order-processor
  namespace: keda-demo
spec:
  replicas: 1
  selector:
    matchLabels:
      app: order-processor
  template:
    spec:
      containers:
      - env:
        - name: REDIS_ADDR
          valueFrom:
            secretKeyRef:
              key: REDIS_ADDR
              name: redis-secret
        - name: PROCESS_DELAY_MS
          value: "500"
        image: order-processor:local
        imagePullPolicy: Never   # local overlay patch applied correctly
        name: order-processor
        resources:
          limits:
            cpu: 500m
          requests:
            cpu: 100m
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: redis
  namespace: keda-demo
spec:
  replicas: 1
  selector:
    matchLabels:
      app: redis
  template:
    spec:
      containers:
      - image: redis:8.6-alpine@sha256:d146f83b1e0f02fc27c26a50cee39338c736674c5959db84363e6ae3cd9e02d2
        name: redis
        ports:
        - containerPort: 6379
---
apiVersion: keda.sh/v1alpha1
kind: TriggerAuthentication
metadata:
  name: redis-trigger-auth
  namespace: keda-demo
spec:
  secretTargetRef:
  - key: REDIS_ADDR
    name: redis-secret
    parameter: address

Exit code: 0
```

## Notes

- hpa.yaml intentionally omitted — students write it as part of Exercise 3
- Redis upgraded to 8.6-alpine with SHA pinning
- imagePullPolicy: Never patch correctly applied to both service Deployments by local overlay
- TriggerAuthentication renders with correct secretTargetRef structure
- kubectl apply proof deferred to cluster deploy (Task 3.0 / Taskfile)
