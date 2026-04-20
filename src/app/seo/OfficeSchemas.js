// src/app/seo/OfficeSchemas.js
// LocalBusiness/ProfessionalService schemas for France and Australia offices
// Used for enhanced local SEO and Google Business Profile integration

/**
 * France Head Office Schema
 * Suresnes, Île-de-France
 */
export const FRANCE_OFFICE_SCHEMA = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": "Algorythmos – Suresnes, Île-de-France (Head Office)",
    "alternateName": "Algorythmos France",
    "description": "Cabinet de conseil en IA spécialisé dans l'automatisation agentique, l'intelligence documentaire, les dashboards SQL et le MLOps. Conforme RGPD et EU AI Act.",
    "url": "https://algorythmos.com/fr-fr/contact",
    "logo": "https://algorythmos.com/Algorythmos.png",
    "image": "https://algorythmos.com/Algorythmos.png",
    "priceRange": "$$$$",
    "address": {
        "@type": "PostalAddress",
        "addressLocality": "Suresnes",
        "addressRegion": "Île-de-France",
        "postalCode": "92150",
        "addressCountry": "FR"
    },
    "geo": {
        "@type": "GeoCoordinates",
        "latitude": 48.8698,
        "longitude": 2.2192
    },
    "areaServed": [
        { "@type": "Country", "name": "France" },
        { "@type": "Continent", "name": "Europe" },
        { "@type": "GeoShape", "name": "North Africa" }
    ],
    "serviceType": [
        "AI Consulting",
        "Agentic Automation",
        "Document Intelligence",
        "SQL Dashboards",
        "MLOps"
    ],
    "parentOrganization": {
        "@type": "Organization",
        "name": "Algorythmos",
        "url": "https://algorythmos.com"
    },
    "sameAs": [
        "https://www.linkedin.com/company/algorythmos"
    ]
};

/**
 * Australia Head Office Schema
 * Sydney, NSW
 */
export const AUSTRALIA_OFFICE_SCHEMA = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": "Algorythmos – Sydney, NSW (Head Office)",
    "alternateName": "Algorythmos Australia",
    "description": "AI consultancy delivering agentic automation, document intelligence, SQL dashboards, and MLOps for Australian SMEs and enterprises.",
    "url": "https://algorythmos.com/au-en/contact",
    "logo": "https://algorythmos.com/Algorythmos.png",
    "image": "https://algorythmos.com/Algorythmos.png",
    "priceRange": "$$$$",
    "address": {
        "@type": "PostalAddress",
        "addressLocality": "Sydney",
        "addressRegion": "NSW",
        "addressCountry": "AU"
    },
    "geo": {
        "@type": "GeoCoordinates",
        "latitude": -33.8688,
        "longitude": 151.2093
    },
    "areaServed": [
        { "@type": "Country", "name": "Australia" },
        { "@type": "GeoShape", "name": "APAC" }
    ],
    "serviceType": [
        "AI Consulting",
        "Agentic Automation",
        "Document Intelligence",
        "SQL Dashboards",
        "MLOps"
    ],
    "parentOrganization": {
        "@type": "Organization",
        "name": "Algorythmos",
        "url": "https://algorythmos.com"
    },
    "sameAs": [
        "https://www.linkedin.com/company/algorythmos"
    ]
};

/**
 * Get office schema by region code
 * @param {string} region - 'FR' or 'AU'
 * @returns {Object} Office schema
 */
export function getOfficeSchema(region) {
    switch (region) {
        case 'FR':
            return FRANCE_OFFICE_SCHEMA;
        case 'AU':
            return AUSTRALIA_OFFICE_SCHEMA;
        default:
            return null;
    }
}

/**
 * Combined @graph for both offices
 * Use this on pages that need to show both locations
 */
export const OFFICES_GRAPH = {
    "@context": "https://schema.org",
    "@graph": [
        FRANCE_OFFICE_SCHEMA,
        AUSTRALIA_OFFICE_SCHEMA
    ]
};
