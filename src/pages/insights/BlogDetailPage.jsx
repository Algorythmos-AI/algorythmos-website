import React from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useI18n } from "../../app/i18n/I18nContext";
import { getCanonicalUrl, getOgLocale, generateHreflangLinks, getCanonicalBase } from "../../app/utils/seoHelpers.js";
import SeoBreadcrumbs from "../../app/seo/SeoBreadcrumbs.jsx";
import { lazy, Suspense } from "react";

const PulseContent = lazy(() => import("./PulseContent.jsx"));

// Blog structure definitions (content comes from i18n)
const blogStructures = {
  "gdpr-ai": {
    content: [
      { heading: true, paragraphs: [0, 1] },
      { heading: true, list: [0, 1, 2, 3] },
      { heading: true, paragraphs: [0, 1] },
    ],
  },
  "mlops-production": {
    content: [
      { heading: true, paragraphs: [0, 1] },
      { heading: true, list: [0, 1, 2, 3] },
      { heading: true, paragraphs: [0] },
    ],
  },
  "agentic-ai": {
    content: [
      { heading: true, paragraphs: [0] },
      { heading: true, list: [0, 1, 2, 3] },
    ],
  },
  "llmsecops": {
    content: [
      { heading: true, paragraphs: [0] },
      { heading: true, list: [0, 1, 2, 3] },
    ],
  },
  "ai-websites-advantage": {
    content: [
      { heading: true, paragraphs: [0, 1] },
      { heading: true, list: [0, 1, 2, 3] },
    ],
  },
  "voice-ai-automation": {
    content: [
      { heading: true, paragraphs: [0] },
      { heading: true, list: [0, 1, 2, 3] },
    ],
  },
  "chatbots-agents-rag": {
    content: [
      { heading: true, paragraphs: [0] },
      { heading: true, list: [0, 1, 2, 3] },
    ],
  },
  "future-sme-websites": {
    content: [
      { heading: true, paragraphs: [0] },
      { heading: true, list: [0, 1, 2] },
    ],
  },
  "core-web-vitals": {
    content: [
      { heading: true, paragraphs: [0] },
      { heading: true, list: [0, 1, 2, 3] },
    ],
  },
  "ai-consultancy-australia": {
    content: [
      { heading: true, paragraphs: [0] },
      { heading: true, list: [0, 1, 2, 3] },
    ],
  },
  "clinical-ai-healthcare": {
    content: [
      { heading: true, paragraphs: [0, 1] },
      { heading: true, list: [0, 1, 2, 3] },
      { heading: true, paragraphs: [0] },
      { heading: true, list: [0, 1, 2, 3] },
      { heading: true, paragraphs: [0, 1] },
    ],
  },
};

const blogSlugs = [
  "gdpr-ai", "mlops-production", "agentic-ai", "llmsecops",
  "ai-websites-advantage", "voice-ai-automation", "chatbots-agents-rag",
  "future-sme-websites", "core-web-vitals", "ai-consultancy-australia",
  "clinical-ai-healthcare"
];

