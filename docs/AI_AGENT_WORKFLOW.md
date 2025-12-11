# **Algorythmos – AI Agent Development Workflow**

### *World-Class Multilingual (EN + FR) Website Automation System*

Last updated: 2025-12-11
Owner: **Sam Kalaliya (Algorythmos)**
Regions: **Australia (en-au)**, **France (fr-fr)**
Locales: **EN**, **FR**

---

## 🚨 **QUICK START — Run Before Committing**

```bash
npm run i18n:check   # ← MANDATORY: Verify EN/FR translations match
npm run lint         # Validate code quality
npm run build        # Confirm production build works
```

⚠️ **Do NOT commit if `i18n:check` fails.** Fix all missing translations first.

---

## **1. Purpose of This Document**

This file is a **permanent protocol** for any AI coding agent (Claude Code, Gemini Code Assist, Copilot Workspace, GPT-Engineer, etc.) working on the Algorythmos codebase.

It defines:

* How content must be created
* How translations must be handled
* How services, blogs, and pages must be updated
* How SEO metadata and schemas must be generated
* How the repo must be audited
* What quality checks must be passed before committing

Any agent must fully read this file **before** modifying the repo.

---

## **2. Core Principles**

Every AI agent MUST follow these rules:

### **2.1 Two Languages Always**

Whenever new content is added, **generate BOTH**:

* **English (AU)**
* **French (FR)**

### **2.2 Zero Gaps Policy**

If any page, service, section, or blog is missing French or English:

→ The agent must **automatically translate and insert it**.

### **2.3 Structured Storage**

EN translations live in:

```
src/app/i18n/en.global.json
```

FR translations live in:

```
src/app/i18n/fr.fr.json
```

The agent must update them without breaking existing keys.

---

## **3. Content Types the Agent Must Maintain**

### **3.1 Services**

Whenever a new service is added:

* Add it to `src/data/services.js`
* Add its page under `/src/pages/services/services/[slug]Page.jsx`
* Add EN + FR translations for:
  * title
  * subtitle
  * features
  * CTA labels
  * metadata descriptions
* Add SEO schemas:
  * `BreadcrumbList`
  * `Service structured data`

### **3.2 Blog Posts**

When adding new blog posts:

* Add to BlogDetailPage.jsx slugs array and blogStructures
* Create i18n keys for:
  * `blog.posts.{index}.title/snippet/date`
  * `blogDetail.posts.{slug}.*`
* Generate:
  * **EN** blog content
  * **FR** blog content
  * Article JSON-LD schema
  * SEO meta descriptions

Content must follow Algorythmos brand tone:

* senior engineer precision
* consulting-level clarity
* no hype
* focused on ROI, security, reliability

---

## **4. Translation Workflow**

### **4.1 When Missing French Is Detected**

If a string appears in EN but not FR:

⚠️ The agent must:

1. Detect the missing key
2. Generate a natural, non-literal French translation suited for professional AI consulting
3. Insert it into `fr.fr.json`
4. Format JSON with 2-space indentation

### **4.2 When Missing English Is Detected**

Reverse the same process.

### **4.3 Validation**

After updating translations, run:

* Duplicate key detection
* Key format validation
* Missing key check
* Dead key removal

---

## **5. Page-Level Requirements**

### **Every page must include:**

1. **H1 heading** (only one per page)
2. **Meta title + description (EN + FR)**
3. **OpenGraph metadata**
4. **Canonical URL**
5. **Breadcrumb JSON-LD**
6. **Organisation JSON-LD** (global in App.jsx)

### **Service pages must include:**

* Feature list
* Metrics section
* Capabilities cards
* FAQs (EN + FR)
* CTAs in region-appropriate variants
  * AU uses "Book a Discovery Call"
  * FR uses "Réserver un appel découverte"

---

## **6. SEO Automation Rules**

Every AI agent must check:

### **6.1 Google Rich Results**

Article pages must pass:

* Article structured data
* Breadcrumb structured data

### **6.2 URL validation**

Fix any incorrect pattern:

