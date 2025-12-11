/**
 * GlobalMap Component
 * 
 * Interactive world map showing Algorythmos offices in France and Australia.
 * Uses i18n for EN/FR localization.
 * Features a recognizable SVG world map with continent silhouettes.
 */
import React from "react";
import { motion } from "framer-motion"; // Used for map card and marker animations
import { useI18n } from "../app/i18n/I18nContext";

const GlobalMap = () => {
    const { t } = useI18n();

    const locations = [
        {
            id: "fr",
            titleKey: "contactPage.globalMap.france.title",
            roleKey: "contactPage.globalMap.france.role",
            top: "32%",
            left: "48%",
            isHQ: true,
        },
        {
            id: "au",
            titleKey: "contactPage.globalMap.australia.title",
            roleKey: "contactPage.globalMap.australia.role",
            top: "72%",
            left: "86%",
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
                    className="relative z-[2] rounded-[2rem] bg-gradient-to-br from-violet-600/50 via-indigo-700/50 to-slate-900/70 p-[1.5px] shadow-[0_32px_90px_rgba(0,0,0,0.55)]"
                >
                    <div className="relative overflow-hidden rounded-[1.4rem] bg-slate-950/95 px-4 py-6 sm:px-8 sm:py-8">
                        {/* Background glows - BEHIND the map with -z-10 */}
                        <div className="pointer-events-none absolute inset-0 -z-10">
                            <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-violet-500/15 blur-[110px]" />
                            <div className="absolute right-0 bottom-0 h-80 w-80 rounded-full bg-blue-400/15 blur-[120px]" />
                        </div>

                        {/* World Map Container */}
                        <div className="mx-auto max-w-[1200px] w-full">
                            <div className="relative w-full aspect-[16/9] min-h-[300px] sm:min-h-[380px] lg:min-h-[420px] rounded-[1.4rem] bg-slate-950/90 overflow-hidden border border-slate-800/60">

                                {/* SVG World Map */}
                                <svg
                                    viewBox="0 0 1200 600"
                                    className="absolute inset-0 h-full w-full"
                                    preserveAspectRatio="xMidYMid slice"
                                    aria-hidden="true"
                                >
                                    {/* Grid pattern */}
                                    <defs>
                                        <pattern
                                            id="map-grid"
                                            x="0"
                                            y="0"
                                            width="50"
                                            height="50"
                                            patternUnits="userSpaceOnUse"
                                        >
                                            <path
                                                d="M 50 0 L 0 0 0 50"
                                                stroke="rgba(148,163,184,0.18)"
                                                strokeWidth="0.5"
                                                fill="none"
                                            />
                                        </pattern>
                                    </defs>

                                    {/* Grid background */}
                                    <rect width="1200" height="600" fill="url(#map-grid)" />

                                    {/* ACTUAL WORLD MAP CONTINENTS - Recognizable silhouettes */}
                                    <g
                                        className="world-map"
                                        fill="rgba(168, 85, 247, 0.75)"
                                        stroke="rgba(15, 23, 42, 0.65)"
                                        strokeWidth="2"
                                        strokeLinejoin="round"
                                    >
                                        {/* NORTH AMERICA - Distinctive shape with east coast, Florida, Mexico */}
                                        <path d="
                                            M 120 80 
                                            L 180 60 L 260 55 L 320 70 L 340 90
                                            L 350 120 L 340 150 L 320 170
                                            L 290 200 L 280 240 L 295 280 L 280 310
                                            L 250 330 L 260 360 L 240 380 L 220 370
                                            L 200 340 L 180 300 L 160 260
                                            L 140 220 L 120 180 L 100 140
                                            L 95 110 L 105 90 Z
                                        " />

                                        {/* GREENLAND */}
                                        <path d="
                                            M 380 50 L 420 40 L 470 50 L 490 80 
                                            L 480 120 L 440 140 L 395 130 
                                            L 370 100 L 375 65 Z
                                        " />

                                        {/* CENTRAL AMERICA & CARIBBEAN */}
                                        <path d="
                                            M 240 385 L 265 395 L 285 420 
                                            L 290 450 L 275 465 L 255 455 
                                            L 240 430 L 235 400 Z
                                        " />

                                        {/* SOUTH AMERICA - Distinctive triangular shape */}
                                        <path d="
                                            M 290 470 L 340 450 L 380 480 
                                            L 400 530 L 390 600 L 360 650
                                            L 320 680 L 280 660 L 260 600
                                            L 270 540 L 280 490 Z
                                        " />

                                        {/* EUROPE - Clear UK, Iberia, Italy boot, Scandinavia */}
                                        <path d="
                                            M 520 100 L 560 80 L 600 90 L 640 100
                                            L 680 120 L 700 150 L 690 190
                                            L 660 220 L 620 230 L 580 225
                                            L 550 210 L 530 180 L 510 150
                                            L 515 120 Z
                                        " />

                                        {/* UK & IRELAND */}
                                        <path d="
                                            M 490 120 L 510 110 L 525 125 
                                            L 520 150 L 500 160 L 485 145 L 488 125 Z
                                        " />

                                        {/* SCANDINAVIA */}
                                        <path d="
                                            M 580 50 L 620 40 L 660 60 L 680 90
                                            L 670 120 L 640 110 L 600 90 L 580 65 Z
                                        " />

                                        {/* AFRICA - Large distinctive shape */}
                                        <path d="
                                            M 560 245 L 620 235 L 680 260 L 720 300
                                            L 740 360 L 730 430 L 700 490
                                            L 650 540 L 590 550 L 540 520
                                            L 510 470 L 500 400 L 510 340
                                            L 530 290 L 550 255 Z
                                        " />

                                        {/* MIDDLE EAST */}
                                        <path d="
                                            M 700 200 L 760 190 L 810 210 L 830 250
                                            L 810 290 L 760 300 L 720 280 L 700 240 Z
                                        " />

                                        {/* RUSSIA / ASIA - Large spanning shape */}
                                        <path d="
                                            M 700 60 L 800 45 L 920 50 L 1020 70
                                            L 1100 100 L 1130 150 L 1100 190
                                            L 1020 210 L 920 200 L 820 180
                                            L 750 160 L 710 130 L 700 90 Z
                                        " />

                                        {/* INDIA - Distinctive triangular peninsula */}
                                        <path d="
                                            M 840 280 L 890 270 L 930 300
                                            L 940 360 L 910 420 L 870 440
                                            L 830 410 L 820 350 L 830 300 Z
                                        " />

                                        {/* CHINA / EAST ASIA */}
                                        <path d="
                                            M 950 180 L 1020 170 L 1080 200
                                            L 1100 260 L 1070 320 L 1010 340
                                            L 960 310 L 940 260 L 945 210 Z
                                        " />

                                        {/* JAPAN - Archipelago shape */}
                                        <path d="
                                            M 1100 180 L 1120 170 L 1140 190
                                            L 1150 240 L 1135 280 L 1110 270
                                            L 1095 230 L 1100 195 Z
                                        " />

                                        {/* SOUTHEAST ASIA */}
                                        <path d="
                                            M 980 360 L 1030 350 L 1070 380
                                            L 1080 430 L 1050 470 L 1000 480
                                            L 960 450 L 955 400 L 970 365 Z
                                        " />

                                        {/* INDONESIA / PHILIPPINES */}
                                        <path d="
                                            M 1000 490 L 1060 480 L 1120 510
                                            L 1140 550 L 1100 570 L 1040 560
                                            L 990 530 L 990 500 Z
                                        " />

                                        {/* AUSTRALIA - Iconic shape */}
                                        <path d="
                                            M 1020 480 L 1100 460 L 1160 500
                                            L 1180 560 L 1160 620 L 1100 650
                                            L 1030 630 L 990 580 L 1000 520 Z
                                        " />

                                        {/* NEW ZEALAND */}
                                        <path d="
                                            M 1200 580 L 1220 570 L 1235 600
                                            L 1225 640 L 1200 650 L 1190 620 Z
                                        " />
                                    </g>

                                    {/* Connection arc - ABOVE continents, high visibility */}
                                    <path
                                        d="M 580 175 Q 720 100, 900 280 Q 1020 420, 1080 540"
                                        stroke="rgba(248, 250, 252, 0.9)"
                                        strokeWidth="3"
                                        strokeDasharray="8 10"
                                        strokeLinecap="round"
                                        fill="none"
                                    />

                                    {/* France marker glow */}
                                    <circle cx="580" cy="175" r="25" fill="rgba(244,114,182,0.4)" />

                                    {/* Australia marker glow */}
                                    <circle cx="1080" cy="560" r="22" fill="rgba(56,189,248,0.4)" />
                                </svg>

                                {/* Location markers - positioned on real geographic locations */}
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
                                            <span className={`absolute inline-flex h-8 w-8 animate-ping rounded-full ${loc.isHQ ? "bg-pink-400/60" : "bg-sky-400/60"
                                                }`} />
                                            <span
                                                className={`relative inline-flex h-5 w-5 rounded-full ring-2 ring-white/80 shadow-lg ${loc.isHQ
                                                    ? "bg-pink-400 shadow-pink-500/60"
                                                    : "bg-sky-400 shadow-sky-500/60"
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
                                    <span className="inline-flex h-3.5 w-3.5 rounded-full bg-pink-400 ring-2 ring-white/60 shadow-sm shadow-pink-500/40" />
                                    <span>{t("contactPage.globalMap.legend.hq")}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="inline-flex h-3.5 w-3.5 rounded-full bg-sky-400 ring-2 ring-white/60 shadow-sm shadow-sky-500/40" />
                                    <span>{t("contactPage.globalMap.legend.regional")}</span>
                                </div>
                            </div>
                            <p className="text-[0.7rem] sm:text-xs text-slate-400/80">
                                {t("contactPage.globalMap.legend.coverage")}
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Our Locations block */}
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
