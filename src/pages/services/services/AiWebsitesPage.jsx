// /src/pages/services/services/AiWebsitesPage.jsx
// AI Agents: read /docs/AI_AGENT_WORKFLOW.md before editing this file.
// This ensures EN/FR translation consistency and SEO correctness.
import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
    Globe, ArrowRight, CheckCircle, Zap, Shield, Code,
    MessageSquare, Mic, Users, Database, Search, Smartphone,
    Languages, Server, ChevronDown, Bot, BarChart3
} from "lucide-react";
import { withUtm } from "../../../app/utils/utm";
import { useI18n } from "../../../app/i18n/I18nContext.jsx";
import { getCanonicalUrl, getOgLocale, generateHreflangLinks, getCanonicalBase } from "../../../app/utils/seoHelpers.js";
import LocalizedCTA from "../../../components/ui/LocalizedCTA.jsx";

const CALENDLY_URL = "https://calendly.com/algorythmos-france/30min";

export default function AiWebsitesPage() {
    const { t, region, getRegionPath } = useI18n();

    // SEO helpers
    const canonicalUrl = getCanonicalUrl(region, "/services/ai-websites");
    const ogLocale = getOgLocale(region);
    const hreflangLinks = generateHreflangLinks("/services/ai-websites");
    const canonicalBase = getCanonicalBase(region);

    const contactUrl = useMemo(() => {
        return withUtm(CALENDLY_URL, {
            utm_source: "services",
            utm_medium: "cta",
            utm_campaign: "ai-websites",
            utm_content: "hero_cta",
        });
    }, []);

    // Capabilities from i18n
    const capabilityIcons = [MessageSquare, Mic, Users, Database, Search, Smartphone, Languages, Server];
    const capabilities = capabilityIcons.map((icon, i) => ({
        icon,
        title: t(`serviceAiWebsites.capabilities.${i}.title`),
        desc: t(`serviceAiWebsites.capabilities.${i}.desc`)
    }));

    // Differentiators from i18n
    const differentiators = [0, 1, 2, 3, 4, 5].map(i => ({
        title: t(`serviceAiWebsites.differentiators.${i}.title`),
        desc: t(`serviceAiWebsites.differentiators.${i}.desc`)
    }));

    // Comparison rows from i18n
    const comparisonRows = [0, 1, 2, 3, 4, 5, 6].map(i => ({
        aspect: t(`serviceAiWebsites.comparison.${i}.aspect`),
        conventional: t(`serviceAiWebsites.comparison.${i}.conventional`),
        ai: t(`serviceAiWebsites.comparison.${i}.ai`)
    }));

    // FAQs from i18n
    const faqs = [0, 1, 2, 3].map(i => ({
        q: t(`serviceAiWebsites.faqs.${i}.q`),
        a: t(`serviceAiWebsites.faqs.${i}.a`)
    }));

    // Hero key points
    const heroPoints = [
        { icon: Code, text: t("serviceAiWebsites.hero.point1") },
        { icon: Shield, text: t("serviceAiWebsites.hero.point2") },
        { icon: Zap, text: t("serviceAiWebsites.hero.point3") }
    ];

    return (
        <div className="min-h-screen bg-black text-white">
            <Helmet>
                <title>{t("serviceAiWebsites.meta.title")}</title>
                <meta name="description" content={t("serviceAiWebsites.meta.description")} />
                <link rel="canonical" href={canonicalUrl} />
                {hreflangLinks.map(({ hreflang, href }) => (
                    <link key={hreflang} rel="alternate" hreflang={hreflang} href={href} />
                ))}
                <meta property="og:type" content="website" />
                <meta property="og:title" content={t("serviceAiWebsites.meta.title")} />
                <meta property="og:description" content={t("serviceAiWebsites.meta.description")} />
                <meta property="og:url" content={canonicalUrl} />
                <meta property="og:image" content={`${canonicalBase}/Algorythmos.png`} />
                <meta property="og:site_name" content="Algorythmos" />
                <meta property="og:locale" content={ogLocale} />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={t("serviceAiWebsites.meta.title")} />
                <meta name="twitter:description" content={t("serviceAiWebsites.meta.description")} />
                <meta name="twitter:image" content={`${canonicalBase}/Algorythmos.png`} />
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Service",
                        "name": t("serviceAiWebsites.hero.title1"),
                        "provider": {
                            "@type": "Organization",
                            "name": "Algorythmos",
                            "url": "https://algorythmos.com"
                        },
                        "description": t("serviceAiWebsites.meta.description"),
                        "areaServed": ["Australia", "France", "Europe"],
                        "serviceType": "AI Website Development"
                    })}
                </script>
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "BreadcrumbList",
                        "itemListElement": [
                            { "@type": "ListItem", "position": 1, "name": "Home", "item": canonicalBase },
                            { "@type": "ListItem", "position": 2, "name": t("serviceAiWebsites.breadcrumb.services"), "item": `${canonicalBase}/services` },
                            { "@type": "ListItem", "position": 3, "name": t("serviceAiWebsites.breadcrumb.current"), "item": canonicalUrl }
                        ]
                    })}
                </script>
            </Helmet>

            {/* Hero Section */}
            <section className="relative pt-28 pb-16 px-6 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/10 via-blue-600/5 to-transparent pointer-events-none" />

                <div className="relative max-w-6xl mx-auto">
                    {/* Breadcrumb */}
                    <nav className="mb-8 text-sm text-gray-400" aria-label="Breadcrumb">
                        <Link to={getRegionPath("/services")} className="hover:text-blue-400 transition-colors">
                            {t("serviceAiWebsites.breadcrumb.services")}
                        </Link>
                        <span className="mx-2">/</span>
                        <span className="text-white">{t("serviceAiWebsites.breadcrumb.current")}</span>
                    </nav>

                    {/* Icon & Badge */}
                    <div className="mb-6 flex items-center gap-4">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500/20 to-blue-500/20 ring-1 ring-white/10">
                            <Globe className="h-8 w-8 text-emerald-400" />
                        </div>
                        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold text-emerald-400 ring-1 ring-emerald-500/20">
                            <Zap className="h-3 w-3" />
                            {t("serviceAiWebsites.hero.badge")}
                        </div>
                    </div>

                    {/* Title */}
                    <h1 className="mb-6 text-4xl md:text-6xl font-black leading-tight">
                        <span className="bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                            {t("serviceAiWebsites.hero.title1")}
                        </span>
                        <br />
                        <span className="text-white">
                            {t("serviceAiWebsites.hero.title2")}
                        </span>
                    </h1>

                    {/* Subtitle */}
                    <p className="mb-8 max-w-3xl text-lg md:text-xl text-gray-300 leading-relaxed">
                        {t("serviceAiWebsites.hero.subtitle")}
                    </p>

                    {/* Key Points */}
                    <div className="mb-10 grid md:grid-cols-3 gap-4 max-w-3xl">
                        {heroPoints.map((item, i) => (
                            <div key={i} className="flex items-start gap-3 text-sm text-gray-300">
                                <item.icon className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
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
                            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-blue-600 px-6 py-3 font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all hover:shadow-xl hover:shadow-emerald-500/40 hover:-translate-y-0.5"
                        >
                            {t("serviceAiWebsites.cta.discovery")}
                            <ArrowRight className="h-5 w-5" />
                        </a>
                        <Link
                            to={getRegionPath("/pricing")}
                            className="inline-flex items-center gap-2 rounded-xl bg-white/5 px-6 py-3 font-semibold text-white ring-1 ring-white/10 transition-all hover:bg-white/10"
                        >
                            {t("serviceAiWebsites.cta.pricing")}
                        </Link>
                    </div>
                </div>
            </section>

            {/* Metrics Strip */}
            <section className="border-y border-white/10 bg-gradient-to-r from-emerald-500/5 to-blue-500/5 py-10 px-6">
                <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 text-center">
                    <div>
                        <div className="text-4xl font-black bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent mb-2">
                            {t("serviceAiWebsites.metrics.loadTime.value")}
                        </div>
                        <div className="text-sm text-gray-400">{t("serviceAiWebsites.metrics.loadTime.label")}</div>
                    </div>
                    <div>
                        <div className="text-4xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                            {t("serviceAiWebsites.metrics.uptime.value")}
                        </div>
                        <div className="text-sm text-gray-400">{t("serviceAiWebsites.metrics.uptime.label")}</div>
                    </div>
                    <div>
                        <div className="text-4xl font-black bg-gradient-to-r from-purple-400 to-emerald-400 bg-clip-text text-transparent mb-2">
                            {t("serviceAiWebsites.metrics.conversion.value")}
                        </div>
                        <div className="text-sm text-gray-400">{t("serviceAiWebsites.metrics.conversion.label")}</div>
                    </div>
                </div>
            </section>

            {/* Why Your Website Matters */}
            <section className="py-16 px-6">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-black mb-6 text-white">
                        {t("serviceAiWebsites.whyMatters.title")}
                    </h2>
                    <div className="space-y-4 text-lg text-gray-300 leading-relaxed">
                        <p>{t("serviceAiWebsites.whyMatters.p1")}</p>
                        <p>{t("serviceAiWebsites.whyMatters.p2")}</p>
                    </div>
                </div>
            </section>

            {/* What Makes Algorythmos Different */}
            <section className="py-16 px-6 bg-gradient-to-br from-slate-900/50 to-slate-800/30">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-black mb-10 text-white text-center">
                        {t("serviceAiWebsites.differentiators.title")}
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {differentiators.map((item, i) => (
                            <div key={i} className="flex items-start gap-4 rounded-xl bg-white/5 p-6 ring-1 ring-white/10">
                                <CheckCircle className="h-6 w-6 text-emerald-400 flex-shrink-0 mt-1" />
                                <div>
                                    <h3 className="font-bold text-white mb-2">{item.title}</h3>
                                    <p className="text-sm text-gray-400">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Core Capabilities */}
            <section className="py-16 px-6">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-black mb-10 text-white text-center">
                        {t("serviceAiWebsites.capabilities.title")}
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
                        {capabilities.map((cap, i) => (
                            <div key={i} className="rounded-xl bg-gradient-to-br from-emerald-500/5 to-blue-500/5 p-6 ring-1 ring-white/10 hover:ring-emerald-500/30 transition-all">
                                <cap.icon className="h-8 w-8 text-emerald-400 mb-4" />
                                <h3 className="font-bold text-white mb-2">{cap.title}</h3>
                                <p className="text-sm text-gray-400">{cap.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Before vs After Comparison */}
            <section className="py-16 px-6 bg-gradient-to-br from-slate-900/50 to-slate-800/30">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-black mb-10 text-white text-center">
                        {t("serviceAiWebsites.comparison.title")}
                    </h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/10">
                                    <th className="py-4 px-4 text-gray-400 font-semibold">{t("serviceAiWebsites.comparison.header.aspect")}</th>
                                    <th className="py-4 px-4 text-gray-400 font-semibold">{t("serviceAiWebsites.comparison.header.conventional")}</th>
                                    <th className="py-4 px-4 text-emerald-400 font-semibold">{t("serviceAiWebsites.comparison.header.ai")}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {comparisonRows.map((row, i) => (
                                    <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                        <td className="py-4 px-4 font-medium text-white">{row.aspect}</td>
                                        <td className="py-4 px-4 text-gray-400">{row.conventional}</td>
                                        <td className="py-4 px-4 text-emerald-300">{row.ai}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-16 px-6">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-black mb-10 text-white text-center">
                        {t("serviceAiWebsites.faqs.title")}
                    </h2>
                    <div className="space-y-4">
                        {faqs.map((faq, i) => (
                            <details key={i} className="group rounded-xl bg-white/5 ring-1 ring-white/10 overflow-hidden">
                                <summary className="flex items-center justify-between p-6 cursor-pointer">
                                    <span className="font-semibold text-white pr-4">{faq.q}</span>
                                    <ChevronDown className="h-5 w-5 text-gray-400 transition-transform group-open:rotate-180" />
                                </summary>
                                <div className="px-6 pb-6 text-gray-300 leading-relaxed">
                                    {faq.a}
                                </div>
                            </details>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-16 px-6 bg-gradient-to-br from-emerald-600/10 to-blue-600/10">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-black mb-4 text-white">
                        {t("serviceAiWebsites.finalCta.title")}
                    </h2>
                    <p className="mb-8 text-lg text-gray-300">
                        {t("serviceAiWebsites.finalCta.subtitle")}
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <a
                            href={contactUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-blue-600 px-8 py-4 font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all hover:shadow-xl hover:shadow-emerald-500/40 hover:-translate-y-0.5"
                        >
                            {t("serviceAiWebsites.cta.discovery")}
                            <ArrowRight className="h-5 w-5" />
                        </a>
                        <Link
                            to={getRegionPath("/pricing")}
                            className="inline-flex items-center gap-2 rounded-xl bg-white/5 px-8 py-4 font-semibold text-white ring-1 ring-white/10 transition-all hover:bg-white/10"
                        >
                            {t("serviceAiWebsites.cta.pricing")}
                        </Link>
                    </div>
                </div>
            </section>

            {/* Related Services */}
            <section className="py-12 px-6 border-t border-white/10">
                <div className="max-w-6xl mx-auto">
                    <h3 className="text-xl font-bold text-gray-400 mb-6">{t("serviceAiWebsites.related.title")}</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        <Link
                            to={getRegionPath("/services/agentic-automation")}
                            className="group flex items-center gap-4 rounded-xl bg-white/5 p-6 ring-1 ring-white/10 transition-all hover:bg-white/10"
                        >
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20">
                                <Bot className="h-6 w-6 text-blue-400" />
                            </div>
                            <div>
                                <div className="font-semibold text-white group-hover:text-emerald-400 transition-colors">
                                    {t("serviceAiWebsites.related.agentic.title")}
                                </div>
                                <div className="text-sm text-gray-400">{t("serviceAiWebsites.related.agentic.desc")}</div>
                            </div>
                        </Link>
                        <Link
                            to={getRegionPath("/services/sql-dashboards")}
                            className="group flex items-center gap-4 rounded-xl bg-white/5 p-6 ring-1 ring-white/10 transition-all hover:bg-white/10"
                        >
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20">
                                <BarChart3 className="h-6 w-6 text-purple-400" />
                            </div>
                            <div>
                                <div className="font-semibold text-white group-hover:text-emerald-400 transition-colors">
                                    {t("serviceAiWebsites.related.sql.title")}
                                </div>
                                <div className="text-sm text-gray-400">{t("serviceAiWebsites.related.sql.desc")}</div>
                            </div>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Region-specific CTA */}
            <LocalizedCTA />
        </div>
    );
}
