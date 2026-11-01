import { build } from 'vite';
import { readFile, writeFile, mkdir, rm } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { pathToFileURL } from 'node:url';

const temporary = resolve('.prerender');
try {
  await build({ build: { ssr: 'src/entry-prerender.tsx', outDir: temporary,
    rollupOptions: { output: { entryFileNames: 'entry.js' } } } });
  const { prepare, render, dispose } = await import(pathToFileURL(resolve(temporary, 'entry.js')).href);
  try {
    const routes = [...new Set(await prepare())];
    // Keep the generic fallback index for routes that are not prerendered.
    const template = await readFile('dist/index.html', 'utf8');
    const base = template.replace(/<title>[\s\S]*?<\/title>/g, '')
      .replace(/<meta\s+(?:name="description"|property="og:[^"]*")[\s\S]*?>/g, '')
      .replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/g, '');
    for (const route of routes) {
      const head = [];
      const body = render(route).replace(/<title>[\s\S]*?<\/title>|<meta\b[^>]*\/>|<link\b[^>]*\/>|<script id="seo-data"[\s\S]*?<\/script>/g,
        tag => { head.push(tag); return ''; });
      const html = base.replace('</head>', `${head.join('\n')}\n</head>`).replace('<div id="root"></div>', `<div id="root">${body}</div>`);
      // Slugs originate from our catalog, but still enforce the output boundary.
      const file = resolve('dist', route === '/' ? 'index.html' : '.' + route + '/index.html');
      if (!file.startsWith(resolve('dist') + '\\') && !file.startsWith(resolve('dist') + '/')) throw new Error('Unsafe prerender route');
      await mkdir(dirname(file), { recursive: true });
      await writeFile(file, html);
    }
    const xml = value => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
    await writeFile('dist/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes.map(route => `  <url><loc>${xml('https://sbrfashion.com' + route)}</loc></url>`).join('\n')}\n</urlset>\n`);
    console.log(`Prerendered ${routes.length} storefront pages and generated the catalog sitemap.`);
  } finally { dispose(); }
} finally { await rm(temporary, { recursive: true, force: true }); }
