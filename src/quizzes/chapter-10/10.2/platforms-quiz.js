const rawQuizdown = `
---
shuffleAnswers: true
shuffleQuestions: true
---

# What is the primary benefit of separating infrastructure into a library repo and a deploy repo?

1. [x] Components can be developed and versioned independently without affecting production
	> Correct. This separation allows platform teams to develop and test components separately, with each component independently versioned.
1. [ ] It reduces the total number of Git repositories needed
	> Incorrect. This approach actually uses more repositories, but provides better separation of concerns.
1. [ ] It eliminates the need for CI/CD pipelines
	> Incorrect. Both repos still need CI/CD pipelines for linting, testing, and deployment.
1. [ ] It allows developers to bypass code review
	> Incorrect. Code review is still important in both repositories.

# What is the Rendered Manifests Pattern?

1. [x] Pre-rendering Helm/Kustomize templates in CI and committing plain YAML to Git
	> Correct. This makes PRs easier to review since you see the actual manifests, not just template changes.
1. [ ] Having ArgoCD render templates at deploy time
	> Incorrect. This is the default behavior, not the Rendered Manifests Pattern.
1. [ ] Storing manifests as binary files
	> Incorrect. Manifests are always stored as text (YAML).
1. [ ] Generating manifests manually without any templating
	> Incorrect. The pattern still uses templating tools, but renders them before committing.

# What does IRSA (IAM Roles for Service Accounts) enable?

1. [x] Pods can authenticate to AWS services using temporary credentials without storing long-lived secrets
	> Correct. IRSA links Kubernetes service accounts to IAM roles via an OIDC provider.
1. [ ] Users can log into the AWS console from kubectl
	> Incorrect. IRSA is for pod-level authentication, not user authentication.
1. [ ] S3 buckets can be mounted directly as volumes
	> Incorrect. While there are solutions for this, it's not what IRSA provides.
1. [ ] EKS clusters can span multiple AWS regions
	> Incorrect. IRSA is about authentication, not cluster topology.

# What is the App of Apps pattern in ArgoCD?

1. [x] A hierarchical structure where one root Application manages other Applications
	> Correct. This pattern helps organize and bootstrap multiple applications from a single entry point.
1. [ ] Running multiple ArgoCD instances in the same cluster
	> Incorrect. The pattern is about organizing Applications, not ArgoCD instances.
1. [ ] Deploying the same application to multiple clusters
	> Incorrect. That's multi-cluster deployment, not App of Apps.
1. [ ] Using multiple Git repositories for one application
	> Incorrect. The pattern is about Application hierarchy, not repository structure.

# Why is Terragrunt used in the deploy repo?

1. [x] To reduce configuration complexity and improve code reuse when orchestrating Terraform modules
	> Correct. Terragrunt is a lightweight wrapper that helps manage Terraform deployments with less duplication.
1. [ ] To replace Terraform entirely
	> Incorrect. Terragrunt wraps Terraform, it doesn't replace it.
1. [ ] To deploy Kubernetes manifests directly
	> Incorrect. Terragrunt is for Terraform orchestration, not direct Kubernetes deployment.
1. [ ] To provide a GUI for infrastructure management
	> Incorrect. Terragrunt is a CLI tool, not a GUI.

# What problem does External Secrets Operator solve?

1. [x] It allows secrets to be managed declaratively by syncing from external secret stores like AWS Secrets Manager
	> Correct. This eliminates manual secret configuration and makes the cluster fully reproducible.
1. [ ] It encrypts all network traffic in the cluster
	> Incorrect. That's handled by service mesh or network policies, not External Secrets.
1. [ ] It provides a UI for viewing secrets
	> Incorrect. External Secrets syncs secrets, it doesn't provide a viewing UI.
1. [ ] It automatically rotates SSH keys
	> Incorrect. While it can sync rotated secrets, it doesn't perform the rotation itself.

`;

export { rawQuizdown }
