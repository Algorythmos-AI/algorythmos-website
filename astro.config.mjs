// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import llmsFull from './scripts/llms-full-integration.mjs';

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
    }),
    llmsFull(),
  ],
});
