# Algorythmos SEO Governance

> This document defines mandatory SEO rules. Treat them as hard constraints.

---

## 📋 Table of Contents

1. [Domain Architecture](#1-domain-architecture)
2. [Canonical Rules](#2-canonical-rules)
3. [Hreflang Policy](#3-hreflang-policy)
4. [JSON-LD Schemas](#4-json-ld-schemas)
5. [Social Metadata](#5-social-metadata)
6. [Region-Specific Rules](#6-region-specific-rules)
7. [Modification Constraints](#7-modification-constraints)

---

## 1. Domain Architecture

| Region | URL Pattern | Canonical Domain |
|--------|-------------|------------------|
| Global (x-default) | `/` | `https://algorythmos.com` |
| France (fr-FR) | `/fr-fr/...` | `https://algorythmos.com/fr-fr` |
| Australia (en-AU) | `/au-en/...` | `https://algorythmos.com/au-en` |

**Primary Authority**: `algorythmos.com`

---

## 2. Canonical Rules

### Global Rules
- Each page must have **exactly one** canonical tag
- Canonical must match the page's region
- All canonicals use `algorythmos.com` as authority

### By Region

| Region | Canonical Format |
|--------|------------------|
| Global | `https://algorythmos.com/` |
| Australia | `https://algorythmos.com/au-en/<page>` |
| France | `https://algorythmos.com/fr-fr/<page>` |

### Forbidden
- ❌ Do NOT canonicalize to `.com` root for regional pages
- ❌ Do NOT use `algorythmos.fr` in canonicals
- ❌ Do NOT use `/au/` or `/fr/` patterns

---

## 3. Hreflang Policy

### Required Tags (All Pages)

```html
<link rel="alternate" hreflang="x-default" href="https://algorythmos.com/" />
<link rel="alternate" hreflang="en" href="https://algorythmos.com/" />
<link rel="alternate" hreflang="en-AU" href="https://algorythmos.com/au-en" />
<link rel="alternate" hreflang="fr-FR" href="https://algorythmos.com/fr-fr" />
```

### Rules
- All hreflang entries must be **reciprocal**
- URLs must NOT use anchors, query parameters, or redirects
- Must align with canonical domain

---

## 4. JSON-LD Schemas

### Organization Schema
- `url`: Must use `.com`
- `logo`: Must use `.com` asset
- Include: `name`, `description`, `url`, `logo`, `contactPoint`, `sameAs`

### WebSite Schema
- `url`: Match the page's domain
- `potentialAction.target.urlTemplate`: Use `.com`
- Do NOT mix `.com` and regional paths in same block

### Required Schemas Per Page Type

| Page Type | Required Schemas |
|-----------|------------------|
| All Pages | Organization, WebSite |
| Blog Posts | + Article, BreadcrumbList |
| Services | + Service, BreadcrumbList |

---

## 5. Social Metadata

### Required Tags

```html
<meta property="og:url" content="https://algorythmos.com/<page>" />
<meta property="og:image" content="https://algorythmos.com/Algorythmos.png" />
<meta name="twitter:url" content="https://algorythmos.com/<page>" />
<meta name="twitter:image" content="https://algorythmos.com/Algorythmos.png" />
```

### Rules
- URLs match the page's canonical
- Images always use `.com` (global branding)
- No duplicate OG/Twitter tags

---

## 6. Region-Specific Rules

### Australia (`/au-en/`)

| Element | Value |
|---------|-------|
| Canonical | `https://algorythmos.com/au-en/<page>` |
| OG URL | `https://algorythmos.com/au-en/<page>` |
| OG Image | `https://algorythmos.com/Algorythmos.png` |
| JSON-LD Organization | Use `.com` |
| JSON-LD WebSite | Use `.com` |

### France (`/fr-fr/`)

| Element | Value |
|---------|-------|
| Canonical | `https://algorythmos.com/fr-fr/<page>` |
| OG URL | `https://algorythmos.com/fr-fr/<page>` |
| OG Image | `https://algorythmos.com/Algorythmos.png` |
| JSON-LD Organization | Use `.com` |
| JSON-LD WebSite | Use `.com` |

---

## 7. Modification Constraints

### Safe to modify
- Canonical tags
- Hreflang tags
- JSON-LD schemas (metadata only)
- OG/Twitter URLs

### Do not modify without review
- The canonical domain and locale prefixes (`/au-en`, `/fr-fr`)
- The retired root tree (legacy `/…` URLs 308 to `/au-en` in `vercel.json`) and the hreflang set
- `src/i18n/index.ts` locale/region logic
- `src/seo/schema.ts` identity graph (`#organization`, `#website`, `#founder`)
- `vercel.json` redirects and headers
- `astro.config.mjs` sitemap configuration

---

## 8. Google Business Profiles

### France Office (Suresnes)

| Field | Value |
|-------|-------|
| Business Name | Algorythmos |
| Category | AI Consulting Company |
| Address | Suresnes, 92150, Île-de-France, France |
| Website | `https://algorythmos.com/fr-fr/contact` |
| Hours | Mon-Fri: 09:00-18:00 CET |

### Australia Office (Sydney)

| Field | Value |
|-------|-------|
| Business Name | Algorythmos Australia |
| Category | AI Consulting Company |
| Address | Sydney, NSW, Australia |
| Website | `https://algorythmos.com/au-en/contact` |
| Hours | Mon-Fri: 09:00-18:00 AEDT |

---

## 9. Validation

After any SEO changes:

1. Verify canonical matches region
2. Verify hreflang is symmetrical
3. Verify JSON-LD is consistent
4. Verify social metadata aligned
5. Run `npm run seo:check`
6. Test with [Google Rich Results Test](https://search.google.com/test/rich-results)

---

**Owner:** Algorythmos Engineering  
**Last Updated:** 2026-01-22
