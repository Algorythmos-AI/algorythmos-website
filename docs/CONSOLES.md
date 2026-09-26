# Living consoles — authoring guide

Every service page opens on a "living console": an animated, DOM-built product
interface (1120×760 canvas) with a hand-written static SVG as its no-JS, image
sitemap and `ImageObject` twin. The homepage hero uses the same system.

## Files

| Piece | Where |
|---|---|
| Shell (frame, scaling, no-JS fallback) | `src/components/ui/ConsoleShell.astro` |
| Loop harness (keyframes, count-ups, visibility, motion) | `src/lib/consoleLoop.ts` (+ `consoleLoop.test.ts`) |
| Shared screen palette and `hc-*` pieces | `src/styles/console.css` |
| One console per service | `src/components/ui/consoles/<Name>Console.astro` |
| Registry of consoles | `src/components/ui/consoles/index.ts` (`satisfies Record<ConsoleName, …>`) |
| Static twin | `public/assets/visuals/service-<slug>.svg`, listed in `serviceVisuals` (`src/data/visuals.ts`) |

## Adding a console for a new service

1. **Registry.** Add the name to `ConsoleName` and the service entry (`console`, `ns`, `family`,
   `blueprint`) in `src/data/services.ts`; import it in `consoles/index.ts`.
2. **Naming.** Pick an unused two-letter class prefix (`ml`, `sq`, …). Render
   `<ConsoleShell … name="svc-<slug>">` and wrap the screen in `<div class="hc <prefix>">`.
   Strings live under `console.svc.<id>.*` in `en.global.json` **and** `fr.fr.json`; identical
   identifiers (tool names, versions) go in `identicalOk`, URL-bar chrome in `sourceOk`.
3. **Copy.** Every visible string goes through `t()`. Strings the client script swaps in are
   passed once as `<script type="application/json" data-hc-strings set:html={JSON.stringify(strings)} />`.
   `npm run i18n:check` scans console markup for literals (it understands self-closing tags).
4. **Layout.** Author at native pixels (`.<prefix> { width: 1120px; height: 760px }`, 40px side
   gutter). Under `@media (max-width: 767px)` set `width: 100%; height: auto`, 16px padding, and
   collapse grids to one or two columns — consoles reflow on phones, they are never hidden.
   `e2e/console.spec.ts` checks the screen fits a 390px phone with no horizontal scroll.
5. **Motion.** The default CSS state is the finished picture, so reduced-motion and no-JS
   visitors see a complete interface. Draw-on and entrance effects live only inside
   `@media (prefers-reduced-motion: no-preference)` and key off `:global(.hc-armed)` /
   `:global(.hc-armed.hc-live)`. Reuse `hc-draw` (with `pathLength="1"`), `hc-fill`,
   `hc-enter`, `hc-flash`.
6. **Script.** Import `initConsole` and `scheduleIdle` from `@/lib/consoleLoop`, find
   `[data-console="svc-<slug>"]`, and call `initConsole(root, { loopMs, keyframes })`. Arm with
   `astro:page-load` plus the `readyState` path (copy an existing console).
   - Anything a keyframe changes must sit inside a `[data-hc-stage]` element (restored from a
     snapshot every loop) or be undone by a later keyframe. Don't nest stages.
   - Re-query elements inside each `apply` — the snapshot restore replaces the nodes.
   - The harness pauses off-screen, in hidden tabs, and as soon as motion is turned off.
7. **Accessibility.** The screen is `aria-hidden`; the shell's `role="img"` carries the alt text
   from `serviceVisuals[slug].altKey`. Never put focusable elements inside a console.
8. **Static twin.** Hand-write `service-<slug>.svg`: `viewBox="0 0 1120 760"`, the `console.css`
   palette, under 10 KB. `src/data/services.test.ts` checks it exists, its size and viewBox.

Scaling is measured in JS (`mountConsoleScaler` sets `--hc-scale`); the old CSS
`tan(atan2())` zoom trick was removed in `0f34c0f` because iOS Safari clipped it.
