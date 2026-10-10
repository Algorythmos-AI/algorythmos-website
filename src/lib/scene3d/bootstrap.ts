/**
 * scene3d bootstrap — the only part of the 3D stack a page loads up front.
 *
 * It decides whether this visitor gets live 3D (tier.ts), waits for the right
 * moment, proves WebGL2 works BEFORE anything is downloaded, and only then
 * fetches the engine. It must never import three, directly or through a helper:
 * scripts/lib/perf-gate.mjs fails the build if the engine chunk is reachable
 * from any page's first load.
 *
 * Mount contract (Scene3D.astro): `[data-scene="<id>"]`, optional
 * `data-scene-variant`. This module owns `data-scene-state`:
 *   static   the still (or whatever the page shows underneath) — the default
 *   loading  the engine or scene is on its way
 *   live     the 3D scene owns the stage
 *   paused   frozen on its last frame by the pause toggle
 * Every failure path ends on `static`.
 */
import { SCENE3D_ENABLED, SCENE_IDS, type SceneId } from '@/data/scenes';
import { scheduleIdle } from '@/lib/idle';
import { motionOff, onMotionChange } from '@/lib/motion';
import type { Engine, EngineStats, FailReason } from './engine';
import { isSoftwareRenderer, pickPlan, type Device } from './tier';

type State = 'static' | 'loading' | 'live' | 'paused';

declare global {
  interface Window {
    /**
     * Tests and poster capture: accept software rendering, which a visitor never gets,
     * and switch the frame-rate governor off (`'governed'` keeps it on, to test it).
     */
    __scene3dForce?: boolean | 'governed';
    /** Poster capture: render one frame at the scene's still time and stop. */
    __scene3dStill?: boolean;
    /** Leak test: live GPU object counts from the engine. */
    __scene3dStats?: () => Promise<EngineStats | null>;
  }
}

const GAVE_UP_KEY = 'scene3d-gave-up';
const MAX_CONTEXT_LOSSES = 1; // one re-create per visit, then stills for the rest of it

/* Module state survives client-side navigation: the router never re-runs a module. */
let generation = 0; // bumped on every page swap; async steps compare before touching the DOM
let stage: { canvas: HTMLCanvasElement; gl: WebGL2RenderingContext } | null = null;
let engine: Promise<Engine> | null = null;
let webglUnavailable = false;
let engineUnavailable = false; // the chunk failed to load: no retry loop
let contextLosses = 0;

function gaveUp(): boolean {
  try {
    return sessionStorage.getItem(GAVE_UP_KEY) === '1';
  } catch {
    return false;
  }
}
function rememberGaveUp(): void {
  try {
    sessionStorage.setItem(GAVE_UP_KEY, '1');
  } catch {
    /* storage unavailable: the next page will find out for itself */
  }
}

function readDevice(): Device {
  const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
  return {
    enabled: SCENE3D_ENABLED,
    motionOff: motionOff(),
    saveData: nav.connection?.saveData === true,
    moreContrast: window.matchMedia('(prefers-contrast: more)').matches,
    forcedColors: window.matchMedia('(forced-colors: active)').matches,
    deviceMemory: nav.deviceMemory,
    width: Math.max(window.innerWidth, document.documentElement.clientWidth),
    coarsePointer: window.matchMedia('(pointer: coarse)').matches,
    hover: window.matchMedia('(hover: hover)').matches,
    gaveUp: gaveUp() || webglUnavailable || engineUnavailable || contextLosses > MAX_CONTEXT_LOSSES,
  };
}

/**
 * One canvas and one GL context for the whole visit. Created — and therefore
 * probed — before the engine is requested, so a browser without usable WebGL2
 * never downloads three. Software rendering counts as unusable: a still looks
 * better than a slideshow. `failIfMajorPerformanceCaveat` catches some of it and
 * the renderer string the rest; whatever slips past both meets the frame-rate
 * governor in the engine.
 */
function acquireStage(): typeof stage {
  if (stage) return stage;
  if (webglUnavailable) return null;
  const canvas = document.createElement('canvas');
  canvas.className = 'scene3d-stage';
  canvas.setAttribute('aria-hidden', 'true');
  let gl: WebGL2RenderingContext | null = null;
  try {
    gl = canvas.getContext('webgl2', {
      alpha: true,
      antialias: true, // phone mounts are small; edges without it shimmer
      depth: true,
      stencil: false,
      premultipliedAlpha: true,
      powerPreference: 'high-performance',
      failIfMajorPerformanceCaveat: !window.__scene3dForce,
    });
  } catch {
    gl = null;
  }
  if (gl && !window.__scene3dForce && isSoftwareRenderer(rendererName(gl))) {
    gl.getExtension('WEBGL_lose_context')?.loseContext(); // hand the context back at once
    gl = null;
  }
  if (!gl) {
    webglUnavailable = true;
    return null;
  }
  /* The context can be lost at any time — including while the canvas is parked
     between pages, when no scene is there to notice. Bootstrap owns the
     consequence: this stage and its engine are finished; the next page that wants
     a scene builds fresh ones, once. (Registered before the engine's own listener,
     so the engine's fail() finds the bookkeeping already done.) */
  canvas.addEventListener('webglcontextlost', () => {
    if (stage?.canvas !== canvas) return;
    contextLosses++;
    stage = null;
    engine = null;
  });
  stage = { canvas, gl };
  return stage;
}

