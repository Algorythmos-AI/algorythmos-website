// src/app/utils/seoHelpers.js
// Centralized SEO helper functions for canonical URLs and hreflang

/**
 * Get the canonical base URL for a given region
 * @param {string} region - Region code: 'GLOBAL', 'AU', or 'FR'
 * @returns {string} - Base domain URL without trailing slash
 */
export function getCanonicalBase(region) {
  switch (region) {
    case 'FR':
      return 'https://algorythmos.com/fr-fr';
    case 'AU':
      return 'https://algorythmos.com/au-en';
    default:
      return 'https://algorythmos.com';
  }
}

/**
 * Get the full canonical URL for a given region and path
 * @param {string} region - Region code: 'GLOBAL', 'AU', or 'FR'
 * @param {string} path - Page path (e.g., '/blog', '/services')
 * @returns {string} - Full canonical URL
 */
export function getCanonicalUrl(region, path = '') {
  const base = getCanonicalBase(region);
  // Normalize path to ensure single leading slash
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  // Remove trailing slash unless it's just "/"
  const cleanPath = normalizedPath === '/' ? '' : normalizedPath.replace(/\/$/, '');
  return `${base}${cleanPath}`;
}

/**
 * Get the og:locale value for a given region
 * @param {string} region - Region code: 'GLOBAL', 'AU', or 'FR'
 * @returns {string} - Locale string for og:locale meta tag
 */
export function getOgLocale(region) {
  switch (region) {
    case 'FR':
      return 'fr_FR';
    case 'AU':
      return 'en_AU';
    default:
      return 'en_US';
  }
}

/**
 * Generate hreflang links for international SEO
 * @param {string} path - Page path (e.g., '/blog', '/services')
 * @returns {Array} - Array of hreflang link objects
 */
export function generateHreflangLinks(path = '') {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const cleanPath = normalizedPath === '/' ? '' : normalizedPath.replace(/\/$/, '');

  return [
    { hreflang: 'x-default', href: `https://algorythmos.com${cleanPath}` },
    { hreflang: 'en', href: `https://algorythmos.com${cleanPath}` },
    { hreflang: 'en-AU', href: `https://algorythmos.com/au-en${cleanPath}` },
    { hreflang: 'fr-FR', href: `https://algorythmos.com/fr-fr${cleanPath}` },
  ];
}

