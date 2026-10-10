/**
 * Defer setup to idle so it never competes with LCP/first input (NeuralOrb pattern).
 * Lives on its own so a page without a console doesn't pull consoleLoop in for it.
 */
export function scheduleIdle(fn: () => void): void {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => fn(), { timeout: 1500 });
  } else {
    setTimeout(fn, 200);
  }
}
