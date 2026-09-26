/**
 * Every hand-curated related link must resolve. RelatedLinks.astro drops an
 * unknown slug silently, so a typo would otherwise just vanish from the page.
 */
import { describe, it, expect } from 'vitest';
import { serviceRelated, blogRelated, caseStudyRelated, type RelatedRef } from './related';
import { serviceSlugs } from './services';
import { blogSlugs } from './blog';
import { caseStudySlugs } from './caseStudies';

const known: Record<RelatedRef['type'], string[]> = {
  service: serviceSlugs,
  blog: blogSlugs,
  'case-study': caseStudySlugs,
};

describe.each([
  ['serviceRelated', serviceRelated, serviceSlugs],
  ['blogRelated', blogRelated, blogSlugs],
  ['caseStudyRelated', caseStudyRelated, caseStudySlugs],
] as const)('%s', (_name, map, owners) => {
  it('is keyed by real slugs', () => {
    for (const key of Object.keys(map)) expect(owners, key).toContain(key);
  });
  it('points only at pages that exist', () => {
    for (const [owner, refs] of Object.entries(map)) {
      for (const r of refs) expect(known[r.type], `${owner} → ${r.type}/${r.slug}`).toContain(r.slug);
    }
  });
});
