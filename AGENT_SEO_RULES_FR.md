# 🇫🇷 **AGENT_SEO_RULES_FR.md**

**Algorythmos – French SEO Governance Specification**
**Version:** 1.0
**Region:** France
**Primary Domain:** `https://algorythmos.fr`
**Purpose:** Ensure SEO correctness for all `.fr` builds.

---

## 1. Canonical Rules (France)

For all French-region builds:

* **Canonical MUST be:**

  ```
  https://algorythmos.fr/<page>
  ```
* DO NOT use `.com` in the canonical tag.
* DO NOT reference `/fr` in canonical (since `.fr` *is* the FR canonical).

---

## 2. Hreflang Configuration

Every `.fr` page MUST include:

```
x-default → https://algorythmos.com/
en → https://algorythmos.com/
en-AU → https://algorythmos.com/au
fr-FR → https://algorythmos.fr/
```

Rules:

* hreflang **MUST be reciprocal**
* hreflang **MUST NOT include .com/fr**
* No anchors, redirects, or query params

---

## 3. JSON-LD Rules (France)

### 3.1 Organization Schema

* `url`: **MUST remain `.com`** (global identity)
* `logo`: MUST use `.com` asset (global brand)
* DO NOT replace `url` with `.fr`

The `.fr` entity is NOT its own corporation — it is a **regional presence**.

### 3.2 WebSite Schema

For `.fr` builds:

* `url`: **MUST be**

  ```
  https://algorythmos.fr
  ```

* SearchAction target MUST still use `.com`:

  ```
  https://algorythmos.com/?s={search_term}
  ```

### 3.3 DO NOT mix `.com` and `.fr` in the same JSON-LD block

Except for:

* `sameAs[]`
* `areaServed[]`

---

## 4. OG + Twitter Metadata Rules (France)

```
og:url → https://algorythmos.fr/<page>
twitter:url → https://algorythmos.fr/<page>
og:image → https://algorythmos.com/Algorythmos.png
twitter:image → https://algorythmos.com/Algorythmos.png
```

Rules:

* URLs MUST use `.fr`
* Images SHOULD use `.com` (global branding)
* No `.com` OG urls allowed

---

## 5. Domain Separation Rules (France)

* Never preload, preconnect, or dns-prefetch `.com` in FR builds.
* Allowed to preconnect `.com` only for global assets (rare).
* Sitemap used MUST be:

  ```
  https://algorythmos.fr/sitemap-fr.xml
  ```

---

## 6. Modification Rules

Agents may modify:

* Canonical
* hreflang
* JSON-LD (Website only)
* OG/Twitter URLs

Agents MUST NOT modify:

* Page content
* React logic
* UI code

---

## 7. Reporting Format

Same as global file.
