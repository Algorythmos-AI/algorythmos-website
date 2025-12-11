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
            top: "36%",
            left: "48%",
            isHQ: true,
        },
        {
            id: "au",
            titleKey: "contactPage.globalMap.australia.title",
            roleKey: "contactPage.globalMap.australia.role",
            top: "68%",
            left: "82%",
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
                            <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-violet-500/30 blur-[110px]" />
                            <div className="absolute right-0 bottom-0 h-80 w-80 rounded-full bg-blue-400/30 blur-[120px]" />
                        </div>

                        {/* Real World Map Area */}
                        <div className="mx-auto max-w-[1200px] w-full">
                            <div className="relative w-full aspect-[16/9] min-h-[300px] sm:min-h-[380px] lg:min-h-[420px] rounded-[1.25rem] bg-gradient-to-br from-slate-900/80 via-slate-900/40 to-slate-900/90 border border-slate-700/60 overflow-hidden">

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
                                            width="25"
                                            height="25"
                                            patternUnits="userSpaceOnUse"
                                        >
                                            <path
                                                d="M 25 0 L 0 0 0 25"
                                                className="stroke-slate-700/40"
                                                strokeWidth="0.5"
                                                fill="none"
                                            />
                                        </pattern>

                                        {/* Center glow gradient */}
                                        <radialGradient id="global-map-glow" cx="50%" cy="50%" r="60%">
                                            <stop offset="0%" stopColor="#6366F1" stopOpacity="0.15" />
                                            <stop offset="100%" stopColor="#0F172A" stopOpacity="0" />
                                        </radialGradient>

                                        {/* France glow */}
                                        <radialGradient id="france-glow" cx="50%" cy="50%" r="50%">
                                            <stop offset="0%" stopColor="#F472B6" stopOpacity="0.6" />
                                            <stop offset="100%" stopColor="#F472B6" stopOpacity="0" />
                                        </radialGradient>

                                        {/* Australia glow */}
                                        <radialGradient id="australia-glow" cx="50%" cy="50%" r="50%">
                                            <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.6" />
                                            <stop offset="100%" stopColor="#38BDF8" stopOpacity="0" />
                                        </radialGradient>
                                    </defs>

                                    {/* Grid background */}
                                    <rect width="1000" height="500" fill="url(#global-map-grid)" />
                                    <rect width="1000" height="500" fill="url(#global-map-glow)" />

                                    {/* Real World Map Continents - Simplified but geographically accurate */}
                                    <g className="fill-violet-400/25 stroke-violet-300/40" strokeWidth="1">

                                        {/* North America */}
                                        <path d="M 80 80 Q 100 70, 140 75 L 180 85 Q 200 90, 220 100 L 240 120 Q 250 140, 245 160 L 230 180 Q 210 200, 190 210 L 160 220 Q 140 225, 120 210 L 100 190 Q 90 170, 85 150 L 80 120 Q 75 100, 80 80 Z" />

                                        {/* Central America & Caribbean */}
                                        <path d="M 190 215 Q 200 220, 210 230 L 220 250 Q 225 260, 220 270 L 210 275 Q 200 278, 195 270 L 190 255 Q 188 240, 190 215 Z" />

                                        {/* South America */}
                                        <path d="M 220 280 Q 240 275, 260 285 L 280 310 Q 290 340, 285 380 L 270 420 Q 255 450, 235 460 L 215 455 Q 200 440, 195 410 L 200 370 Q 205 330, 210 300 Q 215 285, 220 280 Z" />

                                        {/* Europe */}
                                        <path d="M 440 90 Q 460 80, 490 85 L 520 95 Q 540 105, 545 120 L 540 140 Q 530 155, 510 160 L 480 165 Q 455 168, 440 155 L 430 135 Q 428 115, 440 90 Z" />

                                        {/* UK & Ireland */}
                                        <path d="M 420 95 Q 430 90, 435 100 L 432 115 Q 428 120, 420 118 L 415 108 Q 415 98, 420 95 Z" />

                                        {/* Scandinavia */}
                                        <path d="M 490 50 Q 505 45, 520 55 L 530 75 Q 535 90, 525 100 L 510 95 Q 495 85, 490 70 L 490 50 Z" />

                                        {/* Africa */}
                                        <path d="M 460 175 Q 490 168, 520 180 L 550 210 Q 570 250, 565 300 L 550 350 Q 530 390, 500 410 L 465 420 Q 435 415, 420 385 L 415 340 Q 420 290, 435 245 L 450 200 Q 455 185, 460 175 Z" />

                                        {/* Middle East */}
                                        <path d="M 555 155 Q 580 150, 605 160 L 620 180 Q 625 200, 615 215 L 590 220 Q 565 218, 555 200 L 550 175 Q 552 160, 555 155 Z" />

                                        {/* Russia & Central Asia */}
                                        <path d="M 530 45 Q 600 35, 700 40 L 800 55 Q 850 65, 870 85 L 860 110 Q 840 130, 800 140 L 720 145 Q 660 142, 600 130 L 550 115 Q 535 100, 535 80 L 530 45 Z" />

                                        {/* South Asia (India) */}
                                        <path d="M 640 180 Q 670 175, 700 190 L 720 220 Q 730 260, 715 300 L 690 320 Q 660 325, 640 300 L 630 260 Q 628 220, 640 180 Z" />

                                        {/* Southeast Asia */}
                                        <path d="M 740 200 Q 770 195, 800 210 L 820 240 Q 830 270, 815 300 L 780 320 Q 750 325, 735 300 L 730 260 Q 732 225, 740 200 Z" />

                                        {/* East Asia (China, Japan, Korea) */}
                                        <path d="M 750 100 Q 790 90, 840 100 L 880 130 Q 900 160, 890 190 L 860 210 Q 820 220, 780 200 L 760 170 Q 748 135, 750 100 Z" />

                                        {/* Japan */}
                                        <path d="M 895 120 Q 910 115, 920 130 L 925 160 Q 922 180, 908 185 L 895 175 Q 888 155, 895 120 Z" />

                                        {/* Indonesia & Philippines */}
                                        <path d="M 800 310 Q 830 305, 860 320 L 890 340 Q 900 360, 885 380 L 850 390 Q 815 388, 795 365 L 790 340 Q 792 318, 800 310 Z" />

                                        {/* Australia */}
                                        <path d="M 800 360 Q 840 350, 890 365 L 930 395 Q 950 430, 940 470 L 910 495 Q 865 505, 820 490 L 790 455 Q 775 415, 785 380 Q 790 365, 800 360 Z" />

                                        {/* New Zealand */}
                                        <path d="M 960 460 Q 970 455, 978 465 L 982 485 Q 980 495, 970 498 L 958 490 Q 955 475, 960 460 Z" />

                                        {/* Greenland */}
                                        <path d="M 300 30 Q 330 25, 360 35 L 380 55 Q 385 75, 370 90 L 340 95 Q 310 92, 295 75 L 290 50 Q 292 35, 300 30 Z" />

                                        {/* Iceland */}
                                        <path d="M 385 60 Q 395 55, 405 62 L 408 72 Q 405 80, 395 82 L 385 78 Q 382 68, 385 60 Z" />
                                    </g>

                                    {/* France marker glow */}
                                    <circle cx="480" cy="125" r="30" fill="url(#france-glow)" />

                                    {/* Australia marker glow */}
                                    <circle cx="865" cy="420" r="25" fill="url(#australia-glow)" />

                                    {/* Dashed great-circle arc from France to Australia */}
                                    <path
                                        d="M 480 130 Q 580 100, 680 180 Q 780 280, 860 415"
                                        className="stroke-white/50"
                                        strokeWidth="2"
                                        strokeDasharray="8 6"
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
                                        <span className="relative flex h-8 w-8 items-center justify-center">
                                            <span className={`absolute inline-flex h-7 w-7 animate-ping rounded-full ${loc.isHQ ? "bg-pink-400/35" : "bg-sky-400/35"
                                                }`} />
                                            <span
                                                className={`relative inline-flex h-4 w-4 rounded-full border-2 border-slate-950 shadow-lg ${loc.isHQ
                                                    ? "bg-gradient-to-br from-pink-400 to-orange-300"
                                                    : "bg-gradient-to-br from-sky-400 to-blue-400"
                                                    }`}
                                            />
                                        </span>

                                        {/* Tooltip card */}
                                        <div className="pointer-events-none w-max max-w-xs rounded-xl border border-slate-600/70 bg-slate-950/95 px-3.5 py-2 text-left text-xs text-slate-100 shadow-2xl opacity-0 backdrop-blur group-hover:opacity-100 transition-opacity duration-200">
                                            <p className="font-medium">
                                                {t(loc.titleKey)}
                                                {loc.isHQ && (
                                                    <span className="ml-1 inline-flex rounded-full bg-pink-500/20 px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide text-pink-200">
                                                        HQ
                                                    </span>
                                                )}
                                            </p>
                                            <p className="mt-0.5 text-[0.7rem] text-slate-300/80">
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
                                    <span className="inline-flex h-3 w-3 rounded-full bg-gradient-to-br from-pink-400 to-orange-300" />
                                    <span>{t("contactPage.globalMap.legend.hq")}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="inline-flex h-3 w-3 rounded-full bg-gradient-to-br from-sky-400 to-blue-400" />
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
