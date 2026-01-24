import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2 } from "lucide-react";

/**
 * ReadingProgressBar
 * A fixed, scroll-linked progress bar at the top of the page.
 */
export const ReadingProgressBar = () => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const updateProgress = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrolled = (scrollTop / docHeight) * 100;
            setProgress(scrolled);
        };

        window.addEventListener("scroll", updateProgress);
        return () => window.removeEventListener("scroll", updateProgress);
    }, []);

    return (
        <div className="fixed top-0 left-0 w-full h-1 z-[100] bg-slate-900/50 backdrop-blur-sm">
            <div
                className="h-full bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 transition-all duration-150 ease-out"
                style={{ width: `${progress}%` }}
            />
        </div>
    );
};

/**
 * MeshHero
 * A premium hero section with radial gradient mesh background.
 */
export const MeshHero = ({ title, subtitle, date, category, author }) => {
    return (
        <div className="relative w-full py-24 lg:py-32 overflow-hidden">
            {/* Mesh Background */}
            <div className="absolute inset-0 bg-[#020617]">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[128px]" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-[128px]" />
            </div>

            <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
                {category && (
                    <div className="inline-flex items-center gap-2 px-3 py-1 mb-8 rounded-full bg-slate-900/50 border border-white/10 backdrop-blur-md">
                        <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                        <span className="text-xs font-bold tracking-widest text-indigo-300 uppercase">
                            {category}
                        </span>
                    </div>
                )}

                <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white tracking-tighter mb-6 leading-[1.1]">
                    {title}
                </h1>

                {subtitle && (
                    <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed mb-8">
                        {subtitle}
                    </p>
                )}

                <div className="flex items-center justify-center gap-6 text-sm font-medium text-slate-500">
                    {author && <span>{author}</span>}
                    {date && (
                        <>
                            <span className="w-1 h-1 rounded-full bg-slate-700" />
                            <span>{date}</span>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

/**
 * GlassCard
 * A container with glassmorphism styling for content blocks.
 */
export const GlassCard = ({ children, className = "", hoverEffect = false }) => {
    return (
        <div
            className={`
        bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 or-p-8
        transition-all duration-300
        ${hoverEffect ? "hover:shadow-[0_0_20px_rgba(124,58,237,0.2)] hover:border-violet-500/30 hover:-translate-y-1" : ""}
        ${className}
      `}
        >
            {children}
        </div>
    );
};

/**
 * StepRoadmap
 * A vertical list of steps for processes or lifecycles.
 * Expects an array of steps: { title, description, badge (optional) }
 */
export const StepRoadmap = ({ steps }) => {
    return (
        <div className="space-y-4 my-12">
            {steps.map((step, index) => (
                <div
                    key={index}
                    className="group relative flex gap-6 p-6 rounded-2xl bg-slate-900/40 border border-white/5 hover:bg-slate-900/80 hover:border-violet-500/30 transition-all duration-300"
                >
                    {/* Number / Line */}
                    <div className="flex flex-col items-center">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-800 border border-white/10 text-slate-400 font-bold text-sm group-hover:bg-violet-500/20 group-hover:text-violet-300 group-hover:border-violet-500/50 transition-colors">
                            {index + 1}
                        </div>
                        {index !== steps.length - 1 && (
                            <div className="w-px h-full bg-white/5 my-2 group-hover:bg-violet-500/20 transition-colors" />
                        )}
                    </div>

                    <div className="flex-1 pt-1">
                        <div className="flex flex-wrap items-center justify-between gap-4 mb-2">
                            <h3 className="text-lg font-bold text-white group-hover:text-violet-200 transition-colors">
                                {step.title}
                            </h3>
                            {step.badge && (
                                <span className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 rounded border border-emerald-500/20">
                                    {step.badge}
                                </span>
                            )}
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            {step.description}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
};

/**
 * ProseContent
 * Wrapper for standard text content to ensure correct typography color.
 */
export const ProseContent = ({ children }) => {
    return (
        <div className="prose prose-invert prose-lg max-w-none text-slate-400 prose-headings:text-white prose-headings:font-bold prose-headings:tracking-tight prose-strong:text-white prose-a:text-indigo-400 hover:prose-a:text-indigo-300 transition-colors">
            {children}
        </div>
    );
};
