import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
    ArcElement,
} from "chart.js";
import { Line, Doughnut } from "react-chartjs-2";
import { useI18n } from "../../app/i18n/I18nContext";
import {
    Briefcase,
    Building2,
    Cpu,
    Globe2,
    HeartPulse,
    Lightbulb,
} from "lucide-react";

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
    ArcElement
);

// --- Chart 1: Engineering Complexity Index (Area Chart) ---
const EngineeringComplexityChart = ({ t }) => {
    const data = {
        labels: ["Jun 24", "Jan 25", "Jun 25", "Oct 25", "Jan 26"],
        datasets: [
            {
                label: t("about.journey.charts.complexity.label"),
                data: [15, 32, 50, 75, 98],
                fill: true,
                backgroundColor: "rgba(99, 102, 241, 0.1)", // Indigo fill 0.1 opacity
                borderColor: "rgba(124, 58, 237, 1)", // Violet-600
                borderWidth: 2,
                tension: 0.4,
                pointBackgroundColor: "rgba(124, 58, 237, 1)",
                pointBorderColor: "#fff",
                pointHoverBackgroundColor: "#fff",
                pointHoverBorderColor: "rgba(124, 58, 237, 1)",
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                mode: "index",
                intersect: false,
                backgroundColor: "rgba(15, 23, 42, 0.9)",
                titleColor: "#94a3b8",
                bodyColor: "#e2e8f0",
                borderColor: "rgba(148, 163, 184, 0.1)",
                borderWidth: 1,
                padding: 10,
                displayColors: false,
            },
        },
        scales: {
            x: {
                grid: { display: false, drawBorder: false },
                ticks: { color: "#64748b", font: { size: 10 } },
            },
            y: {
                grid: {
                    color: "rgba(148, 163, 184, 0.05)",
                    drawBorder: false,
                },
                ticks: { display: false },
                min: 0,
                max: 100,
            },
        },
        interaction: {
            mode: "nearest",
            axis: "x",
            intersect: false,
        },
    };

    return (
        <div className="w-full h-64 p-4 bg-white/[0.02] rounded-xl border border-white/10 backdrop-blur-md">
            <h4 className="text-sm font-semibold text-gray-400 mb-4 px-2">
                {t("about.journey.charts.complexity.title")}
            </h4>
            <div className="h-48">
                <Line data={data} options={options} />
            </div>
        </div>
    );
};

