/**
 * Locale-aware chart definitions.
 *
 * Data modules (`@/data/blogCharts`, `@/data/caseStudyCharts`) carry only
 * structure: chart type, numeric series, and i18n *key references* for every
 * user-facing string (title, caption, axis labels, series names). Components
 * resolve them with `localizeChart(t, chart)` so EN and FR pages each render
 * their own language, and the Chart island still receives plain,
 * JSON-serializable strings.
 */
import type { ChartType } from '@/components/islands/Chart';
import type { TFunction } from '@/i18n';

export interface ChartDef {
  type: ChartType;
  /** i18n key for the accessible chart title (required by the island). */
  titleKey: string;
  /** i18n key for the optional supporting note under the chart heading. */
  captionKey?: string;
  /** i18n keys for the category labels (one per data point). */
  labelKeys: string[];
  datasets: Array<{ labelKey?: string; data: number[] }>;
}

export interface LocalizedChart {
  type: ChartType;
  title: string;
  caption?: string;
  data: {
    labels: string[];
    datasets: Array<{ label?: string; data: number[] }>;
  };
}

export function localizeChart(t: TFunction, chart: ChartDef): LocalizedChart {
  return {
    type: chart.type,
    title: t(chart.titleKey),
    ...(chart.captionKey ? { caption: t(chart.captionKey) } : {}),
    data: {
      labels: chart.labelKeys.map((k) => t(k)),
      datasets: chart.datasets.map((d) => ({
        ...(d.labelKey ? { label: t(d.labelKey) } : {}),
        data: d.data,
      })),
    },
  };
}
