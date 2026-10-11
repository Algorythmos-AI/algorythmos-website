# 3D scenes — authoring guide

Live 3D scenes are decoration: lit, shaded three.js scenes in a page's hero. The
homepage has `neural-core`; every other page except the legal and support ones has
the scene `src/data/sceneMap.ts` picks for it. They carry no words and make no
claims, and **the page never depends on one** — everything below exists to keep
that true.

## Files

| Piece | Where |
|---|---|
| Catalogue: scene ids, site-wide switch, which variants have their own still | `src/data/scenes.ts` |
| Which page shows which scene (build time only) | `src/data/sceneMap.ts` (+ `sceneMap.test.ts`) |
| Mount (markup, stills, stacking CSS) | `src/components/ui/Scene3D.astro` |
| A hero's scene box: a band under the copy on small screens, a column beside it from `lg` | `src/components/sections/HeroScene.astro` |
| First-load loader: who gets 3D, and when | `src/lib/scene3d/bootstrap.ts` |
| The decision table (pure, unit-tested) | `src/lib/scene3d/tier.ts` (+ `tier.test.ts`) |
| The frame-rate governor (pure, unit-tested, loaded with the engine) | `src/lib/scene3d/governor.ts` (+ `tier.test.ts`) |
| Engine: renderer, loop, fallbacks (imports three) | `src/lib/scene3d/engine.ts` |
| Scene contract | `src/lib/scene3d/types.ts` |
| Registry of scenes, one lazy chunk each | `src/lib/scene3d/registry.ts` |
| Shared parts: palette, environment light, lens and tone curve, soft points, drifting motes, rim-lit shells, orbits, satellites, paper sheets, holograms, camera framing, the globe's land mask, dispose | `src/lib/scene3d/kit/` |
| One file per scene | `src/lib/scene3d/scenes/<id>.ts` |
| Stills and their fingerprints | `src/assets/scenes/` (`manifest.json`) |
| Still capture | `scripts/capture-scene-posters.mjs` (`npm run scenes:posters`) |

## Who sees what

Decided by `pickPlan()` in `tier.ts`; the result is written to `data-scene-plan` on the mount.

| Visitor | Gets |
|---|---|
| Desktop or laptop | The live scene, fetched at idle after the page has loaded |
| Phone or tablet (narrow viewport, or touch with no hover) | The still, painted after the page has loaded; then the live scene at the `low` tier, started the same way as on a desktop, with no touch needed |
| Phone or tablet on a connection the browser reports as 3g or slower | The still; the live scene after the first touch |
| Reduced motion, pause toggle, `prefers-contrast: more`, Save-Data, under 4 GB memory | The still. three.js is never requested |
| No usable WebGL2, software rendering, Windows high-contrast mode | The still. three.js is never requested |
| No JavaScript | The still (`<noscript>` image) |

"The still" is whatever the page shows without the scene. On the homepage that is the
2D `NeuralOrb`, which the scene is stacked over and cross-fades from. Everywhere else
it is a captured image of the scene, painted into a canvas by the loader — a canvas
because an `<img>` or a CSS background could be picked as the page's LCP element. A
desktop about to get the live scene does not fetch it.

The 2D orb animates on every device, phones and tablets included. It is one still
frame only for reduced motion, Save-Data, under 4 GB of memory, or a device its own
frame check finds below 20 fps.

### When the start goes wrong

Every one of these ends on the still (or the moving 2D orb), and each is tried once:

| What happens | What the loader does |
|---|---|
| The strict WebGL2 request is refused | Asks once more without `failIfMajorPerformanceCaveat`; the software-renderer check and the governor still apply |
| The engine chunk does not arrive | One more try after 2 s. WebKit remembers a failed module for the life of the document, so there the visitor keeps the still until the next full page load |
| The start takes more than 12 s | Abandoned for this page (`data-scene-fail="timeout"`); no mount stays on `loading` |
| The frame rate falls under 25 fps | Fewer pixels first; at the floor the `low` tier is given a second window before the scene is dropped for the session |
| The GL context is lost | One fresh attempt once the page is visible again; a second loss in the visit ends it |

## Finding out why a visitor has the still

