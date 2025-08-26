import React from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Bot, FileText, BarChart2, Layers, CheckCircle } from "lucide-react";

const services = {
  "agentic-automation": {
    title: "Agentic Automation",
    meta: "Agentic AI automation that orchestrates tools and APIs to reduce manual work and accelerate outcomes.",
    icon: Bot,
    detailedContent: [
      {
        heading: "What it is",
        paragraphs: [
          "Agentic AI coordinates multiple steps to complete real business workflows, not just answer questions.",
          "It integrates with CRMs, ERPs, and internal APIs to act with traceability and controls.",
        ],
      },
      {
        heading: "How it works",
        paragraphs: [
          "Deterministic tools, policy-enforced prompts, and guardrails connect to your systems.",
          "We add monitoring and review queues for sensitive steps.",
        ],
      },
      {
        heading: "Business Impact",
        bullets: [
          "30–60% reduction in repetitive work",
          "Faster cycle times and fewer handoffs",
          "Actionable audit trails and cost controls",
        ],
      },
    ],
    callToAction: "Book a Consultation",
  },
  "document-intelligence": {
    title: "Document Intelligence",
    meta: "OCR + NLP to extract structured data from invoices, POs, contracts, and reports.",
    icon: FileText,
    detailedContent: [
      {
        heading: "What it is",
        paragraphs: [
          "Document intelligence transforms unstructured files into accurate, actionable data for downstream systems.",
        ],
      },
      {
        heading: "How it works",
        paragraphs: [
          "We combine advanced OCR with domain-tuned NLP, validation rules, and human-in-the-loop for edge cases.",
        ],
      },
      {
        heading: "Business Impact",
        bullets: [
          "50% less manual keying",
          "Higher accuracy and faster approvals",
          "Standardized data across vendors",
        ],
      },
    ],
    callToAction: "Book a Consultation",
  },
  "sql-dashboards": {
    title: "SQL-Based Dashboards",
    meta: "Unified metrics and AI-assisted insights delivered through modern SQL dashboards.",
    icon: BarChart2,
    detailedContent: [
      {
        heading: "What it is",
        paragraphs: [
          "A single source of truth powered by modeled data and executive-ready visualizations.",
        ],
      },
      {
        heading: "How it works",
        paragraphs: [
          "We model data, define metrics, and build performant dashboards with role-based access and alerts.",
        ],
      },
      {
        heading: "Business Impact",
        bullets: [
          "Faster decisions with trusted KPIs",
          "Self-serve analytics without report backlogs",
          "Cross-team alignment on definitions",
        ],
      },
    ],
    callToAction: "Explore a Demo",
  },
  "mlops-cicd": {
    title: "MLOps & CI/CD",
    meta: "Productionize AI with CI/CD pipelines, monitoring, and governance for safe iteration.",
    icon: Layers,
    detailedContent: [
      {
        heading: "What it is",
        paragraphs: [
          "An end-to-end ML platform approach: packaging, versioning, evaluation, deployment, and observability.",
        ],
      },
      {
        heading: "How it works",
        paragraphs: [
          "Automated tests, bias/quality checks, drift detection, registries, and safe rollouts reduce risk.",
        ],
      },
      {
        heading: "Business Impact",
        bullets: [
          "60% faster releases",
          "Fewer failures and easier rollback",
          "Traceable model lifecycle for audits",
        ],
      },
    ],
    callToAction: "Talk to an Engineer",
  },
};

export default function ServiceDetailPage() {
  const { slug } = useParams();
  const service = services[slug];

  if (!service) {
    return (
      <div className="min-h-screen bg-black text-white">
        <main className="pt-40 pb-20 px-6 max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-black mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Service not found
          </h1>
          <p className="text-gray-400">We couldn't find the service you requested.</p>
          <div className="mt-8">
            <Link to="/services" className="text-blue-300 hover:text-white underline">Back to Services</Link>
          </div>
        </main>
      </div>
    );
  }

  const Icon = service.icon;

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/10 to-black" />
      </div>

      <Helmet>
        <title>{service.title} | Algorythmos</title>
        <meta name="description" content={service.meta} />
        <meta property="og:title" content={service.title} />
        <meta property="og:description" content={service.meta} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://algorythmos.fr/services/${slug}`} />
      </Helmet>

      <main className="pt-40 pb-24 px-6">
        <article className="max-w-3xl mx-auto">
          <div className="flex items-center gap-4 mb-3">
            {Icon && (
              <span className="inline-flex p-3 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10">
                <Icon className="w-7 h-7 text-blue-300" />
              </span>
            )}
            <h1 className="text-4xl md:text-5xl font-black leading-tight">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                {service.title}
              </span>
            </h1>
          </div>
          <p className="text-lg text-gray-400 mb-10 italic">{service.meta}</p>

          <div className="space-y-10">
            {service.detailedContent.map((sec, idx) => (
              <section key={idx}>
                <h2 className="text-2xl font-bold mb-3">{sec.heading}</h2>
                {sec.paragraphs && (
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-gray-900/60 to-black/60 border border-gray-800/50 space-y-4">
                    {sec.paragraphs.map((p, i) => (
                      <p key={i} className="text-gray-200 leading-relaxed">{p}</p>
                    ))}
                  </div>
                )}
                {sec.bullets && (
                  <ul className="space-y-3">
                    {sec.bullets.map((b, i) => (
                      <li key={i} className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-br from-gray-900/70 to-black/70 border border-gray-800/60">
                        <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-100">{b}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>

          <div className="mt-12 flex flex-wrap items-center gap-4">
            <Link
              to="/contact"
              className="group relative inline-flex items-center justify-center px-8 py-4 rounded-2xl font-semibold text-lg bg-gradient-to-r from-blue-600 to-purple-600 overflow-hidden"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              <span className="relative">{service.callToAction}</span>
            </Link>
            <Link to="/services" className="text-gray-400 hover:text-white underline">
              Back to Services
            </Link>
          </div>
        </article>
      </main>
    </div>
  );
}


