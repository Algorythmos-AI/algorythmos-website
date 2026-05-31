/**
 * Real chart data for blog posts, harvested verbatim from the legacy React
 * layouts (archived under `legacy/`). These replace the "chart coming soon"
 * placeholders in `BlogPostPage.astro`.
 *
 * Every numeric array, label and dataset name below is copied exactly from the
 * original `react-chartjs-2` `data={{ ... }}` definitions — no figures are
 * invented. Where a legacy chart could not be represented faithfully with the
 * shared island's `{ labels, datasets: [{ label?, data: number[] }] }` shape
 * (bubble charts use `{x,y,r}` objects; one combo chart mixed bar+line) or its
 * labels were unresolved in the i18n dictionaries, that chart is omitted and
 * documented inline rather than fabricated.
 *
 * The shared island (`@/components/islands/Chart`) applies all theme colours, so
 * only labels + numeric data + an accessible title are provided here. Props are
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
import type { ChartType } from '@/components/islands/Chart';

export interface BlogChart {
  type: ChartType;
  /** Accessible label describing what the chart shows (required by the island). */
  title: string;
  /** Optional supporting note rendered under the chart heading. */
  caption?: string;
  data: {
    labels: string[];
    datasets: Array<{ label?: string; data: number[] }>;
  };
}

