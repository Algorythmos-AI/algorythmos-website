// src/lib/utm.js
/**
 * Append UTM parameters to a URL while preserving existing query params.
 * Only sets a UTM key if it's not already present. Preserves hash.
 * Works with absolute or relative URLs in the browser.
 *
 * @param {string} href - Base URL (absolute or relative)
 * @param {Record<string,string>} params - e.g., { utm_source: 'pricing', ... }
 * @returns {string} URL with UTM parameters appended
 */
export function withUtm(href, params = {}) {
  try {
    // Use document base in browser; fallback for odd environments
    const base = typeof window !== "undefined" ? window.location.origin : "https://example.com";
    const url = new URL(href, base);

    Object.entries(params).forEach(([k, v]) => {
      if (v == null || v === "") return;
      if (!url.searchParams.has(k)) url.searchParams.set(k, String(v));
    });

    // For relative inputs, return a relative URL (strip origin) to avoid SSR mismatches
    const origin = typeof window !== "undefined" ? window.location.origin : "https://example.com";
    return url.toString().startsWith(origin)
      ? url.toString().replace(origin, "")
      : url.toString();
  } catch {
    // On any parsing issue, return original href untouched
    return href;
  }
}
