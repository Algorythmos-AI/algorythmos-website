// src/app/i18n/navConfig.js
// Region-aware navigation configuration

/**
 * Region path prefixes
 */
const REGION_PREFIXES = {
  GLOBAL: '',
  FR: '/fr-fr',
  // Future regions:
  // IN: '/in-en',
  // UK: '/uk-en',
  // US: '/us-en',
};

/**
 * Generate region-aware path
 * @param {string} region - Region code (GLOBAL, AU, FR, etc.)
 * @param {string} path - Base path (e.g., "/about", "/services")
 * @returns {string} Region-prefixed path
 */
export function withRegionPath(region, path) {
  // Home path for non-global regions
  if (path === '/' && region !== 'GLOBAL') {
    return REGION_PREFIXES[region] || '/';
  }

  // Global uses paths as-is
  if (region === 'GLOBAL') {
    return path;
  }

  // Add region prefix
  const prefix = REGION_PREFIXES[region] || '';
  return `${prefix}${path}`;
}

/**
 * Base navigation items (without region prefixes)
 * These are the canonical paths that get prefixed per region
 */
const BASE_NAV_ITEMS = [
  { key: "nav.home", path: "/" },
  {
    key: "nav.services",
    path: "/services",
    mega: true,
    description: "nav.servicesDesc",
    children: [
      { key: "services.agenticAutomation", path: "/services/agentic-automation" },
      { key: "services.documentIntelligence", path: "/services/document-intelligence" },
      { key: "services.sqlDashboards", path: "/services/sql-dashboards" },
      { key: "services.mlops", path: "/services/mlops-cicd" },
    ]
  },
  { key: "nav.pricing", path: "/pricing" },
  { key: "nav.about", path: "/about" },
  { key: "nav.blog", path: "/blog" },
  { key: "nav.caseStudies", path: "/case-studies" },
  { key: "nav.contact", path: "/contact" },
];

/**
 * Region-specific nav overrides (optional)
 * Use this to hide/show items per region
 */
const REGION_NAV_OVERRIDES = {
  AU: {
    // AU shows all items
    exclude: [],
  },
  FR: {
    // FR shows all items
    exclude: [],
  },
};

/**
 * Navigation configuration per region (legacy format - kept for backwards compatibility)
 * Now auto-generated with proper region prefixes
 */
export const NAV_CONFIG = {
  GLOBAL: BASE_NAV_ITEMS,
  AU: BASE_NAV_ITEMS,
  FR: BASE_NAV_ITEMS,
};

/**
 * Footer navigation links (base paths)
 */
export const FOOTER_NAV = {
  services: [
    { key: "services.agenticAutomation", path: "/services/agentic-automation" },
    { key: "services.documentIntelligence", path: "/services/document-intelligence" },
    { key: "services.sqlDashboards", path: "/services/sql-dashboards" },
    { key: "services.mlops", path: "/services/mlops-cicd" },
  ],
  company: [
    { key: "nav.about", path: "/about" },
    { key: "nav.caseStudies", path: "/case-studies" },
    { key: "nav.blog", path: "/blog" },
    { key: "nav.contact", path: "/contact" },
  ],
  resources: [
    { key: "nav.pricing", path: "/pricing" },
    { key: "nav.blog", path: "/blog" },
  ],
};

/**
 * Get navigation items for a specific region with proper prefixes
 * @param {string} region - Region code
 * @returns {Array} Navigation items with region-prefixed paths
 */
export function getNavItems(region) {
  const overrides = REGION_NAV_OVERRIDES[region] || {};
  const excludeKeys = overrides.exclude || [];

  return BASE_NAV_ITEMS
    .filter(item => !excludeKeys.includes(item.key))
    .map(item => ({
      ...item,
      path: withRegionPath(region, item.path),
      children: item.children
        ? item.children.map(child => ({
          ...child,
          path: withRegionPath(region, child.path)
        }))
        : undefined
    }));
}

/**
 * Get footer navigation items with region prefixes
 * @param {string} region - Region code
 * @returns {Object} Footer nav sections with region-prefixed paths
 */
export function getFooterNav(region) {
  const prefixItems = (items) =>
    items.map(item => ({
      ...item,
      path: withRegionPath(region, item.path),
    }));

  return {
    services: prefixItems(FOOTER_NAV.services),
    company: prefixItems(FOOTER_NAV.company),
    resources: prefixItems(FOOTER_NAV.resources),
  };
}

export default NAV_CONFIG;
