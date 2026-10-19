import { Link, useLocation } from 'react-router-dom';
import { FiChevronRight, FiHome } from 'react-icons/fi';
import { useGetProductDetailsQuery } from '../redux/slices/productsApiSlice';
import { productCategories } from '../utils/categories';

export interface Crumb { label: string; to?: string }
const title = (value: string) => value.replace(/[-_]/g, ' ').replace(/(^|\s)\S/g, letter => letter.toUpperCase());

export function routeCrumbs(pathname: string): Crumb[] {
  const parts = pathname.split('/').filter(Boolean).map(part => { try { return decodeURIComponent(part); } catch { return part; } });
  const home: Crumb = { label: 'Home', to: '/' };
  if (!parts.length) return [];
  if (parts[0] === 'admin') {
    if (parts[1] === 'product') return [home, { label: 'Products', to: '/admin/productlist' }, { label: parts[2] === 'create' ? 'Create product' : 'Edit product' }];
    return [home, { label: ({ productlist: 'Products', orderlist: 'Orders', settings: 'Settings' } as Record<string, string>)[parts[1]] || 'Admin' }];
  }
  if (parts[0] === 'category') return [home, { label: title(parts[1] || '') }];
  if (parts[0] === 'products' && parts[1] !== 'subcategory') return [home, { label: title(parts[1]), to: `/category/${encodeURIComponent(parts[1].toLowerCase())}` }, { label: title(parts[2] || '') }];
  if (parts[0] === 'products') return [home, { label: title(parts[2] || '') }];
  if (parts[0] === 'shipping') return [home, { label: 'Shopping bag', to: '/cart' }, { label: 'Checkout' }];
  if (parts[0] === 'order') return [home, { label: 'My account', to: '/profile' }, { label: parts[2] === 'thankyou' ? 'Order confirmed' : 'Order details' }];
  const labels: Record<string, string> = { sale: 'Sale', cart: 'Shopping bag', profile: 'My account', login: 'Sign in', register: 'Create account', about: 'About us', contact: 'Contact us', faq: 'FAQs', thankyou: 'Thank you' };
  return [home, { label: labels[parts[0]] || title(parts[0]) }];
}

export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  if (!items.length) return null;
  return <nav aria-label='Breadcrumb' className='ag-breadcrumbs'><ol>
    {items.map((item, index) => <li key={`${item.label}-${index}`}>
      {index > 0 && <FiChevronRight aria-hidden='true' />}
      {index === items.length - 1 ? <span aria-current='page'>{item.label}</span> : item.to ? <Link to={item.to}>{index === 0 && <FiHome aria-hidden='true' />}{item.label}</Link> : <span>{item.label}</span>}
    </li>)}
  </ol></nav>;
}

function ProductCrumbs({ id }: { id: string }) {
  const { data: product } = useGetProductDetailsQuery(id);
  const category = product && productCategories(product.category)[0];
  return <Breadcrumbs items={[{ label: 'Home', to: '/' }, ...(category ? [{ label: category, to: `/category/${encodeURIComponent(category.toLowerCase())}` }] : []), { label: product?.name || 'Product details' }]} />;
}

export function SiteBreadcrumbs() {
  const { pathname } = useLocation();
  if (pathname === '/') return null;
  const product = pathname.match(/^\/product\/([^/]+)$/);
  return <div className='container site-breadcrumbs'>{product ? <ProductCrumbs id={product[1]} /> : <Breadcrumbs items={routeCrumbs(pathname)} />}</div>;
}
