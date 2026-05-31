import React from "react";
import { MeshHero, ProseContent, GlassCard } from "../../../components/ui/blog/BlogRefactorSystem";
import { BlogChart } from "../../../components/ui/blog/BlogChart";

export const AiWebsitesLayout = ({ t, post }) => {
    const chartData = {
        labels: [
            t("blogDetail.posts.ai-websites-advantage.chart.labels.0"),
            t("blogDetail.posts.ai-websites-advantage.chart.labels.1"),
            t("blogDetail.posts.ai-websites-advantage.chart.labels.2"),
        ],
        datasets: [
            {
                label: t("blogDetail.posts.ai-websites-advantage.chart.dataset1"),
                data: [3.5, 300, 65],
                backgroundColor: "#64748b",
                borderRadius: 4
            },
            {
                label: t("blogDetail.posts.ai-websites-advantage.chart.dataset2"),
                data: [0.4, 50, 98],
                backgroundColor: "#10b981",
                borderRadius: 4
            }
        ]
    };

    return (
        <div className="min-h-screen bg-[#020617] text-white">
            <MeshHero
                title={post.title}
                subtitle={post.meta}
                date={post.date}
                category="Web Engineering"
            />

            <div className="max-w-3xl mx-auto px-6 pb-24 space-y-12">
                <GlassCard>
                    <ProseContent>
                        <h2>{post.content[0].heading}</h2>
                        {post.content[0].paragraphs?.map((p, i) => <p key={i}>{p}</p>)}
                    </ProseContent>
                </GlassCard>

                <BlogChart
                    type="bar"
                    data={chartData}
                    title={t("blogDetail.posts.ai-websites-advantage.chart.title")}
                />

                <GlassCard>
                    <ProseContent>
                        <h2>Performance Metrics</h2>
                        <ul>
                            {post.content[1].list?.map((item, i) => <li key={i}>{item}</li>)}
                        </ul>
                    </ProseContent>
                </GlassCard>
            </div>
        </div>
    );
};
