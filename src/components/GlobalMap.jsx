/**
 * GlobalMap Component
 * 
 * Interactive world map showing Algorythmos offices in France and Australia.
 * Uses i18n for EN/FR localization.
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
            top: "31%",
            left: "44%",
            isHQ: true,
        },
        {
            id: "au",
            titleKey: "contactPage.globalMap.australia.title",
            roleKey: "contactPage.globalMap.australia.role",
            top: "72%",
            left: "84%",
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
                    <div className="relative overflow-visible rounded-[1.4rem] bg-slate-950/80 px-4 py-6 sm:px-8 sm:py-8">
                        {/* Glows */}
                        <div className="pointer-events-none absolute inset-0">
                            <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-violet-500/30 blur-[110px]" />
                            <div className="absolute right-0 bottom-0 h-80 w-80 rounded-full bg-blue-400/30 blur-[120px]" />
                        </div>

                        {/* Abstract map area */}
                        <div className="mx-auto max-w-[1200px] w-full">
                            <div className="relative w-full aspect-[16/9] min-h-[300px] sm:min-h-[380px] lg:min-h-[420px]">
                                {/* Background "map" grid */}
                                <div className="absolute inset-6 z-[2] rounded-[1.25rem] bg-gradient-to-br from-slate-900/80 via-slate-900/40 to-slate-900/90 border border-slate-700/60">
                                    {/* Horizontal + vertical lines */}
                                    {[...Array(6)].map((_, i) => (
                                        <div
                                            key={`h-${i}`}
                                            className="absolute left-0 right-0 h-px bg-slate-700/40"
                                            style={{ top: `${(100 / 6) * (i + 1)}%` }}
                                        />
                                    ))}
                                    {[...Array(8)].map((_, i) => (
                                        <div
                                            key={`v-${i}`}
                                            className="absolute top-0 bottom-0 w-px bg-slate-700/35"
                                            style={{ left: `${(100 / 8) * (i + 1)}%` }}
                                        />
                                    ))}

                                    {/* Simplified continent blobs to suggest a world map */}
                                    <div className="pointer-events-none absolute inset-0 z-[1] opacity-70">
                                        {/* Europe / Africa */}
                                        <div className="absolute left-[38%] top-[32%] h-24 w-32 rounded-[40%] bg-violet-400/25 blur-xl" />
                                        {/* Americas */}
                                        <div className="absolute left-[12%] top-[30%] h-28 w-40 rounded-[45%] bg-indigo-400/25 blur-xl" />
                                        {/* Asia */}
                                        <div className="absolute left-[55%] top-[28%] h-28 w-44 rounded-[45%] bg-purple-300/24 blur-xl" />
                                        {/* Australia */}
                                        <div className="absolute left-[78%] top-[64%] h-16 w-20 rounded-[50%] bg-blue-400/26 blur-xl" />
                                    </div>

                                    {/* Connection arcs (static dashed lines) */}
                                    <svg
                                        className="pointer-events-none absolute inset-0 z-[3] h-full w-full"
                                        viewBox="0 0 100 50"
                                        preserveAspectRatio="xMidYMid meet"
                                        aria-hidden="true"
                                    >
                                        {/* France → Sydney */}
                                        <path
                                            d="M45 20 C 60 10, 75 20, 85 35"
                                            className="fill-none stroke-violet-300/80"
                                            strokeWidth="0.7"
                                            strokeDasharray="2 2"
                                        />
                                        {/* France → North America */}
                                        <path
                                            d="M45 20 C 35 10, 25 15, 18 22"
                                            className="fill-none stroke-violet-200/70"
                                            strokeWidth="0.6"
                                            strokeDasharray="2 2"
                                        />
                                        {/* France → Asia */}
                                        <path
                                            d="M45 20 C 55 15, 65 18, 75 18"
                                            className="fill-none stroke-violet-200/70"
                                            strokeWidth="0.6"
                                            strokeDasharray="2 2"
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
                                                <span className="absolute inline-flex h-7 w-7 animate-ping rounded-full bg-violet-400/35" />
                                                <span
                                                    className={`relative inline-flex h-3.5 w-3.5 rounded-full border-2 border-slate-950 shadow-lg ${loc.isHQ
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
