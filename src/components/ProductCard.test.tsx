import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import store from '../redux/store';
import { clearCartItems } from '../redux/slices/cartSlice';
import ProductCard from './ProductCard';
import type { ProductSummary } from '../types';

beforeEach(() => store.dispatch(clearCartItems()));
afterEach(() => { cleanup(); store.dispatch(clearCartItems()); });

test('a compact homepage card can still add a complete cart item', async () => {
  const product: ProductSummary = { _id: 'summary-product', name: 'Backpack', image: 'https://example.com/bag.jpg',
    category: ['Backpacks'], subCategory: 'Bags', price: 20, countInStock: 2, isOnSale: false, isActive: true,
    variants: [{ size: 'One Size', stock: 2 }] };
  render(<Provider store={store}><MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><ProductCard product={product} /></MemoryRouter></Provider>);
  await waitFor(() => expect(screen.getByRole('button', { name: 'Add to Cart' })).toBeEnabled());
  expect(screen.getByText(/USD\s+20\.00/)).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Add to Cart' }));
  expect(store.getState().cart.cartItems).toEqual([{ ...product, description: '', gallery: [], size: 'One Size', qty: 1, originalPrice: 20 }]);
});

test('a sale card shows the regular price crossed out and charges the sale price', async () => {
  const product: ProductSummary = { _id: 'sale-product', name: 'Watch', image: 'https://example.com/watch.jpg',
    category: ['Accessories'], subCategory: 'Watches', price: 100, salePrice: 75, countInStock: 1, isOnSale: true, isActive: true,
    variants: [{ size: 'One Size', stock: 1 }] };
  render(<Provider store={store}><MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><ProductCard product={product} /></MemoryRouter></Provider>);
  await waitFor(() => expect(screen.getByRole('button', { name: 'Add to Cart' })).toBeEnabled());
  expect(screen.getByText(/USD\s+75\.00/)).toBeInTheDocument();
  expect(screen.getByText(/USD\s+100\.00/).tagName).toBe('S');
  expect(screen.getByText('-25%')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Add to Cart' }));
  expect(store.getState().cart.cartItems[0]).toMatchObject({ price: 75, originalPrice: 100 });
  expect(store.getState().cart.itemsPrice).toBe(75);
});
