/** Reconciled structured data — ONE identity graph, all URLs on bare .com. */
export const SITE = 'https://algorythmos.com';
export const OG_IMAGE = `${SITE}/Algorythmos.png`;
export const ORG_ID = `${SITE}/#organization`;
export const WEBSITE_ID = `${SITE}/#website`;

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
      contactPoint: { '@type': 'ContactPoint', contactType: 'customer service', url: `${SITE}/contact` },
      sameAs: [
        'https://www.linkedin.com/company/algorythmos',
        'https://www.youtube.com/@AlgorythmosAI',
        'https://medium.com/@algorythmos',
        'https://x.com/algorythmos',
      ],
    },
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

/** City-level ProfessionalService (no invented street/phone). */
export function professionalService(region: 'AU' | 'FR') {
  const map = {
    AU: { name: 'Algorythmos Australia', path: '/au-en', city: 'Sydney', adminArea: 'NSW', country: 'AU', lat: -33.8688, lng: 151.2093 },
    FR: { name: 'Algorythmos France', path: '/fr-fr', city: 'Paris', adminArea: 'Île-de-France', country: 'FR', lat: 48.87, lng: 2.22 },
  }[region];
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
    address: { '@type': 'PostalAddress', addressLocality: map.city, addressRegion: map.adminArea, addressCountry: map.country },
    geo: { '@type': 'GeoCoordinates', latitude: map.lat, longitude: map.lng },
    areaServed: [{ '@type': 'City', name: map.city }, { '@type': 'Country', name: map.country === 'AU' ? 'Australia' : 'France' }],
    serviceType: ['AI Consulting', 'Agentic Automation', 'Document Intelligence', 'SQL Dashboards', 'MLOps'],
    knowsLanguage: ['en', 'fr'],
    priceRange: region === 'AU' ? '$$' : '€€',
  };
}

export function breadcrumb(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: it.url })),
  };
}
