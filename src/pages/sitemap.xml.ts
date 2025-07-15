import type { APIRoute } from 'astro';
import { generateSitemap } from '../utils/sitemap';

const SITE_URL = 'https://bswdegree.org';

export const GET: APIRoute = async () => {
  const sitemap = await generateSitemap(SITE_URL);
  
  return new Response(sitemap, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600'
    }
  });
};

export const prerender = true;