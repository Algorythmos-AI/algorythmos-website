// src/app/routing/index.js
// Barrel export for routing utilities

export {
  detectRegionFromBrowser,
  detectRegionFromPath,
  shouldAutoDetect,
  getRegionPathPrefix,
  getAutoRedirectInfo,
  LOCALE_TO_REGION,
  REGION_ROUTES,
} from './regionDetection';

export {
  REGION_CONFIG,
  BASE_ROUTES,
  getRegionRoutes,
  getAllRegionPrefixes,
  isRegionPath,
  stripRegionPrefix,
  addRegionPrefix,
} from './routes';
