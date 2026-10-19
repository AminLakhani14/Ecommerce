import { fireEvent, render, screen, waitFor, cleanup } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { vi } from 'vitest';
import ProductCreatePage from './ProductCreatePage';
import ProductEditPage from './ProductEditPage';
import SettingsPage from './SettingsPage';

const mocks = vi.hoisted(() => ({
  create: vi.fn(), update: vi.fn(), createCategory: vi.fn(), deleteCategory: vi.fn(),
  categories: { data: ['Men', 'Women', 'Bags'], isLoading: false, error: undefined as unknown, refetch: vi.fn() },
  product: { _id: 'p1', name: 'Travel bag', description: 'Test', price: 20, image: 'https://example.com/bag.jpg', gallery: [],
    category: ['Men', 'Bags'] as string | string[], subCategory: 'Bags', isOnSale: false, variants: [{ size: 'One Size', stock: 2 }] },
}));

vi.mock('../../redux/slices/categoriesApiSlice', () => ({
  useGetCategoriesQuery: () => mocks.categories,
  useCreateCategoryMutation: () => [mocks.createCategory, { isLoading: false, reset: vi.fn() }],
  useDeleteCategoryMutation: () => [mocks.deleteCategory, { isLoading: false, reset: vi.fn() }],
}));
vi.mock('../../redux/slices/productsApiSlice', () => ({
  useCreateProductMutation: () => [mocks.create, { isLoading: false }],
  useUpdateProductMutation: () => [mocks.update, { isLoading: false }],
  useGetAdminProductDetailsQuery: () => ({ data: mocks.product, isLoading: false }),
}));

beforeEach(() => {
  mocks.create.mockReset().mockReturnValue({ unwrap: () => Promise.resolve({}) });
  mocks.update.mockReset().mockReturnValue({ unwrap: () => Promise.resolve({}) });
  mocks.createCategory.mockReset().mockReturnValue({ unwrap: () => Promise.resolve({ name: 'Travel Bags' }) });
  mocks.deleteCategory.mockReset().mockReturnValue({ unwrap: () => Promise.resolve({ message: 'Category "Bags" removed successfully.' }) });
  mocks.categories.error = undefined;
  mocks.product.category = ['Men', 'Bags'];
});
afterEach(cleanup);

const wrapper = (page: React.ReactNode) => <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>{page}</MemoryRouter>;

test('product creation allows multiple checkbox selections and sends all categories', async () => {
  const { container } = render(wrapper(<ProductCreatePage />));
  fireEvent.click(screen.getByRole('button', { name: 'Categories' }));
  fireEvent.click(screen.getByRole('checkbox', { name: 'Men' }));
  fireEvent.click(screen.getByRole('checkbox', { name: 'Bags' }));
  expect(screen.getByRole('button', { name: 'Categories' })).toHaveAttribute('aria-expanded', 'true');
  expect(screen.getByRole('button', { name: 'Categories' })).toHaveTextContent('Men, Bags');
  expect(screen.getByRole('checkbox', { name: 'Men' })).toBeChecked();
  expect(screen.getByRole('checkbox', { name: 'Bags' })).toBeChecked();
  fireEvent.change(screen.getByLabelText(/Product Name/), { target: { value: 'Travel bag' } });
  fireEvent.change(screen.getByLabelText(/Description/), { target: { value: 'Canvas travel bag' } });
  fireEvent.change(screen.getByLabelText(/Sub-Category/), { target: { value: 'Bags' } });
  fireEvent.change(screen.getByLabelText(/^Price/), { target: { value: '2000' } });
  fireEvent.change(screen.getByLabelText('Option / size'), { target: { value: 'One Size' } });
  fireEvent.change(screen.getByLabelText('Stock'), { target: { value: '5' } });
  fireEvent.change(screen.getByLabelText('Image URL'), { target: { value: 'https://example.com/bag.jpg' } });
  fireEvent.submit(container.querySelector('form')!);
  await waitFor(() => expect(mocks.create).toHaveBeenCalledOnce());
  expect(JSON.parse(mocks.create.mock.calls[0][0].get('category'))).toEqual(['Men', 'Bags']);
  await screen.findByText('Product created successfully');
});

test('product creation requires at least one category', async () => {
  const { container } = render(wrapper(<ProductCreatePage />));
  fireEvent.submit(container.querySelector('form')!);
  expect(await screen.findByText('Select at least one category.')).toBeInTheDocument();
  expect(mocks.create).not.toHaveBeenCalled();
});

test.each([{ category: ['Men', 'Bags'] }, { category: 'Men' }])('editing loads category selection $category and can update it', async ({ category }) => {
  mocks.product.category = category;
  const { container } = render(<MemoryRouter initialEntries={['/admin/product/p1/edit']} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
    <Routes><Route path='/admin/product/:id/edit' element={<ProductEditPage />} /></Routes>
  </MemoryRouter>);
  fireEvent.click(screen.getByRole('button', { name: 'Categories' }));
  expect(screen.getByRole('checkbox', { name: 'Men' })).toBeChecked();
  fireEvent.click(screen.getByRole('checkbox', { name: 'Women' }));
  fireEvent.click(screen.getByRole('checkbox', { name: 'Men' }));
  fireEvent.submit(container.querySelector('form')!);
  await waitFor(() => expect(mocks.update).toHaveBeenCalledOnce());
  const request = mocks.update.mock.calls[0][0];
  expect(request.productId).toBe('p1');
  expect(JSON.parse(request.formData.get('category'))).toEqual(Array.isArray(category) ? ['Bags', 'Women'] : ['Women']);
  await screen.findByText('Product updated successfully');
});

test('settings creates a category, clears the form, and confirms success', async () => {
  render(wrapper(<SettingsPage />));
  fireEvent.change(screen.getByLabelText('Category Name'), { target: { value: '  Travel Bags  ' } });
  fireEvent.click(screen.getByRole('button', { name: 'Add Category' }));
  await screen.findByRole('status');
  expect(mocks.createCategory).toHaveBeenCalledWith({ name: 'Travel Bags' });
  expect(screen.getByLabelText('Category Name')).toHaveValue('');
  expect(screen.getByText('Category “Travel Bags” created successfully.')).toBeInTheDocument();
});

test('category loading failure provides a retry action', () => {
  mocks.categories.error = { data: { message: 'Unable to load categories.' } };
  render(wrapper(<ProductCreatePage />));
  expect(screen.getByRole('button', { name: 'Categories' })).toBeDisabled();
  fireEvent.click(screen.getByRole('button', { name: 'Retry' }));
  expect(mocks.categories.refetch).toHaveBeenCalled();
});

test('settings requires confirmation before removing a category', async () => {
  render(wrapper(<SettingsPage />));
  fireEvent.click(screen.getByRole('button', { name: 'Remove Bags' }));
  expect(screen.getByRole('dialog')).toHaveTextContent('Products will be kept; those with no categories left will be hidden from shoppers until a category is assigned.');
  expect(mocks.deleteCategory).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole('button', { name: 'Remove Category' }));
  await waitFor(() => expect(mocks.deleteCategory).toHaveBeenCalledWith('Bags'));
  await screen.findByText('Category "Bags" removed successfully.');
  await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
});

test('canceling category removal leaves the category untouched', async () => {
  render(wrapper(<SettingsPage />));
  fireEvent.click(screen.getByRole('button', { name: 'Remove Men' }));
  fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
  await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  expect(mocks.deleteCategory).not.toHaveBeenCalled();
});
