# Copy & Claims Sign-off (EN + FR)

**Owner:** skalaliya · **Purpose:** verify every *factual / quantitative / comparative* claim on the live
site is truthful and defensible **before** heavy marketing/ads. This register lists each claim, its
source, and its sign-off status so the site never publishes a figure nobody can stand behind.

Mark each: `[x]` approved as-is · `[~]` reword (note the fix) · `[ ]` not yet reviewed.
Anything you change in EN must be mirrored in FR (`i18n:check` enforces key parity, not meaning — that's on us).

---

## 1. Pricing page (`/au-en/pricing`, `/fr-fr/pricing`) — **highest scrutiny**

Live figures (26 Sep 2026). AUD on `/au-en` (from `en.au.json`), EUR on `/fr-fr` (from `fr.fr.json`):

| Item | `/au-en` | `/fr-fr` |
|---|---|---|
| Pilot tier | A$3,300/mo | 2 000 €/mois |
| Operations tier | A$7,500/mo | 4 500 €/mois |
| Add-ons (SAML SSO / private VPC / named technical lead) | A$800 / A$1,600 / A$2,500 per month | 500 € / 1 000 € / 1 500 € par mois |
| "DIY" comparison | ≈ A$40,000/mo — 3 FTE in Sydney at typical market salaries, incl. on-costs and tools | ≈ 24 500 €/mois — 3 ETP à Paris aux salaires de marché habituels, charges et outils inclus |
| "Traditional agency" comparison | ≈ A$30,000/mo — 1–1.5 FTE senior consultants at typical day rates of A$1,000–A$1,500 | ≈ 18 000 €/mois — 1 à 1,5 ETP de consultants seniors à 600–900 €/jour |

Wording decisions (Sam Kalaliya, 26 Sep 2026) — defensible claims, prices unchanged:
- [x] "SOC2-ready processes" → **"Security aligned to SOC 2 principles"** (no SOC 2 report exists).
- [x] "SLA 99.5%" → **"Availability target agreed per engagement"**; badge "Agreed service levels".
- [x] "Dedicated TAM" → **"Named technical lead"** (tier feature and add-on).
- [x] "Talk to sales" → **"Talk to us"** (there is no sales team).
- [x] Each comparison now states its basis (market salaries / typical day rates) and stays labelled *illustrative*.
- [x] No "live ROI calculator" promise (none is rendered): hero, meta description and footnote offer a 30-minute ROI review instead.
- [ ] Sam to confirm the comparison bases are still representative each year.
- [x] Currency: AUD on the Australian site, EUR on the French site.

The build enforces these: `npm run i18n:check` fails on SOC 2 "ready", TAM, live-calculator, SLA/uptime-guarantee and "talk to sales" wording.

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
- [x] **Legal notice (`/legal-notice`, EN and FR):**
      - Publisher of the French pages: Sameer Raj Kalaliya, entrepreneur individuel (EI), trading
        as Algorythmos. SIREN 991 562 497, registered in the RNE on 18 Sep 2025.
      - Address shown: "La Défense, France". Phone: +33 7 49 73 74 84.
      - Owner decision, 26 Sep 2026.
- [x] **Owner decisions, 26 Sep 2026:**
      - "La Défense, France" is precise enough for the publisher address.
      - Vercel's address plus website is enough for the host entry; Vercel publishes no phone.
      - The French Privacy Policy and Terms name the EI (data controller and contracting
        party). The Australian ones keep ALGORYTHMOS PTY LTD.
      - The French Terms are governed by French law and the French courts, with French
        consumers' mandatory rights (Code de la consommation) preserved. The Australian Terms
        stay under NSW law with the ACL carve-out.
      - No VAT is charged (*franchise en base*), so the notice shows "TVA non applicable,
        art. 293 B du CGI".
      - The footer's legal line follows the same split. French pages show "Sameer Raj
        Kalaliya EI · Algorythmos · SIREN · La Défense, France"; all other pages show the
        company, its ABN and the Surry Hills office.
- [ ] If the EI sells to consumers, the Code de la consommation (L612-1) requires naming a free
      consumer mediator. None is named yet, so the Terms make no mediator claim.

## 3d. Port Botany FAQ block and the freight-forwarder post (26 Sep 2026)

- FAQ answers on `/case-studies/port-botany-ai-ml` restate facts already sourced in §3a (NSW Ports
  lease and terminal operators; mandatory standards since 2010, updated 2021; OCR at gates and the
  MEDLOG park; Patrick automation; published ML studies). No new figures.
- Blog post `/blog/port-botany-document-flows` reuses only §3a figures (2.8M TEU, 80% within 40 km,
  ~$49M/yr empty-container cost). Process descriptions (what is extracted, which control stays human)
  are Algorythmos's own delivery approach, not client results.
- [x] Reviewed for consistency with the sources on 26 Sep 2026.

## 4. Homepage, voice and positioning (`/`, footer, meta, contact, careers)

Decisions (Sam Kalaliya, 26 Sep 2026):
- [x] **Honest boutique voice.** "We" and senior-led wording; no staffed-team, office-staffing, follow-the-sun or 24h claims (trust line, services, blueprint, journey, contact map, blog, press boilerplate).
- [x] **Careers → "Work with us"** for independent specialists: engagement facts replace the employer perks (equity, off-sites, health insurance, time zones).
- [x] **Compliance wording is alignment, not compliance**: "aligned with GDPR / the EU AI Act / the Australian Privacy Principles" in EN and FR; no "GDPR-compliant", "guaranteed data residency" or "never leaves your infrastructure".
- [x] **Case studies:** index and meta describe evidence reports and representative engagements, with a visible illustrative-figures note; representative studies say "The approach:" rather than "We delivered".
- [x] **Paris presence and Head Office labels unchanged** (Algorythmos is registered in both countries); no French identifiers until the French registration is recorded.
- [x] Locations = Sydney (registered office published) + Paris (city-level); no phone published (none exists).
- [x] "Senior engineering, no hand-offs — you work directly with the people building your system." (reworded 25 Sep 2026)
- [ ] **"Outcome-based delivery — scoped to measurable business outcomes."** Reflects how engagements are actually contracted?
- [x] **"Bilingual (EN/FR)"** — French copy reviewed for sentence case and franglais (26 Sep 2026).
- [x] Footer copyright year interpolates the current year.

The build enforces the voice and compliance wording: `npm run i18n:check` fails on staffed-team phrases, follow-the-sun/24h, employee perks, GDPR "compliant" and delivered-client framing (blog posts and case-study FAQs are out of scope).

## 5. Services pages (`/services/*`)

- [ ] Each service's described capabilities, deliverables, and any named tools/frameworks are accurate and
      something you actually offer. *(5 services — skim each for over-promises.)*
- [x] **Named tools (owner decision, 26 Sep 2026):** every technology on the services pages — Vertex AI, MLflow,
      Kubeflow, Google Cloud, Microsoft Azure, AWS, GitHub Actions, GitLab CI/CD, Jenkins, Docker, Kubernetes,
      OpenShift, Terraform, CloudFormation, Ansible, Python, SQL, BigQuery, Snowflake, Spark, Airflow, OpenAI,
      LangChain, LangGraph, CrewAI, Vertex AI Agents (plus the existing belt) — is hands-on delivery experience.
      Presented as "technologies we work with": no partner, certification or endorsement claim.
- [ ] **Service page depth (Sep 2026):** each page now has a "How it works" section (4 steps), a
      "Technologies we work with" grid and an "In practice" card. The card features an explicitly chosen
      case study and always shows its evidence label ("Representative engagement…"); `ai-websites` has none.
- [ ] **Four new services (Sep 2026):** Generative AI & LLMOps, AI Platform Engineering, Model Monitoring &
      Observability, Data & Feature Management — capabilities, steps and FAQs from the owner's scope. No figures in
      the copy; console numbers are illustrative product interfaces. Until the client case studies land (PR 5),
      their "In practice" card features the representative healthcare-mlops study with its label.
- [ ] **Services index:** three families, the ML lifecycle band, "How we work with your team" (the engagement
      model: discover, design, build, operate, with leadership updates and vendor coordination) and the full stack.
- [ ] **MLOps refocus:** "MLOps & CI/CD" becomes "MLOps & Model Deployment" (same URL). Its FAQ timeline
      ("2-3 weeks / 1-2 months") was replaced by "scoped in a discovery call"; no unsigned numbers.

## 6. Blog posts (`/blog/*`)

- [ ] Author/credentials/dates shown are accurate (E-E-A-T).
- [ ] Any statistics inside posts (charts included) trace to a real, citable source.
- [ ] **Four service guides (27 Sep 2026):** `llmops-in-production`, `ai-platform-kubernetes`,
      `model-monitoring-drift`, `feature-stores-lineage` (EN + FR). Practice guidance only: no statistics, no
      client claims, no charts. PSI is named as "a common measure", with no thresholds asserted as fact.

---

## FR localisation QA

- [x] French reads idiomatically: 278 Title Case strings rewritten to sentence case and franglais replaced (26 Sep 2026); `i18n:check` now flags any regression as an advisory warning.
- [x] Currency stated on FR pages for Australian figures (M$ AU, Md$ AU); blog dates use French abbreviations.
- [x] No EN string leaked into the FR build — `npm run i18n:check` (parity, placeholders, duplicates) and `keys:check` (every namespace, text and attributes).

---

### How to action a change
Change the EN and FR strings together in `src/i18n/ui/*.json` (or the case-study content keys), then run the
full gate. If a claim the build rejects is genuinely true and evidenced, allowlist that single key under
`claimOk` in `scripts/i18n-allowlist.json` and record the evidence in this register.
