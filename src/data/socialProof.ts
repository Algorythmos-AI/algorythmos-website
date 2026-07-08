/**
 * Social proof — REAL, attributable assets only. Nothing fake ships: both the
 * logo strip and the testimonials render *nothing* until these arrays are filled.
 *
 * Owner (skalaliya) to populate:
 *  - Logos: drop a monochrome SVG (preferred) or transparent PNG in `public/logos/`,
 *    then add an entry below. Keep marks visually similar in height.
 *  - Testimonials: real quotes with a real person's name + role (company optional).
 */
export interface PartnerLogo {
  /** Company name — used as the logo's alt text. */
  name: string;
  /** Public path, e.g. '/logos/acme.svg'. */
  src: string;
  /** Optional outbound link (opens in a new tab). */
  href?: string;
  /** Intrinsic display width in px at 28px height (CLS-safe); defaults to 96. */
  width?: number;
}

export interface Testimonial {
  /** The quote text, WITHOUT surrounding quotation marks. */
  quote: string;
  author: string;
  role: string;
  company?: string;
  /** Optional headshot, e.g. '/testimonials/jane.jpg'. */
  avatar?: string;
}

export const partnerLogos: PartnerLogo[] = [
  // { name: 'Acme Health', src: '/logos/acme.svg', href: 'https://acme.example' },
];

export const testimonials: Testimonial[] = [
  // { quote: 'Algorythmos shipped our document pipeline in six weeks.', author: 'Jane Doe', role: 'COO', company: 'Acme Health' },
];
