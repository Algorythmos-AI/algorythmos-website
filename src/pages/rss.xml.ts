import type { APIRoute } from 'astro';
import { rssFeed } from '@/lib/rss';

export const prerender = true;

/** English blog feed (also serves the au-en region, which shares EN content). */
export const GET: APIRoute = () => rssFeed('en');
