/**
 * scene3d engine — the half of the 3D stack that imports three.
 *
 * Only ever reached through `import('./engine')` in bootstrap.ts, after the page
 * has loaded (scripts/lib/perf-gate.mjs fails the build otherwise). One engine
 * owns one renderer on one canvas for the whole visit: the canvas is parked on a
 * page swap and re-attached to the next page's mount, so the GL context and the
 * environment map survive in-site navigation (a scene's own geometry, materials
 * and shader programs are freed with it and rebuilt by the next one).
 *
 * What it guarantees to the page:
 * - A scene that throws, a context that is lost or a GPU that cannot keep up
 *   ends in `onFail`, with the canvas removed — never a frozen or broken frame.
 * - The loop runs only while the mount is on screen, the tab is visible and
 *   motion is allowed.
 * - Everything a scene put on the GPU is freed when the page is swapped.
 */
import { PerspectiveCamera, Scene, WebGLRenderer } from 'three';
import type { SceneId } from '@/data/scenes';
import { getEnvironment } from './kit/environment';
import { applyLook, FOV } from './kit/look';
import { readPalette } from './kit/palette';
import { seeded, seedFrom } from './kit/rng';
import { scenes } from './registry';
import { newSampler, sampleFrame, TIER_PIXEL_RATIO, type Tier } from './tier';
import type { SceneInput, SceneInstance, Viewport } from './types';

export type FailReason = 'error' | 'context-lost' | 'slow';

export interface ShowOptions {
  id: SceneId;
  variant?: string;
  tier: Tier;
  /** Render a single frame at the scene's still time and stop — used to capture posters. */
  still?: boolean;
  /** Frame-rate governor. Off only under test, where software rendering is slow by design. */
  governor: boolean;
  /** Test-only ceiling below the tier's own (software rendering is paid for per pixel). */
  maxPixelRatio?: number;
  /** The scene could not start or could not continue. The canvas is already gone. */
  onFail(reason: FailReason, error?: unknown): void;
}

export interface EngineStats {
  geometries: number;
  textures: number;
  programs: number;
  frames: number;
}

export interface Engine {
  /** Start a scene in `mount`. Resolves once its first frames are on screen; false if superseded or failed. */
  show(mount: HTMLElement, opts: ShowOptions): Promise<boolean>;
  /** Freeze on the current frame (the pause toggle). Stays frozen until the next show(). */
  pause(): void;
  /** Stop, free the scene and park the canvas (page swap). */
  hide(): void;
  /** Live GPU object counts and frames drawn — the leak and pause tests read these. */
  stats(): EngineStats;
}

const POINTER_EASE = 3; // 1/s
const SCROLL_EASE = 6;

interface Active {
  mount: HTMLElement;
  opts: ShowOptions;
  instance: SceneInstance;
  scene: Scene;
  camera: PerspectiveCamera;
  abort: AbortController;
  time: number;
}

