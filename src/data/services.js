// src/data/services.js
import { Bot, FileText, BarChart2, Layers } from "lucide-react";

export const servicesList = [
  {
    slug: "agentic-automation",
    title: "Agentic Automation",
    tagline: "Orchestrate tools & APIs with AI that acts—safely and audibly.",
    meta:
      "Agentic AI automations that coordinate multi-step workflows across your stack with guardrails, auditability, and cost controls.",
    icon: Bot,
    heroPoints: [
      "Context-aware, multi-step workflows (not just chat).",
      "Integrations with CRMs/ERPs, email, Slack, data warehouses.",
      "Review queues + policy prompts for sensitive actions."
    ],
    sections: [
      {
        id: "what-it-is",
        heading: "What it is",
        paragraphs: [
          "Agentic AI coordinates multiple steps to complete real business workflows, not just answer questions.",
          "It integrates with CRMs, ERPs, data warehouses, and internal APIs to act with traceability and controls."
        ]
      },
      {
        id: "how-it-works",
        heading: "How it works",
        paragraphs: [
          "Deterministic tools, policy-enforced prompts, and guardrails connect to your systems.",
          "We add monitoring, human-in-the-loop review queues, and cost controls for governance."
        ]
      },
      {
        id: "business-impact",
        heading: "Business impact",
        bullets: [
          "30–60% reduction in repetitive work",
          "Faster cycle times and fewer handoffs",
          "Actionable audit trails and spend visibility"
        ]
      },
      {
        id: "architecture",
        heading: "Reference architecture",
        paragraphs: [
          "Planner/Router → Tools/Functions → Memory/Vector DB → Review Queue → Observability (metrics, traces, logs).",
          "Plugs into LangGraph / CrewAI / custom orchestrators. Memory via Weaviate/pgvector/OpenSearch. CI/CD for prompts & tools."
        ]
      }
    ],
    faqs: [
      {
        q: "How is this safer than a regular LLM bot?",
        a: "Actions go through explicit tools with input/output validation, policy prompts, and optional human review before execution."
      },
      { q: "Do you support on-prem?", a: "Yes. We can deploy the full stack on your infra with SSO, RBAC, and private networking." }
    ],
    related: ["document-intelligence", "mlops-cicd"],
    callToAction: "Book a Consultation"
  },
  {
    slug: "document-intelligence",
    title: "Document Intelligence",
    tagline: "OCR + NLP pipelines for invoices, POs, contracts, and reports.",
    meta:
      "Extract accurate, structured data from unstructured documents with validation and human-in-the-loop for edge cases.",
    icon: FileText,
    heroPoints: [
      "Enterprise OCR + layout parsing",
      "Domain-tuned extraction with rules & ML",
      "Validation UI + export to ERP/DB"
    ],
    sections: [
      {
        id: "what-it-is",
        heading: "What it is",
        paragraphs: [
          "Transform PDFs/images into clean, structured data suitable for finance, procurement, and ops workflows."
        ]
      },
      {
        id: "how-it-works",
        heading: "How it works",
        paragraphs: [
          "Advanced OCR + layout analysis + schema validation. HITL resolves low-confidence fields before export."
        ]
      },
      {
        id: "business-impact",
        heading: "Business impact",
        bullets: ["50% less manual keying", "Higher accuracy and faster approvals", "Standardized data across vendors"]
      }
    ],
    faqs: [
      { q: "Which file types?", a: "PDF, PNG, JPG, TIFF. Batch ingestion via S3/GCS, API, or UI." },
      { q: "Can it learn new templates?", a: "Yes—few-shot tuning and pattern rules adapt quickly to new vendor formats." }
    ],
    related: ["agentic-automation", "sql-dashboards"],
    callToAction: "Book a Consultation"
  },
  {
    slug: "sql-dashboards",
    title: "SQL-Based Dashboards",
    tagline: "Unified metrics and AI-assisted insights on modern SQL stacks.",
    meta:
      "Modeled data + executive-ready dashboards with alerts, RBAC, and self-serve analytics.",
    icon: BarChart2,
    heroPoints: ["Modeled metrics & dimensions", "Fast, reliable dashboards", "Proactive alerts & anomaly detection"],
    sections: [
      {
        id: "what-it-is",
        heading: "What it is",
        paragraphs: ["A single source of truth powered by modeled data and executive-ready visualizations."]
      },
      {
        id: "how-it-works",
        heading: "How it works",
        paragraphs: ["We model data, define metrics, and build performant dashboards with role-based access and alerts."]
      },
      {
        id: "business-impact",
        heading: "Business impact",
        bullets: ["Faster decisions with trusted KPIs", "Self-serve analytics", "Cross-team alignment on definitions"]
      }
    ],
    faqs: [{ q: "Which stacks?", a: "Snowflake, BigQuery, Postgres; BI with Metabase/Lightdash/Looker; optional dbt for modeling." }],
    related: ["mlops-cicd"],
    callToAction: "Explore a Demo"
  },
  {
    slug: "mlops-cicd",
    title: "MLOps Platform Engineering (Machine Learning Operations Platform Engineering)",
    tagline: "Productionize AI with CI/CD (Continuous Integration/Continuous Delivery) on Kubernetes and Docker, automated evaluations, observability, and safe rollbacks—with governance and DevSecOps (Development, Security & Operations) baked in.",
    meta:
      "Productionize AI with CI/CD (Continuous Integration/Continuous Delivery) on Kubernetes and Docker, automated evaluations, observability, and safe rollbacks—with governance and DevSecOps (Development, Security & Operations) baked in.",
    icon: Layers,
    heroPoints: ["Model registry & packaging", "Automated evals & drift monitoring", "Rollbacks and canaries"],
    sections: [
      {
        id: "what-it-is",
        heading: "What it is",
        paragraphs: ["An opinionated path to production covering testing, evaluation, deployment, and observability."]
      },
      {
        id: "how-it-works",
        heading: "How it works",
        paragraphs: ["CI/CD pipelines with quality gates, bias checks, performance SLOs, and audit-ready lineage."]
      },
      {
        id: "business-impact",
        heading: "Business impact",
        bullets: ["60% faster releases", "Fewer failures, easier rollback", "Traceable model lifecycle"]
      }
    ],
    faqs: [{ q: "Tooling options?", a: "MLflow, Weights & Biases, Argo, Kubeflow, BentoML, FastAPI, Prometheus/Grafana." }],
    related: ["agentic-automation", "sql-dashboards"],
    callToAction: "Talk to an Engineer"
  }
];

export const servicesBySlug = Object.fromEntries(servicesList.map(s => [s.slug, s]));
