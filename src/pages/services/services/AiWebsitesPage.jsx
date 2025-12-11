// /src/pages/services/services/AiWebsitesPage.jsx
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
    const canonicalBase = getCanonicalBase(region);
    const ogLocale = getOgLocale(region);
    const hreflangLinks = generateHreflangLinks("/services/ai-websites");

    const contactUrl = useMemo(() => {
        return withUtm(CALENDLY_URL, {
            utm_source: "services",
            utm_medium: "cta",
            utm_campaign: "ai-websites",
            utm_content: "hero_cta",
        });
    }, []);

    const capabilities = [
        { icon: MessageSquare, title: "AI Chatbots", desc: "24/7 intelligent customer support embedded directly into your site" },
        { icon: Mic, title: "Voice AI Integration", desc: "Natural voice interfaces for accessibility and modern UX" },
        { icon: Users, title: "Lead Qualification", desc: "Automated scoring and routing of high-intent prospects" },
        { icon: Database, title: "CRM Integration", desc: "Seamless sync with HubSpot, Salesforce, and custom systems" },
        { icon: Search, title: "SEO Optimised", desc: "Built for search visibility with structured data and speed" },
        { icon: Smartphone, title: "Mobile-First", desc: "Responsive design that performs on every device" },
        { icon: Languages, title: "Multilingual (AU/FR)", desc: "Native support for Australian and French markets" },
        { icon: Server, title: "Hosting & Monitoring", desc: "Enterprise-grade uptime with real-time performance tracking" }
    ];

    const differentiators = [
        { title: "Custom Engineering, Not Templates", desc: "Every site is architected from scratch to match your brand and business logic." },
        { title: "Enterprise-Grade Performance", desc: "Sub-second load times, 99.9% uptime, and infrastructure built for scale." },
        { title: "Local AU + EU Engineering", desc: "Sydney and Paris-based engineers who understand your market." },
        { title: "Clear Communication", desc: "Weekly updates, transparent timelines, and no black-box pricing." },
        { title: "AI-Enhanced Features", desc: "Chatbots, voice AI, and intelligent forms that convert visitors into customers." },
        { title: "Security-First Mindset", desc: "HTTPS, GDPR compliance, regular audits, and enterprise auth options." }
    ];

    const comparisonRows = [
        { aspect: "Design", conventional: "Template-based, generic", ai: "Custom-engineered for your brand" },
        { aspect: "Load Speed", conventional: "2-5 seconds", ai: "Under 1 second (Core Web Vitals optimised)" },
        { aspect: "Lead Capture", conventional: "Static forms", ai: "AI chatbots + intelligent qualification" },
        { aspect: "SEO", conventional: "Basic meta tags", ai: "Structured data, schema markup, speed-optimised" },
        { aspect: "Support", conventional: "Contact forms only", ai: "24/7 AI-powered instant responses" },
        { aspect: "Analytics", conventional: "Page views only", ai: "Conversion tracking, heatmaps, AI insights" },
        { aspect: "Maintenance", conventional: "Manual updates", ai: "Automated monitoring and updates" }
    ];

    const faqs = [
        { q: "How long does it take to build an AI-powered website?", a: "Typically 4-8 weeks depending on complexity. We prioritize speed without compromising quality." },
        { q: "Do you work with existing brands or create new ones?", a: "Both. We can work with your existing brand guidelines or help you develop a fresh identity." },
        { q: "What about ongoing maintenance?", a: "We offer monthly maintenance packages including hosting, updates, security monitoring, and content changes." },
        { q: "Can you integrate with our existing CRM?", a: "Absolutely. We integrate with HubSpot, Salesforce, Pipedrive, and most modern CRMs via API." }
    ];

    return (
        <div className="min-h-screen bg-black text-white">
            <Helmet>
                <title>AI-Powered Website Development for SMEs | Algorythmos</title>
                <meta
                    name="description"
                    content="Custom AI-enhanced websites built for Australian and European SMEs. Intelligent chatbots, voice AI, enterprise performance, and local engineering support."
                />
                <link rel="canonical" href={canonicalUrl} />
                {hreflangLinks.map(({ hreflang, href }) => (
                    <link key={hreflang} rel="alternate" hreflang={hreflang} href={href} />
                ))}
                <meta property="og:type" content="website" />
                <meta property="og:title" content="AI-Powered Website Development | Algorythmos" />
                <meta property="og:description" content="Custom AI-enhanced websites for SMEs with intelligent chatbots, voice AI, and enterprise-grade performance." />
                <meta property="og:url" content={canonicalUrl} />
                <meta property="og:image" content={`${canonicalBase}/Algorythmos.png`} />
                <meta property="og:site_name" content="Algorythmos" />
                <meta property="og:locale" content={ogLocale} />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="AI-Powered Website Development | Algorythmos" />
                <meta name="twitter:description" content="Custom AI-enhanced websites for SMEs." />
                <meta name="twitter:image" content={`${canonicalBase}/Algorythmos.png`} />
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Service",
                        "name": "AI-Powered Website Development",
                        "provider": {
                            "@type": "Organization",
                            "name": "Algorythmos",
                            "url": canonicalBase
                        },
                        "description": "Custom AI-enhanced website development for SMEs with intelligent chatbots, voice AI, and enterprise-grade performance.",
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
                                "name": "AI-Powered Websites",
                                "item": canonicalUrl
                            }
                        ]
                    })}
                </script>
            </Helmet>

            {/* Hero Section */}
            <section className="relative pt-28 pb-16 px-6 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/10 via-blue-600/5 to-transparent pointer-events-none" />

                <div className="relative max-w-6xl mx-auto">
                    {/* Breadcrumb */}
                    <nav className="mb-8 text-sm text-gray-400">
                        <Link to={getRegionPath("/services")} className="hover:text-blue-400 transition-colors">
                            Services
                        </Link>
                        <span className="mx-2">/</span>
                        <span className="text-white">AI-Powered Websites</span>
                    </nav>

                    {/* Icon & Badge */}
                    <div className="mb-6 flex items-center gap-4">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500/20 to-blue-500/20 ring-1 ring-white/10">
                            <Globe className="h-8 w-8 text-emerald-400" />
                        </div>
                        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold text-emerald-400 ring-1 ring-emerald-500/20">
                            <Zap className="h-3 w-3" />
                            Premium Web Development
                        </div>
                    </div>

                    {/* Title */}
                    <h1 className="mb-6 text-4xl md:text-6xl font-black leading-tight">
                        <span className="bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                            AI-Powered Websites
                        </span>
                        <br />
                        <span className="text-white">
                            Built for Business Growth
                        </span>
                    </h1>

                    {/* Subtitle */}
                    <p className="mb-8 max-w-3xl text-lg md:text-xl text-gray-300 leading-relaxed">
                        We engineer high-performance websites with embedded AI capabilities—intelligent chatbots,
                        voice interfaces, and automated lead qualification—designed for Australian and European SMEs
                        who demand more than a templated solution.
                    </p>

                    {/* Key Points */}
                    <div className="mb-10 grid md:grid-cols-3 gap-4 max-w-3xl">
                        {[
                            { icon: Code, text: "Custom-engineered, not templated" },
                            { icon: Shield, text: "Enterprise security & GDPR ready" },
                            { icon: Zap, text: "Sub-second load times" }
                        ].map((item, i) => (
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
                            Book a Discovery Call
                            <ArrowRight className="h-5 w-5" />
                        </a>
                        <Link
                            to={getRegionPath("/pricing")}
                            className="inline-flex items-center gap-2 rounded-xl bg-white/5 px-6 py-3 font-semibold text-white ring-1 ring-white/10 transition-all hover:bg-white/10"
                        >
                            View Pricing
                        </Link>
                    </div>
                </div>
            </section>

            {/* Metrics Strip */}
            <section className="border-y border-white/10 bg-gradient-to-r from-emerald-500/5 to-blue-500/5 py-10 px-6">
                <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 text-center">
                    <div>
                        <div className="text-4xl font-black bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent mb-2">
                            &lt;1s
                        </div>
                        <div className="text-sm text-gray-400">Average Load Time</div>
                    </div>
                    <div>
                        <div className="text-4xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                            99.9%
                        </div>
                        <div className="text-sm text-gray-400">Uptime Guarantee</div>
                    </div>
                    <div>
                        <div className="text-4xl font-black bg-gradient-to-r from-purple-400 to-emerald-400 bg-clip-text text-transparent mb-2">
                            3x
                        </div>
                        <div className="text-sm text-gray-400">Lead Conversion Increase</div>
                    </div>
                </div>
            </section>

            {/* Why Your Website Matters */}
            <section className="py-16 px-6">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-black mb-6 text-white">
                        Why Your Website Matters More Than Ever
                    </h2>
                    <div className="space-y-4 text-lg text-gray-300 leading-relaxed">
                        <p>
                            Your website is often the first—and most important—interaction a potential customer
                            has with your business. In 2024, a slow, generic, or outdated site doesn't just look
                            bad; it actively loses you revenue.
                        </p>
                        <p>
                            Modern buyers expect instant responses, mobile-first experiences, and intelligent
                            interfaces. They compare you to global brands, not just local competitors.
                            A website that can't keep up becomes a liability, not an asset.
                        </p>
                    </div>
                </div>
            </section>

            {/* What Makes Algorythmos Different */}
            <section className="py-16 px-6 bg-gradient-to-br from-slate-900/50 to-slate-800/30">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-black mb-10 text-white text-center">
                        What Makes Algorythmos Different
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
                        Core Capabilities
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
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-black mb-10 text-white text-center">
                        Conventional vs AI-Powered Website
                    </h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-white/10">
                                    <th className="py-4 px-4 text-gray-400 font-semibold">Aspect</th>
                                    <th className="py-4 px-4 text-gray-400 font-semibold">Conventional</th>
                                    <th className="py-4 px-4 text-emerald-400 font-semibold">AI-Powered (Algorythmos)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {comparisonRows.map((row, i) => (
                                    <tr key={i} className="border-b border-white/5 hover:bg-white/5">
                                        <td className="py-4 px-4 text-white font-medium">{row.aspect}</td>
                                        <td className="py-4 px-4 text-gray-500">{row.conventional}</td>
                                        <td className="py-4 px-4 text-gray-300">{row.ai}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* FAQs */}
            <section className="py-16 px-6">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-black mb-8 text-white">
                        Frequently Asked Questions
                    </h2>
                    <div className="space-y-4">
                        {faqs.map((faq, i) => (
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
            <section className="py-16 px-6 bg-gradient-to-br from-emerald-600/10 via-blue-600/10 to-transparent">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-black mb-4 text-white">
                        Ready to Transform Your Website?
                    </h2>
                    <p className="mb-8 text-lg text-gray-300">
                        Let's discuss how an AI-powered website can accelerate your business growth.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <a
                            href={contactUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-blue-600 px-8 py-4 font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all hover:shadow-xl hover:shadow-emerald-500/40 hover:-translate-y-0.5"
                        >
                            Book a Discovery Call
                            <ArrowRight className="h-5 w-5" />
                        </a>
                        <Link
                            to={getRegionPath("/pricing")}
                            className="inline-flex items-center gap-2 rounded-xl bg-white/5 px-8 py-4 font-semibold text-white ring-1 ring-white/10 transition-all hover:bg-white/10"
                        >
                            View Pricing
                        </Link>
                    </div>
                </div>
            </section>

            {/* Related Services */}
            <section className="py-12 px-6 border-t border-white/10">
                <div className="max-w-6xl mx-auto">
                    <h3 className="text-xl font-bold text-gray-400 mb-6">Related Services</h3>
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
                                    Agentic Automation
                                </div>
                                <div className="text-sm text-gray-400">AI agents that work across your systems</div>
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
                                    SQL-Based Dashboards
                                </div>
                                <div className="text-sm text-gray-400">Executive-ready analytics and insights</div>
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
