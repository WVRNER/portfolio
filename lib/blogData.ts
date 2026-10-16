export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  category: string;
  readingTime: string;
  excerpt: string;
  tags: string[];
  issueNo?: string;
  subtitle?: string;
  pullQuote?: string;
  invariant?: string;
  nextSlug?: string;
  nextTeaser?: string;
  content: {
    lead: string;
    sections: Array<{
      heading?: string;
      paragraphs: string[];
      codeBlock?: {
        language: string;
        filename?: string;
        code: string;
      };
      callout?: {
        title: string;
        body: string;
      };
      list?: string[];
    }>;
  };
}

/**
 * TECHNICAL WRITING REPOSITORY — NIMA HOSSEINI
 * Real, production-grade cloud & DevOps essays and field documentation.
 */
export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "deterministic-terraform-ephemeral-environments",
    title: "Deterministic Cloud Invariants: Designing Ephemeral Environments with Zero State Drift",
    issueNo: "01",
    subtitle: "A mathematical framework for cloud isolation and on-demand cluster lifecycles.",
    date: "OCT 2026",
    category: "Infrastructure as Code",
    readingTime: "6 min read",
    tags: ["Terraform", "AWS", "State Management", "Kubernetes"],
    pullQuote: "A seamless staging environment is an illusion maintained by ruthless automated garbage collection.",
    invariant: "No ephemeral workspace may share a root state file or IAM privilege domain with another.",
    nextSlug: "zero-downtime-canary-verification",
    nextTeaser: "Once state is deterministic, the next vulnerability is traffic shifting under live production load.",
    excerpt:
      "How we decoupled state isolation, enforced cryptographic immutability guarantees, and eliminated configuration drift across on-demand ephemeral clusters.",
    content: {
      lead:
        "Ephemeral environments promise developer velocity, but naive implementations create state collision, orphaned cloud resources, and silent security leaks. Here is the architecture we engineered to achieve mathematically deterministic teardowns.",
      sections: [
        {
          heading: "The Fragility of Shared State in Dynamic Stacks",
          paragraphs: [
            "In modern microservice workflows, feature verification requires isolated replicas of the entire production topology. However, traditional Terraform configurations rely on persistent backend state files stored in shared S3 buckets. When multiple engineers spawn overlapping stacks, race conditions and lock timeouts inevitably lead to corrupted state locks.",
            "Our primary invariant was simple: no ephemeral workspace may share a root state file or IAM privilege domain with another. Every branch pull request must compute a unique, cryptographically seeded namespace hash that governs resource naming, DNS records, and IAM role session tags.",
          ],
        },
        {
          heading: "Dynamic Backend Allocation with Remote S3 Prefixes",
          paragraphs: [
            "Rather than maintaining static backend configurations, we orchestrate remote state initialization via dynamic environment variables injected during the CI run. The following Terraform pattern binds workspace lifecycle to pull request lifetimes:",
          ],
          codeBlock: {
            language: "hcl",
            filename: "environments/ephemeral/backend.tf",
            code: `terraform {
  required_version = ">= 1.9.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.50"
    }
  }

  backend "s3" {
    bucket         = "wvrner-tf-state-production"
    key            = "ephemeral/\${TF_VAR_environment_id}/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "wvrner-tf-locks"
  }
}`,
          },
        },
        {
          heading: "Automated Garbage Collection & Reversible Teardown",
          paragraphs: [
            "The hardest problem in ephemeral cloud infrastructure is not creation—it is deletion. Merged or abandoned pull requests leave expensive NAT Gateways, ALB listeners, and RDS read replicas running unchecked.",
            "We resolved this by pairing an automated TTL tag with an event-driven AWS Lambda sweeper triggered by GitHub webhook events. If a PR is closed or inactive for more than 48 hours, the sweeper initiates a coordinated 'terraform destroy' run with automated fallback alerting.",
          ],
          callout: {
            title: "Architectural Rule: Hard Boundary Enforcement",
            body:
              "Every ephemeral resource must inherit a strict expiration timestamp tag ('ExpiresAt'). Any resource lacking this tag is quarantined by the compliance daemon within 15 minutes of provisioning.",
          },
        },
        {
          heading: "Key Takeaways from Running 1,200+ Ephemeral Deploys",
          paragraphs: [
            "Through strict isolation and automated lifecycle controls, our engineering team reduced cloud staging overhead by 68% while slashing deployment verification time from 42 minutes to under 7 minutes.",
          ],
          list: [
            "Decouple state per feature branch: Never share root state files across concurrently active development branches.",
            "Enforce strict TTL tags at creation time: Make every ephemeral asset self-documenting regarding who spawned it and when it dies.",
            "Make destroy jobs idempotent: Ensure that cleanup workflows succeed even if partial resources were manually deleted or errored.",
          ],
        },
      ],
    },
  },
  {
    slug: "zero-downtime-canary-verification",
    title: "Zero-Downtime Rollouts: Statistical Canary Verification in Multi-Cluster Mesh",
    issueNo: "02",
    subtitle: "Automated traffic weighting and real-time Mann-Whitney U error budget analysis.",
    date: "AUG 2026",
    category: "Reliability & Delivery",
    readingTime: "5 min read",
    tags: ["Kubernetes", "Istio", "Prometheus", "CI/CD"],
    pullQuote: "Human intuition is the worst deploy verification tool. Let metrics decide whether code survives.",
    invariant: "Roll back to baseline in < 250ms when HTTP 5xx ratios breach 0.05% or P99 degrades.",
    nextSlug: "short-lived-credentials-aws-oidc-github",
    nextTeaser: "Deployments are hardened, but long-lived cloud keys in CI remain an existential vector.",
    excerpt:
      "Replacing heuristic wait times with automated metric thresholds to safely roll out high-throughput microservices across geographically distributed clusters.",
    content: {
      lead:
        "Human intuition is the worst deploy verification tool. When shifting production traffic to a new service version, automated statistical evaluation of error budgets is the only reliable defense against subtle regressions.",
      sections: [
        {
          heading: "The Fallacy of the 10-Minute Sleep Deploy",
          paragraphs: [
            "Most continuous deployment pipelines rely on arbitrary delay stages: deploy 10% of traffic, sleep for 10 minutes, and if no alerts trigger, roll out 100%. This fails because memory leaks, cache stampedes, and edge-case exceptions often take hours or specific load profiles to surface.",
            "By implementing automated canary analysis through Prometheus metrics and service mesh traffic splits, we compare canary and baseline pods in real-time using Mann-Whitney U statistical testing.",
          ],
        },
        {
          heading: "Automated Traffic Weighting via Envoy VirtualServices",
          paragraphs: [
            "We govern traffic shifting using declarative routing manifests that increment traffic by 5% every 3 minutes only when HTTP 5xx error ratios remain strictly under 0.05% and P99 latency remains within 1.1x of baseline:",
          ],
          codeBlock: {
            language: "yaml",
            filename: "manifests/canary-traffic-split.yaml",
            code: `apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: billing-service
spec:
  hosts:
    - billing.internal.wvrner.systems
  http:
    - route:
        - destination:
            host: billing-service-primary
          weight: 90
        - destination:
            host: billing-service-canary
          weight: 10`,
          },
        },
        {
          heading: "Fail-Fast Automated Rollback",
          paragraphs: [
            "If the canary threshold is breached at any point during the step cycle, traffic instantly shifts back to 100% primary in less than 250 milliseconds without human intervention.",
          ],
          callout: {
            title: "Metric Slicing Principle",
            body:
              "Always evaluate error rates as a proportion of total requests per instance, never as raw counter sums. Skewed load balancer distribution will distort absolute error counts.",
          },
        },
      ],
    },
  },
  {
    slug: "short-lived-credentials-aws-oidc-github",
    title: "Short-Lived Credentials: Eliminating Long-Lived AWS Keys with GitHub OIDC",
    issueNo: "03",
    subtitle: "A practical blueprint for zero static secrets via cryptographic STS role federation.",
    date: "JUN 2026",
    category: "Cloud Security",
    readingTime: "4 min read",
    tags: ["Security", "IAM", "OIDC", "GitHub Actions"],
    pullQuote: "The safest secret is the one that ceases to exist fifteen minutes after creation.",
    invariant: "Zero permanent API access keys stored anywhere in repository secrets. Ever.",
    nextSlug: "telemetry-beyond-dashboards",
    nextTeaser: "Security boundaries are sealed, but diagnosing distributed failure requires semantic tracing.",
    excerpt:
      "A blueprint for hardening CI/CD pipelines through cryptographically verified tokens, ephemeral IAM role assumptions, and strict scoping boundaries.",
    content: {
      lead:
        "Long-lived AWS access keys stored in CI secrets are the single most common vector for cloud account compromise. By switching to OpenID Connect (OIDC) identity federation, we eliminated permanent secrets entirely.",
      sections: [
        {
          heading: "The Danger of Static Access Keys",
          paragraphs: [
            "When engineers store AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY inside repository secrets, rotation is neglected and credentials persist indefinitely. If a pipeline is misconfigured or a third-party action is compromised, those credentials can be exfiltrated.",
            "With OIDC federation, GitHub acts as an Identity Provider (IdP). AWS validates short-lived JSON Web Tokens (JWT) signed by GitHub's certificate authority, minting temporary STS credentials valid for only 15 to 60 minutes.",
          ],
        },
        {
          heading: "Trust Policy Condition Scoping",
          paragraphs: [
            "To prevent arbitrary repositories from assuming your roles, the IAM trust policy must strictly match both the GitHub organization and the target branch name:",
          ],
          codeBlock: {
            language: "json",
            filename: "iam/github-oidc-trust-policy.json",
            code: `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::123456789012:oidc-provider/token.actions.githubusercontent.com"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "token.actions.githubusercontent.com:aud": "sts.amazonaws.com"
        },
        "StringLike": {
          "token.actions.githubusercontent.com:sub": "repo:wvrner/*:ref:refs/heads/main"
        }
      }
    }
  ]
}`,
          },
        },
        {
          heading: "Zero Stored Secrets in CI",
          paragraphs: [
            "With this configuration, CI workflows request temporary credentials directly from AWS STS using standard GitHub action steps. No developer ever handles, copies, or rotates an AWS key again.",
          ],
        },
      ],
    },
  },
  {
    slug: "telemetry-beyond-dashboards",
    title: "Telemetry Without Noise: High-Cardinality Distributed Tracing in Production",
    issueNo: "04",
    subtitle: "Linking anomalous metric spikes directly to contextual exemplar trace graphs.",
    date: "APR 2026",
    category: "Observability",
    readingTime: "7 min read",
    tags: ["OpenTelemetry", "Grafana", "Tracing", "SRE"],
    pullQuote: "Averages lie. High-cardinality exemplars are the only antidote to mysterious distributed outages.",
    invariant: "Every perimeter HTTP request must be stamped with a W3C TraceContext header at the edge proxy.",
    nextSlug: "deterministic-terraform-ephemeral-environments",
    nextTeaser: "Close the architectural loop: explore deterministic cloud state and automated teardowns.",
    excerpt:
      "Moving away from vanity metric dashboards toward actionable exemplar traces and semantic log correlations that pinpoint root causes within seconds.",
    content: {
      lead:
        "Dashboards tell you that something is broken; distributed tracing tells you exactly why and where. Transitioning our observability stack to OpenTelemetry cut mean time to resolution (MTTR) by over 75%.",
      sections: [
        {
          heading: "The Aggregation Blindspot",
          paragraphs: [
            "Averages lie. Even 99th percentile latency graphs hide the fact that a single downstream third-party payment gateway or database connection lock is impacting specific enterprise customers.",
            "High-cardinality metadata—such as customer_id, tenant_tier, and request_uuid—cannot be indexed in traditional time-series databases without exploding costs. By capturing contextual exemplars inside OpenTelemetry spans, we link anomalous metric spikes directly to the exact trace execution graph.",
          ],
        },
        {
          heading: "Semantic Span Conventions",
          paragraphs: [
            "Enforcing uniform span attributes across all Golang, Node, and Python services ensures that engineers can filter traces globally with predictable query syntax:",
          ],
          callout: {
            title: "Golden Rule of Tracing",
            body:
              "Never trace without correlation IDs. Every incoming HTTP or gRPC request must be stamped at the perimeter edge proxy with a W3C TraceContext header before routing to internal services.",
          },
        },
      ],
    },
  },
];
