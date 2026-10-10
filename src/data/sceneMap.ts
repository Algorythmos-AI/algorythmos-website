/**
 * Which scene each page shows — resolved at build time, in component frontmatter.
 * Never import this from client code: it pulls in the related-content map.
 *
 * The rule the map follows (docs/COPY_CLAIMS_SIGNOFF.md §3g): a theme appears
 * only where it matches what the page sells. Robotics, space, currency and AR
 * imagery are never decoration for a page about something else.
 */
import { blogRelated, caseStudyRelated, type RelatedRef } from './related';
import type { SceneRef } from './scenes';

/** The kinds of page that carry a scene. Legal, support and the long-form product documents carry none. */
export type ScenePage =
  | 'services'
  | 'service'
  | 'case-studies'
  | 'case-study'
  | 'blog'
  | 'post'
  | 'pricing'
  | 'about'
  | 'contact'
  | 'careers'
  | 'press'
  | 'local'
  | 'product'
  | 'not-found';

/** Pages led by documents rather than by a platform: the scanning overlay is theirs. */
const DOCUMENT_SERVICE = 'document-intelligence';

/* Explicit choices, where "the scene of the related service" would be the wrong picture. */
const CASE_STUDY_SCENES: Record<string, SceneRef> = {
  // A compliance engagement: records through validation gates into a sealed audit log.
  'financial-compliance': { id: 'ledger', variant: 'audit' },
};
const POST_SCENES: Record<string, SceneRef> = {
  // Regulation and record-keeping, not document capture.
  'gdpr-ai': { id: 'ledger', variant: 'audit' },
  'eu-ai-act-gdpr-sme-roadmap': { id: 'ledger', variant: 'audit' },
  // About where Algorythmos works, not about a service.
  'choosing-ai-consultancy-sydney': { id: 'globe', variant: 'sydney' },
  'ai-consultancy-australia': { id: 'globe', variant: 'sydney' },
  'mbsc-australia-partnership': { id: 'globe', variant: 'sydney' },
};

function forService(slug: string): SceneRef {
  if (slug === DOCUMENT_SERVICE) return { id: 'scan' };
  /* The constellation, turned to the satellite that stands for this service. */
  return { id: 'constellation', variant: slug };
}

const firstService = (refs: RelatedRef[] | undefined): string | undefined => refs?.find((r) => r.type === 'service')?.slug;

/**
 * The scene for a page. `slug` is the service, case-study or post slug, or the
 * city for a local landing page; `locale` picks the currency on the pricing page.
 */
export function sceneFor(page: ScenePage, slug?: string, locale?: string): SceneRef {
  switch (page) {
    case 'services':
      return { id: 'constellation' };
    case 'service':
      return forService(slug ?? '');
    case 'case-study': {
      const explicit = slug ? CASE_STUDY_SCENES[slug] : undefined;
      if (explicit) return explicit;
      const service = firstService(slug ? caseStudyRelated[slug] : undefined);
      return service ? forService(service) : { id: 'globe', variant: 'studies' };
    }
    case 'post': {
      const explicit = slug ? POST_SCENES[slug] : undefined;
      if (explicit) return explicit;
      const service = firstService(slug ? blogRelated[slug] : undefined);
      return service ? forService(service) : { id: 'globe', variant: 'blog' };
    }
    case 'pricing':
      return { id: 'ledger', variant: locale === 'fr-fr' ? 'eur' : 'aud' };
    case 'product':
      return { id: 'pages' };
    case 'not-found':
      return { id: 'lost-satellite' };
    case 'local':
      return { id: 'globe', variant: slug === 'paris' ? 'paris' : 'sydney' };
    case 'case-studies':
      return { id: 'globe', variant: 'studies' };
    case 'blog':
      return { id: 'globe', variant: 'blog' };
    default:
      // about, contact, careers, press: the same planet from a different side.
      return { id: 'globe', variant: page };
  }
}
