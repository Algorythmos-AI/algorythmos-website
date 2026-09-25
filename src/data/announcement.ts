/**
 * Announcement bar campaign config — one place to change what the strip promotes.
 *
 * `id` scopes dismissal: bump it when launching a new campaign so previously
 * dismissed visitors see the new message. Copy lives in i18n (announce.*).
 * Set `enabled: false` to remove the bar site-wide without touching layout.
 */
export const announcement = {
  id: 'case-studies-2026-09',
  enabled: true,
  /** Region-relative path, localized at render time via localizePath(). */
  href: '/case-studies/port-botany-ai-ml',
} as const;
