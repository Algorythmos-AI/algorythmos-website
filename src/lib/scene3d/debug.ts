/**
 * scene3d debug readout — `?scene-debug` on any page.
 *
 * A phone has no developer tools, and "the sphere is frozen" has a dozen
 * possible causes (tier.ts, bootstrap.ts). This prints which one applies, on the
 * page itself, so a screenshot answers the question.
 *
 * Fetched only when the query flag is present (bootstrap.ts), never on a normal
 * visit. It reads state and draws a box; it changes nothing about how the page
 * behaves. Diagnostic labels, not site copy: not translated, hidden from
 * assistive technology, and it must never import three.
 */

/** Everything the readout shows. Gathered by `snapshot()`, formatted by `describe()`. */
export interface Snapshot {
  /** `data-scene-plan` — trigger:tier:reason. Absent on a page without a scene. */
  plan?: string;
  state?: string;
  step?: string;
  fail?: string;
  error?: string;
  /** Frames per second over the last sample, or null when nothing is drawing. */
  sceneFps: number | null;
  /** The home hero's 2D orb: undefined on pages without one. */
  orbState?: string;
  orbStatic?: string;
  orbFps: number | null;
  /** WebGL2 probes on a throwaway canvas: with the caveat check the site uses, and without. */
  webgl2: boolean;
  webgl2Strict: boolean;
  renderer: string;
  osReducedMotion: boolean;
  storedPause: boolean;
  moreContrast: boolean;
  forcedColors: boolean;
  saveData: boolean | undefined;
  connection: string | undefined;
  deviceMemory: number | undefined;
  coarsePointer: boolean;
  hover: boolean;
  width: number;
  height: number;
  pixelRatio: number;
  hidden: boolean;
  gaveUp: boolean;
  /** Milliseconds from the start of the scene's run to each mark the loader leaves. */
  marks: Record<string, number>;
  userAgent: string;
}

const yn = (value: boolean): string => (value ? 'yes' : 'no');
const fps = (value: number | null): string => (value === null ? 'not drawing' : `${value} fps`);

/** The readout's lines. Pure, so the wording a screenshot will carry is unit-tested. */
export function describe(s: Snapshot): string[] {
  const lines: string[] = [];
  if (s.plan === undefined) lines.push('scene   none on this page');
  else {
    lines.push(`plan    ${s.plan}`);
    lines.push(`state   ${s.state ?? '?'}  step ${s.step ?? '-'}  ${fps(s.sceneFps)}`);
    if (s.fail) lines.push(`fail    ${s.fail}${s.error ? ` (${s.error})` : ''}`);
  }
  if (s.orbState !== undefined) {
    lines.push(`orb     ${s.orbState}${s.orbStatic ? ` (${s.orbStatic})` : ''}  ${fps(s.orbFps)}`);
  }
  lines.push(`webgl2  ${yn(s.webgl2)}  strict ${yn(s.webgl2Strict)}  ${s.renderer || 'renderer hidden'}`);
  lines.push(`motion  os-reduce ${yn(s.osReducedMotion)}  paused ${yn(s.storedPause)}  gave-up ${yn(s.gaveUp)}`);
  lines.push(`a11y    contrast ${yn(s.moreContrast)}  forced-colors ${yn(s.forcedColors)}`);
  lines.push(`net     save-data ${s.saveData === undefined ? '?' : yn(s.saveData)}  type ${s.connection ?? '?'}  memory ${s.deviceMemory ?? '?'}`);
  lines.push(`input   coarse ${yn(s.coarsePointer)}  hover ${yn(s.hover)}  tab-hidden ${yn(s.hidden)}`);
  lines.push(`view    ${s.width}x${s.height} @${s.pixelRatio}`);
  const marks = Object.entries(s.marks);
  if (marks.length) lines.push(`marks   ${marks.map(([name, ms]) => `${name} ${ms}`).join('  ')}`);
  lines.push(s.userAgent);
  return lines;
}

/** Frames per second between two readings of a frame counter. */
export function rate(before: number | null, after: number | null, elapsedMs: number): number | null {
  if (before === null || after === null || elapsedMs <= 0 || after <= before) return null;
  return Math.round(((after - before) * 1000) / elapsedMs);
}

interface Probe {
  webgl2: boolean;
  webgl2Strict: boolean;
  renderer: string;
}

/** Ask for a WebGL2 context the way the site does, and without the caveat check; hand both back at once. */
function probeWebgl(): Probe {
  const attempt = (strict: boolean): { ok: boolean; renderer: string } => {
    try {
      const gl = document.createElement('canvas').getContext('webgl2', { failIfMajorPerformanceCaveat: strict });
      if (!gl) return { ok: false, renderer: '' };
      const info = gl.getExtension('WEBGL_debug_renderer_info');
      const renderer = String((info && gl.getParameter(info.UNMASKED_RENDERER_WEBGL)) || gl.getParameter(gl.RENDERER) || '');
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return { ok: true, renderer };
    } catch {
      return { ok: false, renderer: '' };
    }
  };
  const strict = attempt(true);
  const loose = strict.ok ? strict : attempt(false);
  return { webgl2: loose.ok, webgl2Strict: strict.ok, renderer: loose.renderer };
}

