import { render, screen, within } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import store from './redux/store';
import App from './App';

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
