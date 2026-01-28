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
                displayColors: false
            }
        },
        scales: {
            x: { grid: { display: false }, ticks: { color: '#94a3b8' } },
            y: { grid: { color: '#334155' }, ticks: { color: '#94a3b8' } }
        }
    };

    // 1. Legal Liability Chart
    const legalData = {
        labels: ['NSW Health', 'ACT Health', 'Total Liability'],
        datasets: [{
            label: 'Settlement Amount ($M)',
            data: [229.8, 31.5, 261.3],
            backgroundColor: [COLORS.red, COLORS.red, COLORS.gold],
            borderRadius: 6
        }]
    };

    // 2. Patient Safety Risk Curve (Readmission Odds)
    // Based on Kleinig 2025: OR 1.016 per day delay
    const riskData = {
        labels: ['24h', '48h', '72h', '4 Days', '5 Days'],
        datasets: [{
            label: 'Increased Readmission Risk (%)',
            data: [1.6, 3.2, 4.8, 6.4, 8.0],
            borderColor: COLORS.red,
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            fill: true,
            tension: 0.4
        }]
    };

    // 3. Workforce Plan to Cease (RACGP)
    const workforceData = {
        labels: ['Plan to Cease (5yrs)', 'Staying'],
        datasets: [{
            data: [32, 68],
            backgroundColor: [COLORS.red, '#334155'],
            borderWidth: 0
        }]
    };

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-emerald-500/30">
            <Helmet>
                <title>Verified Evidence: Administrative Burden | Algorythmos</title>
                <meta name="description" content="Legal-grade evidence report on healthcare administrative burden. $261M legal liability, $5.4B economic opportunity, and 1.6% daily patient safety risk." />
            </Helmet>

            {/* HERO SECTION */}
            <section className="relative pt-32 pb-20 px-6 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-500/10 via-black to-black pointer-events-none" />

                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-widest mb-6 animate-fade-in">
                        <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                        Medical Council Presentation
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
                        The <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-200 to-amber-500">$261 Million</span> <br />
                        Legal Crisis
                    </h1>

                    <p className="text-xl text-gray-400 max-w-2xl mb-12 leading-relaxed">
                        Administrative overload is no longer just a wellbeing issue—it is a Tier-1 legal and financial liability. Verified evidence for clinical governance and executive boards.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {[
                            { label: 'Legal Liability', value: '$261.3M', sub: 'Court-Approved Settlements', color: 'text-amber-400' },
                            { label: 'Economic Impact', value: '$5.4B', sub: 'Annual Productivity Cost', color: 'text-emerald-400' },
                            { label: 'Patient Safety', value: '1.6%', sub: 'Daily Readmission Risk', color: 'text-red-400' },
                            { label: 'Workforce', value: '32%', sub: 'GPs Plan to Cease', color: 'text-blue-400' },
                        ].map((stat, i) => (
                            <div key={i} className="p-6 rounded-2xl bg-slate-900/50 border border-white/10 backdrop-blur-sm">
                                <div className="text-sm text-gray-500 font-bold uppercase tracking-wider mb-2">{stat.label}</div>
                                <div className={`text-3xl md:text-4xl font-black mb-1 ${stat.color}`}>{stat.value}</div>
                                <div className="text-xs text-gray-400">{stat.sub}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* SECTION 1: LEGAL LIABILITY */}
            <section className="py-20 px-6 border-t border-white/5 bg-slate-900/20">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                            <span className="text-amber-500">⚖️</span>
                            Tier 1: Legal Liability
                        </h2>
                        <div className="space-y-8">
                            <div className="p-6 rounded-2xl bg-amber-950/20 border border-amber-500/20 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-50 text-amber-500">
                                    <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">NSW Health Settlement</h3>
                                <div className="text-4xl font-black text-amber-400 mb-2">$229,800,000</div>
                                <p className="text-sm text-gray-300 mb-4 font-mono">
                                    Approved: [2024] NSWSC 1171<br />
                                    Date: 20 Sept 2024
                                </p>
                                <p className="text-sm text-gray-400">
                                    Supreme Court judgment for junior doctors' expenses and unpaid overtime due to administrative burden.
                                </p>
                            </div>

                            <div className="p-6 rounded-2xl bg-slate-800/50 border border-white/10">
                                <h3 className="text-xl font-bold text-white mb-2">ACT Health Settlement</h3>
                                <div className="text-3xl font-black text-white mb-2">$31,500,000</div>
                                <p className="text-sm text-gray-400 mb-4 font-mono">
                                    Orders: VID705/2022 (Fed Court)<br />
                                    Date: 18 Dec 2024
                                </p>
                                <p className="text-sm text-gray-400">
                                    Total package inclusive of settlement sum, legal costs, and administration.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="h-[400px] bg-slate-900/50 p-6 rounded-3xl border border-white/5">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Total Liability Exposure</h3>
                            <span className="text-xs text-amber-500 font-mono bg-amber-500/10 px-2 py-1 rounded">VERIFIED COURT DOCS</span>
                        </div>
                        <Bar data={legalData} options={chartOptions} />
                    </div>
                </div>
            </section>

            {/* SECTION 2: ECONOMIC & SAFETY */}
            <section className="py-20 px-6 border-t border-white/5">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* PC Report */}
                    <div className="lg:col-span-1 p-8 rounded-3xl bg-emerald-900/10 border border-emerald-500/20">
                        <h3 className="text-emerald-400 font-bold uppercase tracking-widest text-xs mb-4">The Economic Case</h3>
                        <div className="text-5xl font-black text-white mb-2">$5.4 Billion</div>
                        <p className="text-lg text-emerald-200 mb-6">Annual Potential Savings</p>

                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <span className="text-emerald-500 mt-1">✓</span>
                                <p className="text-sm text-gray-400"><strong>Source:</strong> Productivity Commission 2024 Research Paper</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="text-emerald-500 mt-1">✓</span>
                                <p className="text-sm text-gray-400"><strong>Metric:</strong> Better digital info use & reduced length-of-stay</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="text-emerald-500 mt-1">✓</span>
                                <p className="text-sm text-gray-400"><strong>Opportunity:</strong> Up to 30% of tasks automatable (upper bound)</p>
                            </div>
                        </div>
                    </div>

                    {/* Patient Safety */}
                    <div className="lg:col-span-2 p-8 rounded-3xl bg-slate-900/50 border border-white/10">
                        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">
                            <div>
                                <h3 className="text-red-400 font-bold uppercase tracking-widest text-xs mb-1">Patient Safety Risk</h3>
                                <h2 className="text-2xl font-bold text-white">Discharge Delay Harm</h2>
                            </div>
                            <div className="text-right">
                                <div className="text-3xl font-black text-white">37.6%</div>
                                <div className="text-xs text-gray-400">Summaries Delayed &gt;24h</div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="h-64">
                                <Line
                                    data={riskData}
                                    options={{
                                        ...chartOptions,
                                        scales: {
                                            y: { title: { display: true, text: '% Readmission Risk' } }
                                        }
                                    }}
                                />
                            </div>
                            <div className="space-y-4 text-sm text-gray-300">
                                <p>
                                    <strong className="text-white block mb-1">1.6% Daily Escalation</strong>
                                    Each day of delay increases 30-day readmission risk by 1.6% (OR 1.016).
                                </p>
                                <p>
                                    <strong className="text-white block mb-1">Evidence Source</strong>
                                    Kleinig et al., <em>Internal Medicine Journal</em> 2025. Analysis of 7,185 summaries.
                                </p>
                                <div className="p-4 bg-slate-800 rounded-xl border border-white/5 mt-4">
                                    <div className="flex justify-between mb-2">
                                        <span>Median Time:</span>
                                        <span className="font-bold text-white">14.5 mins</span>
                                    </div>
                                    <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                                        <div className="bg-blue-500 h-full w-[40%]"></div>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2">Per summary. Cumulative burden: ~135 hours/week at one site.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 3: WORKFORCE & SOLUTIONS */}
            <section className="py-20 px-6 border-t border-white/5 bg-slate-900/20">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">

                    {/* Workforce Crisis */}
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-6">Workforce Crisis</h2>
                        <div className="bg-slate-900 p-8 rounded-3xl border border-red-500/20 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-3 bg-red-500/10 rounded-bl-2xl border-l border-b border-red-500/20 text-red-400 text-xs font-bold">
                                CRITICAL RISK
                            </div>

                            <div className="flex gap-8 items-center mb-8">
                                <div className="h-32 w-32 relative">
                                    <Doughnut data={workforceData} options={{ cutout: '70%', plugins: { legend: { display: false } } }} />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-2xl font-black text-white">32%</span>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white">Plan to Cease Practice</h3>
                                    <p className="text-sm text-gray-400 mb-2">Within 5 Years (RACGP 2024)</p>
                                    <p className="text-xs text-red-300">
                                        60% cite regulatory/compliance burden as key factor.
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between text-sm p-3 bg-slate-800 rounded-lg">
                                    <span className="text-gray-400">Burnout Rate (Aust)</span>
                                    <span className="font-bold text-white">32% (Commonwealth Fund)</span>
                                </div>
                                <div className="flex justify-between text-sm p-3 bg-slate-800 rounded-lg">
                                    <span className="text-gray-400">Unpaid Work/Week</span>
                                    <span className="font-bold text-white">5.1 Hours (Brown 2021)</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Solutions */}
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-6">Proven Solutions</h2>
                        <div className="space-y-6">
                            {/* Gold Coast */}
                            <div className="group p-6 rounded-2xl bg-gradient-to-br from-indigo-900/30 to-slate-900 border border-indigo-500/20 hover:border-indigo-500/50 transition-all">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="font-bold text-indigo-300">Ambient AI Trial (Gold Coast)</h3>
                                    <span className="bg-indigo-500 text-white text-[10px] px-2 py-0.5 rounded font-bold">JAN 2026</span>
                                </div>
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <div className="text-2xl font-black text-white">58%</div>
                                        <div className="text-xs text-gray-400">Accepted Unedited</div>
                                    </div>
                                    <div>
                                        <div className="text-2xl font-black text-white">100+</div>
                                        <div className="text-xs text-gray-400">Clinicians</div>
                                    </div>
                                </div>
                                <p className="text-xs text-indigo-200/60">
                                    <strong>Governance:</strong> Human-in-the-loop mandatory due to hallucination risk. Peer-reviewed evaluation.
                                </p>
                            </div>

                            {/* Digital vs Paper */}
                            <div className="p-6 rounded-2xl bg-slate-800/50 border border-white/5">
                                <h3 className="font-bold text-white mb-4">Medication Turnaround (Austin 2018)</h3>
                                <div className="w-full h-12 flex rounded-lg overflow-hidden mb-2">
                                    <div className="bg-emerald-500 h-full flex items-center justify-center font-bold text-white text-sm" style={{ width: '29%' }}>
                                        35 min (Digital)
                                    </div>
                                    <div className="bg-slate-700 h-full flex items-center justify-center font-bold text-gray-400 text-sm" style={{ width: '71%' }}>
                                        120 min (Paper)
                                    </div>
                                </div>
                                <p className="text-xs text-gray-500">
                                    Time to first dose. DOI: 10.1111/ijpp.12432
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 text-center px-6">
                <h2 className="text-3xl font-black mb-6">The Path Forward</h2>
                <p className="text-gray-400 max-w-2xl mx-auto mb-10">
                    The evidence demands action: Standardise digital referrals, pilot governed AI scribes, and recognise non-contact time.
                </p>
                <Link to={getRegionPath("/contact")} className="inline-flex items-center gap-3 px-8 py-4 bg-amber-500 text-black font-black uppercase text-sm tracking-widest rounded-full hover:bg-amber-400 transition-colors">
                    <span>Request Executive Briefing</span>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </Link>
            </section>

            {/* METHODOLOGY FOOTER */}
            <footer className="py-12 border-t border-white/10 bg-black text-gray-600 text-[10px] leading-relaxed">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <strong className="block text-gray-500 uppercase tracking-widest mb-2">Platinum Standard Methodology</strong>
                        <p className="mb-2">
                            This report aggregates verifiable primary sources including Supreme Court judgments, Federal Court orders, Australian Government statutory authority research (Productivity Commission), and peer-reviewed journals with DOIs.
                        </p>
                        <ul className="space-y-1">
                            <li>• <strong>Legal:</strong> [2024] NSWSC 1171; VID705/2022.</li>
                            <li>• <strong>Safety:</strong> Kleinig et al. (2025) DOI: 10.1111/imj.70150.</li>
                            <li>• <strong>Workforce:</strong> RACGP Health of the Nation 2024; Commonwealth Fund 2025.</li>
                            <li>• <strong>Economic:</strong> Productivity Commission "Leveraging digital technology in healthcare" (2024).</li>
                        </ul>
                    </div>
                    <div className="text-right">
                        <strong className="block text-gray-500 uppercase tracking-widest mb-2">Verification Status</strong>
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-900/20 border border-emerald-500/20 rounded text-emerald-500 font-mono mb-2">
                            ✓ VERIFIED EVIDENCE
                        </div>
                        <p>Last Updated: 28 January 2026</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default ClinicalEvidenceContent;
