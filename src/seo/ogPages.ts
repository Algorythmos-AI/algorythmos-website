/**
 * The single map of every build-time Open Graph card (1200×630), keyed by
 * `ogKey(localizedPath)`. Consumed by BOTH sides so they can never drift:
 *  - `src/pages/og/[...route].ts` renders one PNG per entry
 *  - `src/components/seo/SEO.astro` defaults a page's og:image to its card
 *    when an entry exists (brand fallback /Algorythmos.png otherwise)
 */
import { LOCALES, useTranslations, localizePath, type Locale } from '@/i18n';
import { blog } from '@/data/blog';
import { caseStudies } from '@/data/caseStudies';
import { services } from '@/data/services';
import { ogKey } from '@/seo/schema';

export interface OGPage {
  title: string;
  description: string;
}

const SERVICE_NS: Record<string, string> = {
  'agentic-automation': 'serviceAgentic',
  'document-intelligence': 'serviceDocument',
  'mlops-cicd': 'serviceMlops',
  'sql-dashboards': 'serviceSqlDashboards',
  'ai-websites': 'serviceAiWebsites',
};

/** Home cards keep the hand-tuned regional positioning lines. */
const HOME_TITLES: Record<Locale, string> = {
  en: 'Algorythmos — AI consultancy for SMEs in Sydney & Paris',
  'au-en': 'Algorythmos Australia — AI consultancy for Australian SMEs',
  'fr-fr': 'Algorythmos France — Cabinet de conseil en IA pour PME & ETI',
};

/** Brand pages: path + the i18n keys their <head> already uses. */
const BRAND_PAGES: { path: string; titleKey: string; descKey: string }[] = [
  { path: '/about', titleKey: 'about.meta.title', descKey: 'about.meta.description' },
  { path: '/pricing', titleKey: 'pricing.meta.title', descKey: 'pricing.meta.description' },
  { path: '/contact', titleKey: 'contactPage.meta.title', descKey: 'contactPage.meta.description' },
  { path: '/services', titleKey: 'services.meta.title', descKey: 'services.meta.description' },
  { path: '/blog', titleKey: 'blog.meta.title', descKey: 'blog.meta.description' },
  { path: '/case-studies', titleKey: 'caseStudies.meta.title', descKey: 'caseStudies.meta.description' },
];

function buildPages(): Record<string, OGPage> {
  const pages: Record<string, OGPage> = {};

  for (const loc of LOCALES) {
    const t = useTranslations(loc);

    pages[ogKey(localizePath(loc, '/'))] = {
      title: HOME_TITLES[loc],
      description: t('hero.subtitle'),
    };

    for (const { path, titleKey, descKey } of BRAND_PAGES) {
      pages[ogKey(localizePath(loc, path))] = { title: t(titleKey), description: t(descKey) };
    }

    for (const post of blog) {
      pages[ogKey(localizePath(loc, `/blog/${post.slug}`))] = {
        title: t(`blogDetail.posts.${post.slug}.title`),
        description: t(`blogDetail.posts.${post.slug}.meta`),
      };
    }

    for (const cs of caseStudies) {
      pages[ogKey(localizePath(loc, `/case-studies/${cs.slug}`))] = {
        title: cs.inline ? cs.inline.title : t(`caseStudyDetail.studies.${cs.slug}.title`),
        description: cs.inline ? cs.inline.meta : t(`caseStudyDetail.studies.${cs.slug}.meta`),
      };
    }

    // Service cards use the localized meta copy (falls back to catalogue EN when
    // a dictionary key is missing — t() returns the key string on a miss).
    for (const s of services) {
      const ns = SERVICE_NS[s.slug];
      const metaTitle = ns ? t(`${ns}.meta.title`) : '';
      const heroSubtitle = ns ? t(`${ns}.hero.subtitle`) : '';
      pages[ogKey(localizePath(loc, `/services/${s.slug}`))] = {
        title: metaTitle && metaTitle !== `${ns}.meta.title` ? metaTitle : s.name,
        description: heroSubtitle && heroSubtitle !== `${ns}.hero.subtitle` ? heroSubtitle : s.tagline,
      };
    }
  }

  // Single-locale local landing pages (one card each, matching their standalone routes).
  pages[ogKey(localizePath('au-en', '/ai-consultancy-sydney'))] = {
    title: 'AI Consultancy in Sydney',
    description: 'Production-grade AI for Sydney businesses — senior engineers, outcomes in weeks.',
  };
  pages[ogKey(localizePath('fr-fr', '/conseil-en-ia-paris'))] = {
    title: 'Conseil en IA à Paris',
    description: 'Une IA concrète et prête pour la production, pour les PME et ETI parisiennes.',
  };

  return pages;
}

export const ogPages = buildPages();

/** True when a per-page OG card is generated for this localized path. */
export const hasOgCard = (localizedPath: string): boolean => ogKey(localizedPath) in ogPages;
