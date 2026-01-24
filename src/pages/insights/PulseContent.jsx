import React from "react";
import { Link } from "react-router-dom";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    PointElement,
    LineElement,
    ArcElement,
    Filler
} from "chart.js";
import { Bar, Doughnut, Line, Chart } from "react-chartjs-2";
import { useI18n } from "../../app/i18n/I18nContext";

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    PointElement,
    LineElement,
    ArcElement,
    Filler
);

const PulseContent = ({ t, getRegionPath }) => {
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { labels: { color: "#94a3b8", font: { size: 10, weight: "600" } } },
            tooltip: {
                backgroundColor: "#0f172a",
                titleColor: "#f8fafc",
                bodyColor: "#cbd5e1",
                borderColor: "rgba(255,255,255,0.1)",
                borderWidth: 1,
                padding: 12,
            },
        },
        scales: {
            x: { grid: { color: "rgba(255,255,255,0.05)" }, ticks: { color: "#64748b", font: { size: 10 } } },
            y: { grid: { color: "rgba(255,255,255,0.05)" }, ticks: { color: "#64748b", font: { size: 10 } } },
        },
    };

    const heroChartData = {
        labels: ["2020", "2021", "2022", "2023", "2024"],
        datasets: [
            {
                type: "bar",
                label: "Healthcare Funding",
                data: [100, 108, 115, 122, 130],
                backgroundColor: "#0d9488",
                borderRadius: 4,
                order: 2,
            },
            {
                type: "line",
                label: "System Wait Times",
                data: [100, 110, 128, 145, 160],
                borderColor: "#e11d48",
                borderWidth: 3,
                pointBackgroundColor: "#e11d48",
                tension: 0.4,
                order: 1,
            },
        ],
    };

    const scribeChartData = {
        labels: ["Clinical Care", "Documentation Tax"],
        datasets: [
            {
                data: [58, 42],
                backgroundColor: ["#1e293b", "#e11d48"],
                borderWidth: 0,
                hoverOffset: 10,
            },
        ],
    };

    const edWaitChartData = {
        labels: ["Result Chasing", "Wait for Bed", "Triage"],
        datasets: [
            {
                label: "Minutes per Patient",
                data: [45, 30, 15],
                backgroundColor: "#4f46e5",
                borderRadius: 6,
            },
        ],
    };

    const dischargeChartData = {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
        datasets: [
            {
                label: "Bed Block Spike",
                data: [12, 18, 15, 25, 60],
                fill: true,
                backgroundColor: "rgba(20, 184, 166, 0.1)",
                borderColor: "#14b8a6",
                tension: 0.4,
            },
        ],
    };

    const methodChartData = {
        labels: ["Clinician Hours Reclaimed", "ED Flow Improvement", "Revenue Capture Gain"],
        datasets: [
            {
                label: "% Improvement Potential",
                data: [25, 15, 6],
                backgroundColor: ["#4f46e5", "#7c3aed", "#0d9488"],
                borderRadius: 4,
            },
        ],
    };

    return (
        <div className="font-sans text-slate-50 scroll-smooth">
            {/* HERO: THE CAPACITY TRAP */}
            <section className="py-12 relative overflow-hidden">
                {/* Mesh Background */}
                <div className="absolute inset-0 bg-[radial-gradient(at_0%_0%,rgba(79,70,229,0.1)_0px,transparent_50%),radial-gradient(at_100%_0%,rgba(124,58,237,0.1)_0px,transparent_50%),radial-gradient(at_50%_100%,rgba(13,148,136,0.05)_0px,transparent_50%)] pointer-events-none" />

                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
                    <div className="space-y-8">
                        <div className="inline-block px-4 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-500 font-black text-[10px] uppercase tracking-widest">
                            {t("blogDetail.posts.pulse-clinical-ai.context.tag")}
                        </div>
                        <h1 className="text-4xl lg:text-6xl font-black leading-[1.1] tracking-tight">
                            {t("blogDetail.posts.pulse-clinical-ai.context.title")}
                        </h1>
                        <p className="text-xl text-slate-400 leading-relaxed max-w-xl">
                            {t("blogDetail.posts.pulse-clinical-ai.context.subtitle")}
                        </p>
                        <div className="flex flex-wrap gap-6 pt-4">
                            <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 p-6 rounded-2xl flex-1 min-w-[200px]">
                                <div className="text-3xl font-black text-rose-500 mb-1">
                                    {t("blogDetail.posts.pulse-clinical-ai.context.stats.ramping")}
                                </div>
                                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                    {t("blogDetail.posts.pulse-clinical-ai.context.stats.rampingLabel")}
                                </div>
                            </div>
                            <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 p-6 rounded-2xl flex-1 min-w-[200px]">
                                <div className="text-3xl font-black text-teal-500 mb-1">
                                    {t("blogDetail.posts.pulse-clinical-ai.context.stats.lost")}
                                </div>
                                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                    {t("blogDetail.posts.pulse-clinical-ai.context.stats.lostLabel")}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl relative overflow-hidden">
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-600 opacity-20 blur-3xl" />
                        <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-6">
                            {t("blogDetail.posts.pulse-clinical-ai.context.chart.title")}
                        </h3>
                        <div className="h-80 w-full">
                            <ChartJS type="bar" data={heroChartData} options={chartOptions} />
                        </div>
                        <p className="mt-6 text-[10px] text-slate-500 text-center italic">
                            {t("blogDetail.posts.pulse-clinical-ai.context.chart.caption")}
                        </p>
                    </div>
                </div>
            </section>

            {/* DIAGNOSIS */}
            <section className="py-20 relative z-10">
                <div className="text-center mb-16 px-6">
                    <h2 className="text-3xl font-black mb-4">
                        {t("blogDetail.posts.pulse-clinical-ai.diagnosis.title")}
                    </h2>
                    <p className="text-slate-400 max-w-2xl mx-auto font-medium">
                        {t("blogDetail.posts.pulse-clinical-ai.diagnosis.subtitle")}
                    </p>
                </div>

                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Scribe Tax */}
                    <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 p-8 rounded-3xl hover:border-violet-500/50 hover:shadow-[0_0_20px_rgba(124,58,237,0.2)] transition-all duration-300 group">
                        <div className="h-12 w-12 bg-rose-500/10 rounded-xl flex items-center justify-center text-2xl mb-6">🎙️</div>
                        <h4 className="text-xl font-extrabold mb-3">
                            {t("blogDetail.posts.pulse-clinical-ai.diagnosis.scribe.title")}
                        </h4>
                        <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                            {t("blogDetail.posts.pulse-clinical-ai.diagnosis.scribe.desc")}
                        </p>
                        <div className="h-48 w-full">
                            <Doughnut data={scribeChartData} options={{ ...chartOptions, cutout: "75%" }} />
                        </div>
                    </div>

                    {/* ED Wait */}
                    <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 p-8 rounded-3xl hover:border-violet-500/50 hover:shadow-[0_0_20px_rgba(124,58,237,0.2)] transition-all duration-300 group">
                        <div className="h-12 w-12 bg-indigo-500/10 rounded-xl flex items-center justify-center text-2xl mb-6">🚑</div>
                        <h4 className="text-xl font-extrabold mb-3">
                            {t("blogDetail.posts.pulse-clinical-ai.diagnosis.wait.title")}
                        </h4>
                        <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                            {t("blogDetail.posts.pulse-clinical-ai.diagnosis.wait.desc")}
                        </p>
                        <div className="h-48 w-full">
                            <Bar data={edWaitChartData} options={chartOptions} />
                        </div>
                    </div>

                    {/* Discharge Lag */}
                    <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 p-8 rounded-3xl hover:border-violet-500/50 hover:shadow-[0_0_20px_rgba(124,58,237,0.2)] transition-all duration-300 group">
                        <div className="h-12 w-12 bg-teal-500/10 rounded-xl flex items-center justify-center text-2xl mb-6">🚪</div>
                        <h4 className="text-xl font-extrabold mb-3">
                            {t("blogDetail.posts.pulse-clinical-ai.diagnosis.discharge.title")}
                        </h4>
                        <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                            {t("blogDetail.posts.pulse-clinical-ai.diagnosis.discharge.desc")}
                        </p>
                        <div className="h-48 w-full">
                            <Line data={dischargeChartData} options={chartOptions} />
                        </div>
                    </div>
                </div>
            </section>

            {/* METHOD */}
            <section className="py-20 border-t border-white/5 relative z-10">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="order-2 lg:order-1 bg-slate-900/60 backdrop-blur-xl border border-white/10 p-10 rounded-3xl">
                        <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-8">
                            {t("blogDetail.posts.pulse-clinical-ai.method.chartTitle")}
                        </h3>
                        <div className="h-80 w-full">
                            <Bar data={methodChartData} options={{ ...chartOptions, indexAxis: "y" }} />
                        </div>
                    </div>

                    <div className="order-1 lg:order-2 space-y-6">
                        <h2 className="text-4xl font-black">
                            {t("blogDetail.posts.pulse-clinical-ai.method.title")}
                        </h2>
                        <p className="text-slate-400 text-lg leading-relaxed">
                            {t("blogDetail.posts.pulse-clinical-ai.method.desc")}
                        </p>
                        <div className="space-y-4">
                            <div className="flex items-start space-x-4">
                                <div className="mt-1 h-2 w-2 bg-teal-500 rounded-full shadow-[0_0_8px_#14b8a6]" />
                                <p className="text-sm text-slate-300 font-medium">
                                    {t("blogDetail.posts.pulse-clinical-ai.method.points.0")}
                                </p>
                            </div>
                            <div className="flex items-start space-x-4">
                                <div className="mt-1 h-2 w-2 bg-indigo-500 rounded-full shadow-[0_0_8px_#6366f1]" />
                                <p className="text-sm text-slate-300 font-medium">
                                    {t("blogDetail.posts.pulse-clinical-ai.method.points.1")}
                                </p>
                            </div>
                            <div className="flex items-start space-x-4">
                                <div className="mt-1 h-2 w-2 bg-purple-500 rounded-full shadow-[0_0_8px_#a855f7]" />
                                <p className="text-sm text-slate-300 font-medium">
                                    {t("blogDetail.posts.pulse-clinical-ai.method.points.2")}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* EXECUTION ROADMAP */}
            <section className="py-24 max-w-5xl mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-black mb-4">
                        {t("blogDetail.posts.pulse-clinical-ai.execution.title")}
                    </h2>
                    <p className="text-slate-400 font-medium">
                        {t("blogDetail.posts.pulse-clinical-ai.execution.subtitle")}
                    </p>
                </div>

                <div className="space-y-4">
                    {[0, 1, 2].map((i) => (
                        <div
                            key={i}
                            className="bg-slate-900/60 backdrop-blur-xl border border-white/10 p-6 rounded-2xl flex items-center gap-6 hover:border-indigo-500/50 hover:translate-y-[-2px] transition-all duration-300 group"
                        >
                            <div className="text-2xl font-black text-indigo-500 opacity-50 group-hover:opacity-100 transition-opacity">
                                0{i + 1}
                            </div>
                            <div className="flex-grow">
                                <h5 className="text-lg font-bold">
                                    {t(`blogDetail.posts.pulse-clinical-ai.execution.steps.${i}.title`)}
                                </h5>
                                <p className="text-xs text-slate-500">
                                    {t(`blogDetail.posts.pulse-clinical-ai.execution.steps.${i}.desc`)}
                                </p>
                            </div>
                            <div className="text-xs font-black text-teal-500 bg-teal-500/10 px-3 py-1 rounded whitespace-nowrap">
                                {t(`blogDetail.posts.pulse-clinical-ai.execution.steps.${i}.roi`)}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 text-center max-w-4xl mx-auto px-6 relative z-10">
                <h2 className="text-4xl font-black mb-6">
                    {t("blogDetail.posts.pulse-clinical-ai.cta.title")}
                </h2>
                <p className="text-slate-400 text-lg mb-10 leading-relaxed">
                    {t("blogDetail.posts.pulse-clinical-ai.cta.subtitle")}
                </p>
                <Link
                    to={getRegionPath("/contact")}
                    className="inline-block bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-10 py-5 rounded-full text-lg font-black shadow-2xl shadow-indigo-500/40 hover:scale-105 transition-all"
                >
                    {t("blogDetail.posts.pulse-clinical-ai.cta.button")}
                </Link>
            </section>

            <footer className="py-12 border-t border-white/5 text-center text-[10px] font-black uppercase tracking-widest text-slate-600">
                &copy; 2026 Algorythmos Advisory | {t("blogDetail.posts.pulse-clinical-ai.footer")}
            </footer>
        </div>
    );
};

export default PulseContent;
