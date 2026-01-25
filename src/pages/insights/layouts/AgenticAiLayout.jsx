import React from "react";
import { MeshHero, ProseContent, GlassCard } from "../../../components/ui/blog/BlogRefactorSystem";
import { BlogChart } from "../../../components/ui/blog/BlogChart";
import { BrainCircuit, databases, Cpu, ArrowRight } from "lucide-react";

export const AgenticAiLayout = ({ t, post }) => {
    // 1. Radar Chart: Reasoning Engine Comparison
    const radarData = {
        labels: [
            t("blogDetail.posts.agentic-ai.radar.labels.0"),
            t("blogDetail.posts.agentic-ai.radar.labels.1"),
            t("blogDetail.posts.agentic-ai.radar.labels.2"),
            t("blogDetail.posts.agentic-ai.radar.labels.3"),
            t("blogDetail.posts.agentic-ai.radar.labels.4"),
        ],
        datasets: [
            {
                label: t("blogDetail.posts.agentic-ai.radar.s1"), // Chatbot
                data: [40, 30, 20, 15, 95],
                borderColor: "#94a3b8",
                backgroundColor: "rgba(148, 163, 184, 0.2)",
            },
            {
                label: t("blogDetail.posts.agentic-ai.radar.s2"), // Agent
                data: [95, 85, 99, 92, 80],
                borderColor: "#7c3aed", // Violet
                backgroundColor: "rgba(124, 58, 237, 0.2)",
            }
        ]
    };

    // 2. Reasoning Loop Grid Data
    const loops = [
        { title: "Goal Setting", desc: "Decomposing user intent into sub-tasks.", icon: "🎯" },
        { title: "Planning", desc: "Selecting the optimal execution path.", icon: "🗺️" },
        { title: "Tool Selection", desc: "Identifying required APIs or Databases.", icon: "🔧" },
        { title: "Execution", desc: "Running code or queries in a sandbox.", icon: "⚡" },
        { title: "Self-Correction", desc: "Analyzing output and retrying if needed.", icon: "🔄" }
    ];

    return (
        <div className="min-h-screen bg-[#020617] text-white">
            <MeshHero
                title={post.title}
                subtitle={post.meta}
                date={post.date}
                category="Advanced AI Agents"
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
                        title={t("blogDetail.posts.agentic-ai.radar.title")}
                        height="h-96"
                    />
                </section>

                {/* Section 2: The Reasoning Loop */}
                <section className="space-y-8">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-black tracking-tight text-white mb-2">The Reasoning Loop</h2>
                        <p className="text-slate-400">How Agents think, plan, and act autonomously.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {loops.map((step, i) => (
                            <div key={i} className={`p-6 rounded-2xl border border-white/5 bg-slate-900/40 backdrop-blur-md hover:border-violet-500/30 transition-all duration-300 ${i === 4 ? "md:col-span-2" : ""}`}>
                                <div className="flex items-center gap-4 mb-3">
                                    <div className="h-10 w-10 rounded-full bg-violet-500/10 flex items-center justify-center text-xl">
                                        {step.icon}
                                    </div>
                                    <h3 className="font-bold text-white text-lg">{i + 1}. {step.title}</h3>
                                </div>
                                <p className="text-slate-400 text-sm">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Section 3: Capabilities */}
                <GlassCard>
                    <ProseContent>
                        <h2>Capabilities & Use Cases</h2>
                        <ul>
                            {post.content[1].list?.map((item, i) => <li key={i}>{item}</li>)}
                        </ul>
                    </ProseContent>
                </GlassCard>

            </div>
        </div>
    );
};
