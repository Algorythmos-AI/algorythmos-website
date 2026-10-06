import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { PDF_ALGO_PRO } from './products';
import { useTranslations } from '@/i18n';

const vercel = JSON.parse(readFileSync(new URL('../../vercel.json', import.meta.url), 'utf8')) as {
  redirects: { source: string; destination: string; permanent?: boolean; has?: unknown }[];
};

describe('PDF Algo Pro product data', () => {
  it('has a short URL for every page, redirecting to the Australian English page', () => {
    for (const path of Object.values(PDF_ALGO_PRO.paths)) {
      const rule = vercel.redirects.find((r) => r.source === path && !r.has);
      expect(rule, `no redirect for ${path}`).toBeDefined();
      expect(rule?.destination).toBe(`/au-en${path}`);
      expect(rule?.permanent).toBe(true);
    }
  });

  it.each(['au-en', 'fr-fr'] as const)('has every dictionary entry the pages read (%s)', (locale) => {
    const t = useTranslations(locale);
    const keys: string[] = [];
    for (const doc of [PDF_ALGO_PRO.privacy, PDF_ALGO_PRO.terms]) {
      for (const id of doc.sections) keys.push(`${doc.ns}.sections.${id}.title`, `${doc.ns}.sections.${id}.content`);
      for (const v of doc.versions) keys.push(`${doc.ns}.changes.${v.key}`);
      for (const links of Object.values(doc.links)) for (const l of links) keys.push(l.labelKey);
    }
    for (const id of PDF_ALGO_PRO.features) keys.push(`pdfAlgoPro.features.${id}.title`, `pdfAlgoPro.features.${id}.body`);
    for (const id of PDF_ALGO_PRO.faqs) keys.push(`pdfAlgoPro.support.faq.${id}.q`, `pdfAlgoPro.support.faq.${id}.a`);
    for (let i = 0; i < PDF_ALGO_PRO.privacyPoints; i++) keys.push(`pdfAlgoPro.private.items.${i}`);
    for (let i = 0; i < PDF_ALGO_PRO.requirements; i++) keys.push(`pdfAlgoPro.requirements.items.${i}`);
    for (let i = 0; i < PDF_ALGO_PRO.supportChecklist; i++) keys.push(`pdfAlgoPro.support.include.items.${i}`);
    for (const key of keys) expect(t(key), key).not.toBe(key);
  });

  it('lists versions newest first, with ISO dates', () => {
    for (const doc of [PDF_ALGO_PRO.privacy, PDF_ALGO_PRO.terms]) {
      const dates = doc.versions.map((v) => v.date);
      for (const d of dates) expect(d).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect([...dates].sort().reverse()).toEqual(dates);
    }
  });

  it('only switches the App Store link on with a numeric app id', () => {
    if (PDF_ALGO_PRO.storeStatus === 'live') expect(PDF_ALGO_PRO.appStoreId).toMatch(/^\d+$/);
  });
});
