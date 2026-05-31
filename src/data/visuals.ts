/**
 * VISUALS manifest — single source of truth for the branded product-mockup visuals.
 *
 * Each entry maps to a hand-authored, theme-neutral SVG in `public/assets/visuals/`,
 * rendered via `<Visual>` as a real, alt-tagged <img> (so it's indexable + sitemap-able
 * + ImageObject-describable — unlike inline decorative SVG). `altKey` is an i18n key so
 * alt text is localized and never drifts from page copy. width/height drive CLS-safe
 * intrinsic sizing AND the ImageObject dimensions (one source → no mismatch).
 */
export interface VisualAsset {
  file: string;
  width: number;
  height: number;
  altKey: string;
}

const V = '/assets/visuals';

/** Home hero — the LCP "money shot" (agentic console + live metrics). */
export const heroVisual: VisualAsset = {
  file: `${V}/home-hero-ai-console.svg`,
  width: 1280,
  height: 800,
  altKey: 'visuals.homeHero.alt',
};

/** One product mockup per service, keyed by service slug. */
export const serviceVisuals: Record<string, VisualAsset> = {
  'agentic-automation': { file: `${V}/service-agentic-automation.svg`, width: 1120, height: 760, altKey: 'visuals.svc.agentic.alt' },
  'document-intelligence': { file: `${V}/service-document-intelligence.svg`, width: 1120, height: 760, altKey: 'visuals.svc.document.alt' },
  'sql-dashboards': { file: `${V}/service-sql-dashboards.svg`, width: 1120, height: 760, altKey: 'visuals.svc.sql.alt' },
  'mlops-cicd': { file: `${V}/service-mlops-cicd.svg`, width: 1120, height: 760, altKey: 'visuals.svc.mlops.alt' },
  'ai-websites': { file: `${V}/service-ai-websites.svg`, width: 1120, height: 760, altKey: 'visuals.svc.aiWebsites.alt' },
};

/** Abstract geometric city motifs for the local landing + contact pages. */
export const cityVisuals: Record<'AU' | 'FR', VisualAsset> = {
  AU: { file: `${V}/city-sydney.svg`, width: 1120, height: 540, altKey: 'visuals.city.sydney.alt' },
  FR: { file: `${V}/city-paris.svg`, width: 1120, height: 540, altKey: 'visuals.city.paris.alt' },
};
