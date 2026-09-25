import { motionOff } from '@/lib/motion';
/**
 * consoleLoop — shared client harness for the "living console" mockups
 * (HeroConsole + the service consoles).
 *
 * Engineering contract (mirrors the repo's animation idioms):
 * - Idempotent: `data-hc-init` guard survives the astro:page-load + readyState
 *   double-fire registration pattern.
 * - prefers-reduced-motion → return before arming anything; the SSR baseline
 *   (final values, fully drawn charts) stands untouched.
 * - One IntersectionObserver + visibilitychange fold into a single `active`
 *   flag; the keyframe driver FREEZES while inactive (re-polls, never advances,
 *   never bursts to catch up).
 * - Drift-proof loop: `[data-hc-stage]` regions are snapshotted once at init;
 *   every loop iteration restores from that snapshot, so state can never
 *   accumulate error across hours on screen.
 * - Structurally leak-proof teardown: one AbortController owns all listeners,
 *   one Set owns all timer ids; astro:before-swap aborts + clears everything.
 *
 * Pure helpers (easeOutQuart, formatValue) are environment-agnostic so they
 * can be shared with SSR frontmatter and unit-tested in Node.
 */

/** Quartic ease-out — same curve as ResultsCounters. */
export function easeOutQuart(p: number): number {
  return 1 - Math.pow(1 - p, 4);
}

/**
 * Scale factor to fit a fixed-width canvas into a container. Pure so it can be
 * unit-tested; the DOM plumbing lives in mountConsoleScaler below.
 */
export function scaleFor(clientWidth: number, canvasWidth: number): number {
  if (!(clientWidth > 0) || !(canvasWidth > 0)) return 1;
  return clientWidth / canvasWidth;
}

/**
 * Drive the console scaler from measured width (bulletproof cross-browser —
 * replaces the CSS container-unit trig that iOS Safari couldn't resolve).
 * Sets a numeric `--hc-scale` consumed by `zoom` (crisp, re-laid-out) with a
 * transform fallback, and adds `.hc-scaled` to reveal. Idempotent, ResizeObserver-
 * kept, torn down on astro:before-swap. Runs regardless of reduced-motion.
 * On mobile the CSS media query neutralizes zoom/transform, so this is a no-op there.
 */
export function mountConsoleScaler(viewport: HTMLElement): void {
  if (viewport.dataset.hcScalerInit) return;
  viewport.dataset.hcScalerInit = '1';
  const canvasW = parseFloat(getComputedStyle(viewport).getPropertyValue('--hc-w')) || 0;

  const apply = () => {
    viewport.style.setProperty('--hc-scale', String(scaleFor(viewport.clientWidth, canvasW)));
    viewport.classList.add('hc-scaled');
  };
  apply();

  const ro = new ResizeObserver(apply);
  ro.observe(viewport);
  document.addEventListener('astro:before-swap', () => ro.disconnect(), { once: true });
}

/**
 * Locale-aware number formatting shared by SSR (frontmatter) and the client
 * count-up so the final animation frame always matches the server-rendered
 * text. Formats: 'int' (1,284 / 1 284), 'pct1' (99.2% / 99,2 %),
 * 'sec1' (1.8s / 1,8 s).
 */
export function formatValue(value: number, format: string, locale: string): string {
  try {
    switch (format) {
      case 'pct1':
        return new Intl.NumberFormat(locale, {
          style: 'percent',
          minimumFractionDigits: 1,
          maximumFractionDigits: 1,
        }).format(value / 100);
      case 'sec1': {
        const n = new Intl.NumberFormat(locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(value);
        return locale.toLowerCase().startsWith('fr') ? `${n} s` : `${n}s`;
      }
      case 'int':
      default:
        return new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(Math.round(value));
    }
  } catch {
    return value.toLocaleString();
  }
}

export interface ConsoleContext {
  root: HTMLElement;
  /** 0-based loop iteration — lets a keyframe vary (e.g. a failed→retry beat every 3rd loop). */
  loop: number;
  /** Localized dynamic strings parsed from the SSR'd [data-hc-strings] JSON block. */
  strings: Record<string, string>;
}

export interface ConsoleKeyframe {
  /** ms from loop start (strictly ascending). */
  t: number;
  apply: (ctx: ConsoleContext) => void;
}

export interface ConsoleOptions {
  /** Scripted story; omit for consoles that only count up / draw on. */
  keyframes?: ConsoleKeyframe[];
  /** Total loop length; default = last keyframe t + 4000ms rest. */
  loopMs?: number;
  /** Runs once on first scroll-in (after count-ups are kicked off). */
  onFirstView?: (ctx: ConsoleContext) => void;
}

/** Defer setup to idle so it never competes with LCP/first input (NeuralOrb pattern). */
export function scheduleIdle(fn: () => void): void {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => fn(), { timeout: 1500 });
  } else {
    setTimeout(fn, 200);
  }
}

