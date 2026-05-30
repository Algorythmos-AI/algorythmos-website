import React from "react";
import { Link } from "react-router-dom";
import { useI18n } from "../../../app/i18n/I18nContext.jsx";
import { blogPosts } from "../../../data/blogData.jsx";

const RelatedPosts = ({ currentSlug }) => {
    const { t, getRegionPath } = useI18n();

    // Filter out the current post and take top 3
    const related = blogPosts
        .filter(post => post.slug !== currentSlug)
        .slice(0, 3);

    if (related.length === 0) return null;

    return (
        <section className="py-12 md:py-20 px-4 relative z-10 border-t border-white/5 bg-gradient-to-b from-black/20 to-[#020617]">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl font-bold mb-10 text-center bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    {t("blogDetail.related.title", "Continue Reading")}
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {related.map((post, index) => {
                        const Icon = post.icon;
                        return (
                            <Link
                                key={index}
                                to={getRegionPath(`/blog/${post.slug}`)}
                                className="group relative p-6 bg-gradient-to-br from-gray-900/60 to-black/60 rounded-2xl 
                border border-gray-800/50 hover:border-violet-500/40 backdrop-blur-xl transition-all duration-500 
                transform hover:scale-[1.02] hover:-translate-y-2 overflow-hidden shadow-[0_0_20px_rgba(124,58,237,0)] hover:shadow-[0_0_20px_rgba(124,58,237,0.5)] flex flex-col h-full"
                            >
                                <div className={`absolute inset-0 bg-gradient-to-br ${post.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                                <div className="relative z-10 text-left flex flex-col flex-1">
                                    <div className={`inline-flex p-3 bg-gradient-to-br ${post.gradient} rounded-xl mb-4 w-fit`}>
                                        <Icon className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className="text-lg font-bold mb-2 line-clamp-2 text-white">{t(post.titleKey)}</h3>
                                    <p className="text-sm text-gray-400 mb-4 line-clamp-3 flex-1">{t(post.snippetKey)}</p>
                                    <span className="text-xs text-gray-500 mt-auto">{t(post.dateKey)}</span>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default RelatedPosts;
