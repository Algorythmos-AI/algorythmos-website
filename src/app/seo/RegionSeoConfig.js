// src/app/seo/RegionSeoConfig.js
// Centralized SEO configuration for all regions
// Add new regions here to automatically get full SEO support

/**
 * Region SEO Configuration
 * Each region defines its metadata for Helmet, OpenGraph, Twitter, and JSON-LD
 */
export const REGION_SEO_CONFIG = {
  GLOBAL: {
    code: 'GLOBAL',
    hreflang: 'x-default',
    locale: 'en_US',
    domain: 'https://www.algorythmos.fr',
    siteName: 'Algorythmos',
    title: 'Algorythmos™ — AI Consultancy for SMEs | AI That Delivers',
    description: 'Algorythmos is a boutique AI consultancy delivering agentic automation, document intelligence, SQL dashboards, and MLOps for SMEs worldwide.',
    organization: {
      name: 'Algorythmos',
      alternateName: 'Algorythmos™',
      foundingDate: '2025',
      areaServed: 'Worldwide',
      address: {
        addressLocality: 'Suresnes',
        addressRegion: 'Île-de-France',
        postalCode: '92150',
        addressCountry: 'FR',
      },
    },
  },

  AU: {
    code: 'AU',
    hreflang: 'en-AU',
    locale: 'en_AU',
    domain: 'https://algorythmos.com.au',
    siteName: 'Algorythmos Australia',
    title: 'Algorythmos Australia | AI Consultancy for Australian SMEs & Enterprises',
    description: 'Algorythmos Australia delivers AI consultancy, agentic automation, document intelligence, and MLOps for Australian SMEs and enterprises across healthcare, logistics, mining, and financial services.',
    organization: {
      name: 'Algorythmos Australia',
      alternateName: 'Algorythmos',
      foundingDate: '2025',
      areaServed: { '@type': 'Country', name: 'Australia' },
      address: {
        addressLocality: 'Sydney',
        addressRegion: 'NSW',
        addressCountry: 'AU',
      },
      parentOrganization: {
        '@type': 'Corporation',
        name: 'Algorythmos',
        url: 'https://www.algorythmos.fr',
      },
    },
  },

  FR: {
    code: 'FR',
    hreflang: 'fr-FR',
    locale: 'fr_FR',
    domain: 'https://algorythmos.fr',
    siteName: 'Algorythmos France',
    title: 'Algorythmos France | Cabinet de Conseil en IA pour PME & ETI',
    description: 'Algorythmos est un cabinet de conseil en IA basé à Suresnes, spécialisé dans l\'automatisation agentique, l\'intelligence documentaire, les dashboards SQL et le MLOps. Conforme RGPD et EU AI Act.',
    organization: {
      name: 'Algorythmos France',
      alternateName: 'Algorythmos',
      foundingDate: '2025',
      areaServed: { '@type': 'Country', name: 'France' },
      address: {
        addressLocality: 'Suresnes',
        addressRegion: 'Île-de-France',
        postalCode: '92150',
        addressCountry: 'FR',
      },
    },
  },

  // ============================================
  // TEMPLATE: Add new regions below
  // ============================================
  // IN: {
  //   code: 'IN',
  //   hreflang: 'en-IN',
  //   locale: 'en_IN',
  //   domain: 'https://algorythmos.in',
  //   siteName: 'Algorythmos India',
  //   title: 'Algorythmos India | AI Consultancy for Indian Enterprises',
  //   description: 'Algorythmos India delivers AI consultancy...',
  //   organization: { ... },
  // },
};

/**
 * Get all region codes for generating hreflang links
 */
export function getAllRegions() {
  return Object.keys(REGION_SEO_CONFIG);
}

/**
 * Get SEO config for a specific region
 * Falls back to GLOBAL if region not found
 */
export function getRegionSeoConfig(regionCode) {
  return REGION_SEO_CONFIG[regionCode] || REGION_SEO_CONFIG.GLOBAL;
}

/**
 * Generate hreflang entries for all regions
 * Used for international SEO targeting
 */
export function generateHreflangLinks() {
  return Object.values(REGION_SEO_CONFIG).map((region) => ({
    hreflang: region.hreflang,
    href: region.domain,
  }));
}
