/**
 * Read a colour token off the live theme, for canvases that can't use CSS.
 *
 * Tokens in themes.css are space-separated RGB channels (`--brand: 167 139 250`)
 * so Tailwind can append an alpha. Re-read on a `data-theme` mutation to follow
 * the theme toggle.
 */
export interface RGB {
  r: number;
  g: number;
  b: number;
}

/** Parse a channel triplet ("167 139 250" or "167, 139, 250"); null when it isn't one. */
export function parseChannels(value: string): RGB | null {
  const parts = value.trim().split(/[\s,]+/).map(Number);
  if (parts.length >= 3 && parts.every((n) => Number.isFinite(n))) {
    return { r: parts[0], g: parts[1], b: parts[2] };
  }
  return null;
}

export function readToken(name: string, fallback: RGB): RGB {
  return parseChannels(getComputedStyle(document.documentElement).getPropertyValue(name)) ?? fallback;
}
