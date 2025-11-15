// /src/components/Index/services/DocumentIntelligencePage.jsx
import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { FileText, ArrowRight, CheckCircle, Shield, Database, Scan, FileCheck, Lock, Zap } from "lucide-react";
import { withUtm } from "../../../lib/utm";

const CALENDLY_URL = "https://calendly.com/algorythmos-france/30min";

export default function DocumentIntelligencePage() {
  const contactUrl = useMemo(() => {
    return withUtm(CALENDLY_URL, {
      utm_source: "services",
      utm_medium: "cta",
      utm_campaign: "document-intelligence",
      utm_content: "hero_cta",
    });
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      <Helmet>
        <title>Document Intelligence | Algorythmos™</title>
        <meta
          name="description"
          content="Transform PDFs and images into structured data with OCR, NLP, and validation. Extract invoices, contracts, and compliance documents with GDPR-compliant pipelines."
        />
        <link rel="canonical" href="https://algorythmos.fr/services/document-intelligence" />
        <meta property="og:title" content="Document Intelligence | Algorythmos™" />
        <meta property="og:description" content="OCR + NLP pipelines for invoices, contracts, and compliance documents." />
        <meta property="og:type" content="website" />
      </Helmet>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-600/10 via-blue-600/5 to-transparent pointer-events-none" />
        
        <div className="relative max-w-6xl mx-auto">
          {/* Breadcrumb */}
          <nav className="mb-8 text-sm text-gray-400">
            <Link to="/services" className="hover:text-blue-400 transition-colors">
              Services
            </Link>
            <span className="mx-2">/</span>
            <span className="text-white">Document Intelligence</span>
          </nav>

          {/* Icon & Badge */}
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500/20 to-blue-500/20 ring-1 ring-white/10">
              <FileText className="h-8 w-8 text-green-400" />
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-green-500/10 px-4 py-1.5 text-xs font-semibold text-green-400 ring-1 ring-green-500/20">
              <Scan className="h-3 w-3" />
              OCR + NLP Pipeline
            </div>
          </div>

          {/* Title */}
          <h1 className="mb-6 text-4xl md:text-6xl font-black leading-tight">
            <span className="bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Document Intelligence
            </span>
            <br />
            <span className="text-white">
              From PDFs to Decisions
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mb-8 max-w-3xl text-lg md:text-xl text-gray-300 leading-relaxed">
            Extract accurate, structured data from invoices, purchase orders, contracts, and compliance documents using enterprise OCR, layout parsing, and domain-tuned NLP—with validation and human-in-the-loop for edge cases.
          </p>

          {/* Key Points */}
          <div className="mb-10 grid md:grid-cols-3 gap-4 max-w-3xl">
            {[
              { icon: Scan, text: "Enterprise OCR + layout parsing" },
              { icon: Shield, text: "GDPR-compliant with audit trails" },
              { icon: Database, text: "Export to ERP, DB, or data warehouse" }
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 text-sm text-gray-300">
                <item.icon className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
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
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-green-600 to-blue-600 px-6 py-3 font-semibold text-white shadow-lg shadow-green-500/25 transition-all hover:shadow-xl hover:shadow-green-500/40 hover:-translate-y-0.5"
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
      <section className="border-y border-white/10 bg-gradient-to-r from-green-500/5 to-blue-500/5 py-12 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-4xl font-black bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent mb-2">
              50%
            </div>
            <div className="text-sm text-gray-400">Less manual data entry and keying</div>
          </div>
          <div>
            <div className="text-4xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
              95%+
            </div>
            <div className="text-sm text-gray-400">Extraction accuracy with validation</div>
          </div>
          <div>
            <div className="text-4xl font-black bg-gradient-to-r from-purple-400 to-green-400 bg-clip-text text-transparent mb-2">
              3–5x
            </div>
            <div className="text-sm text-gray-400">Faster approvals and processing</div>
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
              Document Intelligence transforms unstructured PDFs, scanned images, and digital documents into clean, structured data ready for your finance, procurement, and operations workflows.
            </p>
            <p>
              Whether it's invoices from dozens of vendors, purchase orders with complex line items, contracts with nested clauses, or KYC/compliance documents—we extract the data accurately and route it to your ERP, database, or data warehouse with full audit trails.
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
              <h3 className="text-xl font-bold text-green-400 mb-3 flex items-center gap-2">
                <Scan className="h-5 w-5" />
                Enterprise OCR + Layout Analysis
              </h3>
              <p className="text-gray-300 leading-relaxed">
                We use state-of-the-art OCR engines (Tesseract, AWS Textract, Azure Document Intelligence) combined with layout parsing to understand table structures, multi-column layouts, and handwritten annotations.
              </p>
            </div>

            <div className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/10">
              <h3 className="text-xl font-bold text-blue-400 mb-3 flex items-center gap-2">
                <FileCheck className="h-5 w-5" />
                Domain-Tuned Extraction + Schema Validation
              </h3>
              <p className="text-gray-300 leading-relaxed">
                Custom extraction rules and ML models trained on your document types. Schema validation ensures data integrity—fields with low confidence are flagged for human review before export.
              </p>
            </div>

            <div className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/10">
              <h3 className="text-xl font-bold text-purple-400 mb-3 flex items-center gap-2">
                <Lock className="h-5 w-5" />
                GDPR Compliance + Security
              </h3>
              <p className="text-gray-300 leading-relaxed">
                All processing happens in GDPR-compliant regions with encryption at rest and in transit. Role-based access control (RBAC), audit logs, and data retention policies ensure regulatory compliance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black mb-8 text-white">
            Common Use Cases
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { 
                title: "Invoice & Logistics Automation", 
                desc: "Extract vendor details, line items, totals, and tax from invoices. Auto-match with purchase orders and route to ERP for approval.",
                icon: FileText
              },
              { 
                title: "KYC & Compliance Documents", 
                desc: "Extract identity data, registration numbers, and signatures from passports, IDs, and incorporation documents for onboarding workflows.",
                icon: Shield
              },
              { 
                title: "Contract Review & Clause Extraction", 
                desc: "Identify key terms, obligations, renewal dates, and risk clauses from contracts and NDAs. Build a searchable contract database.",
                icon: FileCheck
              },
              { 
                title: "Multi-Vendor Template Handling", 
                desc: "Adapt quickly to new vendor formats with few-shot learning and pattern rules. No need to retrain models from scratch.",
                icon: Zap
              }
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4 rounded-xl bg-gradient-to-br from-green-500/5 to-blue-500/5 p-6 ring-1 ring-white/10">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-green-500/20 to-blue-500/20 flex-shrink-0">
                  <item.icon className="h-5 w-5 text-green-400" />
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
              { title: "50% less manual keying", desc: "Free your finance and ops teams from tedious data entry. Focus on exceptions and value-add tasks." },
              { title: "Higher accuracy and faster approvals", desc: "Validated extractions mean fewer errors and faster processing cycles—critical for month-end close." },
              { title: "Standardized data across vendors", desc: "Normalize data from hundreds of vendor formats into a single schema for consistent reporting." },
              { title: "Audit-ready compliance", desc: "Full lineage from document to extraction to export. Perfect for SOX, GDPR, and ISO audits." }
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4 rounded-xl bg-white/5 p-6 ring-1 ring-white/10">
                <CheckCircle className="h-6 w-6 text-green-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-400">{item.desc}</p>
                </div>
              </div>
            ))}
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
                q: "Which file types are supported?",
                a: "PDF, PNG, JPG, TIFF, and most common image formats. We support batch ingestion via S3/GCS, REST API, or web UI upload."
              },
              {
                q: "Can it learn new document templates?",
                a: "Yes. Our models adapt quickly to new vendor formats using few-shot tuning and pattern rules—no need for extensive retraining."
              },
              {
                q: "How do you handle low-quality scans?",
                a: "We apply image preprocessing (deskewing, noise reduction, contrast enhancement) before OCR. Fields with low confidence are flagged for human review."
              },
              {
                q: "Is it GDPR-compliant?",
                a: "Absolutely. All processing happens in EU/GDPR-compliant regions with encryption, RBAC, audit logs, and configurable data retention policies."
              },
              {
                q: "How do you integrate with our ERP?",
                a: "We provide REST APIs, webhooks, and pre-built connectors for SAP, NetSuite, Dynamics, and custom systems. Data can also be exported to your data warehouse."
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
      <section className="py-20 px-6 bg-gradient-to-br from-green-600/10 via-blue-600/10 to-transparent">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-black mb-4 text-white">
            Ready to Unlock Your Documents?
          </h2>
          <p className="mb-8 text-lg text-gray-300">
            Let's discuss your document workflows and design an extraction pipeline that scales with your business.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href={contactUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-green-600 to-blue-600 px-8 py-4 font-semibold text-white shadow-lg shadow-green-500/25 transition-all hover:shadow-xl hover:shadow-green-500/40 hover:-translate-y-0.5"
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
                <div className="text-sm text-gray-400">Multi-agent workflows that orchestrate tools and APIs</div>
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
                <div className="text-sm text-gray-400">Unified metrics and insights on modern SQL stacks</div>
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
