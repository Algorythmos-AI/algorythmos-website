import React from "react";
import ServiceLayout from "../ServiceLayout";
import { Bot } from "lucide-react";
import AgenticFlowDiagram from "./AgenticFlowDiagram";

export default function AgenticAutomationPage() {
  return (
    <ServiceLayout
      slug="agentic-automation"
      title="Agentic Automation"
      meta="Build and scale context-aware AI agents that plan, decide, and act across your tools and data—safely, traceably, and with enterprise controls."
      icon={Bot}
      heroPoints={[
        "Context-aware, multi-step workflows that do real work—not just chat.",
        "Real-time memory: ingest, search, and retrieve across documents, tickets, and data.",
        "Policy prompts, guardrails, review queues, and audit logs for safe actions."
      ]}
      sections={[
        {
          id: "overview",
          heading: "Empower agents with the context and adaptability they need",
          paragraphs: [
            "Move from static Q&A to agents that understand context, plan steps, and adapt on the fly. Your agents can read from systems, call tools, and write changes back—always with oversight.",
            "This page outlines the enterprise building blocks: high-performance memory, data transformation agents, security/compliance, and integrations with popular agent frameworks."
          ]
        },
        {
          id: "why-agentic",
          heading: "Power enterprise intelligence with agentic workflows",
          paragraphs: [
            "Agentic AI isn’t a trend—it’s the next evolution where systems act to improve outcomes. Teams that adopt agentic workflows see meaningful efficiency gains by automating labor-intensive processes, enhancing decision velocity, and improving ROI on AI initiatives.",
            "As use cases evolve from insights to semi- or fully-autonomous workflows, reliable AI-native infrastructure becomes critical: fast retrieval, strong governance, and clear observability."
          ]
        },
        {
          id: "enterprise-capabilities",
          heading: "Enterprise capabilities",
          bullets: [
            "High-performance search & memory — Rapid ingestion and retrieval of multimodal data (PDFs, emails, tickets, tables) so agents can use fresh context in every step.",
            "Built-in agents for data transformation — Prebuilt skills for parsing, cleaning, and normalizing data so downstream agents operate on reliable inputs.",
            "Security & compliance — SSO/RBAC, workspace isolation, strict access controls, and audit trails to satisfy enterprise and regulated environments.",
            "Integrations with agent frameworks — Connect smoothly to LangGraph, CrewAI, LlamaIndex, or your custom planner; plug memory in via vector DBs and tool functions."
          ]
        },
        {
          id: "architecture",
          heading: "Reference architecture",
          paragraphs: [
            "Planner/Router → Tool Calls (email, calendar, CRM/ERP, DB/warehouse, HTTP APIs) → Memory (vector database for retrieval) → Human Review (optional) → Observability (metrics, traces, cost).",
            "Memory examples: Weaviate / pgvector / OpenSearch. Orchestrators: LangGraph / CrewAI / custom. CI/CD for prompts, tools, and evaluation keeps the system safe and iterative."
          ]
        },
        {
          id: "use-cases",
          heading: "Common use cases",
          bullets: [
            "Sales operations — qualify inbound, draft follow-ups, enrich accounts, and update CRM.",
            "Customer support — triage tickets, retrieve knowledge, draft resolutions, and escalate with context.",
            "Back-office automation — invoice matching, PO updates, status reminders, and reporting.",
            "Knowledge workflows — summarize long docs, compare versions, draft briefs with citations."
          ]
        },
        {
          id: "guide",
          heading: "Guide: Agentic architectures for retrieval-intensive applications",
          paragraphs: [
            "A concise playbook covering patterns, guardrails, and deployment tips for agentic systems in enterprises. Perfect for technical leaders planning pilots and production rollouts.",
            "Prefer a PDF? Add an eBook asset later at /assets/guides/agentic-architectures.pdf and link it from here."
          ]
        },
        {
          id: "developer-resources",
          heading: "Developer resources",
          bullets: [
            "What is Agentic RAG? — overview of planning + retrieval patterns.",
            "Querying databases with function calling — safe tool execution patterns.",
            "Agents, simplified — terminology and architecture in plain English."
          ]
        },
        {
          id: "impact",
          heading: "Business impact",
          bullets: [
            "30–60% reduction in repetitive, manual work.",
            "Faster cycle times and fewer handoffs across teams.",
            "Clear audit trails, unit-economic visibility, and cost controls."
          ]
        },
        {
          id: "getting-started",
          heading: "How we engage",
          bullets: [
            "Discovery & scoping — align use cases, risks, and KPIs.",
            "Pilot build — stand up a vertical slice with memory + tools + guardrails.",
            "Production rollout — CI/CD, monitoring, and change management.",
            "Scale & optimize — expand to adjacent workflows and teams."
          ]
        }
      ]}
      faqs={[
        {
          q: "How is this safer than a generic LLM chatbot?",
          a: "Agents interact only through explicit, approved tools with input/output validation. Sensitive actions route to human review. Everything is logged with identities, timestamps, and parameters."
        },
        {
          q: "Can this run on-prem or in a private VPC?",
          a: "Yes. We deploy in your environment with SSO/RBAC, private networking, and your preferred LLMs and vector stores."
        },
        {
          q: "What skills do agents typically need?",
          a: "Retrieval with citations, data transformation, structured reasoning/planning, and safe tool execution (email/Slack/CRM/DB/API). We add skills incrementally with tests and evaluations."
        },
        {
          q: "How do you measure ROI?",
          a: "We track baseline vs automated time-on-task, success/deflection rates, accuracy, review load, and cost per interaction. Dashboards make improvements visible to stakeholders."
        }
      ]}
      related={[
        { title: "Document Intelligence", path: "/services/document-intelligence" },
        { title: "MLOps & CI/CD", path: "/services/mlops-cicd" }
      ]}
      ctaText="Book a Consultation"
    >
      <AgenticFlowDiagram />
    </ServiceLayout>
  );
}