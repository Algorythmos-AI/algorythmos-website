/**
 * Build-time i18n core (pure, framework-agnostic).
 *
 * Ports the legacy React-context `t()` to a stateless function usable in `.astro`
 * frontmatter (build-time → zero client JS) and passable to islands as a prop.
 * Contract preserved exactly: flat dot keys, `{var}` interpolation, missing → key,
 * region merge `{...enGlobal, ...regionOverride}` (FR/AU inherit EN global as fallback).
 */
import enGlobalRaw from './ui/en.global.json';
import enAuRaw from './ui/en.au.json';
import frFrRaw from './ui/fr.fr.json';

const enGlobal = enGlobalRaw as Record<string, string>;
const enAu = enAuRaw as Record<string, string>;
const frFr = frFrRaw as Record<string, string>;

/** URL/path locale codes (match astro.config `i18n.locales`). */
export type Locale = 'en' | 'au-en' | 'fr-fr';
/** Internal region codes (match legacy REGIONS / SEO config). */
export type Region = 'GLOBAL' | 'AU' | 'FR';

export const DEFAULT_LOCALE: Locale = 'en';
export const LOCALES: readonly Locale[] = ['en', 'au-en', 'fr-fr'] as const;
/** Locales that carry a URL prefix (everything except the default). */
export const PREFIXED_LOCALES: readonly Exclude<Locale, 'en'>[] = ['au-en', 'fr-fr'] as const;

export interface RegionMeta {
  code: Region;
  /** og:locale value */
  ogLocale: string;
  /** <html lang> value */
  lang: string;
  /** URL prefix ('' for default) */
  prefix: string;
  /** BCP-47 hreflang */
  hreflang: string;
  /** also emit as hreflang="x-default" */
  xDefault: boolean;
  flag: string;
  /** i18n key for the region's display name */
  labelKey: string;
}

export const REGIONS: Record<Locale, RegionMeta> = {
  en: { code: 'GLOBAL', ogLocale: 'en_US', lang: 'en', prefix: '', hreflang: 'en', xDefault: true, flag: '🌐', labelKey: 'region.global' },
  'au-en': { code: 'AU', ogLocale: 'en_AU', lang: 'en-AU', prefix: '/au-en', hreflang: 'en-AU', xDefault: false, flag: '🇦🇺', labelKey: 'region.au' },
  'fr-fr': { code: 'FR', ogLocale: 'fr_FR', lang: 'fr-FR', prefix: '/fr-fr', hreflang: 'fr-FR', xDefault: false, flag: '🇫🇷', labelKey: 'region.fr' },
};

const DICTS: Record<Locale, Record<string, string>> = {
  en: enGlobal,
  'au-en': { ...enGlobal, ...enAu },
  'fr-fr': { ...enGlobal, ...frFr },
};

/** Coerce any string to a known Locale (fallback to default). */
export function asLocale(value: string | undefined): Locale {
  return (LOCALES as readonly string[]).includes(value ?? '') ? (value as Locale) : DEFAULT_LOCALE;
}

export function getDict(locale: Locale): Record<string, string> {
  return DICTS[locale] ?? enGlobal;
}

export type TFunction = (key: string, params?: Record<string, string | number>) => string;

/**
 * Returns a `t(key, params?)` bound to a locale. Use in `.astro` frontmatter,
 * or pass the resolved strings (not `t`) to client islands.
 */
export function useTranslations(locale: Locale): TFunction {
  const dict = getDict(locale);
  return (key, params = {}) => {
    let text = dict[key] ?? key;
    for (const k of Object.keys(params)) {
      text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), String(params[k]));
    }
    return text;
  };
}

/** Pick a scoped subset of keys to hand to an island (keeps client bundles lean). */
export function pickMessages(locale: Locale, keys: readonly string[]): Record<string, string> {
  const t = useTranslations(locale);
  return Object.fromEntries(keys.map((k) => [k, t(k)]));
}

export function localeToRegion(locale: Locale): Region {
  return REGIONS[locale].code;
}

/**
 * Build a locale-prefixed path (replaces legacy getRegionPath/withRegionPath;
 * fixes the missing AU prefix). `localizePath('au-en','/services') → '/au-en/services'`.
 */
export function localizePath(locale: Locale, path: string): string {
  const prefix = REGIONS[locale].prefix;
  const clean = path === '' || path === '/' ? '' : path.startsWith('/') ? path : `/${path}`;
  const out = `${prefix}${clean}`.replace(/\/{2,}/g, '/');
  return out === '' ? '/' : out;
}

/** Split a pathname into its locale + the region-relative remainder. */
export function stripLocale(pathname: string): { locale: Locale; rest: string } {
  for (const loc of PREFIXED_LOCALES) {
    const prefix = REGIONS[loc].prefix;
    if (pathname === prefix || pathname.startsWith(`${prefix}/`)) {
      return { locale: loc, rest: pathname.slice(prefix.length) || '/' };
    }
  }
  return { locale: 'en', rest: pathname || '/' };
}
