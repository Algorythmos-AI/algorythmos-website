import React from "react";

/** Animated infinity loop with flowing gradient stroke and pulsing nodes. */
export default function AnimatedInfinity({ className = "" }) {
  const reduce = typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  return (
    <div className={`relative ${className}`} aria-hidden="true">
      {/* Glow backdrop */}
      <div className="pointer-events-none absolute inset-0 blur-3xl opacity-25"
           style={{ background: "radial-gradient(600px 260px at 40% 40%, #6D00FF55, transparent 60%), radial-gradient(600px 260px at 70% 60%, #7658E755, transparent 60%)" }} />
      <svg viewBox="0 0 900 420" className="relative z-10 w-full h-auto">
        <defs>
          <linearGradient id="mlops-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#6D00FF"/>
            <stop offset="50%" stopColor="#7658E7"/>
            <stop offset="100%" stopColor="#6D00FF"/>
          </linearGradient>
          <filter id="softGlow">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Infinity path */}
        <path id="∞"
          d="M 150 210 C 220 60, 430 60, 450 210
             C 470 360, 680 360, 750 210
             C 680 60, 470 60, 450 210
             C 430 360, 220 360, 150 210 Z"
          fill="none"
          stroke="url(#mlops-grad)"
          strokeWidth="6"
          strokeLinecap="round"
          style={reduce ? {} : { filter: "url(#softGlow)" }}
        />

        {/* Flowing dash overlay */}
        <path
          d="M 150 210 C 220 60, 430 60, 450 210
             C 470 360, 680 360, 750 210
             C 680 60, 470 60, 450 210
             C 430 360, 220 360, 150 210 Z"
          fill="none"
          stroke="url(#mlops-grad)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray="28 18"
          style={reduce ? {} : { animation: "mlops-dash 6s linear infinite" }}
        />

        {/* Nodes */}
        {[
          { x: 210, y: 210, label: "Design" },
          { x: 450, y: 210, label: "Model Development" },
          { x: 690, y: 210, label: "Operations" }
        ].map((n, i) => (
          <g key={i} transform={`translate(${n.x},${n.y})`}>
            <circle r="9" fill="#FFFFFF" opacity="0.9"/>
            <circle r="18" fill="#6D00FF" opacity="0.22"
              style={reduce ? {} : { animation: `mlops-pulse 2.6s ease-in-out ${i*0.35}s infinite` }}/>
            <text y="-20" textAnchor="middle" fill="white" fontSize="14" opacity="0.9">{n.label}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}
