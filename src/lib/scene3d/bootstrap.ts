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
 *
 * It also says how far it got and why it stopped, for whoever has to work out
 * why a phone shows a still: `data-scene-step` (Step) and `data-scene-fail`
 * (Fail), read by the `?scene-debug` readout (debug.ts) and by the tests.
 */
import { SCENE3D_ENABLED, SCENE3D_TOUCH_AUTOSTART, SCENE_IDS, type SceneId } from '@/data/scenes';
import { scheduleIdle } from '@/lib/idle';
import { motionOff, onMotionChange } from '@/lib/motion';
import type { Engine, EngineStats, FailReason } from './engine';
import { isSlowConnection, isSoftwareRenderer, pickPlan, type Device } from './tier';

type State = 'static' | 'loading' | 'live' | 'paused';
/** How far the start got: waiting for its trigger, probing WebGL, fetching the engine, … */
export type Step = 'armed' | 'probing' | 'loading' | 'building' | 'compiling' | 'live';
/** Why this mount is showing the still although the plan allowed a scene. */
export type Fail = FailReason | 'no-webgl' | 'software-gl' | 'engine-load' | 'timeout' | 'motion-off';

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
    /** Tests: the start time limit in ms (0 = none). Off by default under `__scene3dForce`, where a software start is slow by design. */
    __scene3dStartLimit?: number;
  }
}

const GAVE_UP_KEY = 'scene3d-gave-up';
const MAX_CONTEXT_LOSSES = 1; // one re-create per visit, then stills for the rest of it
/** From deciding to start to a frame on screen. Past this the visitor keeps the still: no mount sits on `loading` for ever. */
const START_LIMIT_MS = 12_000;
/** One more try for an engine chunk that did not arrive (a dropped request on a phone), this long after the first. */
const ENGINE_RETRY_MS = 2000;
/** After a lost context, how long before the one fresh attempt — the GPU process needs a moment. */
const RECOVER_MS = 1500;

