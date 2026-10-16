/**
 * Guards the listing-page grouping. The category is an honesty claim — "client"
 * means delivered, measured work — so it must agree with what each study's own
 * flags and notes already say.
 */
import { describe, it, expect } from 'vitest';
import en from '../i18n/ui/en.global.json';
import fr from '../i18n/ui/fr.fr.json';
import { caseStudies, caseStudySlugs, CASE_STUDY_CATEGORIES, CASE_STUDY_SECTORS, groupedCaseStudies, latestCaseStudy, siblingCaseStudies } from './caseStudies';
import { categoryStyles } from './caseStudyCategories';
import { readFileSync } from 'node:fs';

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

describe('case-study listing page', () => {
  it('gives every study a known sector, and every used sector a label', () => {
    for (const c of caseStudies) expect(CASE_STUDY_SECTORS, c.slug).toContain(c.sector);
    for (const [loc, d] of DICTS)
      for (const s of new Set(caseStudies.map((c) => c.sector))) expect(d[`caseStudies.filter.sector.${s}`], `${loc} ${s}`).toBeTruthy();
  });

  it('styles every category, with art that BlueprintArt draws', () => {
    const art = readFileSync(new URL('../components/ui/BlueprintArt.astro', import.meta.url), 'utf-8');
    for (const cat of CASE_STUDY_CATEGORIES) {
      const s = categoryStyles[cat];
      expect(s.icon, cat).toMatch(/^M/);
      expect(s.rgb, cat).toMatch(/^var\(--[a-z-]+\)$/);
      expect(art).toContain(`kind === '${s.art}'`);
    }
  });

  it('spotlights the newest study, first in catalogue order on a tie', () => {
    const newest = [...caseStudies].map((c) => c.date).sort().at(-1);
    expect(latestCaseStudy()?.date).toBe(newest);
    expect(latestCaseStudy()).toBe(caseStudies.find((c) => c.date === newest));
    expect(latestCaseStudy([])).toBeUndefined();
  });

  it.each(DICTS)('has hub, filter and CTA copy (%s)', (_loc, d) => {
    for (const cat of CASE_STUDY_CATEGORIES) expect(d[`caseStudies.categories.${cat}.audience`], cat).toBeTruthy();
    for (const k of ['hub.label', 'hub.inside', 'hub.for', 'hub.count.one', 'hub.count.other', 'hub.viewAll', 'hub.more', 'spotlight.eyebrow', 'spotlight.read', 'card.read', 'card.with', 'filter.label', 'filter.search', 'filter.placeholder', 'filter.sectors', 'filter.all', 'filter.results.one', 'filter.results.other', 'filter.none', 'filter.sectionEmpty', 'filter.clear', 'cta.title', 'cta.subtitle'])
      expect(d[`caseStudies.${k}`], k).toBeTruthy();
    expect(d['caseStudies.hub.count.other']).toContain('{n}');
    expect(d['caseStudies.filter.results.other']).toContain('{n}');
  });
});

describe('siblingCaseStudies', () => {
  it('returns other studies in the same category only, never the study itself', () => {
    for (const c of caseStudies) {
      const sib = siblingCaseStudies(c.slug);
      expect(sib.length).toBe(Math.min(3, caseStudies.filter((s) => s.category === c.category).length - 1));
      for (const s of sib) {
        expect(s.category).toBe(c.category);
        expect(s.slug).not.toBe(c.slug);
      }
      expect(new Set(sib.map((s) => s.slug)).size).toBe(sib.length);
    }
  });
  it('starts after the study and wraps round', () => {
    const same = caseStudies.filter((c) => c.category === 'research');
    const last = same.at(-1)!;
    expect(siblingCaseStudies(last.slug, 1)[0]).toBe(same[0]);
  });
  it('is empty for an unknown slug', () => {
    expect(siblingCaseStudies('nope')).toEqual([]);
  });
});

describe('case-study styling', () => {
  // iOS Safari painted color-mix() tints as solid fills on the hub cards
  // (Oct 2026). Tints must be rgb(var(--cs-rgb) / alpha) instead.
  it.each(['CategoryBadge', 'CaseStudyCard', 'CaseStudyHub', 'MoreInCategory'])('%s uses no color-mix()', (name) => {
    const src = readFileSync(new URL(`../components/case-studies/${name}.astro`, import.meta.url), 'utf-8');
    expect(src).not.toContain('color-mix(');
  });
  it('the index page uses no color-mix()', () => {
    const src = readFileSync(new URL('../components/pages/CaseStudiesIndex.astro', import.meta.url), 'utf-8');
    expect(src).not.toContain('color-mix(');
  });
});
