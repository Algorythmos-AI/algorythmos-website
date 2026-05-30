/**
 * Case-study catalogue — single source of truth for slugs + content routing.
 *
 * Two content shapes (mirrors the legacy split):
 *  - `i18nIndex` (the 4 standard studies): card copy lives in
 *    `caseStudies.items.<i18nIndex>.*`; detail copy in
 *    `caseStudyDetail.studies.<slug>.*`. Fully translated (EN/AU/FR).
 *  - inline EN (the 2 originally-hardcoded studies, healthcare-burden &
 *    admin-burden-evidence): card copy still comes from i18n
 *    (`caseStudies.items.4|5.*`, which is translated), but the long-form detail
 *    was hardcoded English in the legacy app, so we author concise, accurate EN
 *    prose here. No fabricated metrics — figures match the legacy reports.
 */
export interface InlineStudy {
  /** detail page <h1> */
  title: string;
  /** detail subtitle / meta line + meta description */
  meta: string;
  challenge: string;
  solution: string;
  /** bullet outcomes shown under "Results" */
  result: string[];
  /** closing line beside the CTA */
  cta: string;
}

export interface CaseStudy {
  slug: string;
  /** index into `caseStudies.items.N` — set for the 4 i18n-backed studies */
  i18nIndex?: number;
  /** authored EN detail content — set for the 2 originally-hardcoded studies */
  inline?: InlineStudy;
}

/**
 * Order mirrors the legacy index (featured evidence reports first), so the grid
 * matches the existing site.
 */
export const caseStudies: CaseStudy[] = [
  {
    slug: 'admin-burden-evidence',
    i18nIndex: 5,
    inline: {
      title: 'Administrative Burden: Verified Evidence',
      meta: 'A legal-grade evidence report quantifying the cost of healthcare administrative burden — built from court judgments, government research, and peer-reviewed safety data.',
      challenge:
        'Healthcare leaders know administrative burden is hurting clinicians and patients, but they lack unassailable, citable evidence to justify investment in digital transformation. Anecdote and survey sentiment are easy to dismiss; decisions of this scale need primary sources that hold up to scrutiny.',
      solution:
        'We assembled a "platinum standard" verification report that aggregates only verifiable primary sources — Supreme Court judgments, official government research, and peer-reviewed patient-safety studies — into a single, fully cited business case. Every figure is traceable back to its source so the argument is defensible end to end.',
      result: [
        'Quantified roughly $261M in legal liability tied to documentation and handover failures.',
        'Surfaced a ~$5.4B economic opportunity from reducing administrative friction.',
        'Linked delayed documentation to a measurable daily patient-safety risk, drawn from peer-reviewed readmission data.',
        'Delivered an irrefutable, legal-grade case for AI-assisted workflow modernisation.',
      ],
      cta: 'Want the same rigour applied to your own transformation business case?',
    },
  },
  {
    slug: 'healthcare-burden',
    i18nIndex: 4,
    inline: {
      title: 'Healthcare — Documentation Burden Analysis',
      meta: 'A system-wide analysis of the "Digital Disconnect" in Australian healthcare — where clinical care competes with administrative friction.',
      challenge:
        'Australian healthcare suffers from a "Digital Disconnect": clinicians spend nearly as much time on documentation as on direct patient care. The burden is fragmented across GP practices, nursing handovers, and disconnected systems, making its true scale — and the best places to intervene — hard to see.',
      solution:
        'We ran a comprehensive, data-driven analysis across the system: GP administrative load, nursing documentation efficiency, clinical-handover failure points, and interoperability gaps between Primary Health Networks. The findings were synthesised into a single view of where time and money are lost and where AI-assisted workflows would have the most leverage.',
      result: [
        'Estimated ~$2B in annual inefficiency cost from documentation burden nationwide.',
        'Mapped GP, nursing, and handover pain points to concrete intervention opportunities.',
        'Connected administrative load to clinician burnout and reduced patient access.',
        'Identified the highest-leverage targets for AI-powered workflow optimisation.',
      ],
      cta: 'Curious where AI could remove the most friction in your clinical workflows?',
    },
  },
  { slug: 'financial-compliance', i18nIndex: 0 },
  { slug: 'manufacturing-docs', i18nIndex: 1 },
  { slug: 'healthcare-mlops', i18nIndex: 2 },
  { slug: 'retail-sql', i18nIndex: 3 },
];

export const caseStudySlugs = caseStudies.map((c) => c.slug);
export const getCaseStudy = (slug: string): CaseStudy | undefined => caseStudies.find((c) => c.slug === slug);