/* Module state survives client-side navigation: the router never re-runs a module. */
let generation = 0; // bumped on every page swap; async steps compare before touching the DOM
let stage: { canvas: HTMLCanvasElement; gl: WebGL2RenderingContext } | null = null;
let engine: Promise<Engine> | null = null;
let webglUnavailable = false;
let softwareGl = false; // …because the only renderer on offer draws on the CPU
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
  const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean; effectiveType?: string } };
  return {
    enabled: SCENE3D_ENABLED,
    motionOff: motionOff(),
    saveData: nav.connection?.saveData === true,
    slowConnection: isSlowConnection(nav.connection?.effectiveType),
    touchAutostart: SCENE3D_TOUCH_AUTOSTART,
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
 * better than a slideshow. The renderer string says so on most browsers, and
 * whatever slips past it meets the frame-rate governor in the engine.
 *
 * `failIfMajorPerformanceCaveat` is asked for first and, if that is refused,
 * dropped: browsers disagree about what a "caveat" is, and a phone that answers
 * no to the strict question can still have a GPU that draws the scene well. The
 * two checks above are what actually keep a slideshow off the page.
 */
function openContext(strict: boolean, touch: boolean): NonNullable<typeof stage> | null {
  const canvas = document.createElement('canvas');
  canvas.className = 'scene3d-stage';
  canvas.setAttribute('aria-hidden', 'true');
  try {
    const gl = canvas.getContext('webgl2', {
      alpha: true,
      antialias: true, // phone mounts are small; edges without it shimmer
      depth: true,
      stencil: false,
      premultipliedAlpha: true,
      /* A phone has one GPU and a battery: let it choose. */
      powerPreference: touch ? 'default' : 'high-performance',
      failIfMajorPerformanceCaveat: strict,
    });
    return gl ? { canvas, gl } : null;
  } catch {
    return null;
  }
}

function acquireStage(): typeof stage {
  if (stage) return stage;
  if (webglUnavailable) return null;
  const touch = window.matchMedia('(pointer: coarse)').matches;
  const forced = !!window.__scene3dForce;
  const opened = openContext(!forced, touch) ?? (forced ? null : openContext(false, touch));
  const canvas = opened?.canvas;
  let gl = opened?.gl ?? null;
  if (gl && !forced && isSoftwareRenderer(rendererName(gl))) {
    gl.getExtension('WEBGL_lose_context')?.loseContext(); // hand the context back at once
    gl = null;
    softwareGl = true;
  }
  if (!gl || !canvas) {
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

/**
 * The engine chunk, with one second try: a single dropped request should not cost
 * the visit its scenes. That works where the browser fetches again (Chromium,
 * Firefox). WebKit remembers a failed module for the life of the document, so
 * there the second try fails at once and the visitor keeps the still until the
 * next full page load — the same outcome as before, never worse.
 */
function loadEngine(s: NonNullable<typeof stage>): Promise<Engine> {
  engine ??= import('./engine')
    .catch(() => new Promise((resolve) => window.setTimeout(resolve, ENGINE_RETRY_MS)).then(() => import('./engine')))
    .then((m) => m.createEngine(s.canvas, s.gl));
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
 * Paint the captured still (still.ts) for whoever is not getting the live scene, or
 * not yet. A chunk of its own, fetched only by a page that has a poster canvas:
 * the homepage shows its 2D orb instead and never asks for it.
 */
function paintStill(mount: HTMLElement, signal: AbortSignal): void {
  if (!mount.querySelector('canvas.scene3d-poster')) return;
  void import('./still').then((m) => m.paintStill(mount, signal)).catch(() => {});
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
  const setStep = (step: Step) => {
    if (alive()) mount.dataset.sceneStep = step;
  };
  const setFail = (fail: Fail, error?: unknown) => {
    if (!alive()) return;
    mount.dataset.sceneFail = fail;
    if (error !== undefined) mount.dataset.sceneError = String(error).slice(0, 200);
  };

  const plan = pickPlan(readDevice());
  mount.dataset.scenePlan = `${plan.trigger}:${plan.tier}:${plan.reason}`;
  /* `gave-up` covers four different histories; say which one this visit had. */
  if (plan.reason === 'gave-up') {
    setFail(softwareGl ? 'software-gl' : webglUnavailable ? 'no-webgl' : engineUnavailable ? 'engine-load' : gaveUp() ? 'slow' : 'context-lost');
  }

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
     else arrives, gets it painted now — and so does the phone tier, where the engine
     can be seconds away on mobile data. A desktop about to load the live scene does
     not download a picture it would show for a second — unless that scene fails. */
  if (plan.trigger !== 'idle' || plan.tier === 'low') paintStill(mount, signal);
  if (plan.trigger === 'never') return;

  const onFail = (reason: FailReason, error?: unknown) => {
    if (reason === 'slow') rememberGaveUp();
    /* 'context-lost' needs nothing more here: the stage's own listener (acquireStage)
       has already retired the stage and the engine. */
    if (reason === 'error') console.warn('[scene3d] showing the still instead:', error);
    else console.warn(`[scene3d] showing the still instead: ${reason}`);
    setFail(reason, error);
    current = null;
    setState('static');
    paintStill(mount, signal);
    if (reason === 'context-lost') recover();
  };

  /* A lost context is often not the page's fault — a phone takes them from tabs it
     has put in the background. One fresh attempt, once the page is being looked at
     again; the visit-wide cap (MAX_CONTEXT_LOSSES) still ends a GPU that keeps failing. */
  let recovered = false;
  const recover = () => {
    if (recovered || contextLosses > MAX_CONTEXT_LOSSES) return;
    recovered = true;
    const again = () => {
      if (!alive() || motionOff() || getState() !== 'static') return;
      started = false;
      scheduleIdle(() => void run());
    };
    const timer = window.setTimeout(() => {
      if (!document.hidden) return again();
      const shown = () => {
        if (document.hidden) return;
        document.removeEventListener('visibilitychange', shown);
        window.removeEventListener('pageshow', shown);
        again();
      };
      document.addEventListener('visibilitychange', shown, { signal });
      window.addEventListener('pageshow', shown, { signal });
    }, RECOVER_MS);
    signal.addEventListener('abort', () => window.clearTimeout(timer), { once: true });
  };

  let started = false;
  const run = async () => {
    if (started || !alive() || motionOff()) return;
    started = true;
    delete mount.dataset.sceneFail;
    delete mount.dataset.sceneError;
    setStep('probing');
    const s = acquireStage();
    if (!s) {
      /* No usable WebGL2: the still stands, and three is never requested. */
      setFail(softwareGl ? 'software-gl' : 'no-webgl');
      return paintStill(mount, signal);
    }
    setState('loading');
    setStep('loading');
    performance.mark('scene3d:start');

    /* The start has a time limit. Whatever is still on its way when it runs out —
       a download, a shader compile that never reports back — is abandoned for this
       page, and the visitor keeps the still. */
    let timedOut = false;
    const limit = window.__scene3dStartLimit ?? (window.__scene3dForce ? 0 : START_LIMIT_MS);
    const watchdog = limit
      ? window.setTimeout(() => {
          if (!alive() || getState() !== 'loading') return;
          timedOut = true;
          console.warn('[scene3d] showing the still instead: timeout');
          setFail('timeout');
          current = null;
          setState('static');
          paintStill(mount, signal);
          void engine?.then((e) => alive() && e.hide()).catch(() => {});
        }, limit)
      : 0;
    signal.addEventListener('abort', () => window.clearTimeout(watchdog), { once: true });

    try {
      const e = await loadEngine(s);
      if (timedOut) return;
      performance.mark('scene3d:engine');
      await holdReleased(mount, signal);
      if (timedOut) return;
      if (!alive() || motionOff()) {
        setFail('motion-off');
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
        onStep: setStep,
      });
      if (!shown) {
        if (getState() === 'loading') setState('static');
        return;
      }
      if (!alive() || timedOut) return;
      if (motionOff()) {
        /* Paused while the scene was compiling: it never takes the stage. */
        e.hide();
        setFail('motion-off');
        paintStill(mount, signal);
        return setState('static');
      }
      setState('live');
      setStep('live');
    } catch (error) {
      /* The engine chunk did not arrive (offline, or a stale page after a deploy). */
      engineUnavailable = true;
      engine = null;
      console.warn('[scene3d] engine unavailable, showing the still instead:', error);
      if (!timedOut) setFail('engine-load', error);
      setState('static');
      paintStill(mount, signal);
    } finally {
      window.clearTimeout(watchdog);
    }
  };

  setStep('armed');
  if (plan.trigger === 'interaction') {
    /* A phone on a slow connection (or every phone, with SCENE3D_TOUCH_AUTOSTART off):
       nothing is fetched until the visitor touches the page.
       `scroll` is deliberately absent — the router scrolls on every navigation. */
    const arm = () => void pageLoaded(signal).then(() => scheduleIdle(() => void run()));
    for (const type of ['pointerdown', 'touchstart', 'keydown', 'wheel'] as const) {
      window.addEventListener(type, arm, { once: true, passive: true, signal });
    }
    return;
  }

  /* Everyone else: after the page has loaded, once the mount is near the viewport, at idle. */
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

/* `?scene-debug`: an on-page readout of everything above, for a phone with no
   developer tools. A chunk of its own, fetched only when asked for. */
try {
  if (new URLSearchParams(location.search).has('scene-debug')) {
    void import('./debug').then((m) => m.mountDebug()).catch(() => {});
  }
} catch {
  /* the readout is a convenience: never let it reach the page */
}

document.addEventListener('astro:page-load', initPage);
/* Belt-and-braces: if this module evaluates after astro:page-load already fired. */
if (document.readyState !== 'loading') initPage();