const FREEZE_POLL_MS = 2000;
const COUNT_MS = 1400;
const STAGGER_MS = 60;

export function initConsole(root: HTMLElement, opts: ConsoleOptions = {}): void {
  if (root.dataset.hcInit) return; // idempotent across page-load + readyState paths
  root.dataset.hcInit = '1';
  if (motionOff()) return;

  const ac = new AbortController();
  const { signal } = ac;
  const timers = new Set<number>();
  const wait = (ms: number, fn: () => void): void => {
    const id = window.setTimeout(() => {
      timers.delete(id);
      fn();
    }, ms);
    timers.add(id);
  };

  let onScreen = false;
  let seen = false;
  const active = () => onScreen && !document.hidden;

  // Localized dynamic strings (SSR'd through t(); the script stays locale-blind).
  let strings: Record<string, string> = {};
  const stringsEl = root.querySelector('[data-hc-strings]');
  if (stringsEl?.textContent) {
    try {
      strings = JSON.parse(stringsEl.textContent);
    } catch {
      /* malformed → dynamic copy falls back to baseline text */
    }
  }

  // Drift-proof loop: snapshot every mutable stage once, restore each iteration.
  const stages = [...root.querySelectorAll<HTMLElement>('[data-hc-stage]')];
  const baseline = stages.map((s) => s.innerHTML);
  const resetStages = () => stages.forEach((s, i) => (s.innerHTML = baseline[i]));

  // Arm JS-gated draw-on states (default CSS = fully drawn, so no-JS/RM users
  // always see the complete picture; only armed consoles start "undrawn").
  root.classList.add('hc-armed');

  // ── Count-ups + live tick ────────────────────────────────────────────────
  const lang = document.documentElement.lang || 'en';

  const armTick = (el: HTMLElement, start: number) => {
    const min = Number(el.dataset.hcTickMin ?? 6000);
    const max = Number(el.dataset.hcTickMax ?? 10000);
    let current = start;
    const hop = () => {
      wait(min + Math.random() * (max - min), () => {
        if (active()) {
          current += Math.random() < 0.25 ? 2 : 1;
          el.textContent = formatValue(current, el.dataset.hcFormat ?? 'int', lang);
        }
        hop(); // freeze-friendly: skipped increments are simply never made up
      });
    };
    hop();
  };

  const countUp = (el: HTMLElement, delay: number) => {
    const target = parseFloat(el.dataset.hcCount ?? '');
    if (!Number.isFinite(target)) return;
    const format = el.dataset.hcFormat ?? 'int';
    wait(delay, () => {
      const t0 = performance.now();
      const frame = (now: number) => {
        const p = Math.min((now - t0) / COUNT_MS, 1);
        el.textContent = formatValue(target * easeOutQuart(p), format, lang);
        if (p < 1 && !signal.aborted) requestAnimationFrame(frame);
        else if (p >= 1 && 'hcTick' in el.dataset) armTick(el, target);
      };
      requestAnimationFrame(frame);
    });
  };

  const runCountUps = () => {
    root.querySelectorAll<HTMLElement>('[data-hc-count]').forEach((el, i) => countUp(el, i * STAGGER_MS));
  };

  // ── Keyframe driver (freeze, never skip) ─────────────────────────────────
  const kfs = opts.keyframes ?? [];
  const loopMs = opts.loopMs ?? (kfs.length ? kfs[kfs.length - 1].t + 4000 : 0);
  let loop = 0;
  const ctx = (): ConsoleContext => ({ root, loop, strings });

  const runFrom = (i: number) => {
    const prevT = i === 0 ? 0 : kfs[i - 1].t;
    const isReset = i === kfs.length;
    const targetT = isReset ? loopMs : kfs[i].t;
    wait(Math.max(0, targetT - prevT), function fire() {
      if (!active()) {
        wait(FREEZE_POLL_MS, fire);
        return;
      }
      if (isReset) {
        // 300ms fade → restore snapshot → fade back → next iteration.
        stages.forEach((s) => s.classList.add('hc-fading'));
        wait(320, () => {
          resetStages();
          loop += 1;
          stages.forEach((s) => s.classList.remove('hc-fading'));
          runFrom(0);
        });
      } else {
        kfs[i].apply(ctx());
        runFrom(i + 1);
      }
    });
  };

  // ── Visibility plumbing ──────────────────────────────────────────────────
  const io = new IntersectionObserver(
    (entries) => {
      onScreen = entries[0]?.isIntersecting ?? false;
      if (onScreen && !seen) {
        seen = true;
        root.classList.add('hc-live'); // triggers CSS draw-on transitions
        runCountUps();
        opts.onFirstView?.(ctx());
        if (kfs.length) runFrom(0);
      }
    },
    // Low threshold so the story still fires when a tall (reflowed mobile)
    // console can never reach 35% visibility in a short viewport.
    { threshold: 0.15 },
  );
  io.observe(root);

  document.addEventListener('visibilitychange', () => void 0, { signal }); // active() reads document.hidden live

  document.addEventListener(
    'astro:before-swap',
    () => {
      ac.abort();
      io.disconnect();
      timers.forEach((id) => clearTimeout(id));
      timers.clear();
    },
    { once: true },
  );
}

