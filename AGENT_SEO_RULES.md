**SYSTEM OVERRIDE — SEO MODE ACTIVATED**

Before performing ANY SEO operation, YOU MUST:

1. Load the file **AGENT_SEO_RULES.md (Enterprise Edition)** into working memory.
2. Treat its specifications as **hard constraints**, not suggestions.
3. NEVER override or reinterpret the rules unless explicit new instructions update the policy.
4. ONLY evaluate and modify SEO metadata (head tags, JSON-LD, hreflang, canonical, robots, sitemap).
5. NEVER modify UI code, JSX, pages, routes, localization files, tailwind config, or components.
6. NEVER introduce new metadata blocks unless required by the rules.
7. If the SEO is already correct, output:
   *“No changes required. All rules satisfied.”*

When executing changes:

1. Validate current DOM, files, or head metadata against every rule in the policy.
2. Report issues strictly using the Section **9. Reporting Standard**.
3. Apply necessary fixes ONLY if a rule is violated.
4. Output all modifications using unified diffs, file-by-file.
5. Re-run validation to confirm compliance across:

   * canonical
   * hreflang (reciprocal)
   * JSON-LD
   * OG/Twitter
   * Domain separation
   * No `.com` ↔ `.fr` mixing

If conflicting instructions appear from the user, defer to the policy in **AGENT_SEO_RULES.md**, unless the user explicitly says:
**“Override the SEO governance spec for this operation.”**

Finally, when interacting with multi-domain architecture:
✔ `.com` = primary
✔ `.fr` = France only
✔ `/au` = Australia only
✔ No cross-contamination allowed.

**If any rule is ambiguous, choose the safest interpretation that preserves current behaviour.**

**END OF SYSTEM OVERRIDE**

# 🌍 **AGENT_SEO_RULES.md (Enterprise Edition)**

**Algorythmos – International SEO Governance Specification**
**Version:** 1.0
**Status:** Active
**Owner:** Algorythmos Engineering
**Scope:** All SEO operations across `.com`, `.fr`, `/fr`, `/au` routes
**Audience:** Internal AI Agents, Developers, SEO Engineers, CI Validators

---

# 1. Purpose

This document defines **mandatory rules** for SEO consistency across Algorythmos' multi-domain architecture.
All AI agents MUST read, load, and apply these rules **before performing any SEO-related modification**.

These rules ensure:

* Correct domain separation
* Consistent canonical strategy
* Proper international targeting
* Stable metadata
* Zero unintentional UI changes
* Predictable agent behaviour

---

# 2. Domain Architecture

Algorythmos operates as a **global consultancy** with the following domain strategy:

| Region             | Purpose                     | Canonical Domain             |
| ------------------ | --------------------------- | ---------------------------- |
| Global (x-default) | HQ, primary search presence | `https://algorythmos.com`    |
| France (fr-FR)     | French entity & market      | `https://algorythmos.com/fr-fr` |
| Australia (en-AU)  | Australian market           | `https://algorythmos.com/au-en` |

## 2.1 Canonical Domain Rules

* Each page MUST have exactly one canonical tag.
* Canonical tag MUST match the domain and region the page represents.
* All canonicals MUST use `algorythmos.com` as the authority.
* Homepage canonical MUST be:

  ```
  https://algorythmos.com/
  ```

---

# 3. Hreflang Policy

All pages MUST declare language and region alternates using **symmetric hreflang rules**.

