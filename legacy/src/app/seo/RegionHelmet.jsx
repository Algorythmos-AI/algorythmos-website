// src/app/seo/RegionHelmet.jsx
// Reusable Helmet component for region-aware SEO
// Usage: <RegionHelmet region="AU" /> or <RegionHelmet region="FR" />

import React from 'react';
import { Helmet } from 'react-helmet-async';
import { getRegionSeoConfig, generateHreflangLinks } from './RegionSeoConfig';

/**
 * Build JSON-LD Organization schema from region config
 */
function buildOrganizationJsonLd(config) {
  const org = config.organization;
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: org.name,
    alternateName: org.alternateName,
    url: config.domain,
    logo: `${config.domain}/Algorythmos.png`,
    description: config.description,
    foundingDate: org.foundingDate,
    areaServed: typeof org.areaServed === 'string' 
      ? org.areaServed 
      : org.areaServed,
    address: {
      '@type': 'PostalAddress',
      ...org.address,
    },
    sameAs: [
      'https://www.linkedin.com/company/algorythmos',
      'https://x.com/algorythmos',
    ],
    ...(org.parentOrganization && { parentOrganization: org.parentOrganization }),
  };
}

/**
 * RegionHelmet Component
 * Renders complete SEO metadata for a given region
 * 
 * @param {Object} props
 * @param {string} props.region - Region code (e.g., 'AU', 'FR', 'GLOBAL')
 * @param {string} [props.titleOverride] - Optional title override
 * @param {string} [props.descriptionOverride] - Optional description override
 * @param {string} [props.pathSuffix] - Optional path suffix for canonical URL
 */
export default function RegionHelmet({ 
  region, 
  titleOverride, 
  descriptionOverride,
  pathSuffix = '' 
}) {
  const config = getRegionSeoConfig(region);
  const hreflangLinks = generateHreflangLinks(pathSuffix);
  
  const title = titleOverride || config.title;
  const description = descriptionOverride || config.description;
  const canonicalUrl = `${config.domain}${pathSuffix}`;
  const imageUrl = `${config.domain}/Algorythmos.png`;
  
  const organizationJsonLd = buildOrganizationJsonLd(config);

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Hreflang for International Targeting */}
      {hreflangLinks.map(({ hreflang, href }) => (
        <link 
          key={hreflang} 
          rel="alternate" 
          hreflang={hreflang} 
          href={href} 
        />
      ))}
      
      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:site_name" content={config.siteName} />
      <meta property="og:locale" content={config.locale} />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
      
      {/* JSON-LD Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(organizationJsonLd)}
      </script>
    </Helmet>
  );
}

/**
 * Export for testing and advanced usage
 */
export { buildOrganizationJsonLd };
