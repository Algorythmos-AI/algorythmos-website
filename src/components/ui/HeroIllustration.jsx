import React from "react";
import { Bot, FileText, BarChart2 } from "lucide-react";

// CSS-only animated progress bar
const AnimatedProgressBar = ({ colorFrom, colorTo, delay = 0 }) => (
  <div className="mt-2 w-full h-2 rounded bg-white/10 overflow-hidden">
    <div 
      className="h-full animate-[slideProgress_2.7s_ease-in-out_infinite]"
      style={{ 
        background: `linear-gradient(to right, ${colorFrom}, ${colorTo})`,
        animationDelay: `${delay}s`
      }}
    />
  </div>
);

// CSS-only pulsing orb
const PulsingOrb = ({ left }) => (
  <span
    className="absolute top-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 shadow-[0_0_12px_rgba(236,72,153,0.6)] animate-[flowPulse_1.8s_ease-in-out_infinite]"
    style={{ left }}
  />
);

export default function HeroIllustration({ title = "AI-Powered Agentic Automation" }) {
  return (
    <div className="relative mx-auto w-full max-w-md h-72 lg:h-96 rounded-3xl border border-white/10 bg-gradient-to-br from-gray-900/60 to-black/60 overflow-hidden shadow-2xl hover:scale-105 transition">
      {/* Inject keyframes via style tag */}
      <style>{`
        @keyframes slideProgress {
          0%, 100% { transform: translateX(-100%); }
          50% { transform: translateX(0); }
        }
        @keyframes flowPulse {
          0%, 100% { left: 12%; }
          50% { left: 88%; }
        }
        @keyframes pulseScale {
          0%, 100% { transform: scale(0.95); }
          50% { transform: scale(1); }
        }
        @keyframes fadeUpIn {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Background glows */}
      <div className="pointer-events-none absolute -top-16 -left-16 w-56 h-56 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 blur-3xl opacity-30" />
      <div className="pointer-events-none absolute -bottom-20 -right-16 w-64 h-64 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 blur-3xl opacity-30" />

      {/* Title */}
      <div className="absolute top-4 left-4 z-20">
        <span className="text-xs md:text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
          {title}
        </span>
      </div>

      {/* Workflow panel */}
      <div className="absolute inset-0 z-10 flex items-center justify-center px-5">
        <div className="w-full grid grid-cols-3 gap-4 items-center">
          {/* Input */}
          <div
            className="rounded-2xl p-4 h-32 bg-white/5 border border-white/10 backdrop-blur-md flex flex-col items-center justify-center animate-[fadeUpIn_0.6s_ease-out_0.1s_forwards] opacity-0"
          >
            <FileText className="w-7 h-7 text-pink-300 mb-2" />
            <div className="text-xs text-gray-300">Incoming Docs / Emails</div>
            <AnimatedProgressBar colorFrom="#ec4899" colorTo="#a855f7" />
          </div>

          {/* Agent */}
          <div
            className="relative rounded-full h-28 w-28 mx-auto flex items-center justify-center border border-white/10 bg-gradient-to-br from-gray-800/60 to-black/60 animate-[pulseScale_2.2s_ease-in-out_infinite]"
          >
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-indigo-500/20 blur-xl" />
            <Bot className="relative z-10 w-8 h-8 text-purple-300" />
            <span className="absolute -bottom-6 text-[10px] text-gray-400">AI Agent</span>
          </div>

          {/* Output */}
          <div
            className="rounded-2xl p-4 h-32 bg-white/5 border border-white/10 backdrop-blur-md flex flex-col items-center justify-center animate-[fadeUpIn_0.6s_ease-out_0.2s_forwards] opacity-0"
          >
            <BarChart2 className="w-7 h-7 text-indigo-300 mb-2" />
            <div className="text-xs text-gray-300">Structured Data / Dashboards</div>
            <AnimatedProgressBar colorFrom="#6366f1" colorTo="#a855f7" delay={0.4} />
          </div>

          {/* Flow pulse */}
          <div className="col-span-3 relative h-6 mt-3">
            <div className="absolute left-[12%] right-[12%] top-1/2 -translate-y-1/2 h-[2px] bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500/60 opacity-60" />
            <PulsingOrb left="12%" />
          </div>
        </div>
      </div>
    </div>
  );
}


