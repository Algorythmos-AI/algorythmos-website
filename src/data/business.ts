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
  /** Registered legal name (ASIC). */
  legalName: 'ALGORYTHMOS PTY LTD.',
  /** Trading / brand name. */
  tradingName: 'Algorythmos',
  /** Public register identifiers (ABN Lookup / ASIC) — safe to publish. */
  abn: '22 701 006 626',
  acn: '701 006 626',
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
  ],
  regions: {
    AU: {
      name: 'Algorythmos Australia',
      path: '/au-en',
      city: 'Sydney',
      adminArea: 'NSW',
      country: 'AU',
      countryName: 'Australia',
      /**
       * Registered office (virtual office, meetings by appointment). "Level 1" is
       * the form Algorythmos publishes itself; see the address note in CLAUDE.md
       * before copying it into third-party forms.
       */
      streetAddress: 'Level 1, 457–459 Elizabeth Street',
      suburb: 'Surry Hills',
      postalCode: '2010',
      /** Region enquiries mailbox (shown on the contact page for this region). */
      email: 'info@algorythmos.com.au',
      lat: -33.8853,
      lng: 151.2099,
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

/**
 * Publisher of the French pages (/fr-fr), for the legal notice (LCEN art. 6): Sam's
 * French sole-trader business (entreprise individuelle), trading as Algorythmos. It is
 * a separate business from ALGORYTHMOS PTY LTD., so it lives here, not in
 * BUSINESS.phone, which feeds the company's schema. Only the legal notice reads it.
 */
export const FR_PUBLISHER = {
  holder: 'Sameer Raj Kalaliya',
  tradingName: BUSINESS.tradingName,
  siren: '991 562 497',
  address: 'La Défense, France',
  phone: '+33 7 49 73 74 84',
  email: BUSINESS.regions.FR.email,
  /** No VAT charged: franchise en base (art. 293 B du CGI), confirmed by Sam on 26 Sep 2026. */
  vatExempt: true,
} as const;

/** Director of publication, named in the legal notice. */
export const PUBLICATION_DIRECTOR = 'Sameer Raj Kalaliya';

/** Host of the whole site, as Vercel publishes it (vercel.com/legal/privacy-notice). */
export const HOST = {
  name: 'Vercel Inc.',
  /** Street address; the country name is translated on the page. */
  address: '440 N Barranca Avenue #4133, Covina, CA 91723',
  url: 'https://vercel.com',
} as const;

/** Schema.org sameAs — derived from the labeled profile list above. */
export const SAME_AS: readonly string[] = BUSINESS.profiles.map((p) => p.url);

export type BusinessRegion = keyof typeof BUSINESS.regions;

/** Postal-address fields a region may publish (AU does; FR is city-level only). */
export interface RegionAddress {
  streetAddress?: string;
  suburb?: string;
  postalCode?: string;
}

/** Single-line postal address for a region, or '' when only city-level data exists. */
export function regionAddressLine(region: BusinessRegion): string {
  const r = BUSINESS.regions[region] as (typeof BUSINESS.regions)[BusinessRegion] & RegionAddress;
  if (!r.streetAddress) return '';
  return `${r.streetAddress}, ${r.suburb} ${r.adminArea} ${r.postalCode}`;
}

/** schema.org PostalAddress for a region — full when a street address exists. */
export function regionPostalAddress(region: BusinessRegion) {
  const r = BUSINESS.regions[region] as (typeof BUSINESS.regions)[BusinessRegion] & RegionAddress;
  return {
    '@type': 'PostalAddress',
    ...(r.streetAddress ? { streetAddress: r.streetAddress } : {}),
    addressLocality: r.suburb ?? r.city,
    addressRegion: r.adminArea,
    ...(r.postalCode ? { postalCode: r.postalCode } : {}),
    addressCountry: r.country,
  };
}
