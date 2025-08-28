// src/lib/analytics.js
export function track(event, props = {}) {
  // No-op stub: replace with GA/Amplitude/Mixpanel later
  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.debug("[analytics]", event, props);
  }
  // window.gtag?.('event', event, props);
  // window.amplitude?.track(event, props);
}
