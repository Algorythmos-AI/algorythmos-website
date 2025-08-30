import React, { useEffect, useMemo, useState, useCallback } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import { Play, Pause, RotateCcw, Copy, ChevronRight, ChevronLeft, Database, BarChart3, Users, Shield, TrendingUp } from "lucide-react";
import FlowMetricsStrip from "./FlowMetricsStrip";
// Optional analytics (safe if missing)
let track = () => {};
try {
  // eslint-disable-next-line import/no-unresolved
  track = require("../../../lib/analytics").track || (() => {});
} catch {}

/**
 * SqlDashboardFlowPlayer
 * Professional SQL Dashboard pipeline demo:
 * 1) Raw Data → 2) Transform & Model → 3) Metrics & Dimensions → 4) Governance → 5) Dashboards
 *
 * Enhanced with professional styling, smooth animations, and improved UX.
 * Respects prefers-reduced-motion; has Play/Pause, Step, Restart, Speed, Copy Link.
 */
export default function SqlDashboardFlowPlayer() {
  const reduce = useReducedMotion();

  // URL state (shareable deep link)
  const [params, setParams] = useSearchParams();
  const [playing, setPlaying] = useState(params.get("autoplay") !== "0" && !reduce);
  const [speed, setSpeed] = useState(parseFloat(params.get("speed") || "1"));
  const [key, setKey] = useState(0);
  const [step, setStep] = useState(parseInt(params.get("step") || "0", 10));

  // Per-step metrics for SQL Dashboards (example values)
  const dashboardMetrics = [
    { queries: 1200, users: 8, time: 45,  cost: 2.8 },  // Raw Data
    { queries: 850, users: 12, time: 32,  cost: 2.1 },  // Transform
    { queries: 650, users: 25, time: 18,  cost: 1.4 },  // Metrics
    { queries: 420, users: 35, time: 12,  cost: 0.9 },  // Governance
    { queries: 280, users: 50, time: 6,   cost: 0.4 },  // Dashboards
  ];

  useEffect(() => {
    params.set("step", String(step));
    params.set("speed", String(speed));
    params.set("autoplay", playing ? "1" : "0");
    setParams(params, { replace: true });
  }, [step, speed, playing]); // eslint-disable-line

  // Node geometry (viewBox 920x520) - optimized for dashboard flow
  const P = useMemo(
    () => ({
      // Smooth curves for data flow
      rawToTransform: "M 200 275 Q 230 275 260 275",
      transformToMetrics: "M 400 275 Q 430 275 460 275",
      metricsToGovernance: "M 600 275 Q 630 275 660 275",
      governanceToDashboards: "M 800 275 Q 830 275 860 275",
      // Feedback loop from dashboards back to metrics
      dashboardsToMetrics: "M 860 275 Q 830 275 600 275",
    }),
    []
  );

  // Timeline with dashboard-specific flow
  const timeline = useMemo(
    () => [
      {
        id: "raw-data",
        title: "1) Raw Data",
        caption:
          "Connect to data warehouses (Postgres, Snowflake, BigQuery) and ingest raw business data from multiple sources.",
        packets: [{ path: P.rawToTransform, color: "#ffffff", duration: 1.5 }],
        glow: ["raw-data", "transform"],
        duration: 2.0,
      },
      {
        id: "transform",
        title: "2) Transform & Model",
        caption:
          "Use dbt or SQL models to clean, standardize, and create reusable data models with proper documentation.",
        packets: [{ path: P.transformToMetrics, color: "#ffffff", duration: 1.5 }],
        glow: ["transform", "metrics"],
        duration: 2.0,
      },
      {
        id: "metrics",
        title: "3) Metrics & Dimensions",
        caption:
          "Define business metrics once (revenue, conversions, churn) and dimensions (time, region, product) for consistency.",
        packets: [{ path: P.metricsToGovernance, color: "#ffffff", duration: 1.5 }],
        glow: ["metrics"],
        duration: 2.0,
      },
      {
        id: "governance",
        title: "4) Governance & Security",
        caption:
          "Apply RBAC, row-level security, and data quality checks. Set up alerts and change management via Git.",
        packets: [{ path: P.governanceToDashboards, color: "#ffffff", duration: 1.5 }],
        glow: ["governance", "dashboards"],
        duration: 2.0,
      },
      {
        id: "dashboards",
        title: "5) Dashboards & Insights",
        caption:
          "Create executive-ready dashboards in Metabase/Looker with real-time alerts and self-serve analytics capabilities.",
        packets: [
          { path: P.governanceToDashboards, color: "#34d399", duration: 1.2 },
          // Feedback loop for iterative improvements
          { path: P.dashboardsToMetrics, color: "#fbbf24", delay: 1.0, duration: 1.8 },
        ],
        glow: ["dashboards", "metrics"],
        duration: 3.0,
      },
    ],
    [P]
  );

  // Auto-advance with better timing
  useEffect(() => {
    if (reduce || !playing) return;
    const d = timeline[step]?.duration ?? 2.0;
    const t = setTimeout(() => {
      setStep((s) => (s + 1) % timeline.length);
      setKey((k) => k + 1);
    }, (d * 1000) / speed + 200);
    return () => clearTimeout(t);
  }, [step, playing, speed, reduce, timeline]);

  const current = timeline[step];

  const restart = useCallback(() => {
    setStep(0);
    setKey((k) => k + 1);
    try {
      track("flow_restart", { flow: "sqldashboards" });
    } catch {}
  }, []);
  
  const next = useCallback(() => {
    setStep((s) => (s + 1) % timeline.length);
    setKey((k) => k + 1);
    try {
      track("flow_step", { flow: "sqldashboards", step: (step + 1) % timeline.length });
    } catch {}
  }, [step, timeline.length]);

  const prev = useCallback(() => {
    setStep((s) => (s - 1 + timeline.length) % timeline.length);
    setKey((k) => k + 1);
    try {
      track("flow_step", { flow: "sqldashboards", step: (step - 1 + timeline.length) % timeline.length });
    } catch {}
  }, [step, timeline.length]);

  const share = async () => {
    const url = new URL(window.location.href);
    url.searchParams.set("step", String(step));
    url.searchParams.set("speed", String(speed));
    url.searchParams.set("autoplay", playing ? "1" : "0");
    await navigator.clipboard.writeText(url.toString());
  };

  // key controls
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === " ") {
        e.preventDefault();
        setPlaying((p) => !p);
      }
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  const glow = (id) => current?.glow?.includes(id);

  return (
    <section className="mt-10">
      {/* Enhanced Controls */}
      <div className="flex items-center justify-between mb-4 p-4 rounded-xl border border-white/10 bg-white/[0.02] backdrop-blur-sm">
        {/* Step Indicators */}
        <div className="flex items-center gap-2">
          {timeline.map((t, i) => (
            <button
              key={t.id}
              onClick={() => {
                setStep(i);
                setKey((k) => k + 1);
              }}
              className={`relative flex items-center justify-center w-8 h-8 rounded-full border transition-all duration-300 ${
                i === step
                  ? "border-emerald-400/70 bg-emerald-400/10 text-emerald-400 shadow-lg shadow-emerald-400/20"
                  : "border-white/15 text-gray-300 hover:border-white/30 hover:bg-white/5"
              }`}
              title={t.title}
            >
              <span className="text-xs font-medium">{i + 1}</span>
              {i === step && (
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-emerald-400/30"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1.2, opacity: 1 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Control Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setPlaying((p) => !p);
              try {
                track("flow_play_toggle", { flow: "sqldashboards" });
              } catch {}
            }}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-white/15 hover:border-white/30 text-gray-200 hover:bg-white/5 transition-all duration-200"
            aria-pressed={playing}
          >
            {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {playing ? "Pause" : "Play"}
          </button>
          
          <button
            onClick={prev}
            className="p-2 rounded-lg border border-white/15 hover:border-white/30 text-gray-200 hover:bg-white/5 transition-all duration-200"
            title="Previous step"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          
          <button
            onClick={next}
            className="p-2 rounded-lg border border-white/15 hover:border-white/30 text-gray-200 hover:bg-white/5 transition-all duration-200"
            title="Next step"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          
          <button
            onClick={restart}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-white/15 hover:border-white/30 text-gray-200 hover:bg-white/5 transition-all duration-200"
            title="Restart animation"
          >
            <RotateCcw className="h-4 w-4" />
            Restart
          </button>
          
          <button
            onClick={share}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-white/15 hover:border-white/30 text-gray-200 hover:bg-white/5 transition-all duration-200"
            title="Copy link to this step"
          >
            <Copy className="h-4 w-4" />
            Copy link
          </button>
          
          <div className="flex items-center gap-2 ml-2">
            <label className="text-xs text-gray-400">Speed</label>
            <select
              className="bg-black/40 border border-white/10 rounded-md text-gray-200 text-xs px-2 py-1.5 hover:border-white/20 transition-colors"
              value={speed}
              onChange={(e) => {
                const v = parseFloat(e.target.value);
                setSpeed(v);
                try {
                  track("flow_speed", { flow: "sqldashboards", speed: v });
                } catch {}
              }}
              aria-label="Animation speed"
            >
              <option value={0.75}>0.75×</option>
              <option value={1}>1×</option>
              <option value={1.5}>1.5×</option>
            </select>
          </div>
        </div>
      </div>

      {/* Enhanced Canvas */}
      <div className="relative rounded-2xl border border-white/10 bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 shadow-2xl overflow-hidden">
        {/* Chrome */}
        <div className="h-8 rounded-t-2xl border-b border-white/10 px-4 flex items-center gap-2 bg-gradient-to-r from-slate-900 to-slate-800">
          <span className="w-3 h-3 rounded-full bg-rose-400/80" />
          <span className="w-3 h-3 rounded-full bg-amber-300/80" />
          <span className="w-3 h-3 rounded-full bg-emerald-400/80" />
          <div className="ml-auto text-xs text-gray-400">SQL Dashboard Pipeline</div>
        </div>

        <div className="p-6 md:p-8">
          <svg viewBox="0 0 920 520" className="w-full h-auto" aria-hidden="true">
            <defs>
              <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#000" floodOpacity="0.4" />
              </filter>
              <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
                <feMerge> 
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
              {/* Enhanced glow filter for active nodes */}
              <filter id="activeGlow" x="-100%" y="-100%" width="300%" height="300%">
                <feGaussianBlur stdDeviation="4" result="blur"/>
                <feFlood floodColor="#10b981" floodOpacity="0.3" result="color"/>
                <feComposite in="color" in2="blur" operator="in" result="glow"/>
                <feMerge>
                  <feMergeNode in="glow"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>

            {/* Raw Data */}
            <g transform="translate(60,220)" filter={glow("raw-data") ? "url(#activeGlow)" : "url(#soft)"} id="node-raw-data">
              <title>Raw Data — warehouses, APIs, files.</title>
              <rect
                width="140"
                height="110"
                rx="16"
                fill="#0B1220"
                className={`transition-all duration-700 ${
                  glow("raw-data") ? "stroke-emerald-400/80" : "stroke-white/10"
                }`}
                stroke="currentColor"
                strokeWidth="2"
              />
              {/* Database icon - properly sized and centered */}
              <g transform="translate(25,20)" fill="#A7F3D0">
                <ellipse cx="45" cy="8" rx="45" ry="8" />
                <rect x="0" y="8" width="90" height="50" rx="4" />
                <ellipse cx="45" cy="58" rx="45" ry="8" />
                <path d="M0 16 H90" stroke="#A7F3D0" strokeWidth="1" />
                <path d="M0 26 H90" stroke="#A7F3D0" strokeWidth="1" />
                <path d="M0 36 H90" stroke="#A7F3D0" strokeWidth="1" />
                <path d="M0 46 H90" stroke="#A7F3D0" strokeWidth="1" />
              </g>
              <text x="70" y="88" textAnchor="middle" fontSize="14" fill="white" className="font-medium">
                Raw Data
              </text>
            </g>

            {/* Transform & Model */}
            <g transform="translate(260,220)" filter={glow("transform") ? "url(#activeGlow)" : "url(#soft)"} id="node-transform">
              <title>Transform & Model — dbt, SQL models.</title>
              <rect
                width="140"
                height="110"
                rx="16"
                fill="#101635"
                className={`transition-all duration-700 ${
                  glow("transform") ? "stroke-emerald-400/80" : "stroke-white/12"
                }`}
                stroke="currentColor"
                strokeWidth="2"
              />
              {/* Code/Model icon - improved design */}
              <g transform="translate(20,20)" fill="#A7F3D0">
                <rect x="0" y="0" width="100" height="70" rx="6" fill="none" stroke="#A7F3D0" strokeWidth="2" />
                <path d="M10 15 L35 15 M10 25 L45 25 M10 35 L40 35 M10 45 L30 45 M10 55 L25 55" stroke="#A7F3D0" strokeWidth="2" />
                <circle cx="85" cy="15" r="3" fill="#A7F3D0" />
                <circle cx="85" cy="25" r="3" fill="#A7F3D0" />
                <circle cx="85" cy="35" r="3" fill="#A7F3D0" />
              </g>
              <text x="70" y="88" textAnchor="middle" fontSize="14" fill="white" className="font-medium">
                Transform
              </text>
            </g>

            {/* Metrics & Dimensions */}
            <g transform="translate(460,220)" filter={glow("metrics") ? "url(#activeGlow)" : "url(#soft)"} id="node-metrics">
              <title>Metrics & Dimensions — business definitions.</title>
              <rect
                width="140"
                height="110"
                rx="12"
                fill="#0B1220"
                className={`transition-all duration-700 ${glow("metrics") ? "stroke-emerald-400/80" : "stroke-white/12"}`}
                stroke="currentColor"
                strokeWidth="2"
              />
              {/* Metrics icon - distinct from transform */}
              <g transform="translate(20,20)" fill="#A7F3D0">
                <rect x="0" y="0" width="100" height="70" rx="6" fill="none" stroke="#A7F3D0" strokeWidth="2" />
                <path d="M10 15 L40 15 M10 25 L50 25 M10 35 L45 35 M10 45 L35 45 M10 55 L30 55" stroke="#A7F3D0" strokeWidth="2" />
                <circle cx="85" cy="15" r="4" fill="#A7F3D0" />
                <circle cx="85" cy="25" r="4" fill="#A7F3D0" />
                <circle cx="85" cy="35" r="4" fill="#A7F3D0" />
                <circle cx="85" cy="45" r="4" fill="#A7F3D0" />
                <circle cx="85" cy="55" r="4" fill="#A7F3D0" />
              </g>
              <text x="70" y="88" textAnchor="middle" fontSize="14" fill="white" className="font-medium">
                Metrics
              </text>
            </g>

            {/* Governance & Security */}
            <g transform="translate(660,220)" filter={glow("governance") ? "url(#activeGlow)" : "url(#soft)"} id="node-governance">
              <title>Governance & Security — RBAC, security.</title>
              <rect
                width="140"
                height="110"
                rx="12"
                fill="#0B1220"
                className={`transition-all duration-700 ${
                  glow("governance") ? "stroke-emerald-400/80" : "stroke-white/12"
                }`}
                stroke="currentColor"
                strokeWidth="2"
              />
              {/* Security/Shield icon - properly sized */}
              <g transform="translate(25,15)" fill="#A7F3D0">
                <path d="M45 10 L65 25 L65 45 C65 60 45 70 45 70 C45 70 25 60 25 45 L25 25 Z" />
                <path d="M35 30 L45 40 L55 30" stroke="#0B1220" strokeWidth="2.5" fill="none" />
              </g>
              <text x="70" y="88" textAnchor="middle" fontSize="14" fill="white" className="font-medium">
                Governance
              </text>
            </g>

            {/* Dashboards & Insights */}
            <g transform="translate(860,220)" filter={glow("dashboards") ? "url(#activeGlow)" : "url(#soft)"} id="node-dashboards">
              <title>Dashboards & Insights — BI tools, alerts.</title>
              <rect
                width="120"
                height="110"
                rx="12"
                fill="#052E2B"
                className={`transition-all duration-700 ${
                  glow("dashboards") ? "stroke-emerald-400/80" : "stroke-emerald-400/30"
                }`}
                stroke="currentColor"
                strokeWidth="2"
              />
              {/* Dashboard/Chart icon - properly sized and distinct */}
              <g transform="translate(15,15)" fill="#CFFAEA">
                <rect x="0" y="0" width="90" height="80" rx="6" fill="none" stroke="#CFFAEA" strokeWidth="2" />
                <rect x="10" y="10" width="20" height="60" fill="#CFFAEA" />
                <rect x="35" y="20" width="20" height="50" fill="#CFFAEA" />
                <rect x="60" y="15" width="20" height="55" fill="#CFFAEA" />
                <path d="M10 50 L30 40 L50 45 L70 35" stroke="#0B1220" strokeWidth="2" fill="none" />
              </g>
              <text x="60" y="88" textAnchor="middle" fontSize="14" fill="#CFFAEA" className="font-medium">
                Dashboards
              </text>
            </g>

            {/* Background dashed guides - improved opacity */}
            <g strokeDasharray="6 6" stroke="#ffffff" opacity="0.3" fill="none" strokeWidth="2">
              <path d={P.rawToTransform} />
              <path d={P.transformToMetrics} />
              <path d={P.metricsToGovernance} />
              <path d={P.governanceToDashboards} />
            </g>
            {/* Feedback loop (amber) - improved visibility */}
            <path d={P.dashboardsToMetrics} stroke="#fbbf24" strokeWidth="2.5" strokeDasharray="7 7" fill="none" opacity="0.8" />
          </svg>

          {/* Enhanced Packets overlay */}
          <div className="pointer-events-none absolute inset-0">
            {current?.packets?.map((pkt, i) => (
              <motion.div
                key={`${current.id}-${i}-${key}`}
                initial={{ offsetDistance: "0%" }}
                animate={{ offsetDistance: ["0%", "100%"] }}
                transition={{ 
                  duration: (pkt.duration || current.duration) / speed, 
                  ease: "easeInOut", 
                  delay: pkt.delay || 0 
                }}
                style={{
                  offsetPath: `path('${pkt.path}')`,
                  width: 14,
                  height: 14,
                  borderRadius: 9999,
                  background: pkt.color,
                  boxShadow: `0 0 16px ${pkt.color}, 0 0 24px ${pkt.color}66`,
                  position: "absolute",
                  top: 0,
                  left: 0,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced Legend */}
      <div className="mt-4 flex flex-wrap gap-6 text-sm text-gray-300">
        <span className="inline-flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-white shadow-[0_0_8px_#ffffff]"></span> Data flow
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]"></span> Dashboard delivery
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-amber-400 shadow-[0_0_8px_#fbbf24]"></span> Feedback loop
        </span>
      </div>

      {/* Enhanced Caption */}
      <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-sm">
        <p className="text-base font-semibold text-white mb-2">{current.title}</p>
        <p className="text-sm text-gray-300 leading-relaxed" aria-live="polite">
          {current.caption}
        </p>
      </div>

      <FlowMetricsStrip
        items={[
          { label: "Daily queries", value: dashboardMetrics[step].queries, suffix: "", aria: "Number of daily SQL queries" },
          { label: "Active users", value: dashboardMetrics[step].users, suffix: "", aria: "Number of active dashboard users" },
          { label: "Query response time", value: dashboardMetrics[step].time, suffix: "ms", aria: "Average query response time" },
          { label: "Cost per query", value: dashboardMetrics[step].cost, suffix: "€", aria: "Cost per SQL query" },
        ]}
      />

      <noscript>
        <p className="mt-3 text-xs text-gray-400">
          Animations disabled: Flow is Raw Data → Transform → Metrics → Governance → Dashboards (with feedback loop).
        </p>
      </noscript>
    </section>
  );
}
