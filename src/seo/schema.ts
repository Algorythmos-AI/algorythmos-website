/** Reconciled structured data — ONE identity graph, all URLs on bare .com. */
import { BUSINESS, SAME_AS } from '@/data/business';

export const SITE = 'https://algorythmos.com';
export const OG_IMAGE = `${SITE}/Algorythmos.png`;
export const ORG_ID = `${SITE}/#organization`;
export const WEBSITE_ID = `${SITE}/#website`;
export const FOUNDER_ID = `${SITE}/#founder`;

/** Founder Person node (E-E-A-T) — real, on-site facts only. */
export const founderPerson = {
  '@type': 'Person',
  '@id': FOUNDER_ID,
  name: 'Sam Kalaliya',
  jobTitle: 'Founder & Chief Executive Officer',
  worksFor: { '@id': ORG_ID },
  knowsAbout: ['Artificial Intelligence', 'Machine Learning', 'MLOps', 'Data Engineering', 'Agentic Automation'],
};

/**
 * Per-page Open Graph cards (generated at build by `src/pages/og/[...route].ts`).
 * Pass an already region-localized path (e.g. '/fr-fr/blog/x'); the key/URL must
 * match a `pages` entry in the OG route, so both sides call these helpers.
 */
export const ogKey = (localizedPath: string): string => {
  const p = localizedPath.replace(/^\/+/, '').replace(/\/+$/, '');
  return p === '' ? 'index' : p;
};
export const ogImageUrl = (localizedPath: string): string => `${SITE}/og/${ogKey(localizedPath)}.png`;

/**
 * ImageObject for an on-page content visual (the branded product mockups).
 * `path` is the visual's absolute-from-root path (e.g. '/assets/visuals/x.svg').
 * Feeds the per-page Service/Article/ProfessionalService `image` arrays so the
 * visual is described for image search + AI. Dimensions mirror the on-page <img>
 * (one source of truth → no mismatch). `primary` marks the page's hero visual.
 */
export interface ImageObjectInput {
  path: string;
  alt: string;
  width: number;
  height: number;
  primary?: boolean;
}
export function imageObject({ path, alt, width, height, primary }: ImageObjectInput) {
  const url = `${SITE}${path}`;
  return {
    '@type': 'ImageObject',
    '@id': `${url}#image`,
    url,
    contentUrl: url,
    width,
    height,
    caption: alt,
    creator: { '@id': ORG_ID },
    ...(primary ? { representativeOfPage: true } : {}),
  };
}

export const orgGraph = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': ORG_ID,
      name: 'Algorythmos',
      alternateName: 'Algorythmos™',
      url: SITE,
      logo: OG_IMAGE,
      image: OG_IMAGE,
      description:
        'Boutique AI consultancy delivering agentic automation, document intelligence, SQL dashboards, and MLOps for SMEs in Australia and France.',
      foundingDate: '2025',
      areaServed: [
        { '@type': 'Country', name: 'Australia' },
        { '@type': 'Country', name: 'France' },
      ],
      email: BUSINESS.email,
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer service',
        email: BUSINESS.email,
        url: `${SITE}/contact`,
        availableLanguage: ['English', 'French'],
        ...(BUSINESS.phone ? { telephone: BUSINESS.phone } : {}),
      },
      sameAs: [...SAME_AS],
      founder: { '@id': FOUNDER_ID },
    },
    founderPerson,
    {
      '@type': 'WebSite',
      '@id': WEBSITE_ID,
      url: SITE,
      name: 'Algorythmos',
      publisher: { '@id': ORG_ID },
      inLanguage: ['en', 'fr'],
    },
  ],
};

/** Service-area ProfessionalService — city-level, real NAP from BUSINESS only. */
export function professionalService(region: 'AU' | 'FR') {
  const map = BUSINESS.regions[region];
  const description =
    region === 'AU'
      ? 'AI consultancy for Australian SMEs — agentic automation, document intelligence, SQL dashboards, and MLOps, delivered from Sydney.'
      : 'Cabinet de conseil en IA pour PME et ETI — automatisation agentique, intelligence documentaire, tableaux de bord SQL et MLOps, basé à Paris.';
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': `${SITE}${map.path}#service`,
    name: map.name,
    url: `${SITE}${map.path}`,
    image: OG_IMAGE,
    description,
    parentOrganization: { '@id': ORG_ID },
    email: BUSINESS.email,
    ...(BUSINESS.phone ? { telephone: BUSINESS.phone } : {}),
    address: { '@type': 'PostalAddress', addressLocality: map.city, addressRegion: map.adminArea, addressCountry: map.country },
    geo: { '@type': 'GeoCoordinates', latitude: map.lat, longitude: map.lng },
    areaServed: [
      { '@type': 'City', name: map.city },
      { '@type': 'AdministrativeArea', name: map.adminArea },
      { '@type': 'Country', name: map.countryName },
    ],
    serviceType: ['AI Consulting', 'Agentic Automation', 'Document Intelligence', 'SQL Dashboards', 'MLOps'],
    knowsLanguage: ['en-AU', 'fr-FR', 'en'],
    priceRange: map.priceRange,
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: map.hours.opens,
        closes: map.hours.closes,
      },
    ],
  };
}

export function breadcrumb(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: it.url })),
  };
}
