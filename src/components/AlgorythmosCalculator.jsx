import React, { useEffect, useMemo, useState } from "react";

// ---------- utils ----------
const fmtCurrency = (v) => {
  if (!isFinite(v)) return "—";
  try {
    return new Intl.NumberFormat(undefined, { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(v);
  } catch {
    return `€${Math.round(v).toLocaleString()}`;
  }
};
const fmtPerc = (v) => (v === Infinity ? "∞" : `${Math.round(v * 100)}%`);
const clamp01 = (x) => Math.max(0, Math.min(1, x));

// allow "100 000", "100,000", "100.000,50", etc.
const toNumber = (raw, allowFloat = true) => {
  if (raw == null) return 0;
  const s = String(raw).replace(/[^\d.,\s-]/g, "").replace(/\s+/g, "");
  // if both "," and "." exist, assume last delimiter is decimal mark
  const lastComma = s.lastIndexOf(",");
  const lastDot = s.lastIndexOf(".");
  let normalized = s;
  if (lastComma !== -1 && lastDot !== -1) {
    if (lastComma > lastDot) normalized = s.replace(/\./g, "").replace(",", ".");
    else normalized = s.replace(/,/g, "");
  } else {
    normalized = s.replace(/,/g, ".");
  }
  const n = allowFloat ? parseFloat(normalized) : parseInt(normalized, 10);
  return isNaN(n) ? 0 : n;
};

function useQuerySync(state, setState) {
  // read on mount
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const next = { ...state };
    if (p.has("vol")) next.volume = toNumber(p.get("vol"), false);
    if (p.has("cost")) next.manualCost = toNumber(p.get("cost"));
    if (p.has("cov")) next.coverage = clamp01(toNumber(p.get("cov")) / 100);
    if (p.has("rev")) next.reviewMin = toNumber(p.get("rev"));
    if (p.has("handle")) next.handleMin = toNumber(p.get("handle"));
    if (p.has("hourly")) next.hourly = toNumber(p.get("hourly"));
    if (p.has("ai")) next.aiCost = toNumber(p.get("ai"));
    if (p.has("fee")) next.algFee = toNumber(p.get("fee"));
    if (p.has("setup")) next.setup = toNumber(p.get("setup"));
    const mode = p.get("mode");
    if (mode === "advanced" || mode === "simple") next.mode = mode;
    setState(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const copy = () => {
    const u = new URL(window.location.href);
    const p = u.searchParams;
    p.set("vol", String(state.volume));
    p.set("cost", String(state.manualCost));
    p.set("cov", String(Math.round(state.coverage * 100)));
    p.set("rev", String(state.reviewMin));
    p.set("handle", String(state.handleMin));
    p.set("hourly", String(state.hourly));
    p.set("ai", String(state.aiCost));
    p.set("fee", String(state.algFee));
    p.set("setup", String(state.setup));
    p.set("mode", state.mode);
    u.search = p.toString();
    navigator.clipboard?.writeText(u.toString());
  };
  return { copy };
}

// ---------- UI primitives ----------
const Label = ({ children, hint, unit }) => (
  <div className="mb-1 flex items-center gap-2 text-sm font-medium text-slate-200">
    <span>{children}</span>
    {unit && <span className="text-xs text-slate-400">({unit})</span>}
    {hint && <span className="text-xs text-slate-400">{hint}</span>}
  </div>
);

const NumberBox = ({ value, onChange, step = 1, allowFloat = true, ...rest }) => (
  <input
    type="text"
    inputMode="decimal"
    value={value}
    onChange={(e) => onChange(toNumber(e.target.value, allowFloat))}
    onBlur={(e) => onChange(toNumber(e.target.value, allowFloat))}
    className="w-full rounded-xl bg-slate-900/60 px-3 py-2 text-slate-100 ring-1 ring-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500"
    {...rest}
  />
);

const Range = ({ value, onChange, min = 0, max = 100, step = 1 }) => (
  <input
    type="range"
    className="w-full accent-violet-500"
    min={min}
    max={max}
    step={step}
    value={value}
    onChange={(e) => onChange(toNumber(e.target.value, true))}
  />
);

// ---------- Main ----------
export default function AlgorythmosCalculator() {
  const [s, setS] = useState({
    mode: "simple",
    // Basic
    volume: 100000,
    manualCost: 5000,

    // Advanced
    coverage: 0.6,
    reviewMin: 0.5,
    handleMin: 2.5,
    hourly: 38,
    aiCost: 0.006,
    algFee: 3500,
    setup: 8000,
  });

  const { copy } = useQuerySync(s, setS);

  const derived = useMemo(() => {
    const V = Math.max(0, s.volume);
    const M = Math.max(0, s.manualCost);
    const c = clamp01(s.coverage);
    const r = Math.max(0, s.reviewMin);
    const h = Math.max(0, s.handleMin);
    const w = Math.max(0, s.hourly);
    const a = Math.max(0, s.aiCost);
    const F = Math.max(0, s.algFee);
    const S = Math.max(0, s.setup);

    // Exact formulas as specified
    const H_review = (V * c * r) / 60;
    const H_residual = (V * (1 - c) * h) / 60;
    const C_labor = (H_review + H_residual) * w;
    const C_AI = V * c * a;
    const C_proposed = C_labor + C_AI + F;
    const Savings = Math.max(0, M - C_proposed);
    const Invest = F + C_AI;
    const ROI = Invest > 0 ? Savings / Invest : (Savings > 0 ? Infinity : 0);
    const Payback = Savings > 0 ? S / Savings : Infinity;

    return { 
      V, M, c, r, h, w, a, F, S,
      H_review, H_residual, C_labor, C_AI, C_proposed, 
      Savings, Invest, ROI, Payback 
    };
  }, [s]);

  // quick presets (inspired by quote calculators)
  const presets = {
    Starter: { coverage: 0.4, hourly: 32, aiCost: 0.005, algFee: 2000, setup: 6000 },
    Growth:  { coverage: 0.6, hourly: 38, aiCost: 0.006, algFee: 4500, setup: 8000 },
    Scale:   { coverage: 0.75, hourly: 45, aiCost: 0.0055, algFee: 0, setup: 12000 }, // fee negotiated/custom
  };

  const applyPreset = (p) => setS((x) => ({ ...x, ...p }));

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-base font-semibold">ROI (Return On Investment) Calculator</h3>
        <div className="flex items-center gap-2">
          {/* Mode selector */}
          <div className="flex items-center gap-1 rounded-xl bg-slate-800/80 p-1 ring-1 ring-white/10">
            <button
              onClick={() => setS((x) => ({ ...x, mode: "simple" }))}
              className={`rounded-lg px-3 py-1 text-xs font-semibold transition-colors ${
                s.mode === "simple" 
                  ? "bg-gradient-to-r from-[#6D00FF] via-[#7658E7] to-[#3715E0] text-white shadow-[0_10px_40px_-10px_rgba(55,21,224,0.55)]" 
                  : "text-slate-300 hover:text-white"
              }`}
            >
              Simple
            </button>
            <button
              onClick={() => setS((x) => ({ ...x, mode: "advanced" }))}
              className={`rounded-lg px-3 py-1 text-xs font-semibold transition-colors ${
                s.mode === "advanced" 
                  ? "bg-gradient-to-r from-[#6D00FF] via-[#7658E7] to-[#3715E0] text-white shadow-[0_10px_40px_-10px_rgba(55,21,224,0.55)]" 
                  : "text-slate-300 hover:text-white"
              }`}
            >
              Advanced
            </button>
          </div>
          
          {Object.entries(presets).map(([k, v]) => (
            <button key={k}
              onClick={() => applyPreset(v)}
              className="rounded-xl bg-slate-800/80 px-3 py-1 text-xs font-semibold ring-1 ring-white/10 hover:bg-slate-800"
              aria-label={`Apply preset ${k}`}
            >
              {k}
            </button>
          ))}
          <button
            onClick={() => setS({ mode: "simple", volume: 100000, manualCost: 5000, coverage: 0.6, reviewMin: 0.5, handleMin: 2.5, hourly: 38, aiCost: 0.006, algFee: 3500, setup: 8000 })}
            className="rounded-xl bg-slate-800/80 px-3 py-1 text-xs font-semibold ring-1 ring-white/10 hover:bg-slate-800"
            aria-label="Reset to defaults"
          >
            Reset
          </button>
          <button
            onClick={copy}
            className="rounded-xl bg-gradient-to-r from-[#6D00FF] via-[#7658E7] to-[#3715E0] px-3 py-1 text-xs font-semibold text-white shadow-[0_10px_40px_-10px_rgba(55,21,224,0.55)]"
            aria-label="Copy a shareable link with current values"
            title="Copy shareable link"
          >
            Share
          </button>
        </div>
      </div>

      {/* Basic inputs */}
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div>
          <Label unit="items/month">Monthly Processing Volume (V)</Label>
          <NumberBox value={s.volume} onChange={(v) => setS((x) => ({ ...x, volume: Math.max(0, Math.round(v)) }))} allowFloat={false} />
        </div>
        <div>
          <Label unit="€/month">Current Manual Cost (M)</Label>
          <NumberBox value={s.manualCost} onChange={(v) => setS((x) => ({ ...x, manualCost: Math.max(0, v) }))} />
        </div>
      </div>

      {/* Advanced inputs */}
      {s.mode === "advanced" && (
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div>
            <Label unit="%">Automation coverage (c)</Label>
            <div className="flex items-center gap-3">
              <Range value={Math.round(s.coverage * 100)} onChange={(v) => setS((x) => ({ ...x, coverage: clamp01(v / 100) }))} />
              <div className="w-12 text-right text-sm">{Math.round(s.coverage * 100)}%</div>
            </div>
          </div>
          <div>
            <Label unit="minutes">Review time per automated item (r)</Label>
            <NumberBox value={s.reviewMin} onChange={(v) => setS((x) => ({ ...x, reviewMin: Math.max(0, v) }))} />
          </div>
          <div>
            <Label unit="minutes">Handle time for non-automated items (h)</Label>
            <NumberBox value={s.handleMin} onChange={(v) => setS((x) => ({ ...x, handleMin: Math.max(0, v) }))} />
          </div>
          <div>
            <Label unit="€/hour">Hourly cost (w)</Label>
            <NumberBox value={s.hourly} onChange={(v) => setS((x) => ({ ...x, hourly: Math.max(0, v) }))} />
          </div>
          <div>
            <Label unit="€/item">AI run cost per item (a)</Label>
            <NumberBox value={s.aiCost} step={0.001} onChange={(v) => setS((x) => ({ ...x, aiCost: Math.max(0, v) }))} />
          </div>
          <div>
            <Label unit="€/month">Algorythmos fee (F)</Label>
            <NumberBox value={s.algFee} onChange={(v) => setS((x) => ({ ...x, algFee: Math.max(0, v) }))} />
          </div>
          <div>
            <Label unit="€">One-time setup cost (S)</Label>
            <NumberBox value={s.setup} onChange={(v) => setS((x) => ({ ...x, setup: Math.max(0, v) }))} />
          </div>
        </div>
      )}

      {/* KPIs */}
      <div className="mt-5 grid gap-4 md:grid-cols-3" aria-live="polite">
        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
          <div className="text-sm text-slate-400">Estimated Monthly Savings</div>
          <div className="mt-1 text-2xl font-bold text-emerald-400">{fmtCurrency(derived.Savings)}</div>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
          <div className="text-sm text-slate-400">ROI (Return On Investment)</div>
          <div className="mt-1 text-2xl font-bold text-violet-400">{fmtPerc(derived.ROI)}</div>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
          <div className="text-sm text-slate-400">Payback Period</div>
          <div className="mt-1 text-2xl font-bold text-sky-400">
            {!isFinite(derived.Payback) ? "—" : `${derived.Payback.toFixed(1)} months`}
          </div>
        </div>
      </div>

      {/* Equations Inspector */}
      <details className="mt-6 rounded-xl border border-slate-800 bg-slate-900/60 p-4">
        <summary className="cursor-pointer select-none text-sm font-semibold text-slate-200">Show equations</summary>
        <div className="mt-4 space-y-2 font-mono text-xs text-slate-300">
          <div>H_review = (V × c × r) / 60 = ({derived.V.toLocaleString()} × {derived.c.toFixed(2)} × {derived.r.toFixed(1)}) / 60 = {derived.H_review.toFixed(1)} h</div>
          <div>H_residual = (V × (1 - c) × h) / 60 = ({derived.V.toLocaleString()} × {derived.h.toFixed(1)}) / 60 = {derived.H_residual.toFixed(1)} h</div>
          <div>C_labor = (H_review + H_residual) × w = ({derived.H_review.toFixed(1)} + {derived.H_residual.toFixed(1)}) × {derived.w} = {fmtCurrency(derived.C_labor)}</div>
          <div>C_AI = V × c × a = {derived.V.toLocaleString()} × {derived.c.toFixed(2)} × {derived.a.toFixed(3)} = {fmtCurrency(derived.C_AI)}</div>
          <div>C_proposed = C_labor + C_AI + F = {fmtCurrency(derived.C_labor)} + {fmtCurrency(derived.C_AI)} + {fmtCurrency(derived.F)} = {fmtCurrency(derived.C_proposed)}</div>
          <div>Savings = max(0, M - C_proposed) = max(0, {fmtCurrency(derived.M)} - {fmtCurrency(derived.C_proposed)}) = {fmtCurrency(derived.Savings)}</div>
          <div>Invest = F + C_AI = {fmtCurrency(derived.F)} + {fmtCurrency(derived.C_AI)} = {fmtCurrency(derived.Invest)}</div>
          <div>ROI = Savings / Invest = {fmtCurrency(derived.Savings)} / {fmtCurrency(derived.Invest)} = {derived.ROI === Infinity ? "∞" : derived.ROI.toFixed(3)}</div>
          <div>Payback = S / Savings = {fmtCurrency(derived.S)} / {fmtCurrency(derived.Savings)} = {derived.Payback === Infinity ? "∞" : derived.Payback.toFixed(1)} months</div>
        </div>
      </details>

      {/* Breakdown */}
      <details className="mt-4 rounded-xl border border-slate-800 bg-slate-900/60 p-4">
        <summary className="cursor-pointer select-none text-sm font-semibold text-slate-200">Cost breakdown</summary>
        <div className="mt-4 grid gap-4 md:grid-cols-3 text-sm">
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
            <div className="text-slate-400">Labor (review + residual)</div>
            <div className="mt-1 font-semibold">{fmtCurrency(derived.C_labor)}</div>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
            <div className="text-slate-400">AI run cost</div>
            <div className="mt-1 font-semibold">{fmtCurrency(derived.C_AI)}</div>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
            <div className="text-slate-400">Proposed total</div>
            <div className="mt-1 font-semibold">{fmtCurrency(derived.C_proposed)}</div>
          </div>
        </div>
      </details>
    </div>
  );
}
