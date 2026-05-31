// /src/components/Index/services/AgenticAutomationPage.jsx
import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Bot, ArrowRight, CheckCircle, Activity, Shield, Zap, GitBranch, Users } from "lucide-react";
import { withUtm } from "../../../app/utils/utm";
import { useI18n } from "../../../app/i18n/I18nContext.jsx";
import { getCanonicalUrl, getOgLocale, generateHreflangLinks, getCanonicalBase } from "../../../app/utils/seoHelpers.js";

const CALENDLY_URL = "https://calendly.com/algorythmos-france/30min";

export default function AgenticAutomationPage() {
  const { t, region, getRegionPath } = useI18n();

  // SEO helpers
  const canonicalUrl = getCanonicalUrl(region, "/services/agentic-automation");
  const canonicalBase = getCanonicalBase(region);
  const ogLocale = getOgLocale(region);
  const hreflangLinks = generateHreflangLinks("/services/agentic-automation");
  
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
        <title>{t("serviceAgentic.meta.title")}</title>
        <meta
          name="description"
          content={t("serviceAgentic.meta.description")}
        />
        <link rel="canonical" href={canonicalUrl} />
        {hreflangLinks.map(({ hreflang, href }) => (
          <link key={hreflang} rel="alternate" hreflang={hreflang} href={href} />
        ))}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={t("serviceAgentic.meta.title")} />
        <meta property="og:description" content={t("serviceAgentic.meta.description")} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content={`${canonicalBase}/Algorythmos.png`} />
        <meta property="og:site_name" content="Algorythmos" />
        <meta property="og:locale" content={ogLocale} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t("serviceAgentic.meta.title")} />
        <meta name="twitter:description" content={t("serviceAgentic.meta.description")} />
        <meta name="twitter:image" content={`${canonicalBase}/Algorythmos.png`} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "name": t("serviceAgentic.meta.title"),
            "provider": {
              "@type": "Organization",
              "name": "Algorythmos",
              "url": canonicalBase
            },
            "description": t("serviceAgentic.meta.description"),
            "url": canonicalUrl,
            "areaServed": region === "AU" ? ["Australia"] : region === "FR" ? ["France", "Europe"] : ["Worldwide"]
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
                "item": canonicalBase
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Services",
                "item": `${canonicalBase}/services`
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": "Agentic Automation",
                "item": canonicalUrl
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
                "name": "How is this safer than a regular LLM bot?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Actions go through explicit tools with input/output validation, policy prompts, and optional human review before execution. You control what the agent can and cannot do."
                }
              },
              {
                "@type": "Question",
                "name": "Do you support on-premises deployment?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes. We can deploy the full stack on your infrastructure with SSO, RBAC, and private networking. Perfect for regulated industries or sensitive data."
                }
              },
              {
                "@type": "Question",
                "name": "What systems can you integrate with?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Most CRMs (Salesforce, HubSpot), ERPs (SAP, NetSuite), email (Gmail, Outlook), Slack, databases, and custom APIs. We build connectors as needed."
                }
              },
              {
                "@type": "Question",
                "name": "How do you handle errors and edge cases?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Agents can retry with backoff, escalate to human review queues, or fail gracefully with detailed error logs. We design workflows for resilience."
                }
              }
            ]
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
            <Link to={getRegionPath("/services")} className="hover:text-blue-400 transition-colors">
              {t("serviceAgentic.breadcrumb.services")}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-white">{t("serviceAgentic.breadcrumb.current")}</span>
          </nav>

          {/* Icon & Badge */}
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 ring-1 ring-white/10">
              <Bot className="h-8 w-8 text-blue-400" />
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 px-4 py-1.5 text-xs font-semibold text-blue-400 ring-1 ring-blue-500/20">
              <Activity className="h-3 w-3" />
              {t("serviceAgentic.hero.badge")}
            </div>
          </div>

          {/* Title */}
          <h1 className="mb-6 text-4xl md:text-6xl font-black leading-tight">
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              {t("serviceAgentic.hero.title1")}
            </span>
            <br />
            <span className="text-white">
              {t("serviceAgentic.hero.title2")}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mb-8 max-w-3xl text-lg md:text-xl text-gray-300 leading-relaxed">
            {t("serviceAgentic.hero.subtitle")}
          </p>

          {/* Key Points */}
          <div className="mb-10 grid md:grid-cols-3 gap-4 max-w-3xl">
            {[
              { icon: GitBranch, text: t("serviceAgentic.hero.keyPoints.0") },
              { icon: Shield, text: t("serviceAgentic.hero.keyPoints.1") },
              { icon: Zap, text: t("serviceAgentic.hero.keyPoints.2") }
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
              {t("serviceAgentic.hero.cta.primary")}
              <ArrowRight className="h-5 w-5" />
            </a>
            <Link
              to={getRegionPath("/contact")}
              className="inline-flex items-center gap-2 rounded-xl bg-white/5 px-6 py-3 font-semibold text-white ring-1 ring-white/10 transition-all hover:bg-white/10"
            >
              {t("serviceAgentic.hero.cta.secondary")}
            </Link>
          </div>
        </div>
      </section>

      {/* Metrics Strip */}
      <section className="border-y border-white/10 bg-gradient-to-r from-blue-500/5 to-purple-500/5 py-12 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-4xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
              {t("serviceAgentic.metrics.0.value")}
            </div>
            <div className="text-sm text-gray-400">{t("serviceAgentic.metrics.0.label")}</div>
          </div>
          <div>
            <div className="text-4xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
              {t("serviceAgentic.metrics.1.value")}
            </div>
            <div className="text-sm text-gray-400">{t("serviceAgentic.metrics.1.label")}</div>
          </div>
          <div>
            <div className="text-4xl font-black bg-gradient-to-r from-pink-400 to-blue-400 bg-clip-text text-transparent mb-2">
              {t("serviceAgentic.metrics.2.value")}
            </div>
            <div className="text-sm text-gray-400">{t("serviceAgentic.metrics.2.label")}</div>
          </div>
        </div>
      </section>

      {/* What It Is */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black mb-6 text-white">
            {t("serviceAgentic.whatItIs.title")}
          </h2>
          <div className="space-y-4 text-lg text-gray-300 leading-relaxed">
            <p>
              {t("serviceAgentic.whatItIs.p1")}
            </p>
            <p>
              {t("serviceAgentic.whatItIs.p2")}
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 bg-gradient-to-br from-slate-900/50 to-slate-800/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black mb-6 text-white">
            {t("serviceAgentic.howItWorks.title")}
          </h2>
          <div className="space-y-6">
            <div className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/10">
              <h3 className="text-xl font-bold text-blue-400 mb-3 flex items-center gap-2">
                <GitBranch className="h-5 w-5" />
                {t("serviceAgentic.howItWorks.0.title")}
              </h3>
              <p className="text-gray-300 leading-relaxed">
                {t("serviceAgentic.howItWorks.0.description")}
              </p>
            </div>

            <div className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/10">
              <h3 className="text-xl font-bold text-purple-400 mb-3 flex items-center gap-2">
                <Users className="h-5 w-5" />
                {t("serviceAgentic.howItWorks.1.title")}
              </h3>
              <p className="text-gray-300 leading-relaxed">
                {t("serviceAgentic.howItWorks.1.description")}
              </p>
            </div>

            <div className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/10">
              <h3 className="text-xl font-bold text-pink-400 mb-3 flex items-center gap-2">
                <Activity className="h-5 w-5" />
                {t("serviceAgentic.howItWorks.2.title")}
              </h3>
              <p className="text-gray-300 leading-relaxed">
                {t("serviceAgentic.howItWorks.2.description")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Business Impact */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black mb-8 text-white">
            {t("serviceAgentic.businessImpact.title")}
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { title: t("serviceAgentic.businessImpact.0.title"), desc: t("serviceAgentic.businessImpact.0.description") },
              { title: t("serviceAgentic.businessImpact.1.title"), desc: t("serviceAgentic.businessImpact.1.description") },
              { title: t("serviceAgentic.businessImpact.2.title"), desc: t("serviceAgentic.businessImpact.2.description") },
              { title: t("serviceAgentic.businessImpact.3.title"), desc: t("serviceAgentic.businessImpact.3.description") }
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
            {t("serviceAgentic.architecture.title")}
          </h2>
          <div className="rounded-2xl bg-black/30 p-8 ring-1 ring-white/10">
            <div className="space-y-4 text-gray-300">
              <p className="font-mono text-sm leading-relaxed">
                <span className="text-blue-400">Planner/Router</span> → <span className="text-purple-400">Tools/Functions</span> → <span className="text-pink-400">Memory/Vector DB</span> → <span className="text-green-400">Review Queue</span> → <span className="text-orange-400">Observability</span>
              </p>
              <p className="text-sm leading-relaxed">
                {t("serviceAgentic.architecture.p1")}
              </p>
              <p className="text-sm leading-relaxed">
                {t("serviceAgentic.architecture.p2")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black mb-8 text-white">
            {t("serviceAgentic.faqs.title")}
          </h2>
          <div className="space-y-4">
            {[
              {
                q: t("serviceAgentic.faqs.0.question"),
                a: t("serviceAgentic.faqs.0.answer")
              },
              {
                q: t("serviceAgentic.faqs.1.question"),
                a: t("serviceAgentic.faqs.1.answer")
              },
              {
                q: t("serviceAgentic.faqs.2.question"),
                a: t("serviceAgentic.faqs.2.answer")
              },
              {
                q: t("serviceAgentic.faqs.3.question"),
                a: t("serviceAgentic.faqs.3.answer")
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
            {t("serviceAgentic.cta.title")}
          </h2>
          <p className="mb-8 text-lg text-gray-300">
            {t("serviceAgentic.cta.subtitle")}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href={contactUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4 font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-0.5"
            >
              {t("serviceAgentic.cta.primary")}
              <ArrowRight className="h-5 w-5" />
            </a>
            <Link
              to={getRegionPath("/pricing")}
              className="inline-flex items-center gap-2 rounded-xl bg-white/5 px-8 py-4 font-semibold text-white ring-1 ring-white/10 transition-all hover:bg-white/10"
            >
              {t("serviceAgentic.cta.secondary")}
            </Link>
          </div>
        </div>
      </section>

      {/* Related Services */}
      <section className="py-16 px-6 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-xl font-bold text-gray-400 mb-6">{t("serviceAgentic.related.title")}</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <Link
              to={getRegionPath("/services/document-intelligence")}
              className="group flex items-center gap-4 rounded-xl bg-white/5 p-6 ring-1 ring-white/10 transition-all hover:bg-white/10"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-500/20 to-blue-500/20">
                <FileText className="h-6 w-6 text-green-400" />
              </div>
              <div>
                <div className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                  {t("serviceAgentic.related.0.title")}
                </div>
                <div className="text-sm text-gray-400">{t("serviceAgentic.related.0.description")}</div>
              </div>
            </Link>
            <Link
              to={getRegionPath("/services/mlops-cicd")}
              className="group flex items-center gap-4 rounded-xl bg-white/5 p-6 ring-1 ring-white/10 transition-all hover:bg-white/10"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20">
                <Layers className="h-6 w-6 text-purple-400" />
              </div>
              <div>
                <div className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                  {t("serviceAgentic.related.1.title")}
                </div>
                <div className="text-sm text-gray-400">{t("serviceAgentic.related.1.description")}</div>
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
