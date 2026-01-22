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
import { FlagFR, FlagAU } from "./navigation/RegionFlags.jsx";

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
                            className="group absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer hq-ripple text-pink-400"
                            style={{ left: "50.5%", top: "32%" }}
                            onClick={() => setActiveOffice("fr")}
                        >
                            {/* Ambient glow */}
                            <div className="absolute inset-0 -z-10 rounded-full bg-[radial-gradient(circle,rgba(248,113,181,0.25),transparent_70%)] animate-[hqGlow_4s_ease-in-out_infinite]" />
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
                            className="group absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer hq-ripple text-sky-400"
                            style={{ left: "91.3%", top: "68.9%" }}
                            onClick={() => setActiveOffice("au")}
                        >
                            {/* Ambient glow */}
                            <div className="absolute inset-0 -z-10 rounded-full bg-[radial-gradient(circle,rgba(56,189,248,0.25),transparent_70%)] animate-[hqGlow_4s_ease-in-out_infinite]" />
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
                            className="absolute inset-0 w-full h-full pointer-events-none"
                            preserveAspectRatio="none"
                        >
                            {/* Animated dashed arc */}
                            <path
                                d="M50 16 Q69.65 15.225 91.3 34.45"
                                stroke="rgba(255,255,255,0.75)"
                                strokeWidth="0.6"
                                strokeDasharray="3 3"
                                strokeLinecap="round"
                                fill="none"
                                className="animate-[dash_3s_linear_infinite]"
                            />

                            {/* Soft travelling dot */}
                            <circle
                                r="1"
                                fill="rgba(56,189,248,0.9)"
                                className="travel-dot"
                            />
                        </svg>
                    </div>

                    {/* Legend */}
                    <div className="flex flex-wrap items-center justify-center gap-6 px-6 py-4 text-xs sm:text-sm text-slate-300 border-t border-slate-800/60 bg-slate-950/80">
                        <div className="flex items-center gap-2">
                            <span className="h-3 w-3 rounded-full bg-pink-400 ring-1 ring-white/60" />
                            <span className="font-medium">{t("contactPage.globalMap.legend.hq")}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="h-3 w-3 rounded-full bg-sky-400 ring-1 ring-white/60" />
                            <span className="font-medium">{t("contactPage.globalMap.legend.hq_au")}</span>
                        </div>
                    </div>

                    {/* Premium Follow-the-sun card */}
                    <div className="w-full flex justify-center mt-4 pb-4">
                        <div className="
                            relative
                            px-4 sm:px-5 
                            py-2.5 
                            rounded-full 
                            bg-slate-900/60 
                            border border-slate-700/60 
                            backdrop-blur-md 
                            flex 
                            items-center 
                            gap-2 sm:gap-3 
                            text-[10px] sm:text-xs 
                            text-slate-200 
                            shadow-[0_0_20px_rgba(0,0,0,0.35)]
                            overflow-hidden
                            max-w-full 
                            whitespace-normal 
                            break-words 
                            text-center
                        ">
                            {/* Animated purple gradient ring */}
                            <div className="
                                absolute inset-0 
                                rounded-full 
                                pointer-events-none
                                bg-gradient-to-r from-violet-500/20 via-fuchsia-400/10 to-blue-400/20
                                animate-[slowGlow_4s_ease-in-out_infinite]
                            " />

                            {/* Rotating globe icon */}
                            <svg
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="text-violet-300/90 animate-spin-slow"
                            >
                                <circle cx="12" cy="12" r="10"></circle>
                                <path d="M2 12h20M12 2a15.3 15.3 0 0 1 0 20 15.3 15.3 0 0 1 0-20Z"></path>
                            </svg>

                            {/* Text */}
                            <span className="relative font-medium tracking-wide whitespace-nowrap">
                                Follow-the-sun delivery across France, EU, UK, Australia & APAC
                            </span>

                            {/* Animated shine overlay */}
                            <div className="
                                absolute inset-0 
                                pointer-events-none
                                bg-gradient-to-r from-transparent via-white/10 to-transparent 
                                animate-[shine_3s_linear_infinite]
                            " />
                        </div>
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
                    <div className="flex justify-center mb-3">
                        <div className="flex items-center gap-2.5">
                            <FlagFR className="w-6 h-4 rounded-sm shadow-sm" />
                            <span className="text-sm font-semibold uppercase tracking-wider text-violet-200">
                                {t("contactPage.globalMap.locations.france.country")}
                            </span>
                        </div>
                    </div>
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
                    <div className="flex justify-center mb-3">
                        <div className="flex items-center gap-2.5">
                            <FlagAU className="w-6 h-4 rounded-sm shadow-sm" />
                            <span className="text-sm font-semibold uppercase tracking-wider text-sky-200">
                                {t("contactPage.globalMap.locations.australia.country")}
                            </span>
                        </div>
                    </div>
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
                    from { offset-distance: 0%; }
                    to   { offset-distance: 100%; }
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                .travel-dot {
                    offset-path: path("M50 16 Q69.65 15.225 91.3 34.45");
                    offset-rotate: auto;
                    animation: travel 3s linear infinite;
                    filter: drop-shadow(0 0 6px rgba(56,189,248,0.7))
                            drop-shadow(0 0 12px rgba(56,189,248,0.5));
                }

                @keyframes shine {
                    0% { transform: translateX(-150%); }
                    100% { transform: translateX(150%); }
                }

                @keyframes slowGlow {
                    0%, 100% { opacity: 0.25; }
                    50% { opacity: 0.55; }
                }

                @keyframes hqGlow {
                    0%, 100% { opacity: 0.3; transform: scale(1); }
                    50% { opacity: 0.6; transform: scale(1.1); }
                }

                @keyframes ripple {
                    0% {
                        transform: scale(1);
                        opacity: 0.35;
                    }
                    70% {
                        transform: scale(2.4);
                        opacity: 0;
                    }
                    100% {
                        opacity: 0;
                    }
                }

                .hq-ripple::after {
                    content: "";
                    position: absolute;
                    inset: 0;
                    border-radius: 50%;
                    border: 1px solid currentColor;
                    opacity: 0;
                    animation: ripple 3.5s ease-out infinite;
                }

                .animate-spin-slow {
                    animation: spinSlow 6s linear infinite;
                }

                @keyframes spinSlow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}
            </style>
        </section>
    );
};

export default GlobalMap;
