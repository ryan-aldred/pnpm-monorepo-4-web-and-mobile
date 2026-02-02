import { siteConfig } from '~/lib/meta';

interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?:
    | 'always'
    | 'hourly'
    | 'daily'
    | 'weekly'
    | 'monthly'
    | 'yearly'
    | 'never';
  priority?: number;
}

/**
 * Static URLs for the sitemap
 */
const staticUrls: SitemapUrl[] = [
  { loc: '/', changefreq: 'weekly', priority: 1.0 },
  { loc: '/login', changefreq: 'monthly', priority: 0.3 },
  { loc: '/register', changefreq: 'monthly', priority: 0.3 },
];

/**
 * Generate XML for a single URL entry
 */
function urlToXml(url: SitemapUrl): string {
  const absoluteUrl = `${siteConfig.siteUrl}${url.loc}`;
  const lines = [`  <url>`, `    <loc>${escapeXml(absoluteUrl)}</loc>`];

  if (url.lastmod) {
    lines.push(`    <lastmod>${url.lastmod}</lastmod>`);
  }
  if (url.changefreq) {
    lines.push(`    <changefreq>${url.changefreq}</changefreq>`);
  }
  if (url.priority !== undefined) {
    lines.push(`    <priority>${url.priority.toFixed(1)}</priority>`);
  }

  lines.push(`  </url>`);
  return lines.join('\n');
}

/**
 * Escape special XML characters
 */
function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Generate the complete sitemap XML
 */
function generateSitemap(urls: SitemapUrl[]): string {
  const header = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;
  const footer = `</urlset>`;

  const urlEntries = urls.map(urlToXml).join('\n');

  return `${header}\n${urlEntries}\n${footer}`;
}

/**
 * Sitemap resource route handler
 */
export async function loader() {
  // Add dynamic URLs here if needed
  // const dynamicUrls = await getDynamicUrlsFromDatabase();
  const allUrls = [...staticUrls];

  const sitemap = generateSitemap(allUrls);

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
