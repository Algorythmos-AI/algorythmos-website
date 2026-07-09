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

/**
 * Photography manifest — licensed stock (see public/assets/photos/CREDITS.md),
 * processed by scripts/prepare-photos.mjs into `<base>-{800,1200,1600}.webp`
 * (3:2 crop). Rendered via `<Photo>` with responsive srcset. width/height are
 * the LARGEST variant's intrinsic size (drives CLS-safe sizing + ImageObject).
 * Workplace ambiance only — never presented as "our team".
 */
export interface PhotoAsset {
  /** basename in public/assets/photos/ without the -<width>.webp suffix */
  base: string;
  width: number;
  height: number;
  altKey: string;
}

const P = '/assets/photos';

export const photoFile = (photo: PhotoAsset, width: number): string => `${P}/${photo.base}-${width}.webp`;
export const PHOTO_WIDTHS = [800, 1200, 1600] as const;

export const photos = {
  teamCollaboration: { base: 'team-collaboration', width: 1600, height: 1067, altKey: 'visuals.photos.team.alt' },
  teamSunlit: { base: 'team-sunlit', width: 1600, height: 1067, altKey: 'visuals.photos.teamSunlit.alt' },
  modernOffice: { base: 'modern-office', width: 1600, height: 1067, altKey: 'visuals.photos.office.alt' },
  sydneyScene: { base: 'sydney-scene', width: 1600, height: 1067, altKey: 'visuals.photos.sydney.alt' },
  parisScene: { base: 'paris-scene', width: 1600, height: 1067, altKey: 'visuals.photos.paris.alt' },
} satisfies Record<string, PhotoAsset>;

/** Abstract geometric city motifs for the local landing + contact pages. */
export const cityVisuals: Record<'AU' | 'FR', VisualAsset> = {
  AU: { file: `${V}/city-sydney.svg`, width: 1120, height: 540, altKey: 'visuals.city.sydney.alt' },
  FR: { file: `${V}/city-paris.svg`, width: 1120, height: 540, altKey: 'visuals.city.paris.alt' },
};
