/**
 * Service completeness — every service in the registry must ship a complete
 * page in BOTH locales. Reads the dictionaries directly: t('fr-fr') falls back
 * to EN and would hide a missing French key.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { join } from 'node:path';
import en from '../i18n/ui/en.global.json';
import fr from '../i18n/ui/fr.fr.json';
import { services } from './services';
import { serviceVisuals } from './visuals';
import { serviceRelated } from './related';
import { caseStudySlugs } from './caseStudies';
import { STACK_CATEGORIES } from './techStack';

const ROOT = join(__dirname, '..', '..');
const DICTS: [string, Record<string, string>][] = [
  ['en', en as Record<string, string>],
  ['fr', fr as Record<string, string>],
];
/** SEO.astro appends " | Algorythmos" (14 chars) to titles without the brand. */
const TITLE_MAX = 60 - ' | Algorythmos'.length;
const len = (s: string) => [...s].length;
const countSeq = (dict: Record<string, string>, base: string, leaf = '') => {
  let n = 0;
  while (dict[`${base}.${n}${leaf}`] !== undefined) n++;
  return n;
};

describe.each(services.map((s) => [s.slug, s] as const))('service %s', (slug, svc) => {
  it.each(DICTS)('has its catalogue copy (%s)', (_loc, d) => {
    const base = `services.items.${slug}`;
    for (const k of ['name', 'tagline', 'summary']) expect(d[`${base}.${k}`], `${base}.${k}`).toBeTruthy();
    expect(countSeq(d, `${base}.capabilities`)).toBe(4);
    expect(countSeq(d, `${base}.outcomes`)).toBe(3);
  });

  it.each(DICTS)('has meta, hero and FAQs within limits (%s)', (_loc, d) => {
    const title = d[`${svc.ns}.meta.title`];
    const desc = d[`${svc.ns}.meta.description`];
    expect(title, `${svc.ns}.meta.title`).toBeTruthy();
    expect(len(title)).toBeLessThanOrEqual(TITLE_MAX);
    expect(desc, `${svc.ns}.meta.description`).toBeTruthy();
    expect(len(desc)).toBeGreaterThanOrEqual(70);
    expect(len(desc)).toBeLessThanOrEqual(160);
    expect(d[`${svc.ns}.hero.subtitle`]).toBeTruthy();
    expect(countSeq(d, `${svc.ns}.faqs`, '.question')).toBeGreaterThanOrEqual(5);
    expect(countSeq(d, `${svc.ns}.faqs`, '.answer')).toBe(countSeq(d, `${svc.ns}.faqs`, '.question'));
  });

  it.each(DICTS)('has four "how it works" steps (%s)', (_loc, d) => {
    expect(countSeq(d, `${svc.ns}.steps`, '.title')).toBeGreaterThanOrEqual(4);
    expect(countSeq(d, `${svc.ns}.steps`, '.desc')).toBe(countSeq(d, `${svc.ns}.steps`, '.title'));
  });

  it('has a blueprint illustration that BlueprintArt actually draws', () => {
    const art = readFileSync(join(ROOT, 'src', 'components', 'ui', 'BlueprintArt.astro'), 'utf-8');
    expect(art).toContain(`kind === '${svc.blueprint.kind}'`);
    expect(svc.blueprint.fig).toMatch(/^\d{2}$/);
  });

  it('has a technology stack from known categories', () => {
    expect(svc.stack.length).toBeGreaterThan(0);
    for (const c of svc.stack) expect(STACK_CATEGORIES).toContain(c);
  });

  it('features an existing case study as proof, or none by choice', () => {
    if (svc.proof === null) return;
    expect(caseStudySlugs).toContain(svc.proof);
    expect((serviceRelated[slug] ?? []).some((r) => r.type === 'case-study')).toBe(true);
  });

  it('has a registered console that names itself after the slug', () => {
    const file = join(ROOT, 'src', 'components', 'ui', 'consoles', `${svc.console}.astro`);
    expect(existsSync(file), file).toBe(true);
    expect(readFileSync(file, 'utf-8')).toContain(`name="svc-${slug}"`);
    const index = readFileSync(join(ROOT, 'src', 'components', 'ui', 'consoles', 'index.ts'), 'utf-8');
    expect(index).toContain(`import ${svc.console} from './${svc.console}.astro'`);
  });

  it('has a static SVG fallback and localized alt text', () => {
    const v = serviceVisuals[slug];
    expect(v, `serviceVisuals['${slug}']`).toBeTruthy();
    const file = join(ROOT, 'public', v.file);
    expect(existsSync(file), file).toBe(true);
    expect(statSync(file).size).toBeLessThan(10 * 1024);
    expect(readFileSync(file, 'utf-8')).toContain('viewBox="0 0 1120 760"');
    for (const [, d] of DICTS) expect(d[v.altKey], v.altKey).toBeTruthy();
  });

  it('links to at least one blog post', () => {
    expect((serviceRelated[slug] ?? []).some((r) => r.type === 'blog')).toBe(true);
  });
});

describe('registry', () => {
  it('uses each blueprint figure number once', () => {
    const figs = services.map((s) => s.blueprint.fig);
    expect(new Set(figs).size).toBe(figs.length);
    // FIG.05 belongs to the security vault on the home page.
    expect(figs).not.toContain('05');
  });
  it('gives every service except ai-websites a proof case study', () => {
    for (const s of services) if (s.slug !== 'ai-websites') expect(s.proof, s.slug).not.toBeNull();
  });
});
