/**
 * Build-time Open Graph cards (1200×630) — one PNG per entry in the shared
 * `ogPages` map (src/seo/ogPages.ts). SEO.astro reads the same map to decide
 * which pages point at a card, so the two sides can never drift. Self-hosted
 * Inter, theme-neutral dark brand treatment. astro-og-canvas caches across
 * builds (./node_modules/.astro-og-canvas).
 */
import { OGImageRoute } from 'astro-og-canvas';
import { ogPages, type OGPage } from '@/seo/ogPages';

export const { getStaticPaths, GET } = await OGImageRoute({
  param: 'route',
  pages: ogPages,
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
