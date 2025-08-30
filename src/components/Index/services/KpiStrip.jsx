import React from "react";
import useCountUp from "./hooks/useCountUp";

/** Compact KPI ticker: Latency, Incidents, Cost – animated on view. */
export default function KpiStrip() {
  const latency = useCountUp(58, 1100);   // 58% faster
  const incidents = useCountUp(72, 1100); // 72% fewer
  const cost = useCountUp(35, 1100);      // 35% lower

  return (
    <div ref={latency.ref} className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
      <Kpi label="Release Latency" value={latency.value} suffix="% faster" />
      <Kpi label="Deployment Incidents" value={incidents.value} suffix="% fewer" />
      <Kpi label="Infra Cost" value={cost.value} suffix="% lower" />
    </div>
  );
}

function Kpi({ label, value, suffix }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
      <div className="text-xs uppercase tracking-wide text-white/60">{label}</div>
      <div className="mt-1 flex items-baseline gap-1">
        <div className="text-2xl font-bold text-white tabular-nums">{value}</div>
        <div className="text-sm text-white/70">{suffix}</div>
      </div>
    </div>
  );
}
