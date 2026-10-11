import { motionOff, onMotionChange } from '@/lib/motion';
/**
 * explainerLoop — client harness for the step-through explainers
 * (src/components/explainers/Explainer.astro).
 *
 * Contract (the same idioms as consoleLoop):
 * - The SSR markup is the final state: every part drawn, every step listed.
 *   Without this script, with motion off, or after a failure, that is what stands.
 * - Idempotent: a `data-ex-init` guard survives the astro:page-load +
 *   readyState double-fire registration pattern.
 * - One IntersectionObserver + visibilitychange fold into a single `active`
 *   flag; the loop FREEZES while inactive (it re-polls, never advances, never
 *   bursts to catch up).
 * - Stateless frames: each tick derives every element's state from the step
 *   number alone, so nothing can drift across hours on screen.
 * - One AbortController owns all listeners and one timer id is ever pending;
 *   astro:before-swap aborts and clears everything.
 * - A throw inside one explainer returns that figure to its static state and
 *   leaves the others running.
 *
 * Pure helpers are environment-agnostic so they are unit-tested in Node.
 */

/** Milliseconds a step stays on screen, and how long the finished diagram holds before looping. */
export const STEP_MS = 1700;
export const HOLD_MS = 3200;

/** The step after `step`, wrapping to 0 after the last. Bad input restarts the loop. */
export function nextStep(step: number, count: number): number {
  if (!(count > 0) || !Number.isInteger(step) || step < 0) return 0;
  return step + 1 >= count ? 0 : step + 1;
}

/** How long to stay on `step`: the last step holds longer so the finished picture can be read. */
export function dwell(step: number, count: number): number {
  return step === count - 1 ? HOLD_MS : STEP_MS;
}

/**
 * State of one part at `step`. `at` is the step it appears on; `until`, when
 * set, is the step it leaves on (a robot's earlier position, a failed hash).
 */
export function partState(step: number, at: number, until?: number): { on: boolean; now: boolean } {
  const on = step >= at && (until === undefined || step < until);
  return { on, now: on && step === at };
}

/** Parse a `data-at` / `data-until` attribute; anything that is not a whole number ≥ 0 is ignored. */
export function readStep(raw: string | undefined): number | undefined {
  if (raw === undefined || raw === '') return undefined;
  const n = Number(raw);
  return Number.isInteger(n) && n >= 0 ? n : undefined;
}

interface Part {
  el: Element;
  at: number;
  until?: number;
}

/** Arm one explainer figure. Returns its teardown. */
function mount(figure: HTMLElement, signal: AbortSignal): () => void {
  const count = readStep(figure.dataset.exSteps) ?? 0;
  const parts: Part[] = [];
  for (const el of figure.querySelectorAll<HTMLElement | SVGElement>('[data-at]')) {
    const at = readStep(el.dataset.at);
    if (at !== undefined) parts.push({ el, at, until: readStep(el.dataset.until) });
  }
  if (count < 2 || parts.length === 0) return () => {};

  let step = 0;
  let timer = 0;
  let inView = false;
  let running = false;

  const paint = () => {
    for (const p of parts) {
      const s = partState(step, p.at, p.until);
      p.el.classList.toggle('is-on', s.on);
      p.el.classList.toggle('is-now', s.now);
    }
    figure.dataset.exStep = String(step);
  };

  /** Back to the server-rendered picture: everything drawn, nothing stepping. */
  const rest = () => {
    window.clearTimeout(timer);
    timer = 0;
    running = false;
    delete figure.dataset.exRun;
    delete figure.dataset.exStep;
    for (const p of parts) p.el.classList.remove('is-on', 'is-now');
  };

  const active = () => inView && !document.hidden;

  const tick = () => {
    timer = 0;
    if (!running) return;
    try {
      if (active()) {
        step = nextStep(step, count);
        paint();
      }
      timer = window.setTimeout(tick, active() ? dwell(step, count) : STEP_MS);
    } catch {
      rest();
    }
  };

  const start = (from = 0) => {
    if (motionOff()) return;
    try {
      window.clearTimeout(timer);
      step = from;
      running = true;
      figure.dataset.exRun = '';
      paint();
      timer = window.setTimeout(tick, dwell(step, count));
    } catch {
      rest();
    }
  };

  const io = new IntersectionObserver(
    (entries) => {
      inView = entries.some((e) => e.isIntersecting);
      if (inView && !running) start();
    },
    /* Low, as in consoleLoop: a figure stacked tall on a phone can never show 35% of
       itself in a short viewport, and would never start. */
    { threshold: 0.15 },
  );
  io.observe(figure);

  figure.querySelector('[data-ex-replay]')?.addEventListener('click', () => start(0), { signal });

  const offMotion = onMotionChange((off) => {
    if (off) rest();
    else if (inView) start();
  });

  return () => {
    io.disconnect();
    offMotion();
    rest();
  };
}

/** Arm every explainer on the page. Safe to call more than once. */
export function armExplainers(root: ParentNode = document): void {
  const figures = [...root.querySelectorAll<HTMLElement>('[data-explainer]')].filter((f) => !f.dataset.exInit);
  if (figures.length === 0) return;

  const ac = new AbortController();
  const teardowns: (() => void)[] = [];
  for (const figure of figures) {
    figure.dataset.exInit = '1';
    try {
      teardowns.push(mount(figure, ac.signal));
    } catch {
      delete figure.dataset.exRun;
    }
  }
  document.addEventListener(
    'astro:before-swap',
    () => {
      ac.abort();
      for (const t of teardowns) t();
      for (const figure of figures) delete figure.dataset.exInit;
    },
    { once: true },
  );
}
