// src/app/i18n/I18nContext.jsx
// Enterprise-grade i18n context for multi-region localisation
import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getAutoRedirectInfo, detectRegionFromBrowser } from '../routing/regionDetection';

// Import translation files
import enGlobal from './en.global.json';
import enAu from './en.au.json';
import frFr from './fr.fr.json';

// Region configuration
export const REGIONS = {
  GLOBAL: {
    code: 'GLOBAL',
    language: 'en',
    label: 'region.global',
    flag: '🌐',
    pathPrefix: '',
    locale: 'en_US',
    domain: 'https://www.algorythmos.fr',
  },
  AU: {
    code: 'AU',
    language: 'en',
    label: 'region.au',
    flag: '🇦🇺',
    pathPrefix: '/au',
    locale: 'en_AU',
    domain: 'https://algorythmos.com.au',
  },
  FR: {
    code: 'FR',
    language: 'fr',
    label: 'region.fr',
    flag: '🇫🇷',
    pathPrefix: '/fr',
    locale: 'fr_FR',
    domain: 'https://algorythmos.fr',
  },
};

// Translation file mapping
const TRANSLATIONS = {
  'en-GLOBAL': enGlobal,
  'en-AU': { ...enGlobal, ...enAu },
  'fr-FR': { ...enGlobal, ...frFr }, // French inherits English as fallback
};

// localStorage key
const STORAGE_KEY = 'algorythmos_region';

// Create context
const I18nContext = createContext(null);

/**
 * Detect region from URL pathname
 */
function detectRegionFromPath(pathname) {
  if (pathname.startsWith('/au')) return 'AU';
  if (pathname.startsWith('/fr')) return 'FR';
  return 'GLOBAL';
}

/**
 * I18n Provider Component
 */
export function I18nProvider({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Detect initial region from URL
  const initialRegion = detectRegionFromPath(location.pathname);
  const [region, setRegion] = useState(initialRegion);
  
  // Derive language from region config
  const language = REGIONS[region]?.language || 'en';
  
  // Get merged translations for current region
  const translations = useMemo(() => {
    const key = `${language}-${region}`;
    return TRANSLATIONS[key] || TRANSLATIONS['en-GLOBAL'];
  }, [language, region]);

  // Update region when URL changes
  useEffect(() => {
    const detectedRegion = detectRegionFromPath(location.pathname);
    if (detectedRegion !== region) {
      setRegion(detectedRegion);
    }
  }, [location.pathname, region]);

  // Persist region choice to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, region);
    } catch (e) {
      // localStorage not available
    }
  }, [region]);

  // Auto-detect region on first visit OR restore from localStorage
  useEffect(() => {
    if (location.pathname === '/') {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        
        if (stored && REGIONS[stored] && stored !== 'GLOBAL') {
          // Returning user: redirect to their stored preference
          const targetPath = REGIONS[stored].pathPrefix || '/';
          if (location.pathname !== targetPath) {
            navigate(targetPath, { replace: true });
          }
        } else if (!stored) {
          // First-time visitor: auto-detect from browser locale
          const { shouldRedirect, targetPath, detectedRegion } = getAutoRedirectInfo(
            location.pathname, 
            STORAGE_KEY
          );
          
          if (shouldRedirect && targetPath) {
            // Store the detected region so we don't auto-detect again
            localStorage.setItem(STORAGE_KEY, detectedRegion);
            navigate(targetPath, { replace: true });
          }
        }
      } catch (e) {
        // localStorage not available
      }
    }
  }, []); // Only on mount

  /**
   * Translation function with interpolation support
   * Usage: t('footer.copyright', { year: 2025 }) => "© 2025 Algorythmos..."
   */
  const t = useCallback((key, params = {}) => {
    let text = translations[key] || key;
    
    // Simple interpolation: {variable}
    Object.keys(params).forEach((param) => {
      text = text.replace(new RegExp(`\\{${param}\\}`, 'g'), params[param]);
    });
    
    return text;
  }, [translations]);

  /**
   * Change region and navigate to new path
   */
  const setLanguageAndRegion = useCallback((newRegion) => {
    if (!REGIONS[newRegion]) return;
    
    const currentRegionConfig = REGIONS[region];
    const newRegionConfig = REGIONS[newRegion];
    
    // Calculate new path by replacing the region prefix
    let currentPath = location.pathname;
    
    // Remove current region prefix if present
    if (currentRegionConfig.pathPrefix && currentPath.startsWith(currentRegionConfig.pathPrefix)) {
      currentPath = currentPath.slice(currentRegionConfig.pathPrefix.length) || '/';
    }
    
    // Add new region prefix
    let newPath = newRegionConfig.pathPrefix + currentPath;
    
    // Clean up double slashes and ensure valid path
    newPath = newPath.replace(/\/+/g, '/');
    if (newPath === '') newPath = '/';
    
    // For now, just navigate to region root to avoid 404s on sub-pages
    // In a full implementation, you'd have region-specific routes
    newPath = newRegionConfig.pathPrefix || '/';
    
    setRegion(newRegion);
    navigate(newPath);
  }, [region, location.pathname, navigate]);

  /**
   * Get path with current region prefix
   */
  const getRegionPath = useCallback((path) => {
    const prefix = REGIONS[region]?.pathPrefix || '';
    if (path.startsWith('/')) {
      return prefix + path;
    }
    return prefix + '/' + path;
  }, [region]);

  // Context value
  const value = useMemo(() => ({
    // State
    language,
    region,
    locale: REGIONS[region]?.locale || 'en_US',
    
    // Region config
    regionConfig: REGIONS[region],
    allRegions: REGIONS,
    
    // Functions
    t,
    setLanguageAndRegion,
    getRegionPath,
    
    // Helpers
    isGlobal: region === 'GLOBAL',
    isAustralia: region === 'AU',
    isFrance: region === 'FR',
  }), [language, region, t, setLanguageAndRegion, getRegionPath]);

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  );
}

/**
 * Hook to access i18n context
 */
export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}

/**
 * Hook to get just the t function (for components that only need translations)
 */
export function useTranslation() {
  const { t, language, region } = useI18n();
  return { t, language, region };
}

export default I18nContext;
