import React, { useEffect, useRef } from "react";
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
    Filler,
    RadialLinearScale
} from "chart.js";
import { Bar, Doughnut, Line, PolarArea } from "react-chartjs-2";
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
    Filler,
    RadialLinearScale
);

// Brand colors matching the design system
const COLORS = {
    violet: '#6D00FF',
    blue: '#3715E0',
    deep: '#7658E7',
    cyan: '#06b6d4',
    magenta: '#d946ef',
    rose: '#f43f5e',
    success: '#10b981',
    spaceBase: '#050511',
    spaceCard: '#0f0f23',
    spaceBorder: '#2a2a4a'
};

const HealthcareBurdenContent = () => {
    const { t, getRegionPath } = useI18n();

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { 
                display: false
            },
            tooltip: {
                backgroundColor: COLORS.spaceCard,
                titleColor: "#fff",
                bodyColor: "#e2e8f0",
                borderColor: COLORS.spaceBorder,
                borderWidth: 1,
                padding: 12,
                cornerRadius: 8
            },
        },
        scales: {
            x: { 
                grid: { color: COLORS.spaceBorder }, 
                ticks: { color: "#64748b", font: { size: 10 } } 
            },
            y: { 
                grid: { color: COLORS.spaceBorder }, 
                ticks: { color: "#64748b", font: { size: 10 } } 
            },
        },
    };

    // Time Distribution Chart
    const timeDistData = {
        labels: ['Direct Care', 'Documentation', 'Other'],
        datasets: [{
            data: [27.5, 26.6, 45.9],
            backgroundColor: [COLORS.cyan, COLORS.violet, 'rgba(255,255,255,0.05)'],
            borderColor: [COLORS.cyan, COLORS.violet, 'transparent'],
            borderWidth: 1,
            hoverOffset: 12
        }]
    };

    // GP Impact Chart
    const gpImpactData = {
        labels: ['Reduced Appt Slots', 'Limited Patient Time', 'Reduced Work Hours'],
        datasets: [{
            label: '% of GPs',
            data: [66, 60, 51],
            backgroundColor: `linear-gradient(90deg, ${COLORS.rose}, ${COLORS.magenta})`,
            borderRadius: 6,
            barPercentage: 0.6
        }]
    };

    // Patient Volume Chart
    const patientVolumeData = {
        labels: ['>150 Patients (Overload)', 'Standard Load'],
        datasets: [{
            data: [27, 73],
            backgroundColor: [COLORS.magenta, 'rgba(255, 255, 255, 0.05)'],
            borderColor: [COLORS.magenta, 'transparent'],
            borderWidth: 1
        }]
    };

    // Burnout Chart
    const burnoutData = {
        labels: ['Total GP Burnout', 'Admin-Driven'],
        datasets: [{
            label: 'Rate %',
            data: [32, 21],
            backgroundColor: [COLORS.rose, COLORS.magenta],
            borderRadius: 6,
            barPercentage: 0.6
        }]
    };

    // Nursing Turnaround
    const nursingTurnaroundData = {
        labels: ['Paper Process', 'EMR System'],
        datasets: [{
            label: 'Minutes',
            data: [120, 35],
            backgroundColor: [COLORS.rose, COLORS.success],
            borderRadius: 4,
            barPercentage: 0.6
        }]
    };

    // Information Retention
    const retentionData = {
        labels: ['Verbal Only', 'Verbal + Notes', 'Printed Handout'],
        datasets: [{
            label: 'Retention Rate %',
            data: [2.5, 85.5, 99],
            backgroundColor: [COLORS.rose, '#f59e0b', COLORS.success],
            borderRadius: 8,
            barPercentage: 0.6
        }]
    };

    // Admin Pain Points
    const adminPainData = {
        labels: ['Chasing Results', 'Referrals', 'Time-Critical Tasks'],
        datasets: [{
            label: 'Pain Intensity',
            data: [90, 85, 88],
            backgroundColor: [
                'rgba(109, 0, 255, 0.7)',
                'rgba(55, 21, 224, 0.7)',
                'rgba(217, 70, 239, 0.7)'
            ],
            borderColor: COLORS.spaceCard,
            borderWidth: 2
        }]
    };

    // Satisfaction Chart
    const satisfactionData = {
        labels: ['Salaried (ACCHO)', 'Private Practice'],
        datasets: [{
            label: 'Job Satisfaction %',
            data: [88, 58],
            backgroundColor: [COLORS.success, COLORS.rose],
            borderRadius: 6,
            barPercentage: 0.5
        }]
    };

    return (
        <div className="font-sans text-white min-h-screen">
            {/* Hero Section */}
            <section className="py-12 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(at_0%_0%,rgba(109,0,255,0.15)_0px,transparent_50%),radial-gradient(at_100%_0%,rgba(55,21,224,0.1)_0px,transparent_50%)] pointer-events-none" />
                
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    {/* Badge */}
                    <div className="inline-block px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-400 font-bold text-xs uppercase tracking-widest mb-6">
                        2024-2025 Analysis • Australia Strategic Review
                    </div>
                    
                    <h1 className="text-4xl lg:text-5xl font-black mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                        Healthcare Documentation Burden Analysis
                    </h1>
                    <p className="text-xl text-gray-400 max-w-3xl mb-8">
                        A comprehensive analysis of the "Digital Disconnect" in Australian healthcare—where clinical care competes with administrative friction.
                    </p>
                </div>
            </section>

            {/* Strategic Overview */}
            <section className="py-12 max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* The Care Paradox */}
                    <div className="bg-gradient-to-br from-blue-600 to-violet-600 rounded-3xl p-8 relative overflow-hidden shadow-[0_0_30px_rgba(55,21,224,0.3)]">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 blur-3xl rounded-full -mr-16 -mt-16" />
                        
                        <h2 className="text-3xl font-bold mb-2 text-white">The Care Paradox</h2>
                        <p className="text-white/90 text-sm mb-6">A System Divided: Clinical Care vs. Administrative Friction</p>
                        
                        <div className="h-64 bg-black/20 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                            <Doughnut 
                                data={timeDistData} 
                                options={{ 
                                    ...chartOptions, 
                                    cutout: '65%',
                                    plugins: { legend: { display: false } }
                                }} 
                            />
                        </div>
                        
                        <div className="flex justify-center gap-4 mt-4 text-xs font-semibold">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_5px_#06b6d4]" />
                                Patient Care (27.5%)
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-violet-500 shadow-[0_0_5px_#6D00FF]" />
                                Documentation (26.6%)
                            </div>
                        </div>
                        
                        <div className="mt-6 pt-4 border-t border-white/10 text-xs text-white/80 leading-relaxed">
                            <strong className="text-cyan-400">Strategic Insight:</strong> The data reveals a near 1:1 ratio, meaning highly trained clinicians spend effectively half their productive time on clerical duties. This "Digital Disconnect" is a structural inefficiency costing billions.
                        </div>
                    </div>

                    {/* Administrative Work Pain Points */}
                    <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 relative overflow-hidden">
                        <div className="flex items-start gap-4 mb-6">
                            <div className="p-3 bg-violet-500/20 text-violet-400 border border-violet-500/50 rounded-xl shadow-[0_0_15px_rgba(109,0,255,0.3)]">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white">Administrative Work</h3>
                                <p className="text-gray-400 mt-1">Identified as the <span className="font-bold text-violet-400">biggest pain point</span> for Australian doctors.</p>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                {[
                                    { icon: '🔍', title: 'Chasing Results', desc: 'Tracking missing data' },
                                    { icon: '🔗', title: 'Referrals', desc: 'Coordinating specialist care' },
                                    { icon: '⏰', title: 'Time-Critical Tasks', desc: 'Managing urgent follow-ups' }
                                ].map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-4 p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-violet-500/50 transition-colors group">
                                        <div className="h-10 w-10 rounded-lg bg-violet-500/10 flex items-center justify-center text-lg group-hover:bg-violet-500 group-hover:scale-110 transition-all">
                                            {item.icon}
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-white">{item.title}</h4>
                                            <p className="text-xs text-gray-500">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="h-56 relative flex items-center justify-center">
                                <PolarArea 
                                    data={adminPainData} 
                                    options={{ 
                                        ...chartOptions,
                                        scales: { r: { ticks: { display: false }, grid: { color: COLORS.spaceBorder }, pointLabels: { display: false } } }
                                    }} 
                                />
                            </div>
                        </div>
                        
                        <div className="mt-4 pt-4 border-t border-slate-700 text-xs text-gray-400 text-center">
                            <strong>The "Template Mess":</strong> GPs navigate a labyrinth of incompatible forms, often manually transcribing data because software silos don't speak the same language.
                        </div>
                    </div>
                </div>
            </section>

            {/* GP Burden Section */}
            <section className="py-12 max-w-7xl mx-auto px-6">
                <div className="flex items-center gap-3 mb-8">
                    <div className="h-8 w-1 bg-gradient-to-b from-violet-500 to-blue-500 rounded-full shadow-[0_0_10px_#6D00FF]" />
                    <h2 className="text-2xl font-bold text-white">Burden on General Practitioners</h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Operational Impact */}
                    <div className="lg:col-span-2 bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 hover:border-violet-500/30 transition-all">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h4 className="font-bold text-white">Operational Impact</h4>
                                <p className="text-sm text-gray-400">Practice changes due to burden</p>
                            </div>
                            <div className="p-2 bg-rose-500/20 rounded-lg text-rose-500">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                        </div>
                        <div className="h-64">
                            <Bar 
                                data={{
                                    labels: ['Reduced Appt Slots', 'Limited Patient Time', 'Reduced Work Hours'],
                                    datasets: [{
                                        label: '% of GPs',
                                        data: [66, 60, 51],
                                        backgroundColor: [COLORS.rose, COLORS.magenta, COLORS.violet],
                                        borderRadius: 6,
                                        barPercentage: 0.6
                                    }]
                                }} 
                                options={{ ...chartOptions, indexAxis: 'y', scales: { x: { ...chartOptions.scales.x, max: 100 } } }} 
                            />
                        </div>
                        <div className="mt-4 pt-3 border-t border-slate-700 text-xs text-gray-400">
                            <strong className="text-rose-500">Access Restriction:</strong> To cope with administrative overload, 66% of GPs are reducing appointment availability, directly restricting patient access to primary care.
                        </div>
                    </div>

                    {/* Patient Volume */}
                    <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 hover:border-violet-500/30 transition-all">
                        <h4 className="font-bold text-white mb-2 text-center">Patient Volume Intensity</h4>
                        <div className="h-48 mb-4">
                            <Doughnut 
                                data={patientVolumeData} 
                                options={{ ...chartOptions, cutout: '70%' }} 
                            />
                        </div>
                        <div className="text-center mb-4">
                            <p className="text-3xl font-extrabold text-white">27%</p>
                            <p className="text-xs text-magenta-500 font-semibold uppercase tracking-wider" style={{ color: COLORS.magenta }}>Overloaded (&gt;150 pts)</p>
                        </div>
                        <div className="pt-3 border-t border-slate-700 text-xs text-gray-400 text-center">
                            <strong className="text-white">High Volume Risk:</strong> 27% of Australian GPs see &gt;150 patients/week to maintain viability.
                        </div>
                    </div>
                </div>

                {/* Financial Impact Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                    {/* Annual Cost */}
                    <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 flex flex-col md:flex-row gap-8 items-center hover:border-violet-500/30 transition-all">
                        <div className="flex-1 w-full">
                            <h4 className="font-bold text-white mb-6">Annual Financial & Time Loss</h4>
                            <div className="mb-8">
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-gray-300">🕐 Lost Clinical Hours</span>
                                    <span className="text-rose-500 font-bold">621 Hours / Year</span>
                                </div>
                                <div className="w-full bg-slate-800 rounded-full h-4 border border-slate-700 relative overflow-hidden">
                                    <div className="bg-gradient-to-r from-rose-500 to-magenta-500 h-full rounded-full shadow-[0_0_15px_#f43f5e]" style={{ width: '35%' }} />
                                </div>
                                <p className="text-xs text-gray-500 mt-2">Equivalent to ~15.5 standard work weeks lost annually per practitioner.</p>
                            </div>
                            <div>
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-gray-300">💰 Personal Financial Cost</span>
                                    <span className="text-violet-400 font-bold">$23,000 / Year</span>
                                </div>
                                <div className="w-full bg-slate-800 rounded-full h-4 border border-slate-700">
                                    <div className="bg-gradient-to-r from-blue-500 to-violet-500 h-full rounded-full shadow-[0_0_15px_#7658E7]" style={{ width: '100%' }} />
                                </div>
                            </div>
                        </div>
                        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 text-center min-w-[200px] shadow-lg">
                            <span className="text-3xl mb-3 block">💼</span>
                            <div className="text-2xl font-extrabold text-white">$10.5k - $23k</div>
                            <div className="text-xs text-gray-400 uppercase tracking-wider mt-1">Cost per GP</div>
                        </div>
                    </div>

                    {/* Burnout */}
                    <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 hover:border-violet-500/30 transition-all">
                        <h4 className="font-bold text-white mb-4">Burnout & Retention Crisis</h4>
                        
                        <div className="mb-6 p-4 bg-slate-800 rounded-xl border border-slate-700">
                            <div className="flex justify-between items-center mb-2">
                                <div className="flex items-center gap-2 text-rose-500">
                                    <span>👤</span>
                                    <span className="font-semibold text-sm">Considering Leaving</span>
                                </div>
                                <span className="text-2xl font-bold text-white">80.8%</span>
                            </div>
                            <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                                <div className="bg-gradient-to-r from-rose-500 to-magenta-500 h-full rounded-full shadow-[0_0_10px_#f43f5e]" style={{ width: '80.8%' }} />
                            </div>
                            <p className="text-xs text-gray-500 mt-2">Citing administrative burden as a key driver.</p>
                        </div>

                        <div className="h-48">
                            <Bar data={burnoutData} options={chartOptions} />
                        </div>
                        <div className="text-center mt-2 text-xs text-gray-400">
                            <span className="text-magenta-500 font-bold" style={{ color: COLORS.magenta }}>21%</span> of GPs directly attribute burnout to admin burden.
                        </div>
                    </div>
                </div>
            </section>

            {/* Interoperability Section */}
            <section className="py-12 max-w-7xl mx-auto px-6">
                <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-cyan-500/20 rounded-lg text-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.14 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-white">Digital Health Interoperability</h3>
                            <p className="text-sm text-gray-400">Function Usage Rates by Australian GPs</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { label: 'Receiving Discharge Summaries', value: 83, color: COLORS.success, status: 'High Uptake', note: 'Incoming data flow is strong; hospitals effectively push information to GPs.' },
                            { label: 'Receiving Pathology Reports', value: 67, color: COLORS.cyan, status: 'Moderate', note: 'Integration with diagnostic providers is established but not universal.' },
                            { label: 'Sending Referrals', value: 53, color: COLORS.rose, status: 'Low Uptake', note: 'Critical Failure Point. Nearly half of referrals rely on fax/paper methods.' }
                        ].map((item, idx) => (
                            <div key={idx} className="bg-slate-800 p-4 rounded-xl border border-slate-700/50 hover:border-opacity-100 transition-all" style={{ borderColor: `${item.color}30` }}>
                                <div className="flex justify-between items-center mb-3">
                                    <div className="text-sm font-bold text-white">{item.label}</div>
                                    <span className="text-2xl font-extrabold" style={{ color: item.color, textShadow: `0 0 8px ${item.color}40` }}>{item.value}%</span>
                                </div>
                                <div className="w-full bg-slate-900 h-3 rounded-full overflow-hidden border border-white/5 mb-3">
                                    <div className="h-full rounded-full" style={{ width: `${item.value}%`, backgroundColor: item.color, boxShadow: `0 0 12px ${item.color}` }} />
                                </div>
                                <p className="text-xs text-gray-400 leading-relaxed mt-2 pt-2 border-t border-white/5">
                                    <span className="font-bold uppercase text-[10px] tracking-wider px-1 rounded mr-1" style={{ color: item.color, borderColor: `${item.color}20`, border: '1px solid' }}>{item.status}</span>
                                    {item.note}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Nursing Efficiency Section */}
            <section className="py-12 max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h4 className="font-bold text-white text-lg">Nursing Efficiency</h4>
                                <p className="text-sm text-gray-400">Documentation & Turnaround Analysis</p>
                            </div>
                            <div className="p-2 bg-blue-500/20 rounded-lg text-blue-500">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                        </div>
                        
                        <div className="mb-8">
                            <div className="flex justify-between items-end mb-2">
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Medication Order Turnaround</p>
                                <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
                                    ⚡ 70% Faster with EMR
                                </span>
                            </div>
                            <div className="h-32">
                                <Bar data={nursingTurnaroundData} options={{ ...chartOptions, indexAxis: 'y' }} />
                            </div>
                            <p className="text-xs text-gray-400 mt-2 italic">Paper: 120 mins vs EMR: 35 mins</p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-700">
                            <div>
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Shift Saturation</p>
                                <div className="text-2xl font-bold text-white tracking-tight">~3 Hours</div>
                                <p className="text-[10px] text-violet-400 mt-1 font-medium">doc per 12h shift</p>
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Admission Assess.</p>
                                <div className="text-2xl font-bold text-rose-500 tracking-tight">4 Hours</div>
                                <p className="text-[10px] text-gray-400 mt-1">Target: Immediate</p>
                            </div>
                        </div>
                    </div>

                    {/* Information Retention */}
                    <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h4 className="text-sm font-bold text-white">Information Retention (5 Cycles)</h4>
                                <p className="text-xs text-gray-400">Data survival after multiple handovers</p>
                            </div>
                            <span className="text-xs font-bold bg-rose-500/20 text-rose-500 px-2 py-1 rounded border border-rose-500/30">
                                ⚠️ Catastrophic Loss
                            </span>
                        </div>
                        
                        <div className="h-64">
                            <Bar data={retentionData} options={chartOptions} />
                        </div>
                        
                        <div className="mt-4 p-3 bg-slate-800 rounded-lg border border-rose-500/20">
                            <p className="text-xs text-gray-400 leading-relaxed">
                                <span className="text-rose-500 font-bold">Verbal Only (2.5%):</span> Equivalent to "Chinese Whispers." Complex details like dosage changes are almost guaranteed to be lost.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Economic Impact Section */}
            <section className="py-12 max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Economic Burden */}
                    <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 relative overflow-hidden group hover:border-violet-500/30 transition-all">
                        <div className="absolute inset-0 bg-violet-500/5 group-hover:bg-violet-500/10 transition-colors" />
                        <div className="flex items-center gap-3 mb-6 relative z-10">
                            <div className="p-2 bg-violet-500/20 rounded-lg text-violet-400">
                                <span className="text-xl">💰</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-white">Systemic Economic Burden</h3>
                                <p className="text-sm text-gray-400">Deloitte Access Economics Report</p>
                            </div>
                        </div>

                        <div className="flex flex-col items-center justify-center py-4 relative z-10">
                            <div className="text-5xl font-extrabold text-white tracking-tight drop-shadow-[0_0_15px_rgba(118,88,231,0.5)]">
                                $2 Billion
                            </div>
                            <div className="text-xs font-bold text-rose-500 uppercase tracking-widest mt-2 border border-rose-500/30 px-3 py-1 rounded-full bg-rose-500/10">
                                Annual Inefficiency Cost
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mt-8 relative z-10">
                            {['Searching Forms', 'Admin Chasing', 'Duplicate Tests', 'Delayed Care'].map((item, idx) => (
                                <div key={idx} className="p-3 bg-slate-800 rounded-lg border border-slate-700 text-center">
                                    <p className="text-xs text-gray-400">{item}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Satisfaction Gap */}
                    <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-500">
                                <span className="text-xl">😊</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-white">The "Unpaid Tax" on Satisfaction</h3>
                                <p className="text-sm text-gray-400">RACGP Satisfaction Analysis</p>
                            </div>
                        </div>

                        <div className="h-48 mb-4">
                            <Bar data={satisfactionData} options={{ ...chartOptions, indexAxis: 'y', scales: { x: { ...chartOptions.scales.x, max: 100 } } }} />
                        </div>

                        <div className="bg-slate-800 p-4 rounded-xl border border-rose-500/20 flex gap-4 items-start">
                            <span className="text-rose-500 text-xl opacity-50">❝</span>
                            <p className="text-sm text-gray-300 italic">
                                The inefficiency of the referral process imposes an <span className="text-white font-bold not-italic">unpaid tax</span> on the time of private practitioners, driving burnout.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 text-center max-w-4xl mx-auto px-6">
                <h2 className="text-4xl font-black mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Ready to Transform Healthcare Workflows?
                </h2>
                <p className="text-gray-400 text-lg mb-10 leading-relaxed">
                    The Australian healthcare system is losing billions in funds and hours in capacity due to fragmented documentation workflows. Let us help you implement AI-powered solutions to close the "Digital Disconnect."
                </p>
                <Link
                    to={getRegionPath("/contact")}
                    className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-10 py-5 rounded-full text-lg font-black shadow-2xl shadow-violet-500/40 hover:scale-105 transition-all"
                >
                    Start Your Transformation
                </Link>
            </section>

            <footer className="py-12 border-t border-white/5 text-center text-[10px] font-black uppercase tracking-widest text-gray-600">
                © 2026 Algorythmos Advisory | Data Synthesized from AIHW, AMA, RACGP, and Grattan Reports.
            </footer>
        </div>
    );
};

export default HealthcareBurdenContent;
