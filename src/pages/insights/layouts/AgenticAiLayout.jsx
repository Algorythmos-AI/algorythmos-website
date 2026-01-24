import React from "react";
import { MeshHero, ProseContent, GlassCard } from "../../../components/ui/blog/BlogRefactorSystem";
import { BlogChart } from "../../../components/ui/blog/BlogChart";

export const AgenticAiLayout = ({ t, post }) => {
    const chartData = {
        labels: [
            t("blogDetail.posts.agentic-ai.chart.labels.0"),
            t("blogDetail.posts.agentic-ai.chart.labels.1"),
            t("blogDetail.posts.agentic-ai.chart.labels.2"),
            t("blogDetail.posts.agentic-ai.chart.labels.3"),
            t("blogDetail.posts.agentic-ai.chart.labels.4"),
        ],
        datasets: [
            {
                label: t("blogDetail.posts.agentic-ai.chart.dataset1"),
                data: [40, 60, 90, 20, 10],
                borderColor: "#94a3b8",
                backgroundColor: "rgba(148, 163, 184, 0.2)",
            },
            {
                label: t("blogDetail.posts.agentic-ai.chart.dataset2"),
                data: [90, 85, 75, 95, 95],
                borderColor: "#7c3aed",
                backgroundColor: "rgba(124, 58, 237, 0.2)",
            }
        ]
    };

    return (
        <div className="min-h-screen bg-[#020617] text-white">
            <MeshHero
                title={post.title}
                subtitle={post.meta}
                date={post.date}
                category="Advanced AI Agents"
            />

            <div className="max-w-3xl mx-auto px-6 pb-24 space-y-12">
                <GlassCard>
                    <ProseContent>
                        <h2>{post.content[0].heading}</h2>
                        {post.content[0].paragraphs?.map((p, i) => <p key={i}>{p}</p>)}
                    </ProseContent>
                </GlassCard>

                <BlogChart
                    type="radar"
                    data={chartData}
                    title={t("blogDetail.posts.agentic-ai.chart.title")}
                    height="h-96"
                />

                <GlassCard>
                    <ProseContent>
                        <h2>Key Capabilities</h2>
                        <ul>
                            {post.content[1].list?.map((item, i) => <li key={i}>{item}</li>)}
                        </ul>
                    </ProseContent>
                </GlassCard>
            </div>
        </div>
    );
};
