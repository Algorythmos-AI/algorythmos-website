/**
 * Which scene each page shows — resolved at build time, in component frontmatter.
 * Never import this from client code: it pulls in the related-content map.
 *
 * The rule the map follows (docs/COPY_CLAIMS_SIGNOFF.md §3g): a theme appears
 * only where it matches what the page sells. Robotics, space, currency and AR
 * imagery are never decoration for a page about something else.
 */
import { blogRelated, caseStudyRelated, type RelatedRef } from './related';
import type { SceneId, SceneRef } from './scenes';

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
  // Ports and freight: the yard itself.
  'port-botany-ai-ml': { id: 'port-yard' },
  'model-monitoring-logistics': { id: 'port-yard' },
};
const POST_SCENES: Record<string, SceneRef> = {
  // Regulation and record-keeping, not document capture.
  'gdpr-ai': { id: 'ledger', variant: 'audit' },
  'eu-ai-act-gdpr-sme-roadmap': { id: 'ledger', variant: 'audit' },
  // About where Algorythmos works, not about a service.
  'choosing-ai-consultancy-sydney': { id: 'globe', variant: 'sydney' },
  'ai-consultancy-australia': { id: 'globe', variant: 'sydney' },
  'mbsc-australia-partnership': { id: 'globe', variant: 'sydney' },
  'port-botany-document-flows': { id: 'port-yard' },
};

/* A service's own scene. It is shown on the service page and on the studies and
   posts that service leads. */
const SERVICE_SCENES: Record<string, SceneId> = {
  'agentic-automation': 'agent-swarm',
  llmops: 'llm-lattice',
  'model-monitoring': 'monitor-radar',
  'data-feature-management': 'feature-vault',
  'sql-dashboards': 'dash-terrain',
  'document-intelligence': 'robot-sorter',
  'mlops-cicd': 'model-pipeline',
  'ai-platform-engineering': 'platform-station',
  'ai-websites': 'holo-site',
};

/** The scene for a service's own page. */
function forService(slug: string): SceneRef {
  const own = SERVICE_SCENES[slug];
  /* A service added before its scene exists: the constellation, turned to its satellite. */
  return own ? { id: own } : { id: 'constellation', variant: slug };
}

/**
 * The scene for a study or post that a service leads. Document-led ones get the
 * scanning overlay — the reading, not the arm that files the pages.
 */
function ledBy(service: string): SceneRef {
  return service === DOCUMENT_SERVICE ? { id: 'scan' } : forService(service);
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
      return service ? ledBy(service) : { id: 'globe', variant: 'studies' };
    }
    case 'post': {
      const explicit = slug ? POST_SCENES[slug] : undefined;
      if (explicit) return explicit;
      const service = firstService(slug ? blogRelated[slug] : undefined);
      return service ? ledBy(service) : { id: 'globe', variant: 'blog' };
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
