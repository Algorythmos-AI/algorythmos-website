import React from "react";
import { MeshHero, ProseContent, GlassCard } from "../../../components/ui/blog/BlogRefactorSystem";

export const StandardLayout = ({ t: _t, post }) => {
    return (
        <div className="min-h-screen bg-[#020617] text-white">
            <MeshHero
                title={post.title}
                subtitle={post.meta}
                date={post.date}
                category="General Insights"
            />

            <div className="max-w-3xl mx-auto px-6 pb-24 space-y-12">
                {post.content.map((section, idx) => (
                    <GlassCard key={idx}>
                        <ProseContent>
                            {section.heading && <h2>{section.heading}</h2>}
                            {section.paragraphs?.map((p, i) => <p key={i}>{p}</p>)}
                            {section.list && (
                                <ul>
                                    {section.list.map((item, i) => <li key={i}>{item}</li>)}
                                </ul>
                            )}
                        </ProseContent>
                    </GlassCard>
                ))}
            </div>
        </div>
    );
};
