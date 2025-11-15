// /src/components/Index/services/AgenticAutomationPage.jsx
import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Bot, ArrowRight, CheckCircle, Activity, Shield, Zap, GitBranch, Users } from "lucide-react";
import { withUtm } from "../../../lib/utm";

const CALENDLY_URL = "https://calendly.com/algorythmos-france/30min";

export default function AgenticAutomationPage() {
  const contactUrl = useMemo(() => {
    return withUtm(CALENDLY_URL, {
      utm_source: "services",
      utm_medium: "cta",
      utm_campaign: "agentic-automation",
      utm_content: "hero_cta",
    });
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      <Helmet>
        <title>Agentic Automation | Algorythmos™</title>
        <meta
          name="description"
          content="Multi-agent AI workflows that orchestrate tools and APIs safely. Reduce repetitive work by 40-60% with auditability, guardrails, and human-in-the-loop controls."
        />
        <link rel="canonical" href="https://www.algorythmos.fr/services/agentic-automation" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Agentic Automation | Algorythmos™" />
        <meta property="og:description" content="Multi-agent AI workflows that orchestrate tools and APIs safely. Reduce repetitive work by 40-60% with auditability, guardrails, and human-in-the-loop controls." />
        <meta property="og:url" content="https://www.algorythmos.fr/services/agentic-automation" />
        <meta property="og:image" content="https://www.algorythmos.fr/Algorythmos.png" />
        <meta property="og:site_name" content="Algorythmos" />
        <meta property="og:locale" content="en_US" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Agentic Automation | Algorythmos™" />
        <meta name="twitter:description" content="Multi-agent AI workflows that orchestrate tools and APIs safely. Reduce repetitive work by 40-60% with auditability, guardrails, and human-in-the-loop controls." />
        <meta name="twitter:image" content="https://www.algorythmos.fr/Algorythmos.png" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "Agentic Automation",
            "provider": {
              "@type": "Organization",
              "name": "Algorythmos",
              "url": "https://www.algorythmos.fr"
            },
            "description": "Multi-agent AI workflows that orchestrate tools and APIs safely. Reduce repetitive work by 40-60% with auditability, guardrails, and human-in-the-loop controls.",
            "url": "https://www.algorythmos.fr/services/agentic-automation",
            "areaServed": "Europe"
          })}
        </script>
      </Helmet>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/5 to-transparent pointer-events-none" />
        
        <div className="relative max-w-6xl mx-auto">
          {/* Breadcrumb */}
          <nav className="mb-8 text-sm text-gray-400">
            <Link to="/services" className="hover:text-blue-400 transition-colors">
              Services
            </Link>
            <span className="mx-2">/</span>
            <span className="text-white">Agentic Automation</span>
          </nav>

          {/* Icon & Badge */}
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 ring-1 ring-white/10">
              <Bot className="h-8 w-8 text-blue-400" />
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 px-4 py-1.5 text-xs font-semibold text-blue-400 ring-1 ring-blue-500/20">
              <Activity className="h-3 w-3" />
              AI That Acts
            </div>
          </div>

          {/* Title */}
          <h1 className="mb-6 text-4xl md:text-6xl font-black leading-tight">
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Agentic Automation
            </span>
            <br />
            <span className="text-white">
              for Operations that Run Themselves
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mb-8 max-w-3xl text-lg md:text-xl text-gray-300 leading-relaxed">
            Algorythmos delivers agentic automation solutions for SMEs and enterprises in France and Australia. Orchestrate multi-step workflows across your CRM, ERP, email, and data warehouse with AI agents that understand context, follow policies, and act with full auditability—from Sydney to Suresnes.
          </p>

          {/* Key Points */}
          <div className="mb-10 grid md:grid-cols-3 gap-4 max-w-3xl">
            {[
              { icon: GitBranch, text: "Context-aware, multi-step workflows" },
              { icon: Shield, text: "Policy guardrails + human review queues" },
              { icon: Zap, text: "Integrations with CRMs, ERPs, Slack, APIs" }
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 text-sm text-gray-300">
                <item.icon className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <span>{item.text}</span>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4">
            <a
              href={contactUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-0.5"
            >
              Book a Consultation
              <ArrowRight className="h-5 w-5" />
            </a>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-xl bg-white/5 px-6 py-3 font-semibold text-white ring-1 ring-white/10 transition-all hover:bg-white/10"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* Metrics Strip */}
      <section className="border-y border-white/10 bg-gradient-to-r from-blue-500/5 to-purple-500/5 py-12 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-4xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
              40–60%
            </div>
            <div className="text-sm text-gray-400">Reduction in repetitive manual work</div>
          </div>
          <div>
            <div className="text-4xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
              3–5x
            </div>
            <div className="text-sm text-gray-400">Faster cycle times with fewer handoffs</div>
          </div>
          <div>
            <div className="text-4xl font-black bg-gradient-to-r from-pink-400 to-blue-400 bg-clip-text text-transparent mb-2">
              100%
            </div>
            <div className="text-sm text-gray-400">Actionable audit trails for compliance</div>
          </div>
        </div>
      </section>

      {/* What It Is */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black mb-6 text-white">
            What It Is
          </h2>
          <div className="space-y-4 text-lg text-gray-300 leading-relaxed">
            <p>
              Agentic AI goes beyond chatbots. It coordinates multiple steps to complete real business workflows—not just answer questions. Think of it as your digital workforce that can draft emails, update CRM records, trigger approvals, query databases, and escalate edge cases to humans.
            </p>
            <p>
              Unlike brittle RPA scripts, agents adapt to context, handle exceptions gracefully, and integrate with CRMs, ERPs, data warehouses, and internal APIs—all with full traceability and policy controls.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 bg-gradient-to-br from-slate-900/50 to-slate-800/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black mb-6 text-white">
            How It Works
          </h2>
          <div className="space-y-6">
            <div className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/10">
              <h3 className="text-xl font-bold text-blue-400 mb-3 flex items-center gap-2">
                <GitBranch className="h-5 w-5" />
                Deterministic Tools + Policy Prompts
              </h3>
              <p className="text-gray-300 leading-relaxed">
                We connect agents to your systems through explicit, validated tools (functions). Each action goes through input/output validation and policy-enforced prompts that encode business rules and compliance requirements.
              </p>
            </div>

            <div className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/10">
              <h3 className="text-xl font-bold text-purple-400 mb-3 flex items-center gap-2">
                <Users className="h-5 w-5" />
                Human-in-the-Loop Review Queues
              </h3>
              <p className="text-gray-300 leading-relaxed">
                Sensitive actions (like sending money, deleting records, or approving contracts) can be routed to human reviewers before execution. This gives you confidence while maintaining speed for routine tasks.
              </p>
            </div>

            <div className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/10">
              <h3 className="text-xl font-bold text-pink-400 mb-3 flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Monitoring, Cost Controls & Governance
              </h3>
              <p className="text-gray-300 leading-relaxed">
                Full observability with metrics, traces, and logs. Set cost budgets per workflow, track token usage, and maintain audit-ready lineage for every decision and action taken by the agents.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Business Impact */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black mb-8 text-white">
            Business Impact
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { title: "30–60% reduction in repetitive work", desc: "Free up your team to focus on high-value tasks while agents handle routine operations." },
              { title: "Faster cycle times, fewer handoffs", desc: "Workflows that used to take days now complete in minutes with automated coordination." },
              { title: "Actionable audit trails", desc: "Every action is logged with full context—perfect for compliance, debugging, and optimization." },
              { title: "Spend visibility & cost control", desc: "Track LLM token usage, API calls, and compute costs per workflow with real-time budgets." }
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4 rounded-xl bg-gradient-to-br from-blue-500/5 to-purple-500/5 p-6 ring-1 ring-white/10">
                <CheckCircle className="h-6 w-6 text-blue-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-400">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Architecture */}
      <section className="py-20 px-6 bg-gradient-to-br from-slate-900/50 to-slate-800/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black mb-6 text-white">
            Reference Architecture
          </h2>
          <div className="rounded-2xl bg-black/30 p-8 ring-1 ring-white/10">
            <div className="space-y-4 text-gray-300">
              <p className="font-mono text-sm leading-relaxed">
                <span className="text-blue-400">Planner/Router</span> → <span className="text-purple-400">Tools/Functions</span> → <span className="text-pink-400">Memory/Vector DB</span> → <span className="text-green-400">Review Queue</span> → <span className="text-orange-400">Observability</span>
              </p>
              <p className="text-sm leading-relaxed">
                We integrate with orchestrators like <strong>LangGraph</strong>, <strong>CrewAI</strong>, or custom state machines. Memory layer powered by <strong>Weaviate</strong>, <strong>pgvector</strong>, or <strong>OpenSearch</strong>. Full CI/CD for prompts, tools, and evaluation datasets.
              </p>
              <p className="text-sm leading-relaxed">
                Deploy on your infrastructure (on-prem, VPC, or cloud) with SSO, RBAC, and private networking.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black mb-8 text-white">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {[
              {
                q: "How is this safer than a regular LLM bot?",
                a: "Actions go through explicit tools with input/output validation, policy prompts, and optional human review before execution. You control what the agent can and cannot do."
              },
              {
                q: "Do you support on-premises deployment?",
                a: "Yes. We can deploy the full stack on your infrastructure with SSO, RBAC, and private networking. Perfect for regulated industries or sensitive data."
              },
              {
                q: "What systems can you integrate with?",
                a: "Most CRMs (Salesforce, HubSpot), ERPs (SAP, NetSuite), email (Gmail, Outlook), Slack, databases, and custom APIs. We build connectors as needed."
              },
              {
                q: "How do you handle errors and edge cases?",
                a: "Agents can retry with backoff, escalate to human review queues, or fail gracefully with detailed error logs. We design workflows for resilience."
              }
            ].map((faq, i) => (
              <details key={i} className="group rounded-xl bg-white/5 p-6 ring-1 ring-white/10 transition-all hover:bg-white/10">
                <summary className="cursor-pointer font-semibold text-white list-none flex items-center justify-between">
                  {faq.q}
                  <ChevronDown className="h-5 w-5 text-gray-400 transition-transform group-open:rotate-180" />
                </summary>
                <p className="mt-4 text-gray-400 leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-transparent">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-black mb-4 text-white">
            Ready to Automate with Intelligence?
          </h2>
          <p className="mb-8 text-lg text-gray-300">
            Let's discuss your workflows and design an agentic solution that delivers measurable ROI.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href={contactUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4 font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-0.5"
            >
              Book a Consultation
              <ArrowRight className="h-5 w-5" />
            </a>
            <Link
              to="/pricing"
              className="inline-flex items-center gap-2 rounded-xl bg-white/5 px-8 py-4 font-semibold text-white ring-1 ring-white/10 transition-all hover:bg-white/10"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* Related Services */}
      <section className="py-16 px-6 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-xl font-bold text-gray-400 mb-6">Related Services</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <Link
              to="/services/document-intelligence"
              className="group flex items-center gap-4 rounded-xl bg-white/5 p-6 ring-1 ring-white/10 transition-all hover:bg-white/10"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-500/20 to-blue-500/20">
                <FileText className="h-6 w-6 text-green-400" />
              </div>
              <div>
                <div className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                  Document Intelligence
                </div>
                <div className="text-sm text-gray-400">OCR + NLP for invoices, contracts, and compliance</div>
              </div>
            </Link>
            <Link
              to="/services/mlops-cicd"
              className="group flex items-center gap-4 rounded-xl bg-white/5 p-6 ring-1 ring-white/10 transition-all hover:bg-white/10"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20">
                <Layers className="h-6 w-6 text-purple-400" />
              </div>
              <div>
                <div className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                  MLOps & Platform Engineering
                </div>
                <div className="text-sm text-gray-400">Production-grade ML with CI/CD and monitoring</div>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

// Import Chevron and other icons
import { ChevronDown, FileText, Layers } from "lucide-react";
