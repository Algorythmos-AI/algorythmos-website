import React, { useRef } from "react";
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
} from "chart.js";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import { useI18n } from "../../app/i18n/I18nContext";
import { Helmet } from "react-helmet-async";

// Register ChartJS
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    PointElement,
    LineElement,
    ArcElement
);

const ClinicalEvidenceContent = () => {
    const { t, getRegionPath } = useI18n();

    // Brand Colors
    const COLORS = {
        gold: '#F59E0B',    // Legal/High Value
        red: '#EF4444',     // Risk/Harm
        blue: '#3B82F6',    // NHS
        emerald: '#10B981', // Savings/Solutions
        slate: '#64748B',   // Neutral
        dark: '#0F172A'
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: '#1e293b',
                titleColor: '#fff',
                bodyColor: '#cbd5e1',
                padding: 12,
                cornerRadius: 8,
                displayColors: false,
                callbacks: {
                    footer: (tooltipItems) => {
                        const chartData = tooltipItems[0].chart.config.data;
                        return chartData.doi ? chartData.doi : '';
                    }
                }
            }
        },
        scales: {
            x: { grid: { display: false }, ticks: { color: '#94a3b8' } },
            y: { grid: { color: '#334155' }, ticks: { color: '#94a3b8' } }
        }
    };

    // 1. Legal Liability Chart
    const legalData = {
        labels: [t('clinicalEvidence.legal.chart.labels.nsw'), t('clinicalEvidence.legal.chart.labels.act'), t('clinicalEvidence.legal.chart.labels.total')],
        datasets: [{
            label: t('clinicalEvidence.legal.chart.dataset'),
            data: [229.8, 31.5, 261.3],
            backgroundColor: [COLORS.red, COLORS.red, COLORS.gold],
            borderRadius: 6
        }],
        doi: t('clinicalEvidence.legal.chart.doi')
    };

    // 2. Patient Safety Risk Curve (Readmission Odds)
    // Based on Kleinig 2025: OR 1.016 per day delay
    const riskData = {
        labels: [
            t('clinicalEvidence.safety.chart.labels.24h'),
            t('clinicalEvidence.safety.chart.labels.48h'),
            t('clinicalEvidence.safety.chart.labels.72h'),
            t('clinicalEvidence.safety.chart.labels.4d'),
            t('clinicalEvidence.safety.chart.labels.5d')
        ],
        datasets: [{
            label: t('clinicalEvidence.safety.chart.label'),
            data: [1.6, 3.2, 4.8, 6.4, 8.0],
            borderColor: COLORS.red,
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            fill: true,
            tension: 0.4
        }],
        doi: t('clinicalEvidence.safety.chart.doi')
    };

    // 3. Workforce Plan to Cease (RACGP)
    const workforceData = {
        labels: [t('clinicalEvidence.workforce.pie.datasets.leaving'), t('clinicalEvidence.workforce.pie.datasets.staying')],
        datasets: [{
            data: [32, 68],
            backgroundColor: [COLORS.red, '#334155'],
            borderWidth: 0
        }],
        doi: t('clinicalEvidence.workforce.chart.doi')
    };

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-emerald-500/30" >
            <Helmet>
                <title>{t('clinicalEvidence.meta.title')}</title>
                <meta name="description" content={t('clinicalEvidence.meta.description')} />
            </Helmet>

            {/* HERO SECTION */}
            <section className="relative pt-32 pb-20 px-6 overflow-hidden" >
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-500/10 via-black to-black pointer-events-none" />

                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-widest mb-6 animate-fade-in">
                        <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                        {t('clinicalEvidence.hero.badge')}
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
                        {t('clinicalEvidence.hero.title1')} <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-200 to-amber-500">{t('clinicalEvidence.hero.titleHighlight')}</span> <br />
                        <span className="text-3xl md:text-4xl text-white block mt-2 font-bold">{t('clinicalEvidence.hero.title2')}</span>
                    </h1>

                    <p className="text-xl text-gray-400 max-w-3xl mb-12 leading-relaxed border-l-4 border-amber-500 pl-6">
                        {t('clinicalEvidence.hero.subtitle')}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                        {[
                            {
                                title: t('clinicalEvidence.topStats.legal.title'),
                                value: t('clinicalEvidence.topStats.legal.value'),
                                badge: t('clinicalEvidence.topStats.legal.badge'),
                                desc: t('clinicalEvidence.topStats.legal.desc'),
                                border: 'border-amber-500/50',
                                text: 'text-amber-400',
                                badgeBg: 'bg-amber-500/10 text-amber-500'
                            },
                            {
                                title: t('clinicalEvidence.topStats.econ.title'),
                                value: t('clinicalEvidence.topStats.econ.value'),
                                badge: t('clinicalEvidence.topStats.econ.badge'),
                                desc: t('clinicalEvidence.topStats.econ.desc'),
                                border: 'border-emerald-500/50',
                                text: 'text-emerald-400',
                                badgeBg: 'bg-emerald-500/10 text-emerald-500'
                            },
                            {
                                title: t('clinicalEvidence.topStats.safety.title'),
                                value: t('clinicalEvidence.topStats.safety.value'),
                                badge: t('clinicalEvidence.topStats.safety.badge'),
                                desc: t('clinicalEvidence.topStats.safety.desc'),
                                border: 'border-red-500/50',
                                text: 'text-red-400',
                                badgeBg: 'bg-red-500/10 text-red-500'
                            },
                            {
                                title: t('clinicalEvidence.topStats.workforce.title'),
                                value: t('clinicalEvidence.topStats.workforce.value'),
                                badge: t('clinicalEvidence.topStats.workforce.badge'),
                                desc: t('clinicalEvidence.topStats.workforce.desc'),
                                border: 'border-rose-500/50',
                                text: 'text-rose-400',
                                badgeBg: 'bg-rose-500/10 text-rose-500'
                            },
                            {
                                title: t('clinicalEvidence.topStats.eff.title'),
                                value: t('clinicalEvidence.topStats.eff.value'),
                                badge: t('clinicalEvidence.topStats.eff.badge'),
                                desc: t('clinicalEvidence.topStats.eff.desc'),
                                border: 'border-indigo-500/50',
                                text: 'text-indigo-400',
                                badgeBg: 'bg-indigo-500/10 text-indigo-500'
                            }
                        ].map((stat, i) => (
                            <div key={i} className={`p-5 rounded-2xl bg-slate-900/80 border ${stat.border} backdrop-blur-sm relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300`}>
                                <div className={`absolute top-0 right-0 px-2 py-1 text-[10px] font-bold uppercase rounded-bl-lg ${stat.badgeBg}`}>
                                    {stat.badge}
                                </div>
                                <div className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-2 mt-2">{stat.title}</div>
                                <div className={`text-3xl font-black mb-3 ${stat.text}`}>{stat.value}</div>
                                <div className="text-[10px] text-white font-mono whitespace-pre-line leading-tight opacity-90">
                                    {stat.desc}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* KEY DISCOVERIES SECTION */}
            <section className="py-20 px-6 border-t border-white/5 bg-slate-900/40">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center gap-3 mb-10">
                        <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
                        <h2 className="text-sm font-bold text-cyan-400 uppercase tracking-widest">{t('clinicalEvidence.discoveries.title')}</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* 1. Gold Coast Trial */}
                        <div className="p-6 rounded-2xl bg-slate-900 border border-indigo-500/30 hover:border-indigo-500/60 transition-colors group">
                            <div className="mb-4 flex justify-between items-start">
                                <span className="text-indigo-400 text-xs font-bold uppercase tracking-wider border border-indigo-500/20 px-2 py-1 rounded bg-indigo-500/10">{t('clinicalEvidence.discoveries.card1.badge')}</span>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors">{t('clinicalEvidence.discoveries.card1.title')}</h3>
                            <div className="text-3xl font-black text-white mb-2">58% <span className="text-sm font-normal text-gray-400">{t('clinicalEvidence.discoveries.card1.statLabel')}</span></div>
                            <p className="text-sm text-gray-400 leading-relaxed">
                                {t('clinicalEvidence.discoveries.card1.desc')}
                            </p>
                        </div>

                        {/* 2. Referral Rejection */}
                        <div className="p-6 rounded-2xl bg-slate-900 border border-rose-500/30 hover:border-rose-500/60 transition-colors group">
                            <div className="mb-4 flex justify-between items-start">
                                <span className="text-rose-400 text-xs font-bold uppercase tracking-wider border border-rose-500/20 px-2 py-1 rounded bg-rose-500/10">{t('clinicalEvidence.discoveries.card2.badge')}</span>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-rose-300 transition-colors">{t('clinicalEvidence.discoveries.card2.title')}</h3>
                            <div className="text-3xl font-black text-white mb-2">10% <span className="text-sm font-normal text-gray-400">{t('clinicalEvidence.discoveries.card2.statLabel')}</span></div>
                            <p className="text-sm text-gray-400 leading-relaxed">
                                {t('clinicalEvidence.discoveries.card2.desc')}
                            </p>
                        </div>

                        {/* 3. Fax/Post Usage */}
                        <div className="p-6 rounded-2xl bg-slate-900 border border-amber-500/30 hover:border-amber-500/60 transition-colors group">
                            <div className="mb-4 flex justify-between items-start">
                                <span className="text-amber-400 text-xs font-bold uppercase tracking-wider border border-amber-500/20 px-2 py-1 rounded bg-amber-500/10">{t('clinicalEvidence.discoveries.card3.badge')}</span>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-amber-300 transition-colors">{t('clinicalEvidence.discoveries.card3.title')}</h3>
                            <div className="text-3xl font-black text-white mb-2">80% <span className="text-sm font-normal text-gray-400">{t('clinicalEvidence.discoveries.card3.statLabel')}</span></div>
                            <p className="text-sm text-gray-400 leading-relaxed">
                                {t('clinicalEvidence.discoveries.card3.desc')}
                            </p>
                        </div>

                        {/* 4. Documentation Waste */}
                        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-500/30 hover:border-slate-500/60 transition-colors group">
                            <div className="mb-4 flex justify-between items-start">
                                <span className="text-slate-400 text-xs font-bold uppercase tracking-wider border border-slate-500/20 px-2 py-1 rounded bg-slate-500/10">{t('clinicalEvidence.discoveries.card4.badge')}</span>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-slate-300 transition-colors">{t('clinicalEvidence.discoveries.card4.title')}</h3>
                            <div className="text-3xl font-black text-white mb-2">32% <span className="text-sm font-normal text-gray-400">{t('clinicalEvidence.discoveries.card4.statLabel')}</span></div>
                            <p className="text-sm text-gray-400 leading-relaxed">
                                {t('clinicalEvidence.discoveries.card4.desc')}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* EVIDENCE STANDARDS SECTION (WHY UNASSAILABLE) */}
            <section className="py-12 bg-black border-y border-white/5">
                <div className="max-w-7xl mx-auto px-6">
                    <h2 className="text-lg font-bold text-gray-400 uppercase tracking-widest mb-8 text-center">{t('clinicalEvidence.standards.title')}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div>
                            <div className="flex items-center gap-2 mb-2 text-amber-500">
                                <span className="text-xl">⚖️</span>
                                <h3 className="font-bold text-sm uppercase">{t('clinicalEvidence.standards.court.title')}</h3>
                            </div>
                            <p className="text-xs text-gray-500 leading-relaxed">{t('clinicalEvidence.standards.court.desc')}</p>
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-2 text-emerald-500">
                                <span className="text-xl">🎓</span>
                                <h3 className="font-bold text-sm uppercase">{t('clinicalEvidence.standards.academic.title')}</h3>
                            </div>
                            <p className="text-xs text-gray-500 leading-relaxed">{t('clinicalEvidence.standards.academic.desc')}</p>
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-2 text-blue-500">
                                <span className="text-xl">🏛️</span>
                                <h3 className="font-bold text-sm uppercase">{t('clinicalEvidence.standards.govt.title')}</h3>
                            </div>
                            <p className="text-xs text-gray-500 leading-relaxed">{t('clinicalEvidence.standards.govt.desc')}</p>
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-2 text-red-500">
                                <span className="text-xl">🚫</span>
                                <h3 className="font-bold text-sm uppercase">{t('clinicalEvidence.standards.rejected.title')}</h3>
                            </div>
                            <p className="text-xs text-gray-500 leading-relaxed">{t('clinicalEvidence.standards.rejected.desc')}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ROI CASE SECTION (NEW) */}
            <section className="py-20 px-6 bg-slate-900/20">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center gap-3 mb-10">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <h2 className="text-sm font-bold text-emerald-400 uppercase tracking-widest">{t('clinicalEvidence.roi.title')}</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { title: t('clinicalEvidence.roi.card1.title'), sub: t('clinicalEvidence.roi.card1.subtitle'), desc: t('clinicalEvidence.roi.card1.desc'), border: 'border-red-500/20' },
                            { title: t('clinicalEvidence.roi.card2.title'), sub: t('clinicalEvidence.roi.card2.subtitle'), desc: t('clinicalEvidence.roi.card2.desc'), border: 'border-emerald-500/20' },
                            { title: t('clinicalEvidence.roi.card3.title'), sub: t('clinicalEvidence.roi.card3.subtitle'), desc: t('clinicalEvidence.roi.card3.desc'), border: 'border-indigo-500/20' },
                            { title: t('clinicalEvidence.roi.card4.title'), sub: t('clinicalEvidence.roi.card4.subtitle'), desc: t('clinicalEvidence.roi.card4.desc'), border: 'border-amber-500/20', highlight: true }
                        ].map((card, i) => (
                            <div key={i} className={`p-6 bg-slate-900 border ${card.border} rounded-2xl relative overflow-hidden group hover:bg-slate-800 transition-colors`}>
                                <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">{card.sub}</div>
                                <h3 className={`text-xl font-bold text-white mb-4 ${card.highlight ? 'text-amber-400' : ''}`}>{card.title}</h3>
                                <p className="text-sm text-gray-400 leading-relaxed whitespace-pre-line">{card.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ACTION PLAN SECTION (NEW) */}
            <section className="py-20 px-6 bg-slate-900/40 border-t border-white/5">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-black mb-4">{t('clinicalEvidence.actions.title')}</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="p-8 rounded-3xl bg-gradient-to-br from-indigo-500/10 to-indigo-600/5 border border-indigo-500/20 text-center">
                            <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center mx-auto mb-6 text-2xl">🤖</div>
                            <h3 className="text-xl font-bold text-white mb-4">{t('clinicalEvidence.actions.action1.title')}</h3>
                            <p className="text-sm text-gray-300 mb-2 font-medium">{t('clinicalEvidence.actions.action1.evidence')}</p>
                            <p className="text-xs text-indigo-400 font-bold uppercase tracking-wider">{t('clinicalEvidence.actions.action1.next')}</p>
                        </div>

                        <div className="p-8 rounded-3xl bg-gradient-to-br from-cyan-500/10 to-cyan-600/5 border border-cyan-500/20 text-center">
                            <div className="w-12 h-12 rounded-full bg-cyan-500/20 flex items-center justify-center mx-auto mb-6 text-2xl">🔗</div>
                            <h3 className="text-xl font-bold text-white mb-4">{t('clinicalEvidence.actions.action2.title')}</h3>
                            <p className="text-sm text-gray-300 mb-2 font-medium">{t('clinicalEvidence.actions.action2.evidence')}</p>
                            <p className="text-xs text-cyan-400 font-bold uppercase tracking-wider">{t('clinicalEvidence.actions.action2.next')}</p>
                        </div>

                        <div className="p-8 rounded-3xl bg-gradient-to-br from-rose-500/10 to-rose-600/5 border border-rose-500/20 text-center">
                            <div className="w-12 h-12 rounded-full bg-rose-500/20 flex items-center justify-center mx-auto mb-6 text-2xl">❤️</div>
                            <h3 className="text-xl font-bold text-white mb-4">{t('clinicalEvidence.actions.action3.title')}</h3>
                            <p className="text-sm text-gray-300 mb-2 font-medium">{t('clinicalEvidence.actions.action3.evidence')}</p>
                            <p className="text-xs text-rose-400 font-bold uppercase tracking-wider">{t('clinicalEvidence.actions.action3.next')}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Q&A SECTION (CHALLENGE RESPONSES) */}
            <section className="py-20 px-6 border-t border-white/5 bg-slate-900/20">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-black mb-4">{t('clinicalEvidence.qna.title')}</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="p-6 rounded-2xl bg-slate-900 border border-white/5 hover:border-white/10 transition-colors">
                            <h3 className="text-lg font-bold text-white mb-3 flex items-start gap-3">
                                <span className="text-amber-500 mt-1">❓</span>
                                {t('clinicalEvidence.qna.q1.question')}
                            </h3>
                            <p className="text-sm text-gray-400 leading-relaxed pl-8 border-l-2 border-amber-500/20">
                                {t('clinicalEvidence.qna.q1.answer')}
                            </p>
                        </div>

                        <div className="p-6 rounded-2xl bg-slate-900 border border-white/5 hover:border-white/10 transition-colors">
                            <h3 className="text-lg font-bold text-white mb-3 flex items-start gap-3">
                                <span className="text-emerald-500 mt-1">❓</span>
                                {t('clinicalEvidence.qna.q2.question')}
                            </h3>
                            <p className="text-sm text-gray-400 leading-relaxed pl-8 border-l-2 border-emerald-500/20">
                                {t('clinicalEvidence.qna.q2.answer')}
                            </p>
                        </div>

                        <div className="p-6 rounded-2xl bg-slate-900 border border-white/5 hover:border-white/10 transition-colors">
                            <h3 className="text-lg font-bold text-white mb-3 flex items-start gap-3">
                                <span className="text-rose-500 mt-1">❓</span>
                                {t('clinicalEvidence.qna.q3.question')}
                            </h3>
                            <p className="text-sm text-gray-400 leading-relaxed pl-8 border-l-2 border-rose-500/20">
                                {t('clinicalEvidence.qna.q3.answer')}
                            </p>
                        </div>

                        <div className="p-6 rounded-2xl bg-slate-900 border border-white/5 hover:border-white/10 transition-colors">
                            <h3 className="text-lg font-bold text-white mb-3 flex items-start gap-3">
                                <span className="text-cyan-500 mt-1">❓</span>
                                {t('clinicalEvidence.qna.q4.question')}
                            </h3>
                            <p className="text-sm text-gray-400 leading-relaxed pl-8 border-l-2 border-cyan-500/20">
                                {t('clinicalEvidence.qna.q4.answer')}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* PRESENTATION GUIDE & DOWNLOADS */}
            <section className="py-20 px-6 bg-gradient-to-b from-slate-900 to-black border-y border-white/10">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-widest mb-4">
                            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                            Guide
                        </div>
                        <h2 className="text-3xl font-black text-white">{t('clinicalEvidence.presentation.title')}</h2>
                    </div>

                    <div className="space-y-6 mb-16">
                        <div className="p-6 rounded-xl bg-white/5 border border-white/5 flex flex-col md:flex-row gap-6 items-start">
                            <div className="w-32 shrink-0 py-1 px-3 rounded bg-amber-500/20 text-amber-500 text-xs font-bold uppercase text-center border border-amber-500/20">
                                {t('clinicalEvidence.presentation.opening.label')}
                            </div>
                            <p className="text-lg text-white font-medium italic opacity-90">
                                {t('clinicalEvidence.presentation.opening.text')}
                            </p>
                        </div>

                        <div className="p-6 rounded-xl bg-white/5 border border-white/5 flex flex-col md:flex-row gap-6 items-start">
                            <div className="w-32 shrink-0 py-1 px-3 rounded bg-rose-500/20 text-rose-500 text-xs font-bold uppercase text-center border border-rose-500/20">
                                {t('clinicalEvidence.presentation.problem.label')}
                            </div>
                            <p className="text-lg text-white font-medium italic opacity-90">
                                {t('clinicalEvidence.presentation.problem.text')}
                            </p>
                        </div>

                        <div className="p-6 rounded-xl bg-white/5 border border-white/5 flex flex-col md:flex-row gap-6 items-start">
                            <div className="w-32 shrink-0 py-1 px-3 rounded bg-emerald-500/20 text-emerald-500 text-xs font-bold uppercase text-center border border-emerald-500/20">
                                {t('clinicalEvidence.presentation.solution.label')}
                            </div>
                            <p className="text-lg text-white font-medium italic opacity-90">
                                {t('clinicalEvidence.presentation.solution.text')}
                            </p>
                        </div>

                        <div className="p-6 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex flex-col md:flex-row gap-6 items-start">
                            <div className="w-32 shrink-0 py-1 px-3 rounded bg-indigo-500 text-white text-xs font-bold uppercase text-center border border-indigo-400">
                                {t('clinicalEvidence.presentation.cta.label')}
                            </div>
                            <p className="text-lg text-white font-bold italic">
                                {t('clinicalEvidence.presentation.cta.text')}
                            </p>
                        </div>
                    </div>

                    {/* DOWNLOAD OPTIONS */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-white/10 pt-12">
                        <button className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all group flex items-center justify-center gap-3">
                            <span className="p-2 rounded-lg bg-blue-500/20 text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors">📄</span>
                            <span className="text-sm font-bold text-gray-300 group-hover:text-white">{t('clinicalEvidence.download.report')}</span>
                        </button>
                        <button className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all group flex items-center justify-center gap-3">
                            <span className="p-2 rounded-lg bg-orange-500/20 text-orange-400 group-hover:bg-orange-500 group-hover:text-white transition-colors">📊</span>
                            <span className="text-sm font-bold text-gray-300 group-hover:text-white">{t('clinicalEvidence.download.slides')}</span>
                        </button>
                        <button className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all group flex items-center justify-center gap-3">
                            <span className="p-2 rounded-lg bg-red-500/20 text-red-400 group-hover:bg-red-500 group-hover:text-white transition-colors">📑</span>
                            <span className="text-sm font-bold text-gray-300 group-hover:text-white">{t('clinicalEvidence.download.summary')}</span>
                        </button>
                    </div>
                </div>
            </section>

            {/* SECTION 1: LEGAL LIABILITY */}
            < section className="py-20 px-6 border-t border-white/5 bg-slate-900/20" >
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                            <span className="text-amber-500">⚖️</span>
                            {t('clinicalEvidence.legal.title')}
                        </h2>
                        <div className="space-y-8">
                            <div className="p-6 rounded-2xl bg-amber-950/20 border border-amber-500/20 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-50 text-amber-500">
                                    <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">{t('clinicalEvidence.legal.nsw.title')}</h3>
                                <div className="text-4xl font-black text-amber-400 mb-2">$229,800,000</div>
                                <p className="text-sm text-gray-300 mb-4 font-mono whitespace-pre-line">
                                    {t('clinicalEvidence.legal.nsw.meta')}
                                </p>
                                <p className="text-sm text-gray-400">
                                    {t('clinicalEvidence.legal.nsw.desc')}
                                </p>
                            </div>

                            <div className="p-6 rounded-2xl bg-slate-800/50 border border-white/10">
                                <h3 className="text-xl font-bold text-white mb-2">{t('clinicalEvidence.legal.act.title')}</h3>
                                <div className="text-3xl font-black text-white mb-2">$31,500,000</div>
                                <p className="text-sm text-gray-400 mb-4 font-mono whitespace-pre-line">
                                    {t('clinicalEvidence.legal.act.meta')}
                                </p>
                                <p className="text-sm text-gray-400">
                                    {t('clinicalEvidence.legal.act.desc')}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="h-[400px] bg-slate-900/50 p-6 rounded-3xl border border-white/5">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">{t('clinicalEvidence.legal.chart.title')}</h3>
                            <span className="text-xs text-amber-500 font-mono bg-amber-500/10 px-2 py-1 rounded">{t('clinicalEvidence.legal.chart.badge')}</span>
                        </div>
                        <Bar data={legalData} options={chartOptions} />
                    </div>
                </div>
            </section >

            {/* SECTION 2: ECONOMIC & SAFETY */}
            < section className="py-20 px-6 border-t border-white/5" >
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* PC Report */}
                    <div className="lg:col-span-1 p-8 rounded-3xl bg-emerald-900/10 border border-emerald-500/20">
                        <h3 className="text-emerald-400 font-bold uppercase tracking-widest text-xs mb-4">{t('clinicalEvidence.economic.title')}</h3>
                        <div className="text-5xl font-black text-white mb-2">$5.4 Billion</div>
                        <p className="text-lg text-emerald-200 mb-6">{t('clinicalEvidence.economic.subtitle')}</p>

                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <span className="text-emerald-500 mt-1">✓</span>
                                <p className="text-sm text-gray-400"><strong>{t('clinicalEvidence.economic.points.0.label')}</strong> {t('clinicalEvidence.economic.points.0.value')}</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="text-emerald-500 mt-1">✓</span>
                                <p className="text-sm text-gray-400"><strong>{t('clinicalEvidence.economic.points.1.label')}</strong> {t('clinicalEvidence.economic.points.1.value')}</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="text-emerald-500 mt-1">✓</span>
                                <p className="text-sm text-gray-400"><strong>{t('clinicalEvidence.economic.points.2.label')}</strong> {t('clinicalEvidence.economic.points.2.value')}</p>
                            </div>
                        </div>
                    </div>

                    {/* Patient Safety */}
                    <div className="lg:col-span-2 p-8 rounded-3xl bg-slate-900/50 border border-white/10">
                        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">
                            <div>
                                <h3 className="text-red-400 font-bold uppercase tracking-widest text-xs mb-1">{t('clinicalEvidence.safety.badge')}</h3>
                                <h2 className="text-2xl font-bold text-white">{t('clinicalEvidence.safety.title')}</h2>
                            </div>
                            <div className="text-right">
                                <div className="text-3xl font-black text-white">37.6%</div>
                                <div className="text-xs text-gray-400">{t('clinicalEvidence.safety.statLabel')}</div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="h-64">
                                <Line
                                    data={riskData}
                                    options={{
                                        ...chartOptions,
                                        scales: {
                                            y: { title: { display: true, text: t('clinicalEvidence.safety.chart.options.y') } }
                                        }
                                    }}
                                />
                            </div>
                            <div className="space-y-4 text-sm text-gray-300">
                                <p>
                                    <strong className="text-white block mb-1">{t('clinicalEvidence.safety.points.0.strong')}</strong>
                                    {t('clinicalEvidence.safety.points.0.desc')}
                                </p>
                                <p>
                                    <strong className="text-white block mb-1">{t('clinicalEvidence.safety.points.1.strong')}</strong>
                                    {t('clinicalEvidence.safety.points.1.desc')}
                                </p>
                                <div className="p-4 bg-slate-800 rounded-xl border border-white/5 mt-4">
                                    <div className="flex justify-between mb-2">
                                        <span>{t('clinicalEvidence.safety.bar.label')}</span>
                                        <span className="font-bold text-white">14.5 mins</span>
                                    </div>
                                    <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                                        <div className="bg-blue-500 h-full w-[40%]"></div>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2">{t('clinicalEvidence.safety.bar.sub')}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section >

            {/* SECTION 3: THEORETICAL FRAMEWORKS */}
            < section className="py-20 px-6 border-t border-white/5" >
                <div className="max-w-7xl mx-auto">
                    <div className="mb-12">
                        <h2 className="text-3xl font-bold text-white mb-4">{t('clinicalEvidence.theory.title')}</h2>
                        <p className="text-gray-400 max-w-3xl">
                            {t('clinicalEvidence.theory.desc')}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* COGNITIVE LOAD THEORY */}
                        <div className="p-8 rounded-3xl bg-slate-900/50 border border-indigo-500/20">
                            <h3 className="text-indigo-400 font-bold uppercase tracking-widest text-xs mb-1">{t('clinicalEvidence.theory.cognitive.badge')}</h3>
                            <h2 className="text-2xl font-bold text-white mb-6">{t('clinicalEvidence.theory.cognitive.title')}</h2>

                            <div className="h-64 mb-6">
                                <Bar
                                    data={{
                                        labels: [t('clinicalEvidence.theory.cognitive.labels.optimal'), t('clinicalEvidence.theory.cognitive.labels.current')],
                                        datasets: [
                                            {
                                                label: t('clinicalEvidence.theory.cognitive.datasets.intrinsic'),
                                                data: [60, 60],
                                                backgroundColor: COLORS.blue,
                                                stack: 'Stack 0',
                                            },
                                            {
                                                label: t('clinicalEvidence.theory.cognitive.datasets.germane'),
                                                data: [30, 10],
                                                backgroundColor: COLORS.emerald,
                                                stack: 'Stack 0',
                                            },
                                            {
                                                label: t('clinicalEvidence.theory.cognitive.datasets.extrinsic'),
                                                data: [10, 80],
                                                backgroundColor: COLORS.red,
                                                stack: 'Stack 0',
                                            },
                                        ]
                                    }}
                                    options={{
                                        ...chartOptions,
                                        scales: {
                                            x: { stacked: true, grid: { display: false }, ticks: { color: '#94a3b8' } },
                                            y: {
                                                stacked: true,
                                                grid: { color: '#334155' },
                                                ticks: { display: false },
                                                max: 150, // Visual space for "Overload"
                                                title: { display: true, text: t('clinicalEvidence.theory.cognitive.chart.y') }
                                            }
                                        },
                                        plugins: {
                                            ...chartOptions.plugins,
                                            tooltip: {
                                                callbacks: {
                                                    footer: () => t('clinicalEvidence.theory.cognitive.chart.doi')
                                                }
                                            },
                                            annotation: {
                                                annotations: {
                                                    line1: {
                                                        type: 'line',
                                                        yMin: 100,
                                                        yMax: 100,
                                                        borderColor: 'rgba(255, 255, 255, 0.5)',
                                                        borderWidth: 2,
                                                        borderDash: [6, 6],
                                                        label: {
                                                            content: t('clinicalEvidence.theory.cognitive.annotation'),
                                                            enabled: true,
                                                            position: 'end'
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }}
                                />
                            </div>

                            <div className="space-y-4 text-sm text-gray-300">
                                <p>
                                    <strong>{t('clinicalEvidence.theory.cognitive.splitAttention.strong')}</strong> {t('clinicalEvidence.theory.cognitive.splitAttention.desc')}
                                </p>
                                <p>
                                    <strong>{t('clinicalEvidence.theory.cognitive.result.strong')}</strong> {t('clinicalEvidence.theory.cognitive.result.desc')}
                                </p>
                            </div>
                        </div>

                        {/* MORAL INJURY */}
                        <div className="p-8 rounded-3xl bg-slate-900/50 border border-orange-500/20">
                            <h3 className="text-orange-400 font-bold uppercase tracking-widest text-xs mb-1">{t('clinicalEvidence.theory.moral.badge')}</h3>
                            <h2 className="text-2xl font-bold text-white mb-6">{t('clinicalEvidence.theory.moral.title')}</h2>

                            <div className="h-64 mb-6">
                                <Line
                                    data={{
                                        labels: [t('clinicalEvidence.theory.moral.labels.y1'), t('clinicalEvidence.theory.moral.labels.y3'), t('clinicalEvidence.theory.moral.labels.y5')],
                                        datasets: [
                                            {
                                                label: t('clinicalEvidence.theory.moral.datasets.values'),
                                                data: [90, 90, 90],
                                                borderColor: COLORS.emerald,
                                                borderDash: [5, 5],
                                                tension: 0,
                                            },
                                            {
                                                label: t('clinicalEvidence.theory.moral.datasets.reality'),
                                                data: [70, 50, 30],
                                                borderColor: COLORS.red,
                                                backgroundColor: 'rgba(239, 68, 68, 0.05)',
                                                fill: true,
                                                tension: 0.4
                                            }
                                        ]
                                    }}
                                    options={{
                                        ...chartOptions,
                                        scales: {
                                            y: {
                                                min: 0, max: 100,
                                                grid: { color: '#334155' },
                                                title: { display: true, text: t('clinicalEvidence.theory.moral.chart.y') }
                                            }
                                        },
                                        plugins: {
                                            tooltip: {
                                                callbacks: {
                                                    footer: () => t('clinicalEvidence.theory.moral.chart.doi')
                                                }
                                            }
                                        }
                                    }}
                                />
                            </div>

                            <div className="space-y-4 text-sm text-gray-300">
                                <p>
                                    <strong>{t('clinicalEvidence.theory.moral.doubleBind.strong')}</strong> {t('clinicalEvidence.theory.moral.doubleBind.desc')}
                                </p>
                                <p>
                                    <strong>{t('clinicalEvidence.theory.moral.burnout.strong')}</strong> {t('clinicalEvidence.theory.moral.burnout.desc')}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section >

            {/* SECTION 4: WORKFORCE & SOLUTIONS */}
            < section className="py-20 px-6 border-t border-white/5 bg-slate-900/20" >
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">

                    {/* Workforce Crisis */}
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-6">{t('clinicalEvidence.workforce.title')}</h2>
                        <div className="bg-slate-900 p-8 rounded-3xl border border-red-500/20 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-3 bg-red-500/10 rounded-bl-2xl border-l border-b border-red-500/20 text-red-400 text-xs font-bold">
                                {t('clinicalEvidence.workforce.badge')}
                            </div>

                            <div className="flex gap-8 items-center mb-8">
                                <div className="h-32 w-32 relative">
                                    <Doughnut
                                        data={workforceData}
                                        options={{
                                            cutout: '70%',
                                            plugins: {
                                                legend: { display: false },
                                                tooltip: {
                                                    callbacks: {
                                                        footer: (tooltipItems) => {
                                                            const chartData = tooltipItems[0].chart.config.data;
                                                            return chartData.doi ? chartData.doi : '';
                                                        }
                                                    }
                                                }
                                            }
                                        }}
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-2xl font-black text-white">32%</span>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white">{t('clinicalEvidence.workforce.pie.title')}</h3>
                                    <p className="text-sm text-gray-400 mb-2">{t('clinicalEvidence.workforce.pie.sub')}</p>
                                    <p className="text-xs text-red-300">
                                        {t('clinicalEvidence.workforce.pie.detail')}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between text-sm p-3 bg-slate-800 rounded-lg">
                                    <span className="text-gray-400">{t('clinicalEvidence.workforce.stats.burnout')}</span>
                                    <span className="font-bold text-white">{t('clinicalEvidence.workforce.stats.burnoutValue')}</span>
                                </div>
                                <div className="flex justify-between text-sm p-3 bg-slate-800 rounded-lg">
                                    <span className="text-gray-400">{t('clinicalEvidence.workforce.stats.unpaid')}</span>
                                    <span className="font-bold text-white">{t('clinicalEvidence.workforce.stats.unpaidValue')}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Solutions */}
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-6">{t('clinicalEvidence.solutions.title')}</h2>
                        <div className="space-y-6">
                            {/* Gold Coast */}
                            <div className="group p-6 rounded-2xl bg-gradient-to-br from-indigo-900/30 to-slate-900 border border-indigo-500/20 hover:border-indigo-500/50 transition-all">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="font-bold text-indigo-300">{t('clinicalEvidence.solutions.ambient.title')}</h3>
                                    <span className="bg-indigo-500 text-white text-[10px] px-2 py-0.5 rounded font-bold">JAN 2026</span>
                                </div>
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <div className="text-2xl font-black text-white">58%</div>
                                        <div className="text-xs text-gray-400">{t('clinicalEvidence.solutions.ambient.stat1.label')}</div>
                                    </div>
                                    <div>
                                        <div className="text-2xl font-black text-white">100+</div>
                                        <div className="text-xs text-gray-400">{t('clinicalEvidence.solutions.ambient.stat2.label')}</div>
                                    </div>
                                </div>
                                <p className="text-xs text-indigo-200/60">
                                    <strong>{t('clinicalEvidence.solutions.ambient.governance.strong')}</strong> {t('clinicalEvidence.solutions.ambient.governance.desc')}
                                </p>
                            </div>

                            {/* Digital vs Paper */}
                            <div className="p-6 rounded-2xl bg-slate-800/50 border border-white/5">
                                <h3 className="font-bold text-white mb-4">{t('clinicalEvidence.solutions.digital.title')}</h3>
                                <div className="w-full h-12 flex rounded-lg overflow-hidden mb-2">
                                    <div className="bg-emerald-500 h-full flex items-center justify-center font-bold text-white text-sm" style={{ width: '29%' }}>
                                        {t('clinicalEvidence.solutions.digital.label1')}
                                    </div>
                                    <div className="bg-slate-700 h-full flex items-center justify-center font-bold text-gray-400 text-sm" style={{ width: '71%' }}>
                                        {t('clinicalEvidence.solutions.digital.label2')}
                                    </div>
                                </div>
                                <p className="text-xs text-gray-500">
                                    {t('clinicalEvidence.solutions.digital.footer')}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section >

            {/* CTA */}
            < section className="py-20 text-center px-6" >
                <h2 className="text-3xl font-black mb-6">{t('clinicalEvidence.cta.title')}</h2>
                <div className="max-w-4xl mx-auto mb-10 text-left space-y-4">
                    <p className="text-gray-300 leading-relaxed border-l-4 border-amber-500 pl-4 bg-slate-900/50 p-4 rounded-r-xl">
                        {t('clinicalEvidence.cta.p1')}
                    </p>
                    <p className="text-gray-400 leading-relaxed">
                        {t('clinicalEvidence.cta.p2')}
                    </p>
                    <p className="text-gray-400 leading-relaxed">
                        {t('clinicalEvidence.cta.p3')}
                    </p>
                    <p className="text-white text-lg font-bold leading-relaxed text-center pt-4">
                        {t('clinicalEvidence.cta.p4')}
                    </p>
                </div>
                <Link to={getRegionPath("/contact")} className="inline-flex items-center gap-3 px-8 py-4 bg-amber-500 text-black font-black uppercase text-sm tracking-widest rounded-full hover:bg-amber-400 transition-colors">
                    <span>{t('clinicalEvidence.cta.button')}</span>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </Link>
            </section >

            {/* METHODOLOGY FOOTER */}
            < footer className="py-12 border-t border-white/10 bg-black text-gray-600 text-[10px] leading-relaxed" >
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <strong className="block text-gray-500 uppercase tracking-widest mb-2">{t('clinicalEvidence.footer.methodology.title')}</strong>
                        <p className="mb-2">
                            {t('clinicalEvidence.footer.methodology.desc')}
                        </p>
                        <ul className="space-y-1">
                            <li>• <strong>Legal:</strong> [2024] NSWSC 1171; VID705/2022.</li>
                            <li>• <strong>Safety:</strong> Kleinig et al. (2025) DOI: 10.1111/imj.70150.</li>
                            <li>• <strong>Workforce:</strong> RACGP Health of the Nation 2024; Commonwealth Fund 2025.</li>
                            <li>• <strong>Economic:</strong> Productivity Commission "Leveraging digital technology in healthcare" (2024).</li>
                        </ul>
                    </div>
                    <div className="text-right">
                        <strong className="block text-gray-500 uppercase tracking-widest mb-2">{t('clinicalEvidence.footer.verification.title')}</strong>
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-900/20 border border-emerald-500/20 rounded text-emerald-500 font-mono mb-2">
                            {t('clinicalEvidence.footer.verification.badge')}
                        </div>
                        <p>{t('clinicalEvidence.footer.verification.updated')}</p>
                    </div>
                </div>
            </footer >
        </div >
    );
};

export default ClinicalEvidenceContent;
