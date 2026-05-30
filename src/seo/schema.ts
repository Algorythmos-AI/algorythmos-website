/** Reconciled structured data — ONE identity graph, all URLs on bare .com. */
export const SITE = 'https://algorythmos.com';
export const OG_IMAGE = `${SITE}/Algorythmos.png`;
export const ORG_ID = `${SITE}/#organization`;
export const WEBSITE_ID = `${SITE}/#website`;

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
      sameAs: ['https://www.linkedin.com/company/algorythmos', 'https://x.com/algorythmos'],
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
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': `${SITE}${map.path}#service`,
    name: map.name,
    url: `${SITE}${map.path}`,
    image: OG_IMAGE,
    parentOrganization: { '@id': ORG_ID },
    address: { '@type': 'PostalAddress', addressLocality: map.city, addressRegion: map.adminArea, addressCountry: map.country },
    geo: { '@type': 'GeoCoordinates', latitude: map.lat, longitude: map.lng },
    areaServed: [{ '@type': 'City', name: map.city }, { '@type': 'Country', name: map.country === 'AU' ? 'Australia' : 'France' }],
    serviceType: ['AI Consulting', 'Agentic Automation', 'Document Intelligence', 'SQL Dashboards', 'MLOps'],
  };
}

export function breadcrumb(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: it.url })),
  };
}
