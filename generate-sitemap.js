const { SitemapStream, streamToPromise } = require('sitemap');
const { Readable } = require('stream');
const fs = require('fs');

// サイトのURLリストを定義
const sites = [
  { url: '/', changefreq: 'daily', priority: 0.7 },
  // 他のページがあれば追加
  // { url: '/about', changefreq: 'monthly', priority: 0.5 },
  // { url: '/contact', changefreq: 'monthly', priority: 0.5 },
];

// サイトマップを生成する関数
async function generateSitemap() {
  const stream = new SitemapStream({ hostname: 'https://kanpeee.vercel.app/' });
  
  return streamToPromise(Readable.from(sites).pipe(stream)).then((data) =>
    data.toString()
  );
}

// サイトマップを生成して保存
generateSitemap().then((sitemap) => {
  fs.writeFileSync('./public/sitemap.xml', sitemap);
  console.log('Sitemap generated successfully');
});