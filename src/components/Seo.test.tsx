import { render, waitFor, act } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import Seo from './Seo';

const { query } = vi.hoisted(() => ({ query: vi.fn((): { data?: unknown } => ({})) }));
vi.mock('../redux/slices/productsApiSlice', () => ({ useGetProductDetailsQuery: query }));
beforeEach(() => query.mockReturnValue({}));

test('route navigation updates the single canonical and hides account pages from indexing', async () => {
  const router = createMemoryRouter([{ path: '*', element: <Seo /> }], { initialEntries: ['/'] });
  render(<RouterProvider router={router} />);
  await waitFor(() => expect(document.title).toContain('SBR Fashion'));
  await act(() => router.navigate('/category/backpacks'));
  expect(document.title).toBe('Backpacks | SBR Fashion');
  expect(document.head.querySelectorAll('link[rel="canonical"]')).toHaveLength(1);
  expect(document.head.querySelector('link[rel="canonical"]')).toHaveAttribute('href', 'https://sbrfashion.com/category/backpacks');
  await act(() => router.navigate('/profile'));
  expect(document.head.querySelector('meta[name="robots"]')).toHaveAttribute('content', 'noindex, follow');
});

test('product metadata uses the canonical slug, actual sale price and safe structured data', () => {
  query.mockReturnValue({ data: { _id: 'p1', slug: 'travel-bag', name: 'Travel bag', description: 'A bag </script> for travel',
    image: '/uploads/bag.jpg', gallery: [], price: 40, isOnSale: true, salePrice: 30, countInStock: 2, variants: [] } });
  render(<RouterProvider router={createMemoryRouter([{ path: '*', element: <Seo /> }], { initialEntries: ['/product/p1'] })} />);
  expect(document.title).toBe('Travel bag | SBR Fashion');
  expect(document.head.querySelector('link[rel="canonical"]')).toHaveAttribute('href', 'https://sbrfashion.com/product/travel-bag');
  const script = document.querySelector('#seo-data')!;
  expect(script.innerHTML).not.toContain('</script>');
  const product = JSON.parse(script.textContent!).find((item: { '@type': string }) => item['@type'] === 'Product');
  expect(product.offers).toMatchObject({ price: 30, priceCurrency: 'USD', availability: 'https://schema.org/InStock' });
});
