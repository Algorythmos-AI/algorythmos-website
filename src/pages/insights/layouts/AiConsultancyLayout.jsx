import React from "react";
import { MeshHero, ProseContent, GlassCard } from "../../../components/ui/blog/BlogRefactorSystem";
import { BlogChart } from "../../../components/ui/blog/BlogChart";

export const AiConsultancyLayout = ({ t, post }) => {
    const chartData = {
        labels: [
            t("blogDetail.posts.ai-consultancy-australia.chart.labels.0"),
            t("blogDetail.posts.ai-consultancy-australia.chart.labels.1"),
            t("blogDetail.posts.ai-consultancy-australia.chart.labels.2"),
            t("blogDetail.posts.ai-consultancy-australia.chart.labels.3"),
        ],
        datasets: [
            {
                label: t("blogDetail.posts.ai-consultancy-australia.chart.dataset1"),
                data: [65, 45, 80, 50],
                backgroundColor: "#f59e0b",
                borderRadius: 4
            },
            {
                label: t("blogDetail.posts.ai-consultancy-australia.chart.dataset2"),
                data: [90, 85, 95, 80],
                backgroundColor: "#4f46e5",
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
                category="Industry Report"
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
                    title={t("blogDetail.posts.ai-consultancy-australia.chart.title")}
                />

                <GlassCard>
                    <ProseContent>
                        <h2>The Path Forward</h2>
                        {/* Rendering the rest of the list content commonly found in this post type */}
                        <ul>
                            {post.content[1].list?.map((item, i) => <li key={i}>{item}</li>)}
                        </ul>
                    </ProseContent>
                </GlassCard>
            </div>
        </div>
    );
};
