// src/lib/utm.js

const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "gclid",
  "fbclid",
];

/**
 * Extract UTM-like params from a URLSearchParams.
 */
export function pickTrackingParams(searchParams) {
  const obj = {};
  UTM_KEYS.forEach((k) => {
    const v = searchParams.get(k);
    if (v != null && v !== "") obj[k] = v;
  });
  return obj;
}

/**
 * Persist UTMs for the current session if present in location.
 * Call once on app/page load.
 */
export function persistUtmFromLocation() {
  if (typeof window === "undefined") return;
  try {
    const params = new URLSearchParams(window.location.search);
    const found = pickTrackingParams(params);
    if (Object.keys(found).length) {
      sessionStorage.setItem("algorythmos_utm", JSON.stringify(found));
    }
  } catch {
    // ignore
  }
}

/**
 * Read stored UTMs.
 */
export function readStoredUtm() {
  if (typeof window === "undefined") return {};
  try {
    const raw = sessionStorage.getItem("algorythmos_utm");
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

/**
 * Append UTM parameters to a URL while preserving existing query params.
 * Priority order (lowest -> highest):
 *   1) existing URL params
 *   2) stored session UTMs
 *   3) explicit overrides (fn argument)
 * Explicit overrides win; we never double-set a key.
 */
export function withUtm(href, overrides = {}) {
  try {
    const base = typeof window !== "undefined" ? window.location.origin : "https://example.com";
    const url = new URL(href, base);

    // 1) existing params already on URL (leave as-is)
    const existing = new Set();
    url.searchParams.forEach((_, k) => existing.add(k));

    // 2) merge stored UTMs if not present
    const stored = readStoredUtm();
    Object.entries(stored).forEach(([k, v]) => {
      if (!existing.has(k) && v != null && v !== "") {
        url.searchParams.set(k, String(v));
        existing.add(k);
      }
    });

    // 3) apply explicit overrides last
    Object.entries(overrides).forEach(([k, v]) => {
      if (v != null && v !== "") {
        url.searchParams.set(k, String(v));
        existing.add(k);
      }
    });

    // Return relative if same-origin to avoid SSR hydration diffs
    const origin = typeof window !== "undefined" ? window.location.origin : "https://example.com";
    return url.toString().startsWith(origin)
      ? url.toString().replace(origin, "")
      : url.toString();
  } catch {
    return href;
  }
}
