import { render, screen, within, fireEvent, cleanup } from '@testing-library/react';
import { vi } from 'vitest';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import store from './redux/store';
import App from './App';
import { setCredentials, logout } from './redux/slices/authSlice';
import CategoryShowcase from './components/CategoryShowcase';
import TabbedProductShowcase from './components/TabbedProductShowcase';

const categoryState = vi.hoisted(() => ({ data: [] as string[] }));

vi.mock('./redux/slices/categoriesApiSlice', () => ({
  useGetCategoriesQuery: () => categoryState,
}));

beforeEach(() => { categoryState.data = ['Men', 'Women', 'Children', 'Accessories', 'Backpacks', 'Clothing', 'Bags']; });
afterEach(() => { cleanup(); store.dispatch(logout()); });

test('renders the store layout with navigation and an empty cart', () => {
  render(<Provider store={store}><MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><App /></MemoryRouter></Provider>);
  expect(screen.getByRole('link', { name: 'AG-Store' })).toHaveAttribute('href', '/');
  expect(screen.getByRole('link', { name: /cart/i })).toHaveAttribute('href', '/cart');
  expect(screen.getByRole('link', { name: /sign in/i })).toHaveAttribute('href', '/login');
  const navigation = within(screen.getByRole('navigation'));
  for (const [name, path] of [['About Us', '/about'], ['Accessories', '/category/accessories'], ['Backpacks', '/category/backpacks'], ['Clothing', '/category/clothing']]) {
    expect(navigation.getByRole('link', { name })).toHaveAttribute('href', path);
  }
});

test('removed categories disappear from navigation, footer links, collection cards, and shopping tabs', () => {
  categoryState.data = ['Women'];
  render(<Provider store={store}><MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
    <App /><CategoryShowcase /><TabbedProductShowcase />
  </MemoryRouter></Provider>);
  const navigation = within(screen.getByRole('navigation'));
  expect(navigation.queryByRole('link', { name: 'Men' })).not.toBeInTheDocument();
  expect(navigation.getByRole('link', { name: 'Women' })).toBeInTheDocument();
  expect(screen.queryByRole('heading', { name: "Men's Fashion" })).not.toBeInTheDocument();
  expect(screen.getByRole('heading', { name: "Women's Fashion" })).toBeInTheDocument();
  expect(screen.queryByRole('heading', { name: 'Explore the collections' })).not.toBeInTheDocument();
  expect(screen.queryByRole('button', { name: 'Men' })).not.toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Women' })).toBeInTheDocument();
});

test('admin menu precedes the user menu and includes Settings; custom categories are linked', () => {
  store.dispatch(setCredentials({ _id: 'admin1', name: 'Admin User', email: 'admin@example.com', isAdmin: true }));
  render(<Provider store={store}><MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><App /></MemoryRouter></Provider>);
  const navigation = within(screen.getByRole('navigation'));
  const admin = navigation.getByRole('button', { name: 'Admin' });
  const user = navigation.getByRole('button', { name: 'Admin User' });
  expect(admin.compareDocumentPosition(user) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  expect(navigation.getByRole('link', { name: 'Bags' })).toHaveAttribute('href', '/category/bags');
  fireEvent.click(admin);
  expect(navigation.getByRole('link', { name: 'Settings' })).toHaveAttribute('href', '/admin/settings');
});
