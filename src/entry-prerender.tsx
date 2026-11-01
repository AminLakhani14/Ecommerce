import { renderToString } from 'react-dom/server';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store';
import { apiSlice } from './redux/slices/apiSlice';
import { productsApiSlice } from './redux/slices/productsApiSlice';
import { categoriesApiSlice } from './redux/slices/categoriesApiSlice';
import type { Product, ProductSummary } from './types';
import App from './App';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import FAQPage from './pages/FAQ';
import SalePage from './pages/SalePage';
import CategoryPage from './pages/CategoryPage';
import ProductPage from './pages/ProductPage';
import { productPath } from './utils/productPath';

export async function prepare() {
  const api = (import.meta.env.VITE_API_URL || 'https://ag-store-ecommerce-backend.onrender.com').replace(/\/$/, '');
  async function get<T>(path: string): Promise<T> {
    const response = await fetch(api + path, { signal: AbortSignal.timeout(60000) });
    if (!response.ok) throw new Error(`Prerender API ${path}: ${response.status}`);
    return response.json();
  }
  const [products, categories, homepage, sale] = await Promise.all([
    get<Product[]>('/api/products'), get<string[]>('/api/categories'),
    get<Record<string, ProductSummary[]>>('/api/products/homepage'), get<Product[]>('/api/products/sale'),
  ]);
  if (!Array.isArray(products) || !Array.isArray(categories)) throw new Error('Invalid catalog data for SEO rendering');
  store.dispatch(categoriesApiSlice.util.upsertQueryEntries([{ endpointName: 'getCategories', arg: undefined, value: categories }]));
  store.dispatch(productsApiSlice.util.upsertQueryEntries([
    { endpointName: 'getProducts', arg: undefined, value: products },
    { endpointName: 'getHomepageProducts', arg: undefined, value: homepage },
    { endpointName: 'getSaleProducts', arg: undefined, value: sale },
    ...products.map(product => ({ endpointName: 'getProductDetails' as const, arg: product.slug || product._id, value: product })),
  ]));
  // Use the category endpoint so server-rendered product lists match the live storefront.
  for (const category of categories) {
    const value = await get<Product[]>(`/api/products/category/${encodeURIComponent(category.toLowerCase())}`);
    store.dispatch(productsApiSlice.util.upsertQueryEntries([{ endpointName: 'getProductsByCategory', arg: category.toLowerCase(), value }]));
  }
  return ['/', '/about', '/contact', '/faq', '/sale',
    ...categories.map(category => `/category/${encodeURIComponent(category.toLowerCase())}`), ...products.map(productPath)];
}

export function render(path: string) {
  return renderToString(<Provider store={store}><MemoryRouter initialEntries={[path]}><Routes>
    <Route path='/' element={<App />}>
      <Route index element={<HomePage />} />
      <Route path='about' element={<AboutPage />} />
      <Route path='contact' element={<ContactPage />} />
      <Route path='faq' element={<FAQPage />} />
      <Route path='sale' element={<SalePage />} />
      <Route path='category/:categoryName' element={<CategoryPage />} />
      <Route path='product/:id' element={<ProductPage />} />
    </Route>
  </Routes></MemoryRouter></Provider>);
}

export function dispose() { store.dispatch(apiSlice.util.resetApiState()); }
