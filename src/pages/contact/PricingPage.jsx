// ================================================
// File: src/pages/contact/PricingPage.jsx
// Description: Brand-skinned Pricing page that embeds the
// ROI (Return On Investment) calculator and shows tier cards.
// Tailwind CSS only. Acronyms shown with full forms in UI.
// ================================================

import React, { useEffect, useState, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { track } from "../../app/utils/analytics";
import { withUtm, persistUtmFromLocation, readStoredUtm, recordLastCta } from "../../app/utils/utm";
import { useI18n } from "../../app/i18n/I18nContext.jsx";
import AlgorythmosCalculator from "../../components/charts/AlgorythmosCalculator";

const Check = (props) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className={`h-5 w-5 ${props.className || ""}`}>
    <path fill="currentColor" d="M9 16.17l-3.88-3.88a1 1 0 10-1.41 1.41l4.59 4.59a1 1 0 001.41 0l10-10a1 1 0 10-1.41-1.41L9 16.17z"/>
  </svg>
);

const CALENDLY_URL = "https://calendly.com/algorythmos-france/30min";

function InfoTip({ t }) {
  const tipId = "tmc-tip";
  const [open, setOpen] = useState(false);

  return (
    <div className="relative inline-block">
      <button
        type="button"
        aria-label={t("pricing.tooltip.title")}
        aria-expanded={open}
        aria-controls={tipId}
        aria-describedby={open ? tipId : undefined}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onClick={() => {
          setOpen((v) => !v);
          if (!open) track("tooltip_open", { tooltip: "tmc_comparison" });
        }} // mobile tap support
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
        className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-slate-800 text-slate-300 ring-1 ring-white/10 text-[11px] font-semibold"
        title={t("pricing.tooltip.title")}
      >
        i
      </button>

      {open && (
        <div
          role="tooltip"
          id={tipId}
          className="absolute z-50 mt-2 w-80 max-w-[80vw] right-0 rounded-2xl bg-slate-900/95 p-4 text-xs text-slate-200 ring-1 ring-white/10 shadow-xl"
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
        >
          <div className="text-[11px] font-semibold text-slate-100">
            {t("pricing.tooltip.title")}
          </div>
          <ul className="mt-2 space-y-1 leading-relaxed">
            <li>
              <span className="font-semibold">{t("pricing.tooltip.diy.label")}</span>: {t("pricing.tooltip.diy.detail")}
              <span className="font-semibold"> {t("pricing.tooltip.diy.cost")}</span>.
            </li>
            <li>
              <span className="font-semibold">{t("pricing.tooltip.agency.label")}</span>:
              {" "}{t("pricing.tooltip.agency.detail")}
              <span className="font-semibold"> {t("pricing.tooltip.agency.cost")}</span>.
            </li>
            <li>
              <span className="font-semibold">{t("pricing.tooltip.algorythmos.label")}</span>:
              {" "}{t("pricing.tooltip.algorythmos.detail")}.
            </li>
          </ul>
          <p className="mt-2 text-[11px] text-slate-400">
            {t("pricing.tooltip.footnote")}
          </p>
        </div>
      )}
    </div>
  );
}

