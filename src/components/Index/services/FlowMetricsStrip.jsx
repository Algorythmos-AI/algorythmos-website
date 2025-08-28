import React, { useEffect, useRef, useState } from "react";
import { animate, useReducedMotion } from "framer-motion";

/**
 * FlowMetricsStrip
 * items: [{ label, value (number), suffix?: string, aria?: string }]
 */
export default function FlowMetricsStrip({ items = [] }) {
  return (
    <section aria-labelledby="flow-metrics" className="mt-3">
      <h3 id="flow-metrics" className="sr-only">Flow metrics</h3>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((m, i) => (
          <MetricCard key={`${m.label}-${i}`} {...m} />
        ))}
      </div>
    </section>
  );
}

function MetricCard({ label, value, suffix = "", aria }) {
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(value);
  const prev = useRef(value);

  useEffect(() => {
    if (reduce) { setDisplay(value); prev.current = value; return; }
    const controls = animate(prev.current, value, {
      duration: 0.6,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(v),
    });
    prev.current = value;
    return () => controls.stop();
  }, [value, reduce]);

  const formatted = formatNumber(display, suffix);

  return (
    <article
      className="rounded-xl border border-white/10 bg-white/5 p-3"
      aria-label={aria || label}
    >
      <p className="text-xs text-gray-400">{label}</p>
      <p className="mt-1 text-2xl font-semibold tabular-nums" aria-live="polite">
        {formatted}
      </p>
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
