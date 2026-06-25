const rawQuizdown = `
---
shuffleAnswers: true
---

# In the producer/consumer pattern, what is the primary role of the queue?

1. [x] To decouple the rate at which work arrives from the rate at which it is processed
    > Correct. Each side can then scale and operate independently.
1. [ ] To ensure work is processed in the exact order it arrives
    > Not quite. Ordering is often a side-effect, but queues primarily serve to buffer work between producers and consumers — the two goals are separate design concerns.
1. [ ] To prevent the producer from sending too many messages
    > Incorrect. Producers are generally free to enqueue as fast as they like; that is the whole point of having a buffer in between.
1. [ ] To combine the producer and consumer into a single deployable unit
    > Not correct. The pattern exists specifically to keep them separate so each can be deployed, scaled, and restarted without affecting the other.

# What is the ***biggest*** limiting factor in the Bugs R Us order-processing system during a flash sale?

1. [x] The rate at which orders are processed
    > Correct. More processors would drain the queue faster.
1. [ ] The rate at which the checkout-service accepts HTTP requests
    > Incorrect. The checkout-service enqueues quickly and is not the bottleneck — it is the consumer side that falls behind, not the producer.
1. [ ] Kubernetes node CPU saturation
    > Not quite. The bottleneck is queue depth outpacing the consumer, not node-level CPU saturation affecting the whole cluster.
1. [ ] The amount of Redis memory
    > Close! The system could survive the flash sale if this was increased enuogh. But there's a better solution.

# Why did the CPU-based HPA fail to adequately protect the system during the flash sale?

1. [x] By the time elevated CPU is detected and new pods start, the queue has already grown too large
    > Correct. There is an unavoidable gap between load arriving and capacity responding.
1. [ ] The HPA cannot manage Deployments that depend on Redis as a backing store
    > Incorrect. The HPA is unaware of what data stores a Deployment uses; it only watches the metrics it is configured to evaluate.
1. [ ] The order-processor never uses enough CPU to cross the HPA threshold, so it never scales at all
    > Partially related — queue-bound workers can show low CPU even under heavy load. But even when the threshold is crossed, the fundamental problem is that CPU lags behind the actual queue backlog.
1. [ ] Kubernetes HPAs can only target StatefulSets, not Deployments
    > Incorrect. HPAs work with Deployments, ReplicaSets, and StatefulSets — the resource type is not the issue here.

# Is CPU a good autoscaling metric for a queue-consuming worker?

1. [x] No — a queue-bound worker can be fully occupied while showing low CPU, so CPU does not reflect actual backlog
    > Correct. Queue depth is a much more direct signal for this workload.
1. [ ] Yes — CPU scales linearly with the number of messages being processed, regardless of the type of work being done
    > Incorrect. Workers that spend time waiting on I/O or network calls often have low CPU even when they are the bottleneck; the relationship between throughput and CPU is workload-dependent.
1. [ ] Yes — CPU is the only metric natively exposed by Kubernetes, so it is the most practical choice
    > Incorrect. Kubernetes also exposes memory natively, and the HPA supports custom and external metrics — queue depth included — through additional configuration.
1. [ ] No — CPU metrics are unavailable inside a Kubernetes cluster without installing third-party tooling
    > Incorrect. The metrics-server ships as a standard add-on and exposes CPU to the HPA out of the box; the problem is not availability but relevance.

# The HPA syncs every 15 seconds and the metrics-server scrapes kubelets every 60 seconds. What is the worst-case lag before a scaling decision reflects current load?

1. [x] Up to 75 seconds — the scrape window and the sync period stack
    > Correct. A spike that just missed a scrape waits up to 60 s for the next one, then up to 15 s more for the HPA to act on it.
1. [ ] Exactly 15 seconds, because only the HPA sync period matters once metrics are available
    > Incorrect. The HPA can only act on data it has already received — if the last scrape was stale, the 15-second sync period starts from stale data, not from the moment the spike occurred.
1. [ ] Exactly 60 seconds, because the scrape interval is the slower of the two and therefore dominates
    > Not quite. After the metrics-server scrapes fresh data, the HPA still needs up to one more full sync cycle before it evaluates and acts on the new values.
1. [ ] There is no meaningful lag — the HPA reacts to load spikes within a second or two
    > Incorrect. Both the scrape interval and the sync period are fixed polling loops; neither reacts to events, so lag is always at least as long as the longer of the two intervals.

# Why should you avoid setting the metrics-server scrape interval and HPA sync period to very short values (e.g., 1 second each)?

1. [x] It floods the API server with requests in addition to causing the HPA to ***thrash***
    > Correct. Short intervals trade one problem (slow reaction) for two others (overhead and instability).
1. [ ] Kubernetes enforces a minimum interval of 30 seconds and will silently ignore shorter values
    > Incorrect. The intervals are fully configurable below 30 seconds; the issue is the operational consequences of doing so, not an enforced floor.
1. [ ] Very short scrape intervals corrupt the metrics-server's time-series storage
    > Incorrect. The metrics-server does not maintain a persistent time-series store — it holds only the latest sample, so there is no data corruption risk.
1. [ ] Shorter intervals cause pods to restart because the kubelet interprets rapid metric changes as liveness failures
    > Incorrect. Liveness probes are entirely separate from the metrics pipeline; scrape frequency has no effect on pod restarts.
`;

export { rawQuizdown };
