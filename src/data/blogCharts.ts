/**
 * Real chart data for blog posts, harvested verbatim from the legacy React
 * layouts (archived under `legacy/`). These replace the "chart coming soon"
 * placeholders in `BlogPostPage.astro`.
 *
 * Every numeric array below is copied exactly from the original
 * `react-chartjs-2` `data={{ ... }}` definitions — no figures are invented.
 * All user-facing strings (titles, captions, labels, series names) are i18n
 * key references under `charts.blog.<slug>.<i>.*` (EN + FR in
 * `src/i18n/ui/*.json`), resolved at render time via
 * `localizeChart()` from `@/lib/localizeChart`. Where a legacy chart could not
 * be represented faithfully with the shared island's shape (bubble charts use
 * `{x,y,r}` objects; one combo chart mixed bar+line), that chart is omitted and
 * documented inline rather than fabricated.
 *
 * The shared island (`@/components/islands/Chart`) applies all theme colours,
 * so only key references + numeric data are provided here. Resolved props are
 * fully JSON-serializable (no callbacks).
 *
 * Sources (legacy → slug):
 *  - legacy/src/pages/insights/PulseContent.jsx              → pulse-clinical-ai
 *  - legacy/src/pages/insights/layouts/GdprAiLayout.jsx      → gdpr-ai
 *  - legacy/src/pages/insights/layouts/MlopsLayout.jsx       → mlops-production
 *  - legacy/src/pages/insights/layouts/AiConsultancyLayout.jsx → ai-consultancy-australia
 *  - legacy/src/pages/insights/layouts/LlmSecOpsLayout.jsx   → llmsecops
 *  - legacy/src/pages/insights/layouts/AgenticAiLayout.jsx   → agentic-ai
 */
import type { ChartDef } from '@/lib/localizeChart';

/** Build the `charts.blog.<slug>.<i>.*` key set for one chart. */
const keys = (slug: string, i: number) => {
  const base = `charts.blog.${slug}.${i}`;
  return {
    title: `${base}.title`,
    caption: `${base}.caption`,
    label: (j: number) => `${base}.labels.${j}`,
    series: (k: number) => `${base}.series.${k}`,
  };
};

const labelKeys = (slug: string, i: number, n: number) =>
  Array.from({ length: n }, (_, j) => keys(slug, i).label(j));