// --- Chart 2: Sector Distribution (Doughnut) ---
const SectorDistributionChart = ({ t }) => {
    // Label wrapping logic: Helper to wrap text every 16 chars (approx)
    // Chart.js supports arrays for multi-line labels
    const wrapLabel = (str) => {
        if (str.length <= 16) return str;
        const words = str.split(" ");
        const lines = [];
        let currentLine = words[0];

        for (let i = 1; i < words.length; i++) {
            if (currentLine.length + 1 + words[i].length <= 16) {
                currentLine += " " + words[i];
            } else {
                lines.push(currentLine);
                currentLine = words[i];
            }
        }
        lines.push(currentLine);
        return lines;
    };

    const labelsRaw = [
        t("about.journey.charts.sector.healthcare"), // 40%
        t("about.journey.charts.sector.mining"),     // 30%
        t("about.journey.charts.sector.energy"),     // 20%
        t("about.journey.charts.sector.research"),   // 10%
    ];

    const labelsWrapped = labelsRaw.map(wrapLabel);

    const data = {
        labels: labelsWrapped,
        datasets: [
            {
                data: [40, 30, 20, 10],
                backgroundColor: [
                    "#0d9488", // Teal
                    "#4f46e5", // Indigo
                    "#d97706", // Amber
                    "#64748b", // Slate
                ],
                borderWidth: 0,
                hoverOffset: 10,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "75%",
        plugins: {
            legend: {
                position: "right",
                labels: {
                    color: "#94a3b8",
                    font: { size: 11, family: "Inter" },
                    usePointStyle: true,
                    pointStyle: "circle",
                    padding: 15,
                },
            },
            tooltip: {
                backgroundColor: "rgba(15, 23, 42, 0.9)",
                bodyColor: "#e2e8f0",
                borderColor: "rgba(148, 163, 184, 0.1)",
                borderWidth: 1,
                padding: 12,
                callbacks: {
                    label: (context) => {
                        // Rejoin if it's an array for the tooltip
                        let labelRaw = context.label;
                        if (Array.isArray(labelRaw)) labelRaw = labelRaw.join(" ");
                        return ` ${labelRaw}: ${context.raw}%`;
                    },
                },
            },
        },
    };

    return (
        <div className="w-full h-64 p-4 bg-white/[0.02] rounded-xl border border-white/10 backdrop-blur-md flex flex-col justify-center">
            <h4 className="text-sm font-semibold text-gray-400 mb-2 px-2 absolute top-4 left-4">
                {t("about.journey.charts.sector.title")}
            </h4>
            <div className="h-40 mt-6 relative">
                <Doughnut data={data} options={options} />
                {/* Centered Total or Label if desired, leaving clean for now */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="text-2xl font-black text-white/10 select-none">2026</span>
                </div>
            </div>
        </div>
    );
};

// --- Main Layout Component ---
const OurJourneyLayout = () => {
    const { t } = useI18n();
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"],
    });

    const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

    const milestones = [
        {
            year: t("about.journey.milestones.0.year"),
            title: t("about.journey.milestones.0.title"),
            description: t("about.journey.milestones.0.description"),
            icon: Lightbulb,
            color: "blue",
        },
        {
            year: t("about.journey.milestones.1.year"),
            title: t("about.journey.milestones.1.title"),
            description: t("about.journey.milestones.1.description"),
            icon: Building2,
            color: "indigo",
        },
        {
            year: t("about.journey.milestones.2.year"),
            title: t("about.journey.milestones.2.title"),
            description: t("about.journey.milestones.2.description"),
            icon: Briefcase, // Mining isn't a default lucide icon, using Briefcase/HardHat metaphor
            color: "amber",
            chart: <EngineeringComplexityChart t={t} />, // Inject Engineering Chart here
        },
        {
            year: t("about.journey.milestones.3.year"),
            title: t("about.journey.milestones.3.title"),
            description: t("about.journey.milestones.3.description"),
            icon: Globe2,
            color: "orange",
        },
        {
            year: t("about.journey.milestones.4.year"),
            title: t("about.journey.milestones.4.title"),
            description: t("about.journey.milestones.4.description"),
            icon: HeartPulse,
            color: "rose",
            chart: <SectorDistributionChart t={t} />, // Inject Sector Chart here
        },
    ];

    return (
        <section ref={containerRef} className="relative py-24 sm:py-32 overflow-hidden bg-[#020617]">
            {/* Mesh Gradient Background */}
            <div className="absolute inset-0">
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[120px] mix-blend-screen" />
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[120px] mix-blend-screen" />
                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay" />
            </div>

            <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 z-10">

                {/* Header */}
                <div className="text-center mb-20">
                    <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-6">
                        {t("about.journey.title")}{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-violet-400 to-indigo-400">
                            {t("about.journey.titleHighlight")}
                        </span>
                    </h2>
                    <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto">
                        {t("about.journey.subtitle")}
                    </p>
                </div>

                {/* Timeline Container */}
                <div className="relative">
                    {/* Vertical Line */}
                    {/* Desktop: Center, Mobile: Left aligned */}
                    <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-[2px] bg-slate-800/50 md:-translate-x-1/2">
                        <motion.div
                            style={{ scaleY, transformOrigin: "top" }}
                            className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-blue-500 via-violet-500 to-indigo-500"
                        />
                    </div>

                    <div className="space-y-12 md:space-y-24">
                        {milestones.map((milestone, index) => {
                            const isEven = index % 2 === 0;
                            return (
                                <TimelineItem
                                    key={index}
                                    data={milestone}
                                    isEven={isEven}
                                    index={index}
                                />
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
};

const TimelineItem = ({ data, isEven, index }) => {
    const Icon = data.icon;

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: index * 0.1 }}
            className={`relative flex flex-col md:flex-row items-start ${isEven ? "md:flex-row-reverse" : ""
                } group`}
        >
            {/* Date Badge (Mobile: Top Left, Desktop: Center on line) */}
            <div className="absolute left-8 md:left-1/2 -translate-x-1/2 -translate-y-1 md:translate-y-0 w-4 h-4 rounded-full bg-[#020617] border-[3px] border-slate-700 z-20 group-hover:border-violet-500 group-hover:scale-125 transition-all duration-300 shadow-[0_0_10px_rgba(0,0,0,0.5)]"></div>

            {/* Spacer for Desktop Centering */}
            <div className="hidden md:block w-1/2" />

            {/* Content Card */}
            <div className={`w-full md:w-1/2 pl-16 md:pl-0 ${isEven ? "md:pr-12 lg:pr-16 md:text-right" : "md:pl-12 lg:pl-16 md:text-left"}`}>

                {/* Card Body */}
                <div className={`
            relative p-6 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl 
            transition-all duration-500
            hover:shadow-[0_0_30px_rgba(124,58,237,0.4)]
            hover:bg-white/[0.05] hover:border-violet-500/30
        `}>
                    <div className={`flex flex-col gap-4 ${isEven ? "md:items-end" : "md:items-start"}`}>
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-bold uppercase tracking-wider w-fit">
                            {data.year}
                        </div>

                        <div className="flex items-center gap-3">
                            <Icon className={`w-6 h-6 text-slate-200`} />
                            <h3 className="text-xl md:text-2xl font-black text-white leading-tight">
                                {data.title}
                            </h3>
                        </div>

                        <p className="text-slate-400 text-sm md:text-base leading-relaxed">
                            {data.description}
                        </p>

                        {/* Chart Injection */}
                        {data.chart && (
                            <div className="w-full mt-4 animate-in fade-in zoom-in duration-700">
                                {data.chart}
                            </div>
                        )}
                    </div>
                </div>
            </div>

        </motion.div>
    );
};

export default OurJourneyLayout;
