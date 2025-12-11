// /src/components/Index/ServicesPage.jsx
import React, { Suspense, lazy, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Layers, Bot, FileText, BarChart3, Globe } from "lucide-react";
import ServiceCard from "./services/ServiceCard";
import { servicesList } from "../../data/services";
import { useI18n } from "../../app/i18n/I18nContext.jsx";
import { getCanonicalUrl, getOgLocale, generateHreflangLinks } from "../../app/utils/seoHelpers.js";
import LocalizedCTA from "../../components/ui/LocalizedCTA.jsx";

// Lazy load ScrollSequence for performance
const ScrollSequence = lazy(() => import("../../components/microanimations/ScrollSequence.jsx"));

export default function ServicesPage() {
  const { t, region, getRegionPath } = useI18n();

  // Mobile and reduced motion detection
  const [isMobile, setIsMobile] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    const checkMotion = () => setPrefersReducedMotion(
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    );
    checkMobile();
    checkMotion();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // SEO helpers
  const canonicalUrl = getCanonicalUrl(region, "/services");
  const ogLocale = getOgLocale(region);
  const hreflangLinks = generateHreflangLinks("/services");

  // Map icons by slug
  const iconBySlug = {
    "agentic-automation": Bot,
    "document-intelligence": FileText,
    "sql-dashboards": BarChart3,
    "mlops-cicd": Layers,
    "ai-websites": Globe
  };

  // Map slugs to translation key indices
  const slugToIndex = {
    "agentic-automation": 0,
    "document-intelligence": 1,
    "sql-dashboards": 2,
    "mlops-cicd": 3,
    "ai-websites": 4
  };

  const getServiceTitle = (slug) => {
    const index = slugToIndex[slug];
    return t(`services.cards.${index}.title`);
  };

  const getServiceExcerpt = (slug) => {
    const index = slugToIndex[slug];
    return t(`services.cards.${index}.excerpt`);
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <Helmet>
        <title>{t("services.meta.title")}</title>
        <meta name="description" content={t("services.meta.description")} />
        <link rel="canonical" href={canonicalUrl} />
        {hreflangLinks.map(({ hreflang, href }) => (
          <link key={hreflang} rel="alternate" hreflang={hreflang} href={href} />
        ))}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={t("services.meta.title")} />
        <meta property="og:description" content={t("services.meta.description")} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content={`${canonicalUrl.replace('/services', '')}/Algorythmos.png`} />
        <meta property="og:site_name" content="Algorythmos" />
        <meta property="og:locale" content={ogLocale} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t("services.meta.title")} />
        <meta name="twitter:description" content={t("services.meta.description")} />
        <meta name="twitter:image" content={`${canonicalUrl.replace('/services', '')}/Algorythmos.png`} />
      </Helmet>

      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-purple-600/5 to-transparent pointer-events-none" />

      <main className="pt-28 pb-16 px-6 max-w-6xl mx-auto relative z-10">
        {/* Hero Header */}
        <header className="mb-6 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            {t("services.hero.title")}
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto md:mx-0">
            {t("services.hero.subtitle")}
          </p>
        </header>

        {/* ScrollSequence Storytelling Section */}
        {!isMobile && !prefersReducedMotion ? (
          <section className="relative my-12 h-[60vh] rounded-2xl overflow-hidden bg-neural-950/50 ring-1 ring-white/5">
            <Suspense fallback={<div className="h-full bg-neural-950" />}>
              <div className="absolute inset-0 opacity-60">
                <ScrollSequence frameCount={50} />
              </div>
            </Suspense>
            <div className="absolute inset-0 flex items-center justify-center z-10 bg-gradient-to-t from-black/80 via-transparent to-black/40">
              <div className="text-center px-6">
                <h2 className="text-3xl md:text-5xl font-black text-white/90 tracking-tight mb-3">
                  Intelligent Solutions.
                </h2>
                <p className="text-xl md:text-2xl bg-gradient-to-r from-neon-violet to-neon-cyan bg-clip-text text-transparent font-semibold">
                  Measurable Impact.
                </p>
              </div>
            </div>
          </section>
        ) : (
          /* Mobile fallback - static image */
          <section className="relative my-10 h-48 rounded-2xl overflow-hidden bg-neural-950/50 ring-1 ring-white/5">
            <div className="absolute inset-0 opacity-40">
              <img
                src="/assets/lottie/scroll/scroll_0025.png"
                alt="AI visualization"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/80 to-transparent">
              <div className="text-center px-4">
                <h2 className="text-2xl font-black text-white/90">Intelligent Solutions.</h2>
                <p className="text-lg text-neon-violet font-semibold">Measurable Impact.</p>
              </div>
            </div>
          </section>
        )}

        {/* Service Cards Grid */}
        <section className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
          {servicesList.map((s) => (
            <ServiceCard
              key={s.slug}
              title={getServiceTitle(s.slug)}
              href={getRegionPath(`/services/${s.slug}`)}
              icon={iconBySlug[s.slug] || Layers}
              excerpt={getServiceExcerpt(s.slug)}
            />
          ))}
        </section>

        {/* Region-specific CTA */}
        <LocalizedCTA />
      </main>
    </div>
  );
}