export const blogCharts: Record<string, BlogChart[]> = {
  // ── Pulse: Clinical AI ──────────────────────────────────────────────────
  // PulseContent.jsx. The hero was a bar+line combo; since the island maps a
  // single `type` to every dataset, both index-based yearly series are rendered
  // as lines (the "divergence" story is preserved). The Scribe doughnut, ED-wait
  // bar, discharge line and method (efficiency) bar all map cleanly.
  'pulse-clinical-ai': [
    {
      type: 'line',
      title: 'Funding vs. System Access (2020-2024)',
      caption:
        'The divergence indicates systemic workflow paralysis rather than a lack of funding.',
      data: {
        labels: ['2020', '2021', '2022', '2023', '2024'],
        datasets: [
          { label: 'Healthcare Funding', data: [100, 108, 115, 122, 130] },
          { label: 'System Wait Times', data: [100, 110, 128, 145, 160] },
        ],
      },
    },
    {
      type: 'doughnut',
      title: 'The "Scribe" Tax',
      caption: 'Share of a clinician’s time spent on care vs. documentation.',
      data: {
        labels: ['Clinical Care', 'Documentation Tax'],
        datasets: [{ data: [58, 42] }],
      },
    },
    {
      type: 'bar',
      title: 'Result Chasing',
      data: {
        labels: ['Result Chasing', 'Wait for Bed', 'Triage'],
        datasets: [{ label: 'Minutes per Patient', data: [45, 30, 15] }],
      },
    },
    {
      type: 'line',
      title: 'Discharge Lag',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        datasets: [{ label: 'Bed Block Spike', data: [12, 18, 15, 25, 60] }],
      },
    },
    {
      type: 'bar',
      title: 'Efficiency Uplift Projection',
      data: {
        labels: [
          'Clinician Hours Reclaimed',
          'ED Flow Improvement',
          'Revenue Capture Gain',
        ],
        datasets: [{ label: '% Improvement Potential', data: [25, 15, 6] }],
      },
    },
  ],

  // ── AI Consultancy (Australia) ──────────────────────────────────────────
  // AiConsultancyLayout.jsx. Radar (maturity) and line (ROI J-curve) map
  // cleanly. The "Vendor Landscape" bubble chart used {x,y,r} point objects,
  // which the island's number[] dataset shape cannot represent — omitted.
  'ai-consultancy-australia': [
    {
      type: 'radar',
      title: 'AI Maturity: AU SME vs Global Leader',
      data: {
        labels: ['Tech Adoption', 'Strategy', 'Governance', 'Talent', 'Data Quality'],
        datasets: [
          { label: 'Average AU SME', data: [35, 42, 28, 30, 45] },
          { label: 'Global AI Leader', data: [88, 92, 85, 94, 90] },
        ],
      },
    },
    {
      type: 'line',
      title: "ROI Projection: The 'J-Curve' Effect",
      caption:
        'The value inflection point typically occurs around month 9, as automation efficiency overtakes operational overhead.',
      data: {
        labels: [
          'Month 0',
          'Month 3',
          'Month 6',
          'Month 9',
          'Month 12',
          'Month 18',
          'Month 24',
        ],
        datasets: [
          { label: 'Operational Overhead', data: [100, 95, 88, 75, 60, 45, 35] },
          { label: 'AI Generated Value', data: [0, 10, 35, 80, 150, 280, 450] },
        ],
      },
    },
  ],

  // ── GDPR & AI ───────────────────────────────────────────────────────────
  // GdprAiLayout.jsx. Radar (Compliance Compass) maps cleanly. The doughnut's
  // category labels (gdpr-ai.chart.labels.*) and title are absent from every
  // i18n dictionary, so its [35,25,20,20] slices have no meaningful names —
  // omitted rather than labelled with guesses.
  'gdpr-ai': [
    {
      type: 'radar',
      title: 'Compliance Compass',
      data: {
        labels: [
          'Data Mapping',
          'DPIA Readiness',
          'Transparency',
          'Model Governance',
          'Security',
        ],
        datasets: [
          { label: 'Legacy SME', data: [40, 20, 35, 15, 50] },
          { label: 'GDPR-Ready AI', data: [95, 88, 92, 90, 98] },
        ],
      },
    },
  ],

  // ── MLOps in Production ─────────────────────────────────────────────────
  // MlopsLayout.jsx. Single line chart (performance over 12 months).
  'mlops-production': [
    {
      type: 'line',
      title: 'The Performance Drift Crisis',
      caption:
        'Without MLOps, models are wasting assets. With MLOps, they are appreciating investments.',
      data: {
        labels: ['M0', 'M1', 'M3', 'M6', 'M9', 'M12'],
        datasets: [
          { label: 'No MLOps (Drift)', data: [95, 92, 85, 70, 55, 40] },
          { label: 'Pulse MLOps (Continuous)', data: [95, 95, 94, 95, 94, 95] },
        ],
      },
    },
  ],

  // ── LLMSecOps ───────────────────────────────────────────────────────────
  // LlmSecOpsLayout.jsx. Radar (security perimeter) and doughnut (threat mix);
  // both have resolved labels and concrete data arrays.
  llmsecops: [
    {
      type: 'radar',
      title: 'Security Perimeter Audit',
      data: {
        labels: ['Prompt Filter', 'Data Masking', 'Hardening', 'Access Control', 'Audit'],
        datasets: [
          { label: 'Ad-hoc Setup', data: [30, 15, 25, 40, 10] },
          { label: 'LLMSecOps Framework', data: [92, 95, 88, 98, 94] },
        ],
      },
    },
    {
      type: 'doughnut',
      title: 'LLM Vulnerability Mix',
      data: {
        labels: [
          'Prompt Injection',
          'Data Leakage',
          'Insecure Output',
          'Model Poisoning',
        ],
        datasets: [{ data: [35, 30, 20, 15] }],
      },
    },
  ],

  // ── Agentic AI ──────────────────────────────────────────────────────────
  // AgenticAiLayout.jsx. The only chart is the radar "Reasoning Engine
  // Comparison" (chatbot vs. goal-driven agent); the rest of the layout was a
  // non-chart icon grid (the reasoning loop).
  'agentic-ai': [
    {
      type: 'radar',
      title: 'Reasoning Engine Comparison',
      data: {
        labels: ['Reasoning', 'Memory', 'Tool Access', 'Task Autonomy', 'Speed'],
        datasets: [
          { label: 'Standard Chatbot', data: [40, 30, 20, 15, 95] },
          { label: 'Goal-Driven Agent', data: [95, 85, 99, 92, 80] },
        ],
      },
    },
  ],
};

export const getBlogCharts = (slug: string): BlogChart[] => blogCharts[slug] ?? [];
