// src/i18n/navConfig.js
// Region-aware navigation configuration

/**
 * Navigation configuration per region
 * Each item has:
 * - key: translation key for the label
 * - path: the path suffix (will be prefixed with region prefix)
 * - external: if true, path is used as-is (for external links)
 */
export const NAV_CONFIG = {
  GLOBAL: [
    { key: "nav.home", path: "/" },
    { key: "nav.services", path: "/services" },
    { key: "nav.pricing", path: "/pricing" },
    { key: "nav.about", path: "/about" },
    { key: "nav.blog", path: "/blog" },
    { key: "nav.caseStudies", path: "/case-studies" },
    { key: "nav.contact", path: "/contact" },
  ],
  AU: [
    { key: "nav.home", path: "/au" },
    { key: "nav.services", path: "/services" },
    { key: "nav.pricing", path: "/pricing" },
    { key: "nav.about", path: "/about" },
    { key: "nav.caseStudies", path: "/case-studies" },
    { key: "nav.contact", path: "/contact" },
  ],
  FR: [
    { key: "nav.home", path: "/fr" },
    { key: "nav.services", path: "/services" },
    { key: "nav.pricing", path: "/pricing" },
    { key: "nav.about", path: "/about" },
    { key: "nav.caseStudies", path: "/case-studies" },
    { key: "nav.contact", path: "/contact" },
  ],
};

/**
 * Footer navigation links per region
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
 * Get navigation items for a specific region
 */
export function getNavItems(region) {
  return NAV_CONFIG[region] || NAV_CONFIG.GLOBAL;
}

/**
 * Get footer navigation items
 */
export function getFooterNav() {
  return FOOTER_NAV;
}

export default NAV_CONFIG;
