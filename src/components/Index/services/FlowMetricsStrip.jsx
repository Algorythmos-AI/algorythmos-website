import React, { useEffect, useRef, useState } from "react";
import { animate, useReducedMotion } from "framer-motion";

/**
 * FlowMetricsStrip
 * items: [{ label, value (number), suffix?: string, aria?: string }]
 */
export default function FlowMetricsStrip({ items = [] }) {
  return (
    <section aria-labelledby="flow-metrics" className="mt-6">
      <h3 id="flow-metrics" className="sr-only">Flow metrics</h3>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((m, i) => (
          <MetricCard key={`${m.label}-${i}`} {...m} delay={i * 0.1} />
        ))}
      </div>
    </section>
  );
}

function MetricCard({ label, value, suffix = "", aria, delay = 0 }) {
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(value);
  const prev = useRef(value);

  useEffect(() => {
    if (reduce) { setDisplay(value); prev.current = value; return; }
    const controls = animate(prev.current, value, {
      duration: 0.8,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(v),
    });
    prev.current = value;
    return () => controls.stop();
  }, [value, reduce]);

  const formatted = formatNumber(display, suffix);

  return (
    <article
      className="group relative rounded-xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-sm transition-all duration-300 hover:bg-white/[0.05] hover:border-white/20"
      aria-label={aria || label}
      style={{
        animationDelay: `${delay}s`,
        animation: reduce ? "none" : "fadeInUp 0.6s ease-out forwards"
      }}
    >
      {/* Subtle gradient background */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative z-10">
        <p className="text-sm text-gray-400 font-medium">{label}</p>
        <p className="mt-2 text-3xl font-bold tabular-nums text-white" aria-live="polite">
          {formatted}
        </p>
        
        {/* Subtle accent line */}
        <div className="mt-3 h-0.5 w-8 bg-gradient-to-r from-emerald-400/50 to-transparent rounded-full" />
      </div>
    </article>
  );
}

function formatNumber(n, suffix) {
  // 1 decimal for mins/€, no decimals for %
  const s = String(suffix || "").trim();
  if (s === "%") return `${Math.round(n)}%`;
  if (s.toLowerCase().includes("min") || s.includes("€"))
    return `${(Math.round(n * 10) / 10).toFixed(1)}${s ? " " + s : ""}`;
  return `${Math.round(n)}${s ? " " + s : ""}`;
}
