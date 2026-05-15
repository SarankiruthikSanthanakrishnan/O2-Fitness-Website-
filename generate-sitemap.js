import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DOMAIN = 'https://www.o2fitnesshealthcare.com';
const PROJECT_ID = 'o2fitness-5b77f';

const createSlug = (title) =>
  title
    ? title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
    : "product";

const staticRoutes = [
  '/',
  '/products',
  '/about',
  '/contact',
  '/cart',
  '/checkout'
];

async function generateSitemap() {
  console.log('Generating sitemap...');
  
  const sitemapUrls = [];

  // 1. Add static routes
  for (const route of staticRoutes) {
    sitemapUrls.push(`
  <url>
    <loc>${DOMAIN}${route}</loc>
    <changefreq>weekly</changefreq>
    <priority>${route === '/' ? '1.0' : '0.8'}</priority>
  </url>`);
  }

  // 2. Fetch products from Firestore REST API
  let pageToken = '';
  let hasMore = true;

  try {
    while (hasMore) {
      const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/products?pageSize=100${pageToken ? `&pageToken=${pageToken}` : ''}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.documents) {
        data.documents.forEach(doc => {
          if (doc.fields && doc.fields.title && doc.fields.title.stringValue) {
            const slug = createSlug(doc.fields.title.stringValue);
            const updateTime = doc.updateTime ? doc.updateTime.split('T')[0] : new Date().toISOString().split('T')[0];
            
            sitemapUrls.push(`
  <url>
    <loc>${DOMAIN}/products/${slug}</loc>
    <lastmod>${updateTime}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`);
          }
        });
      }
      
      if (data.nextPageToken) {
        pageToken = data.nextPageToken;
      } else {
        hasMore = false;
      }
    }

    const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls.join('')}
</urlset>`;

    const publicPath = path.resolve(__dirname, 'public', 'sitemap.xml');
    fs.writeFileSync(publicPath, sitemapContent.trim());
    console.log(`Successfully generated sitemap with ${sitemapUrls.length} URLs at ${publicPath}`);

  } catch (error) {
    console.error('Error generating sitemap:', error);
    process.exit(1);
  }
}

generateSitemap();
