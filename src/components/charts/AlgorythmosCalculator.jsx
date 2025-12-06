import React, { useEffect, useMemo, useState, Suspense } from "react";
import {
  computeOutputs,
  computeBaselineM,
  currencyFormatter,
  pctFormatter,
  sweepCoverageForRoiPct,
  parseNumber,
  clamp01,
} from "../../app/utils/roiMath";
import { track } from "../../app/utils/analytics";

// Lazy load the chart component
const RoiCoverageChart = React.lazy(() => import("./RoiCoverageChart"));

const SegBtn = ({ active, children, onClick }) => (
  <button
    onClick={onClick}
    className={
      "rounded-xl px-3 py-1 text-xs font-semibold transition snap-start " +
      (active
        ? "bg-gradient-to-r from-[#6D00FF] via-[#7658E7] to-[#3715E0] text-white shadow-[0_8px_30px_-8px_rgba(55,21,224,0.55)]"
        : "bg-slate-800/80 text-slate-200 ring-1 ring-white/10 hover:bg-slate-800")
    }
  >
    {children}
  </button>
);

const Label = ({ children, hint }) => (
  <div className="mb-1 flex items-center gap-2 text-sm font-medium text-slate-200">
    <span>{children}</span>
    {hint ? <span className="text-xs text-slate-400">{hint}</span> : null}
  </div>
);

const NumberBox = ({ value, onChange, allowFloat = true, disabled = false, placeholder }) => (
  <input
    type="text"
    inputMode="decimal"
    disabled={disabled}
    value={String(value)}
    placeholder={placeholder}
    onChange={(e) => onChange(parseNumber(e.target.value, { allowFloat }))}
    onBlur={(e) => onChange(parseNumber(e.target.value, { allowFloat }))}
    className={
      "w-full rounded-xl bg-slate-900/60 px-3 py-2 text-slate-100 ring-1 ring-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500 " +
      (disabled ? "opacity-60" : "")
    }
  />
);

const Select = ({ value, onChange, options }) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="rounded-xl bg-slate-900/60 px-3 py-2 text-sm text-slate-100 ring-1 ring-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500 snap-start"
  >
    {options.map((o) => (
      <option key={o.value} value={o.value}>{o.label}</option>
    ))}
  </select>
);

