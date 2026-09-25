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

## 3a. Case study — AI and ML at Port Botany (`/case-studies/port-botany-ai-ml`) — evidence report

Labelled on-page as an industry evidence report with a note that Algorythmos has not been engaged by
NSW Ports, Transport for NSW or the terminal operators. Every figure is sourced (accessed 25 Sep 2026):

| Claim | Source |
|---|---|
| 2.8M TEU/yr; >7M TEU capacity; 99.6% of NSW containers; 3 terminals; 12 berths; 80% of imports ≤40 km; $10.7B GSP; 52,000 jobs | NSW Ports — Port Botany page |
| 3M TEU/yr rail goal (~40% of forecast); 1M TEU by rail removes ~900 truck movements/day; on-dock rail at all three terminals; Patrick stage completed early 2024 (1M TEU) | NSW Ports — Growth in Rail |
| >400,000 TEU/yr by rail, up 64% since 2014 | Shipping Australia, 21 Oct 2022 |
| Patrick AutoRail: 600,000 TEU pa on rail; 250k → >1M TEU; NOC 24-hour vessel planning | patrick.com.au |
| ~$49M/yr avoidable cost in the empty-container chain; redirections, notice periods, EDI inconsistency | Transport for NSW — NSW Empty Container Study |
| Mandatory standards since 2010, updated Sept 2021; one-hour truck time zones | Transport for NSW — Mandatory Performance Standards |
| Independent review final report Jan 2024; 37 recommendations (16 Act adopted; PBLIS rec. 18 not supported); Act changes from 30 Sep 2024 | Transport for NSW — PAMA Act and PBLIS page |
| MEDLOG empty container park: 6,000 TEU, OCR gantry, opening 2023 | NSW Ports, 1 Sep 2022 |
| Gate OCR/LPR cuts truck turnaround 30–50% (vendor/industry-reported) | AllRead (vendor); DCT Gdańsk case study (Sustainability 2021) for the approach |
| ML berth dwell-time prediction R² = 0.84; JIT arrival ≈14% fuel saving/voyage | Park et al., J. Mar. Sci. Eng. 2026, 14(1):43 |
| Automation expected to cut opex 25–50% / lift productivity up to 30%, expectations often unmet | Rodrigue, Port Economics, Management and Policy — Terminal Automation |

- [x] Framing reviewed: benefit figures are attributed to published deployments/literature, never to Algorythmos.
- [ ] Owner to re-verify figures annually (port statistics change each financial year).

## 3b. Representative case studies (financial-compliance, manufacturing-docs, healthcare-mlops, retail-sql)

Each page now carries the note "Representative engagement — figures are illustrative of the outcomes this
approach is designed to deliver, not audited client results" (EN/FR). The homepage counters (99% / 60% / 50% /
15%) restate those figures under the heading "Outcomes we design for". Decision recorded 25 Sep 2026.

- [x] Label approved by owner (25 Sep 2026).

## 3c. Company identity

- [x] Legal entity ALGORYTHMOS PTY LTD., ABN 22 701 006 626, ACN 701 006 626 — public register data (ASIC / ABN Lookup).
- [x] Registered office published in the Level 1 form (Level 1, 457–459 Elizabeth Street, Surry Hills NSW 2010),
      "by appointment" — approved 25 Sep 2026. Paris wording left unchanged by owner decision.
- [x] Founding year on site = 2026 (registration 3 Aug 2026).

## 4. Homepage + global positioning (`/`, footer, meta)

- [ ] **"AI consultancy for SMEs in Sydney & Paris"** — accurate descriptor?
- [x] **"Senior engineering, no hand-offs — you work directly with the people building your system."** (reworded 25 Sep 2026)
- [ ] **"Compliance-first / GDPR-aligned"** — do you want to assert GDPR *alignment*? (We avoided
      "compliant/certified" — confirm "aligned" is the right strength.)
- [ ] **"Outcome-based delivery — scoped to measurable business outcomes."** Reflects how you actually contract?
- [ ] **"Bilingual (EN/FR)"** — confirmed.
- [x] **Locations = Sydney (registered office published) + Paris (city-level)**; no phone published (none exists).
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
