// ================================================
// File: src/pages/contact/PricingPage.jsx
// Refactored to Mifu style pricing layout – Algorythmos redesign 2025-12
// Clean, modern pricing page with currency toggle, comparison table, FAQ accordion
// ================================================

import React, { useState, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { track } from "../../app/utils/analytics";
import { withUtm, recordLastCta } from "../../app/utils/utm";
import { useI18n } from "../../app/i18n/I18nContext.jsx";
import { getCanonicalUrl, getOgLocale, generateHreflangLinks, getCanonicalBase } from "../../app/utils/seoHelpers.js";
import SeoBreadcrumbs from "../../app/seo/SeoBreadcrumbs.jsx";

// ================================================
// PRICING DATA MODEL
// ================================================

const PRICING = {
  eur: {
    code: "eur",
    label: "€ EUR",
    symbol: "€",
    starter: 2000,
    growth: 4500,
  },
  aud: {
    code: "aud",
    label: "$ AUD",
    symbol: "$",
    starter: 3300,
    growth: 7400,
  },
};

const CALENDLY_URL = "https://calendly.com/algorythmos-france/30min";

// ================================================
// HELPER: Check icon
// ================================================

function Check({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={`h-5 w-5 ${className}`}>
      <path fill="currentColor" d="M9 16.17l-3.88-3.88a1 1 0 10-1.41 1.41l4.59 4.59a1 1 0 001.41 0l10-10a1 1 0 10-1.41-1.41L9 16.17z" />
    </svg>
  );
}

function ChevronDown({ className = "", rotated = false }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={`h-5 w-5 transition-transform duration-300 ${rotated ? "rotate-180" : ""} ${className}`}
    >
      <path fill="currentColor" d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
    </svg>
  );
}

// ================================================
// CURRENCY TOGGLE
// ================================================

function CurrencyToggle({ currencyCode, onSelect }) {
  return (
    <div className="flex items-center justify-center gap-2">
      <span className="text-sm text-slate-400 mr-2">Currency</span>
      <div className="inline-flex rounded-full bg-slate-800/80 p-1 ring-1 ring-white/10">
        <button
          type="button"
          onClick={() => onSelect("eur")}
          className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${currencyCode === "eur"
              ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg"
              : "text-slate-400 hover:text-white"
            }`}
        >
          € EUR
        </button>
        <button
          type="button"
          onClick={() => onSelect("aud")}
          className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${currencyCode === "aud"
              ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg"
              : "text-slate-400 hover:text-white"
            }`}
        >
          $ AUD
        </button>
      </div>
    </div>
  );
}

// ================================================
// PRICING CARD
// ================================================

function PricingCard({
  title,
  price,
  currencySymbol,
  period,
  description,
  features,
  buttonLabel,
  onButtonClick,
  highlight = false,
  badgeLabel,
}) {
  return (
    <div
      className={`relative rounded-3xl p-8 transition-all duration-300 ease-out
        ${highlight
          ? "bg-gradient-to-b from-violet-900/40 to-slate-900/90 ring-2 ring-violet-500/50"
          : "bg-slate-900/70 ring-1 ring-white/10"
        }
        hover:scale-[1.02] hover:-translate-y-1 hover:shadow-xl hover:shadow-violet-500/20
      `}
    >
      {/* Badge */}
      {badgeLabel && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center px-4 py-1.5 text-xs font-bold rounded-full bg-gradient-to-r from-violet-600 to-purple-600 text-white animate-pulse">
          {badgeLabel}
        </span>
      )}

      {/* Header */}
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-sm text-slate-400">{description}</p>
      </div>

      {/* Price */}
      <div className="text-center mb-8">
        <div className="flex items-baseline justify-center gap-1">
          <span className="text-4xl font-black text-white">{currencySymbol}{price}</span>
          {period && <span className="text-slate-400 text-sm">{period}</span>}
        </div>
      </div>

      {/* Features */}
      <ul className="space-y-3 mb-8">
        {features.map((feature, idx) => (
          <li key={idx} className="flex items-start gap-3 text-sm">
            <Check className="text-emerald-400 flex-shrink-0 mt-0.5" />
            <span className="text-slate-300">{feature}</span>
          </li>
        ))}
      </ul>

      {/* CTA Button */}
      <button
        type="button"
        onClick={onButtonClick}
        className={`w-full py-3 px-6 rounded-xl font-semibold text-white transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-violet-500/40
          ${highlight
            ? "bg-gradient-to-r from-violet-600 via-purple-600 to-violet-600 shadow-lg hover:shadow-xl hover:shadow-violet-500/30"
            : "bg-slate-800 ring-1 ring-white/10 hover:bg-slate-700"
          }
        `}
      >
        {buttonLabel}
      </button>
    </div>
  );
}

