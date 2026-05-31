// Pure ROI (Return On Investment) math helpers — no React imports.

export const clamp01 = (x) => Math.max(0, Math.min(1, Number.isFinite(x) ? x : 0));

// Tolerant number parsing: "100,000", "100 000", "1.25"
export function parseNumber(raw, { allowFloat = true } = {}) {
  if (raw == null) return 0;
  const s = String(raw).replace(/[^\d.,\s-]/g, "").replace(/\s+/g, "");
  const lastComma = s.lastIndexOf(",");
  const lastDot = s.lastIndexOf(".");
  let normalized = s;
  if (lastComma !== -1 && lastDot !== -1) {
    normalized = lastComma > lastDot ? s.replace(/\./g, "").replace(",", ".") : s.replace(/,/g, "");
  } else {
    normalized = s.replace(/,/g, ".");
  }
  const n = allowFloat ? parseFloat(normalized) : parseInt(normalized, 10);
  return isNaN(n) ? 0 : n;
}

export function currencyFormatter(locale = "en-US", currency = "EUR") {
  try {
    const f = new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    });
    return (v) => (Number.isFinite(v) ? f.format(v) : "—");
  } catch {
    return (v) => (Number.isFinite(v) ? `€${Math.round(v).toLocaleString()}` : "—");
  }
}
export const pctFormatter = (x) =>
  Number.isFinite(x) ? `${Math.round(x * 100)}%` : x === Infinity ? "∞" : "—";

/**
 * Core equations (monthly):
 * V volume, M manualCost, c coverage(0..1), r reviewMin, h handleMin, w hourly, a aiCost/item, F algFee, S setup.
 */
export function computeOutputs({
  V,
  M,
  c,
  r,
  h,
  w,
  a,
  F,
  S,
}) {
  const coverage = clamp01(c);
  const H_review = (V * coverage * r) / 60;
  const H_residual = (V * (1 - coverage) * h) / 60;
  const C_labor = (H_review + H_residual) * w;
  const C_AI = V * coverage * a;
  const C_proposed = C_labor + C_AI + F;
  const Savings = Math.max(0, M - C_proposed);
  const Invest = F + C_AI;
  const ROI = Invest > 0 ? Savings / Invest : (Savings > 0 ? Infinity : 0);
  const Payback = Savings > 0 ? S / Savings : Infinity;
  return {
    H_review, H_residual, C_labor, C_AI, C_proposed, Savings, Invest, ROI, Payback,
  };
}

/** Derive M (manual baseline) when using computed mode */
export function computeBaselineM({ V, h, w, overheadPct = 0 }) {
  const hours_manual = (V * h) / 60;
  const manualLabor = hours_manual * w;
  return manualLabor * (1 + Math.max(0, overheadPct));
}

/** Sweep coverage to produce ROI% points for the sensitivity chart */
export function sweepCoverageForRoiPct({ V, M, r, h, w, a, F, S }, stepPct = 5) {
  const points = [];
  for (let pct = 0; pct <= 100; pct += stepPct) {
    const { ROI } = computeOutputs({
      V, M, c: pct / 100, r, h, w, a, F, S,
    });
    // Cap to keep the chart readable
    const roiPct = Math.min(ROI * 100, 50000);
    points.push({ x: pct, y: Number.isFinite(roiPct) ? roiPct : 50000 });
  }
  return points;
}