// ── DOM micro-helpers for keyframe apply() functions ───────────────────────

/** Update a run row's slots + status dot; optional flash accent on the row. */
export function setRun(
  root: HTMLElement,
  run: string,
  patch: { sub?: string; meta?: string; dot?: 'success' | 'accent' | 'warning'; flash?: boolean },
): void {
  const row = root.querySelector<HTMLElement>(`[data-run="${run}"]`);
  if (!row) return;
  if (patch.sub !== undefined) {
    const el = row.querySelector('[data-slot="sub"]');
    if (el) el.textContent = patch.sub;
  }
  if (patch.meta !== undefined) {
    const el = row.querySelector('[data-slot="meta"]');
    if (el) el.textContent = patch.meta;
  }
  if (patch.dot) {
    const dot = row.querySelector('[data-slot="dot"]');
    if (dot) {
      dot.classList.remove('hc-dot--success', 'hc-dot--accent', 'hc-dot--warning');
      dot.classList.add(`hc-dot--${patch.dot}`);
    }
  }
  if (patch.flash) {
    row.classList.remove('hc-flash');
    // restart the flash animation reliably
    void row.offsetWidth;
    row.classList.add('hc-flash');
  }
}

/** Insert a templated row at the top of the run list; drop the last row. */
export function rotateRunList(root: HTMLElement, templateName: string): void {
  const list = root.querySelector<HTMLElement>('[data-hc-runlist]');
  const tpl = root.querySelector<HTMLTemplateElement>(`template[data-hc-template="${templateName}"]`);
  if (!list || !tpl) return;
  const node = tpl.content.firstElementChild?.cloneNode(true) as HTMLElement | null;
  if (!node) return;
  node.classList.add('hc-enter');
  list.prepend(node);
  requestAnimationFrame(() => requestAnimationFrame(() => node.classList.remove('hc-enter')));
  const rows = list.querySelectorAll('[data-run]');
  if (rows.length > 3) {
    const last = rows[rows.length - 1] as HTMLElement;
    last.classList.add('hc-exit');
    setTimeout(() => last.remove(), 500);
  }
}

/** Move the workflow stepper to step n (fill + node states). */
export function setStep(root: HTMLElement, n: number): void {
  const stepper = root.querySelector<HTMLElement>('[data-hc-stepper]');
  if (!stepper) return;
  stepper.className = stepper.className.replace(/\bhc-step-\d\b/g, '').trim();
  stepper.classList.add(`hc-step-${n}`);
}
