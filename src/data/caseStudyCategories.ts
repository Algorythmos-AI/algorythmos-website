/**
 * Presentation for each case-study category: the icon in its badge, the
 * blueprint art on its hub card and its tint. Typed as a full Record, so a new
 * category without styling fails the type check.
 *
 * Tints use existing tokens only: client = accent (teal), industry = brand
 * (violet), research = a blue mix of the two.
 */
import type { CaseStudyCategory } from './caseStudies';
import type { BlueprintKind } from './blueprints';

export interface CategoryStyle {
  /** SVG path data for a 24×24 stroke icon. */
  icon: string;
  art: BlueprintKind;
  /** CSS colour for the tint, as `rgb(...)` of existing token channels. */
  tint: string;
}

export const categoryStyles: Record<CaseStudyCategory, CategoryStyle> = {
  client: {
    icon: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75',
    art: 'cs-client',
    tint: 'rgb(var(--accent))',
  },
  industry: {
    icon: 'M2 20h20M4 20V10l5 3V9l5 3V6l6 4v10M8 16h1M12 16h1M16 16h1',
    art: 'cs-industry',
    tint: 'rgb(var(--brand))',
  },
  research: {
    icon: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M8 13h8M8 17h5',
    art: 'cs-research',
    tint: 'color-mix(in srgb, rgb(var(--brand)) 45%, rgb(var(--accent)))',
  },
};
