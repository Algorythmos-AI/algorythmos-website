import React, { useEffect, useMemo, useState, useCallback } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import { Play, Pause, RotateCcw, Copy, ChevronRight, ChevronLeft } from "lucide-react";
import FlowMetricsStrip from "./FlowMetricsStrip";
// Optional analytics (safe if missing)
let track = () => {};
try {
  // eslint-disable-next-line import/no-unresolved
  track = require("../../../lib/analytics").track || (() => {});
} catch {}

/**
 * DocIntelFlowPlayer
 * Professional Document Intelligence pipeline demo:
 * 1) Ingest → 2) OCR → 3) Extract → 4) Validate (with correction loop) → 5) Export (ERP/DB)
 *
 * Enhanced with professional styling, smooth animations, and improved UX.
 * Respects prefers-reduced-motion; has Play/Pause, Step, Restart, Speed, Copy Link.
 */
export default function DocIntelFlowPlayer() {
  const reduce = useReducedMotion();

  // URL state (shareable deep link)
  const [params, setParams] = useSearchParams();
  const [playing, setPlaying] = useState(params.get("autoplay") !== "0" && !reduce);
  const [speed, setSpeed] = useState(parseFloat(params.get("speed") || "1"));
  const [key, setKey] = useState(0);
  const [step, setStep] = useState(parseInt(params.get("step") || "0", 10));

  // Per-step metrics for Document Intelligence (example values)
  const docMetrics = [
    { acc: 82, auto: 30, time: 90,  cost: 3.5 },  // Ingest
    { acc: 88, auto: 35, time: 75,  cost: 3.1 },  // OCR
    { acc: 93, auto: 48, time: 45,  cost: 2.2 },  // Extract
    { acc: 95, auto: 55, time: 30,  cost: 1.4 },  // Validate
    { acc: 96, auto: 78, time: 8,   cost: 0.45 }, // Export
  ];

  useEffect(() => {
    params.set("step", String(step));
    params.set("speed", String(speed));
    params.set("autoplay", playing ? "1" : "0");
    setParams(params, { replace: true });
  }, [step, speed, playing]); // eslint-disable-line

  // Node geometry (viewBox 920x520) - improved paths for smoother animation
  const P = useMemo(
    () => ({
      // Smoother curves and better timing
      sourcesToIngest: "M 200 275 Q 230 275 260 275",
      ingestToOCR: "M 400 275 Q 400 215 400 155",
      ocrToExtract: "M 530 210 Q 530 275 530 340",
      extractToValidate: "M 600 395 Q 625 395 650 280",
      validateToExport: "M 810 280 Q 820 280 830 280",
      // correction loop (validate back to extract) - smoother curve
      validateToExtract: "M 650 280 Q 625 280 600 395",
    }),
    []
  );

  // Timeline with improved timing and flow
  const timeline = useMemo(
    () => [
      {
        id: "ingest",
        title: "1) Ingest",
        caption:
          "Documents arrive from inbox, uploads, S3, or APIs. We normalize filenames/metadata and queue them.",
        packets: [{ path: P.sourcesToIngest, color: "#ffffff", duration: 1.5 }],
        glow: ["sources", "ingest"],
        duration: 2.0,
      },
      {
        id: "ocr",
        title: "2) OCR",
        caption:
          "High-quality OCR renders text and layout structure (tables, boxes) for downstream extraction.",
        packets: [{ path: P.ingestToOCR, color: "#ffffff", duration: 1.5 }],
        glow: ["ingest", "ocr"],
        duration: 2.0,
      },
      {
        id: "extract",
        title: "3) Extract",
        caption:
          "Domain-tuned NLP parses entities (amounts, vendors, dates, line items) with confidence scores.",
        packets: [{ path: P.ocrToExtract, color: "#ffffff", duration: 1.5 }],
        glow: ["extract"],
        duration: 2.0,
      },
      {
        id: "validate",
        title: "4) Validate",
        caption:
          "Rules + human-in-the-loop verify edge cases. If a check fails, we loop back to correct.",
        packets: [
          { path: P.extractToValidate, color: "#ffffff", duration: 1.8 },
          // correction loop (amber) - delayed and slower
          { path: P.validateToExtract, color: "#fbbf24", delay: 1.0, duration: 1.2 },
        ],
        glow: ["validate", "extract"],
        duration: 3.0,
      },
      {
        id: "export",
        title: "5) Export",
        caption:
          "Approved records are exported to ERP/DB with full audit trail and schema validation.",
        packets: [{ path: P.validateToExport, color: "#34d399", duration: 1.2 }],
        glow: ["validate", "export"],
        duration: 1.8,
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
    }, (d * 1000) / speed + 200); // Added buffer for smoother transitions
    return () => clearTimeout(t);
  }, [step, playing, speed, reduce, timeline]);

  const current = timeline[step];

  const restart = useCallback(() => {
    setStep(0);
    setKey((k) => k + 1);
    try {
      track("flow_restart", { flow: "docintel" });
    } catch {}
  }, []);
  
  const next = useCallback(() => {
    setStep((s) => (s + 1) % timeline.length);
    setKey((k) => k + 1);
    try {
      track("flow_step", { flow: "docintel", step: (step + 1) % timeline.length });
    } catch {}
  }, [step, timeline.length]);

  const prev = useCallback(() => {
    setStep((s) => (s - 1 + timeline.length) % timeline.length);
    setKey((k) => k + 1);
    try {
      track("flow_step", { flow: "docintel", step: (step - 1 + timeline.length) % timeline.length });
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
                track("flow_play_toggle", { flow: "docintel" });
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
                  track("flow_speed", { flow: "docintel", speed: v });
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
          <div className="ml-auto text-xs text-gray-400">Document Intelligence Pipeline</div>
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

            {/* Sources */}
            <g transform="translate(60,220)" filter={glow("sources") ? "url(#activeGlow)" : "url(#soft)"} id="node-sources">
              <title>Sources — inbox, uploads, S3, APIs.</title>
              <rect
                width="140"
                height="110"
                rx="16"
                fill="#0B1220"
                className={`transition-all duration-700 ${
                  glow("sources") ? "stroke-emerald-400/80" : "stroke-white/10"
                }`}
                stroke="currentColor"
                strokeWidth="2"
              />
              {/* tray icon */}
              <g transform="translate(20,22)">
                <rect x="0" y="20" width="48" height="16" rx="4" fill="#A7F3D0" />
                <path d="M0 20 L12 8 H36 L48 20" fill="#A7F3D0" />
              </g>
              <text x="70" y="88" textAnchor="middle" fontSize="14" fill="white" className="font-medium">
                Sources
              </text>
            </g>

            {/* Ingest */}
            <g transform="translate(260,220)" filter={glow("ingest") ? "url(#activeGlow)" : "url(#soft)"} id="node-ingest">
              <title>Ingest — normalize, queue, classify.</title>
              <rect
                width="140"
                height="110"
                rx="16"
                fill="#101635"
                className={`transition-all duration-700 ${
                  glow("ingest") ? "stroke-emerald-400/80" : "stroke-white/12"
                }`}
                stroke="currentColor"
                strokeWidth="2"
              />
              {/* funnel icon */}
              <g transform="translate(35,25)" fill="#A7F3D0">
                <path d="M35 15 L45 25 L45 35 L25 35 L25 25 Z" />
                <rect x="30" y="35" width="10" height="8" rx="2" />
              </g>
              <text x="70" y="88" textAnchor="middle" fontSize="14" fill="white" className="font-medium">
                Ingest
              </text>
            </g>

            {/* OCR */}
            <g transform="translate(460,100)" filter={glow("ocr") ? "url(#activeGlow)" : "url(#soft)"} id="node-ocr">
              <title>OCR — text + layout extraction.</title>
              <rect
                width="140"
                height="110"
                rx="12"
                fill="#0B1220"
                className={`transition-all duration-700 ${glow("ocr") ? "stroke-emerald-400/80" : "stroke-white/12"}`}
                stroke="currentColor"
                strokeWidth="2"
              />
              {/* document with lines */}
              <g transform="translate(20,24)" fill="#A7F3D0">
                <rect x="0" y="0" width="100" height="6" rx="3" />
                <rect x="0" y="16" width="70" height="6" rx="3" />
                <rect x="0" y="32" width="84" height="6" rx="3" />
                <rect x="0" y="48" width="60" height="6" rx="3" />
              </g>
              <text x="70" y="88" textAnchor="middle" fontSize="14" fill="white" className="font-medium">
                OCR
              </text>
            </g>

            {/* Extract */}
            <g transform="translate(460,340)" filter={glow("extract") ? "url(#activeGlow)" : "url(#soft)"} id="node-extract">
              <title>Extract — entities & line items with confidence.</title>
              <rect
                width="140"
                height="110"
                rx="12"
                fill="#0B1220"
                className={`transition-all duration-700 ${
                  glow("extract") ? "stroke-emerald-400/80" : "stroke-white/12"
                }`}
                stroke="currentColor"
                strokeWidth="2"
              />
              {/* table-ish */}
              <g transform="translate(18,24)" stroke="#A7F3D0" strokeWidth="1.5" opacity="0.8">
                <rect x="0" y="0" width="104" height="62" rx="6" fill="none" />
                <path d="M0 26 H104" />
                <path d="M20 0 V62" />
                <path d="M52 0 V62" />
                <path d="M80 0 V62" />
              </g>
              <text x="70" y="88" textAnchor="middle" fontSize="14" fill="white" className="font-medium">
                Extract
              </text>
            </g>

            {/* Validate */}
            <g transform="translate(650,220)" filter={glow("validate") ? "url(#activeGlow)" : "url(#soft)"} id="node-validate">
              <title>Validate — rules + human-in-the-loop.</title>
              <rect
                width="160"
                height="120"
                rx="16"
                fill="#101635"
                className={`transition-all duration-700 ${
                  glow("validate") ? "stroke-emerald-400/80" : "stroke-white/12"
                }`}
                stroke="currentColor"
                strokeWidth="2"
              />
              <g transform="translate(56,32)">
                <rect width="48" height="48" rx="12" fill="#0B1220" stroke="#6EE7B7" strokeWidth="2" />
                <path d="M14 26 l6 6 14-14" stroke="#6EE7B7" strokeWidth="2.2" fill="none" />
              </g>
              <text x="80" y="104" textAnchor="middle" fontSize="14" fill="white" className="font-medium">
                Validate
              </text>
            </g>

            {/* Export */}
            <g transform="translate(830,220)" filter={glow("export") ? "url(#activeGlow)" : "url(#soft)"} id="node-export">
              <title>Export — ERP / Database.</title>
              <rect
                width="120"
                height="120"
                rx="12"
                fill="#052E2B"
                className={`transition-all duration-700 ${
                  glow("export") ? "stroke-emerald-400/80" : "stroke-emerald-400/30"
                }`}
                stroke="currentColor"
                strokeWidth="2"
              />
              {/* database icon */}
              <g transform="translate(35,30)" fill="#CFFAEA">
                <ellipse cx="25" cy="8" rx="25" ry="8" />
                <rect x="0" y="8" width="50" height="40" rx="4" />
                <ellipse cx="25" cy="48" rx="25" ry="8" />
                <path d="M0 16 H50" stroke="#CFFAEA" strokeWidth="1" />
                <path d="M0 24 H50" stroke="#CFFAEA" strokeWidth="1" />
                <path d="M0 32 H50" stroke="#CFFAEA" strokeWidth="1" />
                <path d="M0 40 H50" stroke="#CFFAEA" strokeWidth="1" />
              </g>
              <text x="60" y="104" textAnchor="middle" fontSize="14" fill="#CFFAEA" className="font-medium">
                ERP / DB
              </text>
            </g>

            {/* Background dashed guides - improved opacity */}
            <g strokeDasharray="6 6" stroke="#ffffff" opacity="0.3" fill="none" strokeWidth="2">
              <path d={P.sourcesToIngest} />
              <path d={P.ingestToOCR} />
              <path d={P.ocrToExtract} />
              <path d={P.extractToValidate} />
              <path d={P.validateToExport} />
            </g>
            {/* Correction loop (amber) - improved visibility */}
            <path d={P.validateToExtract} stroke="#fbbf24" strokeWidth="2.5" strokeDasharray="7 7" fill="none" opacity="0.8" />
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
          <span className="w-3 h-3 rounded-full bg-white shadow-[0_0_8px_#ffffff]"></span> Processing flow
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]"></span> Approved export
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-amber-400 shadow-[0_0_8px_#fbbf24]"></span> Correction loop
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
          { label: "Extraction accuracy", value: docMetrics[step].acc, suffix: "%", aria: "Estimated field extraction accuracy" },
          { label: "Auto-approval rate", value: docMetrics[step].auto, suffix: "%", aria: "Share of docs approved without review" },
          { label: "Median processing time", value: docMetrics[step].time, suffix: "s", aria: "Seconds per document" },
          { label: "Cost per document", value: docMetrics[step].cost, suffix: "€", aria: "Estimated cost per processed document" },
        ]}
      />

      <noscript>
        <p className="mt-3 text-xs text-gray-400">
          Animations disabled: Flow is Ingest → OCR → Extract → Validate → Export (with possible correction loop).
        </p>
      </noscript>
    </section>
  );
}
