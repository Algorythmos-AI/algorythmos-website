import React, { useEffect, useMemo, useState, useCallback } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useSearchParams } from "react-router-dom";
// Optional analytics (safe if missing)
let track = () => {};
try {
  // eslint-disable-next-line import/no-unresolved
  track = require("../../../lib/analytics").track || (() => {});
} catch {}

/**
 * DocIntelFlowPlayer
 * Step-by-step pipeline demo:
 * 1) Ingest → 2) OCR → 3) Extract → 4) Validate (with correction loop) → 5) Export (ERP/DB)
 *
 * Uses CSS offset-path for the animated "packet" dots.
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

  useEffect(() => {
    params.set("step", String(step));
    params.set("speed", String(speed));
    params.set("autoplay", playing ? "1" : "0");
    setParams(params, { replace: true });
  }, [step, speed, playing]); // eslint-disable-line

  // Node geometry (viewBox 920x520)
  const P = useMemo(
    () => ({
      // (x,y) notes in analysis: boxes are placed left→right
      sourcesToIngest: "M 200 275 H 260",
      ingestToOCR: "M 400 275 V 155",
      ocrToExtract: "M 530 210 V 340",
      extractToValidate: "M 600 395 C 630 395, 620 280, 650 280",
      validateToExport: "M 810 280 H 830",
      // correction loop (validate back to extract)
      validateToExtract: "M 650 280 C 620 280, 620 395, 600 395",
    }),
    []
  );

  // Timeline
  const timeline = useMemo(
    () => [
      {
        id: "ingest",
        title: "1) Ingest",
        caption:
          "Documents arrive from inbox, uploads, S3, or APIs. We normalize filenames/metadata and queue them.",
        packets: [{ path: P.sourcesToIngest, color: "#ffffff" }],
        glow: ["sources", "ingest"],
        duration: 1.2,
      },
      {
        id: "ocr",
        title: "2) OCR",
        caption:
          "High-quality OCR renders text and layout structure (tables, boxes) for downstream extraction.",
        packets: [{ path: P.ingestToOCR, color: "#ffffff" }],
        glow: ["ingest", "ocr"],
        duration: 1.2,
      },
      {
        id: "extract",
        title: "3) Extract",
        caption:
          "Domain-tuned NLP parses entities (amounts, vendors, dates, line items) with confidence scores.",
        packets: [{ path: P.ocrToExtract, color: "#ffffff" }],
        glow: ["extract"],
        duration: 1.2,
      },
      {
        id: "validate",
        title: "4) Validate",
        caption:
          "Rules + human-in-the-loop verify edge cases. If a check fails, we loop back to correct.",
        packets: [
          { path: P.extractToValidate, color: "#ffffff" },
          // small correction loop (amber), delayed
          { path: P.validateToExtract, color: "#fbbf24", delay: 0.7 },
        ],
        glow: ["validate", "extract"],
        duration: 1.9,
      },
      {
        id: "export",
        title: "5) Export",
        caption:
          "Approved records are exported to ERP/DB with full audit trail and schema validation.",
        packets: [{ path: P.validateToExport, color: "#34d399" }],
        glow: ["validate", "export"],
        duration: 1.4,
      },
    ],
    [P]
  );

  // Auto-advance
  useEffect(() => {
    if (reduce || !playing) return;
    const d = timeline[step]?.duration ?? 1.2;
    const t = setTimeout(() => {
      setStep((s) => (s + 1) % timeline.length);
      setKey((k) => k + 1);
    }, (d * 1000) / speed + 100);
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
      if (e.key === "ArrowLeft") {
        setStep((s) => (s - 1 + timeline.length) % timeline.length);
        setKey((k) => k + 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, timeline.length]);

  // Packet dot
  const Packet = ({ path, color = "#fff", delay = 0, duration = 1 }) => {
    if (reduce) return null;
    return (
      <motion.div
        key={`${key}-${path}-${delay}`}
        initial={{ offsetDistance: "0%" }}
        animate={{ offsetDistance: ["0%", "100%"] }}
        transition={{ duration: duration / speed, ease: "linear", delay }}
        style={{
          offsetPath: `path('${path}')`,
          width: 10,
          height: 10,
          borderRadius: 9999,
          background: color,
          boxShadow: `0 0 10px ${color}, 0 0 18px ${color}66`,
          position: "absolute",
          top: 0,
          left: 0,
        }}
      />
    );
  };

  const glow = (id) => current?.glow?.includes(id);

  return (
    <section className="mt-10">
      {/* Controls */}
      <div className="flex items-center gap-2 justify-between mb-2">
        <div className="flex items-center gap-2 overflow-x-auto">
          {timeline.map((t, i) => (
            <button
              key={t.id}
              onClick={() => {
                setStep(i);
                setKey((k) => k + 1);
              }}
              className={`text-xs px-2 py-1 rounded-full border ${
                i === step
                  ? "border-emerald-400/70 text-white"
                  : "border-white/15 text-gray-300 hover:border-white/30"
              }`}
              title={t.title}
            >
              {i + 1}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setPlaying((p) => !p);
              try {
                track("flow_play_toggle", { flow: "docintel" });
              } catch {}
            }}
            className="text-xs px-3 py-1 rounded-full border border-white/15 hover:border-white/30 text-gray-200"
            aria-pressed={playing}
          >
            {playing ? "Pause" : "Play"}
          </button>
          <button
            onClick={next}
            className="text-xs px-3 py-1 rounded-full border border-white/15 hover:border-white/30 text-gray-200"
          >
            Step
          </button>
          <button
            onClick={restart}
            className="text-xs px-3 py-1 rounded-full border border-white/15 hover:border-white/30 text-gray-200"
          >
            Restart
          </button>
          <button
            onClick={share}
            className="text-xs px-3 py-1 rounded-full border border-white/15 hover:border-white/30 text-gray-200"
            title="Copy link to this step"
          >
            Copy link
          </button>
          <label className="text-xs text-gray-400 ml-2">
            Speed
            <select
              className="ml-1 bg-black/40 border border-white/10 rounded-md text-gray-200 text-xs px-1 py-0.5"
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
          </label>
        </div>
      </div>

      {/* Canvas */}
      <div className="relative rounded-3xl border border-white/10 bg-gradient-to-br from-slate-950 to-indigo-950 shadow-2xl overflow-hidden">
        {/* Chrome */}
        <div className="h-8 rounded-t-3xl border-b border-white/10 px-3 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-400/80" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-300/80" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
        </div>

        <div className="p-4 md:p-6">
          <svg viewBox="0 0 920 520" className="w-full h-auto" aria-hidden="true">
            <defs>
              <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="6" stdDeviation="10" floodColor="#000" floodOpacity="0.35" />
              </filter>
            </defs>

            {/* Sources */}
            <g transform="translate(60,220)" filter="url(#soft)" id="node-sources">
              <title>Sources — inbox, uploads, S3, APIs.</title>
              <rect
                width="140"
                height="110"
                rx="16"
                fill="#0B1220"
                className={`transition-colors duration-300 ${
                  glow("sources") ? "stroke-emerald-400/70" : "stroke-white/10"
                }`}
                stroke="currentColor"
              />
              {/* tray icon */}
              <g transform="translate(20,22)">
                <rect x="0" y="20" width="48" height="16" rx="4" fill="#A7F3D0" />
                <path d="M0 20 L12 8 H36 L48 20" fill="#A7F3D0" />
              </g>
              <text x="70" y="88" textAnchor="middle" fontSize="14" fill="white">
                Sources
              </text>
            </g>

            {/* Ingest */}
            <g transform="translate(260,220)" filter="url(#soft)" id="node-ingest">
              <title>Ingest — normalize, queue, classify.</title>
              <rect
                width="140"
                height="110"
                rx="16"
                fill="#101635"
                className={`transition-colors duration-300 ${
                  glow("ingest") ? "stroke-emerald-400/70" : "stroke-white/12"
                }`}
                stroke="currentColor"
              />
              <text x="70" y="64" textAnchor="middle" fontSize="15" fill="white">
                Ingest
              </text>
            </g>

            {/* OCR */}
            <g transform="translate(460,100)" filter="url(#soft)" id="node-ocr">
              <title>OCR — text + layout extraction.</title>
              <rect
                width="140"
                height="110"
                rx="12"
                fill="#0B1220"
                className={`transition-colors duration-300 ${glow("ocr") ? "stroke-emerald-400/70" : "stroke-white/12"}`}
                stroke="currentColor"
              />
              {/* small lines */}
              <g transform="translate(20,24)" fill="#A7F3D0">
                <rect x="0" y="0" width="100" height="6" rx="3" />
                <rect x="0" y="16" width="70" height="6" rx="3" />
                <rect x="0" y="32" width="84" height="6" rx="3" />
              </g>
              <text x="70" y="92" textAnchor="middle" fontSize="15" fill="white">
                OCR
              </text>
            </g>

            {/* Extract */}
            <g transform="translate(460,340)" filter="url(#soft)" id="node-extract">
              <title>Extract — entities & line items with confidence.</title>
              <rect
                width="140"
                height="110"
                rx="12"
                fill="#0B1220"
                className={`transition-colors duration-300 ${
                  glow("extract") ? "stroke-emerald-400/70" : "stroke-white/12"
                }`}
                stroke="currentColor"
              />
              {/* table-ish */}
              <g transform="translate(18,24)" stroke="#A7F3D0" strokeWidth="1.5" opacity="0.8">
                <rect x="0" y="0" width="104" height="62" rx="6" fill="none" />
                <path d="M0 26 H104" />
                <path d="M20 0 V62" />
                <path d="M52 0 V62" />
                <path d="M80 0 V62" />
              </g>
              <text x="70" y="92" textAnchor="middle" fontSize="15" fill="white">
                Extract
              </text>
            </g>

            {/* Validate */}
            <g transform="translate(650,220)" filter="url(#soft)" id="node-validate">
              <title>Validate — rules + human-in-the-loop.</title>
              <rect
                width="160"
                height="120"
                rx="16"
                fill="#101635"
                className={`transition-colors duration-300 ${
                  glow("validate") ? "stroke-emerald-400/70" : "stroke-white/12"
                }`}
                stroke="currentColor"
              />
              <g transform="translate(56,32)">
                <rect width="48" height="48" rx="12" fill="#0B1220" stroke="#6EE7B7" strokeWidth="2" />
                <path d="M14 26 l6 6 14-14" stroke="#6EE7B7" strokeWidth="2.2" fill="none" />
              </g>
              <text x="80" y="104" textAnchor="middle" fontSize="15" fill="white">
                Validate
              </text>
            </g>

            {/* Export */}
            <g transform="translate(830,220)" filter="url(#soft)" id="node-export">
              <title>Export — ERP / Database.</title>
              <rect
                width="120"
                height="120"
                rx="12"
                fill="#052E2B"
                className={`transition-colors duration-300 ${
                  glow("export") ? "stroke-emerald-400/70" : "stroke-emerald-400/30"
                }`}
                stroke="currentColor"
              />
              <text x="60" y="68" textAnchor="middle" fontSize="14" fill="#CFFAEA">
                ERP / DB
              </text>
            </g>

            {/* Background dashed guides */}
            <g strokeDasharray="6 6" stroke="#ffffff" opacity="0.55" fill="none" strokeWidth="2">
              <path d={P.sourcesToIngest} />
              <path d={P.ingestToOCR} />
              <path d={P.ocrToExtract} />
              <path d={P.extractToValidate} />
              <path d={P.validateToExport} />
            </g>
            {/* Correction loop (amber) */}
            <path d={P.validateToExtract} stroke="#fbbf24" strokeWidth="2.5" strokeDasharray="7 7" fill="none" opacity="0.9" />
          </svg>

          {/* Packets overlay */}
          <div className="pointer-events-none absolute inset-0">
            {current?.packets?.map((pkt, i) => (
              <motion.div
                key={`${current.id}-${i}-${key}`}
                initial={{ offsetDistance: "0%" }}
                animate={{ offsetDistance: ["0%", "100%"] }}
                transition={{ duration: current.duration / speed, ease: "linear", delay: pkt.delay || 0 }}
                style={{
                  offsetPath: `path('${pkt.path}')`,
                  width: 10,
                  height: 10,
                  borderRadius: 9999,
                  background: pkt.color,
                  boxShadow: `0 0 10px ${pkt.color}, 0 0 18px ${pkt.color}66`,
                  position: "absolute",
                  top: 0,
                  left: 0,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-3 flex flex-wrap gap-4 text-xs text-gray-300">
        <span className="inline-flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_6px_#ffffff]"></span> Processing flow
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]"></span> Approved export
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_6px_#fbbf24]"></span> Correction loop
        </span>
      </div>

      {/* Caption */}
      <div className="mt-3 rounded-xl border border-white/10 bg-white/5 p-3">
        <p className="text-sm font-semibold">{current.title}</p>
        <p className="text-sm text-gray-300" aria-live="polite">
          {current.caption}
        </p>
      </div>

      <noscript>
        <p className="mt-3 text-xs text-gray-400">
          Animations disabled: Flow is Ingest → OCR → Extract → Validate → Export (with possible correction loop).
        </p>
      </noscript>
    </section>
  );
}
