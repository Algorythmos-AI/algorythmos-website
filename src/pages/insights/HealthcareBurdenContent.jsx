import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Zap } from "lucide-react";
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
    const mapContainerRef = useRef(null);
    const mapInstanceRef = useRef(null);

    // PHN Data for interactive map - organized by state/territory
    const phnData = [
        // New South Wales (9)
        { name: "Central and Eastern Sydney", state: "NSW", coords: [-33.86, 151.20] },
        { name: "South Eastern NSW", state: "NSW", coords: [-36.00, 149.50] },
        { name: "South Western Sydney", state: "NSW", coords: [-34.00, 150.80] },
        { name: "Western Sydney", state: "NSW", coords: [-33.80, 150.95] },
        { name: "Nepean Blue Mountains", state: "NSW", coords: [-33.75, 150.69] },
        { name: "Northern Sydney", state: "NSW", coords: [-33.70, 151.10] },
        { name: "Hunter New England & Central Coast", state: "NSW", coords: [-32.92, 151.77] },
        { name: "North Coast", state: "NSW", coords: [-29.40, 153.30] },
        { name: "Western NSW", state: "NSW", coords: [-32.25, 147.50] },
        // Victoria (7)
        { name: "Eastern Melbourne", state: "VIC", coords: [-37.82, 145.20] },
        { name: "South Eastern Melbourne", state: "VIC", coords: [-38.00, 145.15] },
        { name: "North Western Melbourne", state: "VIC", coords: [-37.75, 144.90] },
        { name: "Gippsland", state: "VIC", coords: [-38.10, 147.00] },
        { name: "Murray", state: "VIC", coords: [-36.75, 144.28] },
        { name: "Western Victoria", state: "VIC", coords: [-37.56, 143.85] },
        { name: "South Western Victoria", state: "VIC", coords: [-38.35, 142.48] },
        // Queensland (7)
        { name: "Brisbane North", state: "QLD", coords: [-27.35, 153.02] },
        { name: "Brisbane South", state: "QLD", coords: [-27.57, 153.02] },
        { name: "Gold Coast", state: "QLD", coords: [-28.01, 153.40] },
        { name: "Darling Downs & West Moreton", state: "QLD", coords: [-27.60, 151.90] },
        { name: "Central QLD, Wide Bay, Sunshine Coast", state: "QLD", coords: [-24.87, 152.35] },
        { name: "Northern Queensland", state: "QLD", coords: [-19.25, 146.80] },
        { name: "Western Queensland", state: "QLD", coords: [-23.70, 143.00] },
        // South Australia (2)
        { name: "Adelaide", state: "SA", coords: [-34.92, 138.60] },
        { name: "Country SA", state: "SA", coords: [-32.00, 135.00] },
        // Western Australia (3)
        { name: "Perth North", state: "WA", coords: [-31.85, 115.86] },
        { name: "Perth South", state: "WA", coords: [-32.15, 115.90] },
        { name: "Country WA", state: "WA", coords: [-26.00, 121.00] },
        // Tasmania (1)
        { name: "Tasmania", state: "TAS", coords: [-42.00, 146.50] },
        // Northern Territory (1)
        { name: "Northern Territory", state: "NT", coords: [-19.49, 132.55] },
        // ACT (1)
        { name: "Capital Health Network", state: "ACT", coords: [-35.30, 149.13] }
    ];

    // Initialize Leaflet map via CDN
    useEffect(() => {
        // Load Leaflet CSS
        if (!document.getElementById('leaflet-css')) {
            const link = document.createElement('link');
            link.id = 'leaflet-css';
            link.rel = 'stylesheet';
            link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
            document.head.appendChild(link);
        }

        // Load Leaflet JS
        const loadLeaflet = () => {
            return new Promise((resolve) => {
                if (window.L) {
                    resolve(window.L);
                    return;
                }
                const script = document.createElement('script');
                script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
                script.onload = () => resolve(window.L);
                document.head.appendChild(script);
            });
        };

        loadLeaflet().then((L) => {
            if (mapContainerRef.current && !mapInstanceRef.current) {
                const map = L.map(mapContainerRef.current, {
                    center: [-27.0, 133.0],
                    zoom: 4,
                    zoomControl: true,
                    attributionControl: false,
                    dragging: true,
                    scrollWheelZoom: false,
                    doubleClickZoom: true,
                    touchZoom: true
                });

                // Dark Matter Tiles (CartoDB)
                L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
                    maxZoom: 19
                }).addTo(map);

                // Add markers for each PHN
                phnData.forEach(phn => {
                    const marker = L.circleMarker(phn.coords, {
                        radius: 6,
                        fillColor: "#06b6d4",
                        color: "#fff",
                        weight: 2,
                        opacity: 1,
                        fillOpacity: 0.8
                    }).addTo(map);

                    marker.bindTooltip(`${phn.name} (${phn.state})`, {
                        permanent: false,
                        direction: 'top',
                        className: 'phn-tooltip'
                    });

                    marker.bindPopup(`
                        <div style="font-family: system-ui; padding: 4px;">
                            <h5 style="font-size: 12px; font-weight: bold; color: #1e293b; margin: 0 0 4px 0;">${phn.name} PHN</h5>
                            <p style="font-size: 10px; color: #64748b; margin: 0;">${phn.state} • Primary Health Network</p>
                        </div>
                    `);
                });

                mapInstanceRef.current = map;
            }
        });

        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, []);
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
        labels: [
            t('caseStudyDetail.studies.healthcare-burden.charts.timeDist.directCare'),
            t('caseStudyDetail.studies.healthcare-burden.charts.timeDist.documentation'),
            t('caseStudyDetail.studies.healthcare-burden.charts.timeDist.other')
        ],
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
        labels: [
            t('caseStudyDetail.studies.healthcare-burden.charts.gpImpact.reducedSlots'),
            t('caseStudyDetail.studies.healthcare-burden.charts.gpImpact.limitedTime'),
            t('caseStudyDetail.studies.healthcare-burden.charts.gpImpact.reducedHours')
        ],
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
        labels: [
            t('caseStudyDetail.studies.healthcare-burden.charts.patientVolume.overload'),
            t('caseStudyDetail.studies.healthcare-burden.charts.patientVolume.standard')
        ],
        datasets: [{
            data: [27, 73],
            backgroundColor: [COLORS.magenta, 'rgba(255, 255, 255, 0.05)'],
            borderColor: [COLORS.magenta, 'transparent'],
            borderWidth: 1
        }]
    };

    // Burnout Chart
    const burnoutData = {
        labels: [
            t('caseStudyDetail.studies.healthcare-burden.charts.burnout.total'),
            t('caseStudyDetail.studies.healthcare-burden.charts.burnout.admin')
        ],
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
        labels: [
            t('caseStudyDetail.studies.healthcare-burden.charts.nursing.paper'),
            t('caseStudyDetail.studies.healthcare-burden.charts.nursing.emr')
        ],
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
        labels: [
            t('caseStudyDetail.studies.healthcare-burden.charts.retention.verbal'),
            t('caseStudyDetail.studies.healthcare-burden.charts.retention.verbalNotes'),
            t('caseStudyDetail.studies.healthcare-burden.charts.retention.printed')
        ],
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
        labels: [
            t('caseStudyDetail.studies.healthcare-burden.charts.adminPain.chasing'),
            t('caseStudyDetail.studies.healthcare-burden.charts.adminPain.referrals'),
            t('caseStudyDetail.studies.healthcare-burden.charts.adminPain.critical')
        ],
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
        labels: [
            t('caseStudyDetail.studies.healthcare-burden.charts.satisfaction.salaried'),
            t('caseStudyDetail.studies.healthcare-burden.charts.satisfaction.private')
        ],
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
                        {t('caseStudyDetail.studies.healthcare-burden.badge')}
                    </div>

                    <h1 className="text-4xl lg:text-5xl font-black mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                        {t('caseStudyDetail.studies.healthcare-burden.hero.title')}
                    </h1>
                    <p className="text-xl text-gray-400 max-w-3xl mb-8">
                        {t('caseStudyDetail.studies.healthcare-burden.hero.subtitle')}
                    </p>
                    <div className="flex flex-wrap gap-4 text-xs font-mono text-gray-500 uppercase tracking-widest">
                        <span className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            Verified Evidence
                        </span>
                        <span>•</span>
                        <span>Medical Council Presentation</span>
                        <span>•</span>
                        <span>28 January 2026</span>
                    </div>
                </div>
            </section>

            {/* Theoretical Framework & Strategic Overview */}
            <section className="py-12 max-w-7xl mx-auto px-6">

                {/* Academic Theory Block */}
                <div className="mb-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-6">The Psychology of Efficiency</h2>
                        <div className="space-y-6">
                            <div className="bg-slate-900/40 border-l-4 border-violet-500 pl-6 py-2">
                                <h3 className="text-lg font-semibold text-violet-400 mb-2">Cognitive Load Theory</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    In healthcare, administrative tasks usurp <strong>working memory</strong>—the limited mental capacity used for decision making. When clinicians are forced to navigate complex compliance logic during consults, their "extraneous load" spikes, directly degrading the "germane load" required for complex clinical diagnosis.
                                </p>
                            </div>
                            <div className="bg-slate-900/40 border-l-4 border-rose-500 pl-6 py-2">
                                <h3 className="text-lg font-semibold text-rose-400 mb-2">Moral Injury</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    Often misdiagnosed as burnout, <strong>moral injury</strong> occurs when clinicians know what care patients need but are systemically prevented from providing it due to bureaucratic obstruction. This "double bind"—administering care vs. administering data—is the primary driver of workforce attrition.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-slate-900/60 p-8 rounded-3xl border border-dashed border-slate-700 relative">
                        <div className="absolute -top-3 -right-3 bg-blue-600 text-white text-[10px] uppercase font-bold px-3 py-1 rounded-full shadow-lg">
                            Global Context
                        </div>
                        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                            <span className="text-2xl">🌍</span> Administrative Burden: A Global Disease
                        </h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center p-3 rounded-xl bg-slate-800/50">
                                <div>
                                    <span className="block text-red-400 font-bold">United States</span>
                                    <span className="text-xs text-gray-500">Highest Inefficiency</span>
                                </div>
                                <div className="text-right">
                                    <span className="block text-xl font-black text-white">25.3%</span>
                                    <span className="text-[10px] text-gray-500 uppercase">of Hospital Spend is Admin</span>
                                </div>
                            </div>
                            <div className="flex justify-between items-center p-3 rounded-xl bg-slate-800/50">
                                <div>
                                    <span className="block text-blue-400 font-bold">United Kingdom</span>
                                    <span className="text-xs text-gray-500">NHS (England)</span>
                                </div>
                                <div className="text-right">
                                    <span className="block text-xl font-black text-white">15.5%</span>
                                    <span className="text-[10px] text-gray-500 uppercase">Hospital Admin Costs</span>
                                </div>
                            </div>
                            <div className="flex justify-between items-center p-3 rounded-xl bg-emerald-900/20 border border-emerald-500/30">
                                <div>
                                    <span className="block text-emerald-400 font-bold">Australia</span>
                                    <span className="text-xs text-gray-500">Hybrid Efficiency</span>
                                </div>
                                <div className="text-right">
                                    <span className="block text-xl font-black text-white">~11 hrs</span>
                                    <span className="text-[10px] text-emerald-500 uppercase">Wasted per GP / Week</span>
                                </div>
                            </div>
                        </div>
                        <p className="mt-6 text-xs text-gray-500 italic">
                            While Australia avoids the extreme transaction costs of the US model, the "time tax" on clinicians remains critically high, paralleling global trends in workforce exhaustion.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* The Care Paradox */}
                    <div className="bg-gradient-to-br from-blue-600 to-violet-600 rounded-3xl p-8 relative overflow-hidden shadow-[0_0_30px_rgba(55,21,224,0.3)]">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 blur-3xl rounded-full -mr-16 -mt-16" />

                        <h2 className="text-3xl font-bold mb-2 text-white">{t('caseStudyDetail.studies.healthcare-burden.careParadox.title')}</h2>
                        <p className="text-white/90 text-sm mb-6">{t('caseStudyDetail.studies.healthcare-burden.careParadox.subtitle')}</p>

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
                                {t('caseStudyDetail.studies.healthcare-burden.careParadox.patientCare')}
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-violet-500 shadow-[0_0_5px_#6D00FF]" />
                                {t('caseStudyDetail.studies.healthcare-burden.careParadox.documentation')}
                            </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-white/10 text-xs text-white/80 leading-relaxed">
                            <strong className="text-cyan-400">Strategic Insight:</strong> {t('caseStudyDetail.studies.healthcare-burden.careParadox.insight')}
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
                                <h3 className="text-xl font-bold text-white">{t('caseStudyDetail.studies.healthcare-burden.adminWork.title')}</h3>
                                <p className="text-gray-400 mt-1">Identified as the <span className="font-bold text-violet-400">{t('caseStudyDetail.studies.healthcare-burden.adminWork.painPoint')}</span> for Australian doctors.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                {[
                                    { icon: '🔍', title: t('caseStudyDetail.studies.healthcare-burden.charts.adminPain.chasing'), desc: t('caseStudyDetail.studies.healthcare-burden.adminWork.painPoint') }, // Reusing appropriate key or generic desc
                                    { icon: '🔗', title: t('caseStudyDetail.studies.healthcare-burden.charts.adminPain.referrals'), desc: 'Coordinating specialist care' },
                                    { icon: '⏰', title: t('caseStudyDetail.studies.healthcare-burden.charts.adminPain.critical'), desc: 'Managing urgent follow-ups' }
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
                            <strong>The "Template Mess":</strong> {t('caseStudyDetail.studies.healthcare-burden.adminWork.templateMess')}
                        </div>
                    </div>
                </div>
            </section>

            {/* GP Burden Section */}
            <section className="py-12 max-w-7xl mx-auto px-6">
                <div className="flex items-center gap-3 mb-8">
                    <div className="h-8 w-1 bg-gradient-to-b from-violet-500 to-blue-500 rounded-full shadow-[0_0_10px_#6D00FF]" />
                    <h2 className="text-2xl font-bold text-white">{t('caseStudyDetail.studies.healthcare-burden.gpBurden.title')}</h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Operational Impact */}
                    <div className="lg:col-span-2 bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 hover:border-violet-500/30 transition-all">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h4 className="font-bold text-white">{t('caseStudyDetail.studies.healthcare-burden.gpBurden.operationalImpact')}</h4>
                                <p className="text-sm text-gray-400">{t('caseStudyDetail.studies.healthcare-burden.gpBurden.practiceChanges')}</p>
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
                                    labels: [
                                        t('caseStudyDetail.studies.healthcare-burden.charts.gpImpact.reducedSlots'),
                                        t('caseStudyDetail.studies.healthcare-burden.charts.gpImpact.limitedTime'),
                                        t('caseStudyDetail.studies.healthcare-burden.charts.gpImpact.reducedHours')
                                    ],
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
                            <strong className="text-rose-500">Access Restriction:</strong> {t('caseStudyDetail.studies.healthcare-burden.gpBurden.accessRestriction')}
                        </div>
                    </div>

                    {/* Patient Volume */}
                    <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 hover:border-violet-500/30 transition-all">
                        <h4 className="font-bold text-white mb-2 text-center">{t('caseStudyDetail.studies.healthcare-burden.gpBurden.patientVolume')}</h4>
                        <div className="h-48 mb-4">
                            <Doughnut
                                data={patientVolumeData}
                                options={{ ...chartOptions, cutout: '70%' }}
                            />
                        </div>
                        <div className="text-center mb-4">
                            <p className="text-3xl font-extrabold text-white">27%</p>
                            <p className="text-xs text-magenta-500 font-semibold uppercase tracking-wider" style={{ color: COLORS.magenta }}>{t('caseStudyDetail.studies.healthcare-burden.charts.patientVolume.overload')}</p>
                        </div>
                        <div className="pt-3 border-t border-slate-700 text-xs text-gray-400 text-center">
                            <strong className="text-white">High Volume Risk:</strong> {t('caseStudyDetail.studies.healthcare-burden.gpBurden.highVolumeRisk')}
                        </div>
                    </div>
                </div>

                {/* Financial Impact Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                    {/* Annual Cost */}
                    <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 flex flex-col md:flex-row gap-8 items-center hover:border-violet-500/30 transition-all">
                        <div className="flex-1 w-full">
                            <h4 className="font-bold text-white mb-6">{t('caseStudyDetail.studies.healthcare-burden.financial.title')}</h4>
                            <div className="mb-8">
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-gray-300">🕐 {t('caseStudyDetail.studies.healthcare-burden.financial.lostHours')}</span>
                                    <span className="text-rose-500 font-bold">{t('caseStudyDetail.studies.healthcare-burden.financial.hoursYear')}</span>
                                </div>
                                <div className="w-full bg-slate-800 rounded-full h-4 border border-slate-700 relative overflow-hidden">
                                    <div className="bg-gradient-to-r from-rose-500 to-magenta-500 h-full rounded-full shadow-[0_0_15px_#f43f5e]" style={{ width: '35%' }} />
                                </div>
                                <p className="text-xs text-gray-500 mt-2">{t('caseStudyDetail.studies.healthcare-burden.financial.workWeeks')}</p>
                            </div>
                            <div>
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-gray-300">💰 {t('caseStudyDetail.studies.healthcare-burden.financial.costLabel')}</span>
                                    <span className="text-violet-400 font-bold">{t('caseStudyDetail.studies.healthcare-burden.financial.costValue')}</span>
                                </div>
                                <div className="w-full bg-slate-800 rounded-full h-4 border border-slate-700">
                                    <div className="bg-gradient-to-r from-blue-500 to-violet-500 h-full rounded-full shadow-[0_0_15px_#7658E7]" style={{ width: '100%' }} />
                                </div>
                            </div>
                        </div>
                        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 text-center min-w-[200px] shadow-lg">
                            <span className="text-3xl mb-3 block">💼</span>
                            <div className="text-2xl font-extrabold text-white">{t('caseStudyDetail.studies.healthcare-burden.financial.costRange')}</div>
                            <div className="text-xs text-gray-400 uppercase tracking-wider mt-1">{t('caseStudyDetail.studies.healthcare-burden.financial.costPerGp')}</div>
                        </div>
                    </div>

                    {/* Burnout */}
                    <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 hover:border-violet-500/30 transition-all">
                        <h4 className="font-bold text-white mb-4">{t('caseStudyDetail.studies.healthcare-burden.burnout.title')}</h4>

                        <div className="mb-6 p-4 bg-slate-800 rounded-xl border border-slate-700">
                            <div className="flex justify-between items-center mb-2">
                                <div className="flex items-center gap-2 text-rose-500">
                                    <span>👤</span>
                                    <span className="font-semibold text-sm">{t('caseStudyDetail.studies.healthcare-burden.burnout.consideringLeaving')}</span>
                                </div>
                                <span className="text-2xl font-bold text-white">80.8%</span>
                            </div>
                            <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                                <div className="bg-gradient-to-r from-rose-500 to-magenta-500 h-full rounded-full shadow-[0_0_10px_#f43f5e]" style={{ width: '80.8%' }} />
                            </div>
                            <p className="text-xs text-gray-500 mt-2">{t('caseStudyDetail.studies.healthcare-burden.burnout.keyDriver')}</p>
                        </div>

                        <div className="h-48">
                            <Bar data={burnoutData} options={chartOptions} />
                        </div>
                        <div className="text-center mt-2 text-xs text-gray-400">
                            <span className="text-magenta-500 font-bold" style={{ color: COLORS.magenta }}>21%</span> {t('caseStudyDetail.studies.healthcare-burden.burnout.adminDriven')}
                        </div>
                    </div>
                </div>
            </section>

            {/* PHN Map Section */}
            <section className="py-12 max-w-7xl mx-auto px-6">
                <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 overflow-hidden">
                    <div className="flex items-start gap-4 mb-6">
                        <div className="p-3 bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white">{t('caseStudyDetail.studies.healthcare-burden.phn.title')}</h3>
                            <p className="text-gray-400 mt-1">{t('caseStudyDetail.studies.healthcare-burden.phn.subtitle')}</p>
                        </div>
                    </div>

                    {/* Scalability Insight */}
                    <div className="bg-slate-800/50 rounded-xl p-5 mb-6 border border-slate-700/50">
                        <div className="flex justify-between items-start mb-3">
                            <h4 className="text-xs font-bold text-violet-400 uppercase tracking-widest">{t('caseStudyDetail.studies.healthcare-burden.phn.scalabilityTrap')}</h4>
                            <div className="p-2 bg-violet-500/10 rounded-lg">
                                <svg className="w-5 h-5 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                                </svg>
                            </div>
                        </div>
                        <p className="text-sm text-gray-300 leading-relaxed">
                            {t('caseStudyDetail.studies.healthcare-burden.phn.scalabilityDesc')}
                        </p>
                        <p className="text-xs text-gray-500 mt-3 flex items-center gap-2">
                            <span className="text-cyan-500">▶</span>
                            {t('caseStudyDetail.studies.healthcare-burden.phn.mapHint')}
                        </p>
                    </div>

                    {/* Interactive Map Container */}
                    <div
                        ref={mapContainerRef}
                        className="h-[400px] w-full rounded-2xl overflow-hidden border-2 border-violet-500/30 shadow-[0_0_30px_rgba(109,0,255,0.2)]"
                        style={{ background: '#0f0f23' }}
                    />

                    {/* Map Legend */}
                    <div className="mt-4 flex flex-wrap gap-4 justify-center text-xs mb-8">
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-cyan-500 shadow-[0_0_8px_#06b6d4]" />
                            <span className="text-gray-400">{t('caseStudyDetail.studies.healthcare-burden.phn.legend.location')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-gray-500">|</span>
                            <span className="text-gray-400">{t('caseStudyDetail.studies.healthcare-burden.phn.legend.networks')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-gray-500">|</span>
                            <span className="text-gray-400">{t('caseStudyDetail.studies.healthcare-burden.phn.legend.clickDetails')}</span>
                        </div>
                    </div>

                    {/* PHN Educational Content */}
                    <div className="border-t border-slate-700/50 pt-8">
                        {/* What is a PHN */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-cyan-500/20 rounded-lg text-cyan-400">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <h4 className="text-lg font-bold text-white">{t('caseStudyDetail.studies.healthcare-burden.phn.whatIsPhn.title')}</h4>
                                </div>
                                <p className="text-sm text-gray-300 leading-relaxed mb-4">
                                    {t('caseStudyDetail.studies.healthcare-burden.phn.whatIsPhn.desc')}
                                </p>
                                <div className="space-y-2">
                                    {[
                                        t('caseStudyDetail.studies.healthcare-burden.phn.whatIsPhn.point1'),
                                        t('caseStudyDetail.studies.healthcare-burden.phn.whatIsPhn.point2'),
                                        t('caseStudyDetail.studies.healthcare-burden.phn.whatIsPhn.point3'),
                                        t('caseStudyDetail.studies.healthcare-burden.phn.whatIsPhn.point4')
                                    ].map((item, idx) => (
                                        <div key={idx} className="flex items-start gap-2 text-xs text-gray-400">
                                            <span className="text-cyan-500 mt-0.5">✓</span>
                                            <span>{item}</span>
                                        </div>
                                    ))}
                                </div>
                                <p className="text-[10px] text-gray-500 mt-4 italic">
                                    {t('caseStudyDetail.studies.healthcare-burden.phn.whatIsPhn.established')}
                                </p>
                            </div>

                            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-violet-500/20 rounded-lg text-violet-400">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                        </svg>
                                    </div>
                                    <h4 className="text-lg font-bold text-white">{t('caseStudyDetail.studies.healthcare-burden.phn.whatTheyDo.title')}</h4>
                                </div>
                                <div className="space-y-3">
                                    {[
                                        { title: t('caseStudyDetail.studies.healthcare-burden.phn.whatTheyDo.plan'), desc: t('caseStudyDetail.studies.healthcare-burden.phn.whatTheyDo.planDesc') },
                                        { title: t('caseStudyDetail.studies.healthcare-burden.phn.whatTheyDo.fund'), desc: t('caseStudyDetail.studies.healthcare-burden.phn.whatTheyDo.fundDesc') },
                                        { title: t('caseStudyDetail.studies.healthcare-burden.phn.whatTheyDo.support'), desc: t('caseStudyDetail.studies.healthcare-burden.phn.whatTheyDo.supportDesc') },
                                        { title: t('caseStudyDetail.studies.healthcare-burden.phn.whatTheyDo.coordinate'), desc: t('caseStudyDetail.studies.healthcare-burden.phn.whatTheyDo.coordinateDesc') }
                                    ].map((item, idx) => (
                                        <div key={idx} className="border-l-2 border-violet-500/30 pl-3">
                                            <h5 className="text-sm font-semibold text-white">{item.title}</h5>
                                            <p className="text-xs text-gray-500">{item.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Why PHNs Exist */}
                        <div className="bg-gradient-to-r from-rose-500/10 via-transparent to-violet-500/10 rounded-xl p-6 border border-rose-500/20 mb-8">
                            <h4 className="text-sm font-bold text-rose-400 uppercase tracking-wider mb-4">{t('caseStudyDetail.studies.healthcare-burden.phn.whyExist.title')}</h4>
                            <p className="text-sm text-gray-300 mb-4">{t('caseStudyDetail.studies.healthcare-burden.phn.whyExist.intro')}</p>
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                                {[
                                    t('caseStudyDetail.studies.healthcare-burden.phn.whyExist.problem1'),
                                    t('caseStudyDetail.studies.healthcare-burden.phn.whyExist.problem2'),
                                    t('caseStudyDetail.studies.healthcare-burden.phn.whyExist.problem3'),
                                    t('caseStudyDetail.studies.healthcare-burden.phn.whyExist.problem4'),
                                    t('caseStudyDetail.studies.healthcare-burden.phn.whyExist.problem5')
                                ].map((problem, idx) => (
                                    <div key={idx} className="bg-slate-900/60 p-3 rounded-lg border border-slate-700/50 text-center">
                                        <p className="text-xs text-gray-400 leading-tight">{problem}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* State Breakdown */}
                        <div>
                            <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">{t('caseStudyDetail.studies.healthcare-burden.phn.stateBreakdown')}</h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {[
                                    { state: "NSW", count: 9, color: "cyan" },
                                    { state: "VIC", count: 7, color: "violet" },
                                    { state: "QLD", count: 7, color: "magenta" },
                                    { state: "SA", count: 2, color: "rose" },
                                    { state: "WA", count: 3, color: "blue" },
                                    { state: "TAS", count: 1, color: "emerald" },
                                    { state: "NT", count: 1, color: "orange" },
                                    { state: "ACT", count: 1, color: "teal" }
                                ].map((item, idx) => (
                                    <div key={idx} className="bg-slate-800/30 p-3 rounded-lg border border-slate-700/30 flex items-center justify-between">
                                        <span className="text-sm font-bold text-white">{item.state}</span>
                                        <span className={`text-xs font-bold px-2 py-1 rounded bg-${item.color}-500/20 text-${item.color}-400`} style={{ backgroundColor: `rgba(6, 182, 212, 0.2)`, color: '#06b6d4' }}>
                                            {item.count} PHN{item.count > 1 ? 's' : ''}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <p className="text-[10px] text-gray-500 mt-4 text-center">
                                {t('caseStudyDetail.studies.healthcare-burden.phn.waNote')}
                            </p>
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
                            <h3 className="font-bold text-lg text-white">{t('caseStudyDetail.studies.healthcare-burden.interoperability.title')}</h3>
                            <p className="text-sm text-gray-400">{t('caseStudyDetail.studies.healthcare-burden.interoperability.subtitle')}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { label: t('caseStudyDetail.studies.healthcare-burden.interoperability.items.discharge.label'), value: 83, color: COLORS.success, status: t('caseStudyDetail.studies.healthcare-burden.interoperability.items.discharge.status'), note: t('caseStudyDetail.studies.healthcare-burden.interoperability.items.discharge.note') },
                            { label: t('caseStudyDetail.studies.healthcare-burden.interoperability.items.pathology.label'), value: 67, color: COLORS.cyan, status: t('caseStudyDetail.studies.healthcare-burden.interoperability.items.pathology.status'), note: t('caseStudyDetail.studies.healthcare-burden.interoperability.items.pathology.note') },
                            { label: t('caseStudyDetail.studies.healthcare-burden.interoperability.items.referrals.label'), value: 53, color: COLORS.rose, status: t('caseStudyDetail.studies.healthcare-burden.interoperability.items.referrals.status'), note: t('caseStudyDetail.studies.healthcare-burden.interoperability.items.referrals.note') }
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
                                <h4 className="font-bold text-white text-lg">{t('caseStudyDetail.studies.healthcare-burden.nursing.title')}</h4>
                                <p className="text-sm text-gray-400">{t('caseStudyDetail.studies.healthcare-burden.nursing.subtitle')}</p>
                            </div>
                            <div className="p-2 bg-blue-500/20 rounded-lg text-blue-500">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                        </div>

                        <div className="mb-8">
                            <div className="flex justify-between items-end mb-2">
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('caseStudyDetail.studies.healthcare-burden.nursing.medicationTurnaround')}</p>
                                <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
                                    <Zap size={12} strokeWidth={1.5} aria-hidden="true" className="inline" /> {t('caseStudyDetail.studies.healthcare-burden.nursing.emrFaster')}
                                </span>
                            </div>
                            <div className="h-32">
                                <Bar data={nursingTurnaroundData} options={{ ...chartOptions, indexAxis: 'y' }} />
                            </div>
                            <p className="text-xs text-gray-400 mt-2 italic">{t('caseStudyDetail.studies.healthcare-burden.nursing.comparison')}</p>
                        </div>
                    </div>

                    <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h4 className="font-bold text-white text-lg">{t('caseStudyDetail.studies.healthcare-burden.retention.title')}</h4>
                                <p className="text-sm text-gray-400">{t('caseStudyDetail.studies.healthcare-burden.retention.subtitle')}</p>
                            </div>
                            <div className="p-2 bg-rose-500/20 rounded-lg text-rose-500">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                        </div>

                        <div className="h-48 mb-4">
                            <Bar data={retentionData} options={{ ...chartOptions, indexAxis: 'y', scales: { x: { ...chartOptions.scales.x, max: 100 } } }} />
                        </div>

                        <div className="bg-rose-500/10 border border-rose-500/20 rounded-lg p-3 text-xs leading-relaxed">
                            <strong className="text-rose-400 block mb-1">{t('caseStudyDetail.studies.healthcare-burden.retention.catastrophic')}</strong>
                            {t('caseStudyDetail.studies.healthcare-burden.retention.verbalOnly')}
                        </div>
                    </div>
                </div>
            </section>

            {/* Economic Burden & Satisfaction */}
            <section className="py-12 max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-br from-indigo-900/50 to-slate-900/50 backdrop-blur-xl border border-indigo-500/20 rounded-3xl p-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <span className="text-8xl">💰</span>
                        </div>
                        <h3 className="font-bold text-xl text-white mb-2">{t('caseStudyDetail.studies.healthcare-burden.economic.title')}</h3>
                        <p className="text-xs uppercase tracking-widest text-indigo-400 mb-6">{t('caseStudyDetail.studies.healthcare-burden.economic.source')}</p>

                        <div className="flex items-baseline gap-2 mb-2">
                            <span className="text-5xl font-black text-white tracking-tight">{t('caseStudyDetail.studies.healthcare-burden.economic.amount')}</span>
                        </div>
                        <p className="text-gray-400 mb-8">{t('caseStudyDetail.studies.healthcare-burden.economic.annual')}</p>
                    </div>

                    <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 flex flex-col justify-between">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="font-bold text-lg text-white">{t('caseStudyDetail.studies.healthcare-burden.satisfaction.title')}</h3>
                                <p className="text-sm text-gray-400">{t('caseStudyDetail.studies.healthcare-burden.satisfaction.source')}</p>
                            </div>
                        </div>

                        <div className="h-48 mb-4">
                            <Bar data={satisfactionData} options={{ ...chartOptions, indexAxis: 'y', scales: { x: { ...chartOptions.scales.x, max: 100 } } }} />
                        </div>

                        <div className="bg-slate-800 p-4 rounded-xl border border-rose-500/20 flex gap-4 items-start">
                            <span className="text-rose-500 text-xl opacity-50">❝</span>
                            <p className="text-sm text-gray-300 italic">
                                {t('caseStudyDetail.studies.healthcare-burden.satisfaction.quote')}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 text-center max-w-4xl mx-auto px-6">
                <h2 className="text-4xl font-black mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    {t('caseStudyDetail.studies.healthcare-burden.cta.title')}
                </h2>
                <p className="text-gray-400 text-lg mb-10 leading-relaxed">
                    {t('caseStudyDetail.studies.healthcare-burden.cta.subtitle')}
                </p>
                <Link
                    to={getRegionPath("/contact")}
                    className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-10 py-5 rounded-full text-lg font-black shadow-2xl shadow-violet-500/40 hover:scale-105 transition-all"
                >
                    {t('caseStudyDetail.studies.healthcare-burden.cta.button')}
                </Link>
            </section>

            <footer className="py-12 border-t border-white/5 mx-auto max-w-7xl px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div>
                        <h4 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-4">Research Methodology</h4>
                        <p className="text-xs text-gray-400 leading-relaxed mb-4">
                            This analysis aggregates data from peer-reviewed studies, government reports, and observational time-motion studies.
                            Core data sources include the Commonwealth Fund International Health Policy Survey, AIHW Medical Workforce reports, and published findings on cognitive load in electronic health record (EHR) usage.
                        </p>
                        <p className="text-xs text-gray-400 leading-relaxed">
                            Global comparative statistics (US/UK/AU) are derived from OECD Health Statistics 2023 and the Annals of Internal Medicine (Admin Costs in US vs Canada/UK). Moral injury frameworks adapted from Dean et al. (2019).
                        </p>
                    </div>
                    <div className="text-right">
                        <h4 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-4">Verification Context</h4>
                        <p className="text-xs text-gray-400 leading-relaxed mb-2">
                            Presented to the <strong>Medical Council</strong>
                        </p>
                        <p className="text-xs text-gray-400 leading-relaxed mb-6">
                            Date: <strong>28 January 2026</strong>
                        </p>
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            <span className="text-[10px] font-mono text-gray-300">STATUS: VERIFIED EVIDENCE</span>
                        </div>
                    </div>
                </div>
            </footer>

            <div className="bg-black py-4 text-center border-t border-white/5">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-700">
                    {t('caseStudyDetail.studies.healthcare-burden.footer')}
                </p>
            </div>
        </div>
    );
};

export default HealthcareBurdenContent;
