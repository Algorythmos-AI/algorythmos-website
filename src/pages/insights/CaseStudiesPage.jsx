import React from "react";
import { Helmet } from "react-helmet-async";
import { BarChart2, FileText, Zap, Users, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { useI18n } from "../../app/i18n/I18nContext.jsx";
import { getCanonicalUrl, getOgLocale, generateHreflangLinks, getCanonicalBase } from "../../app/utils/seoHelpers.js";
import SeoBreadcrumbs from "../../app/seo/SeoBreadcrumbs.jsx";

const CaseStudiesPage = () => {
  const { t, region, getRegionPath } = useI18n();
  const canonicalUrl = getCanonicalUrl(region, '/case-studies');
  const canonicalBase = getCanonicalBase(region);
  const ogLocale = getOgLocale(region);
  const hreflangLinks = generateHreflangLinks('/case-studies');

  const caseStudies = [
    {
      icon: Heart,
      title: t("caseStudies.items.4.title"),
      challenge: t("caseStudies.items.4.challenge"),
      solution: t("caseStudies.items.4.solution"),
      result: t("caseStudies.items.4.result"),
      gradient: "from-cyan-500 to-teal-500",
      slug: "healthcare-burden",
      featured: true
    },
    {
      icon: BarChart2,
      title: t("caseStudies.items.0.title"),
      challenge: t("caseStudies.items.0.challenge"),
      solution: t("caseStudies.items.0.solution"),
      result: t("caseStudies.items.0.result"),
      gradient: "from-blue-500 to-purple-500",
      slug: "financial-compliance"
    },
    {
      icon: FileText,
      title: t("caseStudies.items.1.title"),
      challenge: t("caseStudies.items.1.challenge"),
      solution: t("caseStudies.items.1.solution"),
      result: t("caseStudies.items.1.result"),
      gradient: "from-pink-500 to-rose-500",
      slug: "manufacturing-docs"
    },
    {
      icon: Zap,
      title: t("caseStudies.items.2.title"),
      challenge: t("caseStudies.items.2.challenge"),
      solution: t("caseStudies.items.2.solution"),
      result: t("caseStudies.items.2.result"),
      gradient: "from-green-500 to-emerald-500",
      slug: "healthcare-mlops"
    },
    {
      icon: Users,
      title: t("caseStudies.items.3.title"),
      challenge: t("caseStudies.items.3.challenge"),
      solution: t("caseStudies.items.3.solution"),
      result: t("caseStudies.items.3.result"),
      gradient: "from-yellow-500 to-orange-500",
      slug: "retail-sql"
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      <Helmet>
        <title>{t("caseStudies.meta.title")}</title>
        <meta name="description" content={t("caseStudies.meta.description")} />
        <link rel="canonical" href={canonicalUrl} />
        {hreflangLinks.map(({ hreflang, href }) => (
          <link key={hreflang} rel="alternate" hreflang={hreflang} href={href} />
        ))}
        <meta property="og:title" content={t("caseStudies.meta.title")} />
        <meta property="og:description" content={t("caseStudies.meta.description")} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={`${canonicalBase}/Algorythmos.png`} />
        <meta property="og:site_name" content="Algorythmos" />
        <meta property="og:locale" content={ogLocale} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t("caseStudies.meta.title")} />
        <meta name="twitter:description" content={t("caseStudies.meta.description")} />
        <meta name="twitter:image" content={`${canonicalBase}/Algorythmos.png`} />
      </Helmet>
      <SeoBreadcrumbs items={[{ name: "Home", path: "/" }, { name: t("nav.caseStudies"), path: "/case-studies" }]} />

      <main className="pt-32 md:pt-40 pb-20 px-4 sm:px-6 md:px-12 max-w-6xl mx-auto text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          {t("caseStudies.hero.title")}
        </h1>
        <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 mb-16 leading-relaxed">
          {t("caseStudies.hero.subtitle")}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 lg:gap-12">
          {caseStudies.map((study, index) => {
            const Icon = study.icon;
            return (
              <Link
                key={index}
                to={getRegionPath(`/case-studies/${study.slug}`)}
                className="group relative p-6 sm:p-8 md:p-10 bg-gradient-to-br from-gray-900/60 to-black/60 rounded-3xl 
                border border-gray-800/50 hover:border-white/20 backdrop-blur-xl transition-all duration-700 
                transform hover:scale-105 hover:-translate-y-4 overflow-hidden block text-left shadow-lg"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${study.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-700`} />
                <div className="relative z-10">
                  <div className={`inline-flex p-4 bg-gradient-to-br ${study.gradient} rounded-2xl mb-6`}>
                    <Icon className="w-10 h-10 sm:w-12 sm:h-12" />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold mb-4">{study.title}</h3>
                  <p className="text-base sm:text-lg text-gray-400"><strong>{t("caseStudies.labels.challenge")}</strong> {study.challenge}</p>
                  <p className="text-base sm:text-lg text-gray-400"><strong>{t("caseStudies.labels.solution")}</strong> {study.solution}</p>
                  <p className="text-base sm:text-lg text-gray-400"><strong>{t("caseStudies.labels.result")}</strong> {study.result}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default CaseStudiesPage;
