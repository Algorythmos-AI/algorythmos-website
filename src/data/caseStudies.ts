/**
 * Case-study catalogue — single source of truth for slugs + content routing.
 *
 * All copy is i18n-backed (EN/AU/FR):
 *  - card copy lives in `caseStudies.items.<i18nIndex>.*`
 *  - detail copy lives in `caseStudyDetail.studies.<slug>.*`
 *    (title, meta, industry, region, focus, challenge, approach.0-3, solution,
 *    results.0-4, cta, keywords — resolved in CaseStudyDetail.astro)
 *
 * Evidence/research studies (port-botany-ai-ml, healthcare-burden,
 * admin-burden-evidence) cite their public sources via `sources.N.{label,url}`
 * and carry a `badge`; representative engagements carry a `note` flagging the
 * figures as illustrative. No fabricated metrics.
 */
export interface CaseStudy {
  slug: string;
  /** index into `caseStudies.items.N` — card copy on the listing page */
  i18nIndex: number;
  /** ISO date first published (Article.datePublished + sitemap lastmod). */
  date: string;
  /** ISO date of the last substantive revision (Article.dateModified). */
  updatedAt?: string;
}

/**
 * Order mirrors the legacy index (featured evidence reports first), so the grid
 * matches the existing site.
 */
export const caseStudies: CaseStudy[] = [
  { slug: 'port-botany-ai-ml', i18nIndex: 6, date: '2026-09-25' },
  { slug: 'admin-burden-evidence', i18nIndex: 5, date: '2026-08-11' },
  { slug: 'healthcare-burden', i18nIndex: 4, date: '2026-05-31', updatedAt: '2026-08-11' },
  { slug: 'financial-compliance', i18nIndex: 0, date: '2026-05-31', updatedAt: '2026-09-25' },
  { slug: 'manufacturing-docs', i18nIndex: 1, date: '2026-05-31', updatedAt: '2026-09-25' },
  { slug: 'healthcare-mlops', i18nIndex: 2, date: '2026-05-31', updatedAt: '2026-09-25' },
  { slug: 'retail-sql', i18nIndex: 3, date: '2026-05-31', updatedAt: '2026-09-25' },
];

export const caseStudySlugs = caseStudies.map((c) => c.slug);
export const getCaseStudy = (slug: string): CaseStudy | undefined => caseStudies.find((c) => c.slug === slug);
