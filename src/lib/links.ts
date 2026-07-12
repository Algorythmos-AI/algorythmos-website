import type { Locale } from '@/i18n';

/**
 * External booking links (Calendly) — single source of truth for
 * discovery-call CTAs. Region-aware: Australian visitors book on the AU
 * calendar; France and the global site share the France calendar.
 */
export const BOOKING_URLS = {
  'au-en': 'https://calendly.com/skalaliya/30min',
  'fr-fr': 'https://calendly.com/algorythmos-france/30min',
  en: 'https://calendly.com/algorythmos-france/30min',
} as const satisfies Record<Locale, string>;

/** Booking link for the current locale. */
export const bookingUrl = (locale: Locale): string => BOOKING_URLS[locale] ?? BOOKING_URLS.en;

/** @deprecated Locale-unaware fallback — prefer bookingUrl(locale). */
export const BOOKING_URL = BOOKING_URLS.en;
