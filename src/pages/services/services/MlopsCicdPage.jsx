// /src/components/Index/services/MlopsCicdPage.jsx
import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Layers, ArrowRight, CheckCircle, GitBranch, Activity, Shield, Gauge, AlertTriangle, Package } from "lucide-react";
import { withUtm } from "../../../app/utils/utm";
import { useI18n } from "../../../app/i18n/I18nContext";

const CALENDLY_URL = "https://calendly.com/algorythmos-france/30min";

export default function MlopsCicdPage() {
  const { t, region } = useI18n();
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
        <title>{t("serviceMlops.meta.title")}</title>
        <meta
          name="description"
          content={t("serviceMlops.meta.description")}
        />
        <link rel="canonical" href="https://www.algorythmos.fr/services/mlops-cicd" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={t("serviceMlops.meta.title")} />
        <meta property="og:description" content={t("serviceMlops.meta.description")} />
        <meta property="og:url" content="https://www.algorythmos.fr/services/mlops-cicd" />
        <meta property="og:image" content="https://www.algorythmos.fr/Algorythmos.png" />
        <meta property="og:site_name" content="Algorythmos" />
        <meta property="og:locale" content={region === "FR" ? "fr_FR" : "en_US"} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t("serviceMlops.meta.title")} />
        <meta name="twitter:description" content={t("serviceMlops.meta.description")} />
        <meta name="twitter:image" content="https://www.algorythmos.fr/Algorythmos.png" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "MLOps & Platform Engineering",
            "provider": {
              "@type": "Organization",
              "name": "Algorythmos",
              "url": "https://www.algorythmos.fr"
            },
            "description": "Production-grade ML with CI/CD on Kubernetes and Docker. Automated evaluations, observability, drift monitoring, safe rollbacks, and DevSecOps governance for AI that survives production.",
            "url": "https://www.algorythmos.fr/services/mlops-cicd",
            "areaServed": ["France", "Australia", "Europe"]
          })}
        </script>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.algorythmos.fr"},
              {"@type": "ListItem", "position": 2, "name": "Services", "item": "https://www.algorythmos.fr/services"},
              {"@type": "ListItem", "position": 3, "name": "MLOps & Platform Engineering", "item": "https://www.algorythmos.fr/services/mlops-cicd"}
            ]
          })}
        </script>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {"@type": "Question", "name": "Do you support on-premises deployment?", "acceptedAnswer": {"@type": "Answer", "text": "Yes. We can deploy the full ML stack on your Kubernetes cluster with SSO, RBAC, private networking, and air-gapped operation if required."}},
              {"@type": "Question", "name": "How do you handle model drift?", "acceptedAnswer": {"@type": "Answer", "text": "We monitor feature distributions, prediction patterns, and model performance in production. Automated alerts trigger retraining workflows when drift is detected."}},
              {"@type": "Question", "name": "What about LLM-specific MLOps?", "acceptedAnswer": {"@type": "Answer", "text": "We specialize in LLM deployment: prompt versioning, evaluation pipelines, cost tracking, guardrails, and human-in-the-loop feedback loops."}},
              {"@type": "Question", "name": "Can you integrate with our existing tools?", "acceptedAnswer": {"@type": "Answer", "text": "Absolutely. We work with your existing infrastructure: cloud providers, CI/CD tools, model registries, and monitoring stacks."}},
              {"@type": "Question", "name": "How long does it take to set up?", "acceptedAnswer": {"@type": "Answer", "text": "Depends on your stack and requirements. A basic CI/CD pipeline can be live in 2-3 weeks. Full production setup with monitoring and governance takes 1-2 months."}}
            ]
          })}
        </script>
      </Helmet>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-pink-600/5 to-transparent pointer-events-none" />
        
        <div className="relative max-w-6xl mx-auto">
          {/* Breadcrumb */}
          <nav className="mb-8 text-sm text-gray-400">
            <Link to="/services" className="hover:text-blue-400 transition-colors">
              {t("serviceMlops.breadcrumb.services")}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-white">{t("serviceMlops.breadcrumb.current")}</span>
          </nav>

          {/* Icon & Badge */}
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 ring-1 ring-white/10">
              <Layers className="h-8 w-8 text-purple-400" />
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-purple-500/10 px-4 py-1.5 text-xs font-semibold text-purple-400 ring-1 ring-purple-500/20">
              <GitBranch className="h-3 w-3" />
              {t("serviceMlops.hero.badge")}
            </div>
          </div>

          {/* Title */}
          <h1 className="mb-6 text-4xl md:text-6xl font-black leading-tight">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              {t("serviceMlops.hero.title1")}
            </span>
            <br />
            <span className="text-white">
              {t("serviceMlops.hero.title2")}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mb-8 max-w-3xl text-lg md:text-xl text-gray-300 leading-relaxed">
            {t("serviceMlops.hero.subtitle")}
          </p>

          {/* Key Points */}
          <div className="mb-10 grid md:grid-cols-3 gap-4 max-w-3xl">
            {[
              { icon: Package, text: t("serviceMlops.hero.keyPoints.0") },
              { icon: Activity, text: t("serviceMlops.hero.keyPoints.1") },
              { icon: GitBranch, text: t("serviceMlops.hero.keyPoints.2") }
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
              {t("serviceMlops.hero.cta.book")}
              <ArrowRight className="h-5 w-5" />
            </a>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-xl bg-white/5 px-6 py-3 font-semibold text-white ring-1 ring-white/10 transition-all hover:bg-white/10"
            >
              {t("serviceMlops.hero.cta.contact")}
            </Link>
          </div>
        </div>
      </section>

      {/* Metrics Strip */}
      <section className="border-y border-white/10 bg-gradient-to-r from-purple-500/5 to-pink-500/5 py-12 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-4xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
              {t("serviceMlops.metrics.0.value")}
            </div>
            <div className="text-sm text-gray-400">{t("serviceMlops.metrics.0.label")}</div>
          </div>
          <div>
            <div className="text-4xl font-black bg-gradient-to-r from-pink-400 to-blue-400 bg-clip-text text-transparent mb-2">
              {t("serviceMlops.metrics.1.value")}
            </div>
            <div className="text-sm text-gray-400">{t("serviceMlops.metrics.1.label")}</div>
          </div>
          <div>
            <div className="text-4xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
              {t("serviceMlops.metrics.2.value")}
            </div>
            <div className="text-sm text-gray-400">{t("serviceMlops.metrics.2.label")}</div>
          </div>
        </div>
      </section>

      {/* What It Is */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black mb-6 text-white">
            {t("serviceMlops.whatItIs.title")}
          </h2>
          <div className="space-y-4 text-lg text-gray-300 leading-relaxed">
            <p>
              {t("serviceMlops.whatItIs.p1")}
            </p>
            <p>
              {t("serviceMlops.whatItIs.p2")}
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 bg-gradient-to-br from-slate-900/50 to-slate-800/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black mb-6 text-white">
            {t("serviceMlops.howItWorks.title")}
          </h2>
          <div className="space-y-6">
            <div className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/10">
              <h3 className="text-xl font-bold text-purple-400 mb-3 flex items-center gap-2">
                <GitBranch className="h-5 w-5" />
                {t("serviceMlops.howItWorks.cicd.title")}
              </h3>
              <p className="text-gray-300 leading-relaxed">
                {t("serviceMlops.howItWorks.cicd.description")}
              </p>
            </div>

            <div className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/10">
              <h3 className="text-xl font-bold text-pink-400 mb-3 flex items-center gap-2">
                <Activity className="h-5 w-5" />
                {t("serviceMlops.howItWorks.observability.title")}
              </h3>
              <p className="text-gray-300 leading-relaxed">
                {t("serviceMlops.howItWorks.observability.description")}
              </p>
            </div>

            <div className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/10">
              <h3 className="text-xl font-bold text-blue-400 mb-3 flex items-center gap-2">
                <Shield className="h-5 w-5" />
                {t("serviceMlops.howItWorks.governance.title")}
              </h3>
              <p className="text-gray-300 leading-relaxed">
                {t("serviceMlops.howItWorks.governance.description")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Deployment Patterns */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black mb-8 text-white">
            {t("serviceMlops.deploymentPatterns.title")}
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { 
                title: t("serviceMlops.deploymentPatterns.0.title"), 
                desc: t("serviceMlops.deploymentPatterns.0.description"),
                icon: Shield
              },
              { 
                title: t("serviceMlops.deploymentPatterns.1.title"), 
                desc: t("serviceMlops.deploymentPatterns.1.description"),
                icon: Layers
              },
              { 
                title: t("serviceMlops.deploymentPatterns.2.title"), 
                desc: t("serviceMlops.deploymentPatterns.2.description"),
                icon: Package
              },
              { 
                title: t("serviceMlops.deploymentPatterns.3.title"), 
                desc: t("serviceMlops.deploymentPatterns.3.description"),
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
            {t("serviceMlops.businessImpact.title")}
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { title: t("serviceMlops.businessImpact.0.title"), desc: t("serviceMlops.businessImpact.0.description") },
              { title: t("serviceMlops.businessImpact.1.title"), desc: t("serviceMlops.businessImpact.1.description") },
              { title: t("serviceMlops.businessImpact.2.title"), desc: t("serviceMlops.businessImpact.2.description") },
              { title: t("serviceMlops.businessImpact.3.title"), desc: t("serviceMlops.businessImpact.3.description") }
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
            {t("serviceMlops.architecture.title")}
          </h2>
          <div className="rounded-2xl bg-black/30 p-8 ring-1 ring-white/10">
            <div className="space-y-4 text-gray-300">
              <p className="font-mono text-sm leading-relaxed">
                {t("serviceMlops.architecture.pipeline")}
              </p>
              <p className="text-sm leading-relaxed">
                <strong>{t("serviceMlops.architecture.trainingLabel")}</strong> {t("serviceMlops.architecture.training")}
              </p>
              <p className="text-sm leading-relaxed">
                <strong>{t("serviceMlops.architecture.deploymentLabel")}</strong> {t("serviceMlops.architecture.deployment")}
              </p>
              <p className="text-sm leading-relaxed">
                <strong>{t("serviceMlops.architecture.monitoringLabel")}</strong> {t("serviceMlops.architecture.monitoring")}
              </p>
              <p className="text-sm leading-relaxed">
                <strong>{t("serviceMlops.architecture.governanceLabel")}</strong> {t("serviceMlops.architecture.governance")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-20 px-6 bg-gradient-to-br from-slate-900/50 to-slate-800/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black mb-8 text-white">
            {t("serviceMlops.faqs.title")}
          </h2>
          <div className="space-y-4">
            {[
              {
                q: t("serviceMlops.faqs.0.question"),
                a: t("serviceMlops.faqs.0.answer")
              },
              {
                q: t("serviceMlops.faqs.1.question"),
                a: t("serviceMlops.faqs.1.answer")
              },
              {
                q: t("serviceMlops.faqs.2.question"),
                a: t("serviceMlops.faqs.2.answer")
              },
              {
                q: t("serviceMlops.faqs.3.question"),
                a: t("serviceMlops.faqs.3.answer")
              },
              {
                q: t("serviceMlops.faqs.4.question"),
                a: t("serviceMlops.faqs.4.answer")
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
            {t("serviceMlops.cta.title")}
          </h2>
          <p className="mb-8 text-lg text-gray-300">
            {t("serviceMlops.cta.subtitle")}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href={contactUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-4 font-semibold text-white shadow-lg shadow-purple-500/25 transition-all hover:shadow-xl hover:shadow-purple-500/40 hover:-translate-y-0.5"
            >
              {t("serviceMlops.cta.book")}
              <ArrowRight className="h-5 w-5" />
            </a>
            <Link
              to="/pricing"
              className="inline-flex items-center gap-2 rounded-xl bg-white/5 px-8 py-4 font-semibold text-white ring-1 ring-white/10 transition-all hover:bg-white/10"
            >
              {t("serviceMlops.cta.pricing")}
            </Link>
          </div>
        </div>
      </section>

      {/* Related Services */}
      <section className="py-16 px-6 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-xl font-bold text-gray-400 mb-6">{t("serviceMlops.related.title")}</h3>
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
                  {t("serviceMlops.related.agentic.title")}
                </div>
                <div className="text-sm text-gray-400">{t("serviceMlops.related.agentic.description")}</div>
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
                  {t("serviceMlops.related.sql.title")}
                </div>
                <div className="text-sm text-gray-400">{t("serviceMlops.related.sql.description")}</div>
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
