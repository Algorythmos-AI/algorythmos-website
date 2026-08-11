# CLAUDE.md — orientation for AI agents working in this repository

This file is the entry point. Read it before doing anything, then read the canonical
document for whichever kind of work you have been asked to do.

This repository holds two different things that happen to share a folder:

1. **The Algorythmos website** — an Astro 6 static site (EN/FR).
2. **Corporate and commercial records** for Algorythmos Pty Ltd — statutory
   documents, client files, signed agreements.

The rules for each are different. Do not apply website conventions to corporate
records, or vice versa.

---

## 1. Website work

**Canonical rules live in [`/docs/AI_AGENT_WORKFLOW.md`](docs/AI_AGENT_WORKFLOW.md).
Read it first.** Supporting governance sits in [`.algorythmos/`](.algorythmos/) —
notably `LLM_CHANGE_POLICY.md`, `CODE_STYLE_GUIDE.md` and `CONTENT_MODEL.md`.

This file deliberately does **not** restate those rules, so that there is only ever
one source of truth. The short version, as a pointer only:

- Never modify `legacy/` — it is the archived Vite + React SPA.
- Maintain EN + FR parity; every user-facing string goes through `t()`, with keys in
  `src/i18n/ui/*.json`.
- Style only with the semantic design tokens in `src/styles/tokens.css` / `themes.css`.
- Head metadata belongs in `src/components/seo/SEO.astro`; schema in `src/seo/schema.ts`
  — extend, never replace.
- Do not change the canonical domain (`https://algorythmos.com`) or the locale URL
  patterns (`/au-en`, `/fr-fr`).

Full pre-commit gate, mirroring CI:

```bash
npm run check && npm run i18n:check && npm run health:check && npm run build && npm run seo:check && npm run link:check
```

---

## 2. Company identity — use these, never invent them

`src/data/business.ts` carries an explicit instruction that nothing in it may be
invented — no fake phone number, ABN or SIRET. That rule stands. These identifiers
are now real, verified against the ASIC and ABN public registers, and safe to publish:

| Field | Value |
|---|---|
| Legal name | ALGORYTHMOS PTY LTD. |
| ACN | 701 006 626 |
| ABN | 22 701 006 626 |
| Entity type | Australian private company — proprietary, limited by shares |
| Jurisdiction | Registered in New South Wales |
| Registered | 3 August 2026 |
| GST | Registered from 3 August 2026 |
| Registered office / principal place of business | **Level 1**, 457–459 Elizabeth Street, Surry Hills NSW 2010 |
| Registered business name | ALGORYTHMOS (to 4 August 2027) |

Two cautions before you use the address anywhere:

- **"Level 1" is correct** — confirmed by the provider's signed s100 consent, their written
  ASIC-registration instruction and their signature block. Always use Level 1 in documents.
  The **business name register was corrected on 6 August 2026** (ASIC transaction 1-106SNR53).
  The **company register still wrongly records "Unit 1"** — the postal-database default —
  pending the corporate key. Do not copy the company register's form of the address.
- The premises are a **virtual office** (ODSC Pty Ltd T/A Bustle Studios). The site
  is modelled as a service-area business with city-level areas and no street address.
  Keep it that way; do not add a street address to schema, contact pages or `llms.txt`.
- Statutory mail goes to that virtual office and **is shredded after one month**. Never
  assume posted correspondence is safe to collect later.

There is a **second, older, still-active entity**: sole trader *Kalaliya, Sameer Raj*,
ABN 70 153 527 339. It is not the website's entity and must not appear in site content.
Whether it continues to operate is an open decision — see the compliance plan.

**The France question is unresolved.** The site publishes an "Algorythmos France"
presence (Paris, `.fr` domains, French contact address). No French entity exists in any
record reviewed as at 6 August 2026. Do not add further French corporate or legal
claims — no SIRET, no French registration numbers, no French registered address —
until that is resolved.

---

## 3. Corporate records — `asic/` and `Bustle-studios/`

`Bustle-studios/` holds the virtual-office provider records by month (invoices, receipts,
onboarding correspondence). `asic/` is the company's statutory record — the ASIC
registration paperwork, the certificate of registration, the signed occupier consent, and
two living documents:

- **`ALGORYTHMOS-ASIC-compliance-plan.md`** — the written plan: what is held, what is
  outstanding, statutory deadlines, and the open decisions.
- **`algorythmos-asic-tracker.html`** — a self-contained status dashboard covering the
  same items with live deadline countdowns.

**If you change anything about the company's registration status, update both.**
They are meant to stay current; a stale compliance tracker is worse than none.

### Never commit these

`asic/`, `Clients/` and `Bustle-studios/` are all git-ignored and Vercel-ignored,
deliberately. They hold ASIC keys, signed consents, bank and card details, invoices
and client PII.

- Do not remove those ignore rules.
- Do not copy their contents into tracked files, commit messages, issues or PR bodies.
- Do not paste an ASIC key, corporate key, TFN or bank detail into any file in this
  repository — including this one. The ACN and ABN in the table above are public
  register data and are the *only* company identifiers that belong in tracked code.

---

## 4. Standing compliance dates

Keep these in mind if you are asked to build anything time-sensitive:

| Date | What |
|---|---|
| 28 October 2026 | First company BAS (July–September 2026 quarter) |
| 3 August 2027 | ASIC annual review — $342, plus a solvency resolution |
| 4 August 2027 | Business name renewal — $47 (1 yr) or $108 (3 yrs) |
| Ongoing | Changes to company details must reach ASIC within 28 days |

---

*Last updated 6 August 2026. Company facts verified against ABN Lookup and primary ASIC
correspondence on that date. This file is orientation, not legal or tax advice.*
