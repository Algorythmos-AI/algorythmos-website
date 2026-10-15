/**
 * Guards the listing-page grouping. The category is an honesty claim — "client"
 * means delivered, measured work — so it must agree with what each study's own
 * flags and notes already say.
 */
import { describe, it, expect } from 'vitest';
import en from '../i18n/ui/en.global.json';
import fr from '../i18n/ui/fr.fr.json';
import { caseStudies, caseStudySlugs, CASE_STUDY_CATEGORIES, groupedCaseStudies } from './caseStudies';

const DICTS: [string, Record<string, string>][] = [
  ['en', en as Record<string, string>],
  ['fr', fr as Record<string, string>],
];

describe('case-study categories', () => {
  it('gives every study a known category', () => {
    for (const c of caseStudies) expect(CASE_STUDY_CATEGORIES, c.slug).toContain(c.category);
  });

  it('has no empty category', () => {
    for (const cat of CASE_STUDY_CATEGORIES) expect(caseStudies.some((c) => c.category === cat), cat).toBe(true);
  });

  it('labels a study "client" exactly when it is a client engagement', () => {
    for (const c of caseStudies) expect(c.category === 'client', c.slug).toBe(c.kind === 'client');
  });

  it('flags every industry (representative) study as illustrative', () => {
    for (const c of caseStudies.filter((s) => s.category === 'industry'))
      for (const [loc, d] of DICTS) expect(d[`caseStudyDetail.studies.${c.slug}.note`], `${loc} ${c.slug}`).toBeTruthy();
  });

  it('groups every study exactly once, in category order', () => {
    const groups = groupedCaseStudies();
    expect(groups.map((g) => g.category)).toEqual([...CASE_STUDY_CATEGORIES]);
    expect(groups.flatMap((g) => g.items.map((c) => c.slug)).sort()).toEqual([...caseStudySlugs].sort());
  });

  it('drops empty groups', () => {
    expect(groupedCaseStudies(caseStudies.filter((c) => c.category !== 'industry')).map((g) => g.category)).toEqual(['client', 'research']);
  });

  it.each(DICTS)('has listing copy for every category (%s)', (_loc, d) => {
    expect(d['caseStudies.categories.nav']).toBeTruthy();
    for (const cat of CASE_STUDY_CATEGORIES)
      for (const k of ['title', 'description', 'chip']) expect(d[`caseStudies.categories.${cat}.${k}`], `${cat}.${k}`).toBeTruthy();
  });
});
