import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { useI18n, REGIONS } from '../../app/i18n/I18nContext';

/**
 * Enterprise SEO Head
 * Automatically injects:
 * - Canonical Links
 * - Hreflang Tags (x-default, en, en-au, fr-fr)
 * - Region-specific Title/Description overrides (optional)
 * 
 * Matches Accenture/Deloitte global SEO structure.
 */
export const SeoHead = () => {
    const location = useLocation();
    const { region } = useI18n();
    const pathname = location.pathname;

    // Base Domain
    const BASE_DOMAIN = 'https://algorythmos.com';

    // 1. Determine "Clean Path" (the slug without locale prefix)
    // /au-en/services -> /services
    // /services -> /services
    // /fr-fr -> /
    let cleanPath = pathname;

    // Explicitly handle known prefixes
    if (cleanPath.startsWith('/au-en')) {
        cleanPath = cleanPath.replace('/au-en', '') || '/';
    } else if (cleanPath.startsWith('/fr-fr')) {
        cleanPath = cleanPath.replace('/fr-fr', '') || '/';
    }

    // Ensure clean path doesn't double slash
    // cleanPath = cleanPath.replace('//', '/'); // simple regex better if needed

    // 2. Generate URLs for each region
    const getUrlForRegion = (targetRegion) => {
        if (targetRegion === 'GLOBAL') {
            // https://algorythmos.com/services
            return `${BASE_DOMAIN}${cleanPath === '/' ? '' : cleanPath}`;
        }
        if (targetRegion === 'AU') {
            // https://algorythmos.com/au-en/services
            return `${BASE_DOMAIN}/au-en${cleanPath === '/' ? '' : cleanPath}`;
        }
        if (targetRegion === 'FR') {
            // https://algorythmos.com/fr-fr/services
            return `${BASE_DOMAIN}/fr-fr${cleanPath === '/' ? '' : cleanPath}`;
        }
        return BASE_DOMAIN;
    };

    // 3. Determine Canonical for CURRENT page
    const currentCanonical = getUrlForRegion(region);

    return (
        <Helmet>
            {/* Canonical */}
            <link rel="canonical" href={currentCanonical} />

            {/* Hreflang Tags - TELLING GOOGLE ABOUT ALTERNATES */}

            {/* x-default (Global fallback) */}
            <link rel="alternate" href={getUrlForRegion('GLOBAL')} hreflang="x-default" />

            {/* English Global */}
            <link rel="alternate" href={getUrlForRegion('GLOBAL')} hreflang="en" />

            {/* Australia */}
            <link rel="alternate" href={getUrlForRegion('AU')} hreflang="en-au" />

            {/* France */}
            <link rel="alternate" href={getUrlForRegion('FR')} hreflang="fr-fr" />

        </Helmet>
    );
};
