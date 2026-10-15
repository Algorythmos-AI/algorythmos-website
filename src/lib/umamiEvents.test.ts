import { describe, expect, it } from 'vitest';
import { BOOKING_URLS } from './links';
import { clickEvent } from './umamiEvents';

const ORIGIN = 'https://algorythmos.com';

describe('Umami click events', () => {
  it('counts a discovery-call booking from either calendar, with the page locale', () => {
    for (const url of Object.values(BOOKING_URLS)) {
      expect(clickEvent(url, ORIGIN, 'fr-FR')).toEqual({ name: 'book-call', data: { locale: 'fr-FR' } });
      expect(clickEvent(`${url}/?month=2026-11`, ORIGIN)?.name).toBe('book-call');
    }
  });

  it('counts other sites as outbound, by host only', () => {
    expect(clickEvent('https://ieeexplore.ieee.org/document/10413667', ORIGIN)).toEqual({ name: 'outbound-link', data: { host: 'ieeexplore.ieee.org' } });
  });

  it('counts email and phone links', () => {
    expect(clickEvent('mailto:hello@algorythmos.com', ORIGIN)?.name).toBe('email-click');
    expect(clickEvent('tel:+61200000000', ORIGIN)?.name).toBe('phone-click');
  });

  it('ignores links inside the site, anchors and anything malformed', () => {
    expect(clickEvent('/au-en/case-studies', ORIGIN)).toBeNull();
    expect(clickEvent('https://algorythmos.com/fr-fr', ORIGIN)).toBeNull();
    expect(clickEvent('#sources', ORIGIN)).toBeNull();
    expect(clickEvent('javascript:void(0)', ORIGIN)).toBeNull();
    expect(clickEvent('http://[bad', ORIGIN)).toBeNull();
    expect(clickEvent(null, ORIGIN)).toBeNull();
  });
});
