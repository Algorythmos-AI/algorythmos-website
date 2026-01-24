import React from "react";
import { Helmet } from "react-helmet-async";
import { PenTool, Shield, Cpu, Layers, Globe, Mic, Bot, Zap, BarChart3, Users, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { useI18n } from "../../app/i18n/I18nContext.jsx";
import { getCanonicalUrl, getOgLocale, generateHreflangLinks, getCanonicalBase } from "../../app/utils/seoHelpers.js";
import LocalizedCTA from "../../components/ui/LocalizedCTA.jsx";
import SeoBreadcrumbs from "../../app/seo/SeoBreadcrumbs.jsx";

const BlogPage = () => {
  const { t, region, getRegionPath } = useI18n();
  const canonicalUrl = getCanonicalUrl(region, '/blog');
  const canonicalBase = getCanonicalBase(region);
  const ogLocale = getOgLocale(region);
  const hreflangLinks = generateHreflangLinks('/blog');

  {
    icon: Heart,
      title: t("blog.posts.10.title"),
        snippet: t("blog.posts.10.snippet"),
          date: t("blog.posts.10.date"),
            gradient: "from-rose-500 to-violet-500",
              slug: "pulse-clinical-ai"
  },
  {
    icon: Users,
      title: t("blog.posts.9.title"),
        snippet: t("blog.posts.9.snippet"),
          date: t("blog.posts.9.date"),
            gradient: "from-amber-500 to-orange-500",
              slug: "ai-consultancy-australia"
  },
  {
    icon: Shield,
      title: t("blog.posts.0.title"),
        snippet: t("blog.posts.0.snippet"),
          date: t("blog.posts.0.date"),
            gradient: "from-blue-500 to-purple-500",
              slug: "gdpr-ai"
  },
  {
    icon: Cpu,
      title: t("blog.posts.1.title"),
        snippet: t("blog.posts.1.snippet"),
          date: t("blog.posts.1.date"),
            gradient: "from-pink-500 to-rose-500",
              slug: "mlops-production"
  },
  {
    icon: Layers,
      title: t("blog.posts.2.title"),
        snippet: t("blog.posts.2.snippet"),
          date: t("blog.posts.2.date"),
            gradient: "from-green-500 to-emerald-500",
              slug: "agentic-ai"
  },
  {
    icon: PenTool,
      title: t("blog.posts.3.title"),
        snippet: t("blog.posts.3.snippet"),
          date: t("blog.posts.3.date"),
            gradient: "from-yellow-500 to-orange-500",
              slug: "llmsecops"
  }
  ];

return (
  <div className="min-h-screen bg-black text-white overflow-hidden relative">
    <Helmet>
      <title>{t("blog.meta.title")}</title>
      <meta name="description" content={t("blog.meta.description")} />
      <link rel="canonical" href={canonicalUrl} />
      {hreflangLinks.map(({ hreflang, href }) => (
        <link key={hreflang} rel="alternate" hreflang={hreflang} href={href} />
      ))}
      <meta property="og:title" content={t("blog.meta.title")} />
      <meta property="og:description" content={t("blog.meta.description")} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content={`${canonicalBase}/Algorythmos.png`} />
      <meta property="og:site_name" content="Algorythmos" />
      <meta property="og:locale" content={ogLocale} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={t("blog.meta.title")} />
      <meta name="twitter:description" content={t("blog.meta.description")} />
      <meta name="twitter:image" content={`${canonicalBase}/Algorythmos.png`} />
    </Helmet>
    <SeoBreadcrumbs items={[{ name: "Home", path: "/" }, { name: t("nav.blog"), path: "/blog" }]} />

    <main className="pt-28 md:pt-36 pb-20 px-4 sm:px-6 md:px-12 max-w-6xl mx-auto text-center">
      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
        {t("blog.hero.title")}
      </h1>
      <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 mb-12 leading-relaxed max-w-3xl mx-auto">
        {t("blog.hero.subtitle")}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogPosts.map((post, index) => {
          const Icon = post.icon;
          return (
            <Link
              key={index}
              to={getRegionPath(`/blog/${post.slug}`)}
              className="group relative p-6 bg-gradient-to-br from-gray-900/60 to-black/60 rounded-2xl 
                border border-gray-800/50 hover:border-white/20 backdrop-blur-xl transition-all duration-500 
                transform hover:scale-[1.02] hover:-translate-y-2 overflow-hidden shadow-lg flex flex-col h-full"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${post.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
              <div className="relative z-10 text-left flex flex-col flex-1">
                <div className={`inline-flex p-3 bg-gradient-to-br ${post.gradient} rounded-xl mb-4 w-fit`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h2 className="text-lg sm:text-xl font-bold mb-2 line-clamp-2">{post.title}</h2>
                <p className="text-sm text-gray-400 mb-4 line-clamp-3 flex-1">{post.snippet}</p>
                <span className="text-xs text-gray-500 mt-auto">{post.date}</span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Region-specific CTA */}
      <LocalizedCTA />
    </main>
  </div>
);
};

export default BlogPage;
