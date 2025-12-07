// /src/components/Index/services/DocumentIntelligencePage.jsx
import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { FileText, ArrowRight, CheckCircle, Shield, Database, Scan, FileCheck, Lock, Zap } from "lucide-react";
import { withUtm } from "../../../app/utils/utm";
import { useI18n } from "../../../app/i18n/I18nContext";

const CALENDLY_URL = "https://calendly.com/algorythmos-france/30min";

export default function DocumentIntelligencePage() {
  const { t, region } = useI18n();
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
        <title>{t("serviceDocument.meta.title")}</title>
        <meta
          name="description"
          content={t("serviceDocument.meta.description")}
        />
        <link rel="canonical" href="https://www.algorythmos.fr/services/document-intelligence" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={t("serviceDocument.meta.title")} />
        <meta property="og:description" content={t("serviceDocument.meta.description")} />
        <meta property="og:url" content="https://www.algorythmos.fr/services/document-intelligence" />
        <meta property="og:image" content="https://www.algorythmos.fr/Algorythmos.png" />
        <meta property="og:site_name" content="Algorythmos" />
        <meta property="og:locale" content={region === "FR" ? "fr_FR" : "en_US"} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t("serviceDocument.meta.title")} />
        <meta name="twitter:description" content={t("serviceDocument.meta.description")} />
        <meta name="twitter:image" content="https://www.algorythmos.fr/Algorythmos.png" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "Document Intelligence",
            "provider": {
              "@type": "Organization",
              "name": "Algorythmos",
              "url": "https://www.algorythmos.fr"
            },
            "description": "Transform PDFs and images into structured data with OCR, NLP, and validation. Extract invoices, contracts, and compliance documents with GDPR-compliant pipelines.",
            "url": "https://www.algorythmos.fr/services/document-intelligence",
            "areaServed": ["France", "Australia", "Europe"]
          })}
        </script>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://www.algorythmos.fr"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Services",
                "item": "https://www.algorythmos.fr/services"
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": "Document Intelligence",
                "item": "https://www.algorythmos.fr/services/document-intelligence"
              }
            ]
          })}
        </script>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "Which file types are supported?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "PDF, PNG, JPG, TIFF, and most common image formats. We support batch ingestion via S3/GCS, REST API, or web UI upload."
                }
              },
              {
                "@type": "Question",
                "name": "Can it learn new document templates?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes. Our models adapt quickly to new vendor formats using few-shot tuning and pattern rules—no need for extensive retraining."
                }
              },
              {
                "@type": "Question",
                "name": "How do you handle low-quality scans?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "We apply image preprocessing (deskewing, noise reduction, contrast enhancement) before OCR. Fields with low confidence are flagged for human review."
                }
              },
              {
                "@type": "Question",
                "name": "Is it GDPR-compliant?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Absolutely. All processing happens in EU/GDPR-compliant regions with encryption, RBAC, audit logs, and configurable data retention policies."
                }
              },
              {
                "@type": "Question",
                "name": "How do you integrate with our ERP?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "We provide REST APIs, webhooks, and pre-built connectors for SAP, NetSuite, Dynamics, and custom systems. Data can also be exported to your data warehouse."
                }
              }
            ]
          })}
        </script>
      </Helmet>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-600/10 via-blue-600/5 to-transparent pointer-events-none" />
        
        <div className="relative max-w-6xl mx-auto">
          {/* Breadcrumb */}
          <nav className="mb-8 text-sm text-gray-400">
            <Link to="/services" className="hover:text-blue-400 transition-colors">
              {t("serviceDocument.breadcrumb.services")}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-white">{t("serviceDocument.breadcrumb.current")}</span>
          </nav>

          {/* Icon & Badge */}
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500/20 to-blue-500/20 ring-1 ring-white/10">
              <FileText className="h-8 w-8 text-green-400" />
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-green-500/10 px-4 py-1.5 text-xs font-semibold text-green-400 ring-1 ring-green-500/20">
              <Scan className="h-3 w-3" />
              {t("serviceDocument.hero.badge")}
            </div>
          </div>

          {/* Title */}
          <h1 className="mb-6 text-4xl md:text-6xl font-black leading-tight">
            <span className="bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              {t("serviceDocument.hero.title1")}
            </span>
            <br />
            <span className="text-white">
              {t("serviceDocument.hero.title2")}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mb-8 max-w-3xl text-lg md:text-xl text-gray-300 leading-relaxed">
            {t("serviceDocument.hero.subtitle")}
          </p>

          {/* Key Points */}
          <div className="mb-10 grid md:grid-cols-3 gap-4 max-w-3xl">
            {[
              { icon: Scan, text: t("serviceDocument.hero.keyPoints.0") },
              { icon: Shield, text: t("serviceDocument.hero.keyPoints.1") },
              { icon: Database, text: t("serviceDocument.hero.keyPoints.2") }
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
              {t("serviceDocument.hero.cta.book")}
              <ArrowRight className="h-5 w-5" />
            </a>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-xl bg-white/5 px-6 py-3 font-semibold text-white ring-1 ring-white/10 transition-all hover:bg-white/10"
            >
              {t("serviceDocument.hero.cta.contact")}
            </Link>
          </div>
        </div>
      </section>

      {/* Metrics Strip */}
      <section className="border-y border-white/10 bg-gradient-to-r from-green-500/5 to-blue-500/5 py-12 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-4xl font-black bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent mb-2">
              {t("serviceDocument.metrics.0.value")}
            </div>
            <div className="text-sm text-gray-400">{t("serviceDocument.metrics.0.label")}</div>
          </div>
          <div>
            <div className="text-4xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
              {t("serviceDocument.metrics.1.value")}
            </div>
            <div className="text-sm text-gray-400">{t("serviceDocument.metrics.1.label")}</div>
          </div>
          <div>
            <div className="text-4xl font-black bg-gradient-to-r from-purple-400 to-green-400 bg-clip-text text-transparent mb-2">
              {t("serviceDocument.metrics.2.value")}
            </div>
            <div className="text-sm text-gray-400">{t("serviceDocument.metrics.2.label")}</div>
          </div>
        </div>
      </section>

      {/* What It Is */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black mb-6 text-white">
            {t("serviceDocument.whatItIs.title")}
          </h2>
          <div className="space-y-4 text-lg text-gray-300 leading-relaxed">
            <p>
              {t("serviceDocument.whatItIs.p1")}
            </p>
            <p>
              {t("serviceDocument.whatItIs.p2")}
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 bg-gradient-to-br from-slate-900/50 to-slate-800/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black mb-6 text-white">
            {t("serviceDocument.howItWorks.title")}
          </h2>
          <div className="space-y-6">
            <div className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/10">
              <h3 className="text-xl font-bold text-green-400 mb-3 flex items-center gap-2">
                <Scan className="h-5 w-5" />
                {t("serviceDocument.howItWorks.ocr.title")}
              </h3>
              <p className="text-gray-300 leading-relaxed">
                {t("serviceDocument.howItWorks.ocr.description")}
              </p>
            </div>

            <div className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/10">
              <h3 className="text-xl font-bold text-blue-400 mb-3 flex items-center gap-2">
                <FileCheck className="h-5 w-5" />
                {t("serviceDocument.howItWorks.extraction.title")}
              </h3>
              <p className="text-gray-300 leading-relaxed">
                {t("serviceDocument.howItWorks.extraction.description")}
              </p>
            </div>

            <div className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/10">
              <h3 className="text-xl font-bold text-purple-400 mb-3 flex items-center gap-2">
                <Lock className="h-5 w-5" />
                {t("serviceDocument.howItWorks.gdpr.title")}
              </h3>
              <p className="text-gray-300 leading-relaxed">
                {t("serviceDocument.howItWorks.gdpr.description")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black mb-8 text-white">
            {t("serviceDocument.useCases.title")}
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { 
                title: t("serviceDocument.useCases.0.title"), 
                desc: t("serviceDocument.useCases.0.description"),
                icon: FileText
              },
              { 
                title: t("serviceDocument.useCases.1.title"), 
                desc: t("serviceDocument.useCases.1.description"),
                icon: Shield
              },
              { 
                title: t("serviceDocument.useCases.2.title"), 
                desc: t("serviceDocument.useCases.2.description"),
                icon: FileCheck
              },
              { 
                title: t("serviceDocument.useCases.3.title"), 
                desc: t("serviceDocument.useCases.3.description"),
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
            {t("serviceDocument.businessImpact.title")}
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { title: t("serviceDocument.businessImpact.0.title"), desc: t("serviceDocument.businessImpact.0.description") },
              { title: t("serviceDocument.businessImpact.1.title"), desc: t("serviceDocument.businessImpact.1.description") },
              { title: t("serviceDocument.businessImpact.2.title"), desc: t("serviceDocument.businessImpact.2.description") },
              { title: t("serviceDocument.businessImpact.3.title"), desc: t("serviceDocument.businessImpact.3.description") }
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
            {t("serviceDocument.faqs.title")}
          </h2>
          <div className="space-y-4">
            {[
              {
                q: t("serviceDocument.faqs.0.question"),
                a: t("serviceDocument.faqs.0.answer")
              },
              {
                q: t("serviceDocument.faqs.1.question"),
                a: t("serviceDocument.faqs.1.answer")
              },
              {
                q: t("serviceDocument.faqs.2.question"),
                a: t("serviceDocument.faqs.2.answer")
              },
              {
                q: t("serviceDocument.faqs.3.question"),
                a: t("serviceDocument.faqs.3.answer")
              },
              {
                q: t("serviceDocument.faqs.4.question"),
                a: t("serviceDocument.faqs.4.answer")
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
            {t("serviceDocument.cta.title")}
          </h2>
          <p className="mb-8 text-lg text-gray-300">
            {t("serviceDocument.cta.subtitle")}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href={contactUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-green-600 to-blue-600 px-8 py-4 font-semibold text-white shadow-lg shadow-green-500/25 transition-all hover:shadow-xl hover:shadow-green-500/40 hover:-translate-y-0.5"
            >
              {t("serviceDocument.cta.book")}
              <ArrowRight className="h-5 w-5" />
            </a>
            <Link
              to="/pricing"
              className="inline-flex items-center gap-2 rounded-xl bg-white/5 px-8 py-4 font-semibold text-white ring-1 ring-white/10 transition-all hover:bg-white/10"
            >
              {t("serviceDocument.cta.pricing")}
            </Link>
          </div>
        </div>
      </section>

      {/* Related Services */}
      <section className="py-16 px-6 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-xl font-bold text-gray-400 mb-6">{t("serviceDocument.related.title")}</h3>
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
                  {t("serviceDocument.related.agentic.title")}
                </div>
                <div className="text-sm text-gray-400">{t("serviceDocument.related.agentic.description")}</div>
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
                  {t("serviceDocument.related.sql.title")}
                </div>
                <div className="text-sm text-gray-400">{t("serviceDocument.related.sql.description")}</div>
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