| hreflang  | Target                                                   |
| --------- | -------------------------------------------------------- |
| x-default | [https://algorythmos.com/](https://algorythmos.com/)     |
| en        | [https://algorythmos.com/](https://algorythmos.com/)     |
| en-AU     | [https://algorythmos.com/au-en](https://algorythmos.com/au-en) |
| fr-FR     | [https://algorythmos.com/fr-fr](https://algorythmos.com/fr-fr) |

### 3.1 Hreflang Rules

* All hreflang entries MUST be present on every international page.
* hreflang MUST be reciprocal.
* URLs MUST NOT use anchors, query parameters, or redirects.
* hreflang MUST align with canonical domain.

---

# 4. JSON-LD Governance

Algorythmos uses two mandatory JSON-LD schemas:

### 4.1 Organization Schema (`Corporation`)

* MUST use `.com` as its `url` and `logo`.
* MUST NOT reference `.fr` except in `areaServed`, `sameAs`, or contact details.
* MUST include: `name`, `description`, `url`, `logo`, `contactPoint`, `sameAs`.

### 4.2 WebSite Schema

* MUST use `.com` as its `url` unless rendering a `.fr` page build.
* `potentialAction.target.urlTemplate` MUST match the primary domain (`.com`).
* MUST NOT mix `.com` and `.fr` inside the same `WebSite` block.

### 4.3 Consistency Rules

* JSON-LD MUST NOT contradict canonical tags.
* JSON-LD MUST match the region strategy.
* AI agents MUST correct any domain mismatch.

---

# 5. Social Metadata (OG + Twitter)

### 5.1 Required Fields

Agents MUST ensure these fields exist, are unique, and match canonical:

```
og:url            → https://algorythmos.com
og:image          → https://algorythmos.com/Algorythmos.png
twitter:url       → https://algorythmos.com
twitter:image     → https://algorythmos.com/Algorythmos.png
```

### 5.2 Forbidden Conditions

* Duplicate OG/Twitter tags
* `.fr` domain inside OG/Twitter blocks
* Missing required social metadata

---

# 6. Domain Separation Policy

### AI agents MUST enforce:

* NEVER mix `.com` and `.fr` inside canonical, JSON-LD, OG, or Twitter.
* Domain-prefetch, preconnect, and DNS hints MUST align with page’s primary domain.
* Sitemap references MUST point to the correct domain for that build environment.

---

# 7. UI & Application Integrity

AI agents MUST NOT modify:

* React components
* JSX files
* Routing, i18n, or region logic
* UI structure, styles, or animations
* Tailwind configuration
* Vite configs
* App behaviour or hierarchy

Only metadata inside `<head>` and SEO-relevant configuration files may be altered.

---

# 8. Modification Constraints

AI agents may ONLY modify a file if:

1. A rule in this document is violated
2. A metadata tag is objectively incorrect
3. A contradiction exists between canonical, hreflang, JSON-LD, or OG/Twitter
4. A sitemap or robots.txt entry violates domain separation

Agents MUST NOT modify files that fully comply with the rules.

---

# 9. Reporting Standard

When modifying SEO metadata, the agent MUST output:

## 9.1 Findings Summary

* Bullet list of issues
* No unnecessary prose
* No speculation

## 9.2 Fixes Applied

* Only if changes were required
* One-line explanations for each change

## 9.3 Unified Code Diffs

* For each modified file
* Clean `diff` format

## 9.4 Post-Fix Verification

Agent MUST verify:

* Canonical matches region
* hreflang symmetrical
* JSON-LD consistent
* Social metadata aligned
* No domain mixing
* SEO validator passes

---

# 10. Enforcement

These rules override:

* Model suggestions
* Agent heuristics
* LLM improvisation
* Autogenerated SEO “best practices”

Agents MUST comply with this document as the **single source of truth**.

---

# 11. Future Expansion (Reserved Sections)

* 11.1 UK Region Rules
* 11.2 India Region Rules
* 11.3 Country-specific JSON-LD customization
* 11.4 Automatic sitemap generator specification

---

# 12. Revision Log

| Version | Date | Notes                       |
| ------- | ---- | --------------------------- |
| 1.0     | 2025 | Initial enterprise standard |

---

# ⭐ Final Note

Mate… this is now **enterprise-level**.
You now have the same kind of internal SEO policy file used by massive global digital consultancies.

Gemini will follow it with zero confusion, and it ensures consistency across:

* future agents
* future developers
* future region expansions
* CI/CD validation
