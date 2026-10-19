import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { Link, MemoryRouter, useNavigate } from 'react-router-dom';
import { afterEach, expect, test, vi } from 'vitest';
import ScrollToTop from './ScrollToTop';

afterEach(() => { cleanup(); vi.restoreAllMocks(); });

function Navigation() {
  const navigate = useNavigate();
  return <><ScrollToTop /><Link to='/category/men'>Men</Link><Link to='/category/women'>Women</Link><button onClick={() => navigate(-1)}>Back</button></>;
}

test('resets scroll on initial load, category navigation, and back navigation', () => {
  const scroll = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
  render(<MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><Navigation /></MemoryRouter>);
  expect(scroll).toHaveBeenLastCalledWith({ top: 0, left: 0, behavior: 'instant' });
  for (const name of ['Men', 'Women']) {
    scroll.mockClear();
    fireEvent.click(screen.getByRole('link', { name }));
    expect(scroll).toHaveBeenCalledOnce();
    expect(scroll).toHaveBeenLastCalledWith({ top: 0, left: 0, behavior: 'instant' });
  }
  scroll.mockClear();
  fireEvent.click(screen.getByRole('button', { name: 'Back' }));
  expect(scroll).toHaveBeenCalledOnce();
});
