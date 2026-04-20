import { describe, it, expect } from "vitest";
import { computeOutputs, computeBaselineM } from "./roiMath";

describe("ROI math", () => {
  it("Zero volume → C_AI=0; ROI reflects M vs F (here = 1)", () => {
    const M = 1000, F = 500;
    const out = computeOutputs({ V: 0, M, c: 0.5, r: 1, h: 2, w: 40, a: 0.01, F, S: 1000 });
    expect(out.C_AI).toBe(0);
    // ROI (Return On Investment) = max(0, M - F) / F = (1000 - 500) / 500 = 1
    const expected = Math.max(0, M - F) / F;
    expect(out.ROI).toBeCloseTo(expected, 10);
  });

  it("Invest=0 & Savings>0 → ROI=Infinity", () => {
    const out = computeOutputs({ V: 0, M: 5000, c: 0, r: 0, h: 0, w: 0, a: 0, F: 0, S: 1000 });
    expect(out.Invest).toBe(0);
    expect(out.Savings).toBeGreaterThan(0);
    expect(out.ROI).toBe(Infinity);
  });

  it("Savings<=0 → Payback=Infinity", () => {
    const out = computeOutputs({ V: 1, M: 0, c: 0, r: 0, h: 60, w: 100, a: 10, F: 500, S: 1000 });
    expect(out.Savings).toBe(0);
    expect(out.Payback).toBe(Infinity);
  });

  it("Computed baseline M matches definition", () => {
    const M = computeBaselineM({ V: 1000, h: 2, w: 40, overheadPct: 0.2 });
    // hours_manual=(1000*2)/60=33.333..., labor=1333.33, M=1600
    expect(Math.round(M)).toBe(1600);
  });

  it("Known bundle sanity check", () => {
    const out = computeOutputs({ V: 10000, M: 5000, c: 0.6, r: 0.5, h: 2.5, w: 38, a: 0.006, F: 3500, S: 8000 });
    // sanity: all numbers should be finite and non-negative
    ["H_review","H_residual","C_labor","C_AI","C_proposed","Savings","Invest","ROI","Payback"].forEach((k) => {
      expect(Number.isFinite(out[k]) || out[k] === Infinity).toBeTruthy();
      expect(out[k] >= 0 || out[k] === Infinity).toBeTruthy();
    });
  });
});