| Bad       | Good         |
| --------- | ------------ |
| `/au/...` | `/au-en/...` |
| `/fr/...` | `/fr-fr/...` |

### **6.3 Internal linking**

Every blog post must link to:

* At least 2 service pages
* At least 1 related blog

---

## **7. UX Consistency Rules**

### **7.1 Headings**

* Only one H1 per page
* Section headings must be H2
* Sub-sections may use H3

### **7.2 Spacing**

Standard layout spacing:

```
Hero: pt-28 pb-20
Sections: py-20
Cards grid: gap-6
```

### **7.3 Accessibility**

AI agents must ensure:

* aria-labels on icons/buttons
* minimum 4.5:1 contrast
* focus-visible styling
* alt text for images (EN+FR)

---

## **8. How to Add a New Service (AI Agent Instructions)**

When `AI Websites` was added, several changes were required.
Future agents must follow this exact pattern:

1. Create `/src/pages/services/services/[Slug]Page.jsx`
2. Add entry to `src/data/services.js`
3. Update:
   * Navigation dropdown (`src/app/i18n/navConfig.js`)
   * Footer links
   * Home capabilities section
4. Add all translations (EN + FR)
5. Add SEO schemas (Service + BreadcrumbList)
6. Add route in `App.jsx` for:
   * `/services/slug`
   * `/au-en/services/slug`
   * `/fr-fr/services/slug`

---

## **9. How to Add a New Blog Post (AI Agent Instructions)**

1. Generate **English blog writing**
2. Translate to **French**
3. Add slug to `blogSlugs` array in BlogDetailPage.jsx
4. Add structure to `blogStructures` object
5. Add i18n keys:
   * `blog.posts.{index}.*` (list view)
   * `blogDetail.posts.{slug}.*` (detail view)
6. Generate Article JSON-LD (automatic in BlogDetailPage)
7. Add to `BlogPage.jsx` blogPosts array

---

## **10. Region-Aware CTA System**

### Australia

```json
"cta.regionAU.title": "Talk to Our Australian Team",
"cta.regionAU.subtitle": "Sydney-based AI engineers ready to help",
"cta.regionAU.button": "Book a Call with Australian Team"
```

### France

```json
"cta.regionFR.title": "Parlez avec un Expert IA",
"cta.regionFR.subtitle": "Équipe basée à Paris et Suresnes",
"cta.regionFR.button": "Réservez un Appel"
```

AI agents must **always** include both keys.

---

## **11. Final Checklist Before Committing**

The agent must confirm:

### **Translations**

- [ ] All EN keys also exist in FR
- [ ] No missing French on pages
- [ ] No missing French in services
- [ ] No missing French in blog detail pages

### **SEO**

- [ ] Canonical URLs correct (`/au-en/`, `/fr-fr/`)
- [ ] Article schema valid
- [ ] Breadcrumb schema valid
- [ ] Organisation schema present

### **UX**

- [ ] Heading hierarchy correct (one H1)
- [ ] Spacing standards applied
- [ ] aria-labels added
- [ ] Mobile responsive validated

### **Performance**

- [ ] Page includes WebP assets where applicable
- [ ] ScrollSequence uses WebP + PNG fallback
- [ ] No oversized images

---

## **12. Example Agent Prompt**

For any future AI agent:

```
Read /docs/AI_AGENT_WORKFLOW.md fully.

Audit the entire repository for:
- missing translations (EN ↔ FR)
- missing SEO schemas
- incorrect URL patterns
- missing service integrations
- blog indexing issues
- dropdown/footer menu consistency
- accessibility gaps
- spacing/layout inconsistencies

Fix everything automatically.

When adding new content:
- generate EN + FR
- update i18n files
- update pages
- update routes
- add Article + Breadcrumb structured data
- validate before committing

Do not proceed until all checks in section 11 are satisfied.
```

---

## **13. Key File Locations**

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

## **14. Ownership Notes**

This workflow represents the official operational standard for Algorythmos.
Any agent modifying this document must:

* Maintain backward compatibility
* Keep EN + FR requirements
* Preserve all quality gates
