import type { APIRoute } from 'astro';
import { rssFeed } from '@/lib/rss';

export const prerender = true;

/** French blog feed. */
export const GET: APIRoute = () => rssFeed('fr-fr');
