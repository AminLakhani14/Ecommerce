import { cleanup, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import HomePage from './HomePage';

const query = vi.hoisted(() => ({ data: undefined as Record<string, unknown[]> | undefined, isLoading: true }));
vi.mock('../redux/slices/productsApiSlice', () => ({ useGetHomepageProductsQuery: () => query }));
vi.mock('../components/ProductCard', () => ({ default: ({ product }: { product: { name: string } }) => <div>{product.name}</div> }));
vi.mock('../components/CategoryShowcase', () => ({ default: () => <div>Explore the collections</div> }));
afterEach(cleanup);

test('static homepage sections appear while product data loads', () => {
  query.data = undefined; query.isLoading = true;
  render(<MemoryRouter><HomePage /></MemoryRouter>);
  expect(screen.getByText('Explore the collections')).toBeInTheDocument();
  expect(screen.getByText('Mid-Season Sale')).toBeInTheDocument();
});

test('homepage cards come from the single limited homepage response', () => {
  query.isLoading = false;
  query.data = { accessories: [{ _id: 'a', name: 'Watch' }], backpacks: [{ _id: 'b', name: 'Backpack' }], clothing: [{ _id: 'c', name: 'Shirt' }], children: [], sale: [] };
  render(<MemoryRouter><HomePage /></MemoryRouter>);
  for (const name of ['Watch', 'Backpack', 'Shirt']) expect(screen.getByText(name)).toBeInTheDocument();
  expect(screen.queryByText('HOW DO YOU SHOP?')).not.toBeInTheDocument();
});
