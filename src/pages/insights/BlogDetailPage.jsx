import React, { Suspense, lazy } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useI18n } from "../../app/i18n/I18nContext";
import { getCanonicalUrl, getOgLocale, generateHreflangLinks, getCanonicalBase } from "../../app/utils/seoHelpers.js";
import SeoBreadcrumbs from "../../app/seo/SeoBreadcrumbs.jsx";
import { ReadingProgressBar } from "../../components/ui/blog/BlogRefactorSystem.jsx";

// Standard Layout
import { StandardLayout } from "./layouts/StandardLayout.jsx";

// Lazy Loaded Specialized Layouts
const PulseContent = lazy(() => import("./PulseContent.jsx"));
const AiConsultancyLayout = lazy(() => import("./layouts/AiConsultancyLayout.jsx").then(module => ({ default: module.AiConsultancyLayout })));
const GdprAiLayout = lazy(() => import("./layouts/GdprAiLayout.jsx").then(module => ({ default: module.GdprAiLayout })));
const MlopsLayout = lazy(() => import("./layouts/MlopsLayout.jsx").then(module => ({ default: module.MlopsLayout })));
const AgenticAiLayout = lazy(() => import("./layouts/AgenticAiLayout.jsx").then(module => ({ default: module.AgenticAiLayout })));
const LlmSecOpsLayout = lazy(() => import("./layouts/LlmSecOpsLayout.jsx").then(module => ({ default: module.LlmSecOpsLayout })));
const AiWebsitesLayout = lazy(() => import("./layouts/AiWebsitesLayout.jsx").then(module => ({ default: module.AiWebsitesLayout })));

const blogSlugs = [
  "gdpr-ai", "mlops-production", "agentic-ai", "llmsecops",
  "ai-websites-advantage", "voice-ai-automation", "chatbots-agents-rag",
  "future-sme-websites", "core-web-vitals", "ai-consultancy-australia",
  "clinical-ai-healthcare", "pulse-clinical-ai"
];

const blogStructures = {
  // Keeping original structure logic to hydrate 'post' object
  "gdpr-ai": { content: [{ heading: true, paragraphs: [0, 1] }, { heading: true, list: [0, 1, 2, 3] }, { heading: true, paragraphs: [0, 1] }] },
  "mlops-production": { content: [{ heading: true, paragraphs: [0, 1] }, { heading: true, list: [0, 1, 2, 3] }, { heading: true, paragraphs: [0] }] },
  "agentic-ai": { content: [{ heading: true, paragraphs: [0] }, { heading: true, list: [0, 1, 2, 3] }] },
  "llmsecops": { content: [{ heading: true, paragraphs: [0] }, { heading: true, list: [0, 1, 2, 3] }] },
  "ai-websites-advantage": { content: [{ heading: true, paragraphs: [0, 1] }, { heading: true, list: [0, 1, 2, 3] }] },
  "voice-ai-automation": { content: [{ heading: true, paragraphs: [0] }, { heading: true, list: [0, 1, 2, 3] }] },
  "chatbots-agents-rag": { content: [{ heading: true, paragraphs: [0] }, { heading: true, list: [0, 1, 2, 3] }] },
  "future-sme-websites": { content: [{ heading: true, paragraphs: [0] }, { heading: true, list: [0, 1, 2] }] },
  "core-web-vitals": { content: [{ heading: true, paragraphs: [0] }, { heading: true, list: [0, 1, 2, 3] }] },
  "ai-consultancy-australia": { content: [{ heading: true, paragraphs: [0, 1, 2, 3] }, { heading: true, list: [0, 1, 2, 3] }] },
  "clinical-ai-healthcare": { content: [{ heading: true, paragraphs: [0, 1] }, { heading: true, list: [0, 1, 2, 3] }, { heading: true, paragraphs: [0] }, { heading: true, list: [0, 1, 2, 3] }, { heading: true, paragraphs: [0, 1] }] },
};

