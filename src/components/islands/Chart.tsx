import { useEffect, useMemo, useState } from 'react';
import { Chart as ChartJS, registerables } from 'chart.js';
import { Chart as ReactChart } from 'react-chartjs-2';

ChartJS.register(...registerables);

export type ChartType = 'bar' | 'line' | 'doughnut' | 'pie' | 'radar' | 'polarArea' | 'bubble' | 'scatter';

interface Props {
  type: ChartType;
  data: any;
  options?: Record<string, any>;
  /** Accessible label — describe what the chart shows. Required. */
  title: string;
  height?: number;
}

/** Read theme colours from the live CSS variables (re-read on theme toggle). */
function readTheme() {
  const cs = getComputedStyle(document.documentElement);
  const v = (n: string) => `rgb(${cs.getPropertyValue(n).trim()})`;
  const va = (n: string, a: number) => `rgb(${cs.getPropertyValue(n).trim()} / ${a})`;
  return {
    ink: v('--text'),
    muted: v('--text-muted'),
    line: va('--border', 0.6),
    palette: [v('--brand'), v('--accent'), 'rgb(236 72 153)', v('--brand-strong'), 'rgb(52 211 153)', 'rgb(251 191 36)'],
    paletteA: [va('--brand', 0.65), va('--accent', 0.65), 'rgb(236 72 153 / 0.65)', va('--brand-strong', 0.65), 'rgb(52 211 153 / 0.65)', 'rgb(251 191 36 / 0.65)'],
  };
}

/**
 * Theme-aware chart island. Hydrate with `client:visible` — SSR emits the empty
 * <figure> shell (all canvas/getComputedStyle work is gated behind `ready`),
 * and the chart.js bundle only loads when scrolled into view.
 * The wrapping element reserves height to avoid layout shift.
 */
export default function Chart({ type, data, options = {}, title, height = 320 }: Props) {
  const [tick, setTick] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
    const obs = new MutationObserver(() => setTick((t) => t + 1));
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    void mq;
    return () => obs.disconnect();
  }, []);

  const { themedData, themedOptions } = useMemo(() => {
    if (!ready) return { themedData: data, themedOptions: options };
    const t = readTheme();
    const circular = type === 'doughnut' || type === 'pie' || type === 'polarArea';
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const themedData = {
      ...data,
      datasets: (data.datasets ?? []).map((ds: any, i: number) => {
        const base = t.palette[i % t.palette.length];
        const baseA = t.paletteA[i % t.paletteA.length];
        if (circular) {
          return {
            borderWidth: 0,
            backgroundColor: (data.labels ?? []).map((_: unknown, j: number) => t.palette[j % t.palette.length]),
            ...ds,
          };
        }
        if (type === 'line') return { tension: 0.35, borderColor: base, backgroundColor: baseA, pointBackgroundColor: base, fill: false, ...ds };
        if (type === 'radar') return { borderColor: base, backgroundColor: baseA, pointBackgroundColor: base, ...ds };
        return { backgroundColor: baseA, borderColor: base, borderWidth: 1, borderRadius: 6, ...ds };
      }),
    };

    const grid = { color: t.line };
    const ticks = { color: t.muted };
    const scales = circular
      ? undefined
      : type === 'radar'
        ? { r: { grid: { color: t.line }, angleLines: { color: t.line }, pointLabels: { color: t.muted }, ticks: { color: t.muted, backdropColor: 'transparent' } } }
        : { x: { grid, ticks }, y: { grid, ticks, beginAtZero: true } };

    const themedOptions = {
      responsive: true,
      maintainAspectRatio: false,
      animation: reduceMotion ? false : { duration: 600 },
      plugins: {
        legend: { labels: { color: t.ink, usePointStyle: true, boxWidth: 8 } },
        tooltip: { intersect: false, mode: 'index' as const },
        ...(options.plugins ?? {}),
      },
      ...(scales ? { scales } : {}),
      ...options,
    };
    return { themedData, themedOptions };
  }, [ready, tick, type, data, options]);

  return (
    <figure role="img" aria-label={title} className="w-full" style={{ height: `${height}px`, margin: 0 }}>
      {ready ? <ReactChart key={tick} type={type as any} data={themedData} options={themedOptions} /> : null}
    </figure>
  );
}
