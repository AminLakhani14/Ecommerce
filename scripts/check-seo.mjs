import { readFile, access } from 'node:fs/promises';
import { resolve } from 'node:path';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';

const sitemap = new JSDOM(await readFile('dist/sitemap.xml', 'utf8'), { contentType: 'text/xml' });
const urls = [...sitemap.window.document.querySelectorAll('loc')].map(node => node.textContent);
assert(urls.length > 5, 'Expected public pages and catalog URLs');
for (const url of urls) {
  const path = new URL(url).pathname;
  const file = resolve('dist', path === '/' ? 'index.html' : '.' + path + '/index.html');
  const { window } = new JSDOM(await readFile(file, 'utf8'));
  const doc = window.document;
  for (const selector of ['title', 'meta[name="description"]', 'meta[name="robots"]', 'link[rel="canonical"]']) {
    assert.equal(doc.head.querySelectorAll(selector).length, 1, `${path}: exactly one ${selector}`);
  }
  assert.equal(doc.head.querySelector('link[rel="canonical"]').href, url);
  assert(doc.head.querySelector('meta[name="robots"]').content.startsWith('index,'));
  assert(doc.querySelector('#root h1'), `${path}: visible-page HTML must contain a heading`);
  assert(doc.querySelector('#root a[href]'), `${path}: crawlable navigation`);
  const data = JSON.parse(doc.head.querySelector('#seo-data').textContent);
  if (path.startsWith('/product/')) {
    const product = data.find(item => item['@type'] === 'Product');
    assert(product?.name && Number.isFinite(product.offers.price), `${path}: valid product and price`);
    assert(doc.querySelector('#root').textContent.includes(product.name));
  }
  for (const asset of doc.querySelectorAll('[src^="/assets/"], link[href^="/assets/"]')) {
    await access(resolve('dist', '.' + (asset.getAttribute('src') || asset.getAttribute('href'))));
  }
  window.close();
}
console.log(`SEO checks passed for ${urls.length} prerendered pages: metadata, canonicals, content, schemas and assets.`);
sitemap.window.close();