export default function BlogDetailPage() {
  const { t, region, getRegionPath } = useI18n();
  const { slug } = useParams();

  // SEO helpers
  const canonicalUrl = getCanonicalUrl(region, `/blog/${slug}`);
  const ogLocale = getOgLocale(region);
  const hreflangLinks = generateHreflangLinks(`/blog/${slug}`);

  // Determine Layout
  const renderLayout = (post) => {
    switch (slug) {
      case "pulse-clinical-ai": return <PulseContent t={t} getRegionPath={getRegionPath} />;
      case "ai-consultancy-australia": return <AiConsultancyLayout t={t} post={post} />;
      case "gdpr-ai": return <GdprAiLayout t={t} post={post} />;
      case "mlops-production": return <MlopsLayout t={t} post={post} />;
      case "agentic-ai": return <AgenticAiLayout t={t} post={post} />;
      case "llmsecops": return <LlmSecOpsLayout t={t} post={post} />;
      case "ai-websites-advantage": return <AiWebsitesLayout t={t} post={post} />;
      // Default Upgrade
      default: return <StandardLayout t={t} post={post} />;
    }
  };

  // Build post from translations (Pulse handles its own content)
  const isValidSlug = blogSlugs.includes(slug);
  const post = (isValidSlug && slug !== "pulse-clinical-ai") ? {
    title: t(`blogDetail.posts.${slug}.title`),
    meta: t(`blogDetail.posts.${slug}.meta`),
    date: t(`blogDetail.posts.${slug}.date`),
    content: blogStructures[slug] ? blogStructures[slug].content.map((section, idx) => ({
      heading: section.heading ? t(`blogDetail.posts.${slug}.content.${idx}.heading`) : null,
      paragraphs: section.paragraphs?.map((pIdx) =>
        t(`blogDetail.posts.${slug}.content.${idx}.paragraphs.${pIdx}`)
      ),
      list: section.list?.map((lIdx) =>
        t(`blogDetail.posts.${slug}.content.${idx}.list.${lIdx}`)
      ),
    })) : []
  } : null;

  if (!isValidSlug) {
    return <div className="text-white text-center pt-40">Blog not found</div>;
  }

  // Common SEO Props
  const pageTitle = slug === "pulse-clinical-ai" ? t("blogDetail.posts.pulse-clinical-ai.title") : post?.title;
  const pageMeta = slug === "pulse-clinical-ai" ? t("blogDetail.posts.pulse-clinical-ai.meta") : post?.meta;
  const pageDate = slug === "pulse-clinical-ai" ? t("blogDetail.posts.pulse-clinical-ai.date") : post?.date;

  return (
    <>
      <ReadingProgressBar />
      <div className="min-h-screen bg-[#020617] text-white">
        <Helmet>
          <title>{pageTitle} | Algorythmos</title>
          <meta name="description" content={pageMeta} />
          <link rel="canonical" href={canonicalUrl} />
          {hreflangLinks.map(({ hreflang, href }) => (
            <link key={hreflang} rel="alternate" hreflang={hreflang} href={href} />
          ))}
          <meta property="og:title" content={pageTitle} />
          <meta property="og:description" content={pageMeta} />
          <meta property="og:type" content="article" />
          <meta property="og:url" content={canonicalUrl} />
          <meta property="og:locale" content={ogLocale} />
          <meta property="og:image" content={`${getCanonicalBase(region)}/Algorythmos.png`} />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={pageTitle} />
          <meta name="twitter:description" content={pageMeta} />
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Article",
              "headline": pageTitle,
              "description": pageMeta,
              "datePublished": pageDate,
              "author": { "@type": "Organization", "name": "Algorythmos" },
              "publisher": { "@type": "Organization", "name": "Algorythmos", "logo": { "@type": "ImageObject", "url": "https://algorythmos.com/Algorythmos.png" } },
              "mainEntityOfPage": { "@type": "WebPage", "@id": canonicalUrl }
            })}
          </script>
        </Helmet>

        <div className="fixed top-0 w-full z-50 glass-card border-b border-white/5 backdrop-blur-md bg-black/50">
          <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
            <Link to={getRegionPath("/")} className="flex items-center space-x-3">
              {/* Replaced 'A' symbol with actual logo */}
              <img
                src="/logo-full.png"
                alt="Algorythmos"
                className="h-10 w-auto object-contain"
              />
              <span className="text-sm font-extrabold tracking-tighter uppercase text-slate-500 font-medium pt-1">
                {slug === "pulse-clinical-ai" ? "| Pulse" : "| Insights"}
              </span>
            </Link>
            <Link to={getRegionPath("/contact")} className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-2 rounded-full text-xs font-black shadow-lg shadow-indigo-500/20 hover:scale-105 transition-transform">
              Start Transformation
            </Link>
          </div>
        </div>

        <main className="pt-16">
          <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-white">Loading Insights...</div>}>
            {renderLayout(post)}
          </Suspense>
        </main>
      </div>
    </>
  );
}
