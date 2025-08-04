
import { generateVehicleSlug } from './slugUtils';

export interface SitemapEntry {
  url: string;
  lastmod: string;
  changefreq: 'daily' | 'weekly' | 'monthly';
  priority: string;
}

/**
 * Generates sitemap entry for a vehicle
 */
export const generateVehicleSitemapEntry = (
  vehicle: {
    id: string;
    brand: string;
    model: string;
    variant: string;
    fuel_type: string;
    year: number;
    seller_location_city: string;
    created_at?: string;
  },
  type: 'car' | 'bike'
): SitemapEntry => {
  const slug = generateVehicleSlug(vehicle);
  const url = `https://www.vahaanxchange.com/used-${type}-details/${slug}`;
  const lastmod = vehicle.created_at 
    ? new Date(vehicle.created_at).toISOString().split('T')[0]
    : new Date().toISOString().split('T')[0];

  return {
    url,
    lastmod,
    changefreq: 'weekly',
    priority: '0.8'
  };
};

/**
 * Generates XML sitemap string from entries
 */
export const generateSitemapXML = (entries: SitemapEntry[]): string => {
  const urlEntries = entries.map(entry => `
  <url>
    <loc>${entry.url}</loc>
    <lastmod>${entry.lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://www.vahaanxchange.com/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://www.vahaanxchange.com/search-used-cars</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://www.vahaanxchange.com/search-used-bikes</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://www.vahaanxchange.com/sell</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://www.vahaanxchange.com/buy</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://www.vahaanxchange.com/about-us</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>https://www.vahaanxchange.com/contact-us</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>https://www.vahaanxchange.com/privacy</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.4</priority>
  </url>
  <url>
    <loc>https://www.vahaanxchange.com/terms</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.4</priority>
  </url>${urlEntries}
</urlset>`;
};
