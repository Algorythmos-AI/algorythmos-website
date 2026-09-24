# Copy & Claims Sign-off (EN + FR)

**Owner:** skalaliya · **Purpose:** verify every *factual / quantitative / comparative* claim on the live
site is truthful and defensible **before** heavy marketing/ads. This register lists each claim, its
source, and its sign-off status so the site never publishes a figure nobody can stand behind.

Mark each: `[x]` approved as-is · `[~]` reword (note the fix) · `[ ]` not yet reviewed.
Anything you change in EN must be mirrored in FR (`i18n:check` enforces key parity, not meaning — that's on us).

---

## 1. Pricing page (`/pricing`, `/au-en/pricing`, `/fr-fr/pricing`) — **highest scrutiny**

These are commercial claims; comparative ones carry the most risk.

- [ ] **€2,000/mo** — entry tier price + what's included ("Up to …"). Correct & current?
- [ ] **€4,500/mo** — growth tier price + inclusions. Correct & current?
- [ ] **€600 / €900/day** — day-rate figures. Correct?
- [ ] **Comparison: €18,000/mo (Algorythmos) vs €24,500/mo ("traditional agency")** — ⚠️ *comparative
      advertising.* Can you substantiate the €24,500 "traditional agency" benchmark (source / basis)? In the
      EU/FR, unsubstantiated comparative claims are legally risky. Either cite a basis or soften to a
      qualitative statement.
- [ ] Currency: prices shown in **€ on all three locales** (incl. `/au-en`). Confirm that's intended, or
      should AU show AUD? *(currently € everywhere — flag if AU buyers expect AUD.)*

## 2. Case study — Administrative Burden (`/case-studies/admin-burden-evidence`)

- [ ] **"~$261M in legal liability tied to documentation and handover failures."** Source defensible?
- [ ] **"~$5.4B economic opportunity from reducing administrative friction."** Source defensible?
- [ ] **"a measurable daily patient-safety risk, drawn from peer-reviewed readmission data."** OK to state?
- [ ] Sourcing claim: **"Supreme Court judgments, official government research, and peer-reviewed
      patient-safety studies."** Accurate description of what the report actually used?
- [ ] **"legal-grade" / "irrefutable" / "platinum standard"** — comfortable with this strength of wording?

## 3. Case study — Healthcare Documentation Burden (`/case-studies/healthcare-burden`)

- [ ] **"~$2B in annual inefficiency cost from documentation burden nationwide."** Source defensible?
- [ ] **"clinicians spend nearly as much time on documentation as on direct patient care."** Source?
- [ ] **"Digital Disconnect"** framing — yours to use / not a trademarked term?
- [ ] Links administrative load to **clinician burnout and reduced patient access** — OK to assert?

## 4. Homepage + global positioning (`/`, footer, meta)

- [ ] **"AI consultancy for SMEs in Sydney & Paris"** — accurate descriptor?
- [ ] **"Senior engineers only — you work directly with the people building your system."** True for every engagement?
- [ ] **"Compliance-first / GDPR-aligned"** — do you want to assert GDPR *alignment*? (We avoided
      "compliant/certified" — confirm "aligned" is the right strength.)
- [ ] **"Outcome-based delivery — scoped to measurable business outcomes."** Reflects how you actually contract?
- [ ] **"Bilingual (EN/FR)"** — confirmed.
- [ ] **Locations = Sydney + Paris, city-level only** (no street address / phone published — by design). Confirm.
- [ ] Footer copyright year shows **2026** — correct.

## 5. Services pages (`/services/*`)

- [ ] Each service's described capabilities, deliverables, and any named tools/frameworks are accurate and
      something you actually offer. *(5 services — skim each for over-promises.)*

## 6. Blog posts (`/blog/*`)

- [ ] Author/credentials/dates shown are accurate (E-E-A-T).
- [ ] Any statistics inside posts (charts included) trace to a real, citable source.

---

## FR localisation QA

- [ ] French reads idiomatically (not machine-stiff) on: home, pricing, contact, one service, one case study.
- [ ] Numbers/currency/units render correctly in FR locale.
- [ ] No EN string leaked into the FR build (and vice-versa) — `npm run i18n:check` + the new `keys:check`.

---

### How to action a change
Tell me the claim + the correction; I'll update the EN + FR i18n strings (or the inline case-study content
in `src/data/caseStudies.ts`), rebuild, and redeploy. The biggest single risk to clear first is the
**pricing comparison (€24,500 "traditional agency")** — substantiate or soften.
