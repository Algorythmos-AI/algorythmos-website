import React, { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * AgenticFlowPlayer
 * A step-by-step flow demo over an SVG diagram.
 * Uses CSS offset-path to drive small "packet" dots along paths.
 * Respects prefers-reduced-motion; includes controls: play/pause, step, restart, speed.
 */
export default function AgenticFlowPlayer() {
  const reduce = useReducedMotion();
  const [playing, setPlaying] = useState(!reduce);
  const [speed, setSpeed] = useState(1);     // 0.75, 1, 1.5
  const [key, setKey] = useState(0);         // rerun animations by bumping this
  const [step, setStep] = useState(0);

  // Diagram paths (must match the geometry in your existing diagram)
  const P = useMemo(() => ({
    userToPrompt: "M 210 238 H 312",
    promptToAgent: "M 442 212 H 540",
    agentToLLM: "M 700 240 V 140",
    llmToAgent: "M 760 140 V 240",
    agentToVector: "M 700 260 V 420",
    vectorToAgent: "M 760 420 V 260",
    agentToResponse: "M 540 308 H 312",
    responseToUser: "M 312 308 H 210",
    responseToVector: "M 387 330 C 520 420, 640 440, 740 420",
  }), []);

  // Timeline describing the algorithm
  const timeline = useMemo(() => ([
    {
      id: "prompt",
      title: "1) User submits prompt",
      caption: "User provides intent; system forwards structured prompt to the Agent.",
      packets: [{ path: P.userToPrompt, color: "#fff" }],
      glowIds: ["user","prompt"],
      duration: 1.2,
    },
    {
      id: "plan-llm",
      title: "2) Agent plans & calls the LLM",
      caption: "Agent interprets intent and requests reasoning/completion from the LLM.",
      packets: [
        { path: P.promptToAgent, color: "#fff" },
        { path: P.agentToLLM,   color: "#fff" },
        { path: P.llmToAgent,   color: "#fff", delay: 0.7 },
      ],
      glowIds: ["agent","llm"],
      duration: 1.8,
    },
    {
      id: "retrieve",
      title: "3) Retrieve memory from Vector DB",
      caption: "Agent fetches relevant knowledge to ground the response.",
      packets: [
        { path: P.agentToVector, color: "#34d399" },
        { path: P.vectorToAgent, color: "#34d399", delay: 0.7 },
      ],
      glowIds: ["agent","vdb"],
      duration: 1.8,
    },
    {
      id: "compose",
      title: "4) Compose response",
      caption: "Agent composes final response using LLM output + retrieved context.",
      packets: [{ path: P.agentToResponse, color: "#fff" }],
      glowIds: ["agent","response"],
      duration: 1.1,
    },
    {
      id: "deliver",
      title: "5) Deliver to user & (optional) write back to memory",
      caption: "Response returned to user; summary or artifacts may be written to memory.",
      packets: [
        { path: P.responseToUser,  color: "#fff" },
        { path: P.responseToVector, color: "#34d399", delay: 0.5 },
      ],
      glowIds: ["user","response","vdb"],
      duration: 1.6,
    },
  ]), [P]);

  // Auto-advance while playing
  useEffect(() => {
    if (reduce || !playing) return;
    const d = timeline[step]?.duration ?? 1.2;
    const t = setTimeout(() => {
      setStep(s => (s + 1) % timeline.length);
      setKey(k => k + 1);
    }, d * 1000 / speed + 100); // small buffer
    return () => clearTimeout(t);
  }, [step, playing, speed, reduce, timeline]);

  const current = timeline[step];

  // Helpers
  function restart() { setStep(0); setKey(k => k + 1); }
  function next() { setStep(s => (s + 1) % timeline.length); setKey(k => k + 1); }

  // Runner packet element using CSS motion path
  const Packet = ({ path, color = "#fff", delay = 0, duration = 1 }) => {
    if (reduce) return null;
    return (
      <motion.div
        key={`${key}-${path}-${delay}`}
        initial={{ offsetDistance: "0%" }}
        animate={{ offsetDistance: ["0%", "100%"] }}
        transition={{ duration: duration / speed, ease: "linear", delay }}
        style={{
          offsetPath: `path('${path}')`,
          // little glowing ball
          width: 10, height: 10, borderRadius: 9999,
          background: color,
          boxShadow: `0 0 10px ${color}, 0 0 18px ${color}66`,
          position: "absolute",
          top: 0, left: 0,
        }}
      />
    );
  };

  // glow helper
  const isGlowing = id => current?.glowIds?.includes(id);

  return (
    <section className="mt-10">
      {/* Controls */}
      <div className="flex items-center gap-2 justify-end mb-2">
        <button
          onClick={() => setPlaying(p => !p)}
          className="text-xs px-3 py-1 rounded-full border border-white/15 hover:border-white/30 text-gray-200"
          aria-pressed={playing}
        >
          {playing ? "Pause" : "Play"}
        </button>
        <button
          onClick={next}
          className="text-xs px-3 py-1 rounded-full border border-white/15 hover:border-white/30 text-gray-200"
        >
          Step
        </button>
        <button
          onClick={restart}
          className="text-xs px-3 py-1 rounded-full border border-white/15 hover:border-white/30 text-gray-200"
        >
          Restart
        </button>
        <label className="text-xs text-gray-400 ml-2">
          Speed
          <select
            className="ml-1 bg-black/40 border border-white/10 rounded-md text-gray-200 text-xs px-1 py-0.5"
            value={speed}
            onChange={e => setSpeed(parseFloat(e.target.value))}
            aria-label="Animation speed"
          >
            <option value={0.75}>0.75×</option>
            <option value={1}>1×</option>
            <option value={1.5}>1.5×</option>
          </select>
        </label>
      </div>

      {/* Canvas */}
      <div className="relative rounded-3xl border border-white/10 bg-gradient-to-br from-slate-950 to-indigo-950 shadow-2xl overflow-hidden">
        {/* Browser chrome */}
        <div className="h-8 rounded-t-3xl border-b border-white/10 px-3 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-400/80" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-300/80" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
        </div>

        {/* Diagram (same geometry as your current AgenticFlowDiagram) */}
        <div className="p-4 md:p-6">
          <svg viewBox="0 0 920 520" className="w-full h-auto" aria-hidden="true">
            <defs>
              <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="6" stdDeviation="10" floodColor="#000" floodOpacity="0.35" />
              </filter>
            </defs>

            {/* User */}
            <g transform="translate(70,200)" filter="url(#soft)" id="node-user">
              <rect width="140" height="120" rx="16"
                    className={`transition-colors duration-300 ${isGlowing("user") ? "stroke-emerald-400/70" : "stroke-white/10"}`}
                    fill="#0B1220" stroke="currentColor" />
              <g transform="translate(16,18)">
                <circle cx="20" cy="20" r="14" fill="#A7F3D0" />
                <rect x="8" y="40" width="24" height="18" rx="9" fill="#A7F3D0" />
              </g>
              <text x="70" y="92" textAnchor="middle" fontSize="16" fill="white" opacity="0.9">User</text>
            </g>

            {/* Agent */}
            <g transform="translate(540,200)" filter="url(#soft)" id="node-agent">
              <rect width="160" height="140" rx="16"
                    className={`transition-colors duration-300 ${isGlowing("agent") ? "stroke-emerald-400/70" : "stroke-white/12"}`}
                    fill="#101635" stroke="currentColor" />
              <g transform="translate(56,28)">
                <rect width="48" height="48" rx="12" fill="#0B1220" stroke="#6EE7B7" strokeWidth="2" />
                <circle cx="18" cy="22" r="4" fill="#6EE7B7" />
                <circle cx="30" cy="22" r="4" fill="#6EE7B7" />
                <path d="M15 34 Q24 40 33 34" stroke="#6EE7B7" strokeWidth="2" fill="none" />
              </g>
              <text x="80" y="110" textAnchor="middle" fontSize="16" fill="white" opacity="0.9">AI Agent</text>
            </g>

            {/* LLM */}
            <g transform="translate(740,60)" filter="url(#soft)" id="node-llm">
              <rect width="120" height="120" rx="12"
                    className={`transition-colors duration-300 ${isGlowing("llm") ? "stroke-emerald-400/70" : "stroke-white/12"}`}
                    fill="#0B1220" stroke="currentColor" />
              <g transform="translate(24,30)">
                <circle cx="16" cy="16" r="6" fill="#A7F3D0" />
                <circle cx="52" cy="12" r="6" fill="#A7F3D0" />
                <circle cx="40" cy="44" r="6" fill="#A7F3D0" />
                <path d="M16 16 L52 12 L40 44 Z" stroke="#A7F3D0" fill="none" />
              </g>
              <text x="60" y="98" textAnchor="middle" fontSize="16" fill="white" opacity="0.9">LLM</text>
            </g>

            {/* Vector DB */}
            <g transform="translate(740,360)" filter="url(#soft)" id="node-vdb">
              <rect width="120" height="120" rx="12"
                    className={`transition-colors duration-300 ${isGlowing("vdb") ? "stroke-emerald-400/70" : "stroke-emerald-400/30"}`}
                    fill="#052E2B" stroke="currentColor" />
              <g transform="translate(45,40)"><path d="M 16 0 L 32 9 L 32 27 L 16 36 L 0 27 L 0 9 Z" fill="#10B981" /></g>
              <text x="60" y="98" textAnchor="middle" fontSize="15" fill="#CFFAEA">Vector DB</text>
            </g>

            {/* Prompt pill */}
            <g transform="translate(312,190)" filter="url(#soft)" id="node-prompt">
              <rect width="130" height="44" rx="10"
                    className={`transition-colors duration-300 ${isGlowing("prompt") ? "stroke-blue-300/70" : "stroke-white/12"}`}
                    fill="#0B1220" stroke="currentColor" />
              <rect x="12" y="12" width="20" height="20" rx="4" fill="#0EA5E9" />
              <text x="70" y="28" textAnchor="middle" fontSize="15" fill="#E5F3FF">Prompt</text>
            </g>

            {/* Response pill */}
            <g transform="translate(312,286)" filter="url(#soft)" id="node-response">
              <rect width="150" height="44" rx="10"
                    className={`transition-colors duration-300 ${isGlowing("response") ? "stroke-emerald-300/70" : "stroke-emerald-400/30"}`}
                    fill="#052E2B" stroke="currentColor" />
              <rect x="12" y="12" width="20" height="20" rx="4" fill="#10B981" />
              <text x="86" y="28" textAnchor="middle" fontSize="15" fill="#CFFAEA">Response</text>
            </g>

            {/* Background dashed paths (static cues) */}
            <g strokeDasharray="6 6" stroke="#ffffff" opacity="0.5" fill="none" strokeWidth="2">
              <path d={P.userToPrompt} />
              <path d={P.promptToAgent} />
              <path d={P.agentToLLM} />
              <path d={P.llmToAgent} />
              <path d={P.agentToResponse} />
              <path d={P.responseToUser} />
            </g>
            <path d={P.responseToVector} stroke="#34d399" strokeWidth="3" strokeDasharray="7 7" fill="none" opacity="0.8" />
            <g stroke="#fff" strokeWidth="2" fill="none">
              <path d={P.agentToVector} strokeDasharray="6 6" opacity="0.5" />
              <path d={P.vectorToAgent} strokeDasharray="6 6" opacity="0.5" />
            </g>
          </svg>

          {/* Packet runners (absolute positioned over the SVG) */}
          <div className="pointer-events-none absolute inset-0">
            {current?.packets?.map((pkt, i) => (
              <Packet
                key={`${current.id}-${i}-${key}`}
                path={pkt.path}
                color={pkt.color}
                delay={pkt.delay || 0}
                duration={current.duration}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Caption for the current step (aria-live for screen readers) */}
      <div className="mt-3 rounded-xl border border-white/10 bg-white/5 p-3">
        <p className="text-sm font-semibold">{current.title}</p>
        <p className="text-sm text-gray-300" aria-live="polite">{current.caption}</p>
      </div>

      {/* No-JS fallback */}
      <noscript>
        <p className="mt-3 text-xs text-gray-400">
          Animations are disabled because JavaScript is off. The flow is: User → Prompt → Agent → LLM → Agent →
          Vector DB → Agent → Response → User (with optional memory write).
        </p>
      </noscript>
    </section>
  );
}
