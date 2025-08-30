import React from "react";
import ServiceLayout from "../ServiceLayout";
import { Layers } from "lucide-react";
import MlopsProLifecycle from "./MlopsProLifecycle";

export default function MlopsCicdPage() {
  return (
    <ServiceLayout
      slug="mlops-cicd"
      title="MLOps Platform Engineering (Machine Learning Operations Platform Engineering)"
      meta="Productionize AI with CI/CD (Continuous Integration/Continuous Delivery) on Kubernetes and Docker, automated evaluations, observability, and safe rollbacks—with governance and DevSecOps (Development, Security & Operations) baked in."
      icon={Layers}
      heroVisual={<MlopsProLifecycle />}
      heroPoints={[
        "Model packaging & registries with versioning.",
        "Automated evaluations, drift detection, rollbacks.",
        "Observability: metrics, traces, cost, and guardrails."
      ]}
      sections={[
        {
          id: "what-it-is",
          heading: "What it is",
          paragraphs: [
            "MLOps Platform Engineering is the practice of building and maintaining the infrastructure, tools, and processes needed to deploy, monitor, and manage machine learning models in production.",
            "It combines software engineering principles with ML-specific requirements to create reliable, scalable, and maintainable AI systems."
          ]
        },
        {
          id: "how-it-works",
          heading: "How it works",
          bullets: [
            "CI/CD: GitHub Actions, GitLab CI, Argo.",
            "CI/CD = Continuous Integration/Continuous Delivery; GitLab CI = GitLab Continuous Integration.",
            "Containerization: Docker images, Kubernetes deployments.",
            "Model registry: MLflow, Kubeflow, custom solutions.",
            "Monitoring: Prometheus, Grafana, custom dashboards.",
            "Tracking: MLflow / W&B (Weights & Biases); Monitoring: Prometheus / Grafana."
          ]
        },
        {
          id: "business-impact",
          heading: "Business impact",
          bullets: [
            "Faster model deployment (days → hours)",
            "Reduced production incidents by 60-80%",
            "Lower operational costs through automation",
            "Improved model performance tracking",
            "Better compliance and audit trails"
          ]
        },
        {
          id: "architecture",
          heading: "Reference architecture",
          paragraphs: [
            "Git → CI/CD Pipeline → Model Registry → Container Registry → Kubernetes → Monitoring Stack.",
            "Includes automated testing, security scanning, performance validation, and rollback capabilities."
          ]
        },
        {
          id: "security-governance",
          heading: "Security & governance",
          bullets: [
            "RBAC (Role-Based Access Control), signed images, secrets management, environment isolation.",
            "Model versioning, audit trails, compliance reporting.",
            "Data lineage tracking, privacy controls, regulatory compliance."
          ]
        }
      ]}
      faqs={[
        {
          q: "How long does it take to set up MLOps?",
          a: "Basic setup takes 2-4 weeks. Full enterprise deployment with all integrations typically 8-12 weeks."
        },
        {
          q: "Do you support on-premise deployments?",
          a: "Yes. We can deploy on your infrastructure with full security controls and compliance."
        },
        {
          q: "How do you handle model drift detection?",
          a: "Automated monitoring of data drift, concept drift, and performance degradation with alerting and retraining triggers."
        }
      ]}
      related={[
        { title: "Agentic Automation", path: "/services/agentic-automation" },
        { title: "Document Intelligence", path: "/services/document-intelligence" },
        { title: "SQL Dashboards", path: "/services/sql-dashboards" }
      ]}
    />
  );
}
