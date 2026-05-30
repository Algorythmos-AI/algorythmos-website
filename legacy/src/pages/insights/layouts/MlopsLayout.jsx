import React from "react";
import { MeshHero, ProseContent, GlassCard, StepRoadmap } from "../../../components/ui/blog/BlogRefactorSystem";
import { BlogChart } from "../../../components/ui/blog/BlogChart";

export const MlopsLayout = ({ t, post }) => {
    // 1. Line Chart: The Performance Drift Crisis
    const lineData = {
        labels: ["M0", "M1", "M3", "M6", "M9", "M12"],
        datasets: [
            {
                label: t("blogDetail.posts.mlops-production.line.s1"), // No MLOps
                data: [95, 92, 85, 70, 55, 40], // Steep decline
                borderColor: "#f43f5e", // Rose
                backgroundColor: "rgba(244, 63, 94, 0)",
                borderDash: [5, 5],
                tension: 0.4
            },
            {
                label: t("blogDetail.posts.mlops-production.line.s2"), // Pulse MLOps
                data: [95, 95, 94, 95, 94, 95], // Stable high
                borderColor: "#10b981", // Emerald
                backgroundColor: "rgba(16, 185, 129, 0.1)",
                fill: true,
                tension: 0.4
            }
        ]
    };

    // 2. Roadmap Data: Production Pipeline
    // Using existing keys or creating detailed ones based on the request
    const pipelineSteps = [
        { title: "Feature Store", description: "Centralized features for consisent training and inference.", badge: "Data" },
        { title: "Automated Training", description: "Triggering retraining pipelines on data drift detection.", badge: "CI/CD" },
        { title: "Model Registry", description: "Versioning artifacts with lineage tracking.", badge: "Governance" },
        { title: "Blue/Green Deployment", description: "Zero-downtime rollout with instant rollback capability.", badge: "Ops" },
        { title: "Drift Monitoring", description: "Real-time alerts on concept drift and data quality issues.", badge: "Observability" }
    ];

    return (
        <div className="min-h-screen bg-[#020617] text-white">
            <MeshHero
                title={post.title}
                subtitle={post.meta}
                date={post.date}
                category="Engineering & DevOps"
            />

            <div className="max-w-3xl mx-auto px-6 pb-24 space-y-16">

                {/* Section 1: Intro + Line Chart */}
                <section className="space-y-8">
                    <GlassCard>
                        <ProseContent>
                            <h2>{post.content[0].heading}</h2>
                            {post.content[0].paragraphs?.map((p, i) => <p key={i}>{p}</p>)}
                        </ProseContent>
                    </GlassCard>

                    <BlogChart
                        type="line"
                        data={lineData}
                        title={t("blogDetail.posts.mlops-production.line.title")}
                        caption="Without MLOps, models are wasting assets. With MLOps, they are appreciating investments."
                    />
                </section>

                {/* Section 2: Production Pipeline Roadmap */}
                <section className="space-y-8">
                    <div className="text-center">
                        <h2 className="text-3xl font-black tracking-tight text-white mb-2">Production Pipeline</h2>
                        <p className="text-slate-400">From notebook to rock-solid production service.</p>
                    </div>
                    <StepRoadmap steps={pipelineSteps} />
                </section>

                {/* Section 3: Framework */}
                <GlassCard>
                    <ProseContent>
                        <h2>Implementation Framework</h2>
                        <ul>
                            {post.content[1].list?.map((item, i) => <li key={i}>{item}</li>)}
                        </ul>
                        {post.content[2]?.heading && <h3>{post.content[2].heading}</h3>}
                        {post.content[2]?.paragraphs?.map((p, i) => <p key={i}>{p}</p>)}
                    </ProseContent>
                </GlassCard>

            </div>
        </div>
    );
};
