// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

// Astro 6 — static-first world-class rebuild.
// Adapter (@astrojs/vercel) + Actions are added in P0.5 when forms land.
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
    }),
  ],
});
