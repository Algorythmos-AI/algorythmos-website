/**
 * Locale Management Utility
 * Handles setting language cookies and forcing redirects to the correct region path.
 * Directly updates document.cookie and window.location for robust behavior.
 */
export function setLocale(locale) {
    // Validate locale (ensure it's one of our supported ones)
    const supportedLocales = ['fr-fr', 'au-en', 'en'];
    if (!supportedLocales.includes(locale)) {
        console.warn(`Attempted to set unsupported locale: ${locale}`);
        return;
    }

    // Set cookie for 1 year
    document.cookie = `locale=${locale}; path=/; max-age=${60 * 60 * 24 * 365}`;

    // Current path segments
    const current = window.location.pathname.split('/');
    // current[0] is always empty string for path starting with /
    // current[1] is the potential locale segment

    // Remove any old locale prefix
    // If current[1] is 'fr-fr' or 'au-en', slice(2) keeps rest of path.
    // If not, slice(1) keeps everything after root.
    const oldLocale = current[1];
    let cleaned = current;

    if (oldLocale === 'fr-fr' || oldLocale === 'au-en') {
        cleaned = current.slice(2);
    } else {
        cleaned = current.slice(1);
    }

    // Construct new path
    // If locale is 'en', we go to root (Global)
    // If locale is 'au-en' or 'fr-fr', we prefix it.
    let newPath;
    const restOfPath = cleaned.join('/');

    if (locale === 'en') {
        // Global -> /path
        newPath = `/${restOfPath}`;
    } else {
        // Region -> /locale/path
        newPath = `/${locale}/${restOfPath}`;
    }

    // Clean double slashes if restOfPath was empty
    newPath = newPath.replace(/\/+$/, '') || '/'; // ensure root if empty
    newPath = newPath.replace('//', '/');

    // Force reload to apply change
    window.location.href = newPath;
}
