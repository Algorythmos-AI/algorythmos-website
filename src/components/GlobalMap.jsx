/**
 * GlobalMap Component
 * 
 * Interactive world map showing Algorythmos offices in France and Australia.
 * Uses i18n for EN/FR localization.
 * Features recognizable continent silhouettes with high contrast styling.
 */
import React from "react";
import { motion } from "framer-motion";
import { useI18n } from "../app/i18n/I18nContext";

const GlobalMap = () => {
    const { t } = useI18n();

    const locations = [
        {
            id: "fr",
            titleKey: "contactPage.globalMap.france.title",
            roleKey: "contactPage.globalMap.france.role",
            top: "30%",
            left: "48%",
            isHQ: true,
        },
        {
            id: "au",
            titleKey: "contactPage.globalMap.australia.title",
            roleKey: "contactPage.globalMap.australia.role",
            top: "70%",
            left: "85%",
            isHQ: false,
        },
    ];

    return (
        <section className="relative w-full px-4 sm:px-6 lg:px-8 pt-16 pb-10 lg:pt-20 lg:pb-14">
            <div className="mx-auto max-w-6xl space-y-8">
                {/* Heading */}
                <div className="text-center space-y-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-300/80">
                        {t("contactPage.globalMap.badge")}
                    </p>
                    <h2 className="text-3xl sm:text-4xl font-semibold text-slate-50">
                        {t("contactPage.globalMap.heading")}
                    </h2>
                    <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-300/80">
                        {t("contactPage.globalMap.subheading")}
                    </p>
                </div>

                {/* Map card */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="relative z-[2] rounded-[2rem] bg-gradient-to-br from-violet-600/40 via-indigo-700/40 to-slate-900/60 p-[1.5px] shadow-[0_32px_90px_rgba(0,0,0,0.55)]"
                >
                    <div className="relative overflow-hidden rounded-[1.4rem] bg-[#0c0f1a] px-4 py-6 sm:px-8 sm:py-8">
                        {/* Subtle background glow - behind everything */}
                        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
                            <div className="absolute -left-20 top-20 h-60 w-60 rounded-full bg-violet-600/10 blur-[100px]" />
                            <div className="absolute right-10 bottom-10 h-60 w-60 rounded-full bg-blue-500/10 blur-[100px]" />
                        </div>

                        {/* World Map Container */}
                        <div className="mx-auto max-w-[1200px] w-full">
                            <div className="relative w-full aspect-[2/1] min-h-[280px] sm:min-h-[340px] lg:min-h-[400px] rounded-xl bg-[#0a0d14] overflow-hidden border border-slate-700/50">

                                {/* SVG World Map - Accurate continent shapes */}
                                <svg
                                    viewBox="0 0 100 50"
                                    className="absolute inset-0 h-full w-full"
                                    preserveAspectRatio="xMidYMid meet"
                                    aria-hidden="true"
                                >
                                    <defs>
                                        {/* Grid pattern */}
                                        <pattern
                                            id="map-grid"
                                            patternUnits="userSpaceOnUse"
                                            width="5"
                                            height="5"
                                        >
                                            <path
                                                d="M 5 0 L 0 0 0 5"
                                                fill="none"
                                                stroke="rgba(255,255,255,0.06)"
                                                strokeWidth="0.1"
                                            />
                                        </pattern>

                                        {/* Continent glow filter */}
                                        <filter id="coast-glow" x="-10%" y="-10%" width="120%" height="120%">
                                            <feDropShadow dx="0" dy="0" stdDeviation="0.5" floodOpacity="0.35" floodColor="#a78bfa" />
                                        </filter>
                                    </defs>

                                    {/* Grid background */}
                                    <rect width="100" height="50" fill="url(#map-grid)" />

                                    {/* WORLD MAP CONTINENTS - Accurate simplified outlines */}
                                    <g
                                        id="continents"
                                        fill="rgba(139, 92, 246, 0.70)"
                                        stroke="rgba(255,255,255,0.35)"
                                        strokeWidth="0.15"
                                        shapeRendering="geometricPrecision"
                                        filter="url(#coast-glow)"
                                    >
                                        {/* NORTH AMERICA - Recognizable shape with Alaska, Canada, USA, Mexico */}
                                        <path d="
                                            M8,8 L10,6 L14,5 L18,6 L22,8 L24,10
                                            L25,13 L24,16 L22,18 L20,19
                                            L19,21 L20,24 L18,26 L16,25
                                            L14,22 L12,18 L10,14 L8,11 Z
                                        "/>

                                        {/* GREENLAND */}
                                        <path d="
                                            M28,4 L32,3 L36,5 L37,8 L35,11 
                                            L31,12 L28,10 L27,6 Z
                                        "/>

                                        {/* CENTRAL AMERICA */}
                                        <path d="
                                            M16,26 L18,27 L20,30 L19,33 
                                            L17,32 L15,29 Z
                                        "/>

                                        {/* SOUTH AMERICA - Clear triangular shape */}
                                        <path d="
                                            M20,33 L24,32 L27,36 L28,42
                                            L26,48 L22,50 L18,47
                                            L17,40 L18,35 Z
                                        "/>

                                        {/* EUROPE - Clear with Mediterranean, Scandinavia */}
                                        <path d="
                                            M44,10 L48,8 L52,9 L55,11
                                            L56,14 L54,17 L51,18 L48,17
                                            L45,15 L43,12 Z
                                        "/>

                                        {/* UK & IRELAND */}
                                        <path d="
                                            M41,11 L43,10 L44,12 L43,14 
                                            L41,14 L40,12 Z
                                        "/>

                                        {/* SCANDINAVIA */}
                                        <path d="
                                            M48,5 L52,4 L55,6 L56,9 
                                            L54,10 L50,9 L48,7 Z
                                        "/>

                                        {/* AFRICA - Large distinctive shape */}
                                        <path d="
                                            M46,20 L52,19 L57,23 L60,28
                                            L59,35 L55,42 L50,45 L44,43
                                            L41,37 L42,30 L44,24 Z
                                        "/>

                                        {/* MIDDLE EAST */}
                                        <path d="
                                            M58,17 L63,16 L67,19 L68,23
                                            L65,26 L60,25 L57,22 L57,18 Z
                                        "/>

                                        {/* RUSSIA - Large spanning shape */}
                                        <path d="
                                            M56,5 L65,3 L78,4 L88,7
                                            L92,10 L90,14 L82,16 L72,15
                                            L62,13 L56,10 L55,7 Z
                                        "/>

                                        {/* INDIA - Triangle peninsula */}
                                        <path d="
                                            M68,22 L73,21 L76,25 L75,32
                                            L71,36 L67,33 L66,27 Z
                                        "/>

                                        {/* CHINA / EAST ASIA */}
                                        <path d="
                                            M76,14 L84,12 L90,16 L89,22
                                            L84,26 L78,24 L75,20 L75,16 Z
                                        "/>

                                        {/* JAPAN */}
                                        <path d="
                                            M91,14 L93,13 L94,17 L93,21 
                                            L91,20 L90,16 Z
                                        "/>

                                        {/* SOUTHEAST ASIA */}
                                        <path d="
                                            M78,28 L84,27 L88,31 L87,36
                                            L82,38 L77,35 L76,31 Z
                                        "/>

                                        {/* INDONESIA */}
                                        <path d="
                                            M80,39 L88,38 L94,42 L92,45
                                            L85,46 L79,43 Z
                                        "/>

                                        {/* AUSTRALIA - Iconic recognizable shape */}
                                        <path d="
                                            M82,40 L88,38 L94,42 L96,48
                                            L92,52 L85,53 L80,50 L79,45 Z
                                        "/>

                                        {/* NEW ZEALAND */}
                                        <path d="
                                            M97,48 L98,47 L99,50 L98,53 
                                            L96,52 L96,49 Z
                                        "/>
                                    </g>

                                    {/* Connection arc - High visibility, above continents */}
                                    <path
                                        d="M48,14 Q58,8 72,20 Q84,32 88,44"
                                        stroke="rgba(255,255,255,0.9)"
                                        strokeWidth="0.3"
                                        strokeDasharray="1 0.8"
                                        strokeLinecap="round"
                                        fill="none"
                                    />

                                    {/* France marker glow */}
                                    <circle cx="48" cy="14" r="2" fill="rgba(244,114,182,0.5)" />

                                    {/* Australia marker glow */}
                                    <circle cx="88" cy="46" r="1.8" fill="rgba(56,189,248,0.5)" />
                                </svg>

                                {/* Interactive location markers */}
                                {locations.map((loc) => (
                                    <motion.button
                                        key={loc.id}
                                        initial={{ opacity: 0, scale: 0.5 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true, amount: 0.4 }}
                                        transition={{ duration: 0.4, delay: loc.id === "fr" ? 0.1 : 0.25 }}
                                        className="group absolute z-[5] flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2 outline-none"
                                        style={{ top: loc.top, left: loc.left }}
                                        type="button"
                                        aria-label={t(loc.titleKey)}
                                    >
                                        {/* Pulsing marker */}
                                        <span className="relative flex h-10 w-10 items-center justify-center">
                                            <span className={`absolute inline-flex h-7 w-7 animate-ping rounded-full ${loc.isHQ ? "bg-pink-400/70" : "bg-sky-400/70"
                                                }`} />
                                            <span
                                                className={`relative inline-flex h-5 w-5 rounded-full ring-2 ring-white/90 shadow-lg ${loc.isHQ
                                                    ? "bg-pink-400 shadow-pink-500/70"
                                                    : "bg-sky-400 shadow-sky-500/70"
                                                    }`}
                                            />
                                        </span>

                                        {/* Tooltip card */}
                                        <div className="pointer-events-none w-max max-w-xs rounded-xl border border-slate-600/70 bg-slate-900/95 px-4 py-2.5 text-left text-sm text-slate-100 shadow-2xl opacity-0 backdrop-blur-sm group-hover:opacity-100 transition-opacity duration-200">
                                            <p className="font-semibold">
                                                {t(loc.titleKey)}
                                                {loc.isHQ && (
                                                    <span className="ml-2 inline-flex rounded-full bg-pink-500/30 px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wide text-pink-200">
                                                        HQ
                                                    </span>
                                                )}
                                            </p>
                                            <p className="mt-1 text-xs text-slate-300/90">
                                                {t(loc.roleKey)}
                                            </p>
                                        </div>
                                    </motion.button>
                                ))}
                            </div>
                        </div>

                        {/* Legend */}
                        <div className="mt-5 flex flex-wrap items-center justify-between gap-4 text-xs sm:text-sm text-slate-300/85">
                            <div className="flex flex-wrap items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <span className="inline-flex h-3.5 w-3.5 rounded-full bg-pink-400 ring-2 ring-white/70" />
                                    <span>{t("contactPage.globalMap.legend.hq")}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="inline-flex h-3.5 w-3.5 rounded-full bg-sky-400 ring-2 ring-white/70" />
                                    <span>{t("contactPage.globalMap.legend.regional")}</span>
                                </div>
                            </div>
                            <p className="text-[0.7rem] sm:text-xs text-slate-400/80">
                                {t("contactPage.globalMap.legend.coverage")}
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Location cards */}
                <div className="mt-10 grid gap-6 sm:grid-cols-2">
                    <div className="mx-auto max-w-xl sm:max-w-none rounded-2xl border border-slate-700/70 bg-slate-950/70 p-4 sm:p-5">
                        <p className="text-xs uppercase tracking-[0.18em] text-violet-300/80">
                            {t("contactPage.globalMap.locations.france.country")}
                        </p>
                        <h3 className="mt-1 text-lg font-semibold text-slate-50">
                            {t("contactPage.globalMap.locations.france.title")}
                        </h3>
                        <p className="mt-2 text-sm text-slate-300/85">
                            {t("contactPage.globalMap.locations.france.description")}
                        </p>
                    </div>

                    <div className="mx-auto max-w-xl sm:max-w-none rounded-2xl border border-slate-700/70 bg-slate-950/70 p-4 sm:p-5">
                        <p className="text-xs uppercase tracking-[0.18em] text-blue-300/80">
                            {t("contactPage.globalMap.locations.australia.country")}
                        </p>
                        <h3 className="mt-1 text-lg font-semibold text-slate-50">
                            {t("contactPage.globalMap.locations.australia.title")}
                        </h3>
                        <p className="mt-2 text-sm text-slate-300/85">
                            {t("contactPage.globalMap.locations.australia.description")}
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default GlobalMap;
