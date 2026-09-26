/**
 * Service catalogue — structure only (slugs, order, SVG icon paths).
 *
 * All user-facing copy (name, tagline, summary, capabilities, outcomes) lives in
 * the i18n dictionaries under `services.items.<slug>.*` (EN + FR) and must be
 * resolved through `localizeService(t, slug)` so every locale renders its own
 * language. Do not add English literals back to this module.
 */
import type { TFunction } from '@/i18n';
import type { BlueprintKind } from './blueprints.ts';
import type { StackCategory } from './techStack.ts';

/**
 * NOTE: `astro.config.mjs` imports this module, and path aliases (`@/…`) do not
 * resolve while the config loads — keep every VALUE import relative. Type-only
 * imports are erased and safe.
 */

/** Service families: the three rows of the services index (labels in i18n `services.families.<id>`). */
export type ServiceFamily = 'applications' | 'mlops' | 'data';

/** Living-console component per service — resolved in `src/components/ui/consoles/index.ts`. */
export type ConsoleName = 'AgenticConsole' | 'DocumentConsole' | 'SqlConsole' | 'MlopsConsole' | 'AiWebsitesConsole';

export interface Service {
  slug: string;
  /** lucide-style SVG path */
  icon: string;
  /** Dictionary namespace for the detail page (meta, hero, steps, FAQs). */
  ns: string;
  family: ServiceFamily;
  console: ConsoleName;
  /** Blueprint illustration shown in the detail-page aside. */
  blueprint: { kind: BlueprintKind; fig: string };
  /** Technology categories shown in the page's "Technologies we work with" grid. */
  stack: StackCategory[];
  /**
   * Case study featured in the page's "In practice" card — chosen explicitly, never
   * "the first related study" (that would surface industry evidence reports as if
   * they were delivery results). null = no honest proof yet; the section is hidden.
   */
  proof: string | null;
}

export interface LocalizedService extends Service {
  name: string;
  tagline: string;
  summary: string;
  capabilities: string[];
  outcomes: string[];
}

export const services: Service[] = [
  {
    slug: 'agentic-automation',
    ns: 'serviceAgentic',
    family: 'applications',
    console: 'AgenticConsole',
    blueprint: { kind: 'agentic', fig: '01' },
    stack: ['genai', 'cloud', 'languages'],
    proof: 'financial-compliance',
    icon: 'm12 8 1.9 3.9L18 13.8l-3.2 2.8.8 4.4-3.6-2-3.6 2 .8-4.4L2.9 13.8 8 11.9z',
  },
  {
    slug: 'document-intelligence',
    ns: 'serviceDocument',
    family: 'applications',
    console: 'DocumentConsole',
    blueprint: { kind: 'document', fig: '02' },
    stack: ['genai', 'languages', 'cloud'],
    proof: 'manufacturing-docs',
    icon: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M8 13h8M8 17h6',
  },
  {
    slug: 'sql-dashboards',
    ns: 'serviceSqlDashboards',
    family: 'data',
    console: 'SqlConsole',
    blueprint: { kind: 'sql', fig: '03' },
    stack: ['data', 'languages', 'cloud'],
    proof: 'retail-sql',
    icon: 'M4 20V10M10 20V4M16 20v-8M22 20H2',
  },
  {
    slug: 'mlops-cicd',
    ns: 'serviceMlops',
    family: 'mlops',
    console: 'MlopsConsole',
    blueprint: { kind: 'mlops', fig: '04' },
    stack: ['mlops', 'cicd', 'containers'],
    proof: 'healthcare-mlops',
    icon: 'M6 3v12M18 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM6 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM6 15a9 9 0 0 0 9-9',
  },
  {
    slug: 'ai-websites',
    ns: 'serviceAiWebsites',
    family: 'data',
    console: 'AiWebsitesConsole',
    blueprint: { kind: 'web', fig: '06' },
    stack: ['cloud', 'genai'],
    // No case study exists for websites yet, so no "In practice" card.
    proof: null,
    icon: 'M2 12h20M12 2a15 15 0 0 1 0 20 15 15 0 0 1 0-20zM12 2a10 10 0 0 0 0 20',
  },
];

export const serviceSlugs = services.map((s) => s.slug);
export const getService = (slug: string): Service | undefined => services.find((s) => s.slug === slug);

/** Read sequential `<base>.<i>` keys until one is missing (t() returns the key on a miss). */
function readList(t: TFunction, base: string, max = 12): string[] {
  const out: string[] = [];
  for (let i = 0; i < max; i++) {
    const v = t(`${base}.${i}`);
    if (v === `${base}.${i}`) break;
    out.push(v);
  }
  return out;
}

/** Resolve a service's localized copy from the dictionary for the given `t`. */
export function localizeService(t: TFunction, svc: Service): LocalizedService {
  const base = `services.items.${svc.slug}`;
  return {
    ...svc,
    name: t(`${base}.name`),
    tagline: t(`${base}.tagline`),
    summary: t(`${base}.summary`),
    capabilities: readList(t, `${base}.capabilities`),
    outcomes: readList(t, `${base}.outcomes`),
  };
}
