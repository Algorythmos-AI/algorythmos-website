import React from "react";
import { MeshHero, ProseContent, GlassCard, StepRoadmap } from "../../../components/ui/blog/BlogRefactorSystem";
import { BlogChart } from "../../../components/ui/blog/BlogChart";
import { Shield, Lock, Eye, FileWarning } from "lucide-react";

export const LlmSecOpsLayout = ({ t, post }) => {
    // 1. Radar Chart: Security Perimeter
    const radarData = {
        labels: [
            t("blogDetail.posts.llmsecops.radar.labels.0"),
            t("blogDetail.posts.llmsecops.radar.labels.1"),
            t("blogDetail.posts.llmsecops.radar.labels.2"),
            t("blogDetail.posts.llmsecops.radar.labels.3"),
            t("blogDetail.posts.llmsecops.radar.labels.4"),
        ],
        datasets: [
            {
                label: t("blogDetail.posts.llmsecops.radar.s1"), // Ad-hoc
                data: [30, 15, 25, 40, 10],
                borderColor: "#f43f5e", // Rose
                backgroundColor: "rgba(244, 63, 94, 0.2)",
            },
            {
                label: t("blogDetail.posts.llmsecops.radar.s2"), // LLMSecOps
                data: [92, 95, 88, 98, 94],
                borderColor: "#10b981", // Emerald
                backgroundColor: "rgba(16, 185, 129, 0.2)",
            }
        ]
    };

    // 2. Doughnut Chart: Threat Distribution
    const doughnutData = {
        labels: [
            t("blogDetail.posts.llmsecops.threat.labels.0"),
            t("blogDetail.posts.llmsecops.threat.labels.1"),
            t("blogDetail.posts.llmsecops.threat.labels.2"),
            t("blogDetail.posts.llmsecops.threat.labels.3"),
        ],
        datasets: [
            {
                data: [35, 30, 20, 15],
                backgroundColor: ["#f43f5e", "#f59e0b", "#8b5cf6", "#64748b"],
                borderWidth: 0,
                hoverOffset: 10
            }
        ]
    };

    // 3. Roadmap Data (LLMSecOps Lifecycle)
    const roadmapSteps = [0, 1, 2, 3, 4].map(i => ({
        title: t(`blogDetail.posts.llmsecops.roadmap.steps.${i}.title`),
        description: t(`blogDetail.posts.llmsecops.roadmap.steps.${i}.desc`),
        badge: t(`blogDetail.posts.llmsecops.roadmap.steps.${i}.badge`)
    }));

    // Re-used grid cards logic for visual filler if needed, but prioritizing Charts primarily as requested
    const vulnerabilityCards = [
        { icon: Shield, color: "text-rose-500", i: 0 },
        { icon: Eye, color: "text-blue-500", i: 1 },
        { icon: Lock, color: "text-emerald-500", i: 2 },
        { icon: FileWarning, color: "text-amber-500", i: 3 }
    ].map((meta) => ({
        ...meta,
        title: t(`blogDetail.posts.llmsecops.grid.cards.${meta.i}.title`),
        desc: t(`blogDetail.posts.llmsecops.grid.cards.${meta.i}.desc`)
    }));

    return (
        <div className="min-h-screen bg-[#020617] text-white">
            <MeshHero
                title={post.title}
                subtitle={post.meta}
                date={post.date}
                category="Security & Compliance"
            />

            <div className="max-w-3xl mx-auto px-6 pb-24 space-y-10 md:space-y-16">

                {/* Section 1: Intro + Radar */}
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
                        title={t("blogDetail.posts.llmsecops.radar.title")}
                        height="h-96"
                    />
                </section>

                {/* Section 2: Threat Landscape (Doughnut) */}
                <section className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                        <BlogChart
                            type="doughnut"
                            data={doughnutData}
                            title={t("blogDetail.posts.llmsecops.threat.title")}
                            height="h-64"
                        />
                        <div className="space-y-4">
                            {vulnerabilityCards.slice(0, 2).map((card, i) => (
                                <div key={i} className="p-4 rounded-xl bg-slate-900/40 border border-white/5 flex items-start gap-4">
                                    <card.icon className={`${card.color} shrink-0`} size={20} />
                                    <div>
                                        <h4 className="font-bold text-sm text-white">{card.title}</h4>
                                        <p className="text-xs text-slate-400">{card.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Section 3: Lifecycle Roadmap */}
                <section className="space-y-8">
                    <div className="text-center">
                        <h2 className="text-3xl font-black tracking-tight text-white mb-2">The LLMSecOps Lifecycle</h2>
                        <p className="text-slate-400">Security is not a feature; it's a continuous process.</p>
                    </div>
                    <StepRoadmap steps={roadmapSteps} />
                </section>

                {/* Section 4: Security Guardrails (Highlight) */}
                <GlassCard className="border-l-4 border-rose-600 bg-rose-900/5">
                    <ProseContent>
                        <h2>Strategic Implementation</h2>
                        <ul>
                            {post.content[1].list?.map((item, i) => <li key={i}>{item}</li>)}
                        </ul>
                    </ProseContent>
                </GlassCard>

            </div>
        </div>
    );
};
