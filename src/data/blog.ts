/**
 * Clean blog catalogue (single source of truth for the Blog section).
 *
 * The actual copy lives in the i18n dictionaries (zero duplication):
 *  - index metadata  → `blog.posts.<postIndex>.{title,snippet,date}`
 *  - post body        → `blogDetail.posts.<slug>.*`
 *
 * This module only carries the structural facts the routes/components need:
 * the published slug, its index position (`blog.posts.N`), an ISO date for
 * machine-readable schema, and a description of the post body so the page can
 * render prose uniformly without porting the legacy chart layouts.
 *
 * Only the 6 slugs with index metadata are published here (the other slugs
 * referenced in the legacy detail page have no index entry — excluded to avoid
 * orphan/404 pages).
 */

/** One renderable block within a post body. */
export type BlogBlock =
  /** A `<section>` keyed off `blogDetail.posts.<slug>.<base>.*` with a heading + prose. */
  | {
      kind: 'prose';
      /** Key prefix under the post, e.g. `content.0`. */
      base: string;
      /** Indices for `<base>.paragraphs.N`, if any. */
      paragraphs?: number[];
      /** Indices for `<base>.<listKey>.N`, if any. */
      list?: number[];
      /** Sub-key holding the list items (default `list`; pulse uses `points`). */
      listKey?: string;
    }
  /** A placeholder where a legacy chart/visualisation lived (rendered as a TODO island). */
  | { kind: 'chart'; label: string };

export interface BlogPost {
  slug: string;
  /** Index into the `blog.posts.N.*` dictionary keys (title/snippet/date). */
  postIndex: number;
  /** Machine-readable publish date (ISO 8601) for Article schema. */
  date: string;
  /**
   * Last substantive revision (ISO 8601) — set ONLY when a post is genuinely
   * updated. Feeds BlogPosting.dateModified, sitemap lastmod, and RSS.
   */
  updatedAt?: string;
  /** Ordered body blocks resolved from `blogDetail.posts.<slug>.*` keys. */
  body: BlogBlock[];
}

export const blog: BlogPost[] = [
  {
    slug: 'ai-automation-australian-smes',
    postIndex: 12,
    date: '2026-07-12',
    body: [
      { kind: 'prose', base: 'content.0', paragraphs: [0, 1] },
      { kind: 'prose', base: 'content.1', list: [0, 1, 2, 3, 4] },
      { kind: 'prose', base: 'content.2', paragraphs: [0, 1] },
      { kind: 'prose', base: 'content.3', paragraphs: [0, 1] },
    ],
  },
  {
    slug: 'eu-ai-act-gdpr-sme-roadmap',
    postIndex: 13,
    date: '2026-07-12',
    body: [
      { kind: 'prose', base: 'content.0', paragraphs: [0, 1] },
      { kind: 'prose', base: 'content.1', list: [0, 1, 2, 3] },
      { kind: 'prose', base: 'content.2', paragraphs: [0, 1] },
      { kind: 'prose', base: 'content.3', list: [0, 1, 2, 3, 4] },
    ],
  },
  {
    slug: 'pulse-clinical-ai',
    postIndex: 10,
    date: '2026-01-15',
    // Bespoke key shape (no `content.N`): context → diagnosis → method → execution → cta.
    body: [
      { kind: 'prose', base: 'context', paragraphs: [] },
      { kind: 'chart', label: 'Funding vs. System Access (2020-2024)' },
      { kind: 'prose', base: 'diagnosis', paragraphs: [] },
      { kind: 'prose', base: 'method', list: [0, 1, 2], listKey: 'points' },
      { kind: 'chart', label: 'Efficiency Uplift Projection' },
      { kind: 'prose', base: 'execution', paragraphs: [] },
    ],
  },
  {
    slug: 'ai-consultancy-australia',
    postIndex: 9,
    date: '2025-10-15',
    body: [
      { kind: 'prose', base: 'content.0', paragraphs: [0, 1, 2, 3] },
      { kind: 'prose', base: 'content.1', list: [0, 1, 2, 3] },
      { kind: 'chart', label: 'AI Maturity: AU SME vs Global Leader' },
    ],
  },
  {
    slug: 'gdpr-ai',
    postIndex: 0,
    date: '2025-08-15',
    body: [
      { kind: 'prose', base: 'content.0', paragraphs: [0, 1] },
      { kind: 'prose', base: 'content.1', list: [0, 1, 2, 3] },
      { kind: 'prose', base: 'content.2', paragraphs: [0, 1] },
      { kind: 'chart', label: 'Compliance Compass' },
    ],
  },
  {
    slug: 'mlops-production',
    postIndex: 1,
    date: '2025-07-15',
    body: [
      { kind: 'prose', base: 'content.0', paragraphs: [0, 1, 2] },
      { kind: 'prose', base: 'content.1', list: [0, 1, 2, 3] },
      { kind: 'prose', base: 'content.2', paragraphs: [0] },
      { kind: 'chart', label: 'The Performance Drift Crisis' },
    ],
  },
  {
    slug: 'agentic-ai',
    postIndex: 2,
    date: '2025-06-15',
    body: [
      { kind: 'prose', base: 'content.0', paragraphs: [0, 1] },
      { kind: 'prose', base: 'content.1', list: [0, 1, 2, 3] },
      { kind: 'prose', base: 'content.2', paragraphs: [0, 1] },
      { kind: 'chart', label: 'Agentic Capability Matrix' },
    ],
  },
  {
    slug: 'llmsecops',
    postIndex: 3,
    date: '2025-05-15',
    body: [
      { kind: 'prose', base: 'content.0', paragraphs: [0, 1] },
      { kind: 'prose', base: 'content.1', list: [0, 1, 2, 3] },
      { kind: 'prose', base: 'content.2', paragraphs: [0] },
      { kind: 'chart', label: 'Security Lifecycle Phases' },
    ],
  },
];

export const blogSlugs = blog.map((p) => p.slug);
export const getPost = (slug: string): BlogPost | undefined => blog.find((p) => p.slug === slug);
