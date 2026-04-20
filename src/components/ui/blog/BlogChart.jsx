import React from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    Filler,
    RadialLinearScale
} from "chart.js";
import { Bar, Doughnut, Line, Radar, Bubble } from "react-chartjs-2";

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    RadialLinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    Filler
);

/**
 * BlogChart
 * Wrapper for charts to enforce consistency in styling.
 * type: "bar" | "doughnut" | "line" | "radar"
 */
export const BlogChart = ({ type, data, title, caption, height = "h-80" }) => {
    const commonOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                labels: {
                    color: "#94a3b8",
                    font: { family: "'Inter', sans-serif", size: 11, weight: "600" },
                    padding: 20
                },
                position: 'bottom'
            },
            tooltip: {
                backgroundColor: "#0f172a",
                titleColor: "#f8fafc",
                titleFont: { family: "'Inter', sans-serif", size: 13, weight: "700" },
                bodyColor: "#cbd5e1",
                bodyFont: { family: "'Inter', sans-serif", size: 12 },
                borderColor: "rgba(255,255,255,0.1)",
                borderWidth: 1,
                padding: 12,
                cornerRadius: 8,
                displayColors: true,
            }
        },
        scales: type === "doughnut" || type === "radar" ? undefined : {
            x: {
                grid: { color: "rgba(255,255,255,0.05)" },
                ticks: {
                    color: "#64748b",
                    font: { family: "'Inter', sans-serif", size: 10 },
                    maxRotation: 45,
                    minRotation: 0,
                    callback: function (val, index) {
                        // Label wrapping logic (approx simple version)
                        const label = this.getLabelForValue(val);
                        if (typeof label === 'string' && label.length > 16) {
                            return label.substr(0, 16) + '...';
                        }
                        return label;
                    }
                }
            },
            y: {
                grid: { color: "rgba(255,255,255,0.05)" },
                ticks: {
                    color: "#64748b",
                    font: { family: "'Inter', sans-serif", size: 10 }
                }
            }
        }
    };

    const radarOptions = {
        ...commonOptions,
        scales: {
            r: {
                angleLines: { color: "rgba(255,255,255,0.1)" },
                grid: { color: "rgba(255,255,255,0.1)" },
                pointLabels: { color: "#94a3b8", font: { size: 11, weight: "600" } },
                ticks: { display: false }
            }
        }
    };

    const renderChart = () => {
        switch (type) {
            case "bar":
                return <Bar data={data} options={commonOptions} />;
            case "doughnut":
                return <Doughnut data={data} options={{ ...commonOptions, cutout: '70%' }} />;
            case "line":
                return <Line data={data} options={commonOptions} />;
            case "radar":
                return <Radar data={data} options={radarOptions} />;
            case "bubble":
                return <Bubble data={data} options={commonOptions} />;
            default:
                return null;
        }
    };

    return (
        <div className="w-full my-12 bg-slate-900/40 border border-white/5 rounded-2xl p-6 lg:p-8 backdrop-blur-sm">
            {title && (
                <h4 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-6 text-center">
                    {title}
                </h4>
            )}
            <div className={`w-full ${height} relative`}>
                {renderChart()}
            </div>
            {caption && (
                <p className="mt-6 text-center text-xs text-slate-500 italic">
                    {caption}
                </p>
            )}
        </div>
    );
};
