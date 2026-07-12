import { describe, expect, it } from 'vitest';
import { orgGraph, professionalService, breadcrumb, ogImageUrl } from './schema';
import { BUSINESS, SAME_AS } from '@/data/business';

describe('orgGraph', () => {
  const nodes = orgGraph['@graph'];
  const org = nodes.find((n: Record<string, unknown>) => n['@type'] === 'Organization') as Record<string, any>;

  it('has exactly one Organization and one WebSite node', () => {
    expect(nodes.filter((n: Record<string, unknown>) => n['@type'] === 'Organization')).toHaveLength(1);
    expect(nodes.filter((n: Record<string, unknown>) => n['@type'] === 'WebSite')).toHaveLength(1);
  });

  it('publishes the canonical business email everywhere', () => {
    expect(org.email).toBe(BUSINESS.email);
    expect(org.contactPoint.email).toBe(BUSINESS.email);
  });

  it('mirrors sameAs profiles from business.ts', () => {
    expect(org.sameAs).toEqual([...SAME_AS]);
    expect(org.sameAs).toEqual(BUSINESS.profiles.map((p) => p.url));
  });
});

describe('professionalService', () => {
  it.each(['AU', 'FR'] as const)('%s: service-area NAP matches business.ts', (region) => {
    const svc = professionalService(region) as Record<string, any>;
    const b = BUSINESS.regions[region];
    expect(svc['@type']).toBe('ProfessionalService');
    expect(svc.email).toBe(BUSINESS.email);
    expect(svc.address.addressLocality).toBe(b.city);
    expect(svc.address.addressCountry).toBe(b.country);
    expect(svc.geo).toEqual({ '@type': 'GeoCoordinates', latitude: b.lat, longitude: b.lng });
    expect(svc.areaServed).toContainEqual({ '@type': 'City', name: b.city });
    expect(svc.parentOrganization['@id']).toContain('#organization');
    expect(svc.priceRange).toBe(b.priceRange);
    // Service-area business: no street address, and never an invented phone.
    expect(svc.address.streetAddress).toBeUndefined();
    if (!BUSINESS.phone) expect(svc.telephone).toBeUndefined();
  });

  it('matches the snapshot graph for both regions', () => {
    expect(professionalService('AU')).toMatchSnapshot();
    expect(professionalService('FR')).toMatchSnapshot();
  });
});

describe('helpers', () => {
  it('breadcrumb positions are 1-based and ordered', () => {
    const bc = breadcrumb([
      { name: 'Home', url: 'https://algorythmos.com/' },
      { name: 'Services', url: 'https://algorythmos.com/services' },
    ]) as Record<string, any>;
    expect(bc.itemListElement.map((i: { position: number }) => i.position)).toEqual([1, 2]);
  });

  it('ogImageUrl normalizes paths to the /og/ key space', () => {
    expect(ogImageUrl('/')).toBe('https://algorythmos.com/og/index.png');
    expect(ogImageUrl('/fr-fr/blog/gdpr-ai')).toBe('https://algorythmos.com/og/fr-fr/blog/gdpr-ai.png');
  });
});
