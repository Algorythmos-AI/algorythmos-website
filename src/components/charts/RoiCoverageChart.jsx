import React from "react";
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceLine,
} from "recharts";

export default function RoiCoverageChart({ chartData, currentCoverage }) {
  return (
    <div className="mt-6 hidden md:block rounded-xl border border-slate-800 bg-slate-900/60 p-4">
      <div className="mb-2 text-sm font-semibold text-slate-200">Sensitivity: ROI% vs coverage</div>
      <div className="h-56 w-full">
        <ResponsiveContainer>
          <LineChart data={chartData} margin={{ top: 10, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
            <XAxis dataKey="x" tick={{ fill: "#94a3b8", fontSize: 12 }} tickFormatter={(v) => `${v}%`} />
            <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} />
            <Tooltip
              formatter={(v) => [`${Math.round(v)}%`, "ROI%"]}
              labelFormatter={(l) => `Coverage ${l}%`}
              contentStyle={{ background: "#0b1220", border: "1px solid #1f2937", color: "#E2E8F0" }}
            />
            <ReferenceLine x={Math.round(currentCoverage * 100)} stroke="#7c3aed" strokeDasharray="3 3" />
            <Line type="monotone" dataKey="y" stroke="#8b5cf6" dot={false} strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
