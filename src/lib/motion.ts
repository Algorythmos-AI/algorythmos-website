/**
 * Single source of truth for "should this page animate?".
 *
 * True when the OS asks for reduced motion OR the visitor pressed the on-page
 * "pause motion" toggle (persisted in localStorage `motion`, mirrored to
 * `<html data-motion="off">` before paint by the no-flash script in BaseLayout).
 * Every animated component checks this instead of matchMedia alone, so one
 * switch stops the orb, the field, the consoles, the belt and the count-ups.
 */
export function motionOff(): boolean {
  if (typeof window === 'undefined') return true;
  if (document.documentElement.dataset.motion === 'off') return true;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