export default function AlgorythmosCalculator() {
  const [s, setS] = useState({
    // Modes
    mode: "advanced", // "simple" | "advanced"
    baselineMode: "manual", // "manual" | "computed"
    currency: "EUR",
    locale: typeof navigator !== "undefined" ? navigator.language : "en-US",

    // Inputs
    volume: 100000,  // V
    manualCost: 5000, // M (used in baselineMode=manual)

    coverage: 0.6,   // c
    reviewMin: 0.5,  // r
    handleMin: 2.5,  // h
    hourly: 38,      // w
    aiCost: 0.006,   // a
    algFee: 3500,    // F
    setup: 8000,     // S

    overheadPct: 0.18, // computed-baseline overhead
  });

  // URL + localStorage persistence
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const draft = { ...s };
    if (p.get("mode")) draft.mode = p.get("mode");
    if (p.get("baseline")) draft.baselineMode = p.get("baseline");
    if (p.get("currency")) draft.currency = p.get("currency");

    if (p.has("vol")) draft.volume = parseNumber(p.get("vol"), { allowFloat: false });
    if (p.has("cost")) draft.manualCost = parseNumber(p.get("cost"));
    if (p.has("cov")) draft.coverage = clamp01(parseNumber(p.get("cov")) / 100);
    if (p.has("rev")) draft.reviewMin = parseNumber(p.get("rev"));
    if (p.has("handle")) draft.handleMin = parseNumber(p.get("handle"));
    if (p.has("hourly")) draft.hourly = parseNumber(p.get("hourly"));
    if (p.has("ai")) draft.aiCost = parseNumber(p.get("ai"));
    if (p.has("fee")) draft.algFee = parseNumber(p.get("fee"));
    if (p.has("setup")) draft.setup = parseNumber(p.get("setup"));
    if (p.has("overhead")) draft.overheadPct = Math.max(0, parseNumber(p.get("overhead")));

    const ls = localStorage.getItem("alg_calc_v1");
    if (!Array.from(p.keys()).length && ls) {
      try { Object.assign(draft, JSON.parse(ls)); } catch {}
    }
    setS(draft);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    localStorage.setItem("alg_calc_v1", JSON.stringify(s));
  }, [s]);

  const fmtC = useMemo(() => currencyFormatter(s.locale, s.currency), [s.locale, s.currency]);

  // M (manual baseline) may be user-entered or computed
  const baselineM = useMemo(() => {
    if (s.baselineMode === "manual") return s.manualCost;
    return computeBaselineM({ V: s.volume, h: s.handleMin, w: s.hourly, overheadPct: s.overheadPct });
  }, [s.baselineMode, s.manualCost, s.volume, s.handleMin, s.hourly, s.overheadPct]);

  // Core outputs
  const out = useMemo(() => computeOutputs({
    V: Math.max(0, s.volume),
    M: Math.max(0, baselineM),
    c: clamp01(s.coverage),
    r: Math.max(0, s.reviewMin),
    h: Math.max(0, s.handleMin),
    w: Math.max(0, s.hourly),
    a: Math.max(0, s.aiCost),
    F: Math.max(0, s.algFee),
    S: Math.max(0, s.setup),
  }), [s, baselineM]);

  const chartData = useMemo(() => sweepCoverageForRoiPct({
    V: Math.max(0, s.volume),
    M: Math.max(0, baselineM),
    r: Math.max(0, s.reviewMin),
    h: Math.max(0, s.handleMin),
    w: Math.max(0, s.hourly),
    a: Math.max(0, s.aiCost),
    F: Math.max(0, s.algFee),
    S: Math.max(0, s.setup),
  }, 5), [s, baselineM]);

  const applyPreset = (name) => {
    const presets = {
      Starter: { coverage: 0.4, hourly: 32, aiCost: 0.005, algFee: 2000, setup: 6000 },
      Growth:  { coverage: 0.6, hourly: 38, aiCost: 0.006, algFee: 4500, setup: 8000 },
      Scale:   { coverage: 0.75, hourly: 45, aiCost: 0.0055, algFee: 0, setup: 12000 },
    };
    setS((x) => ({ ...x, ...presets[name] }));
    track("preset_applied", { name, state: { ...s, ...presets[name] } });
  };

  const share = () => {
    const u = new URL(window.location.href);
    const p = u.searchParams;
    p.set("mode", s.mode);
    p.set("baseline", s.baselineMode);
    p.set("currency", s.currency);
    p.set("vol", String(s.volume));
    p.set("cost", String(s.manualCost));
    p.set("cov", String(Math.round(s.coverage * 100)));
    p.set("rev", String(s.reviewMin));
    p.set("handle", String(s.handleMin));
    p.set("hourly", String(s.hourly));
    p.set("ai", String(s.aiCost));
    p.set("fee", String(s.algFee));
    p.set("setup", String(s.setup));
    p.set("overhead", String(s.overheadPct));
    u.search = p.toString();
    navigator.clipboard?.writeText(u.toString());
    track("share_copied", { url: u.toString() });
  };

           const exportCSV = () => {
           const rows = [
             ["currency", s.currency],
             ["volume (V)", s.volume],
             ["manualCost (M)", baselineM],
             ["coverage (c)", s.coverage],
             ["reviewMin (r)", s.reviewMin],
             ["handleMin (h)", s.handleMin],
             ["hourly (w)", s.hourly],
             ["aiCost (a)", s.aiCost],
             ["algFee (F)", s.algFee],
             ["setup (S)", s.setup],
             ["overheadPct", s.overheadPct],
             ["H_review (h)", out.H_review],
             ["H_residual (h)", out.H_residual],
             ["C_labor", out.C_labor],
             ["C_AI", out.C_AI],
             ["C_proposed", out.C_proposed],
             ["Savings", out.Savings],
             ["Invest", out.Invest],
             ["ROI (ratio)", out.ROI],
             ["ROI %", out.ROI * 100],
             ["Payback (months)", out.Payback],
           ];
           
           // Harden CSV export: wrap cells in quotes and escape double quotes
           const escapeCSV = (value) => {
             const str = String(value);
             // Escape double quotes by doubling them
             const escaped = str.replace(/"/g, '""');
             // Wrap in quotes to handle commas, newlines, and quotes
             return `"${escaped}"`;
           };
           
           const csv = "key,value\n" + rows.map(([k, v]) => `${escapeCSV(k)},${escapeCSV(v)}`).join("\n");
           const blob = new Blob([csv], { type: "text/csv" });
           const a = document.createElement("a");
           a.href = URL.createObjectURL(blob);
           a.download = "algorythmos-roi.csv";
           document.body.appendChild(a);
           a.click();
           a.remove();
           track("export_csv", { rows: rows.length });
         };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-base font-semibold">ROI (Return On Investment) Calculator</h3>
        <div
          className="relative -mx-2 px-2 overflow-x-auto no-scrollbar snap-x snap-mandatory"
          role="tablist"
          aria-label="Calculator modes"
        >
          <div className="flex items-center gap-2 min-w-full whitespace-nowrap">
            <SegBtn active={s.mode === "simple"} onClick={() => setS((x) => ({ ...x, mode: "simple" }))}>Simple</SegBtn>
            <SegBtn active={s.mode === "advanced"} onClick={() => setS((x) => ({ ...x, mode: "advanced" }))}>Advanced</SegBtn>
            <SegBtn active onClick={() => applyPreset("Starter")}>Starter</SegBtn>
            <SegBtn active onClick={() => applyPreset("Growth")}>Growth</SegBtn>
            <SegBtn active onClick={() => applyPreset("Scale")}>Scale</SegBtn>
            <SegBtn onClick={() => setS({
              ...s,
              mode: "advanced",
              baselineMode: "manual",
              currency: "EUR",
              volume: 100000, manualCost: 5000, coverage: 0.6, reviewMin: 0.5, handleMin: 2.5, hourly: 38, aiCost: 0.006, algFee: 3500, setup: 8000, overheadPct: 0.18,
            })}>Reset</SegBtn>
            <SegBtn onClick={share}>Share</SegBtn>
            <SegBtn onClick={exportCSV}>Export CSV</SegBtn>
            <Select
              value={s.currency}
              onChange={(val) => { setS((x) => ({ ...x, currency: val })); track("currency_changed", { to: val }); }}
              options={[
                { value: "EUR", label: "EUR €" },
                { value: "USD", label: "USD $" },
                { value: "GBP", label: "GBP £" },
              ]}
            />
          </div>
        </div>
      </div>

      {/* Inputs */}
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div>
          <Label>Monthly Processing Volume (items/month) — V</Label>
          <NumberBox value={s.volume} onChange={(v) => setS((x) => ({ ...x, volume: Math.max(0, Math.round(v)) }))} allowFloat={false} />
        </div>

        <div>
          <div className="mb-1 flex items-center justify-between">
            <Label>Current Manual Cost (€/month) — M</Label>
            <div className="flex gap-2">
              <SegBtn active={s.baselineMode === "manual"} onClick={() => { setS((x) => ({ ...x, baselineMode: "manual" })); track("baseline_switched", { to: "manual" }); }}>Manual</SegBtn>
              <SegBtn active={s.baselineMode === "computed"} onClick={() => { setS((x) => ({ ...x, baselineMode: "computed" })); track("baseline_switched", { to: "computed" }); }}>Computed</SegBtn>
            </div>
          </div>
          <NumberBox disabled={s.baselineMode === "computed"} value={s.manualCost} onChange={(v) => setS((x) => ({ ...x, manualCost: Math.max(0, v) }))} />
          {s.baselineMode === "computed" && (
            <p className="mt-1 text-xs text-slate-400">
              Computed M = ((V × h) / 60) × w × (1 + overhead) = {fmtC(computeBaselineM({ V: s.volume, h: s.handleMin, w: s.hourly, overheadPct: s.overheadPct }))}
            </p>
          )}
        </div>

        {s.mode === "advanced" && (
          <>
            <div className="md:col-span-2 grid gap-4 md:grid-cols-2">
              <div>
                <Label>Automation coverage — c (%)</Label>
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={1}
                  value={Math.round(s.coverage * 100)}
                  onChange={(e) => setS((x) => ({ ...x, coverage: clamp01(parseNumber(e.target.value) / 100) }))}
                  className="w-full accent-violet-500"
                />
                <div className="mt-1 text-xs text-slate-400">{Math.round(s.coverage * 100)}%</div>
              </div>
              <div>
                <Label>Review time per automated item — r (minutes)</Label>
                <NumberBox value={s.reviewMin} onChange={(v) => setS((x) => ({ ...x, reviewMin: Math.max(0, v) }))} />
              </div>
              <div>
                <Label>Handle time for non-automated items — h (minutes)</Label>
                <NumberBox value={s.handleMin} onChange={(v) => setS((x) => ({ ...x, handleMin: Math.max(0, v) }))} />
              </div>
              <div>
                <Label>Hourly cost — w (€/hour)</Label>
                <NumberBox value={s.hourly} onChange={(v) => setS((x) => ({ ...x, hourly: Math.max(0, v) }))} />
              </div>
              <div>
                <Label>AI run cost per item — a (€/item)</Label>
                <NumberBox value={s.aiCost} onChange={(v) => setS((x) => ({ ...x, aiCost: Math.max(0, v) }))} />
              </div>
              <div>
                <Label>Algorythmos fee — F (€/month)</Label>
                <NumberBox value={s.algFee} onChange={(v) => setS((x) => ({ ...x, algFee: Math.max(0, v) }))} />
              </div>
              <div>
                <Label>One-time setup cost — S (€)</Label>
                <NumberBox value={s.setup} onChange={(v) => setS((x) => ({ ...x, setup: Math.max(0, v) }))} />
              </div>
              <div>
                <Label>Overhead applied in computed baseline (%)</Label>
                <NumberBox value={Math.round(s.overheadPct * 100)} onChange={(v) => setS((x) => ({ ...x, overheadPct: Math.max(0, v) / 100 }))} allowFloat={false} />
              </div>
            </div>
          </>
        )}
      </div>

      {/* KPIs */}
      <div className="mt-5 grid gap-4 md:grid-cols-3" aria-live="polite">
        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
          <div className="text-sm text-slate-400">Estimated Monthly Savings</div>
          <div className="mt-1 text-2xl font-bold text-emerald-400">{fmtC(out.Savings)}</div>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
          <div className="text-sm text-slate-400">ROI (Return On Investment)</div>
          <div className="mt-1 text-2xl font-bold text-violet-400">{pctFormatter(out.ROI)}</div>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
          <div className="text-sm text-slate-400">Payback Period</div>
          <div className="mt-1 text-2xl font-bold text-sky-400">
            {!Number.isFinite(out.Payback) ? "—" : `${out.Payback.toFixed(1)} months`}
          </div>
        </div>
      </div>

                   {/* Sensitivity chart (desktop) - lazy loaded */}
             <Suspense fallback={<div className="mt-6 hidden md:block rounded-xl border border-slate-800 bg-slate-900/60 p-4"><div className="h-56 flex items-center justify-center text-slate-400">Loading chart...</div></div>}>
               <RoiCoverageChart chartData={chartData} currentCoverage={s.coverage} />
             </Suspense>

      {/* Equations & breakdown */}
      <details className="mt-6 rounded-xl border border-slate-800 bg-slate-900/60 p-4">
        <summary className="cursor-pointer select-none text-sm font-semibold text-slate-200">Show equations</summary>
        <pre className="mt-3 whitespace-pre-wrap break-words text-xs text-slate-300">
{`H_review = (V × c × r) / 60 = (${s.volume} × ${s.coverage.toFixed(2)} × ${s.reviewMin}) / 60 = ${out.H_review.toFixed(2)} h
H_residual = (V × (1 - c) × h) / 60 = (${s.volume} × ${(1 - s.coverage).toFixed(2)} × ${s.handleMin}) / 60 = ${out.H_residual.toFixed(2)} h
C_labor = (H_review + H_residual) × w = (${out.H_review.toFixed(2)} + ${out.H_residual.toFixed(2)}) × ${s.hourly} = ${fmtC(out.C_labor)}
C_AI = V × c × a = ${s.volume} × ${s.coverage.toFixed(2)} × ${s.aiCost} = ${fmtC(out.C_AI)}
C_proposed = C_labor + C_AI + F = ${fmtC(out.C_labor)} + ${fmtC(out.C_AI)} + ${fmtC(s.algFee)} = ${fmtC(out.C_proposed)}
Savings = max(0, M - C_proposed) = max(0, ${fmtC(baselineM)} - ${fmtC(out.C_proposed)}) = ${fmtC(out.Savings)}
Invest = F + C_AI = ${fmtC(s.algFee)} + ${fmtC(out.C_AI)} = ${fmtC(out.Invest)}
ROI = Savings / Invest = ${Number.isFinite(out.ROI) ? out.ROI.toFixed(2) : "∞"} (${pctFormatter(out.ROI)})
Payback = S / Savings = ${fmtC(s.setup)} / ${fmtC(out.Savings)} = ${Number.isFinite(out.Payback) ? out.Payback.toFixed(2) + " months" : "∞"}
`}
        </pre>
        <div className="mt-4 grid gap-4 md:grid-cols-3 text-sm">
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
            <div className="text-slate-400">Labor (review + residual)</div>
            <div className="mt-1 font-semibold">{fmtC(out.C_labor)}</div>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
            <div className="text-slate-400">AI run cost</div>
            <div className="mt-1 font-semibold">{fmtC(out.C_AI)}</div>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
            <div className="text-slate-400">Proposed total</div>
            <div className="mt-1 font-semibold">{fmtC(out.C_proposed)}</div>
          </div>
        </div>
      </details>
    </div>
  );
}
