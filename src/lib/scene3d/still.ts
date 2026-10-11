/**
 * scene3d still — paints a scene's captured picture into its mount.
 *
 * Fetched by bootstrap.ts only when a page has a poster canvas to paint. It must
 * never import three: it is what a visitor without the engine sees.
 */
import { scheduleIdle } from '@/lib/idle';

/** Resolve once the page has finished loading, so the picture never competes with it. */
function pageLoaded(signal: AbortSignal): Promise<void> {
  if (document.readyState === 'complete') return Promise.resolve();
  return new Promise((resolve) => window.addEventListener('load', () => resolve(), { once: true, signal }));
}

/**
 * Paint the captured still into the mount's poster canvas, for whoever is not
 * getting the live scene (or not yet). Waits for the page to finish loading so
 * the image never competes with it, picks the size for this mount and the theme
 * in force, and repaints when either changes.
 */
export function paintStill(mount: HTMLElement, signal: AbortSignal): void {
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
