/**
 * Case-study catalogue — single source of truth for slugs + content routing.
 *
 * All copy is i18n-backed (EN/AU/FR):
 *  - card copy lives in `caseStudies.items.<i18nIndex>.*`
 *  - detail copy lives in `caseStudyDetail.studies.<slug>.*`
 *    (title, meta, industry, region, focus, challenge, approach.0-3, solution,
 *    results.0-4, cta, keywords — resolved in CaseStudyDetail.astro)
 *
 * Evidence/research studies (dram-4f2-cell-architecture,
 * signals-fibre-satellites-orbital-compute,
 * ai-robotics-space-bitcoin-convergence, port-botany-ai-ml, healthcare-burden,
 * admin-burden-evidence) carry a `badge`; client engagements (`kind: 'client'`)
 * carry the "Client engagement · anonymised" badge and note; representative
 * engagements carry a `note` flagging the figures as illustrative. No fabricated
 * metrics.
 */
/**
 * Listing-page grouping, in display order. Derived from what each study already
 * says about itself — never upgrade a study's category without changing its note:
 *  - client   — delivered engagements, anonymised, figures as measured (`kind: 'client'`)
 *  - industry — representative engagements; figures illustrative, not client results
 *  - research — evidence reports built from cited public sources
 */
export const CASE_STUDY_CATEGORIES = ['client', 'industry', 'research'] as const;
export type CaseStudyCategory = (typeof CASE_STUDY_CATEGORIES)[number];

export interface CaseStudy {
  slug: string;
  /** Which listing section the study appears in. */
  category: CaseStudyCategory;
  /** index into `caseStudies.items.N` — card copy on the listing page */
  i18nIndex: number;
  /** ISO date first published (Article.datePublished + sitemap lastmod). */
  date: string;
  /** ISO date of the last substantive revision (Article.dateModified). */
  updatedAt?: string;
  /**
   * 'client' = a real, delivered engagement published anonymised with the client's
   * permission; its figures are as measured (source: Sam's fact sheets). Service
   * pages may show its headline stat in the "In practice" card.
   */
  kind?: 'client';
}

/**
 * Order mirrors the legacy index (featured evidence reports first), so the grid
 * matches the existing site.
 */
export const caseStudies: CaseStudy[] = [
  { slug: 'dram-4f2-cell-architecture', i18nIndex: 14, category: 'research', date: '2026-10-13' },
  { slug: 'signals-fibre-satellites-orbital-compute', i18nIndex: 12, category: 'research', date: '2026-10-13' },
  { slug: 'ai-robotics-space-bitcoin-convergence', i18nIndex: 11, category: 'research', date: '2026-10-11' },
  { slug: 'port-botany-ai-ml', i18nIndex: 6, category: 'research', date: '2026-09-25' },
  { slug: 'admin-burden-evidence', i18nIndex: 5, category: 'research', date: '2026-08-11' },
  { slug: 'healthcare-burden', i18nIndex: 4, category: 'research', date: '2026-05-31', updatedAt: '2026-08-11' },
  { slug: 'clinical-document-ai', i18nIndex: 7, category: 'client', date: '2026-09-27', kind: 'client' },
  { slug: 'ml-deployment-platform', i18nIndex: 8, category: 'client', date: '2026-09-27', kind: 'client' },
  { slug: 'model-monitoring-logistics', i18nIndex: 9, category: 'client', date: '2026-09-27', kind: 'client' },
  { slug: 'retail-data-foundation', i18nIndex: 10, category: 'client', date: '2026-09-27', kind: 'client' },
  { slug: 'satellite-link-monitoring', i18nIndex: 13, category: 'industry', date: '2026-10-13' },
  { slug: 'financial-compliance', i18nIndex: 0, category: 'industry', date: '2026-05-31', updatedAt: '2026-09-25' },
  { slug: 'manufacturing-docs', i18nIndex: 1, category: 'industry', date: '2026-05-31', updatedAt: '2026-09-25' },
  { slug: 'healthcare-mlops', i18nIndex: 2, category: 'industry', date: '2026-05-31', updatedAt: '2026-09-25' },
  { slug: 'retail-sql', i18nIndex: 3, category: 'industry', date: '2026-05-31', updatedAt: '2026-09-25' },
];

export const caseStudySlugs = caseStudies.map((c) => c.slug);
export const getCaseStudy = (slug: string): CaseStudy | undefined => caseStudies.find((c) => c.slug === slug);

/**
 * Studies grouped for the listing page: categories in `CASE_STUDY_CATEGORIES`
 * order, catalogue order within each, empty groups dropped (so an empty section
 * can never render).
 */
export function groupedCaseStudies(list: CaseStudy[] = caseStudies): { category: CaseStudyCategory; items: CaseStudy[] }[] {
  return CASE_STUDY_CATEGORIES.map((category) => ({ category, items: list.filter((c) => c.category === category) })).filter(
    (g) => g.items.length > 0,
  );
}
