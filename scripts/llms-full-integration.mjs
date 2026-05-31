/**
 * Astro integration: emit /llms-full.txt at build time.
 *
 * The full text of every primary (English-canonical) page, concatenated into one
 * file so an LLM/agent can ingest the entire site in a single fetch. Reads the
 * BUILT HTML from the output dir, so it always matches what pages actually render
 * (no separate content source to drift). Locale variants (/au-en, /fr-fr) mirror
 * this content and are linked from llms.txt + the sitemap.
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join, relative } from 'node:path';

const SITE = 'https://algorythmos.com';

function walk(dir, acc = []) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) walk(p, acc);
    else if (f.endsWith('.html')) acc.push(p);
  }
  return acc;
}

function decode(s) {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&mdash;/g, '—')
    .replace(/&ndash;/g, '–')
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&[a-z]+;/g, ' ');
}

/** Extract readable text from the <main> region (drop nav/footer/scripts/svg). */
function mainText(html) {
  const m = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
  let s = m ? m[1] : html;
  s = s.replace(/<(script|style|svg|noscript|template)[^>]*>[\s\S]*?<\/\1>/gi, '');
  s = s.replace(/<[^>]+>/g, ' ');
  return decode(s).replace(/\s+/g, ' ').trim();
}

function tag(html, re) {
  const m = html.match(re);
  return m ? decode(m[1]).trim() : '';
}

export default function llmsFull() {
  return {
    name: 'algorythmos:llms-full',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        const distPath = fileURLToPath(dir);
        const files = walk(distPath)
          .filter((p) => {
            const r = relative(distPath, p).replace(/\\/g, '/');
            // English-canonical pages only; skip locale mirrors, the OG image route, and 404.
            return !r.startsWith('au-en/') && !r.startsWith('fr-fr/') && !r.startsWith('og/') && r !== '404.html';
          })
          .sort();

        const out = [
          '# Algorythmos — Full Site Content (for LLMs)',
          '',
          '> Full text of every primary page on https://algorythmos.com, concatenated for AI ingestion in a single fetch.',
          '> Curated link index: https://algorythmos.com/llms.txt · Sitemap: https://algorythmos.com/sitemap-index.xml',
          '> Locale variants under /au-en (English) and /fr-fr (French) mirror this content.',
          '',
          '---',
          '',
        ];

        let n = 0;
        for (const f of files) {
          const html = readFileSync(f, 'utf8');
          const body = mainText(html);
          if (body.length < 60) continue;
          const rel = relative(distPath, f)
            .replace(/\\/g, '/')
            .replace(/index\.html$/, '')
            .replace(/\.html$/, '');
          const url = rel === '' ? `${SITE}/` : `${SITE}/${rel.replace(/\/$/, '')}`;
          const title = tag(html, /<title>([^<]*)<\/title>/i).replace(/\s*[|—–-]\s*Algorythmos.*$/, '').trim();
          const desc = tag(html, /<meta name="description" content="([^"]*)"/i);
          out.push(`# ${title || url}`, '', `URL: ${url}`);
          if (desc) out.push('', `> ${desc}`);
          out.push('', body, '', '---', '');
          n++;
        }

        const text = out.join('\n');
        writeFileSync(join(distPath, 'llms-full.txt'), text, 'utf8');
        logger.info(`llms-full.txt generated — ${n} pages, ${text.length} chars`);
      },
    },
  };
}
