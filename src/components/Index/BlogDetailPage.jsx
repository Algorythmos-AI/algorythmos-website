import React from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const blogs = {
  "gdpr-ai": {
    title: "GDPR & AI: What SMEs Need to Know",
    meta: "How to ensure AI systems are GDPR-ready and aligned with the EU AI Act.",
    date: "Aug 2025",
    content: [
      {
        heading: "Overview",
        paragraphs: [
          "SMEs adopting AI must align with GDPR and prepare for the EU AI Act. The goal is simple: protect personal data, design for transparency, and document risk mitigations.",
          "This guide outlines practical steps for data mapping, DPIA preparation, and model governance so your AI projects are compliant by design.",
        ],
      },
      {
        heading: "Key Requirements",
        list: [
          "Data minimization and lawful basis for processing",
          "Human oversight for high-risk AI systems",
          "Model and data lineage with audit trails",
          "Vendor assessments and standardized DPAs",
        ],
      },
      {
        heading: "Action Plan",
        paragraphs: [
          "Start with a data inventory, map flows, and identify risks. Establish governance with clear owners, versioning, and review cadences.",
          "Adopt secure MLOps practices with automated testing, bias checks, and drift detection to ensure continuous compliance.",
        ],
      },
    ],
  },
  "mlops-production": {
    title: "MLOps: From Prototype to Production",
    meta: "Best practices for scaling AI securely using CI/CD, Docker, and Kubernetes.",
    date: "Jul 2025",
    content: [
      {
        heading: "Why MLOps",
        paragraphs: [
          "Moving from notebooks to production requires repeatable pipelines, strong observability, and clear ownership. MLOps brings DevOps discipline to AI.",
          "CI/CD for models reduces release friction and increases reliability. This lets teams ship improvements fast without sacrificing safety.",
        ],
      },
      {
        heading: "Pillars of Production",
        list: [
          "Automated training and evaluation gates",
          "Model registry with versioning and lineage",
          "Drift detection and alerting",
          "Blue/green or canary rollouts with rollback",
        ],
      },
      {
        heading: "Tooling Stack",
        paragraphs: [
          "Combine Docker, Kubernetes, and CI/CD to standardize packaging and deployments. Add feature stores, experiment tracking, and policy-as-code for guardrails.",
        ],
      },
    ],
  },
  "agentic-ai": {
    title: "Agentic AI: Moving Beyond Chatbots",
    meta: "Multi-step, goal-driven automation for real business outcomes.",
    date: "Jun 2025",
    content: [
      {
        heading: "From Q&A to Workflows",
        paragraphs: [
          "Agentic AI orchestrates tools and APIs to complete tasks end-to-end. It moves beyond question answering to deliver measurable outcomes.",
        ],
      },
      {
        heading: "Design Principles",
        list: [
          "Explicit goals and constraints",
          "Deterministic tool interfaces",
          "Safety rails and audit trails",
          "Cost-aware planning and retries",
        ],
      },
    ],
  },
  "llmsecops": {
    title: "LLMSecOps: Securing Large Language Models",
    meta: "A lifecycle approach to safe, trustworthy AI adoption.",
    date: "May 2025",
    content: [
      {
        heading: "Threat Model",
        paragraphs: [
          "LLMs introduce new risks: prompt injection, data leakage, and jailbreaks. LLMSecOps applies security controls across the model lifecycle.",
        ],
      },
      {
        heading: "Controls",
        list: [
          "Input/output filtering and policy enforcement",
          "Secrets handling and token hygiene",
          "Red-teaming and adversarial testing",
          "Monitoring and incident response playbooks",
        ],
      },
    ],
  },
};

export default function BlogDetailPage() {
  const { slug } = useParams();
  const post = blogs[slug];

  if (!post) {
    return (
      <div className="min-h-screen bg-black text-white">
        <main className="pt-40 pb-20 px-6 max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-black mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Blog post not found
          </h1>
          <p className="text-gray-400">We couldn't find the blog you requested.</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/10 to-black" />
      </div>

      <Helmet>
        <title>{post.title} | Algorythmos</title>
        <meta name="description" content={post.meta} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.meta} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://algorythmos.fr/blog/${slug}`} />
      </Helmet>

      <main className="pt-40 pb-24 px-6">
        <article className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-black mb-2">
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              {post.title}
            </span>
          </h1>
          <div className="text-sm text-gray-400 mb-10">{post.date}</div>

          <p className="text-lg text-gray-300 mb-10 italic">{post.meta}</p>

          <div className="space-y-10">
            {post.content.map((section, idx) => (
              <section key={idx}>
                {section.heading && (
                  <h2 className="text-2xl font-bold mb-3">{section.heading}</h2>
                )}
                {section.paragraphs && (
                  <div className="space-y-4">
                    {section.paragraphs.map((p, i) => (
                      <p key={i} className="text-gray-200 leading-relaxed">{p}</p>
                    ))}
                  </div>
                )}
                {section.list && (
                  <ul className="list-disc pl-6 text-gray-200 space-y-2">
                    {section.list.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>

          <div className="mt-12">
            <a
              href="/contact"
              className="group relative inline-flex items-center justify-center px-8 py-4 rounded-2xl font-semibold text-lg bg-gradient-to-r from-blue-600 to-purple-600 overflow-hidden"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              <span className="relative">Speak with our team</span>
            </a>
          </div>
        </article>
      </main>
    </div>
  );
}


