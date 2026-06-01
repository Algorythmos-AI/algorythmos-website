/**
 * Case-study catalogue — single source of truth for slugs + content routing.
 *
 * Two content shapes (mirrors the legacy split):
 *  - `i18nIndex` (the 4 client studies): card copy lives in
 *    `caseStudies.items.<i18nIndex>.*`; detail copy in
 *    `caseStudyDetail.studies.<slug>.*`. Fully translated (EN/AU/FR).
 *  - inline EN (the 2 evidence/research studies, healthcare-burden &
 *    admin-burden-evidence): card copy still comes from i18n
 *    (`caseStudies.items.4|5.*`, which is translated), but the long-form detail
 *    is authored English here. No fabricated metrics — every figure matches the
 *    verified legal/clinical evidence reports.
 */
export interface InlineStudy {
  /** detail page <h1> + SEO <title> base */
  title: string;
  /** detail subtitle / on-page lead + meta description */
  meta: string;
  /** context band: sector */
  industry: string;
  /** context band: market */
  region: string;
  /** context band: engagement type / core focus */
  focus: string;
  challenge: string;
  /** ordered methodology steps shown under "Approach" */
  approach: string[];
  solution: string;
  /** bullet outcomes shown under "Results" */
  result: string[];
  /** closing line beside the CTA */
  cta: string;
  /** SEO keywords (JSON-LD) */
  keywords: string[];
}

export interface CaseStudy {
  slug: string;
  /** index into `caseStudies.items.N` — set for the 4 i18n-backed studies */
  i18nIndex?: number;
  /** authored EN detail content — set for the 2 evidence/research studies */
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
      title: 'The Citable Case for Healthcare Admin-Burden Reform',
      meta: 'A legal-grade evidence report on healthcare administrative burden, built only from primary sources to quantify the liability and economic opportunity for boards.',
      industry: 'Healthcare',
      region: 'Australia',
      focus: 'Evidence report',
      challenge: 'Healthcare executives know administrative burden is straining clinicians and patients, yet boards reject anecdote and survey sentiment when approving digital-transformation spend. To withstand scrutiny from finance, legal, and clinical-governance stakeholders, the case for change has to rest on primary sources that cannot be dismissed. The stakes are concrete: documentation and handover failures carry direct legal exposure, while administrative friction quietly consumes capacity the system cannot spare.',
      approach: [
        'Defined a strict admissibility bar, accepting only verifiable primary sources — court judgments, official government research, and peer-reviewed patient-safety studies — and excluding anything based on sentiment or estimation.',
        'Extracted and cross-checked every figure against its original source so each claim traces cleanly back to a citable document.',
        'Mapped the evidence to the three questions a board asks — legal exposure, economic opportunity, and patient-safety risk — and discarded findings that did not meet the bar.',
        'Assembled the verified findings into one fully cited business case structured for executive and governance review.',
      ],
      solution: 'The report aggregates only verifiable primary sources into a single "platinum standard" business case for AI-assisted workflow modernisation. Each figure is footnoted to its judgment, government dataset, or peer-reviewed study, so the argument holds together end to end and survives challenge from any stakeholder. Rather than asserting a conclusion, it hands decision-makers a defensible, source-by-source chain of reasoning they can put in front of a board.',
      result: [
        'Quantified roughly $261M in legal liability tied to documentation and clinical-handover failures, sourced directly from Supreme Court judgments.',
        'Established a ~$5.4B economic opportunity from reducing administrative friction, drawn from official government research.',
        'Linked delayed clinical documentation to a measurable daily patient-safety risk, grounded in peer-reviewed readmission data.',
        'Gave leaders a legal-grade, fully cited case that withstands scrutiny from finance, legal, and clinical-governance reviewers.',
        'Reframed administrative burden from a workforce-wellbeing concern into a board-level financial and safety risk that warrants action.',
      ],
      cta: 'Want the same evidentiary rigour applied to your own transformation business case?',
      keywords: [
        'healthcare administrative burden',
        'clinical documentation burden',
        'digital transformation business case',
        'healthcare liability evidence',
        'patient safety risk',
        'ai-assisted clinical workflows',
        'healthcare productivity australia',
        'evidence-based healthcare investment',
      ],
    },
  },
  {
    slug: 'healthcare-burden',
    i18nIndex: 4,
    inline: {
      title: 'Australia\'s Healthcare Digital Disconnect: Where AI Has Leverage',
      meta: 'An evidence report on Australia\'s healthcare documentation burden — clinicians spend nearly as much time on records as on care, costing roughly $2B a year.',
      industry: 'Healthcare',
      region: 'Australia',
      focus: 'Evidence report',
      challenge: 'Australian healthcare runs on a Digital Disconnect: clinicians spend nearly as much time documenting care as delivering it, with time split roughly 27.5% on direct patient care against 26.6% on documentation. The burden is scattered across GP practices, nursing handovers, and Primary Health Network systems that do not interoperate, so its true scale and its root causes stay hidden. Leaders sense the friction but lack a defensible, system-wide picture of where it originates and what it costs.',
      approach: [
        'We scoped the system into four evidence domains — GP administrative load, nursing documentation efficiency, clinical-handover failure points, and PHN interoperability gaps — to bound the analysis.',
        'We aggregated published figures for each domain into a normalised dataset, treating only verifiable primary sources as admissible.',
        'We modelled the lost-time and cost signal per practitioner and across the national workforce to size the inefficiency.',
        'We mapped each quantified pain point to the workflow stage where AI-assisted automation would remove the most friction.',
      ],
      solution: 'The report delivers a single, fully sourced view of where clinical time and money are lost across Australian healthcare, tracing the documentation burden from individual GP and nursing workflows up to system-wide interoperability gaps. It pairs each finding with the category of AI-assisted intervention — document intelligence over clinical records, automated handover capture, and workflow orchestration across disconnected systems — best suited to recover that time, giving decision-makers an ordered set of targets rather than a generic mandate.',
      result: [
        'Sized the documentation burden at roughly $2B in avoidable inefficiency across the national workforce each year.',
        'Quantified the loss per practitioner at about 621 clinical hours annually — close to 15.5 working weeks — alongside a personal cost of $10.5k to $23k per GP per year.',
        'Confirmed the strain on access and capacity: 66% of GPs are cutting appointment availability and 27% now see more than 150 patients each week, against a time split of about 27.5% patient care to 26.6% documentation.',
        'Connected sustained administrative load to clinician burnout and the erosion of patient access, naming it as a system risk rather than an individual failing.',
        'Produced an ordered set of highest-leverage targets for AI-assisted workflow modernisation, each tied back to a verifiable source.',
      ],
      cta: 'Curious where AI could remove the most friction across your own clinical workflows?',
      keywords: [
        'healthcare documentation burden',
        'australian healthcare ai',
        'clinical workflow automation',
        'gp administrative load',
        'clinical handover failures',
        'phn interoperability',
        'document intelligence healthcare',
        'clinician burnout',
      ],
    },
  },
  { slug: 'financial-compliance', i18nIndex: 0 },
  { slug: 'manufacturing-docs', i18nIndex: 1 },
  { slug: 'healthcare-mlops', i18nIndex: 2 },
  { slug: 'retail-sql', i18nIndex: 3 },
];

export const caseStudySlugs = caseStudies.map((c) => c.slug);
export const getCaseStudy = (slug: string): CaseStudy | undefined => caseStudies.find((c) => c.slug === slug);
