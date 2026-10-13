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
      - **Presentation (27 Sep 2026, owner request):** the French publisher appears as "Algorythmos France"
        (the site's regional brand), trading name Algorythmos, operated by Sameer Raj Kalaliya (EI), at
        "Paris La Défense" (the district's official name). The VAT line was removed from the notice: the
        "TVA non applicable, art. 293 B du CGI" mention is required on invoices, not on the website. The
        legally required elements stay: the name with "EI", the SIREN, the RNE registration, the address,
        phone and email.
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

## 3e. Client engagements (27 Sep 2026)

Four real, delivered engagements, published anonymised with each client's permission (owner confirmed,
27 Sep 2026). Source of every fact and figure: the git-ignored `Clients/case-study-fact-sheets.md`.
Figures are shown "as measured on the engagement" (owner confirmed they are measured).

- [x] `clinical-document-ai`: healthcare, Australia, 5–20 staff · LLMOps · ~70% less document review time · 8 weeks
- [x] `ml-deployment-platform`: professional services, France, 10–50 staff · AI platform engineering · deployments days → minutes · 6 weeks
- [x] `model-monitoring-logistics`: logistics, Australia, 100–200 staff · model monitoring · real-time visibility, faster detection, less downtime · 4 weeks
- [x] `retail-data-foundation`: retail, Australia, 50–150 staff · data & feature management · 80% less reporting time · 10 weeks
- [ ] Keep the evidence behind each figure on file (before/after dashboard, client report).

## 3f. Partner — MBSC Australia (29 Sep 2026)

Named on `/blog/mbsc-australia-partnership` (EN/FR), in its related links, and in the home mining chip's label.

- [x] **MBSC Australia is named as a client and AI technology partner.** Approved by MBSC Australia (confirmed by Sam Kalaliya, 29 Sep 2026). MBSC Australia shows the partnership on its own site (www.mbscaustralia.com.au, home / AI page / About / announcement).
- [x] **Scope:** Algorythmos engineers and operates the AI and ML systems behind MBSC Australia's AI services for mining and energy clients (data platforms, MLOps, document intelligence, agentic automation with human approval). No metrics, outcomes or quotes are claimed.
- [x] **Start date:** September 2026.
- [x] **Independence:** separate companies; MBSC Australia is an Algorythmos client.

## 3g. Visual themes in the 3D scenes (10 Oct 2026)

Decided by Sam Kalaliya. A picture can imply an offering as surely as a sentence, so the scenes follow
the same rule as the copy.

- [x] **Themes follow the page.** Robotics, space, digital-currency and augmented-reality imagery may
      appear only where it matches what that page sells. No page gains a theme it does not offer, and
      no copy is added to explain a scene.
- [x] **No words in a scene.** Scenes are decorative and `aria-hidden`; nothing in them reads as a claim.
- [x] **Digital currency is drawn as an audit log and A$ / € tokens**, never as a blockchain or
      cryptocurrency. Algorythmos sells neither.
- [x] **PDF Algo Pro gets no augmented-reality overlay.** That page says only what the shipped app
      does; its scene shows pages being scanned, signed and reordered, nothing more.
- [x] **Homepage (`neural-core`):** an abstract lattice with orbiting units. It depicts no product and
      makes no measurable claim.
- [x] **Each service page shows its own subject** (11 Oct 2026): robotics on Document Intelligence
      (an arm sorting pages) and MLOps (build, test and deploy gantries); space on AI Platform
      Engineering (a station taking modules) and Model Monitoring (a radar sweep); a holographic
      page on AI-Powered Websites. The container yard appears only on the Port Botany and logistics
      study pages and the Port Botany post. `src/data/sceneMap.test.ts` enforces the placement.

- [x] **Phones and tablets get the same motion as desktops** (decided by Sam Kalaliya, 11 Oct 2026):
      the homepage sphere animates on every device, and the 3D scene starts by itself after the page
      has loaded instead of waiting for a first touch. Reduced motion, the pause button, Save-Data,
      slow connections and weak GPUs keep the still. `SCENE3D_TOUCH_AUTOSTART` in
      `src/data/scenes.ts` reverses the auto-start alone.

## 3h. Case study — AI, Robotics, Space and Bitcoin (`/case-studies/ai-robotics-space-bitcoin-convergence`) — evidence report (11 Oct 2026)

Labelled on-page as an industry evidence report. The note states that Algorythmos has not been engaged by
any organisation named, builds none of the robotics, space or Bitcoin systems described, that the delivery
job is an illustrative scenario, and that nothing on the page is financial or investment advice. It was
written from a strategy paper that cited no sources; every figure below was re-sourced (accessed
11 Oct 2026). Source numbers are the page's own.

| Claim on the page | Source |
|---|---|
| AI could add up to $15.7T to the world economy by 2030 (2017 estimate, 2016 prices) | [1] PwC — Sizing the Prize |
| 78% of organisations used AI in 2024 (55% the year before); notable models: US 40, China 15, Europe 3; US private AI investment $109.1B; GPT-3.5-level inference cost down >280-fold, Nov 2022 – Oct 2024 | [2] Stanford HAI — AI Index 2025 |
| Transformer and attention; retrieval-augmented generation; reason-and-act loops | [3] Vaswani 2017; [4] Lewis 2020; [5] Yao 2022 |
| AlphaFold predicts structure from sequence; RFdiffusion designs protein backbones | [6] Jumper 2021; [7] Watson 2023 |
| New drug: $2,558M capitalised, $1,395M out of pocket (2013 dollars) | [8] DiMasi, Grabowski, Hansen 2016 |
| 7.9% likelihood of approval from Phase I, 2011–2020 | [9] BIO / Informa / QLS |
| First drug with AI-discovered target and AI-designed molecule: 71-patient Phase 2a trial | [10] Nature Medicine 2025 |
| 5 million industrial robots in operation end 2025 (+9%); >600,000 installed in 2025; China 59%; US second ahead of Japan | [11] IFR press release, 24 Sep 2026 |
| 4,663,698 industrial robots in operation in 2024 | [12] IFR World Robotics 2025 executive summary |
| Amazon: >1 million robots, >300 facilities; DeepFleet cuts fleet travel time 10% (Amazon's own statement) | [13] aboutamazon.com |
| Conflict-based search; vision-language-action models; domain randomisation | [14] Sharon 2015; [15] Brohan 2023; [16] Tobin 2017 |
| Li-ion pack price $108/kWh in 2025, record low, −8% on 2024 | [17] BloombergNEF |
| Shuttle $54,500/kg ($61,700 in 2018 dollars); Falcon 9 $62M for 22,800 kg = $2,720/kg; Falcon Heavy $1,400/kg; factor of 20 | [18] Jones, NASA Ames, ICES-2018-81 |
| Booster landing guidance by convex optimisation; successive convexification | [19] Blackmore 2016; [20] Szmuk and Açıkmeşe 2018 |
| Laser inter-satellite links can beat fibre over long distances; routes recomputed as satellites move | [21] Handley 2018 |
| Starlink: 12,988 launched, 11,137 in orbit (table dated 9 Oct 2026) | [22] McDowell |
| Space economy $630B in 2023, projected $1.8T by 2035 | [23] WEF and McKinsey 2024 |
| 2.2 billion people offline in 2025 (6 billion online); 29% offline in 2024 (revised) | [24] ITU Facts and Figures 2025 |
| Proof-of-work, longest chain; block header, Merkle root, retarget every 2,016 blocks, ten-minute interval | [25] Nakamoto 2008; [26] Bitcoin developer guide |
| Reward halves every 210,000 blocks; supply bounded just under 21 million | [27] Bitcoin Wiki — Controlled supply |
| Schnorr signatures; Lightning payment channels; L402 | [28] BIP 340; [29] Poon and Dryja 2016; [30] Lightning Labs |
| SEC approved spot bitcoin ETP listings on 10 Jan 2024, stating it was not an endorsement | [31] SEC statement |
| Mining: 138 TWh/yr; 52.4% sustainable (42.6% renewables, 9.8% nuclear); gas 38.2%; coal 8.9%; survey covers 48% of activity | [32] Cambridge CCAF 2025 |
| ERCOT large flexible loads (≥75 MW), mostly crypto mining, have voluntary curtailment agreements | [33] US EIA, 3 Oct 2024 |

**Left out because no source supports them** (shown as such in the page's "Claims checked" table):
generative AI cutting four to five years of discovery to four to six months; a $20,000 humanoid; a 300%
pick-rate gain and 40% unit-cost cut; launch below $200/kg; companies holding bitcoin outperforming peers.
The "10–20% workflow efficiency" figure and the capital-allocation recommendation in the source paper
were dropped without mention.

**Not verified to a primary table:** the IFR operational-stock series for 2021–2023, so no robot chart is
published. The Cambridge report gives no figure for the remainder of the energy mix, so that chart is a
bar chart of the four reported sources, not a whole.

- [x] **Scope:** the "approach" section and FAQ say Algorythmos builds the agent, data and MLOps layer
      only. Nothing implies it builds robots, satellites or Bitcoin infrastructure.
- [x] **No investment view.** Bitcoin is described as settlement technology. No price, return or
      allocation statement appears, and the note and the last FAQ say so.
- [x] **Illustrative scenario:** the delivery job carries no figures and is labelled as illustrative in
      the note, the solution paragraph and the last explainer's caption.
- [x] **Explainers are not scenes.** The five step-through diagrams (`src/components/explainers/`) are
      teaching figures inside this report, each captioned as a schematic. They appear on no other page.
      One of them draws a block being mined. §3g's rule that digital currency is never drawn as a
      blockchain applies to the decorative 3D scenes and to pages selling a service; **Sam to confirm
      this exception for the report.** The hero scene is the agentic-automation service's own
      (`agent-swarm`), chosen by the usual rule.
- [x] **Companion post** `/blog/ai-control-plane-robots-satellites-payments` reuses only figures from
      this section (78% adoption, 5 million robots, L402). The design guidance is Algorythmos's own
      delivery approach, not client results.
- [x] `src/data/citations.test.ts` fails the build if a marker points at a missing source, if EN and FR
      cite differently, or if a listed source is never cited.
- [ ] Owner to re-verify annually: IFR (each September), ITU (each November), BloombergNEF (each
      December), AI Index (each April), and the Starlink count whenever the page is revised.

## 3i. Case study — From Vibrations to Photons (`/case-studies/signals-fibre-satellites-orbital-compute`) — evidence report (13 Oct 2026)

Labelled on-page as an industry evidence report. The note states that Algorythmos has not been engaged by
any organisation named, builds none of the cables, satellites or chips described, that company
announcements are cited as what the company reports, and that the fibre-free route is a thought
experiment. It was written from a research paper whose references were re-opened one by one (accessed
13 Oct 2026); the paper's 22 references reduce to the 17 below once duplicates are merged. Source numbers
are the page's own.

| Claim on the page | Source |
|---|---|
| Glass fibres in use since the 1930s; in the 1960s Kao showed very pure glass carries enough light; half of the 2009 Nobel Prize in Physics | [1] Nobel Prize — Kao, facts |
| Electromagnetic radiation acts as a wave in some circumstances and as a beam of photons in others | [2] OpenStax, University Physics vol. 3, 6.6 |
| Radio to gamma rays are all electromagnetic radiation, set apart by wavelength | [3] NASA Science |
| Radio below about 3 × 10⁹ Hz, gamma rays above about 3 × 10¹⁹ Hz; frequency and energy rise together | [4] NASA Goddard spectrum chart |
| Sound in air is a longitudinal pressure wave; molecules oscillate about equilibrium positions | [5] OpenStax, University Physics vol. 1, 17.1 |
| Loudspeaker: voice coil in a magnet's field, fixed to a diaphragm | [6] Engineering LibreTexts (Fiore) |
| The ITU publishes design guidelines for optical fibre submarine cable systems | [7] ITU-T G Suppl. 41 (07/2024) |
| Starlink: Ku-band phased-array and dual-band antennas for customers; 3 lasers per satellite at up to 200 Gbps; about 550 km orbit; around 25 ms against 600+ ms geostationary (35,786 km); mini laser 25 Gbps | [8] Starlink — Technology (company figures) |
| Magnetron produces microwaves; water molecules vibrate, producing heat; food does not become radioactive | [9] US FDA |
| DSOC: UHD video from 19 million miles at 267 Mbps (Dec 2023); data from 288 million miles (Jul 2024); 65th and final pass Sept 2025; status completed | [10] NASA DSOC mission page |
| Laser data does not travel faster than radio; higher data rates, narrower beam, smaller terminal; a fraction of a degree misses; clouds and mist interrupt; several ground stations | [11] NASA Optical Communications Overview |
| First working laser, Theodore Maiman, 16 May 1960 | [12] APS News |
| Submarine cables carry over 99 per cent of international data flows | [13] ITU Global Connectivity Report 2025, ch. 3 |
| Cable weaknesses: physical risks, repair times, geographic concentration, reliance on few systems; small island states and LDCs most exposed; permitting | [14] ITU press release, 10 Jul 2026 |
| Project Suncatcher announced 4 Nov 2025: solar-powered satellites carrying TPU chips | [15] Google |
| Up to eight times more solar power; heat leaves only through radiators; proton-beam radiation tests; cluster laser links to be tested in 2027; two satellites planned for 2027; each satellite must know its position relative to neighbours | [16] Google, 24 Sep 2026 |
| Prototype built with Planet launched 1 Oct 2026 on a SpaceX rideshare; contact confirmed; will measure TPU response to radiation and temperature | [17] Google, 1 Oct 2026 |

**Left out because no source page supports them:** the 2.45 GHz microwave-oven frequency (the FDA page
gives none); Corning's 1970 low-loss fibre and the 1988 TAT-8 cable; the year 1966 and George Hockham
(the Nobel facts page says "in the 1960s"); the relations c = fλ and E = hf (not stated in the cited
OpenStax section); Starlink's satellite count (the page's figure disagrees with §3h's source). The source
paper's date for the first Google post was wrong and is corrected to 4 Nov 2025.

**Not verified to a primary table:** the difference between an optical amplifier and a regenerator is
standard engineering, but the ITU-T page cited at [7] shows only the document's title and date, so [7] is
cited for the existence of the guidelines and nothing more. The chart shows 99 / 1 as a floor, and its
caption says so. No link-rate chart is published: a deep-space demonstration and a vendor maximum do not
belong on one axis.

- [x] **Scope:** the "approach" section says Algorythmos builds the software and data layer only.
      Nothing implies it builds cables, satellites, ground stations or chips.
- [x] **Company figures stay attributed.** Every Starlink and Google figure is worded as what the
      company publishes or reports, and carries a "company-reported" verdict in the claims table.
- [x] **Thought experiment:** the Sydney-to-California route is labelled as a thought experiment in the
      note, the section title, its body and the claims table.
- [x] **No client claim in this sector** (Sam Kalaliya, 13 Oct 2026: there is no paid work in telecom,
      fibre or satellite yet). The approach section is written as "how an engagement would run". The page
      does not say or imply that Algorythmos has clients in this sector, names no operator as a customer
      and gives no measured result for the sector. A representative engagement, labelled as such, may be
      added; a real one replaces it when it exists.
- [x] **Explainers.** Six step-through diagrams drawn for this report (`speech-loop`, `em-spectrum`,
      `fibre-span`, `sat-links`, `orbital-node`, `fibre-free-route`), each captioned as a schematic. None
      is reused from §3h. The orbital one is captioned as a single prototype and the route as a thought
      experiment. The statement that fibre and satellite lasers use infrared light is general knowledge
      and carries no figure.
- [x] **Companion post** `/blog/where-ai-runs-fibre-satellite-orbit` reuses only figures from this
      section (over 99% on submarine cables, 25 ms against 600 ms as Starlink states it, the 1 Oct 2026
      prototype, tests planned for 2027). The design guidance is Algorythmos's own delivery approach, not
      client results.
- [x] **Representative engagement** `/case-studies/satellite-link-monitoring` (13 Oct 2026). Its note
      says in terms that it is not a delivered project, that Algorythmos has no client in this sector yet
      and that no figure on the page is a measured client result. It carries no stat band and no
      percentages; its "results" are deliverables. It is replaced by a `kind: 'client'` study when a real
      engagement exists. **Sam to confirm the wording of the note.**
- [x] **Announcement bar** points at this report from 13 Oct 2026 (`src/data/announcement.ts`).
- [x] **Hero scene** is the ai-platform-engineering service's own (`platform-station`), chosen by the
      usual rule. No explicit scene entry.
- [ ] **Sam to confirm** the wording of the call to action ("Running a network, a constellation or a
      ground segment?") as an invitation and not a statement of current work.
- [ ] Re-verify all 17 sources by 13 Oct 2027, and sooner if Google reports results from the prototype.

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
