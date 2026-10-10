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

/**
 * Has the answer changed? Pure so the settle logic is unit-testable: returns the
 * new state when it differs from `last`, otherwise null.
 */
export function motionTransition(last: boolean, now: boolean): boolean | null {
  return now === last ? null : now;
}

/**
 * Call `cb` when motion is switched off (or back on) mid-session, by the pause
 * toggle or the OS setting. A running rAF loop reads `motionOff()` once at init,
 * so without this the pause button would not reach it until the next page load.
 *
 * The check is deferred one task: a view-transition swap strips `data-motion`
 * from <html> and BaseLayout restores it on `astro:after-swap`, an await later.
 * Reading inside the observer callback would report a pause being lifted and
 * re-applied on every navigation.
 *
 * Returns an unsubscribe; page-scoped callers run it on `astro:before-swap`.
 */
export function onMotionChange(cb: (off: boolean) => void): () => void {
  if (typeof window === 'undefined') return () => {};
  let last = motionOff();
  let timer = 0;
  const settle = () => {
    timer = 0;
    const next = motionTransition(last, motionOff());
    if (next === null) return;
    last = next;
    cb(next);
  };
  const schedule = () => {
    if (!timer) timer = window.setTimeout(settle, 0);
  };
  const mo = new MutationObserver(schedule);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-motion'] });
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  mq.addEventListener('change', schedule);
  return () => {
    window.clearTimeout(timer);
    mo.disconnect();
    mq.removeEventListener('change', schedule);
  };
}
