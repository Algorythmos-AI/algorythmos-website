import React from "react";
import ServiceLayout from "../ServiceLayout";
import { Bot } from "lucide-react";

export default function AgenticAutomationPage() {
  return (
    <ServiceLayout
      slug="agentic-automation"
      title="Agentic Automation"
      meta="Deploy AI agents that handle repetitive workflows, integrate with APIs, and streamline operations to increase productivity—with safety, auditability, and cost controls."
      icon={Bot}
      heroPoints={[
        "Multi-step, context-aware workflows (not just chat).",
        "Integrations: CRM, ERP, email, Slack, databases, custom APIs.",
        "Policy prompts, validation, and human-in-the-loop for sensitive actions."
      ]}
      sections={[
        { id: "what-it-is", heading: "What it is", paragraphs: [
          "Agentic Automation coordinates multiple steps to complete real business workflows—reading from systems, deciding next actions, and executing with traceability.",
          "We design deterministic tools for each action and apply guardrails to make agents reliable in production."
        ]},
        { id: "how-it-works", heading: "How it works", paragraphs: [
          "Planner/Router orchestrates tools (email, calendars, DB, SaaS APIs). Memory via vector DB; governance via review queues and logs.",
          "Compatible with LangGraph, CrewAI, custom orchestrators; deployable on-prem or cloud."
        ]},
        { id: "use-cases", heading: "Use cases", bullets: [
          "Sales ops: qualify leads, draft follow-ups, update CRM.",
          "Support: triage tickets, fetch knowledge, propose resolutions.",
          "Back-office: invoice matching, PO updates, payment reminders."
        ]},
        { id: "impact", heading: "Business impact", bullets: [
          "30–60% reduction in repetitive work.",
          "Shorter cycle times and fewer handoffs.",
          "Complete audit trails and spend visibility."
        ]}
      ]}
      faqs={[
        { q: "Is this safe in regulated environments?", a: "Yes. Actions run through approved tools with validation, RBAC, and optional human review. Audit logs and rollbacks are built in." },
        { q: "Can it run on-prem?", a: "Yes. We deploy on your infrastructure with SSO, private networking, and your preferred LLMs." }
      ]}
      related={[
        { title: "Document Intelligence", path: "/services/document-intelligence" },
        { title: "MLOps & CI/CD", path: "/services/mlops-cicd" }
      ]}
      ctaText="Book a Consultation"
    />
  );
}
