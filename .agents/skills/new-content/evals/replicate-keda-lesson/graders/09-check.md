---
type: llm
focus: trace
weight: 1
---

The written page file is a usable KEDA lesson that would need no structural rewrite. It must teach all of: why a CPU-based HPA fails to protect a queue consumer under a sudden surge (CPU stays low while the Redis queue grows); installing KEDA after removing the HPA; a ScaledObject that scales on Redis list length; and a comparison of the baseline, HPA and KEDA load-test runs. It uses the existing examples/keda system rather than rebuilding it, and links official KEDA docs
