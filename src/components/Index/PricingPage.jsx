// ================================================
// File: src/components/Index/PricingPage.jsx
// Description: Brand-skinned Pricing page that embeds the
// ROI (Return On Investment) calculator and shows tier cards.
// Tailwind CSS only. Acronyms shown with full forms in UI.
// ================================================

import React, { useEffect } from "react";
import AlgorythmosCalculator from "../AlgorythmosCalculator";

const Check = (props) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className={`h-5 w-5 ${props.className || ""}`}>
    <path fill="currentColor" d="M9 16.17l-3.88-3.88a1 1 0 10-1.41 1.41l4.59 4.59a1 1 0 001.41 0l10-10a1 1 0 10-1.41-1.41L9 16.17z"/>
  </svg>
);

const CALENDLY_URL = "https://calendly.com/algorythmos-france/30min";

function StickyCTA(){
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-6xl px-4 pb-4"
      aria-label="Sticky Call To Action to book a meeting"
    >
      <div className="rounded-2xl bg-slate-900/90 backdrop-blur ring-1 ring-white/10 p-3 shadow-brand">
        <div className="flex flex-col items-start gap-3 md:flex-row md:items-center md:justify-between">
          <div className="text-sm text-slate-300">
            Ready to estimate impact? Book a 30-min discovery. We'll review ROI (Return On Investment), accuracy targets, and deployment options.
          </div>
          <div className="flex items-center gap-3">
            <a
              href={CALENDLY_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center rounded-xl bg-gradient-to-r from-[#6D00FF] via-[#7658E7] to-[#3715E0] px-4 py-2 text-sm font-semibold text-white shadow-brand focus:outline-none focus:ring-4 focus:ring-violet-500/40"
            >
              Book on Calendly
            </a>
            <a
              href="#calculator"
              className="inline-flex items-center rounded-xl bg-slate-800/80 px-4 py-2 text-sm font-semibold ring-1 ring-white/10"
            >
              Open calculator
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PricingPage(){
  useEffect(() => {
    if (window.location.hash) {
      const el = document.querySelector(window.location.hash);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-24">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#6D00FF] via-[#7658E7] to-[#3715E0] opacity-20"/>
        <div className="mx-auto max-w-6xl px-4 py-16">
          <div className="rounded-3xl bg-slate-900/60 ring-1 ring-white/10 p-8 md:p-12 shadow-[0_10px_40px_-10px_rgba(109,0,255,0.55)]">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
              Pricing that scales with your impact
            </h1>
            <p className="mt-3 max-w-2xl text-slate-300">
              Transparent tiers and a live calculator to estimate your ROI (Return On Investment),
              payback, and total cost. Built for secure AI (Artificial Intelligence) rollouts: RBAC (Role-Based Access Control),
              PII (Personally Identifiable Information) redaction, GDPR (General Data Protection Regulation) alignment.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3 text-xs text-slate-400">
              <span className="rounded-full bg-slate-800/80 px-3 py-1 ring-1 ring-white/10">SLA (Service-Level Agreement) options</span>
              <span className="rounded-full bg-slate-800/80 px-3 py-1 ring-1 ring-white/10">Audit logs</span>
              <span className="rounded-full bg-slate-800/80 px-3 py-1 ring-1 ring-white/10">SOC2-ready processes</span>
              <span className="rounded-full bg-slate-800/80 px-3 py-1 ring-1 ring-white/10">API (Application Programming Interface) access</span>
            </div>
            <div className="mt-6 rounded-2xl bg-slate-900/70 ring-1 ring-white/10 p-4">
              <div className="mb-3 text-sm text-slate-300">
                Quick glance — TMC (Total Monthly Cost) estimates*
              </div>
              <div className="grid gap-3 md:grid-cols-3 text-sm">
                <div className="rounded-xl border border-slate-800 p-4">
                  <div className="font-semibold">Internal Build</div>
                  <div className="text-slate-400">Amortized build + maintenance</div>
                  <div className="mt-1 text-xl font-bold">≈ €{Math.round((120000/6) + (120000*0.18/12) + 2000)}</div>
                </div>
                <div className="rounded-xl border border-slate-800 p-4">
                  <div className="font-semibold">Traditional Agency</div>
                  <div className="text-slate-400">Retainer + run</div>
                  <div className="mt-1 text-xl font-bold">≈ €{Math.round(12000 + 1000 + 30000/6)}</div>
                </div>
                <div className="rounded-xl border border-slate-800 p-4">
                  <div className="font-semibold">Algorythmos</div>
                  <div className="text-slate-400">Fee + AI (Artificial Intelligence) run</div>
                  <div className="mt-1 text-xl font-bold">From €4,500 + run</div>
                </div>
              </div>
              <div className="mt-3 text-xs text-slate-500">*Illustrative only. Use the calculator below for ROI (Return On Investment) and payback.</div>
              <div className="mt-4">
                <a href="#calculator" className="inline-flex items-center rounded-xl bg-gradient-to-r from-[#6D00FF] via-[#7658E7] to-[#3715E0] px-4 py-2 text-sm font-semibold shadow-brand">
                  See full breakdown
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
              name: "Starter",
              price: "€2,000",
              period: "/mo",
              highlight: "For pilots and small teams",
              features: [
                "Up to 10k items/mo",
                "1 environment (dev/prod)",
                "Basic RAG (Retrieval-Augmented Generation)",
                "Email support (24–48h)",
              ],
              cta: "Start a pilot",
            },
            {
              name: "Growth",
              price: "€4,500",
              period: "/mo",
              highlight: "Most popular",
              features: [
                "Up to 50k items/mo",
                "Dual env + staging",
                "Advanced guardrails + redaction",
                "SLA (Service-Level Agreement) 99.5%",
                "Priority support (same business day)",
              ],
              cta: "Scale operations",
              popular: true,
            },
            {
              name: "Scale",
              price: "Custom",
              period: "",
              highlight: "For regulated & high-volume",
              features: [
                "> 50k items/mo",
                "Private VPC (Virtual Private Cloud)",
                "SAML SSO (Security Assertion Markup Language – Single Sign-On)",
                "Custom KPIs (Key Performance Indicators) & reporting",
                "Dedicated TAM (Technical Account Manager)",
              ],
              cta: "Talk to sales",
            },
          ].map((t) => (
            <div key={t.name} className={`relative rounded-3xl border p-6 shadow-2xl ${t.popular ? "border-violet-500/50 bg-slate-900/70" : "border-slate-800 bg-slate-900/60"}`}>
              {t.popular && (
                <div className="absolute -top-3 left-6 rounded-full bg-gradient-to-r from-[#6D00FF] to-[#3715E0] px-3 py-1 text-xs font-semibold">Popular</div>
              )}
              <div className="text-sm text-slate-400">{t.highlight}</div>
              <div className="mt-1 flex items-end gap-1">
                <div className="text-3xl font-bold">{t.price}</div>
                <div className="pb-1 text-slate-400">{t.period}</div>
              </div>
              <div className="mt-4 h-px bg-slate-800" />
              <ul className="mt-4 space-y-2 text-sm">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <span className="text-emerald-400"><Check/></span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <button className="mt-6 w-full rounded-xl bg-gradient-to-r from-[#6D00FF] via-[#7658E7] to-[#3715E0] px-4 py-2 font-semibold text-white shadow-lg transition hover:scale-[1.01] focus:outline-none focus:ring-4 focus:ring-violet-500/40">
                {t.cta}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Calculator */}
      <section id="calculator" className="mx-auto max-w-6xl px-4 py-10 scroll-mt-24 md:scroll-mt-28">
        <div className="rounded-3xl bg-gradient-to-br from-[#6D00FF] via-[#7658E7] to-[#3715E0] p-[2px] shadow-[0_10px_40px_-10px_rgba(55,21,224,0.55)]">
          <div className="rounded-3xl bg-slate-900 p-6 md:p-8">
            <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Calculate your savings</h2>
                <p className="mt-1 text-sm text-slate-300">Use the model to estimate monthly savings, ROI (Return On Investment), and payback. Adjust inputs to match your workload.</p>
              </div>
              <a href="#contact" className="mt-3 inline-flex items-center justify-center rounded-xl bg-slate-800/80 px-4 py-2 text-sm font-semibold ring-1 ring-white/10 hover:bg-slate-800">Need help? Book a consult</a>
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
            <h3 className="text-lg font-semibold">How do you measure accuracy?</h3>
            <p className="mt-2 text-sm text-slate-300">We track exact-match and semantic-match metrics on sampled outputs. For regulated flows, we add human review until targets are consistently above the agreed KPI (Key Performance Indicator).</p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
            <h3 className="text-lg font-semibold">Can you deploy in our cloud?</h3>
            <p className="mt-2 text-sm text-slate-300">Yes — private VPC (Virtual Private Cloud) with customer-managed keys. We support SSO (Single Sign-On) via SAML (Security Assertion Markup Language) and granular RBAC (Role-Based Access Control).</p>
          </div>
        </div>
      </section>

      {/* Sticky CTA */}
      <StickyCTA />
    </div>
  );
}
