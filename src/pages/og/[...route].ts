/**
 * Build-time Open Graph cards (1200×630) for content pages.
 *
 * One image per (locale, content item) at `/og/<localized-path>.png`, so the
 * key matches `ogImageUrl()` referenced by each page's <head>. Covers blog
 * posts, case studies, and services across all locales; brand pages keep the
 * static `/Algorythmos.png` card. Self-hosted Inter, theme-neutral dark brand
 * treatment. astro-og-canvas caches across builds (./node_modules/.astro-og-canvas).
 */
import { OGImageRoute } from 'astro-og-canvas';
import { LOCALES, useTranslations, localizePath } from '@/i18n';
import { blog } from '@/data/blog';
import { caseStudies } from '@/data/caseStudies';
import { services } from '@/data/services';
import { ogKey } from '@/seo/schema';

interface OGPage {
  title: string;
  description: string;
}

const pages: Record<string, OGPage> = {};

for (const loc of LOCALES) {
  const t = useTranslations(loc);

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

  // Service catalogue copy is authored EN-only, so the card is the same per locale.
  for (const s of services) {
    pages[ogKey(localizePath(loc, `/services/${s.slug}`))] = {
      title: s.name,
      description: s.tagline,
    };
  }
}

export const { getStaticPaths, GET } = await OGImageRoute({
  param: 'route',
  pages,
  getImageOptions: (_path, page: OGPage) => ({
    title: page.title,
    description: page.description,
    bgGradient: [
      [8, 9, 13],
      [22, 17, 42],
    ],
    border: { color: [139, 92, 246], width: 16, side: 'inline-start' },
    padding: 72,
    font: {
      title: { color: [244, 244, 248], size: 60, weight: 'SemiBold', families: ['Inter'], lineHeight: 1.15 },
      description: { color: [158, 158, 178], size: 29, families: ['Inter'], lineHeight: 1.4 },
    },
    fonts: ['./src/assets/og/font-regular.ttf', './src/assets/og/font-bold.ttf'],
    format: 'PNG',
  }),
});
