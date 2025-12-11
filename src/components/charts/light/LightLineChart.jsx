// src/components/charts/light/LightLineChart.jsx
// Lightweight SVG line chart - replaces Recharts (~307 kB → ~5 kB)

import React, { useState, useRef, useCallback, useMemo } from 'react';

/**
 * Lightweight Line Chart using pure SVG
 * Matches the visual style of the original Recharts implementation
 */
export default function LightLineChart({
  data = [],
  xKey = 'x',
  yKey = 'y',
  width = '100%',
  height = 224,
  margin = { top: 10, right: 20, bottom: 25, left: 40 },
  lineColor = '#8b5cf6',
  lineWidth = 2,
  gridColor = '#1f2937',
  axisColor = '#94a3b8',
  referenceLine = null, // { x: value } for vertical reference line
  referenceLineColor = '#7c3aed',
  xTickFormatter = (v) => `${v}%`,
  yTickFormatter = (v) => String(Math.round(v)),
  tooltipFormatter = (x, y) => ({ label: `Coverage ${x}%`, value: `${Math.round(y)}%` }),
}) {
  const svgRef = useRef(null);
  const [tooltip, setTooltip] = useState(null);
  // hoveredIndex state removed - not currently used

  // Calculate chart dimensions
  const chartWidth = typeof width === 'number' ? width : 600;
  const chartHeight = height;
  const innerWidth = chartWidth - margin.left - margin.right;
  const innerHeight = chartHeight - margin.top - margin.bottom;

  // Calculate data bounds
  const { xMin, xMax, yMin, yMax } = useMemo(() => {
    if (!data.length) return { xMin: 0, xMax: 100, yMin: 0, yMax: 100 };

    const xVals = data.map(d => d[xKey]);
    const yVals = data.map(d => d[yKey]);

    return {
      xMin: Math.min(...xVals),
      xMax: Math.max(...xVals),
      yMin: Math.min(0, Math.min(...yVals)),
      yMax: Math.max(...yVals) * 1.1, // 10% padding
    };
  }, [data, xKey, yKey]);

  // Scale functions
  const scaleX = useCallback((val) => {
    return margin.left + ((val - xMin) / (xMax - xMin)) * innerWidth;
  }, [xMin, xMax, innerWidth, margin.left]);

  const scaleY = useCallback((val) => {
    return margin.top + innerHeight - ((val - yMin) / (yMax - yMin)) * innerHeight;
  }, [yMin, yMax, innerHeight, margin.top]);

  // Generate path for line
  const linePath = useMemo(() => {
    if (!data.length) return '';

    const points = data.map((d, i) => {
      const x = scaleX(d[xKey]);
      const y = scaleY(d[yKey]);
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    });

    return points.join(' ');
  }, [data, xKey, yKey, scaleX, scaleY]);

  // Generate grid lines
  const gridLines = useMemo(() => {
    const lines = [];
    const yTickCount = 5;
    const xTickCount = 5;

    // Horizontal grid lines
    for (let i = 0; i <= yTickCount; i++) {
      const y = margin.top + (innerHeight / yTickCount) * i;
      lines.push({ x1: margin.left, y1: y, x2: margin.left + innerWidth, y2: y, type: 'h' });
    }

    // Vertical grid lines
    for (let i = 0; i <= xTickCount; i++) {
      const x = margin.left + (innerWidth / xTickCount) * i;
      lines.push({ x1: x, y1: margin.top, x2: x, y2: margin.top + innerHeight, type: 'v' });
    }

    return lines;
  }, [margin, innerWidth, innerHeight]);

  // Generate axis ticks
  const { xTicks, yTicks } = useMemo(() => {
    const xTickCount = 5;
    const yTickCount = 5;

    const xTicks = [];
    for (let i = 0; i <= xTickCount; i++) {
      const value = xMin + ((xMax - xMin) / xTickCount) * i;
      xTicks.push({ value, x: scaleX(value), y: chartHeight - 5 });
    }

    const yTicks = [];
    for (let i = 0; i <= yTickCount; i++) {
      const value = yMin + ((yMax - yMin) / yTickCount) * i;
      yTicks.push({ value, x: margin.left - 8, y: scaleY(value) });
    }

    return { xTicks, yTicks };
  }, [xMin, xMax, yMin, yMax, scaleX, scaleY, chartHeight, margin.left]);

  // Handle mouse move for tooltip
  const handleMouseMove = useCallback((e) => {
    if (!svgRef.current || !data.length) return;

    const rect = svgRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;

    // Find closest data point
    let closestIndex = 0;
    let closestDist = Infinity;

    data.forEach((d, i) => {
      const x = scaleX(d[xKey]);
      const dist = Math.abs(x - mouseX);
      if (dist < closestDist) {
        closestDist = dist;
        closestIndex = i;
      }
    });

    if (closestDist < 50) {
      const d = data[closestIndex];
      setTooltip({
        x: scaleX(d[xKey]),
        y: scaleY(d[yKey]),
        data: tooltipFormatter(d[xKey], d[yKey]),
      });
    } else {
      setTooltip(null);
    }
  }, [data, xKey, yKey, scaleX, scaleY, tooltipFormatter]);

  const handleMouseLeave = useCallback(() => {
    setTooltip(null);
  }, []);

  // Reference line position
  const refLineX = referenceLine?.x != null ? scaleX(referenceLine.x) : null;

  return (
    <div className="relative w-full" style={{ height }}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        className="w-full h-full"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Grid lines */}
        {gridLines.map((line, i) => (
          <line
            key={i}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke={gridColor}
            strokeDasharray="3 3"
            strokeWidth={1}
          />
        ))}

        {/* Reference line */}
        {refLineX != null && (
          <line
            x1={refLineX}
            y1={margin.top}
            x2={refLineX}
            y2={margin.top + innerHeight}
            stroke={referenceLineColor}
            strokeDasharray="3 3"
            strokeWidth={1.5}
          />
        )}

        {/* Data line */}
        <path
          d={linePath}
          fill="none"
          stroke={lineColor}
          strokeWidth={lineWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* X-axis ticks */}
        {xTicks.map((tick, i) => (
          <text
            key={`x-${i}`}
            x={tick.x}
            y={tick.y}
            fill={axisColor}
            fontSize={12}
            textAnchor="middle"
          >
            {xTickFormatter(tick.value)}
          </text>
        ))}

        {/* Y-axis ticks */}
        {yTicks.map((tick, i) => (
          <text
            key={`y-${i}`}
            x={tick.x}
            y={tick.y}
            fill={axisColor}
            fontSize={12}
            textAnchor="end"
            dominantBaseline="middle"
          >
            {yTickFormatter(tick.value)}
          </text>
        ))}

        {/* Hover dot */}
        {tooltip && (
          <circle
            cx={tooltip.x}
            cy={tooltip.y}
            r={5}
            fill={lineColor}
            stroke="#fff"
            strokeWidth={2}
          />
        )}
      </svg>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="absolute pointer-events-none px-3 py-2 rounded-lg text-sm"
          style={{
            left: tooltip.x,
            top: tooltip.y - 60,
            transform: 'translateX(-50%)',
            background: '#0b1220',
            border: '1px solid #1f2937',
            color: '#E2E8F0',
          }}
        >
          <div className="text-slate-400 text-xs">{tooltip.data.label}</div>
          <div className="font-semibold">ROI%: {tooltip.data.value}</div>
        </div>
      )}
    </div>
  );
}