function StickyCTA({ t }){
  const calendlyUrl = useMemo(() => {
    return withUtm(CALENDLY_URL, {
      utm_source: "pricing",
      utm_medium: "cta",
      utm_campaign: "discovery",
      utm_content: "sticky_cta",
    });
  }, []);
  return (
    <div
      className="fixed left-0 right-0 bottom-0 z-40 px-3 pb-3 sm:px-4 sm:pb-4 pointer-events-none"
      aria-label="Sticky Call To Action to book a meeting"
    >
      <div className="mx-auto max-w-screen-sm sm:max-w-6xl pointer-events-auto">
        <div
          className="rounded-2xl bg-slate-900/90 backdrop-blur ring-1 ring-white/10 p-3 shadow-brand safe-px safe-pb"
        >
          <div className="flex flex-col items-start gap-3 md:flex-row md:items-center md:justify-between">
            <div className="text-sm text-slate-300">
              {t("pricing.stickyCta.text")}
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
              <a
                href={calendlyUrl}
                target="_blank"
                rel="noreferrer"
                onClick={() => {
                  recordLastCta("sticky_cta");
                  track("click_calendly", { source: "sticky_cta" });
                }}
                className="flex-1 md:flex-none inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[#6D00FF] via-[#7658E7] to-[#3715E0] px-4 py-2 text-sm font-semibold text-white shadow-brand focus:outline-none focus:ring-4 focus:ring-violet-500/40"
                aria-label={t("pricing.stickyCta.bookCalendly")}
              >
                {t("pricing.stickyCta.bookCalendly")}
              </a>
              <a
                href="#calculator"
                onClick={() => track("click_open_calculator", { source: "sticky_cta" })}
                className="flex-1 md:flex-none inline-flex items-center justify-center rounded-xl bg-slate-800/80 px-4 py-2 text-sm font-semibold ring-1 ring-white/10"
              >
                {t("pricing.stickyCta.openCalculator")}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PricingPage(){
  const { t, region } = useI18n();
  
  useEffect(() => {
    // Capture UTMs on initial render
    persistUtmFromLocation();
    const utm = readStoredUtm();
    track("page_view", { page: "pricing", ...utm });
    if (window.location.hash) {
      const el = document.querySelector(window.location.hash);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  // Add canonical tag to avoid SEO duplicates from UTM'd URLs
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "canonical";
    link.href = "https://www.algorythmos.fr/pricing";
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-24">
      <Helmet>
        <title>{t("pricing.meta.title")}</title>
        <meta name="description" content={t("pricing.meta.description")} />
        <meta property="og:title" content={t("pricing.meta.title")} />
        <meta property="og:description" content={t("pricing.meta.description")} />
        <meta property="og:locale" content={region === "FR" ? "fr_FR" : "en_US"} />
      </Helmet>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#6D00FF] via-[#7658E7] to-[#3715E0] opacity-20"/>
        <div className="mx-auto max-w-6xl px-4 py-16">
          <div className="rounded-3xl bg-slate-900/60 ring-1 ring-white/10 p-8 md:p-12 shadow-[0_10px_40px_-10px_rgba(109,0,255,0.55)]">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
              {t("pricing.hero.title")}
            </h1>
            <p className="mt-3 max-w-2xl text-slate-300">
              {t("pricing.hero.subtitle")}
            </p>

            {/* SEO: Organization + Offers schema */}
            <script type="application/ld+json" suppressHydrationWarning>
              {JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Organization",
                "name": "Algorythmos",
                "url": "https://www.algorythmos.fr",
                "logo": "https://www.algorythmos.fr/favicon.ico",
                "description": "Boutique AI & Data Science consultancy delivering secure, ROI-driven automation, document intelligence, dashboards, and MLOps.",
                "sameAs": [
                  "https://www.linkedin.com/company/algorythmos",
                  "https://x.com/algorythmos",
                  "https://github.com/algorythmos"
                ],
                "makesOffer": [
                  {
                    "@type": "Offer",
                    "name": "Pilot",
                    "price": "2000",
                    "priceCurrency": "EUR",
                    "priceSpecification": { "@type": "UnitPriceSpecification", "price": 2000, "priceCurrency": "EUR" },
                    "url": "https://www.algorythmos.fr/pricing#pilot",
                    "availability": "https://schema.org/InStock"
                  },
                  {
                    "@type": "Offer",
                    "name": "Operations",
                    "price": "4500",
                    "priceCurrency": "EUR",
                    "priceSpecification": { "@type": "UnitPriceSpecification", "price": 4500, "priceCurrency": "EUR" },
                    "url": "https://www.algorythmos.fr/pricing#operations",
                    "availability": "https://schema.org/InStock"
                  },
                  {
                    "@type": "Offer",
                    "name": "Custom",
                    "price": "9000",
                    "priceCurrency": "EUR",
                    "url": "https://www.algorythmos.fr/pricing#custom",
                    "availability": "https://schema.org/PreOrder"
                  }
                ]
              })}
            </script>

            <div className="mt-6 flex flex-wrap items-center gap-3 text-xs text-slate-400">
              <span className="rounded-full bg-slate-800/80 px-3 py-1 ring-1 ring-white/10">{t("pricing.hero.badges.sla")}</span>
              <span className="rounded-full bg-slate-800/80 px-3 py-1 ring-1 ring-white/10">{t("pricing.hero.badges.audit")}</span>
              <span className="rounded-full bg-slate-800/80 px-3 py-1 ring-1 ring-white/10">{t("pricing.hero.badges.soc2")}</span>
              <span className="rounded-full bg-slate-800/80 px-3 py-1 ring-1 ring-white/10">{t("pricing.hero.badges.api")}</span>
            </div>
            <div className="mt-6 rounded-2xl bg-slate-900/70 ring-1 ring-white/10 p-4">
              <div className="mb-3 text-sm text-slate-300 flex items-center">
                <span>{t("pricing.hero.glance.title")}</span>
                <InfoTip t={t} />
              </div>
              <div className="grid gap-3 md:grid-cols-3 text-sm">
                <div className="rounded-xl border border-slate-800 p-4">
                  <div className="font-semibold">{t("pricing.hero.glance.internal.title")}</div>
                  <div className="text-slate-400">{t("pricing.hero.glance.internal.subtitle")}</div>
                  <div className="mt-1 text-xl font-bold">≈ €{Math.round((120000/6) + (120000*0.18/12) + 2000)}</div>
                </div>
                <div className="rounded-xl border border-slate-800 p-4">
                  <div className="font-semibold">{t("pricing.hero.glance.agency.title")}</div>
                  <div className="text-slate-400">{t("pricing.hero.glance.agency.subtitle")}</div>
                  <div className="mt-1 text-xl font-bold">≈ €{Math.round(12000 + 1000 + 30000/6)}</div>
                </div>
                <div className="rounded-xl border border-slate-800 p-4">
                  <div className="font-semibold">{t("pricing.hero.glance.algorythmos.title")}</div>
                  <div className="text-slate-400">{t("pricing.hero.glance.algorythmos.subtitle")}</div>
                  <div className="mt-1 text-xl font-bold">{t("pricing.hero.glance.algorythmos.price")}</div>
                </div>
              </div>
              <div className="mt-3 text-xs text-slate-500">{t("pricing.hero.glance.footnote")}</div>
              <div className="mt-4">
                <a href="#calculator" className="inline-flex items-center rounded-xl bg-gradient-to-r from-[#6D00FF] via-[#7658E7] to-[#3715E0] px-4 py-2 text-sm font-semibold shadow-brand">
                  {t("pricing.hero.glance.cta")}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tiers */}
      <section className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              name: t("pricing.tiers.pilot.name"),
              price: t("pricing.tiers.pilot.price"),
              period: t("pricing.tiers.pilot.period"),
              highlight: t("pricing.tiers.pilot.highlight"),
              features: [
                t("pricing.tiers.pilot.features.0"),
                t("pricing.tiers.pilot.features.1"),
                t("pricing.tiers.pilot.features.2"),
                t("pricing.tiers.pilot.features.3"),
                t("pricing.tiers.pilot.features.4"),
                t("pricing.tiers.pilot.features.5"),
              ],
              cta: t("pricing.tiers.pilot.cta"),
              id: "pilot"
            },
            {
              name: t("pricing.tiers.operations.name"),
              price: t("pricing.tiers.operations.price"),
              period: t("pricing.tiers.operations.period"),
              highlight: t("pricing.tiers.operations.highlight"),
              badge: t("pricing.tiers.operations.badge"),
              features: [
                t("pricing.tiers.operations.features.0"),
                t("pricing.tiers.operations.features.1"),
                t("pricing.tiers.operations.features.2"),
                t("pricing.tiers.operations.features.3"),
                t("pricing.tiers.operations.features.4"),
              ],
              cta: t("pricing.tiers.operations.cta"),
              popular: true,
              id: "operations"
            },
            {
              name: t("pricing.tiers.custom.name"),
              price: t("pricing.tiers.custom.price"),
              period: t("pricing.tiers.custom.period"),
              highlight: t("pricing.tiers.custom.highlight"),
              features: [
                t("pricing.tiers.custom.features.0"),
                t("pricing.tiers.custom.features.1"),
                t("pricing.tiers.custom.features.2"),
                t("pricing.tiers.custom.features.3"),
                t("pricing.tiers.custom.features.4"),
              ],
              cta: t("pricing.tiers.custom.cta"),
              id: "custom"
            },
          ].map((tier) => (
            <div
              key={tier.name}
              className={`relative rounded-3xl border p-6 shadow-2xl ${
                tier.popular
                  ? "border-violet-500/50 bg-slate-900/70"
                  : "border-slate-800 bg-slate-900/60"
              }`}
              id={tier.id ? tier.id : undefined}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-6 rounded-full bg-gradient-to-r from-[#6D00FF] to-[#3715E0] px-3 py-1 text-xs font-semibold">{tier.badge}</div>
              )}
              <div className="text-sm text-slate-400">{tier.highlight}</div>
              <div className="mt-1 flex items-end gap-1">
                <div className="text-3xl font-bold">{tier.price}</div>
                <div className="pb-1 text-slate-400">{tier.period}</div>
              </div>
              <div className="mt-4 h-px bg-slate-800" />
              <ul className="mt-4 space-y-2 text-sm">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <span className="text-emerald-400"><Check/></span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <button
                className="mt-6 w-full rounded-xl bg-gradient-to-r from-[#6D00FF] via-[#7658E7] to-[#3715E0] px-4 py-2 font-semibold text-white shadow-lg transition hover:scale-[1.01] focus:outline-none focus:ring-4 focus:ring-violet-500/40"
                aria-label={`${tier.cta} for ${tier.name}`}
                onClick={() => {
                  const id = `${tier.name.toLowerCase()}_cta`.replace(/\s+/g, "_");
                  recordLastCta(id);
                  track("click_plan_cta", { plan: tier.name, utm_content: id });
                }}
              >
                {tier.cta}
              </button>
            </div>
          ))}
        </div>

        {/* Pricing note */}
        <p className="mt-4 text-xs text-slate-500">
          {t("pricing.notes.vatExcluded")}
        </p>
        
        <div className="mt-4 space-y-1 text-xs text-slate-400">
          <p>
            <span className="font-semibold">{t("pricing.notes.definitionsLabel")}</span>{" "}
            {t("pricing.notes.itemDef")}{" "}
            {t("pricing.notes.runDef")}
          </p>
          <p>
            <span className="font-semibold">{t("pricing.notes.addonsLabel")}</span>{" "}
            {t("pricing.notes.addonSso")} ·{" "}
            {t("pricing.notes.addonVpc")} ·{" "}
            {t("pricing.notes.addonTam")}.{" "}
            {t("pricing.notes.referenceLabel")}{" "}
            <a
              href="https://www.vantage.sh/pricing"
              target="_blank"
              rel="noreferrer"
              className="underline decoration-slate-600 hover:decoration-slate-300"
              aria-label="Open Vantage pricing in a new tab"
            >
              Vantage
            </a>{" "}
            ·{" "}
            <a
              href="https://weaviate.io/pricing"
              target="_blank"
              rel="noreferrer"
              className="underline decoration-slate-600 hover:decoration-slate-300"
              aria-label="Open Weaviate pricing in a new tab"
            >
              Weaviate
            </a>{" "}
            ·{" "}
            <a
              href="https://auth0.com/pricing"
              target="_blank"
              rel="noreferrer"
              className="underline decoration-slate-600 hover:decoration-slate-300"
              aria-label="Open Auth0 pricing in a new tab"
            >
              Auth0
            </a>
          </p>
          <p>
            <span className="font-semibold">{t("pricing.notes.billingLabel")}</span>{" "}
            {t("pricing.notes.billingDetail")}
          </p>
        </div>
      </section>

      {/* Calculator */}
      <section id="calculator" className="mx-auto max-w-6xl px-4 py-10 scroll-mt-24 md:scroll-mt-28">
        <div className="rounded-3xl bg-gradient-to-br from-[#6D00FF] via-[#7658E7] to-[#3715E0] p-[2px] shadow-[0_10px_40px_-10px_rgba(55,21,224,0.55)]">
          <div className="rounded-3xl bg-slate-900 p-6 md:p-8">
            <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">{t("pricing.calculator.title")}</h2>
                <p className="mt-1 text-sm text-slate-300">{t("pricing.calculator.subtitle")}</p>
              </div>
              <a
                href="#contact"
                onClick={() => track("click_contact_from_calculator")}
                className="mt-3 inline-flex items-center justify-center rounded-xl bg-slate-800/80 px-4 py-2 text-sm font-semibold ring-1 ring-white/10 hover:bg-slate-800"
              >
                {t("pricing.calculator.helpCta")}
              </a>
            </div>
            <div className="mt-6">
              <AlgorythmosCalculator />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ (short) */}
      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
            <h3 className="text-lg font-semibold">{t("pricing.faq.0.question")}</h3>
            <p className="mt-2 text-sm text-slate-300">
              {t("pricing.faq.0.answer")}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
            <h3 className="text-lg font-semibold">{t("pricing.faq.1.question")}</h3>
            <p className="mt-2 text-sm text-slate-300">
              {t("pricing.faq.1.answer")}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
            <h3 className="text-lg font-semibold">{t("pricing.faq.2.question")}</h3>
            <p className="mt-2 text-sm text-slate-300">
              {t("pricing.faq.2.answer")}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
            <h3 className="text-lg font-semibold">{t("pricing.faq.3.question")}</h3>
            <p className="mt-2 text-sm text-slate-300">
              {t("pricing.faq.3.answer")}
            </p>
          </div>
        </div>
      </section>

      {/* Sticky CTA */}
      <StickyCTA t={t} />
    </div>
  );
}
