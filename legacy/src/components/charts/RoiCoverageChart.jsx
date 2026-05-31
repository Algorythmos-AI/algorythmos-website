import React from "react";
import { LightLineChart } from "./light";

export default function RoiCoverageChart({ chartData, currentCoverage }) {
  return (
    <div className="mt-6 hidden md:block rounded-xl border border-slate-800 bg-slate-900/60 p-4">
      <div className="mb-2 text-sm font-semibold text-slate-200">Sensitivity: ROI% vs coverage</div>
      <LightLineChart
        data={chartData}
        xKey="x"
        yKey="y"
        height={224}
        lineColor="#8b5cf6"
        gridColor="#1f2937"
        axisColor="#94a3b8"
        referenceLineX={Math.round(currentCoverage * 100)}
        referenceLineColor="#7c3aed"
        xFormatter={(v) => `${v}%`}
        tooltipFormatter={(x, y) => ({
          label: `Coverage ${x}%`,
          value: `${Math.round(y)}% ROI`,
        })}
      />
    </div>
  );
}
