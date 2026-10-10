import { describe, it, expect } from 'vitest';
import { blog } from './blog';
import { caseStudies } from './caseStudies';
import { blogRelated, caseStudyRelated, type RelatedRef } from './related';
import { sceneFor, type ScenePage } from './sceneMap';
import { SCENE_IDS, STILL_VARIANTS, stillKey, type SceneRef } from './scenes';
import { serviceSlugs } from './services';
import { SERVICE_ORDER } from '../lib/scene3d/scenes/constellation';

const known = (ref: SceneRef) => (SCENE_IDS as readonly string[]).includes(ref.id);
const leadService = (refs: RelatedRef[] | undefined) => refs?.find((r) => r.type === 'service')?.slug;
/* Every study and post, with the service that leads it and the scene it resolves to. */
const ARTICLES = [
  ...caseStudies.map((c) => ({ slug: c.slug, lead: leadService(caseStudyRelated[c.slug]), scene: sceneFor('case-study', c.slug) })),
  ...blog.map((p) => ({ slug: p.slug, lead: leadService(blogRelated[p.slug]), scene: sceneFor('post', p.slug) })),
];

describe('sceneFor — every page that carries a scene resolves to a registered one', () => {
  const SINGLE: ScenePage[] = ['services', 'case-studies', 'blog', 'pricing', 'about', 'contact', 'careers', 'press', 'product', 'not-found'];
  it.each(SINGLE)('%s', (page) => {
    expect(known(sceneFor(page))).toBe(true);
  });

  it.each(serviceSlugs)('service: %s', (slug) => {
    expect(known(sceneFor('service', slug))).toBe(true);
  });
  it.each(caseStudies.map((c) => c.slug))('case study: %s', (slug) => {
    expect(known(sceneFor('case-study', slug))).toBe(true);
  });
  it.each(blog.map((p) => p.slug))('post: %s', (slug) => {
    expect(known(sceneFor('post', slug))).toBe(true);
  });
  it.each(['sydney', 'paris'])('local landing: %s', (city) => {
    expect(sceneFor('local', city)).toEqual({ id: 'globe', variant: city });
  });
});

describe('sceneFor — themes follow the page (docs/COPY_CLAIMS_SIGNOFF.md §3g)', () => {
  it('pricing shows the page’s own currency', () => {
    expect(sceneFor('pricing', undefined, 'au-en')).toEqual({ id: 'ledger', variant: 'aud' });
    expect(sceneFor('pricing', undefined, 'fr-fr')).toEqual({ id: 'ledger', variant: 'eur' });
  });

  it('only pricing and compliance pages get the ledger', () => {
    const others = [
      ...serviceSlugs.map((s) => sceneFor('service', s)),
      ...caseStudies.filter((c) => c.slug !== 'financial-compliance').map((c) => sceneFor('case-study', c.slug)),
      ...blog.filter((p) => !['gdpr-ai', 'eu-ai-act-gdpr-sme-roadmap'].includes(p.slug)).map((p) => sceneFor('post', p.slug)),
    ];
    expect(others.filter((r) => r.id === 'ledger')).toEqual([]);
  });

  it('every service page has a scene of its own', () => {
    const ids = serviceSlugs.map((s) => sceneFor('service', s).id);
    expect(new Set(ids).size).toBe(serviceSlugs.length);
    expect(ids).not.toContain('constellation');
  });

  it('a service added before its scene exists gets the constellation, turned to it', () => {
    expect(sceneFor('service', 'a-new-service')).toEqual({ id: 'constellation', variant: 'a-new-service' });
  });

  it('a study or post shows the scene of the service that leads it', () => {
    const explicit = ARTICLES.filter((a) => ['ledger', 'globe', 'port-yard'].includes(a.scene.id));
    for (const a of ARTICLES.filter((x) => !explicit.includes(x))) {
      const expected = a.lead === 'document-intelligence' ? { id: 'scan' } : sceneFor('service', a.lead);
      expect(a.scene, a.slug).toEqual(expected);
    }
  });

  it('the scanning overlay and the sorting arm belong to document-led pages only', () => {
    expect(sceneFor('service', 'document-intelligence')).toEqual({ id: 'robot-sorter' });
    for (const a of ARTICLES.filter((x) => x.scene.id === 'scan' || x.scene.id === 'robot-sorter')) {
      expect(a.lead, a.slug).toBe('document-intelligence');
    }
    const others = serviceSlugs.filter((s) => s !== 'document-intelligence').map((s) => sceneFor('service', s).id);
    expect(others.filter((id) => id === 'scan' || id === 'robot-sorter')).toEqual([]);
  });

  it('the port yard belongs to the port and freight pages only', () => {
    const yard = ARTICLES.filter((a) => a.scene.id === 'port-yard').map((a) => a.slug);
    expect(yard.sort()).toEqual(['model-monitoring-logistics', 'port-botany-ai-ml', 'port-botany-document-flows']);
    expect(serviceSlugs.map((s) => sceneFor('service', s).id)).not.toContain('port-yard');
  });

  it('PDF Algo Pro gets pages doing what the app does, not the scanning overlay', () => {
    expect(sceneFor('product')).toEqual({ id: 'pages' });
  });

  it('a study or post with no service behind it falls back to the globe', () => {
    expect(sceneFor('case-study', 'no-such-study')).toEqual({ id: 'globe', variant: 'studies' });
    expect(sceneFor('post', 'no-such-post')).toEqual({ id: 'globe', variant: 'blog' });
  });
});

describe('constellation', () => {
  it('orders its satellites exactly as the services are listed', () => {
    expect([...SERVICE_ORDER]).toEqual(serviceSlugs);
  });
});

describe('stillKey', () => {
  it('gives a variant its own still only where the variant changes what the picture says', () => {
    expect(stillKey({ id: 'ledger', variant: 'eur' })).toBe('ledger@eur');
    expect(stillKey({ id: 'globe', variant: 'paris' })).toBe('globe@paris');
    expect(stillKey({ id: 'globe', variant: 'careers' })).toBe('globe');
    expect(stillKey({ id: 'constellation', variant: 'llmops' })).toBe('constellation');
    expect(stillKey({ id: 'scan' })).toBe('scan');
    expect(stillKey({ id: 'agent-swarm' })).toBe('agent-swarm');
  });

  it('only names variants of real scenes', () => {
    for (const id of Object.keys(STILL_VARIANTS)) expect(SCENE_IDS as readonly string[]).toContain(id);
  });
});
