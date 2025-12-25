// src/pages/legal/PrivacyPolicyPage.jsx
import React, { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useI18n } from "../../app/i18n/I18nContext";
import { getCanonicalUrl, getOgLocale, generateHreflangLinks, getCanonicalBase } from "../../app/utils/seoHelpers.js";
import SeoBreadcrumbs from "../../app/seo/SeoBreadcrumbs.jsx";
import { track } from "../../app/utils/analytics";
import { persistUtmFromLocation, readStoredUtm } from "../../app/utils/utm";
import AnimatedSection from "../../components/ui/AnimatedSection";
import { Shield, Mail, Database, Lock, UserCheck, Globe } from "lucide-react";

const PrivacyPolicyPage = () => {
    const { t, region, isFrance } = useI18n();

    // Page view tracking
    useEffect(() => {
        persistUtmFromLocation();
        const utm = readStoredUtm();
        track("page_view", { page: "privacy", ...utm });
    }, []);

    // SEO helpers
    const canonicalUrl = getCanonicalUrl(region, "/privacy");
    const canonicalBase = getCanonicalBase(region);
    const ogLocale = getOgLocale(region);
    const hreflangLinks = generateHreflangLinks("/privacy");

    // Contact email based on region
    const contactEmail = isFrance ? "support@algorythmos.fr" : "support@algorythmos.com";

    const sections = [
        {
            icon: Shield,
            titleKey: "privacy.sections.intro.title",
            contentKey: "privacy.sections.intro.content",
        },
        {
            icon: UserCheck,
            titleKey: "privacy.sections.googleAuth.title",
            contentKey: "privacy.sections.googleAuth.content",
        },
        {
            icon: Database,
            titleKey: "privacy.sections.dataCollected.title",
            contentKey: "privacy.sections.dataCollected.content",
            listKeys: [
                "privacy.sections.dataCollected.items.0",
                "privacy.sections.dataCollected.items.1",
                "privacy.sections.dataCollected.items.2",
            ],
        },
        {
            icon: Lock,
            titleKey: "privacy.sections.dataUsage.title",
            contentKey: "privacy.sections.dataUsage.content",
            listKeys: [
                "privacy.sections.dataUsage.items.0",
                "privacy.sections.dataUsage.items.1",
            ],
        },
        {
            icon: Globe,
            titleKey: "privacy.sections.thirdParties.title",
            contentKey: "privacy.sections.thirdParties.content",
        },
        {
            icon: Mail,
            titleKey: "privacy.sections.contact.title",
            contentKey: "privacy.sections.contact.content",
        },
    ];

    return (
        <div className="relative min-h-screen bg-black text-white overflow-hidden">
            <Helmet>
                <title>{t("privacy.meta.title")}</title>
                <meta name="description" content={t("privacy.meta.description")} />
                <link rel="canonical" href={canonicalUrl} />
                {hreflangLinks.map(({ hreflang, href }) => (
                    <link key={hreflang} rel="alternate" hreflang={hreflang} href={href} />
                ))}
                <meta property="og:type" content="website" />
                <meta property="og:title" content={t("privacy.meta.title")} />
                <meta property="og:description" content={t("privacy.meta.description")} />
                <meta property="og:url" content={canonicalUrl} />
                <meta property="og:image" content={`${canonicalBase}/Algorythmos.png`} />
                <meta property="og:site_name" content="Algorythmos" />
                <meta property="og:locale" content={ogLocale} />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={t("privacy.meta.title")} />
                <meta name="twitter:description" content={t("privacy.meta.description")} />
                <meta name="twitter:image" content={`${canonicalBase}/Algorythmos.png`} />
            </Helmet>
            <SeoBreadcrumbs items={[{ name: "Home", path: "/" }, { name: t("nav.privacy"), path: "/privacy" }]} />

            {/* Background */}
            <div className="fixed inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-purple-900/5 to-black" />
            </div>

            {/* Hero */}
            <section className="relative z-10 pt-32 pb-16 sm:pt-40 sm:pb-20">
                <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
                    <AnimatedSection>
                        <div className="inline-flex items-center px-5 py-2.5 mb-8 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm border border-white/20 rounded-full text-sm font-medium">
                            <Shield className="w-4 h-4 mr-2" />
                            {t("privacy.hero.badge")}
                        </div>
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                            {t("privacy.hero.title")}
                        </h1>
                        <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto">
                            {t("privacy.hero.subtitle")}
                        </p>
                        <p className="text-sm text-gray-500 mt-4">
                            {t("privacy.hero.lastUpdated")}: {t("privacy.hero.lastUpdatedDate")}
                        </p>
                    </AnimatedSection>
                </div>
            </section>

            {/* Content Sections */}
            <section className="relative z-10 pb-24 sm:pb-32">
                <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12">
                    <div className="space-y-12">
                        {sections.map((section, index) => {
                            const Icon = section.icon;
                            return (
                                <AnimatedSection key={index} delay={index * 100}>
                                    <div className="group p-8 bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl hover:border-white/20 transition-all duration-500">
                                        <div className="flex items-start gap-4 mb-4">
                                            <div className="p-3 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl">
                                                <Icon className="w-6 h-6 text-blue-400" />
                                            </div>
                                            <h2 className="text-2xl font-bold text-white pt-2">
                                                {t(section.titleKey)}
                                            </h2>
                                        </div>
                                        <div className="text-gray-300 leading-relaxed space-y-4 pl-16">
                                            <p>{t(section.contentKey).replace("{email}", contactEmail)}</p>
                                            {section.listKeys && (
                                                <ul className="list-disc list-inside space-y-2 text-gray-400">
                                                    {section.listKeys.map((key, i) => (
                                                        <li key={i}>{t(key)}</li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    </div>
                                </AnimatedSection>
                            );
                        })}
                    </div>

                    {/* Contact CTA */}
                    <AnimatedSection delay={600}>
                        <div className="mt-16 p-8 bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-white/10 rounded-2xl text-center">
                            <h3 className="text-xl font-bold text-white mb-4">{t("privacy.cta.title")}</h3>
                            <p className="text-gray-300 mb-6">{t("privacy.cta.subtitle")}</p>
                            <a
                                href={`mailto:${contactEmail}`}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-medium text-white hover:opacity-90 transition-opacity"
                            >
                                <Mail className="w-4 h-4" />
                                {contactEmail}
                            </a>
                        </div>
                    </AnimatedSection>
                </div>
            </section>
        </div>
    );
};

export default PrivacyPolicyPage;
