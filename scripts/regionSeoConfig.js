// scripts/regionSeoConfig.js
// Central SEO region configuration for Algorythmos

export const REGION_CONFIG = {
    GLOBAL: {
        key: "GLOBAL",
        label: "Global (.com)",
        expectedDomain: "https://algorythmos.com",
        sitemapFile: "sitemap-com.xml",
        expectedOgImage: "https://algorythmos.com/Algorythmos.png",
    },
    FR: {
        key: "FR",
        label: "France (.fr)",
        expectedDomain: "https://algorythmos.fr",
        sitemapFile: "sitemap-fr.xml",
        expectedOgImage: "https://algorythmos.com/Algorythmos.png", // global brand asset
    },
    AU: {
        key: "AU",
        label: "Australia (.com/au)",
        expectedDomain: "https://algorythmos.com/au",
        sitemapFile: "sitemap-au.xml",
        expectedOgImage: "https://algorythmos.com/Algorythmos.png",
    },
};

/**
 * Resolve region from environment.
 *
 * Priority:
 *  - SEO_REGION (explicit)
 *  - SITE_REGION (fallback)
 *  - default: GLOBAL
 *
 * Allowed values: GLOBAL, FR, AU (case-insensitive).
 */
export function getRegionFromEnv() {
    const raw =
        process.env.SEO_REGION ||
        process.env.SITE_REGION ||
        "GLOBAL";

    const key = raw.toUpperCase();
    if (REGION_CONFIG[key]) return key;

    // Fallback + soft warning in logs, but do NOT crash CI
    console.log(
        `[seo] Unknown SEO_REGION "${raw}", falling back to GLOBAL (https://algorythmos.com)`
    );
    return "GLOBAL";
}

/**
 * Return the active SEO config (domain, sitemap, image) for current environment.
 */
export function getSeoConfig() {
    const regionKey = getRegionFromEnv();
    return REGION_CONFIG[regionKey];
}
