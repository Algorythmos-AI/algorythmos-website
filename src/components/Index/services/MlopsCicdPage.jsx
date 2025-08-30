import React from "react";
import ServiceLayout from "../ServiceLayout";
import { Layers } from "lucide-react";
import MlopsHero from "./MlopsHero";

export default function MlopsCicdPage() {
  return (
    <ServiceLayout
      slug="mlops-cicd"
      title="MLOps Platform Engineering (Machine Learning Operations Platform Engineering)"
      meta="Productionize AI with CI/CD (Continuous Integration/Continuous Delivery) on Kubernetes and Docker, automated evaluations, observability, and safe rollbacks—with governance and DevSecOps (Development, Security & Operations) baked in."
      icon={Layers}
      heroVisual={<MlopsHero />}
      heroPoints={[
        "Model packaging & registries with versioning.",
        "Automated evaluations, drift detection, rollbacks.",
        "Observability: metrics, traces, cost, and guardrails."
      ]}
      sections={[
        { id: "what-it-is", heading: "What it is", paragraphs: [
          "An opinionated path to production that covers testing, evaluation, deployment strategies, and robust monitoring."
        ]},
        { id: "pipeline", heading: "Pipeline & tooling", bullets: [
          "CI/CD: GitHub Actions, GitLab CI, Argo.",
          "CI/CD = Continuous Integration/Continuous Delivery; GitLab CI = GitLab Continuous Integration.",
          "Serving: FastAPI/BentoML, Triton, Kubernetes.",
          "Tracking: MLflow / W&B (Weights & Biases); Monitoring: Prometheus / Grafana."
        ]},
        { id: "governance", heading: "Security & governance", bullets: [
          "RBAC (Role-Based Access Control), signed images, secrets management, environment isolation.",
          "Audit trails and policy checks gate releases.",
          "Canary/blue-green rollouts with quick rollback."
        ]},
        { id: "impact", heading: "Business impact", bullets: [
          "60% faster releases with fewer incidents.",
          "Lower infra spend via right-sizing & autoscaling.",
          "Traceable lifecycle for audits and compliance."
        ]}
      ]}
      faqs={[
        { q: "Cloud or on-prem?", a: "Both. We work with your infra and compliance requirements." },
        { q: "Model types?", a: "LLMs, tabular ML, CV—anything that can be containerized and evaluated automatically." }
      ]}
      related={[
        { title: "SQL-based Dashboards", path: "/services/sql-dashboards" },
        { title: "Agentic Automation", path: "/services/agentic-automation" }
      ]}
      ctaText="Talk to an Engineer"
    />
  );
}
