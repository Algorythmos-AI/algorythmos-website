import React from "react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * Animated diagram for Agentic Automation.
 * - Dashed arrows gently flow along paths.
 * - Respects prefers-reduced-motion.
 * - Responsive: scales with width; maintains aspect ratio.
 */
export default function AgenticFlowDiagram() {
  const prefersReducedMotion = useReducedMotion();
  const dashAnim = prefersReducedMotion
    ? {}
    : { strokeDashoffset: [0, -24], transition: { repeat: Infinity, ease: "linear", duration: 2.4 } };

  return (
    <section className="mt-10">
      <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-950 to-indigo-950 shadow-2xl">
        {/* Browser chrome bar */}
        <div className="h-8 rounded-t-3xl border-b border-white/10 px-3 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-400/80" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-300/80" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
        </div>

        {/* SVG scales responsively */}
        <div className="p-4 md:p-6">
          <svg
            viewBox="0 0 920 520"
            className="w-full h-auto"
            role="img"
            aria-labelledby="agentic-diagram-title agentic-diagram-desc"
          >
            <title id="agentic-diagram-title">Agentic Automation flow</title>
            <desc id="agentic-diagram-desc">
              Information flows from a user to an AI agent through a prompt, the agent exchanges with an LLM and a
              vector database, then returns a response to the user. Dotted arrows indicate memory operations.
            </desc>

            {/* defs: arrows + shadows */}
            <defs>
              <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="white" />
              </marker>
              <marker id="arrow-green" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#34d399" />
              </marker>
              <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="6" stdDeviation="10" floodColor="#000" floodOpacity="0.35" />
              </filter>
            </defs>

            {/* ---- NODES ---- */}
            {/* User */}
            <g transform="translate(70,200)" filter="url(#soft)">
              <rect width="140" height="120" rx="16" fill="#0B1220" stroke="rgba(255,255,255,0.12)" />
              <g transform="translate(16,18)">
                <circle cx="20" cy="20" r="14" fill="#A7F3D0" />
                <rect x="8" y="40" width="24" height="18" rx="9" fill="#A7F3D0" />
              </g>
              <text x="70" y="92" textAnchor="middle" fontSize="16" fill="white" opacity="0.9">User</text>
            </g>

            {/* AI Agent */}
            <g transform="translate(540,200)" filter="url(#soft)">
              <rect width="160" height="140" rx="16" fill="#101635" stroke="rgba(255,255,255,0.12)" />
              {/* simple robot face */}
              <g transform="translate(56,28)">
                <rect width="48" height="48" rx="12" fill="#0B1220" stroke="#6EE7B7" strokeWidth="2" />
                <circle cx="18" cy="22" r="4" fill="#6EE7B7" />
                <circle cx="30" cy="22" r="4" fill="#6EE7B7" />
                <path d="M15 34 Q24 40 33 34" stroke="#6EE7B7" strokeWidth="2" fill="none" />
              </g>
              <text x="80" y="110" textAnchor="middle" fontSize="16" fill="white" opacity="0.9">AI Agent</text>
            </g>

            {/* LLM */}
            <g transform="translate(740,60)" filter="url(#soft)">
              <rect width="120" height="120" rx="12" fill="#0B1220" stroke="rgba(255,255,255,0.12)" />
              {/* small graph icon */}
              <g transform="translate(24,30)">
                <circle cx="16" cy="16" r="6" fill="#A7F3D0" />
                <circle cx="52" cy="12" r="6" fill="#A7F3D0" />
                <circle cx="40" cy="44" r="6" fill="#A7F3D0" />
                <path d="M16 16 L52 12 L40 44 Z" stroke="#A7F3D0" fill="none" />
              </g>
              <text x="60" y="98" textAnchor="middle" fontSize="16" fill="white" opacity="0.9">LLM</text>
            </g>

            {/* Vector DB (Weaviate-like) */}
            <g transform="translate(740,360)" filter="url(#soft)">
              <rect width="120" height="120" rx="12" fill="#052E2B" stroke="#10B981" strokeOpacity="0.5" />
              <g transform="translate(45,40)">
                <path d="M 16 0 L 32 9 L 32 27 L 16 36 L 0 27 L 0 9 Z" fill="#10B981" />
              </g>
              <text x="60" y="98" textAnchor="middle" fontSize="15" fill="#CFFAEA">Vector DB</text>
            </g>

            {/* Prompt pill */}
            <g transform="translate(312,190)" filter="url(#soft)">
              <rect width="130" height="44" rx="10" fill="#0B1220" stroke="rgba(255,255,255,0.15)" />
              <rect x="12" y="12" width="20" height="20" rx="4" fill="#0EA5E9" />
              <text x="70" y="28" textAnchor="middle" fontSize="15" fill="#E5F3FF">Prompt</text>
            </g>

            {/* Response pill */}
            <g transform="translate(312,286)" filter="url(#soft)">
              <rect width="150" height="44" rx="10" fill="#052E2B" stroke="#10B981" strokeOpacity="0.5" />
              <rect x="12" y="12" width="20" height="20" rx="4" fill="#10B981" />
              <text x="86" y="28" textAnchor="middle" fontSize="15" fill="#CFFAEA">Response</text>
            </g>

            {/* ---- ARROWS (animated dashed) ---- */}
            {/* User -> Prompt */}
            <motion.path
              d="M 210 238 H 312"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeDasharray="6 6"
              markerEnd="url(#arrow)"
              style={dashAnim}
            />
            {/* Prompt -> Agent */}
            <motion.path
              d="M 442 212 H 540"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeDasharray="6 6"
              markerEnd="url(#arrow)"
              style={dashAnim}
            />
            {/* Agent -> Response */}
            <motion.path
              d="M 540 308 H 462 312"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeDasharray="6 6"
              markerEnd="url(#arrow)"
              style={dashAnim}
            />
            {/* Response -> User */}
            <motion.path
              d="M 312 308 H 210 210 210"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeDasharray="6 6"
              markerEnd="url(#arrow)"
              style={dashAnim}
            />

            {/* Agent <-> LLM (two arrows) */}
            <motion.path
              d="M 700 240 V 140"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeDasharray="6 6"
              markerEnd="url(#arrow)"
              style={dashAnim}
            />
            <motion.path
              d="M 760 140 V 240"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeDasharray="6 6"
              markerEnd="url(#arrow)"
              style={dashAnim}
            />

            {/* Agent -> Vector DB */}
            <motion.path
              d="M 700 340 V 260"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeDasharray="6 6"
              markerEnd="url(#arrow)"
              style={dashAnim}
            />

            {/* Response --> Vector DB (dotted green memory) */}
            <motion.path
              d="M 387 330 C 520 420, 640 440, 740 420"
              fill="none"
              stroke="#34d399"
              strokeWidth="3"
              strokeDasharray="7 7"
              markerEnd="url(#arrow-green)"
              style={prefersReducedMotion ? {} : { strokeDashoffset: [0, -28], transition: { repeat: Infinity, ease: "linear", duration: 3 } }}
              opacity="0.9"
            />
          </svg>
        </div>
      </div>
    </section>
  );
}
