// src/app/routing/regionDetection.js
// Auto-detect user's preferred region from browser locale

/**
 * Map of browser locales to region codes
 * Add new mappings as you expand to more regions
 */
const LOCALE_TO_REGION = {
  // French
  'fr': 'FR',
  'fr-FR': 'FR',
  'fr-BE': 'FR',
  'fr-CA': 'FR',
  'fr-CH': 'FR',
  
  // Australia
  'en-AU': 'AU',
  
  // Future regions (uncomment when ready):
  // India
  // 'en-IN': 'IN',
  // 'hi': 'IN',
  // 'hi-IN': 'IN',
  
  // UK
  // 'en-GB': 'UK',
  
  // US
  // 'en-US': 'US',
};

/**
 * Region metadata for routing decisions
 */
export const REGION_ROUTES = {
  GLOBAL: { pathPrefix: '', priority: 0 },
  AU: { pathPrefix: '/au', priority: 1 },
  FR: { pathPrefix: '/fr', priority: 1 },
  // IN: { pathPrefix: '/in', priority: 1 },
  // UK: { pathPrefix: '/uk', priority: 1 },
};

/**
 * Detect region from browser's navigator.languages
 * Returns the best matching region code, or 'GLOBAL' as fallback
 * 
 * @returns {string} Region code (e.g., 'FR', 'AU', 'GLOBAL')
 */
export function detectRegionFromBrowser() {
  // Check if we're in a browser environment
  if (typeof navigator === 'undefined') {
    return 'GLOBAL';
  }

  // Get browser languages (ordered by preference)
  const languages = navigator.languages || [navigator.language];
  
  for (const lang of languages) {
    // Try exact match first (e.g., 'fr-FR')
    if (LOCALE_TO_REGION[lang]) {
      return LOCALE_TO_REGION[lang];
    }
    
    // Try base language (e.g., 'fr' from 'fr-FR')
    const baseLang = lang.split('-')[0];
    if (LOCALE_TO_REGION[baseLang]) {
      return LOCALE_TO_REGION[baseLang];
    }
  }
  
  return 'GLOBAL';
}

/**
 * Check if auto-detection should run
 * Only runs on first visit (no stored preference)
 * 
 * @param {string} storageKey - localStorage key for region preference
 * @returns {boolean}
 */
export function shouldAutoDetect(storageKey) {
  if (typeof localStorage === 'undefined') {
    return false;
  }
  
  try {
    const stored = localStorage.getItem(storageKey);
    // Only auto-detect if no preference stored
    return stored === null;
  } catch {
    // localStorage unavailable — default to no auto-detection
    return false;
  }
}

/**
 * Get the path prefix for a region
 * 
 * @param {string} region - Region code
 * @returns {string} Path prefix (e.g., '/fr', '/au', '')
 */
export function getRegionPathPrefix(region) {
  return REGION_ROUTES[region]?.pathPrefix || '';
}

/**
 * Check if current path matches a region
 * 
 * @param {string} pathname - Current URL pathname
 * @returns {string|null} Detected region code or null
 */
export function detectRegionFromPath(pathname) {
  if (pathname.startsWith('/au')) return 'AU';
  if (pathname.startsWith('/fr')) return 'FR';
  // if (pathname.startsWith('/in')) return 'IN';
  // if (pathname.startsWith('/uk')) return 'UK';
  return 'GLOBAL';
}

/**
 * Determine if user should be redirected to a region
 * Only redirects from root path on first visit
 * 
 * @param {string} pathname - Current URL pathname
 * @param {string} storageKey - localStorage key
 * @returns {{ shouldRedirect: boolean, targetPath: string, detectedRegion: string }}
 */
export function getAutoRedirectInfo(pathname, storageKey) {
  // Only auto-redirect from root path
  if (pathname !== '/') {
    return { shouldRedirect: false, targetPath: '', detectedRegion: 'GLOBAL' };
  }
  
  // Only if no stored preference
  if (!shouldAutoDetect(storageKey)) {
    return { shouldRedirect: false, targetPath: '', detectedRegion: 'GLOBAL' };
  }
  
  const detectedRegion = detectRegionFromBrowser();
  
  // Don't redirect if Global is detected
  if (detectedRegion === 'GLOBAL') {
    return { shouldRedirect: false, targetPath: '/', detectedRegion: 'GLOBAL' };
  }
  
  const targetPath = getRegionPathPrefix(detectedRegion);
  
  return {
    shouldRedirect: true,
    targetPath,
    detectedRegion,
  };
}

export default {
  detectRegionFromBrowser,
  detectRegionFromPath,
  shouldAutoDetect,
  getRegionPathPrefix,
  getAutoRedirectInfo,
  LOCALE_TO_REGION,
  REGION_ROUTES,
};