export function createEngine(canvas: HTMLCanvasElement, gl: WebGL2RenderingContext): Engine {
  const renderer = new WebGLRenderer({
    canvas,
    context: gl,
    alpha: true,
    antialias: gl.getContextAttributes()?.antialias ?? false,
    powerPreference: 'high-performance',
  });
  applyLook(renderer);

  let token = 0; // bumped by every show()/hide(); a stale async step sees the mismatch and stops
  let active: Active | null = null;
  let raf = 0;
  let running = false;
  let frozen = false; // pause toggle
  let onScreen = true;
  let last = 0;
  let pixelRatio = 1;
  let sampler = newSampler(0); // frame-rate governor; renewed whenever the loop (re)starts
  let framesDrawn = 0;
  const input: SceneInput = { pointerX: 0, pointerY: 0, scroll: 0 };
  let pointerTargetX = 0;
  let pointerTargetY = 0;
  let scrollTarget = 0;
  let mountTop = 0; // document Y of the mount's top edge, measured on resize
  let mountHeight = 1;

  const measure = (a: Active): Viewport | null => {
    const rect = a.mount.getBoundingClientRect();
    if (!rect.width || !rect.height) return null;
    mountTop = rect.top + window.scrollY;
    mountHeight = rect.height;
    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(rect.width, rect.height, false);
    a.camera.aspect = rect.width / rect.height;
    a.camera.updateProjectionMatrix();
    const bufferHeight = renderer.domElement.height;
    return {
      aspect: a.camera.aspect,
      pointScale: bufferHeight / (2 * Math.tan((FOV * Math.PI) / 360)),
    };
  };

  const resize = (a: Active): boolean => {
    const view = measure(a);
    if (!view) return false;
    a.instance.resize(view);
    return true;
  };

  /* 0 while the mount sits comfortably in view; climbs to 1 as it leaves through the
     top. Measured from where the mount's top nears the top of the viewport, so a
     scene that starts below the fold (the phone hero) is not already half way
     through its exit by the time it is scrolled to. */
  const readScroll = () => {
    const begin = Math.max(0, mountTop - window.innerHeight * 0.15);
    scrollTarget = Math.min(1, Math.max(0, (window.scrollY - begin) / Math.max(1, mountHeight)));
  };

  /* three logs a shader that fails to compile and carries on without that object.
     A scene with pieces missing is not the finished picture: note it here (not
     safe to tear down mid-render) and let draw() turn it into a failure. */
  let shaderError: Error | null = null;
  renderer.debug.onShaderError = () => {
    shaderError = new Error('a shader failed to compile or link');
  };

  const draw = (a: Active, dt: number) => {
    a.instance.update(dt, a.time, input);
    renderer.render(a.scene, a.camera);
    framesDrawn++;
    if (shaderError) throw shaderError;
  };

  const stop = () => {
    running = false;
    cancelAnimationFrame(raf);
  };

  const release = () => {
    stop();
    const a = active;
    active = null;
    if (!a) return;
    a.abort.abort();
    try {
      a.instance.dispose();
    } catch {
      /* a scene that broke mid-frame may not dispose cleanly; the renderer reset below still frees it */
    }
    a.scene.environment = null;
    renderer.renderLists.dispose();
    canvas.remove();
  };

  const fail = (reason: FailReason, error?: unknown) => {
    const a = active;
    token++;
    release();
    a?.opts.onFail(reason, error);
  };

  const frame = (now: number) => {
    const a = active;
    if (!a || !running) return;
    raf = requestAnimationFrame(frame);
    const elapsed = now - last;
    last = now;
    const dt = Math.min(elapsed / 1000, 0.05);
    a.time += dt;
    input.pointerX += (pointerTargetX - input.pointerX) * Math.min(1, POINTER_EASE * dt);
    input.pointerY += (pointerTargetY - input.pointerY) * Math.min(1, POINTER_EASE * dt);
    input.scroll += (scrollTarget - input.scroll) * Math.min(1, SCROLL_EASE * dt);
    try {
      draw(a, dt);
    } catch (error) {
      fail('error', error);
      return;
    }

    /* Frame-rate governor (tier.ts): shed pixels first, then hand back to the still. */
    if (!a.opts.governor) return;
    const verdict = sampleFrame(sampler, now, elapsed, pixelRatio);
    if (verdict.action === 'give-up') fail('slow');
    else if (verdict.action === 'lower') {
      pixelRatio = verdict.pixelRatio;
      /* Resizing clears the drawing buffer: paint it again in this same frame. */
      if (resize(a)) {
        try {
          renderer.render(a.scene, a.camera);
        } catch (error) {
          fail('error', error);
        }
      }
    }
  };

  const start = () => {
    if (running || frozen || !active || !onScreen || document.hidden) return;
    running = true;
    last = performance.now();
    sampler = newSampler(last);
    raf = requestAnimationFrame(frame);
  };

  /* Draw one frame outside the loop: after a theme change or resize while frozen or off screen. */
  const redraw = () => {
    const a = active;
    if (!a || running) return;
    try {
      draw(a, 0);
    } catch (error) {
      fail('error', error);
    }
  };

  canvas.addEventListener('webglcontextlost', (event) => {
    event.preventDefault();
    fail('context-lost');
  });

  const wire = (a: Active) => {
    const { signal } = a.abort;

    const io = new IntersectionObserver((entries) => {
      onScreen = entries[entries.length - 1]?.isIntersecting ?? true;
      if (onScreen) start();
      else stop();
    });
    io.observe(a.mount);

    let resizeTimer = 0;
    const ro = new ResizeObserver(() => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        if (active !== a) return;
        if (resize(a)) {
          readScroll();
          redraw();
        }
      }, 150);
    });
    ro.observe(a.mount);

    /* Settle a task late: a view-transition swap strips data-theme and BaseLayout
       restores it an await later (same reasoning as onMotionChange). */
    let themeTimer = 0;
    const mo = new MutationObserver(() => {
      window.clearTimeout(themeTimer);
      themeTimer = window.setTimeout(() => {
        if (active !== a) return;
        try {
          a.instance.setTheme(readPalette());
        } catch (error) {
          fail('error', error);
          return;
        }
        redraw();
      }, 0);
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    signal.addEventListener('abort', () => {
      io.disconnect();
      ro.disconnect();
      mo.disconnect();
      window.clearTimeout(resizeTimer);
      window.clearTimeout(themeTimer);
    });

    document.addEventListener(
      'visibilitychange',
      () => {
        if (document.hidden) stop();
        else start();
      },
      { signal },
    );
    window.addEventListener('scroll', readScroll, { passive: true, signal });
    if (window.matchMedia('(hover: hover)').matches) {
      window.addEventListener(
        'pointermove',
        (e) => {
          pointerTargetX = (e.clientX / window.innerWidth - 0.5) * 2;
          pointerTargetY = (e.clientY / window.innerHeight - 0.5) * 2;
        },
        { passive: true, signal },
      );
      document.documentElement.addEventListener(
        'pointerleave',
        () => {
          pointerTargetX = 0;
          pointerTargetY = 0;
        },
        { signal },
      );
    }
  };

  return {
    async show(mount, opts) {
      const mine = ++token;
      release();
      shaderError = null;
      frozen = false;
      onScreen = true;
      pixelRatio = Math.min(window.devicePixelRatio || 1, TIER_PIXEL_RATIO[opts.tier], opts.maxPixelRatio ?? Infinity);
      input.pointerX = input.pointerY = input.scroll = 0;
      pointerTargetX = pointerTargetY = 0;

      let instance: SceneInstance | null = null;
      try {
        const mod = await scenes[opts.id]();
        if (mine !== token) return false;
        performance.mark('scene3d:module');

        const scene = new Scene();
        const camera = new PerspectiveCamera(FOV, 1, 0.1, 60);
        const environment = getEnvironment(renderer);
        scene.environment = environment;
        instance = mod.create({
          renderer,
          scene,
          camera,
          tier: opts.tier,
          palette: readPalette(),
          variant: opts.variant,
          environment,
          rng: seeded(seedFrom(`${opts.id}:${opts.variant ?? ''}`)),
        });
        const a: Active = { mount, opts, instance, scene, camera, abort: new AbortController(), time: opts.still ? mod.stillAt : 0 };
        active = a;
        if (!resize(a)) throw new Error('mount has no size');
        performance.mark('scene3d:built');
        readScroll();
        input.scroll = opts.still ? 0 : scrollTarget;

        /* Compile off the main thread where the driver allows, then put two frames
           on the canvas before it is shown — the first can still hitch on upload. */
        await renderer.compileAsync(scene, camera);
        if (mine !== token) return false;
        performance.mark('scene3d:compiled');
        draw(a, 0);
        mount.append(canvas);
        await new Promise((r) => requestAnimationFrame(r));
        if (mine !== token) return false;
        draw(a, 0);
        performance.mark('scene3d:drawn');

        if (!opts.still) {
          wire(a);
          start();
        }
        return true;
      } catch (error) {
        if (mine !== token) return false;
        if (active) {
          fail('error', error);
        } else {
          /* Failed before the scene was installed: free what it built and report. */
          try {
            instance?.dispose();
          } catch {
            /* nothing more to free */
          }
          token++;
          canvas.remove();
          opts.onFail('error', error);
        }
        return false;
      }
    },
    pause() {
      frozen = true;
      stop();
    },
    hide() {
      token++;
      release();
    },
    stats() {
      return {
        geometries: renderer.info.memory.geometries,
        textures: renderer.info.memory.textures,
        programs: renderer.info.programs?.length ?? 0,
        frames: framesDrawn,
      };
    },
  };
}
