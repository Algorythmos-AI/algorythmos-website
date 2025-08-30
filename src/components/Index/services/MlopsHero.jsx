import React from "react";
import AnimatedInfinity from "./AnimatedInfinity";
import KpiStrip from "./KpiStrip";

/** Combines the animated infinity loop + KPI strip. */
export default function MlopsHero() {
  return (
    <div className="mt-6">
      <AnimatedInfinity className="w-full" />
      <KpiStrip />
    </div>
  );
}