function stored(storage: 'localStorage' | 'sessionStorage', key: string): string | null {
  try {
    return window[storage].getItem(key);
  } catch {
    return null;
  }
}

function readMarks(): Record<string, number> {
  const out: Record<string, number> = {};
  const all = performance.getEntriesByType('mark').filter((m) => m.name.startsWith('scene3d:'));
  const start = all.filter((m) => m.name === 'scene3d:start').pop();
  if (!start) return out;
  for (const mark of all) {
    if (mark.name !== 'scene3d:start' && mark.startTime >= start.startTime) {
      out[mark.name.slice('scene3d:'.length)] = Math.round(mark.startTime - start.startTime);
    }
  }
  return out;
}

async function sceneFrames(): Promise<number | null> {
  try {
    return (await window.__scene3dStats?.())?.frames ?? null;
  } catch {
    return null;
  }
}
function orbFrames(): number | null {
  return (window as Window & { __orbFrames?: () => number }).__orbFrames?.() ?? null;
}

const SAMPLE_MS = 1000;
let probe: Probe | null = null;
let timer = 0;

function snapshot(sceneFps: number | null, orbFps: number | null): Snapshot {
  probe ??= probeWebgl();
  const mount = document.querySelector<HTMLElement>('[data-scene]');
  const orb = document.querySelector<HTMLElement>('[data-neural-orb]');
  const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean; effectiveType?: string } };
  const media = (query: string) => window.matchMedia(query).matches;
  return {
    plan: mount?.dataset.scenePlan,
    state: mount?.dataset.sceneState,
    step: mount?.dataset.sceneStep,
    fail: mount?.dataset.sceneFail,
    error: mount?.dataset.sceneError,
    sceneFps,
    orbState: orb?.dataset.orbState,
    orbStatic: orb?.dataset.orbStatic,
    orbFps,
    ...probe,
    osReducedMotion: media('(prefers-reduced-motion: reduce)'),
    storedPause: stored('localStorage', 'motion') === 'off',
    moreContrast: media('(prefers-contrast: more)'),
    forcedColors: media('(forced-colors: active)'),
    saveData: nav.connection?.saveData,
    connection: nav.connection?.effectiveType,
    deviceMemory: nav.deviceMemory,
    coarsePointer: media('(pointer: coarse)'),
    hover: media('(hover: hover)'),
    width: window.innerWidth,
    height: window.innerHeight,
    pixelRatio: Math.round((window.devicePixelRatio || 1) * 100) / 100,
    hidden: document.hidden,
    gaveUp: stored('sessionStorage', 'scene3d-gave-up') === '1',
    marks: readMarks(),
    userAgent: navigator.userAgent,
  };
}

function box(): HTMLElement {
  const existing = document.querySelector<HTMLElement>('[data-scene-debug]');
  if (existing) return existing;
  const el = document.createElement('pre');
  el.dataset.sceneDebug = '';
  el.setAttribute('aria-hidden', 'true');
  /* System colours: legible in either theme without borrowing a themed token. */
  el.style.cssText = [
    'position:fixed',
    'left:0',
    'right:0',
    'bottom:0',
    'z-index:2147483647',
    'margin:0',
    'padding:8px 10px',
    'max-height:55vh',
    'overflow:auto',
    'font:11px/1.45 ui-monospace,Menlo,monospace',
    'white-space:pre-wrap',
    'word-break:break-word',
    'background:Canvas',
    'color:CanvasText',
    'border-top:1px solid CanvasText',
    'pointer-events:none',
  ].join(';');
  document.body.append(el);
  return el;
}

/**
 * Show the readout and keep it current. Safe to call more than once; survives
 * client-side navigation (the router replaces the body, the module lives on).
 */
export function mountDebug(): void {
  if (timer) return;
  let lastScene: number | null = null;
  let lastOrb: number | null = null;
  let lastAt = performance.now();
  const tick = async () => {
    try {
      const scene = await sceneFrames();
      const orb = orbFrames();
      const now = performance.now();
      const text = describe(snapshot(rate(lastScene, scene, now - lastAt), rate(lastOrb, orb, now - lastAt))).join('\n');
      lastScene = scene;
      lastOrb = orb;
      lastAt = now;
      box().textContent = text;
    } catch (error) {
      box().textContent = `scene-debug failed: ${String(error)}`;
    }
  };
  timer = window.setInterval(() => void tick(), SAMPLE_MS);
  void tick();
}
