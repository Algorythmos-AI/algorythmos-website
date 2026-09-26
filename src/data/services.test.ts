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
    expect(countSeq(d, `${svc.ns}.faqs`, '.question')).toBeGreaterThanOrEqual(4);
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
