import React from "react";
import { MeshHero, ProseContent, GlassCard } from "../../../components/ui/blog/BlogRefactorSystem";
import { BlogChart } from "../../../components/ui/blog/BlogChart";

export const GdprAiLayout = ({ t, post }) => {
    const chartData = {
        labels: [
            t("blogDetail.posts.gdpr-ai.chart.labels.0"),
            t("blogDetail.posts.gdpr-ai.chart.labels.1"),
            t("blogDetail.posts.gdpr-ai.chart.labels.2"),
            t("blogDetail.posts.gdpr-ai.chart.labels.3"),
        ],
        datasets: [
            {
                data: [40, 25, 20, 15],
                backgroundColor: ["#3b82f6", "#8b5cf6", "#10b981", "#f43f5e"],
                borderWidth: 0,
                hoverOffset: 10
            }
        ]
    };

    return (
        <div className="min-h-screen bg-[#020617] text-white">
            <MeshHero
                title={post.title}
                subtitle={post.meta}
                date={post.date}
                category="Regulatory Compliance"
            />

            <div className="max-w-3xl mx-auto px-6 pb-24 space-y-12">
                <GlassCard>
                    <ProseContent>
                        <h2>{post.content[0].heading}</h2>
                        {post.content[0].paragraphs?.map((p, i) => <p key={i}>{p}</p>)}
                    </ProseContent>
                </GlassCard>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <BlogChart
                        type="doughnut"
                        data={chartData}
                        title={t("blogDetail.posts.gdpr-ai.chart.title")}
                        caption={t("blogDetail.posts.gdpr-ai.chart.caption")}
                        height="h-64"
                    />
                    <div className="text-slate-400 text-sm italic leading-relaxed">
                        "Compliance isn't just a legal hurdle; it's a design constraint. By allocating resources to these four pillars, SMEs can navigate the EU AI Act with confidence."
                    </div>
                </div>

                <GlassCard>
                    <ProseContent>
                        <ul>
                            {post.content[1].list?.map((item, i) => <li key={i}>{item}</li>)}
                        </ul>
                        <h3>{post.content[2]?.heading}</h3>
                        {post.content[2]?.paragraphs?.map((p, i) => <p key={i}>{p}</p>)}
                    </ProseContent>
                </GlassCard>
            </div>
        </div>
    );
};
