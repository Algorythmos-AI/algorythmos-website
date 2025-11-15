// /src/components/Index/services/SqlDashboardsPage.jsx
import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { BarChart3, ArrowRight, CheckCircle, TrendingUp, Database, Users, Gauge, Bell, LineChart } from "lucide-react";
import { withUtm } from "../../../lib/utm";

const CALENDLY_URL = "https://calendly.com/algorythmos-france/30min";

export default function SqlDashboardsPage() {
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
        <title>SQL Dashboards & Analytics | Algorythmos™</title>
        <meta
          name="description"
          content="Unified metrics and AI-assisted insights on modern SQL stacks. Modeled data, executive-ready dashboards with alerts, RBAC, and self-serve analytics for data-driven decisions."
        />
        <link rel="canonical" href="https://www.algorythmos.fr/services/sql-dashboards" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="SQL Dashboards & Analytics | Algorythmos™" />
        <meta property="og:description" content="Unified metrics and AI-assisted insights on modern SQL stacks. Modeled data, executive-ready dashboards with alerts, RBAC, and self-serve analytics for data-driven decisions." />
        <meta property="og:url" content="https://www.algorythmos.fr/services/sql-dashboards" />
        <meta property="og:image" content="https://www.algorythmos.fr/Algorythmos.png" />
        <meta property="og:site_name" content="Algorythmos" />
        <meta property="og:locale" content="en_US" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="SQL Dashboards & Analytics | Algorythmos™" />
        <meta name="twitter:description" content="Unified metrics and AI-assisted insights on modern SQL stacks. Modeled data, executive-ready dashboards with alerts, RBAC, and self-serve analytics for data-driven decisions." />
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
            "areaServed": "Europe"
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
              Services
            </Link>
            <span className="mx-2">/</span>
            <span className="text-white">SQL Dashboards & Analytics</span>
          </nav>

          {/* Icon & Badge */}
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500/20 to-yellow-500/20 ring-1 ring-white/10">
              <BarChart3 className="h-8 w-8 text-orange-400" />
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-orange-500/10 px-4 py-1.5 text-xs font-semibold text-orange-400 ring-1 ring-orange-500/20">
              <TrendingUp className="h-3 w-3" />
              Data-Driven Decisions
            </div>
          </div>

          {/* Title */}
          <h1 className="mb-6 text-4xl md:text-6xl font-black leading-tight">
            <span className="bg-gradient-to-r from-orange-400 via-yellow-400 to-red-400 bg-clip-text text-transparent">
              SQL Dashboards & Analytics
            </span>
            <br />
            <span className="text-white">
              for SME Leaders
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mb-8 max-w-3xl text-lg md:text-xl text-gray-300 leading-relaxed">
            A single source of truth powered by modeled data and executive-ready dashboards. Track operations KPIs, finance metrics, and support SLAs with role-based access, proactive alerts, and self-serve analytics.
          </p>

          {/* Key Points */}
          <div className="mb-10 grid md:grid-cols-3 gap-4 max-w-3xl">
            {[
              { icon: Database, text: "Modeled metrics & dimensions" },
              { icon: Gauge, text: "Fast, reliable dashboards" },
              { icon: Bell, text: "Proactive alerts & anomaly detection" }
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
              Explore a Demo
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
      <section className="border-y border-white/10 bg-gradient-to-r from-orange-500/5 to-yellow-500/5 py-12 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-4xl font-black bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent mb-2">
              5x
            </div>
            <div className="text-sm text-gray-400">Faster decision-making with trusted KPIs</div>
          </div>
          <div>
            <div className="text-4xl font-black bg-gradient-to-r from-yellow-400 to-red-400 bg-clip-text text-transparent mb-2">
              Self-Serve
            </div>
            <div className="text-sm text-gray-400">Analytics for all teams, not just data experts</div>
          </div>
          <div>
            <div className="text-4xl font-black bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent mb-2">
              One Truth
            </div>
            <div className="text-sm text-gray-400">Cross-team alignment on definitions</div>
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
              SQL-based dashboards give SME leaders a unified view of their business: operations KPIs, finance metrics, customer health, support SLAs, and more—all powered by a single, modeled data layer.
            </p>
            <p>
              No more spreadsheet hell or conflicting numbers across departments. One source of truth, accessible to everyone with role-based permissions, proactive alerts for anomalies, and self-serve exploration for power users.
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
              <h3 className="text-xl font-bold text-orange-400 mb-3 flex items-center gap-2">
                <Database className="h-5 w-5" />
                Data Modeling & Metric Definitions
              </h3>
              <p className="text-gray-300 leading-relaxed">
                We build semantic models (using dbt or similar) that define metrics, dimensions, and business logic once. This ensures consistent calculations across all dashboards and reports.
              </p>
            </div>

            <div className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/10">
              <h3 className="text-xl font-bold text-yellow-400 mb-3 flex items-center gap-2">
                <LineChart className="h-5 w-5" />
                Executive-Ready Dashboards
              </h3>
              <p className="text-gray-300 leading-relaxed">
                Performant, beautiful dashboards using modern BI tools (Metabase, Lightdash, Looker, or custom). Optimized for fast queries and interactive exploration—no waiting for data refreshes.
              </p>
            </div>

            <div className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/10">
              <h3 className="text-xl font-bold text-red-400 mb-3 flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Alerts & Anomaly Detection
              </h3>
              <p className="text-gray-300 leading-relaxed">
                Set thresholds and anomaly detection rules. Get notified in Slack or email when KPIs deviate—catch issues before they become crises.
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
                title: "Operations KPIs", 
                desc: "Order volumes, fulfillment rates, inventory turnover, supplier performance—track operational health in real-time.",
                icon: Gauge
              },
              { 
                title: "Finance Dashboards", 
                desc: "Revenue, burn rate, ARR/MRR, cash flow forecasts, and P&L breakdowns. Close the books faster with automated metrics.",
                icon: TrendingUp
              },
              { 
                title: "Customer Health & Support SLAs", 
                desc: "Ticket resolution times, CSAT scores, churn risk indicators, and product usage analytics. Keep customers happy.",
                icon: Users
              },
              { 
                title: "Self-Serve Analytics for Teams", 
                desc: "Empower non-technical teams to explore data, create custom views, and answer their own questions without SQL knowledge.",
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
            Business Impact
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { title: "Faster decisions with trusted KPIs", desc: "Stop debating which numbers are correct. Make decisions based on a single source of truth." },
              { title: "Self-serve analytics", desc: "Empower teams to answer their own questions without waiting for the data team." },
              { title: "Cross-team alignment", desc: "Everyone uses the same metric definitions—no more conflicts between finance, ops, and product." },
              { title: "Proactive issue detection", desc: "Anomaly detection and alerts catch problems early, before they impact the business." }
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
            Tech Stack & Compatibility
          </h2>
          <div className="rounded-2xl bg-gradient-to-br from-slate-900/50 to-slate-800/30 p-8 ring-1 ring-white/10">
            <div className="space-y-4 text-gray-300">
              <div>
                <h3 className="font-bold text-orange-400 mb-2">Data Warehouses</h3>
                <p className="text-sm">Snowflake, BigQuery, Redshift, Postgres, ClickHouse, DuckDB</p>
              </div>
              <div>
                <h3 className="font-bold text-yellow-400 mb-2">BI Tools</h3>
                <p className="text-sm">Metabase, Lightdash, Looker, Tableau, Power BI, or custom React dashboards</p>
              </div>
              <div>
                <h3 className="font-bold text-red-400 mb-2">Modeling Layer</h3>
                <p className="text-sm">dbt for semantic modeling, version control, and lineage</p>
              </div>
              <div>
                <h3 className="font-bold text-blue-400 mb-2">Alerts & Monitoring</h3>
                <p className="text-sm">Slack, email, PagerDuty integration with custom anomaly detection rules</p>
              </div>
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
                q: "Which data warehouses do you support?",
                a: "We work with Snowflake, BigQuery, Redshift, Postgres, and other modern SQL engines. We can also help migrate from legacy systems."
              },
              {
                q: "Do I need a data team to maintain this?",
                a: "Not necessarily. We design models and dashboards that are self-documenting and easy to update. We also offer managed services if you prefer."
              },
              {
                q: "Can non-technical users explore the data?",
                a: "Absolutely. Modern BI tools provide intuitive interfaces for filtering, drilling down, and creating custom views—no SQL required."
              },
              {
                q: "How do you ensure data quality?",
                a: "We implement data validation tests, lineage tracking, and automated alerts for schema changes or anomalies. dbt tests run on every transformation."
              },
              {
                q: "What about real-time dashboards?",
                a: "We can build near-real-time dashboards using streaming pipelines (Kafka, Kinesis) and incremental models. Talk to us about your latency requirements."
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
            Ready to Make Data-Driven Decisions?
          </h2>
          <p className="mb-8 text-lg text-gray-300">
            Let's design a dashboard and analytics stack that gives your team the insights they need to move fast.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href={contactUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-600 to-yellow-600 px-8 py-4 font-semibold text-white shadow-lg shadow-orange-500/25 transition-all hover:shadow-xl hover:shadow-orange-500/40 hover:-translate-y-0.5"
            >
              Explore a Demo
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
          </div>
        </div>
      </section>
    </div>
  );
}

// Import additional icons
import { ChevronDown, Layers, FileText } from "lucide-react";
