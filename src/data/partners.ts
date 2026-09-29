/**
 * External partner links (named organisations that have approved being shown — see
 * docs/COPY_CLAIMS_SIGNOFF.md). Consumed by RelatedLinks.astro as `type: 'partner'` refs;
 * labels are i18n keys, URLs are per locale and carry referral UTM tags.
 */
import type { Locale } from '@/i18n';

export interface PartnerLink {
  slug: string;
  /** Organisation name, for schema and tests. */
  name: string;
  /** i18n key for the visible link label. */
  labelKey: string;
  href: Record<Locale, string>;
}

const MBSC = 'https://www.mbscaustralia.com.au';
const UTM = '?utm_source=algorythmos.com&utm_medium=referral&utm_campaign=partner';

export const partnerLinks: PartnerLink[] = [
  {
    slug: 'mbsc-australia-ai',
    name: 'MBSC Australia',
    labelKey: 'partners.mbsc.aiLabel',
    href: {
      en: `${MBSC}/services/ai-mining${UTM}`,
      'au-en': `${MBSC}/services/ai-mining${UTM}`,
      'fr-fr': `${MBSC}/fr/services/ai-mining${UTM}`,
    },
  },
  {
    slug: 'mbsc-australia-announcement',
    name: 'MBSC Australia',
    labelKey: 'partners.mbsc.announcementLabel',
    href: {
      en: `${MBSC}/insights/mbsc-algorythmos-partnership${UTM}`,
      'au-en': `${MBSC}/insights/mbsc-algorythmos-partnership${UTM}`,
      'fr-fr': `${MBSC}/fr/insights/mbsc-algorythmos-partnership${UTM}`,
    },
  },
];

export const partnerSlugs = partnerLinks.map((p) => p.slug);
export const getPartnerLink = (slug: string) => partnerLinks.find((p) => p.slug === slug);
