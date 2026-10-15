/**
 * Co-authored case studies. A co-author is a named organisation, so every slug
 * must resolve to an approved partner with a site URL and a label in both
 * locales; studies without co-authors stay single-author.
 */
import { describe, it, expect } from 'vitest';
import en from '../i18n/ui/en.global.json';
import fr from '../i18n/ui/fr.fr.json';
import { caseStudies } from './caseStudies';
import { getPartnerLink, partnerSite } from './partners';

const coAuthored = caseStudies.filter((c) => c.coAuthors?.length);

describe('case-study co-authors', () => {
  it('the MBSC Australia mining report is co-authored, and it is the only one', () => {
    expect(coAuthored.map((c) => c.slug)).toEqual(['ai-in-mining-mbsc']);
  });

  it.each(coAuthored.map((c) => [c.slug, c.coAuthors!] as const))('%s names only approved partners', (_slug, slugs) => {
    expect(new Set(slugs).size, 'no duplicates').toBe(slugs.length);
    for (const s of slugs) {
      const p = getPartnerLink(s);
      expect(p, s).toBeDefined();
      expect(partnerSite(s), `${s} site`).toMatch(/^https:\/\/[^?]+$/);
      for (const d of [en, fr] as Record<string, string>[]) expect(d[p!.labelKey], p!.labelKey).toBeTruthy();
    }
  });

  it('the byline lead exists in both locales', () => {
    for (const d of [en, fr] as Record<string, string>[]) expect(d['caseStudyDetail.byline.lead']).toBeTruthy();
  });

  it('a co-authored study says so in its badge, in both locales', () => {
    for (const c of coAuthored) {
      for (const d of [en, fr] as Record<string, string>[]) {
        const badge = d[`caseStudyDetail.studies.${c.slug}.badge`];
        for (const s of c.coAuthors!) expect(badge).toContain(getPartnerLink(s)!.name);
      }
    }
  });
});
