# 🚨 STOP — AI AGENT RULES

> **You MUST read this before writing ANY code.**

---

## 📄 Full Documentation

**Read First:** [/docs/AI_AGENT_WORKFLOW.md](./docs/AI_AGENT_WORKFLOW.md)

---

## ✅ Pre-Commit Checklist

Before committing, run these commands:

```bash
npm run i18n:check   # ❌ FAILS if EN/FR translations out of sync
npm run lint         # Check code quality
npm run build        # Validate production build
```

---

## 🌐 The Two-Language Rule

| EN File | FR File |
|---------|---------|
| `src/app/i18n/en.global.json` | `src/app/i18n/fr.fr.json` |

**Every string you add to EN must also be added to FR. No exceptions.**

---

## 🔗 URL Patterns

| ❌ Wrong | ✅ Correct |
|----------|-----------|
| `/au/...` | `/au-en/...` |
| `/fr/...` | `/fr-fr/...` |

---

## 📋 Quick Rules

1. **i18n** — Generate EN + FR for all content
2. **SEO** — Add Article, BreadcrumbList, Organisation JSON-LD
3. **H1** — One H1 per page only
4. **CTAs** — Use `cta.regionAU.*` and `cta.regionFR.*` keys

---

## 🚫 Do NOT Proceed Until

- [ ] Read `/docs/AI_AGENT_WORKFLOW.md`
- [ ] Understand EN/FR translation requirements
- [ ] Know where `en.global.json` and `fr.fr.json` are
- [ ] Prepared to run `npm run i18n:check` before committing

---

**Owner:** Sam Kalaliya (Algorythmos)  
**Last Updated:** 2025-12-11
