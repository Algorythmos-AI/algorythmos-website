import React from "react";
import { MeshHero, ProseContent, GlassCard, StepRoadmap } from "../../../components/ui/blog/BlogRefactorSystem";
import { BlogChart } from "../../../components/ui/blog/BlogChart";

export const AiConsultancyLayout = ({ t, post }) => {
    // 1. Radar Chart: AI Maturity (AU SME vs. Global Leader)
    const radarData = {
        labels: [
            t("blogDetail.posts.ai-consultancy-australia.radar.labels.0"),
            t("blogDetail.posts.ai-consultancy-australia.radar.labels.1"),
            t("blogDetail.posts.ai-consultancy-australia.radar.labels.2"),
            t("blogDetail.posts.ai-consultancy-australia.radar.labels.3"),
            t("blogDetail.posts.ai-consultancy-australia.radar.labels.4"),
        ],
        datasets: [
            {
                label: t("blogDetail.posts.ai-consultancy-australia.radar.s1"),
                data: [35, 42, 28, 30, 45],
                borderColor: "#94a3b8",
                backgroundColor: "rgba(148, 163, 184, 0.2)",
            },
            {
                label: t("blogDetail.posts.ai-consultancy-australia.radar.s2"),
                data: [88, 92, 85, 94, 90],
                borderColor: "#8b5cf6",
                backgroundColor: "rgba(139, 92, 246, 0.2)",
            }
        ]
    };

    // 2. Bubble Chart: Australian Vendor Landscape
    const bubbleData = {
        datasets: [
            {
                label: t("blogDetail.posts.ai-consultancy-australia.bubble.label.algorythmos"),
                data: [{ x: 92, y: 88, r: 15 }],
                backgroundColor: "#7c3aed", // Violet
                borderColor: "#fff",
                borderWidth: 2,
            },
            {
                label: t("blogDetail.posts.ai-consultancy-australia.bubble.label.big4"),
                data: [{ x: 85, y: 55, r: 25 }],
                backgroundColor: "#cbd5e1", // Slate 300
            },
            {
                label: t("blogDetail.posts.ai-consultancy-australia.bubble.label.offshore"),
                data: [{ x: 20, y: 75, r: 10 }],
                backgroundColor: "#f43f5e", // Rose
            },
            {
                label: t("blogDetail.posts.ai-consultancy-australia.bubble.label.generic"),
                data: [{ x: 40, y: 30, r: 8 }],
                backgroundColor: "#64748b", // Slate 500
            }
        ]
    };

    // 3. Line Chart: 24-Month ROI Projection
    const labels = ["0", "3", "6", "9", "12", "18", "24"];
    const lineData = {
        labels: labels.map(m => `Month ${m}`),
        datasets: [
            {
                label: t("blogDetail.posts.ai-consultancy-australia.roi.label.overhead"),
                data: [100, 95, 88, 75, 60, 45, 35],
                borderColor: "#f43f5e", // Rose
                backgroundColor: "rgba(244, 63, 94, 0.1)",
                tension: 0.4,
                fill: true
            },
            {
                label: t("blogDetail.posts.ai-consultancy-australia.roi.label.value"),
                data: [0, 10, 35, 80, 150, 280, 450],
                borderColor: "#10b981", // Emerald
                backgroundColor: "rgba(16, 185, 129, 0.1)",
                tension: 0.4,
                fill: true
            }
        ]
    };

    // 4. Roadmap Data (hardcoded for this visualization as mostly requested)
    const complianceSteps = [
        { title: "Privacy Act 1988 Review", description: "Audit existing data handling against Australian Privacy Principles.", badge: "Audit" },
        { title: "Data Sovereignty", description: "Ensure customer data resides on onshore servers (AWS Sydney/Melbourne).", badge: "Infrastructure" },
        { title: "Ethics Framework", description: "Establish AI guardrails aligning with Au Government's AI Ethics Principles.", badge: "Governance" },
        { title: "Security Audits", description: "Penetration testing and vulnerability scanning of AI endpoints.", badge: "Security" },
        { title: "Production Deployment", description: "Gradual rollout with human-in-the-loop monitoring.", badge: "Launch" },
    ];

    return (
        <div className="min-h-screen bg-[#020617] text-white">
            <MeshHero
                title={post.title}
                subtitle={post.meta}
                date={post.date}
                category="Industry Report"
            />

            <div className="max-w-3xl mx-auto px-6 pb-24 space-y-12 md:space-y-20">

                {/* Section 1: Introduction + Radar */}
                <section className="space-y-8">
                    <GlassCard>
                        <ProseContent>
                            <h2>{post.content[0].heading}</h2>
                            {post.content[0].paragraphs?.slice(0, 1).map((p, i) => <p key={i}>{p}</p>)}
                        </ProseContent>
                    </GlassCard>

                    <BlogChart
                        type="radar"
                        data={radarData}
                        title={t("blogDetail.posts.ai-consultancy-australia.radar.title")}
                        height="h-96"
                    />
                    <div className="text-center text-slate-400 italic text-sm max-w-lg mx-auto">
                        "The gap isn't technology; it's organizational readiness. Most SMEs struggle with data maturity, not model selection."
                    </div>
                </section>

                {/* Section 2: Vendor Landscape */}
                <section className="space-y-8">
                    <GlassCard>
                        <ProseContent>
                            {/* Rendering subsequent paragraphs from original content */}
                            {post.content[0].paragraphs?.slice(1).map((p, i) => <p key={i}>{p}</p>)}
                        </ProseContent>
                    </GlassCard>

                    <BlogChart
                        type="bubble"
                        data={bubbleData}
                        title={t("blogDetail.posts.ai-consultancy-australia.bubble.title")}
                        caption={`${t("blogDetail.posts.ai-consultancy-australia.bubble.xAxis")} vs ${t("blogDetail.posts.ai-consultancy-australia.bubble.yAxis")}`}
                    />
                </section>

                {/* Section 3: Compliance Roadmap */}
                <section className="space-y-8">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-black tracking-tight text-white mb-4">The Australian Compliance Path</h2>
                        <p className="text-slate-400">Navigating the regulatory landscape from prototype to production.</p>
                    </div>
                    <StepRoadmap steps={complianceSteps} />
                </section>

                {/* Section 4: ROI Timeline */}
                <section className="space-y-8">
                    <GlassCard>
                        <ProseContent>
                            <h2>The Economics of AI Adoption</h2>
                            <p>While initial investment focuses on infrastructure and governance, the value inflection point typically occurs at month 9, where automation efficiency overtakes operational costs.</p>
                        </ProseContent>
                    </GlassCard>

                    <BlogChart
                        type="line"
                        data={lineData}
                        title={t("blogDetail.posts.ai-consultancy-australia.roi.title")}
                    />
                </section>

                {/* Footer Content */}
                <GlassCard>
                    <ProseContent>
                        <h2>{post.content[1]?.heading || "Strategic Recommendation"}</h2>
                        <ul>
                            {post.content[1].list?.map((item, i) => <li key={i}>{item}</li>)}
                        </ul>
                    </ProseContent>
                </GlassCard>

            </div>
        </div>
    );
};
