/**
 * Every explainer needs its copy in both locales, with exactly as many steps as
 * the registry says, and every label its diagram asks for.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import en from '../i18n/ui/en.global.json';
import fr from '../i18n/ui/fr.fr.json';
import { EXPLAINER_IDS, EXPLAINER_STEPS, caseStudyExplainers } from './explainers';
import { caseStudySlugs } from './caseStudies';

const DICTS: [string, Record<string, string>][] = [
  ['en', en as Record<string, string>],
  ['fr', fr as Record<string, string>],
];
const ART: Record<string, string> = {
  'agent-loop': 'AgentLoop',
  'fleet-path': 'FleetPath',
  'launch-link': 'LaunchLink',
  'mine-block': 'MineBlock',
  'whole-job': 'WholeJob',
  'speech-loop': 'SpeechLoop',
  'em-spectrum': 'EmSpectrum',
  'fibre-span': 'FibreSpan',
  'sat-links': 'SatLinks',
  'orbital-node': 'OrbitalNode',
  'fibre-free-route': 'FibreFreeRoute',
};
const art = (id: string) =>
  readFileSync(fileURLToPath(new URL(`../components/explainers/art/${ART[id]}.astro`, import.meta.url)), 'utf-8');

describe.each(EXPLAINER_IDS)('explainer %s', (id) => {
  it.each(DICTS)('has a title, a caption and every step (%s)', (_loc, d) => {
    expect(d[`explainers.${id}.title`]).toBeTruthy();
    expect(d[`explainers.${id}.caption`]).toBeTruthy();
    const n = EXPLAINER_STEPS[id];
    expect(n).toBeGreaterThanOrEqual(2);
    for (let i = 0; i < n; i++) expect(d[`explainers.${id}.steps.${i}`], `step ${i}`).toBeTruthy();
    expect(d[`explainers.${id}.steps.${n}`], 'a step beyond the registered count').toBeUndefined();
  });

  it('its diagram never steps past the registered count, and its labels exist in both locales', () => {
    const src = art(id);
    const steps = [...src.matchAll(/data-(?:at|until)="(\d+)"/g)].map((m) => Number(m[1]));
    expect(steps.length).toBeGreaterThan(0);
    expect(Math.max(...steps)).toBeLessThanOrEqual(EXPLAINER_STEPS[id]);
    // Something is drawn on the last step, so the loop ends on a complete picture.
    expect(src).toContain(`data-at="${EXPLAINER_STEPS[id] - 1}"`);

    const direct = [...src.matchAll(/L\('([A-Za-z]+)'\)/g)].map((m) => m[1]);
    const listed = id === 'mine-block' ? ['prevHash', 'merkle', 'nonce'] : [];
    const labels = new Set([...direct, ...listed]);
    expect(labels.size).toBeGreaterThan(0);
    for (const [loc, d] of DICTS) {
      for (const name of labels) expect(d[`explainers.${id}.labels.${name}`], `${loc} label ${name}`).toBeTruthy();
      const defined = Object.keys(d).filter((k) => k.startsWith(`explainers.${id}.labels.`));
      expect(defined.length, `${loc} has no unused labels`).toBe(labels.size);
    }
  });
});

describe('explainer placement', () => {
  it('only real case studies carry explainers, one per pillar', () => {
    for (const [slug, set] of Object.entries(caseStudyExplainers)) {
      expect(caseStudySlugs, slug).toContain(slug);
      for (const [loc, d] of DICTS) {
        const pillars = Object.keys(d).filter((k) => new RegExp(`^caseStudyDetail\\.studies\\.${slug}\\.pillars\\.\\d+\\.title$`).test(k));
        expect(pillars.length, `${loc} pillars`).toBe(set.pillars.length);
      }
    }
  });

  it('the replay label exists in both locales', () => {
    for (const [, d] of DICTS) expect(d['explainers.replay']).toBeTruthy();
  });
});
