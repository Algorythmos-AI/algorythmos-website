/**
 * GlobalMap Component
 * 
 * Interactive world map showing Algorythmos offices in France and Australia.
 * Uses a real SVG world map generated from Natural Earth geographic data.
 * Uses i18n for EN/FR localization.
 */
import React from "react";
import { useI18n } from "../app/i18n/I18nContext";

const WORLD_MAP_SRC = "/media/maps/algorythmos_worldmap.svg";

const GlobalMap = () => {
    const { t } = useI18n();

    return (
        <section
            aria-labelledby="global-map-heading"
            className="relative w-full px-4 sm:px-6 lg:px-8 pt-16 pb-10 lg:pt-20 lg:pb-14"
        >
            {/* Heading */}
            <div className="mx-auto max-w-5xl text-center space-y-3 mb-10">
                <p className="text-xs font-semibold tracking-[0.2em] text-violet-300/80 uppercase">
                    {t("contactPage.globalMap.badge")}
                </p>
                <h2
                    id="global-map-heading"
                    className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-slate-50"
                >
                    {t("contactPage.globalMap.heading")}
                </h2>
                <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
                    {t("contactPage.globalMap.subheading")}
                </p>
            </div>

            {/* Map card */}
            <div className="mx-auto max-w-[1200px]">
                <div className="relative rounded-3xl bg-slate-950/70 border border-slate-800/60 shadow-[0_32px_90px_rgba(0,0,0,0.7)] overflow-hidden">

                    {/* World map image */}
                    <div className="relative aspect-[16/9] w-full">
                        <img
                            src={WORLD_MAP_SRC}
                            alt="World map showing Algorythmos global presence"
                            className="absolute inset-0 h-full w-full object-contain"
                            loading="lazy"
                        />

                        {/* France marker */}
                        <div
                            className="absolute h-5 w-5 rounded-full bg-pink-400 ring-2 ring-white/90 shadow-[0_0_20px_rgba(248,113,181,0.9)] animate-pulse"
                            style={{ left: "48%", top: "32%" }}
                            aria-label={t("contactPage.globalMap.france.title")}
                        />

                        {/* Australia marker */}
                        <div
                            className="absolute h-5 w-5 rounded-full bg-sky-400 ring-2 ring-white/90 shadow-[0_0_20px_rgba(56,189,248,0.9)] animate-pulse"
                            style={{ left: "79%", top: "71%" }}
                            aria-label={t("contactPage.globalMap.australia.title")}
                        />

                        {/* Dashed connection arc overlay */}
                        <svg
                            viewBox="0 0 100 50"
                            className="absolute inset-0 h-full w-full pointer-events-none"
                            preserveAspectRatio="xMidYMid meet"
                        >
                            <path
                                d="M48,16 Q60,8 72,28 Q80,38 82,38.5"
                                stroke="rgba(255,255,255,0.7)"
                                strokeWidth="0.3"
                                strokeDasharray="1.5 1"
                                strokeLinecap="round"
                                fill="none"
                            />
                        </svg>
                    </div>

                    {/* Legend */}
                    <div className="flex flex-wrap items-center gap-4 px-6 py-4 text-xs sm:text-sm text-slate-300 border-t border-slate-800/60 bg-slate-950/80">
                        <div className="flex items-center gap-2">
                            <span className="h-3 w-3 rounded-full bg-pink-400 ring-1 ring-white/60" />
                            <span className="font-medium">{t("contactPage.globalMap.legend.hq")}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="h-3 w-3 rounded-full bg-sky-400 ring-1 ring-white/60" />
                            <span className="font-medium">{t("contactPage.globalMap.legend.hq_au")}</span>
                        </div>
                        <span className="ml-auto text-[11px] sm:text-xs text-slate-500">
                            {t("contactPage.globalMap.legend.coverage")}
                        </span>
                    </div>
                </div>
            </div>

            {/* Location cards */}
            <div className="mx-auto max-w-[1200px] mt-10 grid gap-6 sm:grid-cols-2">
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
        </section>
    );
};

export default GlobalMap;
