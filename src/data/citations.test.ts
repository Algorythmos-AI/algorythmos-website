/**
 * Citation integrity for case studies that list sources.
 *
 * In-text markers such as `[9, 12]` are typed by hand and point at the numbered
 * sources list (1-based). This pins, in both locales: the list is contiguous
 * from the first entry, every marker points at a source that exists, EN and FR
 * cite the same sources from the same key, and — on long-form reports, which
 * have pillars — no source is listed without being cited.
 */
import { describe, it, expect } from 'vitest';
import en from '../i18n/ui/en.global.json';
import fr from '../i18n/ui/fr.fr.json';
import { caseStudySlugs } from './caseStudies';

const DICTS: [string, Record<string, string>][] = [
  ['en', en as Record<string, string>],
  ['fr', fr as Record<string, string>],
];
const MARKER = /\[(\d+(?:\s*,\s*\d+)*)\]/g;
const markers = (text: string): number[] => [...text.matchAll(MARKER)].flatMap((m) => m[1].split(',').map((n) => Number(n.trim())));

/** Every key of a study that may carry markers: its body copy and its chart copy. */
const citingKeys = (d: Record<string, string>, slug: string) =>
  Object.keys(d).filter(
    (k) =>
      (k.startsWith(`caseStudyDetail.studies.${slug}.`) && !k.startsWith(`caseStudyDetail.studies.${slug}.sources.`)) ||
      k.startsWith(`charts.caseStudy.${slug}.`),
  );
const sourceCount = (d: Record<string, string>, slug: string) => {
  let n = 0;
  while (d[`caseStudyDetail.studies.${slug}.sources.${n}.label`] && d[`caseStudyDetail.studies.${slug}.sources.${n}.url`]) n++;
  return n;
};

const withSources = caseStudySlugs.filter((s) => sourceCount(en as Record<string, string>, s) > 0);

describe('case-study citations', () => {
  it('at least the evidence reports are covered', () => {
    expect(withSources).toContain('port-botany-ai-ml');
    expect(withSources).toContain('ai-robotics-space-bitcoin-convergence');
  });
});

describe.each(withSources)('citations in %s', (slug) => {
  it.each(DICTS)('sources are contiguous, within what the page renders, and https (%s)', (_loc, d) => {
    const n = sourceCount(d, slug);
    const all = Object.keys(d).filter((k) => new RegExp(`^caseStudyDetail\\.studies\\.${slug}\\.sources\\.\\d+\\.label$`).test(k));
    expect(all.length, 'no source sits after a gap').toBe(n);
    expect(n).toBeLessThanOrEqual(40); // the cap in CaseStudyDetail.astro
    for (let i = 0; i < n; i++) expect(d[`caseStudyDetail.studies.${slug}.sources.${i}.url`]).toMatch(/^https:\/\//);
  });

  it.each(DICTS)('every marker points at a listed source (%s)', (_loc, d) => {
    const n = sourceCount(d, slug);
    for (const k of citingKeys(d, slug)) {
      for (const m of markers(d[k])) {
        expect(m, `${k} cites [${m}]`).toBeGreaterThanOrEqual(1);
        expect(m, `${k} cites [${m}] of ${n}`).toBeLessThanOrEqual(n);
      }
    }
  });

  it('EN and FR list the same sources and cite them from the same keys', () => {
    const e = en as Record<string, string>;
    const f = fr as Record<string, string>;
    const n = sourceCount(e, slug);
    expect(sourceCount(f, slug)).toBe(n);
    for (let i = 0; i < n; i++) {
      const k = `caseStudyDetail.studies.${slug}.sources.${i}.url`;
      expect(f[k], k).toBe(e[k]);
    }
    for (const k of citingKeys(e, slug)) {
      expect(markers(f[k] ?? '').sort(), k).toEqual(markers(e[k]).sort());
    }
  });

  it('a long-form report cites every source it lists', () => {
    const d = en as Record<string, string>;
    if (!d[`caseStudyDetail.studies.${slug}.pillars.0.title`]) return;
    const cited = new Set(citingKeys(d, slug).flatMap((k) => markers(d[k])));
    const n = sourceCount(d, slug);
    const uncited = Array.from({ length: n }, (_, i) => i + 1).filter((i) => !cited.has(i));
    expect(uncited).toEqual([]);
  });
});
