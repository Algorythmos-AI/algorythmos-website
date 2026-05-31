/**
 * Per-case-study chart data for the two data-heavy inline studies.
 *
 * Figures are copied verbatim from the legacy react-chartjs-2 visualisations
 * (legacy/src/pages/insights/*Content.jsx); labels come from the legacy EN
 * i18n bundle (legacy/src/app/i18n/en.global.json). These are verified-evidence
 * figures (legal / clinical), so nothing here is computed or estimated — charts
 * whose values were illustrative, conceptual, or unsourced were intentionally
 * omitted rather than reproduced.
 *
 * Consumed by src/components/pages/CaseStudyDetail.astro. The shared Chart
 * island (src/components/islands/Chart.tsx) applies all theme colours, so only
 * labels + numeric data + a required accessible title are provided here.
 */
import type { ChartType } from '@/components/islands/Chart';

export interface CaseStudyChart {
  type: ChartType;
  /** Accessible chart title (required by the island). */
  title: string;
  /** Optional supporting line shown beneath the chart heading. */
  caption?: string;
  data: {
    labels: string[];
    datasets: Array<{ label?: string; data: number[] }>;
  };
}

/** slug → ordered list of charts to render on the detail page. */
export const caseStudyCharts: Record<string, CaseStudyChart[]> = {
  /**
   * Source: legacy/src/pages/insights/HealthcareBurdenContent.jsx
   * (the interactive Leaflet PHN map and the unsourced "Pain Intensity"
   * PolarArea are intentionally not ported.)
   */
  'healthcare-burden': [
    {
      // timeDistData — Doughnut, lines ~207-220
      type: 'doughnut',
      title: 'The care paradox: how a clinician’s day splits',
      caption: 'Share of working time — direct patient care vs documentation vs other tasks.',
      data: {
        labels: ['Direct Care', 'Documentation', 'Other'],
        datasets: [{ label: '% of time', data: [27.5, 26.6, 45.9] }],
      },
    },
    {
      // gpImpact Bar — lines ~525-536
      type: 'bar',
      title: 'How documentation load changes GP practice',
      caption: 'Share of GPs reporting each operational change driven by administrative burden.',
      data: {
        labels: ['Reduced Appt Slots', 'Limited Patient Time', 'Reduced Work Hours'],
        datasets: [{ label: '% of GPs', data: [66, 60, 51] }],
      },
    },
    {
      // patientVolumeData — Doughnut, lines ~223-234
      type: 'doughnut',
      title: 'GP patient-volume overload',
      caption: 'Proportion of GPs carrying a high-volume (>150 patient) load versus a standard load.',
      data: {
        labels: ['>150 Patients (Overload)', 'Standard Load'],
        datasets: [{ label: '% of GPs', data: [27, 73] }],
      },
    },
    {
      // burnoutData — Bar, lines ~237-249
      type: 'bar',
      title: 'GP burnout and its administrative share',
      caption: 'Total reported GP burnout rate and the portion attributed to administrative work.',
      data: {
        labels: ['Total GP Burnout', 'Admin-Driven'],
        datasets: [{ label: 'Rate %', data: [32, 21] }],
      },
    },
    {
      // nursingTurnaroundData — Bar, lines ~252-264
      type: 'bar',
      title: 'Medication turnaround: paper vs EMR',
      caption: 'Average minutes per medication process — paper-based workflow versus an EMR system.',
      data: {
        labels: ['Paper Process', 'EMR System'],
        datasets: [{ label: 'Minutes', data: [120, 35] }],
      },
    },
    {
      // retentionData — Bar, lines ~267-280
      type: 'bar',
      title: 'Information retention at clinical handover',
      caption: 'Retention rate by handover method — verbal only, verbal with notes, and printed handout.',
      data: {
        labels: ['Verbal Only', 'Verbal + Notes', 'Printed Handout'],
        datasets: [{ label: 'Retention Rate %', data: [2.5, 85.5, 99] }],
      },
    },
    {
      // satisfactionData — Bar, lines ~303-315
      type: 'bar',
      title: 'Job satisfaction by practice setting',
      caption: 'Reported GP job satisfaction — salaried (ACCHO) versus private practice.',
      data: {
        labels: ['Salaried (ACCHO)', 'Private Practice'],
        datasets: [{ label: 'Job Satisfaction %', data: [88, 58] }],
      },
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
      title: 'Total legal liability exposure',
      caption: 'Court-verified settlement amounts ($M). Sources: [2024] NSWSC 1171; VID705/2022.',
      data: {
        labels: ['NSW Health', 'ACT Health', 'Total Liability'],
        datasets: [{ label: 'Settlement Amount ($M)', data: [229.8, 31.5, 261.3] }],
      },
    },
    {
      // workforceData — Doughnut, lines ~106-114
      type: 'doughnut',
      title: 'GPs planning to cease practice within 5 years',
      caption: 'Source: RACGP Health of the Nation 2024; Commonwealth Fund 2025.',
      data: {
        labels: ['Plan to Cease (5yrs)', 'Staying'],
        datasets: [{ label: '% of GPs', data: [32, 68] }],
      },
    },
  ],
};