export default function BlogDetailPage() {
  const { t, region, getRegionPath } = useI18n();
  const { slug } = useParams();

  // SEO helpers
  const canonicalUrl = getCanonicalUrl(region, `/blog/${slug}`);
  const ogLocale = getOgLocale(region);
  const hreflangLinks = generateHreflangLinks(`/blog/${slug}`);

  // Check if slug is valid
  const isValidSlug = blogSlugs.includes(slug) || slug === "pulse-clinical-ai";

  // Special case for Pulse Playbook
  if (slug === "pulse-clinical-ai") {
    // SEO setup for Pulse is handled inside PulseContent or duplicated here?
    // Let's duplicate the SEO wrapper here for consistency across all blog posts
    // and just render the content
    const pulseTitle = t("blogDetail.posts.pulse-clinical-ai.title");
    const pulseMeta = t("blogDetail.posts.pulse-clinical-ai.meta");
    const pulseDate = t("blogDetail.posts.pulse-clinical-ai.date");

    return (
      <div className="min-h-screen bg-black text-white overflow-hidden relative">
        <Helmet>
          <title>{pulseTitle} | Algorythmos</title>
          <meta name="description" content={pulseMeta} />
          <link rel="canonical" href={canonicalUrl} />
          {hreflangLinks.map(({ hreflang, href }) => (
            <link key={hreflang} rel="alternate" hreflang={hreflang} href={href} />
          ))}
          <meta property="og:title" content={pulseTitle} />
          <meta property="og:description" content={pulseMeta} />
          <meta property="og:type" content="article" />
          <meta property="og:url" content={canonicalUrl} />
          <meta property="og:locale" content={ogLocale} />
          <meta property="og:image" content={`${getCanonicalBase(region)}/Algorythmos.png`} />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={pulseTitle} />
          <meta name="twitter:description" content={pulseMeta} />
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Article",
              "headline": pulseTitle,
              "description": pulseMeta,
              "datePublished": pulseDate,
              "author": {
                "@type": "Organization",
                "name": "Algorythmos"
              },
              "publisher": {
                "@type": "Organization",
                "name": "Algorythmos",
                "url": "https://algorythmos.com",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://algorythmos.com/Algorythmos.png"
                }
              },
              "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": canonicalUrl
              }
            })}
          </script>
        </Helmet>

        <div className="fixed top-0 w-full z-50 glass-card border-b border-white/5 backdrop-blur-md bg-black/50">
          <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
            <Link to={getRegionPath("/")} className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded flex items-center justify-center text-white font-black">A</div>
              <span className="text-sm font-extrabold tracking-tighter uppercase text-white">Algorythmos <span className="text-slate-500 font-medium">| Pulse</span></span>
            </Link>
            <Link to={getRegionPath("/contact")} className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-2 rounded-full text-xs font-black shadow-lg shadow-indigo-500/20 hover:scale-105 transition-transform">
              Start Transformation
            </Link>
          </div>
        </div>

        <main className="pt-16">
          <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-white">Loading Pulse...</div>}>
            <PulseContent t={t} getRegionPath={getRegionPath} />
          </Suspense>
        </main>
      </div>
    );
  }

  // Build post from translations
  const post = isValidSlug ? {
    title: t(`blogDetail.posts.${slug}.title`),
    meta: t(`blogDetail.posts.${slug}.meta`),
    date: t(`blogDetail.posts.${slug}.date`),
    content: blogStructures[slug].content.map((section, idx) => ({
      heading: section.heading ? t(`blogDetail.posts.${slug}.content.${idx}.heading`) : null,
      paragraphs: section.paragraphs?.map((pIdx) =>
        t(`blogDetail.posts.${slug}.content.${idx}.paragraphs.${pIdx}`)
      ),
      list: section.list?.map((lIdx) =>
        t(`blogDetail.posts.${slug}.content.${idx}.list.${lIdx}`)
      ),
    })),
  } : null;

  if (!post) {
    return (
      <div className="min-h-screen bg-black text-white">
        <main className="pt-40 pb-20 px-6 max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-black mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            {t("blogDetail.notFound.title")}
          </h1>
          <p className="text-gray-400">{t("blogDetail.notFound.message")}</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/10 to-black" />
      </div>

      <Helmet>
        <title>{post.title} | Algorythmos</title>
        <meta name="description" content={post.meta} />
        <link rel="canonical" href={canonicalUrl} />
        {hreflangLinks.map(({ hreflang, href }) => (
          <link key={hreflang} rel="alternate" hreflang={hreflang} href={href} />
        ))}
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.meta} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:locale" content={ogLocale} />
        <meta property="og:image" content={`${getCanonicalBase(region)}/Algorythmos.png`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.meta} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": post.title,
            "description": post.meta,
            "datePublished": post.date,
            "author": {
              "@type": "Organization",
              "name": "Algorythmos"
            },
            "publisher": {
              "@type": "Organization",
              "name": "Algorythmos",
              "url": "https://algorythmos.com",
              "logo": {
                "@type": "ImageObject",
                "url": "https://algorythmos.com/Algorythmos.png"
              }
            },
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": canonicalUrl
            }
          })}
        </script>
      </Helmet>
      <SeoBreadcrumbs items={[
        { name: "Home", path: "/" },
        { name: t("nav.blog"), path: "/blog" },
        { name: post.title, path: `/blog/${slug}` }
      ]} />

      <main className="pt-40 pb-24 px-6">
        <article className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-black mb-2">
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              {post.title}
            </span>
          </h1>
          <div className="text-sm text-gray-400 mb-10">{post.date}</div>

          <p className="text-lg text-gray-300 mb-10 italic">{post.meta}</p>

          <div className="space-y-10">
            {post.content.map((section, idx) => (
              <section key={idx}>
                {section.heading && (
                  <h2 className="text-2xl font-bold mb-3">{section.heading}</h2>
                )}
                {section.paragraphs && (
                  <div className="space-y-4">
                    {section.paragraphs.map((p, i) => (
                      <p key={i} className="text-gray-200 leading-relaxed">{p}</p>
                    ))}
                  </div>
                )}
                {section.list && (
                  <ul className="list-disc pl-6 text-gray-200 space-y-2">
                    {section.list.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>

          <div className="mt-12">
            <Link
              to={getRegionPath("/contact")}
              className="group relative inline-flex items-center justify-center px-8 py-4 rounded-2xl font-semibold text-lg bg-gradient-to-r from-blue-600 to-purple-600 overflow-hidden"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              <span className="relative">{t("blogDetail.cta.text")}</span>
            </Link>
          </div>
        </article>
      </main>
    </div>
  );
}


