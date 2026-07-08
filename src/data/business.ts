/**
 * Single source of truth for business facts (NAP — name, contact, service areas).
 *
 * Consumed by structured data (src/seo/schema.ts), contact/legal pages, and
 * llms.txt so every surface publishes IDENTICAL details — consistency is a
 * local-SEO ranking factor. Service-area business model: city-level areas only,
 * no street address, and nothing here may be invented (no fake phone/ABN/SIRET).
 * When a phone number or legal identifiers exist, add them here and they will
 * propagate to schema + pages automatically.
 */
export const BUSINESS = {
  legalName: 'Algorythmos',
  /** General enquiries — the address wired to the live contact-form mailbox. */
  email: 'info@algorythmos.com.au',
  /** Careers enquiries (careers page only). */
  careersEmail: 'careers@algorythmos.com',
  /** Press/media enquiries. */
  pressEmail: 'info@algorythmos.com.au',
  /** No phone published yet — leave empty until a real number exists. */
  phone: '',
  sameAs: [
    'https://www.linkedin.com/company/algorythmos',
    'https://www.youtube.com/@AlgorythmosAI',
    'https://medium.com/@algorythmos',
    'https://x.com/algorythmos',
  ],
  regions: {
    AU: {
      name: 'Algorythmos Australia',
      path: '/au-en',
      city: 'Sydney',
      adminArea: 'NSW',
      country: 'AU',
      countryName: 'Australia',
      lat: -33.8688,
      lng: 151.2093,
      priceRange: '$$',
    },
    FR: {
      name: 'Algorythmos France',
      path: '/fr-fr',
      city: 'Paris',
      adminArea: 'Île-de-France',
      country: 'FR',
      countryName: 'France',
      lat: 48.8566,
      lng: 2.3522,
      priceRange: '€€',
    },
  },
} as const;

export type BusinessRegion = keyof typeof BUSINESS.regions;