// ================================================
// COMPARISON TABLE
// ================================================

function ComparisonTable() {
  const features = [
    { name: "Items per month", starter: "Up to 10k", growth: "Up to 50k", enterprise: "Unlimited" },
    { name: "Environments", starter: "1 (dev or prod)", growth: "Dual + staging", enterprise: "Unlimited" },
    { name: "Support level", starter: "Email", growth: "Priority", enterprise: "Dedicated TAM" },
    { name: "SLA availability", starter: "—", growth: "99.5%", enterprise: "99.9%" },
    { name: "Audit logs", starter: "—", growth: "✓", enterprise: "✓" },
    { name: "Private VPC", starter: "—", growth: "—", enterprise: "✓" },
    { name: "SAML SSO", starter: "—", growth: "Add-on", enterprise: "✓" },
    { name: "Compliance ready", starter: "GDPR", growth: "GDPR + SOC 2", enterprise: "Full suite" },
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-slate-800">
            <th className="py-4 pr-4 font-semibold text-slate-400">Feature</th>
            <th className="py-4 px-4 font-semibold text-white text-center">Starter</th>
            <th className="py-4 px-4 font-semibold text-violet-400 text-center">Growth</th>
            <th className="py-4 pl-4 font-semibold text-white text-center">Enterprise</th>
          </tr>
        </thead>
        <tbody>
          {features.map((row, idx) => (
            <tr key={idx} className="border-b border-slate-800/50">
              <td className="py-4 pr-4 text-slate-300">{row.name}</td>
              <td className="py-4 px-4 text-slate-400 text-center">{row.starter}</td>
              <td className="py-4 px-4 text-slate-200 text-center bg-violet-500/5">{row.growth}</td>
              <td className="py-4 pl-4 text-slate-400 text-center">{row.enterprise}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ================================================
// FAQ ACCORDION
// ================================================

function FAQAccordion({ items }) {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="space-y-4">
      {items.map((item, idx) => {
        const isOpen = openIndex === idx;
        return (
          <div
            key={idx}
            className={`rounded-2xl transition-all duration-300 ${isOpen
                ? "bg-slate-800/60 ring-1 ring-violet-500/30 shadow-lg"
                : "bg-slate-900/60 ring-1 ring-white/5"
              }`}
          >
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : idx)}
              className="w-full flex items-center justify-between p-6 text-left"
            >
              <span className="font-semibold text-white pr-4">{item.question}</span>
              <ChevronDown className="text-slate-400 flex-shrink-0" rotated={isOpen} />
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}
            >
              <div className="px-6 pb-6 text-sm text-slate-300 leading-relaxed">
                {item.answer}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ================================================
// STICKY CTA
// ================================================

function StickyCTA() {
  const calendlyUrl = useMemo(() => {
    return withUtm(CALENDLY_URL, {
      utm_source: "pricing",
      utm_medium: "cta",
      utm_campaign: "discovery",
      utm_content: "sticky_cta",
    });
  }, []);

  return (
    <div className="fixed left-0 right-0 bottom-0 z-40 px-4 pb-4 pointer-events-none">
      <div className="mx-auto max-w-4xl pointer-events-auto">
        <div className="rounded-2xl bg-slate-900/95 backdrop-blur-xl ring-1 ring-white/10 p-4 shadow-2xl">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-sm text-slate-300">Ready to estimate impact?</span>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <a
                href={calendlyUrl}
                target="_blank"
                rel="noreferrer"
                onClick={() => {
                  recordLastCta("sticky_cta");
                  track("click_calendly", { source: "sticky_cta" });
                }}
                className="flex-1 sm:flex-none inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg hover:shadow-violet-500/30 transition-all"
              >
                Book a discovery call
              </a>
              <a
                href="/contact"
                className="flex-1 sm:flex-none inline-flex items-center justify-center rounded-xl bg-slate-800 px-5 py-2.5 text-sm font-semibold text-white ring-1 ring-white/10 hover:bg-slate-700 transition-all"
              >
                Contact us
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ================================================
// MAIN PAGE COMPONENT
// ================================================

export default function PricingPage() {
  const { t, region } = useI18n();

  // SEO helpers
  const canonicalUrl = getCanonicalUrl(region, "/pricing");
  const canonicalBase = getCanonicalBase(region);
  const ogLocale = getOgLocale(region);
  const hreflangLinks = generateHreflangLinks("/pricing");

  // Currency state - default based on region
  const defaultCurrency = region === "AU" ? "aud" : "eur";
  const [currencyCode, setCurrencyCode] = useState(defaultCurrency);
  const currency = PRICING[currencyCode] || PRICING.eur;

  // Calendly URL with UTM
  const calendlyUrl = useMemo(() => {
    return withUtm(CALENDLY_URL, {
      utm_source: "pricing",
      utm_medium: "cta",
      utm_campaign: "discovery",
    });
  }, []);

  // FAQ data
  const faqItems = [
    {
      question: "How does onboarding work?",
      answer: "We start with a discovery call to understand your workflows, then design a pilot scope together. Our engineers deploy within 2–4 weeks, with iterative refinement based on your feedback. You get full documentation and training before handoff.",
    },
    {
      question: "Do you mark up cloud or LLM costs?",
      answer: "No. All infrastructure and API costs are passed through at cost. Our pricing covers engineering, support, and platform access only. You maintain full visibility into your cloud spend.",
    },
    {
      question: "How do you measure accuracy?",
      answer: "We use exact-match and semantic similarity metrics, plus human review sampling. Every deployment includes an accuracy dashboard so you can track performance against your KPIs in real-time.",
    },
    {
      question: "Can you deploy in our cloud?",
      answer: "Yes. We support private VPC deployments on AWS, GCP, or Azure. For highly regulated industries, we also offer fully on-premise setups with air-gapped security.",
    },
    {
      question: "What counts as an 'item'?",
      answer: "An item is one unit processed through the system — for example, one document, one email, one API call, or one chat message. Complex documents with multiple pages still count as one item.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-32">
      {/* SEO Head */}
      <Helmet>
        <title>{t("pricing.meta.title")}</title>
        <meta name="description" content={t("pricing.meta.description")} />
        <link rel="canonical" href={canonicalUrl} />
        {hreflangLinks.map(({ hreflang, href }) => (
          <link key={hreflang} rel="alternate" hreflang={hreflang} href={href} />
        ))}
        <meta property="og:title" content={t("pricing.meta.title")} />
        <meta property="og:description" content={t("pricing.meta.description")} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={`${canonicalBase}/Algorythmos.png`} />
        <meta property="og:site_name" content="Algorythmos" />
        <meta property="og:locale" content={ogLocale} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t("pricing.meta.title")} />
        <meta name="twitter:description" content={t("pricing.meta.description")} />
        <meta name="twitter:image" content={`${canonicalBase}/Algorythmos.png`} />
      </Helmet>

      {/* Breadcrumbs */}
      <SeoBreadcrumbs items={[{ name: "Home", path: "/" }, { name: t("nav.pricing"), path: "/pricing" }]} />

      {/* OfferCatalog JSON-LD */}
      <script type="application/ld+json" suppressHydrationWarning>
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "OfferCatalog",
          "name": "Algorythmos Pricing Plans",
          "itemListElement": [
            {
              "@type": "Offer",
              "name": "Starter",
              "price": "2000",
              "priceCurrency": "EUR",
              "priceSpecification": { "@type": "UnitPriceSpecification", "price": 2000, "priceCurrency": "EUR" },
              "url": `${canonicalUrl}#starter`,
              "availability": "https://schema.org/InStock"
            },
            {
              "@type": "Offer",
              "name": "Growth",
              "price": "4500",
              "priceCurrency": "EUR",
              "priceSpecification": { "@type": "UnitPriceSpecification", "price": 4500, "priceCurrency": "EUR" },
              "url": `${canonicalUrl}#growth`,
              "availability": "https://schema.org/InStock"
            },
            {
              "@type": "Offer",
              "name": "Enterprise",
              "price": "9000",
              "priceCurrency": "EUR",
              "url": `${canonicalUrl}#enterprise`,
              "availability": "https://schema.org/PreOrder"
            }
          ]
        })}
      </script>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 lg:px-0 pt-28 lg:pt-32 space-y-20">

        {/* Hero Section */}
        <section className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-6">
            <span className="bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              Simple, Transparent
            </span>
            <br />
            <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-violet-600 bg-clip-text text-transparent">
              Pricing
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 leading-relaxed">
            Choose a plan that fits your scale. Built for secure AI deployments across France and Australia.
          </p>

          {/* Trust badges */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <span className="rounded-full bg-slate-800/80 px-4 py-1.5 text-xs font-medium text-slate-300 ring-1 ring-white/10">
              GDPR Compliant
            </span>
            <span className="rounded-full bg-slate-800/80 px-4 py-1.5 text-xs font-medium text-slate-300 ring-1 ring-white/10">
              SOC 2 Ready
            </span>
            <span className="rounded-full bg-slate-800/80 px-4 py-1.5 text-xs font-medium text-slate-300 ring-1 ring-white/10">
              EU AI Act Ready
            </span>
          </div>
        </section>

        {/* Currency Toggle */}
        <section className="flex justify-center">
          <CurrencyToggle currencyCode={currencyCode} onSelect={setCurrencyCode} />
        </section>

        {/* Pricing Cards */}
        <section id="plans" className="grid gap-8 md:grid-cols-3">
          {/* Starter */}
          <PricingCard
            title="Starter"
            price={currency.starter.toLocaleString()}
            currencySymbol={currency.symbol}
            period="/mo"
            description="For pilots and small teams"
            features={[
              "Up to 10k items per month",
              "1 environment (dev or prod)",
              "Basic RAG flows",
              "Shared infrastructure",
              "Email support",
            ]}
            buttonLabel="Get started"
            onButtonClick={() => {
              recordLastCta("starter_cta");
              track("click_plan_cta", { plan: "Starter" });
              window.open(calendlyUrl, "_blank");
            }}
          />

          {/* Growth - Highlighted */}
          <PricingCard
            title="Growth"
            price={currency.growth.toLocaleString()}
            currencySymbol={currency.symbol}
            period="/mo"
            description="For growing operations"
            features={[
              "Up to 50k items per month",
              "Dual environment + staging",
              "Audit logs & redaction guardrails",
              "99.5% SLA",
              "Priority support",
            ]}
            buttonLabel="Start scaling"
            onButtonClick={() => {
              recordLastCta("growth_cta");
              track("click_plan_cta", { plan: "Growth" });
              window.open(calendlyUrl, "_blank");
            }}
            highlight={true}
            badgeLabel="Most popular"
          />

          {/* Enterprise */}
          <PricingCard
            title="Enterprise"
            price="Custom"
            currencySymbol=""
            period=""
            description="For regulated & high-volume"
            features={[
              "Unlimited items per month",
              "Private VPC deployment",
              "SAML SSO included",
              "Custom KPIs & reporting",
              "Dedicated technical account manager",
            ]}
            buttonLabel="Contact sales"
            onButtonClick={() => {
              recordLastCta("enterprise_cta");
              track("click_plan_cta", { plan: "Enterprise" });
              window.open(calendlyUrl, "_blank");
            }}
          />
        </section>

        {/* VAT Note */}
        <p className="text-center text-xs text-slate-500">
          All prices exclude VAT. Billed monthly. Cancel anytime.
        </p>

        {/* Comparison Table */}
        <section>
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">Compare plans</h2>
          <div className="rounded-2xl bg-slate-900/60 ring-1 ring-white/10 p-6 md:p-8">
            <ComparisonTable />
          </div>
        </section>

        {/* FAQ Section */}
        <section>
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">Frequently asked questions</h2>
          <div className="max-w-3xl mx-auto">
            <FAQAccordion items={faqItems} />
          </div>
        </section>

      </main>

      {/* Sticky CTA */}
      <StickyCTA />
    </div>
  );
}