/**
 * The GL renderer's name. Firefox reports it on RENDERER (and warns when the debug
 * extension is used); Chromium and WebKit mask RENDERER and need the extension.
 */
function rendererName(gl: WebGL2RenderingContext): string | null {
  const plain = String(gl.getParameter(gl.RENDERER) ?? '');
  if (plain && !/^(webkit webgl|mozilla)$/i.test(plain)) return plain;
  const info = gl.getExtension('WEBGL_debug_renderer_info');
  return info ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL) ?? '') : plain || null;
}

function loadEngine(s: NonNullable<typeof stage>): Promise<Engine> {
  engine ??= import('./engine').then((m) => m.createEngine(s.canvas, s.gl));
  return engine;
}

function isSceneId(value: string | undefined): value is SceneId {
  return (SCENE_IDS as readonly string[]).includes(value ?? '');
}

/** Resolve once the page has finished loading, so the engine never competes with it. */
function pageLoaded(signal: AbortSignal): Promise<void> {
  if (document.readyState === 'complete') return Promise.resolve();
  return new Promise((resolve) => window.addEventListener('load', () => resolve(), { once: true, signal }));
}

/**
 * The home hero stacks the scene over the 2D orb and asks to wait for the orb's
 * entrance (`data-scene-after`), so the 3D core cross-fades in over a formed
 * orb, not over a cloud of converging particles. Never waits forever.
 */
function holdReleased(mount: HTMLElement, signal: AbortSignal): Promise<void> {
  const selector = mount.dataset.sceneAfter;
  const target = selector ? document.querySelector<HTMLElement>(selector) : null;
  if (!target || target.dataset.orbFormed || signal.aborted) return Promise.resolve();
  return new Promise((resolve) => {
    const done = () => {
      mo.disconnect();
      window.clearTimeout(timer);
      resolve();
    };
    const mo = new MutationObserver(() => {
      if (target.dataset.orbFormed) done();
    });
    mo.observe(target, { attributes: true, attributeFilter: ['data-orb-formed'] });
    const timer = window.setTimeout(done, 4000);
    signal.addEventListener('abort', done, { once: true });
  });
}

/**
 * Paint the captured still into the mount's poster canvas, for whoever is not
 * getting the live scene (or not yet). Waits for the page to finish loading so
 * the image never competes with it, picks the size for this mount and the theme
 * in force, and repaints when either changes.
 */
function paintStill(mount: HTMLElement, signal: AbortSignal): void {
  const canvas = mount.querySelector<HTMLCanvasElement>('canvas.scene3d-poster');
  if (!canvas || canvas.dataset.painting) return;
  canvas.dataset.painting = '1';
  let job = 0;
  const paint = async () => {
    const mine = ++job;
    const theme = document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';
    const [small, large] = (theme === 'light' ? canvas.dataset.stillLight : canvas.dataset.stillDark)?.split(' ') ?? [];
    const rect = canvas.getBoundingClientRect();
    if (!small || !rect.width || !rect.height) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const image = new Image();
    image.decoding = 'async';
    image.src = rect.width * dpr > 560 && large ? large : small;
    try {
      await image.decode();
    } catch {
      return; // offline, or a browser without AVIF: the page simply has no picture here
    }
    if (mine !== job || signal.aborted) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    const scale = Math.min(canvas.width / image.naturalWidth, canvas.height / image.naturalHeight);
    const w = image.naturalWidth * scale;
    const h = image.naturalHeight * scale;
    ctx.drawImage(image, (canvas.width - w) / 2, (canvas.height - h) / 2, w, h);
    canvas.dataset.painted = theme;
  };
  void pageLoaded(signal).then(() => scheduleIdle(() => void paint()));

  let timer = 0;
  const later = () => {
    window.clearTimeout(timer);
    timer = window.setTimeout(() => void paint(), 160);
  };
  const themes = new MutationObserver(later);
  themes.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  const sizes = new ResizeObserver(() => {
    if (canvas.dataset.painted) later();
  });
  sizes.observe(canvas);
  signal.addEventListener('abort', () => {
    window.clearTimeout(timer);
    themes.disconnect();
    sizes.disconnect();
  });
}

