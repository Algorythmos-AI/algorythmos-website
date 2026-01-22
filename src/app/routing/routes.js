// src/app/routing/routes.js
// Centralized route configuration for enterprise-grade multi-region routing

/**
 * All supported regions with their path prefixes
 * To add a new region: add entry here + create region home page
 */
export const REGION_CONFIG = {
  GLOBAL: { prefix: '', label: 'Global' },
  AU: { prefix: '/au', label: 'Australia' },
  FR: { prefix: '/fr', label: 'France' },
  // Future regions:
  // IN: { prefix: '/in', label: 'India' },
  // UK: { prefix: '/uk', label: 'United Kingdom' },
};

/**
 * Base routes (without region prefix)
 * These are the canonical paths that exist for all regions
 */
export const BASE_ROUTES = {
  home: '/',
  services: '/services',
  serviceDetail: '/services/:slug',
  agenticAutomation: '/services/agentic-automation',
  documentIntelligence: '/services/document-intelligence',
  sqlDashboards: '/services/sql-dashboards',
  mlopsCicd: '/services/mlops-cicd',
  about: '/about',
  contact: '/contact',
  pricing: '/pricing',
  caseStudies: '/case-studies',
  caseStudyDetail: '/case-studies/:slug',
  blog: '/blog',
  blogDetail: '/blog/:slug',
};

/**
 * Generate all routes for a given region
 * @param {string} regionKey - Region key (e.g., 'GLOBAL', 'AU', 'FR')
 * @returns {Object} Routes with region prefix applied
 */
export function getRegionRoutes(regionKey) {
  const config = REGION_CONFIG[regionKey];
  if (!config) {
    console.warn(`Unknown region: ${regionKey}, falling back to GLOBAL`);
    return getRegionRoutes('GLOBAL');
  }

  const prefix = config.prefix;
  const routes = {};

  Object.entries(BASE_ROUTES).forEach(([key, path]) => {
    if (path === '/') {
      // Home route: use prefix as-is, or '/' for global
      routes[key] = prefix || '/';
    } else {
      routes[key] = `${prefix}${path}`;
    }
  });

  return routes;
}

/**
 * Get all region prefixes (for route matching)
 * @returns {string[]} Array of prefixes like ['', '/au', '/fr']
 */
export function getAllRegionPrefixes() {
  return Object.values(REGION_CONFIG).map(c => c.prefix);
}

/**
 * Check if a path belongs to a specific region
 * @param {string} path - URL pathname
 * @param {string} regionKey - Region to check
 * @returns {boolean}
 */
export function isRegionPath(path, regionKey) {
  const prefix = REGION_CONFIG[regionKey]?.prefix || '';
  if (prefix === '') {
    // Global matches paths that don't start with any region prefix
    const otherPrefixes = Object.values(REGION_CONFIG)
      .map(c => c.prefix)
      .filter(p => p !== '');
    return !otherPrefixes.some(p => path.startsWith(p));
  }
  return path.startsWith(prefix);
}

/**
 * Strip region prefix from path to get base path
 * @param {string} path - Full path (e.g., '/fr/services')
 * @returns {string} Base path (e.g., '/services')
 */
export function stripRegionPrefix(path) {
  for (const config of Object.values(REGION_CONFIG)) {
    if (config.prefix && path.startsWith(config.prefix)) {
      const stripped = path.slice(config.prefix.length);
      return stripped || '/';
    }
  }
  return path;
}

/**
 * Add region prefix to a base path
 * @param {string} basePath - Base path (e.g., '/services')
 * @param {string} regionKey - Region key (e.g., 'FR')
 * @returns {string} Prefixed path (e.g., '/fr/services')
 */
export function addRegionPrefix(basePath, regionKey) {
  const prefix = REGION_CONFIG[regionKey]?.prefix || '';
  if (basePath === '/') {
    return prefix || '/';
  }
  return `${prefix}${basePath}`;
}

export default {
  REGION_CONFIG,
  BASE_ROUTES,
  getRegionRoutes,
  getAllRegionPrefixes,
  isRegionPath,
  stripRegionPrefix,
  addRegionPrefix,
};
