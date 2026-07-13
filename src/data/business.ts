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
  /**
   * Owned properties + social profiles. The schema `sameAs` array AND the
   * footer's entity links both derive from this list so they can never drift
   * (reciprocal links strengthen entity verification).
   */
  profiles: [
    { label: 'LinkedIn', url: 'https://www.linkedin.com/company/algorythmos' },
    { label: 'YouTube', url: 'https://www.youtube.com/@AlgorythmosAI' },
    { label: 'Medium', url: 'https://medium.com/@algorythmos' },
    { label: 'X', url: 'https://x.com/algorythmos' },
    { label: 'Docs', url: 'https://docs.algorythmos.fr' },
    { label: 'App', url: 'https://app.algorythmos.fr' },
  ],
  regions: {
    AU: {
      name: 'Algorythmos Australia',
      path: '/au-en',
      city: 'Sydney',
      adminArea: 'NSW',
      country: 'AU',
      countryName: 'Australia',
      /** Region enquiries mailbox (shown on the contact page for this region). */
      email: 'info@algorythmos.com.au',
      lat: -33.8688,
      lng: 151.2093,
      priceRange: '$$',
      /** Local business hours (region-local time — schema.org interprets via the address). */
      hours: { opens: '09:00', closes: '17:00' },
    },
    FR: {
      name: 'Algorythmos France',
      path: '/fr-fr',
      city: 'Paris',
      adminArea: 'Île-de-France',
      country: 'FR',
      countryName: 'France',
      email: 'info@algorythmos.fr',
      lat: 48.8566,
      lng: 2.3522,
      priceRange: '€€',
      hours: { opens: '09:00', closes: '17:00' },
    },
  },
} as const;

/** Schema.org sameAs — derived from the labeled profile list above. */
export const SAME_AS: readonly string[] = BUSINESS.profiles.map((p) => p.url);

export type BusinessRegion = keyof typeof BUSINESS.regions;
