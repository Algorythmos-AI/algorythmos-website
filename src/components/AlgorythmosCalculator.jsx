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
    u.search = p.toString();
    navigator.clipboard?.writeText(u.toString());
  };
  return { copy };
}

// ---------- UI primitives ----------
const Label = ({ children, hint }) => (
  <div className="mb-1 flex items-center gap-2 text-sm font-medium text-slate-200">
    <span>{children}</span>
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
    const v = Math.max(0, s.volume);
    const cov = clamp01(s.coverage);
    const reviewHrs = (v * cov * s.reviewMin) / 60;
    const residualHrs = (v * (1 - cov) * s.handleMin) / 60;
    const laborCost = (reviewHrs + residualHrs) * s.hourly;
    const aiRun = v * cov * s.aiCost;
    const proposed = laborCost + aiRun + s.algFee;

    const savings = Math.max(0, s.manualCost - proposed);
    const invest = s.algFee + aiRun;
    const roi = invest > 0 ? savings / invest : (savings > 0 ? Infinity : 0);
    const payback = savings > 0 ? s.setup / savings : Infinity;

    return { reviewHrs, residualHrs, laborCost, aiRun, proposed, savings, roi, payback };
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
            onClick={() => setS({ volume: 100000, manualCost: 5000, coverage: 0.6, reviewMin: 0.5, handleMin: 2.5, hourly: 38, aiCost: 0.006, algFee: 3500, setup: 8000 })}
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
          <Label>Monthly Processing Volume</Label>
          <NumberBox value={s.volume} onChange={(v) => setS((x) => ({ ...x, volume: Math.max(0, Math.round(v)) }))} allowFloat={false} />
        </div>
        <div>
          <Label>Current Manual Cost (€/month)</Label>
          <NumberBox value={s.manualCost} onChange={(v) => setS((x) => ({ ...x, manualCost: Math.max(0, v) }))} />
        </div>
      </div>

      {/* KPIs */}
      <div className="mt-5 grid gap-4 md:grid-cols-3" aria-live="polite">
        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
          <div className="text-sm text-slate-400">Estimated Monthly Savings</div>
          <div className="mt-1 text-2xl font-bold text-emerald-400">{fmtCurrency(derived.savings)}</div>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
          <div className="text-sm text-slate-400">ROI (Return On Investment)</div>
          <div className="mt-1 text-2xl font-bold text-violet-400">{fmtPerc(derived.roi)}</div>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
          <div className="text-sm text-slate-400">Payback Period</div>
          <div className="mt-1 text-2xl font-bold text-sky-400">
            {!isFinite(derived.payback) ? "—" : `${derived.payback.toFixed(1)} months`}
          </div>
        </div>
      </div>

      {/* Advanced */}
      <details className="mt-6 rounded-xl border border-slate-800 bg-slate-900/60 p-4">
        <summary className="cursor-pointer select-none text-sm font-semibold text-slate-200">Advanced settings</summary>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <Label>Automation coverage <span className="text-xs text-slate-400">(% items handled by AI (Artificial Intelligence))</span></Label>
            <div className="flex items-center gap-3">
              <Range value={Math.round(s.coverage * 100)} onChange={(v) => setS((x) => ({ ...x, coverage: clamp01(v / 100) }))} />
              <div className="w-12 text-right text-sm">{Math.round(s.coverage * 100)}%</div>
            </div>
          </div>
          <div>
            <Label>Review time per automated item (minutes)</Label>
            <NumberBox value={s.reviewMin} onChange={(v) => setS((x) => ({ ...x, reviewMin: Math.max(0, v) }))} />
          </div>
          <div>
            <Label>Average handle time (manual) (minutes)</Label>
            <NumberBox value={s.handleMin} onChange={(v) => setS((x) => ({ ...x, handleMin: Math.max(0, v) }))} />
          </div>
          <div>
            <Label>Hourly cost (€/hour)</Label>
            <NumberBox value={s.hourly} onChange={(v) => setS((x) => ({ ...x, hourly: Math.max(0, v) }))} />
          </div>
          <div>
            <Label>AI run cost per item (€/)</Label>
            <NumberBox value={s.aiCost} step={0.001} onChange={(v) => setS((x) => ({ ...x, aiCost: Math.max(0, v) }))} />
          </div>
          <div>
            <Label>Algorythmos monthly fee (€/month)</Label>
            <NumberBox value={s.algFee} onChange={(v) => setS((x) => ({ ...x, algFee: Math.max(0, v) }))} />
          </div>
          <div>
            <Label>One-time setup cost (€)</Label>
            <NumberBox value={s.setup} onChange={(v) => setS((x) => ({ ...x, setup: Math.max(0, v) }))} />
          </div>
        </div>

        {/* Breakdown */}
        <div className="mt-6 grid gap-4 md:grid-cols-3 text-sm">
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
            <div className="text-slate-400">Labor (review + residual)</div>
            <div className="mt-1 font-semibold">{fmtCurrency(derived.laborCost)}</div>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
            <div className="text-slate-400">AI run cost</div>
            <div className="mt-1 font-semibold">{fmtCurrency(derived.aiRun)}</div>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
            <div className="text-slate-400">Proposed total</div>
            <div className="mt-1 font-semibold">{fmtCurrency(derived.proposed)}</div>
          </div>
        </div>
      </details>
    </div>
  );
}
