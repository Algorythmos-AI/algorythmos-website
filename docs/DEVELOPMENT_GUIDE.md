# Algorythmos Development Guide

> **MANDATORY**: Read this entire document before making any code changes.

---

## 🚨 Pre-Commit Checklist

Before every commit, run:

```bash
npm run i18n:check   # ❌ FAILS if EN/FR translations out of sync
npm run lint         # Code quality check
npm run build        # Production build validation
```

**Do NOT commit if `i18n:check` fails.**

---

## 📋 Table of Contents

1. [Core Principles](#1-core-principles)
2. [Translation System](#2-translation-system)
3. [URL Patterns](#3-url-patterns)
4. [Adding New Content](#4-adding-new-content)
5. [Page Requirements](#5-page-requirements)
6. [Region-Aware CTAs](#6-region-aware-ctas)
7. [Key File Locations](#7-key-file-locations)
8. [Validation Commands](#8-validation-commands)

---

## 1. Core Principles

### Two Languages Always
Every string must exist in **BOTH** English AND French. No exceptions.

### Zero Gaps Policy
If any page, service, or content is missing French or English, you must translate and add it.

### No Hardcoded Text
All user-facing text must use the `t('key')` translation function.

---

## 2. Translation System

### File Locations

| Language | File |
|----------|------|
| English | `src/app/i18n/en.global.json` |
| French | `src/app/i18n/fr.fr.json` |

### Rules

- Every key in EN must also exist in FR
- Use 2-space indentation in JSON files
- Professional, non-literal translations for French
- Run `npm run i18n:check` to validate parity

### Current Status
```
EN keys: 1197
FR keys: 1197
Missing: 0
```

---

## 3. URL Patterns

| ❌ Wrong | ✅ Correct |
|----------|------------|
| `/au/services` | `/au-en/services` |
| `/fr/services` | `/fr-fr/services` |

**Always use the full locale pattern**: `/au-en/` and `/fr-fr/`

---

## 4. Adding New Content

### Adding a New Service

1. Create `/src/pages/services/services/[Slug]Page.jsx`
2. Add entry to `src/data/services.js`
3. Update navigation (`src/app/i18n/navConfig.js`)
4. Update footer links
5. Add ALL translations (EN + FR)
6. Add SEO schemas (Service + BreadcrumbList)
7. Add routes in `App.jsx`:
   - `/services/slug`
   - `/au-en/services/slug`
   - `/fr-fr/services/slug`

### Adding a New Blog Post

1. Generate English content
2. Translate to French
3. Add slug to `blogSlugs` array in `BlogDetailPage.jsx`
4. Add structure to `blogStructures` object
5. Add i18n keys:
   - `blog.posts.{index}.*` (list view)
   - `blogDetail.posts.{slug}.*` (detail view)
6. Generate Article JSON-LD
7. Add to `BlogPage.jsx` blogPosts array

---

## 5. Page Requirements

### Every Page Must Include

- [ ] One H1 heading (only one per page)
- [ ] Meta title + description (EN + FR)
- [ ] OpenGraph metadata
- [ ] Canonical URL
- [ ] Breadcrumb JSON-LD
- [ ] Organisation JSON-LD (global in App.jsx)

### Service Pages Must Include

- Feature list
- Metrics section
- Capabilities cards
- FAQs (EN + FR)
- Region-appropriate CTAs

### Heading Hierarchy

- Only **one H1** per page
- Sections: **H2**
- Sub-sections: **H3**

### Standard Spacing

```
Hero: pt-28 pb-20
Sections: py-20
Cards grid: gap-6
```

---

## 6. Region-Aware CTAs

### Australia CTAs

```json
{
  "cta.regionAU.title": "Talk to Our Australian Team",
  "cta.regionAU.subtitle": "Sydney-based AI engineers ready to help",
  "cta.regionAU.button": "Book a Call with Australian Team"
}
```

### France CTAs

```json
{
  "cta.regionFR.title": "Parlez avec un Expert IA",
  "cta.regionFR.subtitle": "Équipe basée à Paris et Suresnes",
  "cta.regionFR.button": "Réservez un Appel"
}
```

**Always include both regional CTA keys.**

---

## 7. Key File Locations

| Purpose | Path |
|---------|------|
| EN translations | `src/app/i18n/en.global.json` |
| FR translations | `src/app/i18n/fr.fr.json` |
| Navigation config | `src/app/i18n/navConfig.js` |
| Services data | `src/data/services.js` |
| SEO helpers | `src/app/utils/seoHelpers.js` |
| Routes | `src/App.jsx` |
| Blog listing | `src/pages/insights/BlogPage.jsx` |
| Blog detail | `src/pages/insights/BlogDetailPage.jsx` |

---

## 8. Validation Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start dev server (localhost:5173) |
| `npm run build` | Production build |
| `npm run i18n:check` | **MANDATORY** - Verify EN/FR parity |
| `npm run lint` | ESLint check |
| `npm run test:e2e` | Playwright E2E tests |
| `npm run seo:check` | Validate SEO metadata |
| `npm run health:check` | Accessibility scanner |
| `npm run deploy:prod` | Deploy to Vercel |

---

## 9. Accessibility Requirements

- `aria-labels` on icons/buttons
- Minimum 4.5:1 contrast ratio
- `focus-visible` styling
- Alt text for images (EN + FR)
- `prefers-reduced-motion` support

---

## 10. Brand Colors

| Name | Hex | Usage |
|------|-----|-------|
| `algviolet` | `#6D00FF` | Primary |
| `algpurple` | `#7658E7` | Accent |
| `algblue` | `#3715E0` | Secondary |

---

**Owner:** Sam Kalaliya (Algorythmos)  
**Last Updated:** 2026-01-22
