import type { APIRoute } from 'astro';
import { services } from '@/data/services';
import { caseStudies } from '@/data/caseStudies';
import { blog } from '@/data/blog';
import { useTranslations } from '@/i18n';

export const prerender = true;

const SITE = 'https://algorythmos.com';

export const GET: APIRoute = () => {
  const t = useTranslations('en');
  const L: string[] = [];
  L.push('# Algorythmos', '');
  L.push(
    '> Boutique AI consultancy delivering agentic automation, document intelligence, SQL dashboards, and MLOps engineering for SMEs in Sydney (Australia) and Paris (France). Bilingual EN/FR. Single canonical domain: https://algorythmos.com.',
    '',
    `> Full page-by-page content for ingestion: ${SITE}/llms-full.txt`,
    '',
  );
  L.push('## Overview');
  L.push(`- [Home](${SITE}/): What Algorythmos does and who it serves.`);
  L.push(`- [Services](${SITE}/services): Full catalogue of AI consulting offerings.`);
  L.push(`- [Pricing](${SITE}/pricing): Engagement models and transparent pricing.`);
  L.push(`- [About](${SITE}/about): Company background and approach.`);
  L.push(`- [Contact](${SITE}/contact): How to start an engagement.`);
  L.push('');
  L.push('## Services');
  for (const s of services) L.push(`- [${s.name}](${SITE}/services/${s.slug}): ${s.tagline}`);
  L.push('');
  L.push('## Regions');
  L.push(`- [Australia — Sydney](${SITE}/au-en): AI consultancy for Australian SMEs and enterprises.`);
  L.push(`- [France — Paris](${SITE}/fr-fr): Cabinet de conseil en IA, conforme RGPD et EU AI Act.`);
  L.push('');
  L.push('## Blog');
  L.push(`- [Blog index](${SITE}/blog)`);
  for (const p of blog) L.push(`- [${t(`blog.posts.${p.postIndex}.title`)}](${SITE}/blog/${p.slug})`);
  L.push('');
  L.push('## Case Studies');
  L.push(`- [Case Studies](${SITE}/case-studies)`);
  for (const c of caseStudies) L.push(`- [${t(`caseStudies.items.${c.i18nIndex}.title`)}](${SITE}/case-studies/${c.slug})`);
  L.push('');
  L.push('## Company');
  L.push(`- [Careers](${SITE}/careers)`);
  L.push(`- [Privacy Policy](${SITE}/privacy)`);
  L.push(`- [Terms of Service](${SITE}/terms)`);
  L.push('');
  return new Response(L.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
