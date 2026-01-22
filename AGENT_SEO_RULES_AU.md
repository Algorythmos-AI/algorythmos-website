# 🇦🇺 **AGENT_SEO_RULES_AU.md**

**Algorythmos – Australia SEO Governance Specification**
**Version:** 1.0
**Region:** Australia
**Primary Domain:** `https://algorythmos.com/au`
**Purpose:** Ensure SEO correctness for Australian marketing pages.

---

## 1. Canonical Rules (Australia)

For `/au` pages:

* **Canonical MUST be:**

  ```
  https://algorythmos.com/au/<page>
  ```
* DO NOT use `.fr`
* DO NOT canonicalise to `.com` root
* DO NOT canonicalise to `/fr`

---

## 2. Hreflang Configuration (Australia)

Each `/au` page MUST include:

```
x-default → https://algorythmos.com/
en → https://algorythmos.com/
en-AU → https://algorythmos.com/au
fr-FR → https://algorythmos.fr/
```

Rules:

* `/au` is considered a **regional variant**, not a separate domain.
* hreflang MUST include `.fr` and `.com` variants.
* hreflang MUST NOT reference `/fr` route.

---

## 3. JSON-LD Rules (Australia)

### 3.1 Organization Schema

* MUST use `.com` values for `url` & `logo`
* MUST NOT reference `/au` in Organization schema
* MUST NOT reference `.fr` except under areaServed

### 3.2 WebSite Schema

* MUST use:

  ```
  https://algorythmos.com
  ```

  Never `.fr`.

### 3.3 SearchAction

* MUST use `.com`:

  ```
  https://algorythmos.com/?s={search_term_string}
  ```

Australia is a **regional language market**, not a separate site.

---

## 4. OG + Twitter Metadata (Australia)

```
og:url → https://algorythmos.com/au/<page>
twitter:url → https://algorythmos.com/au/<page>
og:image → https://algorythmos.com/Algorythmos.png
twitter:image → https://algorythmos.com/Algorythmos.png
```

Rules:

* URLs MUST use `/au`
* Images use `.com`
* MUST NOT use `.fr` assets

---

## 5. Domain Separation Rules (Australia)

Allowed:

* Preconnect `.com` (primary domain)
* Use `.com` CDN assets

Not allowed:

* Preconnect `.fr`
* Use `.fr` in canonical or OG tags
* Link `/fr` as alternates

---

## 6. Modification Rules

Agents may modify:

* Canonical
* hreflang
* OG/Twitter URLs

Agents MUST NOT modify:

* UI
* React components
* Routing logic