function initPage(): void {
  const mount = document.querySelector<HTMLElement>('[data-scene]');
  if (!mount || mount.dataset.sceneInit) return;
  mount.dataset.sceneInit = '1';
  const id = mount.dataset.scene;
  if (!isSceneId(id)) return;

  const gen = generation;
  const abort = new AbortController();
  const { signal } = abort;
  const alive = () => gen === generation && mount.isConnected;
  const setState = (state: State) => {
    if (alive()) mount.dataset.sceneState = state;
  };
  const getState = () => mount.dataset.sceneState as State | undefined;

  const plan = pickPlan(readDevice());
  mount.dataset.scenePlan = `${plan.trigger}:${plan.tier}:${plan.reason}`;

  let current: Engine | null = null;

  const offMotion = onMotionChange((off) => {
    if (!off || !alive()) return;
    /* Pause pressed. A live scene freezes on its frame; one still on its way never
       reaches the stage (run() re-checks motionOff() after every await). */
    current?.pause();
    if (getState() === 'live') setState('paused');
  });

  document.addEventListener(
    'astro:before-swap',
    () => {
      generation++;
      abort.abort();
      offMotion();
      void engine?.then((e) => e.hide()).catch(() => {});
    },
    { once: true },
  );

  /* Whoever is certain to keep the still, or will wait for a touch before anything
     else arrives, gets it painted now. A desktop about to load the live scene does
     not download a picture it would show for a second — unless that scene fails. */
  if (plan.trigger !== 'idle') paintStill(mount, signal);
  if (plan.trigger === 'never') return;

  const onFail = (reason: FailReason, error?: unknown) => {
    if (reason === 'slow') rememberGaveUp();
    /* 'context-lost' needs nothing more here: the stage's own listener (acquireStage)
       has already retired the stage and the engine. */
    if (reason === 'error') console.warn('[scene3d] showing the still instead:', error);
    current = null;
    setState('static');
    paintStill(mount, signal);
  };

  let started = false;
  const run = async () => {
    if (started || !alive() || motionOff()) return;
    started = true;
    const s = acquireStage();
    if (!s) return paintStill(mount, signal); // no usable WebGL2: the still stands, and three is never requested
    setState('loading');
    performance.mark('scene3d:start');
    try {
      const e = await loadEngine(s);
      performance.mark('scene3d:engine');
      await holdReleased(mount, signal);
      if (!alive() || motionOff()) {
        paintStill(mount, signal);
        return setState('static');
      }
      current = e;
      const shown = await e.show(mount, {
        id,
        variant: mount.dataset.sceneVariant,
        tier: plan.tier,
        still: window.__scene3dStill === true,
        governor: window.__scene3dForce !== true,
        /* Under test the scene is software-rendered: a quarter of the pixels keeps a
           suite of them from starving every other test of CPU. */
        maxPixelRatio: window.__scene3dForce === true && !window.__scene3dStill ? 0.5 : undefined,
        onFail,
      });
      if (!shown) {
        if (getState() === 'loading') setState('static');
        return;
      }
      if (!alive()) return;
      if (motionOff()) {
        /* Paused while the scene was compiling: it never takes the stage. */
        e.hide();
        paintStill(mount, signal);
        return setState('static');
      }
      setState('live');
    } catch (error) {
      /* The engine chunk did not arrive (offline, or a stale page after a deploy). */
      engineUnavailable = true;
      engine = null;
      console.warn('[scene3d] engine unavailable, showing the still instead:', error);
      setState('static');
      paintStill(mount, signal);
    }
  };

  if (plan.trigger === 'interaction') {
    /* Phones and tablets: nothing is fetched until the visitor touches the page.
       `scroll` is deliberately absent — the router scrolls on every navigation. */
    const arm = () => void pageLoaded(signal).then(() => scheduleIdle(() => void run()));
    for (const type of ['pointerdown', 'touchstart', 'keydown', 'wheel'] as const) {
      window.addEventListener(type, arm, { once: true, passive: true, signal });
    }
    return;
  }

  /* Desktop: after the page has loaded, once the mount is near the viewport, at idle. */
  void pageLoaded(signal).then(() => {
    if (!alive()) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((en) => en.isIntersecting)) return;
        io.disconnect();
        scheduleIdle(() => void run());
      },
      { rootMargin: '200px' },
    );
    io.observe(mount);
    signal.addEventListener('abort', () => io.disconnect(), { once: true });
  });
}

window.__scene3dStats = async () => (engine ? (await engine).stats() : null);

document.addEventListener('astro:page-load', initPage);
/* Belt-and-braces: if this module evaluates after astro:page-load already fired. */
if (document.readyState !== 'loading') initPage();
