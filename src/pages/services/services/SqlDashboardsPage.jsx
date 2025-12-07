// /src/components/Index/services/SqlDashboardsPage.jsx
import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { BarChart3, ArrowRight, CheckCircle, TrendingUp, Database, Users, Gauge, Bell, LineChart } from "lucide-react";
import { withUtm } from "../../../app/utils/utm";
import { useI18n } from "../../../app/i18n/I18nContext";

const CALENDLY_URL = "https://calendly.com/algorythmos-france/30min";

export default function SqlDashboardsPage() {
  const { t, region } = useI18n();
  const contactUrl = useMemo(() => {
    return withUtm(CALENDLY_URL, {
      utm_source: "services",
      utm_medium: "cta",
      utm_campaign: "sql-dashboards",
      utm_content: "hero_cta",
    });
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      <Helmet>
        <title>{t("serviceSqlDashboards.meta.title")}</title>
        <meta
          name="description"
          content={t("serviceSqlDashboards.meta.description")}
        />
        <link rel="canonical" href="https://www.algorythmos.fr/services/sql-dashboards" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={t("serviceSqlDashboards.meta.title")} />
        <meta property="og:description" content={t("serviceSqlDashboards.meta.description")} />
        <meta property="og:url" content="https://www.algorythmos.fr/services/sql-dashboards" />
        <meta property="og:image" content="https://www.algorythmos.fr/Algorythmos.png" />
        <meta property="og:site_name" content="Algorythmos" />
        <meta property="og:locale" content={region === "FR" ? "fr_FR" : "en_US"} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t("serviceSqlDashboards.meta.title")} />
        <meta name="twitter:description" content={t("serviceSqlDashboards.meta.description")} />
        <meta name="twitter:image" content="https://www.algorythmos.fr/Algorythmos.png" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "SQL Dashboards & Analytics",
            "provider": {
              "@type": "Organization",
              "name": "Algorythmos",
              "url": "https://www.algorythmos.fr"
            },
            "description": "Unified metrics and AI-assisted insights on modern SQL stacks. Modeled data, executive-ready dashboards with alerts, RBAC, and self-serve analytics for data-driven decisions.",
            "url": "https://www.algorythmos.fr/services/sql-dashboards",
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
              {"@type": "ListItem", "position": 3, "name": "SQL Dashboards & Analytics", "item": "https://www.algorythmos.fr/services/sql-dashboards"}
            ]
          })}
        </script>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {"@type": "Question", "name": "Which data warehouses do you support?", "acceptedAnswer": {"@type": "Answer", "text": "We work with Snowflake, BigQuery, Redshift, Postgres, and other modern SQL engines. We can also help migrate from legacy systems."}},
              {"@type": "Question", "name": "Do I need a data team to maintain this?", "acceptedAnswer": {"@type": "Answer", "text": "Not necessarily. We design models and dashboards that are self-documenting and easy to update. We also offer managed services if you prefer."}},
              {"@type": "Question", "name": "Can non-technical users explore the data?", "acceptedAnswer": {"@type": "Answer", "text": "Absolutely. Modern BI tools provide intuitive interfaces for filtering, drilling down, and creating custom views—no SQL required."}},
              {"@type": "Question", "name": "How do you ensure data quality?", "acceptedAnswer": {"@type": "Answer", "text": "We implement data validation tests, lineage tracking, and automated alerts for schema changes or anomalies. dbt tests run on every transformation."}},
              {"@type": "Question", "name": "What about real-time dashboards?", "acceptedAnswer": {"@type": "Answer", "text": "We can build near-real-time dashboards using streaming pipelines (Kafka, Kinesis) and incremental models. Talk to us about your latency requirements."}}
            ]
          })}
        </script>
      </Helmet>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-600/10 via-yellow-600/5 to-transparent pointer-events-none" />
        
        <div className="relative max-w-6xl mx-auto">
          {/* Breadcrumb */}
          <nav className="mb-8 text-sm text-gray-400">
            <Link to="/services" className="hover:text-blue-400 transition-colors">
              {t("serviceSqlDashboards.breadcrumb.services")}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-white">{t("serviceSqlDashboards.breadcrumb.current")}</span>
          </nav>

          {/* Icon & Badge */}
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500/20 to-yellow-500/20 ring-1 ring-white/10">
              <BarChart3 className="h-8 w-8 text-orange-400" />
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-orange-500/10 px-4 py-1.5 text-xs font-semibold text-orange-400 ring-1 ring-orange-500/20">
              <TrendingUp className="h-3 w-3" />
              {t("serviceSqlDashboards.hero.badge")}
            </div>
          </div>

          {/* Title */}
          <h1 className="mb-6 text-4xl md:text-6xl font-black leading-tight">
            <span className="bg-gradient-to-r from-orange-400 via-yellow-400 to-red-400 bg-clip-text text-transparent">
              {t("serviceSqlDashboards.hero.title1")}
            </span>
            <br />
            <span className="text-white">
              {t("serviceSqlDashboards.hero.title2")}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mb-8 max-w-3xl text-lg md:text-xl text-gray-300 leading-relaxed">
            {t("serviceSqlDashboards.hero.subtitle")}
          </p>

          {/* Key Points */}
          <div className="mb-10 grid md:grid-cols-3 gap-4 max-w-3xl">
            {[
              { icon: Database, text: t("serviceSqlDashboards.hero.keyPoints.0") },
              { icon: Gauge, text: t("serviceSqlDashboards.hero.keyPoints.1") },
              { icon: Bell, text: t("serviceSqlDashboards.hero.keyPoints.2") }
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 text-sm text-gray-300">
                <item.icon className="h-5 w-5 text-orange-400 flex-shrink-0 mt-0.5" />
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
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-600 to-yellow-600 px-6 py-3 font-semibold text-white shadow-lg shadow-orange-500/25 transition-all hover:shadow-xl hover:shadow-orange-500/40 hover:-translate-y-0.5"
            >
              {t("serviceSqlDashboards.hero.cta.demo")}
              <ArrowRight className="h-5 w-5" />
            </a>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-xl bg-white/5 px-6 py-3 font-semibold text-white ring-1 ring-white/10 transition-all hover:bg-white/10"
            >
              {t("serviceSqlDashboards.hero.cta.contact")}
            </Link>
          </div>
        </div>
      </section>

      {/* Metrics Strip */}
      <section className="border-y border-white/10 bg-gradient-to-r from-orange-500/5 to-yellow-500/5 py-12 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-4xl font-black bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent mb-2">
              {t("serviceSqlDashboards.metrics.0.value")}
            </div>
            <div className="text-sm text-gray-400">{t("serviceSqlDashboards.metrics.0.label")}</div>
          </div>
          <div>
            <div className="text-4xl font-black bg-gradient-to-r from-yellow-400 to-red-400 bg-clip-text text-transparent mb-2">
              {t("serviceSqlDashboards.metrics.1.value")}
            </div>
            <div className="text-sm text-gray-400">{t("serviceSqlDashboards.metrics.1.label")}</div>
          </div>
          <div>
            <div className="text-4xl font-black bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent mb-2">
              {t("serviceSqlDashboards.metrics.2.value")}
            </div>
            <div className="text-sm text-gray-400">{t("serviceSqlDashboards.metrics.2.label")}</div>
          </div>
        </div>
      </section>

      {/* What It Is */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black mb-6 text-white">
            {t("serviceSqlDashboards.whatItIs.title")}
          </h2>
          <div className="space-y-4 text-lg text-gray-300 leading-relaxed">
            <p>
              {t("serviceSqlDashboards.whatItIs.p1")}
            </p>
            <p>
              {t("serviceSqlDashboards.whatItIs.p2")}
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 bg-gradient-to-br from-slate-900/50 to-slate-800/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black mb-6 text-white">
            {t("serviceSqlDashboards.howItWorks.title")}
          </h2>
          <div className="space-y-6">
            <div className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/10">
              <h3 className="text-xl font-bold text-orange-400 mb-3 flex items-center gap-2">
                <Database className="h-5 w-5" />
                {t("serviceSqlDashboards.howItWorks.modeling.title")}
              </h3>
              <p className="text-gray-300 leading-relaxed">
                {t("serviceSqlDashboards.howItWorks.modeling.description")}
              </p>
            </div>

            <div className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/10">
              <h3 className="text-xl font-bold text-yellow-400 mb-3 flex items-center gap-2">
                <LineChart className="h-5 w-5" />
                {t("serviceSqlDashboards.howItWorks.dashboards.title")}
              </h3>
              <p className="text-gray-300 leading-relaxed">
                {t("serviceSqlDashboards.howItWorks.dashboards.description")}
              </p>
            </div>

            <div className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/10">
              <h3 className="text-xl font-bold text-red-400 mb-3 flex items-center gap-2">
                <Bell className="h-5 w-5" />
                {t("serviceSqlDashboards.howItWorks.alerts.title")}
              </h3>
              <p className="text-gray-300 leading-relaxed">
                {t("serviceSqlDashboards.howItWorks.alerts.description")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black mb-8 text-white">
            {t("serviceSqlDashboards.useCases.title")}
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { 
                title: t("serviceSqlDashboards.useCases.0.title"), 
                desc: t("serviceSqlDashboards.useCases.0.description"),
                icon: Gauge
              },
              { 
                title: t("serviceSqlDashboards.useCases.1.title"), 
                desc: t("serviceSqlDashboards.useCases.1.description"),
                icon: TrendingUp
              },
              { 
                title: t("serviceSqlDashboards.useCases.2.title"), 
                desc: t("serviceSqlDashboards.useCases.2.description"),
                icon: Users
              },
              { 
                title: t("serviceSqlDashboards.useCases.3.title"), 
                desc: t("serviceSqlDashboards.useCases.3.description"),
                icon: LineChart
              }
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4 rounded-xl bg-gradient-to-br from-orange-500/5 to-yellow-500/5 p-6 ring-1 ring-white/10">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500/20 to-yellow-500/20 flex-shrink-0">
                  <item.icon className="h-5 w-5 text-orange-400" />
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
            {t("serviceSqlDashboards.businessImpact.title")}
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { title: t("serviceSqlDashboards.businessImpact.0.title"), desc: t("serviceSqlDashboards.businessImpact.0.description") },
              { title: t("serviceSqlDashboards.businessImpact.1.title"), desc: t("serviceSqlDashboards.businessImpact.1.description") },
              { title: t("serviceSqlDashboards.businessImpact.2.title"), desc: t("serviceSqlDashboards.businessImpact.2.description") },
              { title: t("serviceSqlDashboards.businessImpact.3.title"), desc: t("serviceSqlDashboards.businessImpact.3.description") }
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4 rounded-xl bg-white/5 p-6 ring-1 ring-white/10">
                <CheckCircle className="h-6 w-6 text-orange-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-400">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black mb-6 text-white">
            {t("serviceSqlDashboards.techStack.title")}
          </h2>
          <div className="rounded-2xl bg-gradient-to-br from-slate-900/50 to-slate-800/30 p-8 ring-1 ring-white/10">
            <div className="space-y-4 text-gray-300">
              <div>
                <h3 className="font-bold text-orange-400 mb-2">{t("serviceSqlDashboards.techStack.warehouses.title")}</h3>
                <p className="text-sm">{t("serviceSqlDashboards.techStack.warehouses.description")}</p>
              </div>
              <div>
                <h3 className="font-bold text-yellow-400 mb-2">{t("serviceSqlDashboards.techStack.bi.title")}</h3>
                <p className="text-sm">{t("serviceSqlDashboards.techStack.bi.description")}</p>
              </div>
              <div>
                <h3 className="font-bold text-red-400 mb-2">{t("serviceSqlDashboards.techStack.modeling.title")}</h3>
                <p className="text-sm">{t("serviceSqlDashboards.techStack.modeling.description")}</p>
              </div>
              <div>
                <h3 className="font-bold text-blue-400 mb-2">{t("serviceSqlDashboards.techStack.alerts.title")}</h3>
                <p className="text-sm">{t("serviceSqlDashboards.techStack.alerts.description")}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-20 px-6 bg-gradient-to-br from-slate-900/50 to-slate-800/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black mb-8 text-white">
            {t("serviceSqlDashboards.faqs.title")}
          </h2>
          <div className="space-y-4">
            {[
              {
                q: t("serviceSqlDashboards.faqs.0.question"),
                a: t("serviceSqlDashboards.faqs.0.answer")
              },
              {
                q: t("serviceSqlDashboards.faqs.1.question"),
                a: t("serviceSqlDashboards.faqs.1.answer")
              },
              {
                q: t("serviceSqlDashboards.faqs.2.question"),
                a: t("serviceSqlDashboards.faqs.2.answer")
              },
              {
                q: t("serviceSqlDashboards.faqs.3.question"),
                a: t("serviceSqlDashboards.faqs.3.answer")
              },
              {
                q: t("serviceSqlDashboards.faqs.4.question"),
                a: t("serviceSqlDashboards.faqs.4.answer")
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
      <section className="py-20 px-6 bg-gradient-to-br from-orange-600/10 via-yellow-600/10 to-transparent">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-black mb-4 text-white">
            {t("serviceSqlDashboards.cta.title")}
          </h2>
          <p className="mb-8 text-lg text-gray-300">
            {t("serviceSqlDashboards.cta.subtitle")}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href={contactUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-600 to-yellow-600 px-8 py-4 font-semibold text-white shadow-lg shadow-orange-500/25 transition-all hover:shadow-xl hover:shadow-orange-500/40 hover:-translate-y-0.5"
            >
              {t("serviceSqlDashboards.cta.demo")}
              <ArrowRight className="h-5 w-5" />
            </a>
            <Link
              to="/pricing"
              className="inline-flex items-center gap-2 rounded-xl bg-white/5 px-8 py-4 font-semibold text-white ring-1 ring-white/10 transition-all hover:bg-white/10"
            >
              {t("serviceSqlDashboards.cta.pricing")}
            </Link>
          </div>
        </div>
      </section>

      {/* Related Services */}
      <section className="py-16 px-6 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-xl font-bold text-gray-400 mb-6">{t("serviceSqlDashboards.related.title")}</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <Link
              to="/services/mlops-cicd"
              className="group flex items-center gap-4 rounded-xl bg-white/5 p-6 ring-1 ring-white/10 transition-all hover:bg-white/10"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20">
                <Layers className="h-6 w-6 text-purple-400" />
              </div>
              <div>
                <div className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                  {t("serviceSqlDashboards.related.mlops.title")}
                </div>
                <div className="text-sm text-gray-400">{t("serviceSqlDashboards.related.mlops.description")}</div>
              </div>
            </Link>
            <Link
              to="/services/document-intelligence"
              className="group flex items-center gap-4 rounded-xl bg-white/5 p-6 ring-1 ring-white/10 transition-all hover:bg-white/10"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-500/20 to-blue-500/20">
                <FileText className="h-6 w-6 text-green-400" />
              </div>
              <div>
                <div className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                  {t("serviceSqlDashboards.related.document.title")}
                </div>
                <div className="text-sm text-gray-400">{t("serviceSqlDashboards.related.document.description")}</div>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

// Import additional icons
import { ChevronDown, Layers, FileText } from "lucide-react";
