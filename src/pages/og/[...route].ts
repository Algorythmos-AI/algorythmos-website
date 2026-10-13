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
  pages: ogPages,
  getImageOptions: (_path, page: OGPage) => ({
    /* A finished card is the whole image: no title, description or border is drawn over it. */
    ...(page.card ? { title: '', description: '', bgImage: { path: page.card, fit: 'cover' as const } } : card(page)),
    bgGradient: [
      [8, 9, 13],
      [22, 17, 42],
    ],
    padding: 72,
    fonts: ['./src/assets/og/font-regular.ttf', './src/assets/og/font-bold.ttf'],
    format: 'PNG',
  }),
});

/** The standard card: title and description over the gradient, with optional artwork along the bottom. */
function card(page: OGPage) {
  return {
    title: page.title,
    description: page.description,
    border: { color: [139, 92, 246] as [number, number, number], width: 16, side: 'inline-start' as const },
    /* Cards with artwork keep their text clear of the band along the bottom. */
    ...(page.art ? { bgImage: { path: page.art, fit: 'cover' as const } } : {}),
    font: {
      title: { color: [244, 244, 248] as [number, number, number], size: page.art ? 52 : 60, weight: 'SemiBold' as const, families: ['Inter'], lineHeight: 1.15 },
      description: { color: [158, 158, 178] as [number, number, number], size: page.art ? 27 : 29, families: ['Inter'], lineHeight: 1.4 },
    },
  };
}
