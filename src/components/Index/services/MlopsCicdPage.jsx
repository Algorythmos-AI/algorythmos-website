// /src/components/Index/services/MlopsCicdPage.jsx
import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Layers, ArrowRight, CheckCircle, GitBranch, Activity, Shield, Gauge, AlertTriangle, Package } from "lucide-react";
import { withUtm } from "../../../lib/utm";

const CALENDLY_URL = "https://calendly.com/algorythmos-france/30min";

export default function MlopsCicdPage() {
  const contactUrl = useMemo(() => {
    return withUtm(CALENDLY_URL, {
      utm_source: "services",
      utm_medium: "cta",
      utm_campaign: "mlops-cicd",
      utm_content: "hero_cta",
    });
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      <Helmet>
        <title>MLOps & Platform Engineering | Algorythmos™</title>
        <meta
          name="description"
          content="Production-grade ML with CI/CD on Kubernetes and Docker. Automated evaluations, observability, drift monitoring, safe rollbacks, and DevSecOps governance for AI that survives production."
        />
        <link rel="canonical" href="https://algorythmos.fr/services/mlops-cicd" />
        <meta property="og:title" content="MLOps & Platform Engineering | Algorythmos™" />
        <meta property="og:description" content="Productionize AI with CI/CD, monitoring, and platform engineering." />
        <meta property="og:type" content="website" />
      </Helmet>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-pink-600/5 to-transparent pointer-events-none" />
        
        <div className="relative max-w-6xl mx-auto">
          {/* Breadcrumb */}
          <nav className="mb-8 text-sm text-gray-400">
            <Link to="/services" className="hover:text-blue-400 transition-colors">
              Services
            </Link>
            <span className="mx-2">/</span>
            <span className="text-white">MLOps & Platform Engineering</span>
          </nav>

          {/* Icon & Badge */}
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 ring-1 ring-white/10">
              <Layers className="h-8 w-8 text-purple-400" />
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-purple-500/10 px-4 py-1.5 text-xs font-semibold text-purple-400 ring-1 ring-purple-500/20">
              <GitBranch className="h-3 w-3" />
              Production-Grade ML
            </div>
          </div>

          {/* Title */}
          <h1 className="mb-6 text-4xl md:text-6xl font-black leading-tight">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              MLOps & Platform Engineering
            </span>
            <br />
            <span className="text-white">
              AI That Survives Production
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mb-8 max-w-3xl text-lg md:text-xl text-gray-300 leading-relaxed">
            Productionize AI with CI/CD on Kubernetes and Docker—automated evaluations, observability, drift monitoring, safe rollbacks, and governance with DevSecOps baked in. Deploy on-prem, in VPC, or cloud with confidence.
          </p>

          {/* Key Points */}
          <div className="mb-10 grid md:grid-cols-3 gap-4 max-w-3xl">
            {[
              { icon: Package, text: "Model registry & packaging" },
              { icon: Activity, text: "Automated evals & drift monitoring" },
              { icon: GitBranch, text: "Rollbacks and canary deployments" }
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 text-sm text-gray-300">
                <item.icon className="h-5 w-5 text-purple-400 flex-shrink-0 mt-0.5" />
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
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 font-semibold text-white shadow-lg shadow-purple-500/25 transition-all hover:shadow-xl hover:shadow-purple-500/40 hover:-translate-y-0.5"
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
      <section className="border-y border-white/10 bg-gradient-to-r from-purple-500/5 to-pink-500/5 py-12 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-4xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
              10x
            </div>
            <div className="text-sm text-gray-400">Faster deployments with CI/CD automation</div>
          </div>
          <div>
            <div className="text-4xl font-black bg-gradient-to-r from-pink-400 to-blue-400 bg-clip-text text-transparent mb-2">
              99.9%
            </div>
            <div className="text-sm text-gray-400">Uptime with monitoring and rollback strategies</div>
          </div>
          <div>
            <div className="text-4xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
              100%
            </div>
            <div className="text-sm text-gray-400">Audit-ready lineage and governance</div>
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
              MLOps (Machine Learning Operations) is the practice of deploying, monitoring, and maintaining ML models in production with the same rigor as traditional software engineering. Think DevOps, but for AI.
            </p>
            <p>
              We build opinionated paths to production covering testing, evaluation, deployment patterns, observability, and governance—ensuring your models survive the real world and deliver consistent value.
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
              <h3 className="text-xl font-bold text-purple-400 mb-3 flex items-center gap-2">
                <GitBranch className="h-5 w-5" />
                CI/CD Pipelines with Quality Gates
              </h3>
              <p className="text-gray-300 leading-relaxed">
                Automated testing, evaluation, bias checks, and performance SLOs at every commit. Models are versioned, packaged, and deployed only when they meet quality thresholds.
              </p>
            </div>

            <div className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/10">
              <h3 className="text-xl font-bold text-pink-400 mb-3 flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Observability & Drift Monitoring
              </h3>
              <p className="text-gray-300 leading-relaxed">
                Track prediction latency, error rates, feature distributions, and model drift in production. Get alerted before performance degrades and retrain proactively.
              </p>
            </div>

            <div className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/10">
              <h3 className="text-xl font-bold text-blue-400 mb-3 flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Governance & Security
              </h3>
              <p className="text-gray-300 leading-relaxed">
                RBAC, SSO, audit logs, and data lineage for compliance. Deploy on your infrastructure (on-prem, VPC, or cloud) with private networking and secrets management.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Deployment Patterns */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black mb-8 text-white">
            Deployment Patterns
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { 
                title: "On-Premises / VPC", 
                desc: "Full control over data and infrastructure. Deploy on your Kubernetes cluster with private networking, air-gapped if needed.",
                icon: Shield
              },
              { 
                title: "Cloud-Native (AWS, GCP, Azure)", 
                desc: "Leverage managed services like SageMaker, Vertex AI, or Azure ML for faster iteration and lower ops overhead.",
                icon: Layers
              },
              { 
                title: "Hybrid & Edge", 
                desc: "Deploy models at the edge (IoT, retail stores) with centralized management, updates, and monitoring.",
                icon: Package
              },
              { 
                title: "Canary & Blue-Green Deployments", 
                desc: "Roll out new models gradually with traffic splitting. Rollback instantly if performance drops.",
                icon: GitBranch
              }
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4 rounded-xl bg-gradient-to-br from-purple-500/5 to-pink-500/5 p-6 ring-1 ring-white/10">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex-shrink-0">
                  <item.icon className="h-5 w-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-400">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Business Impact */}
      <section className="py-20 px-6 bg-gradient-to-br from-slate-900/50 to-slate-800/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black mb-8 text-white">
            Business Impact
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { title: "10x faster deployments", desc: "Automate testing, packaging, and deployment. Ship models in minutes, not weeks." },
              { title: "99.9% uptime with monitoring", desc: "Proactive drift detection and rollback strategies prevent outages and performance degradation." },
              { title: "Lower total cost of ownership", desc: "Right-size compute, optimize inference costs, and reduce manual ops overhead." },
              { title: "Audit-ready lineage", desc: "Track every model version, training run, and deployment with full traceability for compliance." }
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4 rounded-xl bg-white/5 p-6 ring-1 ring-white/10">
                <CheckCircle className="h-6 w-6 text-purple-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-400">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reference Architecture */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black mb-6 text-white">
            Reference Architecture
          </h2>
          <div className="rounded-2xl bg-black/30 p-8 ring-1 ring-white/10">
            <div className="space-y-4 text-gray-300">
              <p className="font-mono text-sm leading-relaxed">
                <span className="text-purple-400">Git Repo</span> → <span className="text-pink-400">CI/CD (GitHub Actions / GitLab CI)</span> → <span className="text-blue-400">Model Registry (MLflow / Weights & Biases)</span> → <span className="text-green-400">Container Registry (Docker / ECR)</span> → <span className="text-orange-400">Kubernetes / Serverless</span> → <span className="text-red-400">Monitoring (Prometheus / Grafana / Datadog)</span>
              </p>
              <p className="text-sm leading-relaxed">
                <strong>Training:</strong> Experiments tracked in MLflow/W&B. Models versioned and validated before promotion.
              </p>
              <p className="text-sm leading-relaxed">
                <strong>Deployment:</strong> Containerized with Docker, deployed to Kubernetes (on-prem or cloud) or serverless (Lambda, Cloud Run).
              </p>
              <p className="text-sm leading-relaxed">
                <strong>Monitoring:</strong> Latency, error rates, feature drift, and model performance tracked in real-time with alerts.
              </p>
              <p className="text-sm leading-relaxed">
                <strong>Governance:</strong> RBAC, audit logs, data lineage, and compliance checks baked into every step.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-20 px-6 bg-gradient-to-br from-slate-900/50 to-slate-800/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black mb-8 text-white">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {[
              {
                q: "Do you support on-premises deployment?",
                a: "Yes. We can deploy the full ML stack on your Kubernetes cluster with SSO, RBAC, private networking, and air-gapped operation if required."
              },
              {
                q: "How do you handle model drift?",
                a: "We monitor feature distributions, prediction patterns, and model performance in production. Automated alerts trigger retraining workflows when drift is detected."
              },
              {
                q: "What about LLM-specific MLOps?",
                a: "We specialize in LLM deployment: prompt versioning, evaluation pipelines, cost tracking, guardrails, and human-in-the-loop feedback loops."
              },
              {
                q: "Can you integrate with our existing tools?",
                a: "Absolutely. We work with your existing infrastructure: cloud providers, CI/CD tools, model registries, and monitoring stacks."
              },
              {
                q: "How long does it take to set up?",
                a: "Depends on your stack and requirements. A basic CI/CD pipeline can be live in 2-3 weeks. Full production setup with monitoring and governance takes 1-2 months."
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
      <section className="py-20 px-6 bg-gradient-to-br from-purple-600/10 via-pink-600/10 to-transparent">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-black mb-4 text-white">
            Ready to Deploy AI with Confidence?
          </h2>
          <p className="mb-8 text-lg text-gray-300">
            Let's design an MLOps platform that scales with your business and survives production.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href={contactUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-4 font-semibold text-white shadow-lg shadow-purple-500/25 transition-all hover:shadow-xl hover:shadow-purple-500/40 hover:-translate-y-0.5"
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
              to="/services/agentic-automation"
              className="group flex items-center gap-4 rounded-xl bg-white/5 p-6 ring-1 ring-white/10 transition-all hover:bg-white/10"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20">
                <Bot className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <div className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                  Agentic Automation
                </div>
                <div className="text-sm text-gray-400">Multi-agent workflows with full observability</div>
              </div>
            </Link>
            <Link
              to="/services/sql-dashboards"
              className="group flex items-center gap-4 rounded-xl bg-white/5 p-6 ring-1 ring-white/10 transition-all hover:bg-white/10"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500/20 to-yellow-500/20">
                <BarChart3 className="h-6 w-6 text-orange-400" />
              </div>
              <div>
                <div className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                  SQL Dashboards & Analytics
                </div>
                <div className="text-sm text-gray-400">Model performance metrics and monitoring dashboards</div>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

// Import additional icons
import { ChevronDown, Bot, BarChart3 } from "lucide-react";
