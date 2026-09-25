/**
 * Hand-rolled RSS 2.0 builder (no @astrojs/rss dependency — the site already
 * hand-rolls robots.txt/llms.txt endpoints, and this keeps the build adapter-
 * and dep-free). One feed per content locale; au-en shares the English feed.
 */
import { blog } from '@/data/blog';
import { useTranslations, localizePath, type Locale } from '@/i18n';
import { SITE } from '@/seo/schema';

const escapeXml = (s: string): string =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');

/** Blog posts newest-first with resolved title/description for a locale. */
function feedItems(locale: Locale) {
  const t = useTranslations(locale);
  return [...blog]
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .map((post) => {
      const url = `${SITE}${localizePath(locale, `/blog/${post.slug}`)}`;
      return {
        title: t(`blog.posts.${post.postIndex}.title`),
        description: t(`blog.posts.${post.postIndex}.snippet`),
        url,
        pubDate: new Date(post.updatedAt ?? post.date).toUTCString(),
      };
    });
}

/** Full RSS 2.0 document for a locale as a Response (Content-Type set). */
export function rssFeed(locale: Locale): Response {
  const t = useTranslations(locale);
  const selfPath = locale === 'fr-fr' ? '/fr-fr/rss.xml' : '/rss.xml';
  const blogUrl = `${SITE}${localizePath(locale, '/blog')}`;
  const lang = locale === 'fr-fr' ? 'fr-FR' : locale === 'au-en' ? 'en-AU' : 'en';

  const items = feedItems(locale)
    .map(
      (i) => `    <item>
      <title>${escapeXml(i.title)}</title>
      <link>${i.url}</link>
      <guid isPermaLink="true">${i.url}</guid>
      <description>${escapeXml(i.description)}</description>
      <pubDate>${i.pubDate}</pubDate>
    </item>`,
    )
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(t('blog.hero.title'))} — Algorythmos</title>
    <link>${blogUrl}</link>
    <description>${escapeXml(t('blog.hero.subtitle'))}</description>
    <language>${lang}</language>
    <atom:link href="${SITE}${selfPath}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;

  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
}