Add `?scene-debug` to any page that has a scene (for example `/au-en?scene-debug`). A
readout appears along the bottom of the page: the plan, how far the start got, the
failure if there was one, whether WebGL2 is available, whether motion is off because of
the OS setting or the pause button, and the frame rate of the scene and of the homepage
orb. It is for phones, which have no developer tools: a screenshot of it answers "why is
it not moving?".

The same facts are on the mount for tests and for a desktop inspector:

| Attribute | Values |
|---|---|
| `data-scene-step` | `armed`, `probing`, `loading`, `building`, `compiling`, `live` |
| `data-scene-fail` | `no-webgl`, `software-gl`, `engine-load`, `timeout`, `slow`, `context-lost`, `error`, `motion-off` |
| `data-scene-error` | The error text, when there was one |
| `data-orb-static` (on the orb) | `motion-off`, `save-data`, `low-memory`, `slow` |

The readout (`debug.ts`) is fetched only when the flag is present. It reads state and
changes nothing.

## Where a scene sits

`HeroScene` sizes the scene's box in CSS alone, so a hero is the same height before
and after its scene arrives. Below `lg` the scene is a band under the copy; from `lg`
it is a column beside it. **Nothing is drawn behind text**, with one exception: the
404 page, from `lg`, puts its scene behind centred copy, and that scene keeps its
subject to one side. `e2e/scene-contrast.spec.ts` measures the pixels behind every
line of hero copy, in both themes at three widths, against WCAG AA.

## Which page gets which scene

`sceneFor(page, slug, locale)` in `src/data/sceneMap.ts`. The rule
(`docs/COPY_CLAIMS_SIGNOFF.md` §3g): a theme appears only where it matches what the
page sells. `sceneMap.test.ts` pins the ones that matter — the ledger only on pricing
and compliance pages, the scanning overlay and the sorting arm only on document-led
pages, the port yard only on the port and freight pages, PDF Algo Pro showing only
what the app does.

| Page | Scene |
|---|---|
| Home | `neural-core` |
| Services index | `constellation` |
| Agentic Automation | `agent-swarm` |
| Document Intelligence | `robot-sorter` |
| Generative AI & LLMOps | `llm-lattice` |
| MLOps & Model Deployment | `model-pipeline` |
| AI Platform Engineering | `platform-station` |
| Model Monitoring | `monitor-radar` |
| Data & Feature Management | `feature-vault` |
| SQL Dashboards | `dash-terrain` |
| AI-Powered Websites | `holo-site` |
| Pricing | `ledger` (`aud` / `eur`) |
| About, Contact, Careers, Press, the city pages, the case-study and blog indexes | `globe` |
| PDF Algo Pro | `pages` |
| 404 | `lost-satellite` |
| A case study or post | The scene of the first service in its entry in `src/data/related.ts`; `scan` when that service is Document Intelligence. Explicit exceptions (`ledger@audit`, `port-yard`, `globe@sydney`) are listed at the top of `sceneMap.ts` |

A service added to `src/data/services.ts` before it has a scene of its own falls back
to the constellation, turned to that service's satellite.

A variant (`data-scene-variant`) turns a scene or highlights part of it. Only variants
listed in `STILL_VARIANTS` have a still of their own; the rest share the scene's.

## The rules a scene must not break

1. **First load never reaches three.** `bootstrap.ts`, `tier.ts` and `src/data/scenes.ts`
   are on the page from the start; they may import types from the engine, never values.
   The engine is fetched only by `import('./engine')`. `npm run perf` fails the build if
   any page reaches the `scene3d-engine` chunk through its HTML or a static import, and
   `src/data/scenes.test.ts` catches the same mistake before a build.
2. **Every failure ends on the still.** A scene that throws, a shader that fails to
   compile, a lost GL context, a chunk that does not arrive, or a GPU that cannot hold
   25 fps all end with the canvas removed and `data-scene-state="static"`. Do not catch
   errors inside a scene to keep it limping.
3. **Free what you create.** `dispose()` must release every geometry, material and texture
   (`disposeTree(root)` does it for anything added under one group). The environment map
   is shared — never dispose it. The endurance test navigates ten times and fails if GPU
   object counts grow.
4. **Colours come from the theme.** Read them from the `Palette` the engine passes in
   (`palette.brand`, `.accent`, …) and re-apply them in `setTheme()`. The only literal a
   scene may carry is neutral white for a light. On the light theme additive glow is
   invisible: switch blending and lower emissive there, as `neural-core` does.
   Reflection strength is `scene.environmentIntensity`; a material's own
   `envMapIntensity` is ignored while the scene supplies the environment.
