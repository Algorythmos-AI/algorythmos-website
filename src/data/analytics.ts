/**
 * Self-hosted Umami — a second, cookieless page-view counter beside Vercel's.
 *
 * It loads only after a visitor accepts analytics (ConsentBanner.astro, through
 * src/lib/umamiEvents.ts), and the
 * host must be allowed in the Content-Security-Policy in vercel.json.
 * `enabled: false` stops the script being requested, with nothing else to change.
 */
export const UMAMI = {
  enabled: true,
  /** The tracker script served by the Umami instance. */
  src: 'https://umami-production-0b8d2.up.railway.app/script.js',
  /** The site's id in Umami (Websites → Algorythmos). Public: it is sent with every page view. */
  websiteId: 'aaace585-6679-432d-9e40-a4442aec129f',
  /** Count only the production site, not previews or localhost. */
  domains: 'algorythmos.com,www.algorythmos.com',
  /** Report page-load timings (Web Vitals) to Umami's Performance view. */
  performance: true,
  /** Count bookings, contact-form sends, email/phone and outbound clicks (src/lib/umamiEvents.ts). */
  events: true,
} as const;
