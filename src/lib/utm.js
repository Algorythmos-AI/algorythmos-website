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

const STORE_KEY = "algorythmos_utm";
const LAST_CTA_KEY = "algorythmos_last_cta";

/** Extract UTM-like params from URLSearchParams. */
export function pickTrackingParams(searchParams) {
  const obj = {};
  UTM_KEYS.forEach((k) => {
    const v = searchParams.get(k);
    if (v != null && v !== "") obj[k] = v;
  });
  return obj;
}

/** Persist UTMs for the current session if present in location. */
export function persistUtmFromLocation() {
  if (typeof window === "undefined") return;
  try {
    const params = new URLSearchParams(window.location.search);
    const found = pickTrackingParams(params);
    if (Object.keys(found).length) {
      sessionStorage.setItem(STORE_KEY, JSON.stringify(found));
    }
  } catch {}
}

/** Read stored UTMs. */
export function readStoredUtm() {
  if (typeof window === "undefined") return {};
  try {
    const raw = sessionStorage.getItem(STORE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

/** Record the last clicked CTA name (e.g., "sticky_cta", "operations_cta"). */
export function recordLastCta(name) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(
      LAST_CTA_KEY,
      JSON.stringify({ id: String(name), ts: Date.now() })
    );
  } catch {}
}

/** Read the last clicked CTA name, if any. */
export function readLastCta() {
  if (typeof window === "undefined") return undefined;
  try {
    const raw = sessionStorage.getItem(LAST_CTA_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    return parsed?.id;
  } catch {
    return undefined;
  }
}

/**
 * Append params to URL preserving existing query params.
 * Priority: existing params -> stored UTMs -> explicit overrides.
 */
export function withUtm(href, overrides = {}) {
  try {
    const base =
      typeof window !== "undefined" ? window.location.origin : "https://example.com";
    const url = new URL(href, base);

    const existing = new Set();
    url.searchParams.forEach((_, k) => existing.add(k));

    const stored = readStoredUtm();
    Object.entries(stored).forEach(([k, v]) => {
      if (!existing.has(k) && v != null && v !== "") {
        url.searchParams.set(k, String(v));
        existing.add(k);
      }
    });

    Object.entries(overrides).forEach(([k, v]) => {
      if (v != null && v !== "") {
        url.searchParams.set(k, String(v));
        existing.add(k);
      }
    });

    const origin =
      typeof window !== "undefined" ? window.location.origin : "https://example.com";
    return url.toString().startsWith(origin)
      ? url.toString().replace(origin, "")
      : url.toString();
  } catch {
    return href;
  }
}

/**
 * Build a normalized UTM object for forms.
 * Priority for utm_content: stored.utm_content -> lastClickedCTA -> "unknown"
 */
export function buildFormUtm(defaults = {}) {
  const stored = readStoredUtm();
  const lastCta = readLastCta();
  const merged = {
    utm_source: stored.utm_source ?? defaults.utm_source ?? "website",
    utm_medium: stored.utm_medium ?? defaults.utm_medium ?? "form",
    utm_campaign: stored.utm_campaign ?? defaults.utm_campaign ?? "discovery",
    utm_term: stored.utm_term ?? defaults.utm_term ?? "",
    // content priority: stored utm_content > last clicked CTA > default > unknown
    utm_content:
      stored.utm_content ??
      defaults.utm_content ??
      lastCta ??
      "unknown",
    gclid: stored.gclid ?? defaults.gclid ?? "",
    fbclid: stored.fbclid ?? defaults.fbclid ?? "",
  };
  return merged;
}
