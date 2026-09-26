import type { APIRoute } from 'astro';
import { services } from '@/data/services';
import { caseStudies } from '@/data/caseStudies';
import { blog } from '@/data/blog';
import { useTranslations } from '@/i18n';
import { BUSINESS, regionAddressLine } from '@/data/business';

export const prerender = true;

const SITE = 'https://algorythmos.com';
/** Canonical English tree (the unprefixed pages canonicalise here). */
const AU = `${SITE}/au-en`;
const FR = `${SITE}/fr-fr`;

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
  L.push(`- [Home](${AU}): What Algorythmos does and who it serves.`);
  L.push(`- [Services](${AU}/services): Full catalogue of AI consulting offerings.`);
  L.push(`- [Pricing](${AU}/pricing): Engagement models and transparent pricing.`);
  L.push(`- [About](${AU}/about): Company background and approach.`);
  L.push(`- [Contact](${AU}/contact): How to start an engagement.`);
  L.push(`- [Press & media kit](${AU}/press): Boilerplate, founder bio, logos, and media contact.`);
  L.push('');
  L.push('## Services');
  for (const s of services)
    L.push(`- [${t(`services.items.${s.slug}.name`)}](${AU}/services/${s.slug}): ${t(`services.items.${s.slug}.tagline`)}`);
  L.push('');
  L.push('## Regions');
  L.push(`- [Australia — Sydney](${SITE}/au-en): AI consultancy for Australian SMEs and enterprises.`);
  L.push(`- [France — Paris](${SITE}/fr-fr): Cabinet de conseil en IA, conforme RGPD et EU AI Act.`);
  L.push(`- [AI Consultancy in Sydney](${SITE}/au-en/ai-consultancy-sydney): Local landing page for businesses in Sydney, NSW & Australia.`);
  L.push(`- [Conseil en IA à Paris](${SITE}/fr-fr/conseil-en-ia-paris): Page locale pour les PME et ETI à Paris et en Île-de-France.`);
  L.push('');
  L.push('## Company');
  L.push(`- Legal entity: ${BUSINESS.legalName.replace(/\.$/, '')} (ABN ${BUSINESS.abn}, ACN ${BUSINESS.acn}).`);
  L.push(`- Registered office (meetings by appointment): ${regionAddressLine('AU')}, ${BUSINESS.regions.AU.countryName}.`);
  L.push(`- General enquiries: ${BUSINESS.email}.`);
  L.push('');
  L.push('## Blog');
  L.push(`- [Blog index](${AU}/blog)`);
  for (const p of blog) L.push(`- [${t(`blog.posts.${p.postIndex}.title`)}](${AU}/blog/${p.slug})`);
  L.push('');
  L.push('## Case Studies');
  L.push(`- [Case Studies](${AU}/case-studies)`);
  for (const c of caseStudies) L.push(`- [${t(`caseStudies.items.${c.i18nIndex}.title`)}](${AU}/case-studies/${c.slug})`);
  L.push('');
  L.push('## En français');
  const tf = useTranslations('fr-fr');
  L.push(`- [Accueil](${FR}): ${tf('hero.subtitle')}`);
  L.push(`- [Services](${FR}/services) · [Études de cas](${FR}/case-studies) · [Blog](${FR}/blog) · [Tarifs](${FR}/pricing) · [Contact](${FR}/contact)`);
  for (const c of caseStudies) L.push(`- [${tf(`caseStudies.items.${c.i18nIndex}.title`)}](${FR}/case-studies/${c.slug})`);
  L.push('');
  L.push('## Policies and careers');
  L.push(`- [Careers](${AU}/careers)`);
  L.push(`- [Privacy Policy](${AU}/privacy)`);
  L.push(`- [Terms of Service](${AU}/terms)`);
  L.push(`- [Legal Notice](${AU}/legal-notice) · [Mentions légales](${FR}/legal-notice)`);
  L.push('');
  L.push('## Key visuals');
  L.push('> Branded product-UI illustrations (not photographs). Theme-neutral SVG.');
  L.push(`- [AI console — home hero](${SITE}/assets/visuals/home-hero-ai-console.svg): agentic automation workflow with a live analytics dashboard.`);
  L.push(`- [Agentic automation](${SITE}/assets/visuals/service-agentic-automation.svg): agent run with tool calls, guardrails and a human approval gate.`);
  L.push(`- [Document intelligence](${SITE}/assets/visuals/service-document-intelligence.svg): invoice extracted into structured fields with confidence scores.`);
  L.push(`- [SQL dashboards](${SITE}/assets/visuals/service-sql-dashboards.svg): governed KPIs and revenue charts on a semantic layer.`);
  L.push(`- [MLOps & CI/CD](${SITE}/assets/visuals/service-mlops-cicd.svg): train→deploy pipeline with drift detection and rollback.`);
  L.push(`- [AI-ready websites](${SITE}/assets/visuals/service-ai-websites.svg): Lighthouse 100s, Core Web Vitals and AI-crawl readiness.`);
  L.push(`- [Sydney](${SITE}/assets/visuals/city-sydney.svg): Sydney presence — AI consultancy for Australia.`);
  L.push(`- [Paris](${SITE}/assets/visuals/city-paris.svg): Paris presence — conseil en IA for France.`);
  L.push('');
  return new Response(L.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
