/**
 * GlobalMap Component
 * 
 * Interactive world map showing Algorythmos offices in France and Australia.
 * Uses i18n for EN/FR localization.
 * Features a real SVG world map with continent outlines.
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
            top: "33%",
            left: "47%",
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
                    className="relative z-[2] rounded-[2rem] bg-gradient-to-br from-violet-600/60 via-indigo-700/60 to-slate-900/80 p-[1.5px] shadow-[0_32px_90px_rgba(0,0,0,0.55)]"
                >
                    <div className="relative overflow-hidden rounded-[1.4rem] bg-slate-950/80 px-4 py-6 sm:px-8 sm:py-8">
                        {/* Glows */}
                        <div className="pointer-events-none absolute inset-0">
                            <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-violet-500/20 blur-[110px]" />
                            <div className="absolute right-0 bottom-0 h-80 w-80 rounded-full bg-blue-400/20 blur-[120px]" />
                        </div>

                        {/* Real World Map Area */}
                        <div className="mx-auto max-w-[1200px] w-full">
                            <div className="relative w-full aspect-[16/9] min-h-[300px] sm:min-h-[380px] lg:min-h-[420px] rounded-[1.25rem] bg-gradient-to-br from-slate-900/90 via-slate-900/70 to-slate-900/95 border border-slate-700/60 overflow-hidden">

                                {/* SVG World Map */}
                                <svg
                                    viewBox="0 0 1000 500"
                                    className="absolute inset-0 h-full w-full"
                                    preserveAspectRatio="xMidYMid slice"
                                    aria-hidden="true"
                                >
                                    <defs>
                                        {/* Grid pattern */}
                                        <pattern
                                            id="global-map-grid"
                                            x="0"
                                            y="0"
                                            width="40"
                                            height="40"
                                            patternUnits="userSpaceOnUse"
                                        >
                                            <path
                                                d="M 40 0 L 0 0 0 40"
                                                stroke="rgba(100,116,139,0.2)"
                                                strokeWidth="0.5"
                                                fill="none"
                                            />
                                        </pattern>

                                        {/* Center glow gradient */}
                                        <radialGradient id="global-map-glow" cx="50%" cy="50%" r="70%">
                                            <stop offset="0%" stopColor="#6366F1" stopOpacity="0.08" />
                                            <stop offset="100%" stopColor="#0F172A" stopOpacity="0" />
                                        </radialGradient>
                                    </defs>

                                    {/* Grid background */}
                                    <rect width="1000" height="500" fill="url(#global-map-grid)" />
                                    <rect width="1000" height="500" fill="url(#global-map-glow)" />

                                    {/* World Map Continents - HIGH VISIBILITY VERSION */}
                                    <g
                                        fill="rgba(139,92,246,0.55)"
                                        stroke="rgba(255,255,255,0.3)"
                                        strokeWidth="1.5"
                                        strokeLinejoin="round"
                                    >
                                        {/* North America - Large prominent shape */}
                                        <path d="M 60 60 Q 85 50, 130 55 L 175 65 Q 210 75, 235 95 L 255 120 Q 270 145, 265 175 L 245 205 Q 220 235, 185 250 L 145 260 Q 110 265, 85 245 L 60 215 Q 45 185, 42 150 L 45 110 Q 48 80, 60 60 Z" />

                                        {/* Central America */}
                                        <path d="M 180 255 Q 195 260, 210 275 L 225 300 Q 232 315, 225 330 L 210 340 Q 195 345, 185 330 L 178 305 Q 175 280, 180 255 Z" />

                                        {/* South America - Distinctive shape */}
                                        <path d="M 225 340 Q 250 335, 280 350 L 310 385 Q 325 420, 318 465 L 295 505 Q 270 535, 240 545 L 210 538 Q 185 520, 178 480 L 185 430 Q 195 380, 210 350 Q 218 342, 225 340 Z" />

                                        {/* Greenland */}
                                        <path d="M 310 35 Q 340 28, 375 40 L 400 60 Q 410 82, 395 100 L 360 108 Q 325 105, 305 85 L 298 55 Q 300 40, 310 35 Z" />

                                        {/* Iceland */}
                                        <path d="M 400 65 Q 415 58, 428 68 L 432 82 Q 428 92, 415 95 L 402 88 Q 395 78, 400 65 Z" />

                                        {/* UK & Ireland */}
                                        <path d="M 430 100 Q 448 92, 460 108 L 458 130 Q 450 142, 435 140 L 425 125 Q 422 110, 430 100 Z" />

                                        {/* Europe - Clear distinct shape */}
                                        <path d="M 460 85 Q 490 72, 530 80 L 575 95 Q 600 110, 608 135 L 600 165 Q 585 185, 555 195 L 510 202 Q 475 205, 455 185 L 440 155 Q 435 120, 460 85 Z" />

                                        {/* Scandinavia */}
                                        <path d="M 510 40 Q 535 32, 565 48 L 585 75 Q 595 95, 580 115 L 555 108 Q 525 95, 515 72 L 510 40 Z" />

                                        {/* Africa - Large prominent shape */}
                                        <path d="M 480 210 Q 520 200, 565 218 L 608 255 Q 635 300, 628 360 L 605 425 Q 575 475, 535 498 L 490 510 Q 450 502, 430 465 L 422 405 Q 430 340, 455 280 L 475 235 Q 478 218, 480 210 Z" />

                                        {/* Middle East */}
                                        <path d="M 595 175 Q 630 168, 668 182 L 695 210 Q 705 238, 690 260 L 655 268 Q 618 265, 600 240 L 590 205 Q 592 182, 595 175 Z" />

                                        {/* Russia & Central Asia - Large sprawling shape */}
                                        <path d="M 575 35 Q 660 22, 770 30 L 880 50 Q 940 65, 965 92 L 950 128 Q 920 155, 870 168 L 775 175 Q 700 172, 625 155 L 565 135 Q 545 115, 550 88 L 575 35 Z" />

                                        {/* South Asia (India subcontinent) */}
                                        <path d="M 685 215 Q 725 208, 765 228 L 790 268 Q 805 315, 785 365 L 750 392 Q 710 400, 685 370 L 670 320 Q 665 265, 685 215 Z" />

                                        {/* Southeast Asia */}
                                        <path d="M 805 245 Q 845 238, 885 258 L 915 295 Q 930 335, 910 375 L 865 398 Q 825 405, 800 372 L 790 325 Q 795 280, 805 245 Z" />

                                        {/* East Asia (China, Korea) */}
                                        <path d="M 820 115 Q 870 102, 930 118 L 975 158 Q 998 195, 985 235 L 945 262 Q 895 275, 845 250 L 815 210 Q 798 160, 820 115 Z" />

                                        {/* Japan */}
                                        <path d="M 945 125 Q 968 118, 982 140 L 988 178 Q 985 202, 968 210 L 952 198 Q 940 172, 945 125 Z" />

                                        {/* Indonesia & Malaysia */}
                                        <path d="M 855 385 Q 895 378, 940 398 L 978 425 Q 992 452, 972 478 L 928 492 Q 882 488, 855 458 L 845 425 Q 848 398, 855 385 Z" />

                                        {/* Australia - Prominent and correctly positioned */}
                                        <path d="M 850 420 Q 900 408, 960 428 L 1010 468 Q 1035 510, 1020 560 L 980 592 Q 925 605, 865 588 L 825 545 Q 805 498, 820 455 Q 832 432, 850 420 Z" />

                                        {/* New Zealand */}
                                        <path d="M 1015 545 Q 1030 538, 1042 555 L 1048 582 Q 1045 598, 1030 602 L 1015 592 Q 1008 572, 1015 545 Z" />
                                    </g>

                                    {/* France marker glow - subtle halo */}
                                    <circle cx="475" cy="130" r="35" fill="rgba(244,114,182,0.25)" />

                                    {/* Australia marker glow - subtle halo */}
                                    <circle cx="920" cy="490" r="30" fill="rgba(56,189,248,0.25)" />

                                    {/* Dashed great-circle arc from France to Australia */}
                                    <path
                                        d="M 475 140 Q 600 90, 750 220 Q 850 350, 915 480"
                                        stroke="rgba(255,255,255,0.6)"
                                        strokeWidth="2.5"
                                        strokeDasharray="10 8"
                                        strokeLinecap="round"
                                        fill="none"
                                    />
                                </svg>

                                {/* Location markers */}
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
                                        {/* Pulse dot */}
                                        <span className="relative flex h-10 w-10 items-center justify-center">
                                            <span className={`absolute inline-flex h-8 w-8 animate-ping rounded-full ${loc.isHQ ? "bg-pink-400/50" : "bg-sky-400/50"
                                                }`} />
                                            <span
                                                className={`relative inline-flex h-5 w-5 rounded-full border-2 border-white/80 shadow-lg ${loc.isHQ
                                                    ? "bg-gradient-to-br from-pink-400 to-orange-400 shadow-pink-500/50"
                                                    : "bg-gradient-to-br from-sky-400 to-blue-500 shadow-sky-500/50"
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
                                    <span className="inline-flex h-3.5 w-3.5 rounded-full bg-gradient-to-br from-pink-400 to-orange-400 shadow-sm shadow-pink-500/30" />
                                    <span>{t("contactPage.globalMap.legend.hq")}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="inline-flex h-3.5 w-3.5 rounded-full bg-gradient-to-br from-sky-400 to-blue-500 shadow-sm shadow-sky-500/30" />
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
