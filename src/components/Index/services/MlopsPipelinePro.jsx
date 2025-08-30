import React, { useEffect, useMemo, useState } from "react";
import { Play, Pause } from "lucide-react";
import { NotebookIcon, RegistryIcon, BoxIcon, WorkflowIcon, MonitorIcon } from "./icons/BrandMlopsIcons";

/**
 * Professional, legible MLOps pipeline with brand icons.
 * First-mention expansions in Details panel:
 *  - CI/CD = Continuous Integration/Continuous Delivery
 *  - ML = Machine Learning
 *  - AI = Artificial Intelligence
 *  - W&B = Weights & Biases
 *  - RBAC = Role-Based Access Control
 */
export default function MlopsPipelinePro() {
  const [reduce, setReduce] = useState(false);

  // Check for reduced motion preference
  useEffect(() => {
    const checkReducedMotion = () => {
      const prefersReduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
      setReduce(prefersReduced || false);
    };

    checkReducedMotion();
    
    // Listen for changes
    const mediaQuery = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (mediaQuery) {
      mediaQuery.addEventListener("change", checkReducedMotion);
      return () => mediaQuery.removeEventListener("change", checkReducedMotion);
    }
  }, []);

  const steps = useMemo(() => ([
    {
      id: "develop",
      label: "Develop",
      icon: NotebookIcon,
      oneLiner: "Requirements, data checks, and repo conventions for ML (Machine Learning).",
      tags: ["Notebooks & repos", "Code quality gates", "Data contracts"]
    },
    {
      id: "train",
      label: "Train",
      icon: RegistryIcon,
      oneLiner: "Training pipelines with run tracking in MLflow / W&B (Weights & Biases).",
      tags: ["MLflow", "W&B (Weights & Biases)", "Eval tests"]
    },
    {
      id: "package",
      label: "Package & Deploy",
      icon: BoxIcon,
      oneLiner: "Containerize with Docker; version & promote artifacts across environments.",
      tags: ["Docker registry", "Blue/green", "Canary"]
    },
    {
      id: "automate",
      label: "Automate & Manage",
      icon: WorkflowIcon,
      oneLiner: "CI/CD (Continuous Integration/Continuous Delivery) gates, policy checks, and rollbacks.",
      tags: ["GitHub Actions", "GitLab CI (Continuous Integration)", "Argo"]
    },
    {
      id: "monitor",
      label: "Monitoring",
      icon: MonitorIcon,
      oneLiner: "Observability for metrics, traces, cost, drift, and guardrails—keeps AI (Artificial Intelligence) healthy.",
      tags: ["Prometheus / Grafana", "Drift alerts", "RBAC (Role-Based Access Control)"]
    }
  ]), []);

  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);

  useEffect(() => {
    if (reduce || !playing) return;
    
    const interval = setInterval(() => {
      setActive(a => (a + 1) % steps.length);
    }, 1600 / speed);
    
    return () => clearInterval(interval);
  }, [playing, speed, reduce, steps.length]);

  const onStep = (i) => { setActive(i); };

  return (
    <div className="mt-6 pipeline-surface p-5 md:p-6">
      {/* Header row */}
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="text-sm text-white/70">MLOps (Machine Learning Operations) Lifecycle</div>
        <div className="flex items-center gap-2">
          <a href="#reference-architecture" className="btn-ghost text-sm">See reference architecture</a>
          <button
            className="inline-flex items-center gap-2 btn-ghost"
            onClick={() => setPlaying(p => !p)}
            aria-pressed={playing}
          >
            {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {playing ? "Pause" : "Play"}
          </button>
          <select
            className="btn-ghost px-2 py-1.5"
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

      {/* Desktop rail */}
      <div className="hidden md:block">
        <div className="relative mx-auto mb-3 h-2 w-full max-w-6xl">
          {[0,1,2,3,4].map((i) => (
            <div key={i}
              className="absolute top-0 h-2 rounded-full"
              style={{
                left: `${i*25}%`,
                width: i===4 ? "0%" : "25%",
                background: "linear-gradient(90deg,#6D00FF,#7658E7)",
                transformOrigin: "left",
                transform: (i < active && !reduce) ? "scaleX(1)" : (i < active ? "scaleX(1)" : "scaleX(0)"),
                animation: (!reduce && i < active) ? "lineGrow 700ms ease forwards" : "none",
                opacity: i < active ? 0.9 : 0.15
              }}
            />
          ))}
          <div className="absolute inset-0 w-full rounded-full bg-white/10" />
        </div>

        <div className="mx-auto grid max-w-6xl grid-cols-5 gap-4">
          {steps.map((s, i) => {
            const Icon = s.icon;
            const isActive = i === active && !reduce;
            return (
              <button
                key={s.id}
                onMouseEnter={() => onStep(i)}
                onFocus={() => onStep(i)}
                className="group relative flex flex-col items-center gap-2 rounded-xl border border-white/12 bg-white/[0.03] px-3 py-4 hover:bg-white/[0.07] focus-visible:pipeline-focus"
                style={{ animation: reduce ? "none" : "popIn 240ms ease both" }}
                aria-current={i===active}
              >
                <div className="relative grid h-14 w-14 place-items-center icon-tile">
                  {!reduce && isActive && (
                    <span aria-hidden className="absolute -inset-1 rounded-full"
                      style={{ background:"radial-gradient(closest-side, rgba(109,0,255,.22), transparent 70%)", animation:"pulseRing 2.2s ease-in-out infinite" }} />
                  )}
                  <Icon className="relative z-10 h-6 w-6 text-white" />
                </div>
                <div className="text-sm font-semibold text-white text-center">{s.label}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile stepper */}
      <div className="md:hidden">
        <div className="relative">
          <div className="absolute left-5 top-8 bottom-8 w-[3px] bg-white/10" />
          <div className="flex flex-col gap-4">
            {steps.map((s, i) => {
              const Icon = s.icon;
              const isActive = i === active && !reduce;
              return (
                <button
                  key={s.id}
                  onClick={() => onStep(i)}
                  className="relative flex items-start gap-4 rounded-xl border border-white/12 bg-white/[0.03] p-3 text-left hover:bg-white/[0.07] focus-visible:pipeline-focus"
                >
                  <div className="relative ml-3 grid h-10 w-10 place-items-center icon-tile">
                    <Icon className="h-5 w-5 text-white" />
                    {isActive && !reduce && (
                      <span aria-hidden className="absolute -inset-1 rounded-full"
                        style={{ background:"radial-gradient(closest-side, rgba(109,0,255,.22), transparent 70%)", animation:"pulseRing 2.2s ease-in-out infinite" }} />
                    )}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">{s.label}</div>
                    <div className="mt-1 text-sm text-white/70">{s.oneLiner}</div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {s.tags.map((t, k) => <span key={k} className="pipeline-chip">{t}</span>)}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Details panel + link */}
      <div className="mt-5 flex flex-col gap-3 rounded-xl border border-white/12 bg-white/[0.03] p-4 md:flex-row md:items-center md:justify-between">
        <div className="text-sm text-white/85 md:pr-6">
          <span className="font-semibold">{steps[active].label} — </span>
          {steps[active].oneLiner}
          <div className="mt-3 flex flex-wrap gap-2">
            {steps[active].tags.map((t, i) => (<span key={i} className="pipeline-chip">{t}</span>))}
          </div>
        </div>
        <a href="#reference-architecture" className="btn-ghost text-sm self-start md:self-auto">
          See reference architecture
        </a>
      </div>
    </div>
  );
}
