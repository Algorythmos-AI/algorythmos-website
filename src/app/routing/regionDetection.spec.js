// src/app/routing/regionDetection.spec.js
import { describe, it, expect } from 'vitest';
import {
  detectRegionFromPath,
  getRegionPathPrefix,
  REGION_ROUTES,
} from './regionDetection';

describe('Region Detection', () => {
  describe('detectRegionFromPath', () => {
    it('detects FR region from /fr path', () => {
      expect(detectRegionFromPath('/fr')).toBe('FR');
      expect(detectRegionFromPath('/fr/about')).toBe('FR');
      expect(detectRegionFromPath('/fr/services/agentic-automation')).toBe('FR');
    });

    it('detects AU region from /au path', () => {
      expect(detectRegionFromPath('/au')).toBe('AU');
      expect(detectRegionFromPath('/au/contact')).toBe('AU');
    });

    it('returns GLOBAL for other paths', () => {
      expect(detectRegionFromPath('/')).toBe('GLOBAL');
      expect(detectRegionFromPath('/about')).toBe('GLOBAL');
      expect(detectRegionFromPath('/services')).toBe('GLOBAL');
    });
  });

  describe('getRegionPathPrefix', () => {
    it('returns correct prefixes', () => {
      expect(getRegionPathPrefix('GLOBAL')).toBe('');
      expect(getRegionPathPrefix('AU')).toBe('/au');
      expect(getRegionPathPrefix('FR')).toBe('/fr');
    });

    it('returns empty string for unknown regions', () => {
      expect(getRegionPathPrefix('UNKNOWN')).toBe('');
    });
  });

  describe('REGION_ROUTES configuration', () => {
    it('has correct path prefixes', () => {
      expect(REGION_ROUTES.GLOBAL.pathPrefix).toBe('');
      expect(REGION_ROUTES.AU.pathPrefix).toBe('/au');
      expect(REGION_ROUTES.FR.pathPrefix).toBe('/fr');
    });

    it('supports expected regions', () => {
      expect(REGION_ROUTES).toHaveProperty('GLOBAL');
      expect(REGION_ROUTES).toHaveProperty('AU');
      expect(REGION_ROUTES).toHaveProperty('FR');
    });
  });
});
