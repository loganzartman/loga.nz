/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://loga.nz',
  generateRobotsTxt: false, // (optional)
  generateIndexSitemap: false,
  changefreq: 'weekly',
  exclude: ['*/og.png', '*/opengraph-image'],
};
