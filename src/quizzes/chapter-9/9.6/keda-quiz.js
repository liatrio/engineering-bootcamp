const rawQuizdown = `
---
shuffleQuestions: true
shuffleAnswers: true
---

# In the producer/consumer pattern, what is the primary role of the queue?

1. [x] To decouple the rate at which work arrives from the rate at which it is processed
    > Correct. The queue acts as a buffer between the producer and consumer, allowing each to scale and operate independently.
1. [ ] To ensure work is processed in the exact order it arrives
    > Not quite. While queues often preserve order, the primary purpose is decoupling producers from consumers.
1. [ ] To prevent the producer from sending too many messages
    > Incorrect. The producer is generally free to enqueue as fast as it can; the queue absorbs the burst.
1. [ ] To combine the producer and consumer into a single deployable unit
    > Not correct. The pattern specifically separates these concerns so they can be scaled independently.

# What is the limiting factor in the Bugs R Us order-processing system during a flash sale?

1. [x] The order-processor's single-threaded queue consumption rate falls behind the checkout-service's enqueue rate, causing the Redis queue to grow until memory is exhausted
    > Correct. A single order-processor pod can only consume one order at a time; when orders arrive faster than they are processed, the queue fills Redis memory and orders are dropped.
1. [ ] The checkout-service cannot accept HTTP requests fast enough
    > Incorrect. The checkout-service scales independently and is not the bottleneck described in the scenario.
1. [ ] Kubernetes node CPU is fully saturated by the checkout-service
    > Not quite. The bottleneck is queue depth, not CPU on the checkout-service.
1. [ ] Redis rejects connections once enough clients connect
    > Incorrect. The constraint is Redis memory from an unbounded queue, not connection limits.

# Why did the CPU-based HPA fail to adequately protect the system during the flash sale?

1. [x] CPU metrics are a lagging indicator — by the time the HPA detects elevated CPU and scales out, the queue has already grown large enough to cause failures
    > Correct. The HPA reacts to CPU after the fact; new pods then take additional time to start, meaning there is a window where queue depth grows unchecked.
1. [ ] The HPA cannot scale Deployments that use Redis
    > Incorrect. The HPA has no dependency on what backing store a Deployment uses.
1. [ ] The order-processor does not use enough CPU to trigger the HPA threshold
    > This is actually a related problem — queue-bound workers often show low CPU even under heavy load, making CPU a poor signal. But the core failure is that CPU is a lagging indicator regardless of threshold.
1. [ ] Kubernetes HPAs can only scale StatefulSets, not Deployments
    > Incorrect. HPAs work with Deployments, ReplicaSets, and StatefulSets.

# Is CPU a good autoscaling metric for a queue-consuming worker?

1. [x] No — a queue-bound worker may be fully busy processing orders while showing low CPU, so CPU does not reliably reflect the actual backlog
    > Correct. Workers that spend time waiting on I/O or external calls often have low CPU utilization even when they are the bottleneck, making CPU a misleading signal.
1. [ ] Yes — CPU always increases proportionally with workload for any type of service
    > Incorrect. I/O-bound and queue-bound workers frequently show low CPU even under heavy load.
1. [ ] Yes — CPU is the only metric the Kubernetes HPA supports
    > Incorrect. The HPA supports custom and external metrics in addition to CPU and memory.
1. [ ] No — CPU metrics are never available inside a Kubernetes cluster
    > Incorrect. CPU metrics are available via the metrics-server; the issue is that they are not a meaningful signal for this workload.

# The HPA syncs every 15 seconds and the metrics-server scrapes kubelets every 60 seconds. What is the worst-case lag before a scaling decision reflects current load?

1. [x] Up to 75 seconds — a new metric may not be scraped for up to 60 seconds, and the HPA may not act on it for another 15 seconds after that
    > Correct. These two intervals stack: stale scrape data plus the HPA evaluation period combine for a worst-case lag of ~75 seconds.
1. [ ] Exactly 15 seconds, because the HPA sync period dominates
    > Incorrect. The HPA can only act on metrics it has received; if the metrics-server has not yet scraped fresh data, the HPA is working with stale numbers.
1. [ ] Exactly 60 seconds, because the scrape interval dominates
    > Not quite. After the scrape the HPA still needs up to one more sync cycle before it evaluates and acts.
1. [ ] There is no lag — the HPA reacts instantly to load spikes
    > Incorrect. Both the scrape interval and the HPA sync period introduce latency before a scaling decision is made.

# Why should you avoid setting the metrics-server scrape interval and HPA sync period to very short values (e.g., 1 second each) to maximize responsiveness?

1. [x] Extremely short intervals generate excessive API server and metrics-server load, and can cause thrashing where the HPA scales up and down too rapidly
    > Correct. Every scrape and sync is a request to the API server and metrics-server; at very short intervals this overhead becomes significant, and rapid metric fluctuations lead to noisy, oscillating scaling decisions.
1. [ ] Short intervals are not supported by the Kubernetes API
    > Incorrect. The intervals are configurable; the problem is the operational cost and instability they introduce.
1. [ ] The HPA will ignore interval changes shorter than 30 seconds
    > Incorrect. The HPA respects the configured sync period regardless of its value.
1. [ ] Short intervals cause pods to restart more frequently
    > Incorrect. The scrape interval affects metric freshness, not pod lifecycle.
`;

export { rawQuizdown };
