import React from "react";
import { MeshHero, ProseContent, GlassCard } from "../../../components/ui/blog/BlogRefactorSystem";
import { Shield, Lock, Eye, FileWarning } from "lucide-react";

export const LlmSecOpsLayout = ({ t, post }) => {
    const cards = [
        { icon: Shield, color: "text-rose-500" },
        { icon: Eye, color: "text-blue-500" },
        { icon: Lock, color: "text-emerald-500" },
        { icon: FileWarning, color: "text-amber-500" }
    ].map((meta, i) => ({
        ...meta,
        title: t(`blogDetail.posts.llmsecops.grid.cards.${i}.title`),
        desc: t(`blogDetail.posts.llmsecops.grid.cards.${i}.desc`)
    }));

    return (
        <div className="min-h-screen bg-[#020617] text-white">
            <MeshHero
                title={post.title}
                subtitle={post.meta}
                date={post.date}
                category="Security & Compliance"
            />

            <div className="max-w-4xl mx-auto px-6 pb-24 space-y-12">
                <div className="max-w-3xl mx-auto">
                    <GlassCard>
                        <ProseContent>
                            <h2>{post.content[0].heading}</h2>
                            {post.content[0].paragraphs?.map((p, i) => <p key={i}>{p}</p>)}
                        </ProseContent>
                    </GlassCard>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {cards.map((card, i) => {
                        const Icon = card.icon;
                        return (
                            <div key={i} className="bg-slate-900/60 border border-white/10 p-6 rounded-2xl hover:border-violet-500/40 transition-colors">
                                <div className={`w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center mb-4 ${card.color}`}>
                                    <Icon size={20} />
                                </div>
                                <h3 className="text-lg font-bold mb-2">{card.title}</h3>
                                <p className="text-sm text-slate-400">{card.desc}</p>
                            </div>
                        )
                    })}
                </div>

                <div className="max-w-3xl mx-auto">
                    <GlassCard>
                        <ProseContent>
                            <ul>
                                {post.content[1].list?.map((item, i) => <li key={i}>{item}</li>)}
                            </ul>
                        </ProseContent>
                    </GlassCard>
                </div>
            </div>
        </div>
    );
};
