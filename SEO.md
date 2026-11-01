# Storefront SEO

`npm run build` builds the interactive Vite app, then prerenders the real React
storefront into HTML for the homepage, information pages, catalog categories and
active products. It fetches the public API configured by `VITE_API_URL` and fails
if catalog data cannot be retrieved, rather than publishing an empty catalog.
The temporary server bundle is removed after rendering; no server runtime is
required on Vercel. `npm run seo:check` validates generated HTML and sitemap URLs.

`src/components/Seo.tsx` owns route titles, descriptions, canonical URLs, social
metadata, Organization/WebSite, breadcrumb and Product structured data. Product
offers use the same pricing helper as the visible storefront and USD currency.
No fabricated reviews, ratings, addresses or return/shipping policies are added.
Account, checkout and admin screens are excluded from indexing.

The generated `dist/sitemap.xml` includes actual catalog URLs. New products,
changed prices/stock, or removed products require another Vercel production build
to refresh static HTML and the sitemap. Browser API requests still fetch live
data. A push to `main` triggers that build automatically; a catalog-only change
can be followed by Vercel's Redeploy action.

The primary host is `https://sbrfashion.com`; www redirects there permanently.
Do not add a homepage canonical to the shared index.html: each generated page
needs its own canonical. The browser removes prerendered metadata once at startup
so React can update it without leaving tags from previous routes behind.

## Google setup (requires the owner's Google account)

1. Verify `sbrfashion.com` in Google Search Console.
2. Submit `https://sbrfashion.com/sitemap.xml`.
3. Inspect the homepage and request indexing; monitor indexing and queries.

Search Console was intentionally not configured as part of the website-only SEO
request. Indexing and search position are controlled by Google, not deployment.
The existing contact details and unfinished FAQ copy need business-owner review.
