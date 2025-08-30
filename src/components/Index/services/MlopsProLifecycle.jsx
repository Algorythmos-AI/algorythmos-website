import React, { useEffect, useMemo, useRef, useState } from "react";
import { FileCode, Database, Package, Workflow, MonitorCog, Play, Pause } from "lucide-react";

/**
 * Professional MLOps lifecycle: Develop → Train → Package & Deploy → Automate & Manage → Monitoring
 * - Tooltips expand acronyms on first mention:
 *   CI/CD = Continuous Integration/Continuous Delivery
 *   ML = Machine Learning
 *   AI = Artificial Intelligence
 *   W&B = Weights & Biases
 */
export default function MlopsProLifecycle() {
  const reduce = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  const steps = useMemo(() => ([
    {
      id: "develop",
      label: "Develop",
      icon: FileCode,
      tip: "Requirements, data checks, and repo conventions for ML (Machine Learning). Prototype fast, commit standards early."
    },
    {
      id: "train",
      label: "Train",
      icon: Database,
      tip: "Pipelines and model training with tracking in MLflow / W&B (Weights & Biases). Eval tests guard quality."
    },
    {
      id: "package",
      label: "Package & Deploy",
      icon: Package,
      tip: "Containerize with Docker; version in registry. Promote across environments with blue/green or canary strategies."
    },
    {
      id: "automate",
      label: "Automate & Manage",
      icon: Workflow,
      tip: "CI/CD (Continuous Integration/Continuous Delivery) gates for tests, bias checks, policies, and safe rollbacks."
    },
    {
      id: "monitor",
      label: "Monitoring",
      icon: MonitorCog,
      tip: "Observability: metrics, traces, cost, drift and guardrails. Alerts and retraining triggers keep AI (Artificial Intelligence) healthy."
    }
  ]), []);

  // Auto-advance highlight
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [speed, setSpeed] = useState(1); // 0.75 | 1 | 1.5
  useEffect(() => {
    if (reduce || !playing) return;
    const t = setInterval(() => setActive(a => (a + 1) % steps.length), 1600 / speed);
    return () => clearInterval(t);
  }, [playing, speed, reduce, steps.length]);

  // Layout refs
  const railRef = useRef(null);

  return (
    <div className="mt-6 pipeline-card p-5 md:p-6 relative overflow-hidden">
      {/* Controls */}
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="text-sm font-medium text-white/90">MLOps (Machine Learning Operations) Lifecycle</div>
        <div className="flex items-center gap-2">
          <button
            className="inline-flex items-center gap-2 rounded-md border border-white/20 bg-white/[0.08] px-3 py-1.5 text-sm text-white hover:bg-white/[0.12] focus-visible:pipeline-focus transition-colors"
            onClick={() => setPlaying(p => !p)}
            aria-pressed={playing}
          >
            {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {playing ? "Pause" : "Play"}
          </button>
          <select
            className="rounded-md border border-white/20 bg-white/[0.08] px-2 py-1.5 text-sm text-white hover:bg-white/[0.12] transition-colors"
            value={speed}
            onChange={(e) => setSpeed(parseFloat(e.target.value))}
            aria-label="Speed"
          >
            <option value={0.75}>0.75×</option>
            <option value={1}>1×</option>
            <option value={1.5}>1.5×</option>
          </select>
        </div>
      </div>

      {/* Rail + connectors */}
      <div className="relative mt-4">
        <div ref={railRef} className="relative mx-auto h-[120px] w-full max-w-5xl">
          {/* SVG connectors (draw-in) */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 100" aria-hidden="true">
            <defs>
              <marker id="arrow" markerWidth="12" markerHeight="12" refX="10" refY="4" orient="auto">
                <path d="M0,0 L12,4 L0,8 Z" fill="#8C6BFF" opacity="0.95" />
              </marker>
            </defs>
            {[0,1,2,3].map((i) => {
              const x1 = 100 + i * 200;
              const x2 = 280 + i * 200;
              return (
                <line
                  key={i}
                  x1={x1} y1={50} x2={x2} y2={50}
                  stroke="#8C6BFF"
                  strokeWidth="4"
                  strokeDasharray="240"
                  strokeDashoffset={reduce ? 0 : 240}
                  style={reduce ? {} : { animation: `lineDraw 1100ms ease forwards ${200 + i*120}ms` }}
                  markerEnd="url(#arrow)"
                  opacity="0.95"
                />
              );
            })}
          </svg>

          {/* Step nodes */}
          <div className="absolute inset-0 grid grid-cols-5 place-items-center">
            {steps.map((s, i) => {
              const Icon = s.icon;
              const isActive = i === active && !reduce;
              return (
                <div key={s.id} className="relative">
                  <button
                    className={`group grid place-items-center rounded-full border-2 border-white/30 bg-white/[0.08] p-4 transition-all duration-200 hover:bg-white/[0.15] hover:border-white/50 focus-visible:pipeline-focus ${isActive ? "ring-2 ring-[#6D00FF] ring-offset-2 ring-offset-black" : ""}`}
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    aria-describedby={`${s.id}-tip`}
                  >
                    {/* subtle pulse ring */}
                    {!reduce && (
                      <span
                        className="absolute inset-0 rounded-full"
                        style={{
                          transformOrigin: "center",
                          animation: isActive ? "pulseRing 2.2s ease-in-out infinite" : "none",
                          background: "radial-gradient(closest-side, rgba(109,0,255,.3), transparent 70%)"
                        }}
                        aria-hidden="true"
                      />
                    )}
                    <Icon className="h-7 w-7 text-white relative z-10" />
                  </button>
                  <div className="mt-3 text-center text-sm font-semibold text-white/95">{s.label}</div>

                  {/* Tooltip */}
                  <div
                    id={`${s.id}-tip`}
                    role="tooltip"
                    className="pipeline-tooltip absolute left-1/2 mt-4 w-72 -translate-x-1/2 p-4 text-sm text-white/90 transition-opacity"
                    style={{
                      opacity: isActive ? 1 : 0,
                      pointerEvents: isActive ? "auto" : "none",
                      animation: isActive && !reduce ? "popIn 280ms ease both" : "none",
                      zIndex: 10
                    }}
                  >
                    {s.tip}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
