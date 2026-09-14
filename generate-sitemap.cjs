const { SitemapStream, streamToPromise } = require('sitemap');
const { createWriteStream } = require('fs');
const path = require('path');

const hostname = 'https://www.markupdesigns.net/arbutus-web/';

const routes = [
  '/',
  '/Aboutmain',
  '/AltDatabaseMain',
  '/Newsmain',
  '/Contactmain',
  '/Levelmain',
  '/Resarchmain',
  '/Privacypolicy',
  '/TremsandCondition',
  '/payment-success',
];

async function generateSitemap() {
  const sitemap = new SitemapStream({ hostname });
  const writeStream = createWriteStream(path.join(__dirname, 'dist', 'sitemap.xml'));

  sitemap.pipe(writeStream);

  routes.forEach(route => {
    sitemap.write({ 
      url: route, 
      changefreq: 'weekly', 
      priority: route === '/' ? 1.0 : 0.8 
    });
  });

  sitemap.end();
  await streamToPromise(sitemap);
}

generateSitemap().catch(console.error);