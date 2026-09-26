/**
 * Blog posts and case studies render "<seoTitle ?? title> | Algorythmos" and
 * "<seoDescription ?? meta>". Keep them inside the limits seo-validate enforces on
 * the built pages (title ≤ 60 rendered, description 70–160), in both locales,
 * so a new article fails here, before a build.
 */
import { describe, it, expect } from 'vitest';
import en from '../i18n/ui/en.global.json';
import fr from '../i18n/ui/fr.fr.json';
import { blogSlugs } from './blog';
import { caseStudySlugs } from './caseStudies';

const DICTS: [string, Record<string, string>][] = [
  ['en', en as Record<string, string>],
  ['fr', fr as Record<string, string>],
];
const len = (s: string) => [...s].length;
const SUFFIX = ' | Algorythmos';

const cases = [
  ...blogSlugs.map((s) => ['blog', `blogDetail.posts.${s}`] as const),
  ...caseStudySlugs.map((s) => ['case study', `caseStudyDetail.studies.${s}`] as const),
];

describe.each(cases)('%s %s', (_kind, base) => {
  it.each(DICTS)('has a title and description within limits (%s)', (_loc, d) => {
    const title = d[`${base}.seoTitle`] ?? d[`${base}.title`];
    const desc = d[`${base}.seoDescription`] ?? d[`${base}.meta`];
    expect(title, `${base}.title`).toBeTruthy();
    const rendered = /algorythmos/i.test(title) ? title : title + SUFFIX;
    expect(len(rendered), rendered).toBeLessThanOrEqual(60);
    expect(desc, `${base}.meta`).toBeTruthy();
    expect(len(desc)).toBeGreaterThanOrEqual(70);
    expect(len(desc)).toBeLessThanOrEqual(160);
  });
});
