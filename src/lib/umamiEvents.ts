/**
 * Which clicks are worth an Umami event. Pure, so it is unit-tested; the
 * listener that calls it is installed only after consent (ConsentBanner.astro).
 */
import { UMAMI } from '@/data/analytics';
import { BOOKING_URLS } from './links';

export interface UmamiEvent {
  name: string;
  data?: Record<string, string>;
}

const BOOKING = new Set<string>(Object.values(BOOKING_URLS));

/** The event for a click on a link to `href`, seen from a page at `origin`; null when it is not worth counting. */
export function clickEvent(href: string | null | undefined, origin: string, locale = ''): UmamiEvent | null {
  if (!href) return null;
  let url: URL;
  try {
    url = new URL(href, origin);
  } catch {
    return null;
  }
  if (url.protocol === 'mailto:') return { name: 'email-click' };
  if (url.protocol === 'tel:') return { name: 'phone-click' };
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return null;
  const bare = `${url.origin}${url.pathname}`.replace(/\/$/, '');
  if (BOOKING.has(bare)) return { name: 'book-call', data: { locale } };
  if (url.origin !== new URL(origin).origin) return { name: 'outbound-link', data: { host: url.host } };
  return null;
}

/** Add the Umami tracker to the page once, and start counting clicks. Called only after consent. */
export function startUmami(): void {
  if (!UMAMI.enabled) return;
  if (!document.querySelector('script[data-website-id]')) {
    const tag = document.createElement('script');
    tag.defer = true;
    tag.src = UMAMI.src;
    tag.dataset.websiteId = UMAMI.websiteId;
    tag.dataset.domains = UMAMI.domains;
    if (UMAMI.performance) tag.dataset.performance = 'true';
    document.head.append(tag);
  }
  if (UMAMI.events) installClickEvents();
}

let installed = false;

/** Send `clickEvent` results to Umami for the rest of the visit. Loaded lazily, after consent. */
export function installClickEvents(): void {
  if (installed) return;
  installed = true;
  document.addEventListener(
    'click',
    (e) => {
      const link = (e.target as Element | null)?.closest?.('a[href]');
      const ev = link && clickEvent(link.getAttribute('href'), location.origin, document.documentElement.lang || '');
      if (ev) (window as unknown as { umami?: { track?: (n: string, d?: object) => void } }).umami?.track?.(ev.name, ev.data);
    },
    { capture: true },
  );
}