export const blogCharts: Record<string, ChartDef[]> = {
  // ── Pulse: Clinical AI ──────────────────────────────────────────────────
  // PulseContent.jsx. The hero was a bar+line combo; since the island maps a
  // single `type` to every dataset, both index-based yearly series are rendered
  // as lines (the "divergence" story is preserved). The Scribe doughnut, ED-wait
  // bar, discharge line and method (efficiency) bar all map cleanly.
  'pulse-clinical-ai': [
    {
      type: 'line',
      titleKey: keys('pulse-clinical-ai', 0).title,
      captionKey: keys('pulse-clinical-ai', 0).caption,
      labelKeys: labelKeys('pulse-clinical-ai', 0, 5),
      datasets: [
        { labelKey: keys('pulse-clinical-ai', 0).series(0), data: [100, 108, 115, 122, 130] },
        { labelKey: keys('pulse-clinical-ai', 0).series(1), data: [100, 110, 128, 145, 160] },
      ],
    },
    {
      type: 'doughnut',
      titleKey: keys('pulse-clinical-ai', 1).title,
      captionKey: keys('pulse-clinical-ai', 1).caption,
      labelKeys: labelKeys('pulse-clinical-ai', 1, 2),
      datasets: [{ data: [58, 42] }],
    },
    {
      type: 'bar',
      titleKey: keys('pulse-clinical-ai', 2).title,
      labelKeys: labelKeys('pulse-clinical-ai', 2, 3),
      datasets: [{ labelKey: keys('pulse-clinical-ai', 2).series(0), data: [45, 30, 15] }],
    },
    {
      type: 'line',
      titleKey: keys('pulse-clinical-ai', 3).title,
      labelKeys: labelKeys('pulse-clinical-ai', 3, 5),
      datasets: [{ labelKey: keys('pulse-clinical-ai', 3).series(0), data: [12, 18, 15, 25, 60] }],
    },
    {
      type: 'bar',
      titleKey: keys('pulse-clinical-ai', 4).title,
      labelKeys: labelKeys('pulse-clinical-ai', 4, 3),
      datasets: [{ labelKey: keys('pulse-clinical-ai', 4).series(0), data: [25, 15, 6] }],
    },
  ],

  // ── AI Consultancy (Australia) ──────────────────────────────────────────
  // AiConsultancyLayout.jsx. Radar (maturity) and line (ROI J-curve) map
  // cleanly. The "Vendor Landscape" bubble chart used {x,y,r} point objects,
  // which the island's number[] dataset shape cannot represent — omitted.
  'ai-consultancy-australia': [
    {
      type: 'radar',
      titleKey: keys('ai-consultancy-australia', 0).title,
      labelKeys: labelKeys('ai-consultancy-australia', 0, 5),
      datasets: [
        { labelKey: keys('ai-consultancy-australia', 0).series(0), data: [35, 42, 28, 30, 45] },
        { labelKey: keys('ai-consultancy-australia', 0).series(1), data: [88, 92, 85, 94, 90] },
      ],
    },
    {
      type: 'line',
      titleKey: keys('ai-consultancy-australia', 1).title,
      captionKey: keys('ai-consultancy-australia', 1).caption,
      labelKeys: labelKeys('ai-consultancy-australia', 1, 7),
      datasets: [
        { labelKey: keys('ai-consultancy-australia', 1).series(0), data: [100, 95, 88, 75, 60, 45, 35] },
        { labelKey: keys('ai-consultancy-australia', 1).series(1), data: [0, 10, 35, 80, 150, 280, 450] },
      ],
    },
  ],

  // ── GDPR & AI ───────────────────────────────────────────────────────────
  // GdprAiLayout.jsx. Radar (Compliance Compass) maps cleanly. The doughnut's
  // category labels were absent from every legacy i18n dictionary, so its
  // [35,25,20,20] slices have no meaningful names — omitted rather than
  // labelled with guesses.
  'gdpr-ai': [
    {
      type: 'radar',
      titleKey: keys('gdpr-ai', 0).title,
      labelKeys: labelKeys('gdpr-ai', 0, 5),
      datasets: [
        { labelKey: keys('gdpr-ai', 0).series(0), data: [40, 20, 35, 15, 50] },
        { labelKey: keys('gdpr-ai', 0).series(1), data: [95, 88, 92, 90, 98] },
      ],
    },
  ],

  // ── MLOps in Production ─────────────────────────────────────────────────
  // MlopsLayout.jsx. Single line chart (performance over 12 months).
  'mlops-production': [
    {
      type: 'line',
      titleKey: keys('mlops-production', 0).title,
      captionKey: keys('mlops-production', 0).caption,
      labelKeys: labelKeys('mlops-production', 0, 6),
      datasets: [
        { labelKey: keys('mlops-production', 0).series(0), data: [95, 92, 85, 70, 55, 40] },
        { labelKey: keys('mlops-production', 0).series(1), data: [95, 95, 94, 95, 94, 95] },
      ],
    },
  ],

  // ── LLMSecOps ───────────────────────────────────────────────────────────
  // LlmSecOpsLayout.jsx. Radar (security perimeter) and doughnut (threat mix);
  // both have resolved labels and concrete data arrays.
  llmsecops: [
    {
      type: 'radar',
      titleKey: keys('llmsecops', 0).title,
      labelKeys: labelKeys('llmsecops', 0, 5),
      datasets: [
        { labelKey: keys('llmsecops', 0).series(0), data: [30, 15, 25, 40, 10] },
        { labelKey: keys('llmsecops', 0).series(1), data: [92, 95, 88, 98, 94] },
      ],
    },
    {
      type: 'doughnut',
      titleKey: keys('llmsecops', 1).title,
      labelKeys: labelKeys('llmsecops', 1, 4),
      datasets: [{ data: [35, 30, 20, 15] }],
    },
  ],

  // ── Agentic AI ──────────────────────────────────────────────────────────
  // AgenticAiLayout.jsx. The only chart is the radar "Reasoning Engine
  // Comparison" (chatbot vs. goal-driven agent); the rest of the layout was a
  // non-chart icon grid (the reasoning loop).
  'agentic-ai': [
    {
      type: 'radar',
      titleKey: keys('agentic-ai', 0).title,
      labelKeys: labelKeys('agentic-ai', 0, 5),
      datasets: [
        { labelKey: keys('agentic-ai', 0).series(0), data: [40, 30, 20, 15, 95] },
        { labelKey: keys('agentic-ai', 0).series(1), data: [95, 85, 99, 92, 80] },
      ],
    },
  ],
};

export const getBlogCharts = (slug: string): ChartDef[] => blogCharts[slug] ?? [];
