/**
 * Per-case-study chart data for the two data-heavy evidence studies.
 *
 * Figures are copied verbatim from the legacy react-chartjs-2 visualisations
 * (legacy/src/pages/insights/*Content.jsx). These are verified-evidence figures
 * (legal / clinical), so nothing here is computed or estimated — charts whose
 * values were illustrative, conceptual, or unsourced were intentionally omitted
 * rather than reproduced.
 *
 * All user-facing strings (titles, captions, labels, series names) are i18n
 * key references under `charts.caseStudy.<slug>.<i>.*` (EN + FR in
 * `src/i18n/ui/*.json`), resolved at render time via `localizeChart()` from
 * `@/lib/localizeChart`. Consumed by src/components/pages/CaseStudyDetail.astro;
 * the shared Chart island applies all theme colours.
 */
import type { ChartDef } from '@/lib/localizeChart';

/** Build the `charts.caseStudy.<slug>.<i>.*` key set for one chart. */
const keys = (slug: string, i: number) => {
  const base = `charts.caseStudy.${slug}.${i}`;
  return {
    title: `${base}.title`,
    caption: `${base}.caption`,
    label: (j: number) => `${base}.labels.${j}`,
    series: (k: number) => `${base}.series.${k}`,
  };
};

const labelKeys = (slug: string, i: number, n: number) =>
  Array.from({ length: n }, (_, j) => keys(slug, i).label(j));

/** slug → ordered list of charts to render on the detail page. */
export const caseStudyCharts: Record<string, ChartDef[]> = {
  /**
   * Source: legacy/src/pages/insights/HealthcareBurdenContent.jsx
   * (the interactive Leaflet PHN map and the unsourced "Pain Intensity"
   * PolarArea are intentionally not ported.)
   */
  'healthcare-burden': [
    {
      // timeDistData — Doughnut, lines ~207-220
      type: 'doughnut',
      titleKey: keys('healthcare-burden', 0).title,
      captionKey: keys('healthcare-burden', 0).caption,
      labelKeys: labelKeys('healthcare-burden', 0, 3),
      datasets: [{ labelKey: keys('healthcare-burden', 0).series(0), data: [27.5, 26.6, 45.9] }],
    },
    {
      // gpImpact Bar — lines ~525-536
      type: 'bar',
      titleKey: keys('healthcare-burden', 1).title,
      captionKey: keys('healthcare-burden', 1).caption,
      labelKeys: labelKeys('healthcare-burden', 1, 3),
      datasets: [{ labelKey: keys('healthcare-burden', 1).series(0), data: [66, 60, 51] }],
    },
    {
      // patientVolumeData — Doughnut, lines ~223-234
      type: 'doughnut',
      titleKey: keys('healthcare-burden', 2).title,
      captionKey: keys('healthcare-burden', 2).caption,
      labelKeys: labelKeys('healthcare-burden', 2, 2),
      datasets: [{ labelKey: keys('healthcare-burden', 2).series(0), data: [27, 73] }],
    },
    {
      // burnoutData — Bar, lines ~237-249
      type: 'bar',
      titleKey: keys('healthcare-burden', 3).title,
      captionKey: keys('healthcare-burden', 3).caption,
      labelKeys: labelKeys('healthcare-burden', 3, 2),
      datasets: [{ labelKey: keys('healthcare-burden', 3).series(0), data: [32, 21] }],
    },
    {
      // nursingTurnaroundData — Bar, lines ~252-264
      type: 'bar',
      titleKey: keys('healthcare-burden', 4).title,
      captionKey: keys('healthcare-burden', 4).caption,
      labelKeys: labelKeys('healthcare-burden', 4, 2),
      datasets: [{ labelKey: keys('healthcare-burden', 4).series(0), data: [120, 35] }],
    },
    {
      // retentionData — Bar, lines ~267-280
      type: 'bar',
      titleKey: keys('healthcare-burden', 5).title,
      captionKey: keys('healthcare-burden', 5).caption,
      labelKeys: labelKeys('healthcare-burden', 5, 3),
      datasets: [{ labelKey: keys('healthcare-burden', 5).series(0), data: [2.5, 85.5, 99] }],
    },
    {
      // satisfactionData — Bar, lines ~303-315
      type: 'bar',
      titleKey: keys('healthcare-burden', 6).title,
      captionKey: keys('healthcare-burden', 6).caption,
      labelKeys: labelKeys('healthcare-burden', 6, 2),
      datasets: [{ labelKey: keys('healthcare-burden', 6).series(0), data: [88, 58] }],
    },
  ],

  /**
   * Source: legacy/src/pages/insights/ClinicalEvidenceContent.jsx
   * (the illustrative readmission "risk curve", the conceptual Cognitive Load
   * and Moral Injury charts use computed/illustrative values and are not ported.)
   */
  'admin-burden-evidence': [
    {
      // legalData — Bar, lines ~73-82
      type: 'bar',
      titleKey: keys('admin-burden-evidence', 0).title,
      captionKey: keys('admin-burden-evidence', 0).caption,
      labelKeys: labelKeys('admin-burden-evidence', 0, 3),
      datasets: [{ labelKey: keys('admin-burden-evidence', 0).series(0), data: [229.8, 31.5, 261.3] }],
    },
    {
      // workforceData — Doughnut, lines ~106-114
      type: 'doughnut',
      titleKey: keys('admin-burden-evidence', 1).title,
      captionKey: keys('admin-burden-evidence', 1).caption,
      labelKeys: labelKeys('admin-burden-evidence', 1, 2),
      datasets: [{ labelKey: keys('admin-burden-evidence', 1).series(0), data: [32, 68] }],
    },
  ],
};