5. **Deterministic layout.** Use `ctx.rng`, never `Math.random`, so every visit and the
   still match. Anything driven by `time` must be a pure function of it.
6. **No words.** A label in a scene is copy and would have to go through `t()`. Scenes
   are `aria-hidden`; keep them that way.
7. **No strobing.** Nothing flashes faster than three times a second (WCAG 2.3.1).
8. **Nothing the CSP forbids.** No `eval`, WASM decoders, blob workers or external
   fetches. `e2e/csp.spec.ts` runs a scene under the production policy.

## Adding a scene

1. Add the id to `SCENE_IDS` in `src/data/scenes.ts` and a line to `registry.ts`
   (`satisfies` fails the build if they drift).
2. Write `src/lib/scene3d/scenes/<id>.ts` exporting `stillAt` (seconds) and
   `create(ctx): SceneInstance` — see `types.ts`, and `neural-core.ts` for a worked example
   with per-tier budgets, a theme pass and a scroll response.
3. Mount it: `<Scene3D id="<id>" class="absolute inset-0" />` inside a positioned box
   with a fixed aspect ratio, so the scene arriving cannot shift layout. The mount has
   no size of its own; one with no size never starts.
4. Map it to its pages in `src/data/sceneMap.ts`, add a page that hosts it to `HOSTS` in
   `scripts/capture-scene-posters.mjs`, then `npm run build && npm run scenes:posters <id>`
   and commit the stills with the manifest.
5. Run the gate. Look at the scene in both themes and at 390 / 768 / 1440 px.

Editing a scene, anything in `kit/` (which holds the lens and tone curve, `kit/look.ts`)
or the theme tokens changes its fingerprint; the unit tests fail until the stills are
re-captured. Engine and loader changes do not.

## Budgets

- The three.js chunk is capped at 620 kB raw (`scripts/lib/perf-gate.mjs`). It measures
  about 553 kB (136 kB gzip): the renderer alone is 510 kB and does not tree-shake, so
  new imports from three cost little. Post-processing passes and loaders are the things
  that would move it.
- Homepage first-load JavaScript is capped at 46 kB. The bootstrap is about 4.5 kB of that.
- A scene's own chunk should stay under 15 kB. Stills: 960 px under 150 kB, 480 px under 60 kB.

## Switching it all off

Set `SCENE3D_ENABLED = false` in `src/data/scenes.ts`. Every mount renders as its still
and no page requests the engine.

To undo only the phone and tablet auto-start, set `SCENE3D_TOUCH_AUTOSTART = false` in
the same file: they go back to waiting for a first touch before the engine is fetched.

## Tests

| What | Where |
|---|---|
| Decision table, governor | `src/lib/scene3d/tier.test.ts` |
| Catalogue, registry, stills, first-load imports | `src/data/scenes.test.ts` |
| Page → scene map and its rules | `src/data/sceneMap.test.ts` |
| Contrast of hero copy against its scene | `e2e/scene-contrast.spec.ts` |
| Bundle gate rules | `src/lib/perfGate.test.ts` |
| Stills, phones, live scene, pause, theme, resize, failures | `e2e/scene3d.spec.ts` (Chromium, WebKit, Firefox) |
| Every scene live in both locales, long run, GPU governor, load races, navigation leaks | `e2e/scene3d-soak.spec.ts` (Chromium) |
| Production CSP | `e2e/csp.spec.ts` |
| Phones and tablets: start with no touch, pause, hidden tab, rotation, every failure path | `e2e/scene3d-mobile.spec.ts` (Pixel 7, iPhone 15) |
| Phones and tablets: the orb, console, belt, reveals, count-ups and explainers actually move | `e2e/motion-mobile.spec.ts` (Pixel 7, iPhone 15, Galaxy Tab S4, iPad both ways) |
| The `?scene-debug` readout | `src/lib/scene3d/debug.test.ts`, `e2e/scene-debug.spec.ts` |

Headless browsers render WebGL in software, which the site refuses for visitors. Tests
that need a live scene call `forceScene(page)` (`e2e/helpers/scene3d.ts`).
