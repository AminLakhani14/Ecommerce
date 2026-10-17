import reducer, { addToCart, removeFromCart, saveShippingAddress } from './cartSlice';
import type { CartItem, CartState, ShippingAddress } from '../../types';

const item: CartItem = {
  _id: 'product-1', name: 'Shirt', price: 2000, qty: 2, size: 'M',
  image: '/uploads/shirt.jpg', gallery: [], description: 'Cotton shirt',
  category: 'Men', subCategory: 'T-shirt', countInStock: 10,
  isOnSale: false, isActive: true, variants: [{ size: 'M', stock: 10 }, { size: 'L', stock: 10 }],
};
const empty = (): CartState => ({ cartItems: [], shippingAddress: {}, itemsPrice: 0, shippingPrice: 0, taxPrice: 0, totalPrice: '0.00' });
beforeEach(() => localStorage.clear());

test('updates quantities by product and size and persists totals', () => {
  let state = reducer(empty(), addToCart(item));
  expect(state.totalPrice).toBe('4200.00');
  state = reducer(state, addToCart({ ...item, qty: 3 }));
  expect(state.cartItems).toHaveLength(1);
  expect(state.shippingPrice).toBe(0);
  expect(state.totalPrice).toBe('6000.00');
  state = reducer(state, addToCart({ ...item, size: 'L', qty: 1 }));
  state = reducer(state, removeFromCart({ id: item._id, size: 'M' }));
  expect(state.cartItems[0].size).toBe('L');
  expect(JSON.parse(localStorage.getItem('cart')!).totalPrice).toBe('2200.00');
});

test('rejects variants without a selected size and preserves shipping details', () => {
  expect(reducer(empty(), addToCart({ ...item, size: '' })).cartItems).toEqual([]);
  const address: ShippingAddress = { email: 'customer@example.com', firstName: 'A', lastName: 'B', address: '1 Main St', city: 'Karachi', state: 'Sindh', postalCode: '74000', country: 'Pakistan', phone: '123456789' };
  expect(reducer(empty(), saveShippingAddress(address)).shippingAddress).toEqual(address);
});
