// src/app/routing/routes.spec.js
// Unit tests for centralized route configuration

import { describe, it, expect } from 'vitest';
import {
  REGION_CONFIG,
  BASE_ROUTES,
  getRegionRoutes,
  getAllRegionPrefixes,
  isRegionPath,
  stripRegionPrefix,
  addRegionPrefix,
} from './routes';

describe('Route Configuration', () => {
  describe('REGION_CONFIG', () => {
    it('has all expected regions', () => {
      expect(REGION_CONFIG).toHaveProperty('GLOBAL');
      expect(REGION_CONFIG).toHaveProperty('AU');
      expect(REGION_CONFIG).toHaveProperty('FR');
    });

    it('has correct prefixes', () => {
      expect(REGION_CONFIG.GLOBAL.prefix).toBe('');
      expect(REGION_CONFIG.AU.prefix).toBe('/au');
      expect(REGION_CONFIG.FR.prefix).toBe('/fr');
    });
  });

  describe('BASE_ROUTES', () => {
    it('has all core routes', () => {
      expect(BASE_ROUTES.home).toBe('/');
      expect(BASE_ROUTES.services).toBe('/services');
      expect(BASE_ROUTES.about).toBe('/about');
      expect(BASE_ROUTES.contact).toBe('/contact');
      expect(BASE_ROUTES.pricing).toBe('/pricing');
    });
  });

  describe('getRegionRoutes', () => {
    it('returns unprefixed routes for GLOBAL', () => {
      const routes = getRegionRoutes('GLOBAL');
      expect(routes.home).toBe('/');
      expect(routes.services).toBe('/services');
      expect(routes.about).toBe('/about');
    });

    it('returns prefixed routes for AU', () => {
      const routes = getRegionRoutes('AU');
      expect(routes.home).toBe('/au');
      expect(routes.services).toBe('/au/services');
      expect(routes.about).toBe('/au/about');
    });

    it('returns prefixed routes for FR', () => {
      const routes = getRegionRoutes('FR');
      expect(routes.home).toBe('/fr');
      expect(routes.services).toBe('/fr/services');
      expect(routes.contact).toBe('/fr/contact');
    });

    it('falls back to GLOBAL for unknown region', () => {
      const routes = getRegionRoutes('UNKNOWN');
      expect(routes.home).toBe('/');
    });
  });

  describe('getAllRegionPrefixes', () => {
    it('returns all prefixes', () => {
      const prefixes = getAllRegionPrefixes();
      expect(prefixes).toContain('');
      expect(prefixes).toContain('/au');
      expect(prefixes).toContain('/fr');
    });
  });

  describe('isRegionPath', () => {
    it('identifies AU paths', () => {
      expect(isRegionPath('/au', 'AU')).toBe(true);
      expect(isRegionPath('/au/services', 'AU')).toBe(true);
      expect(isRegionPath('/fr', 'AU')).toBe(false);
    });

    it('identifies FR paths', () => {
      expect(isRegionPath('/fr', 'FR')).toBe(true);
      expect(isRegionPath('/fr/about', 'FR')).toBe(true);
      expect(isRegionPath('/au', 'FR')).toBe(false);
    });

    it('identifies GLOBAL paths (no prefix)', () => {
      expect(isRegionPath('/', 'GLOBAL')).toBe(true);
      expect(isRegionPath('/services', 'GLOBAL')).toBe(true);
      expect(isRegionPath('/au', 'GLOBAL')).toBe(false);
      expect(isRegionPath('/fr', 'GLOBAL')).toBe(false);
    });
  });

  describe('stripRegionPrefix', () => {
    it('strips AU prefix', () => {
      expect(stripRegionPrefix('/au')).toBe('/');
      expect(stripRegionPrefix('/au/services')).toBe('/services');
      expect(stripRegionPrefix('/au/about')).toBe('/about');
    });

    it('strips FR prefix', () => {
      expect(stripRegionPrefix('/fr')).toBe('/');
      expect(stripRegionPrefix('/fr/contact')).toBe('/contact');
    });

    it('returns path unchanged for GLOBAL', () => {
      expect(stripRegionPrefix('/')).toBe('/');
      expect(stripRegionPrefix('/services')).toBe('/services');
    });
  });

  describe('addRegionPrefix', () => {
    it('adds AU prefix', () => {
      expect(addRegionPrefix('/', 'AU')).toBe('/au');
      expect(addRegionPrefix('/services', 'AU')).toBe('/au/services');
    });

    it('adds FR prefix', () => {
      expect(addRegionPrefix('/', 'FR')).toBe('/fr');
      expect(addRegionPrefix('/about', 'FR')).toBe('/fr/about');
    });

    it('returns path unchanged for GLOBAL', () => {
      expect(addRegionPrefix('/', 'GLOBAL')).toBe('/');
      expect(addRegionPrefix('/services', 'GLOBAL')).toBe('/services');
    });
  });
});
