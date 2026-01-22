// src/app/seo/SeoBreadcrumbs.jsx
// Reusable BreadcrumbList JSON-LD component for sitelinks
// Usage: <SeoBreadcrumbs items={[{ name: "Home", url: "/" }, { name: "Services", url: "/services" }]} />

import React from 'react';
import { useI18n } from '../i18n/I18nContext';
import { getCanonicalBase } from '../utils/seoHelpers';

/**
 * SeoBreadcrumbs Component
 * Renders BreadcrumbList JSON-LD schema for Google sitelinks
 * 
 * @param {Object} props
 * @param {Array} props.items - Array of breadcrumb items { name: string, path: string }
 *                              path is relative (e.g., "/services"), will be prefixed with canonical base
 */
export default function SeoBreadcrumbs({ items }) {
    const { region } = useI18n();
    const canonicalBase = getCanonicalBase(region);

    const breadcrumbJsonLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": items.map((item, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": item.name,
            "item": item.path === "/" ? canonicalBase : `${canonicalBase}${item.path}`
        }))
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        />
    );
}

/**
 * Helper to build breadcrumb items from nav keys
 * @param {Function} t - i18n translation function
 * @param {Array} crumbs - Array of { key: string, path: string }
 * @returns {Array} Formatted breadcrumb items
 */
export function buildBreadcrumbs(t, crumbs) {
    return crumbs.map(crumb => ({
        name: t(crumb.key),
        path: crumb.path
    }));
}
