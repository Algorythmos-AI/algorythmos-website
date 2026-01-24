import React from "react";
import { MeshHero, ProseContent, GlassCard, StepRoadmap } from "../../../components/ui/blog/BlogRefactorSystem";

export const MlopsLayout = ({ t, post }) => {
    const steps = [0, 1, 2, 3, 4].map(i => ({
        title: t(`blogDetail.posts.mlops-production.roadmap.steps.${i}.title`),
        description: t(`blogDetail.posts.mlops-production.roadmap.steps.${i}.desc`),
        badge: t(`blogDetail.posts.mlops-production.roadmap.steps.${i}.badge`)
    }));

    return (
        <div className="min-h-screen bg-[#020617] text-white">
            <MeshHero
                title={post.title}
                subtitle={post.meta}
                date={post.date}
                category="Engineering & DevOps"
            />

            <div className="max-w-3xl mx-auto px-6 pb-24 space-y-12">
                <GlassCard>
                    <ProseContent>
                        <h2>{post.content[0].heading}</h2>
                        {post.content[0].paragraphs?.map((p, i) => <p key={i}>{p}</p>)}
                    </ProseContent>
                </GlassCard>

                <StepRoadmap steps={steps} />

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
