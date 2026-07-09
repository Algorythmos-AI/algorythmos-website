// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import llmsFull from './scripts/llms-full-integration.mjs';

// Page-path → on-page content visuals, for <image:image> sitemap entries.
const VIS = 'https://algorythmos.com/assets/visuals';
const PHOTOS = 'https://algorythmos.com/assets/photos';
/** @type {Record<string, string>} */
const SERVICE_VISUAL = {
  'agentic-automation': 'service-agentic-automation.svg',
  'document-intelligence': 'service-document-intelligence.svg',
  'sql-dashboards': 'service-sql-dashboards.svg',
  'mlops-cicd': 'service-mlops-cicd.svg',
  'ai-websites': 'service-ai-websites.svg',
};
/**
 * @param {string} pathname
 * @returns {{ url: string, caption: string }[]}
 */
function pageImages(pathname) {
  const p = pathname.replace(/\/$/, '');
  /** @type {{ url: string, caption: string }[]} */
  const imgs = [];
  if (p === '' || p === '/au-en' || p === '/fr-fr') {
    imgs.push({ url: `${VIS}/home-hero-ai-console.svg`, caption: 'Algorythmos AI console — agentic automation and a live analytics dashboard' });
    imgs.push({ url: `${PHOTOS}/team-collaboration-1600.webp`, caption: 'Algorythmos engineers collaborating during an AI delivery sprint' });
  }
  const svc = p.match(/\/services\/([a-z-]+)$/);
  if (svc && SERVICE_VISUAL[svc[1]]) {
    imgs.push({ url: `${VIS}/${SERVICE_VISUAL[svc[1]]}`, caption: `Algorythmos ${svc[1].replace(/-/g, ' ')} product interface` });
  }
  if (p.endsWith('/ai-consultancy-sydney')) {
    imgs.push({ url: `${VIS}/city-sydney.svg`, caption: 'AI consultancy in Sydney, Australia' });
    imgs.push({ url: `${PHOTOS}/sydney-scene-1600.webp`, caption: 'Sydney Circular Quay — Opera House, ferries and CBD skyline' });
  }
  if (p.endsWith('/conseil-en-ia-paris')) {
    imgs.push({ url: `${VIS}/city-paris.svg`, caption: 'Conseil en IA à Paris, France' });
    imgs.push({ url: `${PHOTOS}/paris-scene-1600.webp`, caption: 'La tour Eiffel au-dessus de la Seine, Paris' });
  }
  if (p.endsWith('/about')) imgs.push({ url: `${PHOTOS}/whiteboard-session-1600.webp`, caption: 'Algorythmos engineers pair-programming' });
  if (p.endsWith('/contact')) {
    imgs.push({ url: `${VIS}/city-sydney.svg`, caption: 'Sydney, Australia' }, { url: `${VIS}/city-paris.svg`, caption: 'Paris, France' });
  }
  return imgs;
}

// Astro 6 — static-first world-class rebuild.
// Pure static output (no adapter): forms use a Vercel serverless function at /api/contact,
// which keeps the build adapter-free (and avoids that adapter's transitive advisories).
export default defineConfig({
  site: 'https://algorythmos.com',
  trailingSlash: 'never',
  prefetch: { defaultStrategy: 'hover' },
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'au-en', 'fr-fr'],
    routing: { prefixDefaultLocale: false },
  },
  integrations: [
    react(),
    sitemap({
      i18n: {
        defaultLocale: 'en',
        locales: { en: 'en', 'au-en': 'en-AU', 'fr-fr': 'fr-FR' },
      },
      serialize(item) {
        try {
          const imgs = pageImages(new URL(item.url).pathname);
          // `img` is forwarded to the underlying sitemap serializer at runtime (produces
          // <image:image>); it isn't in @astrojs/sitemap's SitemapItem type, so cast.
          if (imgs.length) /** @type {any} */ (item).img = imgs;
        } catch {
          /* leave item unchanged */
        }
        return item;
      },
    }),
    llmsFull(),
  ],
});
