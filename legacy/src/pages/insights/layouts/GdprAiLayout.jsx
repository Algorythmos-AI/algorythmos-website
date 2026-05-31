import React from "react";
import { MeshHero, ProseContent, GlassCard, StepRoadmap } from "../../../components/ui/blog/BlogRefactorSystem";
import { BlogChart } from "../../../components/ui/blog/BlogChart";

export const GdprAiLayout = ({ t, post }) => {
    // 1. Radar Chart: Compliance Compass (Legacy vs GDPR-Ready)
    const radarData = {
        labels: [
            t("blogDetail.posts.gdpr-ai.radar.labels.0"),
            t("blogDetail.posts.gdpr-ai.radar.labels.1"),
            t("blogDetail.posts.gdpr-ai.radar.labels.2"),
            t("blogDetail.posts.gdpr-ai.radar.labels.3"),
            t("blogDetail.posts.gdpr-ai.radar.labels.4"),
        ],
        datasets: [
            {
                label: t("blogDetail.posts.gdpr-ai.radar.s1"), // Legacy SME
                data: [40, 20, 35, 15, 50],
                borderColor: "#94a3b8",
                backgroundColor: "rgba(148, 163, 184, 0.2)",
            },
            {
                label: t("blogDetail.posts.gdpr-ai.radar.s2"), // GDPR-Ready
                data: [95, 88, 92, 90, 98],
                borderColor: "#10b981", // Emerald
                backgroundColor: "rgba(16, 185, 129, 0.2)",
            }
        ]
    };

    // 2. Doughnut Chart: Pillar Distribution
    const doughnutData = {
        labels: [
            t("blogDetail.posts.gdpr-ai.chart.labels.0"),
            t("blogDetail.posts.gdpr-ai.chart.labels.1"),
            t("blogDetail.posts.gdpr-ai.chart.labels.2"),
            t("blogDetail.posts.gdpr-ai.chart.labels.3"),
        ],
        datasets: [
            {
                data: [35, 25, 20, 20],
                backgroundColor: ["#3b82f6", "#8b5cf6", "#10b981", "#f43f5e"],
                borderWidth: 0,
                hoverOffset: 10
            }
        ]
    };

    // 3. Roadmap Data: 5-Step Compliance Sprint
    const roadmapSteps = [0, 1, 2, 3, 4].map(i => ({
        title: t(`blogDetail.posts.gdpr-ai.roadmap.steps.${i}.title`),
        description: t(`blogDetail.posts.gdpr-ai.roadmap.steps.${i}.desc`),
        badge: t(`blogDetail.posts.gdpr-ai.roadmap.steps.${i}.badge`)
    }));

    return (
        <div className="min-h-screen bg-[#020617] text-white">
            <MeshHero
                title={post.title}
                subtitle={post.meta}
                date={post.date}
                category="Regulatory Compliance"
            />

            <div className="max-w-3xl mx-auto px-6 pb-24 space-y-16">

                {/* Section 1: Introduction + Compliance Compass */}
                <section className="space-y-8">
                    <GlassCard>
                        <ProseContent>
                            <h2>{post.content[0].heading}</h2>
                            {post.content[0].paragraphs?.map((p, i) => <p key={i}>{p}</p>)}
                        </ProseContent>
                    </GlassCard>

                    <BlogChart
                        type="radar"
                        data={radarData}
                        title={t("blogDetail.posts.gdpr-ai.radar.title")}
                        height="h-96"
                    />
                </section>

                {/* Section 2: Four Pillars */}
                <section className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                        <BlogChart
                            type="doughnut"
                            data={doughnutData}
                            title={t("blogDetail.posts.gdpr-ai.chart.title")}
                            caption={t("blogDetail.posts.gdpr-ai.chart.caption")}
                            height="h-64"
                        />
                        <div className="text-slate-400 text-sm italic leading-relaxed bg-slate-900/40 p-6 rounded-2xl border border-white/5">
                            "Compliance isn't just a legal hurdle; it's a design constraint. By allocating resources to these four pillars, SMEs can navigate the EU AI Act with confidence."
                        </div>
                    </div>

                    <GlassCard>
                        <ProseContent>
                            <ul>
                                {post.content[1].list?.map((item, i) => <li key={i}>{item}</li>)}
                            </ul>
                        </ProseContent>
                    </GlassCard>
                </section>

                {/* Section 3: 5-Step Sprint Roadmap */}
                <section className="space-y-8">
                    <div className="text-center">
                        <h2 className="text-3xl font-black tracking-tight text-white mb-2">5-Step Compliance Sprint</h2>
                        <p className="text-slate-400">A clear path from audit to audit-proof.</p>
                    </div>
                    <StepRoadmap steps={roadmapSteps} />
                </section>

                {/* Section 4: Action Plan (High Highlight) */}
                <section>
                    <GlassCard className="border-l-4 border-teal-500 bg-teal-900/10">
                        <ProseContent>
                            <h3>{post.content[2]?.heading}</h3>
                            {post.content[2]?.paragraphs?.map((p, i) => <p key={i}>{p}</p>)}
                        </ProseContent>
                    </GlassCard>
                </section>

            </div>
        </div>
    );
};
