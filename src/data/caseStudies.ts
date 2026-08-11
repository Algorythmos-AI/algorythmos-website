/**
 * Case-study catalogue — single source of truth for slugs + content routing.
 *
 * All copy is i18n-backed (EN/AU/FR):
 *  - card copy lives in `caseStudies.items.<i18nIndex>.*`
 *  - detail copy lives in `caseStudyDetail.studies.<slug>.*`
 *    (title, meta, industry, region, focus, challenge, approach.0-3, solution,
 *    results.0-4, cta, keywords — resolved in CaseStudyDetail.astro)
 *
 * The two evidence/research studies (healthcare-burden, admin-burden-evidence)
 * were migrated from inline English objects to the dictionaries so the FR site
 * renders fully in French. No fabricated metrics — every figure matches the
 * verified legal/clinical evidence reports.
 */
export interface CaseStudy {
  slug: string;
  /** index into `caseStudies.items.N` — card copy on the listing page */
  i18nIndex: number;
}

/**
 * Order mirrors the legacy index (featured evidence reports first), so the grid
 * matches the existing site.
 */
export const caseStudies: CaseStudy[] = [
  { slug: 'admin-burden-evidence', i18nIndex: 5 },
  { slug: 'healthcare-burden', i18nIndex: 4 },
  { slug: 'financial-compliance', i18nIndex: 0 },
  { slug: 'manufacturing-docs', i18nIndex: 1 },
  { slug: 'healthcare-mlops', i18nIndex: 2 },
  { slug: 'retail-sql', i18nIndex: 3 },
];

export const caseStudySlugs = caseStudies.map((c) => c.slug);
export const getCaseStudy = (slug: string): CaseStudy | undefined => caseStudies.find((c) => c.slug === slug);
