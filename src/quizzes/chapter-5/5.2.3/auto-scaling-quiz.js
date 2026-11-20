const rawQuizdown = `
---
shuffleAnswers: true
---

# A Load Balancer Health Check is monitoring the EC2 instance

1. [ ] True
	> Not quite. An EC2 Health Check monitors the actual infrastructure
1. [x] False
	> Good. A Load Balancer Health Check monitors the application running on the instance

# Why is auto scaling important in cloud environments?

1. [x] It allows infrastructure to scale based on real-time demand
  > Correct. Quick and immediate control of infrastructure is part of the power of Cloud Computing.
1. [ ] It increases cost by running maximum resources at all times
  > Close. Poorly configuted auto scaling could increase costs.
1. [ ] It automatically deploys code updates
  > Not quite. Auto scaling is not responsible for code updates.

# What is the primary benefit of auto scaling when traffic to an application is unpredictable?

1. [x] Optimizes performance and cost
  > Good. Auto-scaling can provide immediate response to changing traffic.
1. [ ] Reduces developer workload
  > Close. Reducing need for human intervention is a benefit, but not the primary benefit.
1. [ ] Eliminates the need for monitoring
  > Incorrect. Observing your application's performance is still important.
1. [ ] Allows more frequent deployments
  > Not quite. Auto-scaling does help enable CI/CD, but is not the primary benefit.

# Which of the following is not typically used as a trigger for auto scaling?

1. [x] Application code size
  > Correct. Auto-scaling is not responsible for code updates.
1. [ ] Memory usage
  > Not quite. This is a valid reason to scale.
1. [ ] Disk I/O
  > Not quite. This is a valid reason to scale.
1. [ ] Network throughput
  > Not quite. This is a valid reason to scale.

# What would likely happen if your auto scaling group has no defined maximum instance count?

1. [x] It could launch unlimited instances, potentially increasing costs
  > Good. A risk of poorly implemented auto-scaling is increased cost and resource utilization.
1. [ ] Scaling will stop automatically after 5 instances
  > Incorrect. Auto-scaling will continue to scale until the maximum instance count is reached.
1. [ ] Auto scaling will not work
  > Incorrect. Auto-scaling will continue to scale to reach the percieved demand.
1. [ ] It will use default settings to cap at 3 instances
  > Incorrect.

# Auto scaling eliminates the need to monitor application performance

1. [ ] True
  > Incorrect. Having robust observability is still required even if you have extra tooling to lighten the manual work.
1. [x] False
  > Good. Auto-scaling does not remove the need for observability.

`;

export { rawQuizdown };
