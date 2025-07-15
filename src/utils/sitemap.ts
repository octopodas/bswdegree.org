import { getCollection } from 'astro:content';

export interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  priority?: number;
}

export function formatDateForSitemap(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function generateSitemapXML(urls: SitemapUrl[]): string {
  const urlsXML = urls
    .map(url => {
      const elements = [
        `    <url>`,
        `      <loc>${url.loc}</loc>`,
        url.lastmod ? `      <lastmod>${url.lastmod}</lastmod>` : null,
        url.changefreq ? `      <changefreq>${url.changefreq}</changefreq>` : null,
        url.priority ? `      <priority>${url.priority}</priority>` : null,
        `    </url>`
      ].filter(Boolean);
      return elements.join('\n');
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlsXML}
</urlset>`;
}

export function getStaticPages(baseUrl: string): SitemapUrl[] {
  const currentDate = formatDateForSitemap(new Date());
  
  return [
    {
      loc: `${baseUrl}/`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: 1.0
    },
    {
      loc: `${baseUrl}/is-it-for-me/`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: 0.8
    },
    {
      loc: `${baseUrl}/the-degree/`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: 0.8
    },
    {
      loc: `${baseUrl}/career-and-salary/`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: 0.8
    },
    {
      loc: `${baseUrl}/next-steps/`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: 0.8
    },
    {
      loc: `${baseUrl}/colleges/`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: 0.7
    }
  ];
}

export async function getCollectionPages(baseUrl: string): Promise<SitemapUrl[]> {
  const urls: SitemapUrl[] = [];
  const currentDate = formatDateForSitemap(new Date());

  try {
    // Get colleges collection
    const colleges = await getCollection('colleges');
    
    for (const college of colleges) {
      urls.push({
        loc: `${baseUrl}/colleges/${college.data.id}/`,
        lastmod: currentDate,
        changefreq: 'weekly',
        priority: 0.6
      });
    }
  } catch (error) {
    console.warn('Error loading collections for sitemap:', error);
  }

  return urls;
}

export async function generateSitemap(baseUrl: string): Promise<string> {
  const staticPages = getStaticPages(baseUrl);
  const collectionPages = await getCollectionPages(baseUrl);
  
  const allUrls = [...staticPages, ...collectionPages];
  
  return generateSitemapXML(allUrls);
}