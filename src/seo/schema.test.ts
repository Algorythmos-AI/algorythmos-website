import { describe, expect, it } from 'vitest';
import { orgGraph, professionalService, breadcrumb, ogImageUrl, isoDateTime } from './schema';
import { BUSINESS, SAME_AS, regionPostalAddress, regionAddressLine } from '@/data/business';
import { services } from '@/data/services';

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

  it('publishes the registered legal identity and office', () => {
    expect(org.legalName).toBe(BUSINESS.legalName);
    expect(org.address).toEqual(regionPostalAddress('AU'));
    expect(org.identifier).toContainEqual({ '@type': 'PropertyValue', propertyID: 'ABN', value: BUSINESS.abn });
    expect(regionAddressLine('AU')).toBe('Level 1, 457–459 Elizabeth Street, Surry Hills NSW 2010');
    expect(regionAddressLine('FR')).toBe('');
  });

  it('points the contact point at the live contact page, not a redirect', () => {
    expect(org.contactPoint.url).toBe('https://algorythmos.com/au-en/contact');
  });

  it('points the founder at the page that names the founder', () => {
    const founder = nodes.find((n: Record<string, unknown>) => n['@type'] === 'Person') as Record<string, any>;
    expect(org.founder).toEqual({ '@id': founder['@id'] });
    expect(founder.url).toBe('https://algorythmos.com/au-en/press');
  });

  it('mirrors sameAs profiles from business.ts', () => {
    expect(org.sameAs).toEqual([...SAME_AS]);
    expect(org.sameAs).toEqual(BUSINESS.profiles.map((p) => p.url));
  });
});

describe('professionalService', () => {
  it.each(['AU', 'FR'] as const)('%s: NAP matches business.ts', (region) => {
    const svc = professionalService(region) as Record<string, any>;
    const b = BUSINESS.regions[region] as Record<string, any>;
    expect(svc['@type']).toBe('ProfessionalService');
    expect(svc.email).toBe(BUSINESS.email);
    expect(svc.address).toEqual(regionPostalAddress(region));
    expect(svc.address.addressCountry).toBe(b.country);
    expect(svc.geo).toEqual({ '@type': 'GeoCoordinates', latitude: b.lat, longitude: b.lng });
    expect(svc.areaServed).toContainEqual({ '@type': 'City', name: b.city });
    expect(svc.parentOrganization['@id']).toContain('#organization');
    expect(svc.priceRange).toBe(b.priceRange);
    // Never an invented phone.
    if (!BUSINESS.phone) expect(svc.telephone).toBeUndefined();
  });

  it('AU publishes the registered office; FR stays city-level (no French entity)', () => {
    const au = professionalService('AU') as Record<string, any>;
    const fr = professionalService('FR') as Record<string, any>;
    expect(au.address.streetAddress).toBe(BUSINESS.regions.AU.streetAddress);
    expect(au.address.addressLocality).toBe(BUSINESS.regions.AU.suburb);
    expect(au.address.postalCode).toBe(BUSINESS.regions.AU.postalCode);
    expect(fr.address.streetAddress).toBeUndefined();
    expect(fr.address.postalCode).toBeUndefined();
    expect(fr.address.addressLocality).toBe(BUSINESS.regions.FR.city);
  });

  it('lists every service in serviceType (plus the umbrella "AI Consulting")', () => {
    const au = professionalService('AU') as Record<string, any>;
    expect(au.serviceType).toHaveLength(services.length + 1);
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

describe('isoDateTime', () => {
  it('adds 09:00 Sydney time with the AEST offset in winter', () => {
    expect(isoDateTime('2026-07-15')).toBe('2026-07-15T09:00:00+10:00');
  });
  it('uses the AEDT offset in summer', () => {
    expect(isoDateTime('2026-01-15')).toBe('2026-01-15T09:00:00+11:00');
  });
  it('leaves a full datetime untouched', () => {
    expect(isoDateTime('2026-09-25T10:00:00Z')).toBe('2026-09-25T10:00:00Z');
  });
});
