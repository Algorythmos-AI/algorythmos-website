import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// Key used in I18nContext for persistence
const STORAGE_KEY = 'algorythmos_region';

// Allowed locale prefixes
const LOCALE_PATHS = ['/au-en', '/fr-fr'];

/**
 * Client-Side Smart Router (Middleware functionality)
 * Handles:
 * 1. Cookie/Storage Persistence
 * 2. Domain-based routing
 * 3. Browser Language Detection
 * 
 * Runs on every route change, but logic protects against loops.
 */
export const GeoRouter = () => {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const { pathname, search, hash } = location;

        // 0. SAFETY CHECK: Skip internal Next.js/Vite assets (though usually not routed here)
        if (pathname.startsWith('/api') || pathname.includes('.')) return;

        // 1. ALREADY IN LOCALE?
        // If the user is already on a valid locale route, DO NOT INTERFERE.
        // This matches middleware logic: "Already inside a locale route? return next()"
        const isLocaleRoute = LOCALE_PATHS.some(prefix => pathname.startsWith(prefix));
        if (isLocaleRoute) return;

        // If we are here, we are on a "Global" route (e.g. /, /services, /about)

        // 2. COOKIE PREFERENCE (Primary Enterprise Source of Truth)
        // Checks standard 'locale' cookie set by setLocale() utility
        const getCookie = (name) => {
            if (typeof document === 'undefined') return null;
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop().split(';').shift();
            return null;
        };

        const cookieLocale = getCookie('locale');

        if (cookieLocale === 'au-en') {
            // Redirect to AU version of current path if not already there
            const targetPath = pathname === '/' ? '/au-en' : `/au-en${pathname}`;
            navigate(`${targetPath}${search}${hash}`, { replace: true });
            return;
        }

        if (cookieLocale === 'fr-fr') {
            // Redirect to FR version
            const targetPath = pathname === '/' ? '/fr-fr' : `/fr-fr${pathname}`;
            navigate(`${targetPath}${search}${hash}`, { replace: true });
            return;
        }

        // Fallback: Check localStorage (Legacy support)
        try {
            const savedRegion = localStorage.getItem(STORAGE_KEY);
            if (savedRegion === 'AU') {
                const targetPath = pathname === '/' ? '/au-en' : `/au-en${pathname}`;
                navigate(`${targetPath}${search}${hash}`, { replace: true });
                return;
            }
            if (savedRegion === 'FR') {
                const targetPath = pathname === '/' ? '/fr-fr' : `/fr-fr${pathname}`;
                navigate(`${targetPath}${search}${hash}`, { replace: true });
                return;
            }
        } catch {
            // localStorage unavailable (e.g. incognito mode) — skip region redirect
        }

        // 3. DOMAIN-BASED ROUTING (Backup for client-side navigation)
        const hostname = window.location.hostname;
        if (hostname.includes('algorythmos.com.au')) {
            navigate(`/au-en${pathname}${search}${hash}`, { replace: true });
            return;
        }
        if (hostname.includes('algorythmos.fr')) {
            navigate(`/fr-fr${pathname}${search}${hash}`, { replace: true });
            return;
        }

        // 4. BROWSER LANGUAGE DETECTION
        // Only applied if NO preference is saved (Storage check passed above)
        // and we are on the Root path (to avoid annoying redirects deep in site?)
        // Middleware sample applied it everywhere. "browserLocale = getLocaleFromBrowser(req)".
        // So if I visit /services and my browser is FR, I should go to /fr-fr/services.
        if (typeof navigator !== 'undefined' && navigator.language) {
            const lang = navigator.language.toLowerCase();

            if (lang.includes('fr')) {
                const targetPath = pathname === '/' ? '/fr-fr' : `/fr-fr${pathname}`;
                navigate(`${targetPath}${search}${hash}`, { replace: true });
                return;
            }

            if (lang.includes('en-au')) {
                const targetPath = pathname === '/' ? '/au-en' : `/au-en${pathname}`;
                navigate(`${targetPath}${search}${hash}`, { replace: true });
                return;
            }
        }

        // 5. Default Fallback -> Stay Global
        // No action needed.

    }, [location, navigate]);

    return null; // Logic only, renders nothing
};
