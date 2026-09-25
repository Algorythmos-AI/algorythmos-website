import type { APIRoute } from 'astro';

export const prerender = true;

const SITE = 'https://algorythmos.com';
const DISALLOW = ['/admin/', '/api/', '/private/', '/internal/'];
const AI_BOTS = [
  'GPTBot', 'OAI-SearchBot', 'ChatGPT-User',
  'ClaudeBot', 'anthropic-ai', 'Claude-Web', 'Claude-User', 'Claude-SearchBot',
  'PerplexityBot', 'Perplexity-User',
  'CCBot', 'Google-Extended', 'GoogleOther', 'Bytespider',
  'Applebot', 'Applebot-Extended', 'cohere-ai',
  'Amazonbot', 'Meta-ExternalAgent', 'Meta-ExternalFetcher', 'FacebookBot',
  'DuckAssistBot', 'PetalBot', 'Diffbot', 'YouBot', 'Timpibot', 'omgili', 'ImagesiftBot',
];

export const GET: APIRoute = () => {
  const block = (ua: string) => [`User-agent: ${ua}`, 'Allow: /', ...DISALLOW.map((d) => `Disallow: ${d}`), ''];
  const lines = [
    '# Algorythmos — all crawlers, incl. AI agents, are welcome.',
    ...block('*'),
    ...AI_BOTS.flatMap(block),
    `Sitemap: ${SITE}/sitemap-index.xml`,
    `# AI agent guide: ${SITE}/llms.txt`,
    `# Full content for LLMs: ${SITE}/llms-full.txt`,
    '',
  ];
  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
