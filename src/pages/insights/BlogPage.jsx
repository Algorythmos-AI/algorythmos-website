import React from "react";
import { Helmet } from "react-helmet-async";
import { PenTool, Shield, Cpu, Layers } from "lucide-react";
import { Link } from "react-router-dom";
import { useI18n } from "../../app/i18n/I18nContext.jsx";

const BlogPage = () => {
  const { t, region } = useI18n();

  const blogPosts = [
    {
      icon: Shield,
      title: t("blog.posts.0.title"),
      snippet: t("blog.posts.0.snippet"),
      date: t("blog.posts.0.date"),
      gradient: "from-blue-500 to-purple-500",
      link: "/blog/gdpr-ai"
    },
    {
      icon: Cpu,
      title: t("blog.posts.1.title"),
      snippet: t("blog.posts.1.snippet"),
      date: t("blog.posts.1.date"),
      gradient: "from-pink-500 to-rose-500",
      link: "/blog/mlops-production"
    },
    {
      icon: Layers,
      title: t("blog.posts.2.title"),
      snippet: t("blog.posts.2.snippet"),
      date: t("blog.posts.2.date"),
      gradient: "from-green-500 to-emerald-500",
      link: "/blog/agentic-ai"
    },
    {
      icon: PenTool,
      title: t("blog.posts.3.title"),
      snippet: t("blog.posts.3.snippet"),
      date: t("blog.posts.3.date"),
      gradient: "from-yellow-500 to-orange-500",
      link: "/blog/llmsecops"
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      <Helmet>
        <title>{t("blog.meta.title")}</title>
        <meta name="description" content={t("blog.meta.description")} />
        <meta property="og:title" content={t("blog.meta.title")} />
        <meta property="og:description" content={t("blog.meta.description")} />
        <meta property="og:locale" content={region === "FR" ? "fr_FR" : "en_US"} />
      </Helmet>

      <main className="pt-32 md:pt-40 pb-20 px-4 sm:px-6 md:px-12 max-w-6xl mx-auto text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          {t("blog.hero.title")}
        </h1>
        <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 mb-16 leading-relaxed">
          {t("blog.hero.subtitle")}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 lg:gap-12">
          {blogPosts.map((post, index) => {
            const Icon = post.icon;
            return (
              <Link
                key={index}
                to={post.link}
                className="group relative p-6 sm:p-8 bg-gradient-to-br from-gray-900/60 to-black/60 rounded-3xl 
                border border-gray-800/50 hover:border-white/20 backdrop-blur-xl transition-all duration-700 
                transform hover:scale-105 hover:-translate-y-4 overflow-hidden shadow-lg"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${post.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-700`} />
                <div className="relative z-10 text-left">
                  <div className={`inline-flex p-4 bg-gradient-to-br ${post.gradient} rounded-2xl mb-6`}>
                    <Icon className="w-8 h-8 sm:w-10 sm:h-10" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold mb-2">{post.title}</h3>
                  <p className="text-sm sm:text-base text-gray-400 mb-4">{post.snippet}</p>
                  <span className="text-xs sm:text-sm text-gray-500">{post.date}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default BlogPage;
