/**
 * Announcement bar campaign config — one place to change what the strip promotes.
 *
 * `id` scopes dismissal: bump it when launching a new campaign so previously
 * dismissed visitors see the new message. Copy lives in i18n (announce.*).
 * Set `enabled: false` to remove the bar site-wide without touching layout.
 */
export const announcement = {
  id: 'mining-report-2026-10',
  enabled: true,
  /** Region-relative path, localized at render time via localizePath(). */
  href: '/case-studies/ai-in-mining-mbsc',
} as const;
