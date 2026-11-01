import { useLocation } from 'react-router-dom';
import { useGetProductDetailsQuery } from '../redux/slices/productsApiSlice';
import { productPath } from '../utils/productPath';
import { productImageUrl } from '../utils/productImage';
import { getPricing } from '../utils/pricing';
import { collections } from '../data/collections';

const origin = 'https://sbrfashion.com';
const pages: Record<string, [string, string]> = {
  '/': ['SBR Fashion | Clothing, Accessories & Backpacks', 'Shop SBR Fashion for everyday clothing, children’s styles, accessories and backpacks. Explore our collections and discover your next favorite.'],
  '/about': ['About SBR Fashion | Our Story', 'Get to know SBR Fashion and explore our approach to everyday clothing, accessories and backpacks.'],
  '/contact': ['Contact SBR Fashion | Customer Support', 'Contact SBR Fashion with questions about our clothing, accessories, products or your order.'],
  '/faq': ['SBR Fashion FAQs | Shopping Help', 'Find answers to common questions about shopping, sizing, shipping and payments at SBR Fashion.'],
  '/sale': ['Sale | Clothing & Accessories | SBR Fashion', 'Explore sale clothing, accessories and backpacks at SBR Fashion. Browse available styles and current prices.'],
};
const label = (value: string) => decodeURIComponent(value).replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
const json = (value: unknown) => JSON.stringify(value).replace(/</g, '\\u003c');

/** React 19 hoists these tags into the document head, including during prerendering. */
export default function Seo() {
  const { pathname } = useLocation();
  const path = pathname.replace(/\/$/, '') || '/';
  const productMatch = path.match(/^\/product\/([^/]+)$/);
  const { data: product } = useGetProductDetailsQuery(productMatch?.[1], { skip: !productMatch });
  let [title, description] = pages[path] || ['SBR Fashion | Online Store', 'Explore clothing, accessories and backpacks at SBR Fashion.'];
  let canonical = origin + (path === '/' ? '/' : path);
  const category = path.match(/^\/category\/([^/]+)$/);
  if (category) {
    const collection = collections[decodeURIComponent(category[1]).toLowerCase() as keyof typeof collections];
    title = `${collection?.title || label(category[1])} | SBR Fashion`;
    description = collection?.description || `Shop ${label(category[1]).toLowerCase()} at SBR Fashion. Explore available styles and product details.`;
  }
  const filtered = path.match(/^\/products\/(?:subcategory\/)?(.+)$/);
  if (filtered) {
    title = `${filtered[1].split('/').map(label).join(' – ')} | SBR Fashion`;
    description = `Explore ${filtered[1].split('/').map(label).join(' ').toLowerCase()} at SBR Fashion. Browse styles, photos and current prices.`;
  }
  if (product) {
    title = `${product.name} | SBR Fashion`;
    description = product.description.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim().slice(0, 160) || `Shop ${product.name} at SBR Fashion. View product photos, sizes and availability.`;
    canonical = origin + productPath(product);
  }
  const indexable = Boolean(pages[path] || category || filtered || productMatch);
  const data: Record<string, unknown>[] = path === '/' ? [
    { '@context': 'https://schema.org', '@type': 'WebSite', name: 'SBR Fashion', alternateName: 'sbrfashion', url: origin + '/' },
    { '@context': 'https://schema.org', '@type': 'Organization', name: 'SBR Fashion', url: origin + '/', logo: origin + '/sbrfashion-logo.svg',
      email: 'fashionsbr3@gmail.com', telephone: '+13102272015', location: { '@type': 'Place', name: 'LA Downtown' } },
  ] : [];
  if (indexable && path !== '/') data.push({
    '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'SBR Fashion', item: origin + '/' },
      { '@type': 'ListItem', position: 2, name: product?.name || title.split(' | ')[0], item: canonical },
    ],
  });
  if (product) data.push({
    '@context': 'https://schema.org', '@type': 'Product', name: product.name,
    description: product.description, image: [product.image, ...(product.gallery || [])].filter(Boolean).map(productImageUrl),
    sku: product._id,
    offers: { '@type': 'Offer', url: canonical, priceCurrency: 'USD', price: getPricing(product).current,
      availability: `https://schema.org/${(product.variants?.length ? product.variants.some(v => v.stock > 0) : product.countInStock > 0) ? 'InStock' : 'OutOfStock'}` },
  });
  return <>
    <title>{title}</title>
    <meta name='description' content={description} />
    <meta name='robots' content={indexable ? 'index, follow, max-image-preview:large' : 'noindex, follow'} />
    <link rel='canonical' href={canonical} />
    <meta property='og:site_name' content='SBR Fashion' />
    <meta property='og:title' content={title} />
    <meta property='og:description' content={description} />
    <meta property='og:url' content={canonical} />
    <meta property='og:type' content={product ? 'product' : 'website'} />
    <meta property='og:image' content={product ? productImageUrl(product.image) : origin + '/videos/ecommerce-promo-poster.jpg'} />
    <meta name='twitter:card' content='summary_large_image' />
    <meta name='twitter:title' content={title} />
    <meta name='twitter:description' content={description} />
    <script id='seo-data' type='application/ld+json' dangerouslySetInnerHTML={{ __html: json(data) }} />
  </>;
}
