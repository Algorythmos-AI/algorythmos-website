/**
 * GlobalMap Component
 * 
 * Interactive world map showing Algorythmos offices in France and Australia.
 * Uses a real SVG world map generated from Natural Earth geographic data.
 * Uses i18n for EN/FR localization.
 * Features: animated arc, travelling dot, hover tooltips, click-to-highlight cards.
 */
import React from "react";
import { useI18n } from "../app/i18n/I18nContext";

const WORLD_MAP_SRC = "/media/maps/algorythmos_worldmap.svg";

const GlobalMap = () => {
    const { t } = useI18n();
    const [activeOffice, setActiveOffice] = React.useState(null);

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

            {/* Map card with fade-in animation */}
            <div className="mx-auto max-w-[1200px]">
                <div className="relative rounded-3xl bg-slate-950/70 border border-slate-800/60 shadow-[0_32px_90px_rgba(0,0,0,0.7)] overflow-hidden animate-[fadeIn_1.2s_ease_forwards] opacity-0">

                    {/* World map image */}
                    <div className="relative aspect-[16/9] w-full">
                        <img
                            src={WORLD_MAP_SRC}
                            alt="World map showing Algorythmos global presence"
                            className="absolute inset-0 h-full w-full object-contain"
                            loading="lazy"
                        />

                        {/* France marker with tooltip */}
                        <div
                            className="group absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                            style={{ left: "48%", top: "32%" }}
                            onClick={() => setActiveOffice("fr")}
                        >
                            <div
                                className="h-5 w-5 rounded-full bg-pink-400 ring-2 ring-white/90 shadow-[0_0_20px_rgba(248,113,181,0.9)] animate-pulse"
                                aria-label={t("contactPage.globalMap.france.title")}
                            />
                            <div className="absolute left-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-xs bg-slate-900/90 px-2 py-1 rounded-md border border-slate-700 text-white whitespace-nowrap z-10">
                                Head Office — France
                            </div>
                        </div>

                        {/* Australia marker with tooltip */}
                        <div
                            className="group absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                            style={{ left: "91.3%", top: "68.9%" }}
                            onClick={() => setActiveOffice("au")}
                        >
                            <div
                                className="h-5 w-5 rounded-full bg-sky-400 ring-2 ring-white/90 shadow-[0_0_20px_rgba(56,189,248,0.9)] animate-pulse"
                                aria-label={t("contactPage.globalMap.australia.title")}
                            />
                            <div className="absolute left-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-xs bg-slate-900/90 px-2 py-1 rounded-md border border-slate-700 text-white whitespace-nowrap z-10">
                                Head Office — Australia
                            </div>
                        </div>

                        {/* Dashed connection arc overlay with animation */}
                        <svg
                            viewBox="0 0 100 50"
                            className="absolute inset-0 h-full w-full pointer-events-none"
                            preserveAspectRatio="xMidYMid meet"
                        >
                            {/* Animated dashed arc */}
                            <path
                                d="M48 16 Q69.65 15.225 91.3 34.45"
                                stroke="rgba(255,255,255,0.75)"
                                strokeWidth="0.6"
                                strokeDasharray="3 3"
                                strokeLinecap="round"
                                fill="none"
                                className="animate-[dash_3s_linear_infinite]"
                            />

                            {/* Travelling dot */}
                            <circle
                                r="1.2"
                                fill="rgba(56,189,248,0.95)"
                                className="travel-dot"
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

            {/* Location cards with click-to-highlight */}
            <div className="mx-auto max-w-[1200px] mt-10 grid gap-6 sm:grid-cols-2">
                <div
                    className={`mx-auto max-w-xl sm:max-w-none rounded-2xl border bg-slate-950/70 p-4 sm:p-5 cursor-pointer transition-all duration-300 ${activeOffice === "fr"
                            ? "border-pink-400 shadow-[0_0_25px_rgba(248,113,181,0.4)]"
                            : "border-slate-700/70 hover:border-slate-600/80"
                        }`}
                    onClick={() => setActiveOffice("fr")}
                >
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

                <div
                    className={`mx-auto max-w-xl sm:max-w-none rounded-2xl border bg-slate-950/70 p-4 sm:p-5 cursor-pointer transition-all duration-300 ${activeOffice === "au"
                            ? "border-sky-400 shadow-[0_0_25px_rgba(56,189,248,0.4)]"
                            : "border-slate-700/70 hover:border-slate-600/80"
                        }`}
                    onClick={() => setActiveOffice("au")}
                >
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

            {/* Animation keyframes */}
            <style>
                {`
                @keyframes dash {
                    to {
                        stroke-dashoffset: -20;
                    }
                }
                @keyframes travel {
                    0%   { offset-distance: 0%; }
                    100% { offset-distance: 100%; }
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                .travel-dot {
                    offset-path: path("M48 16 Q69.65 15.225 91.3 34.45");
                    offset-rotate: auto;
                    animation: travel 3s linear infinite;
                    filter: drop-shadow(0 0 6px rgb(56,189,248));
                }
            `}
            </style>
        </section>
    );
};

export default GlobalMap;
