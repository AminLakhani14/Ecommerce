import type { CartState } from '../types';
// Orders with a subtotal above this amount ship free; everything else pays the standard rate.
export const FREE_SHIPPING_THRESHOLD = 5000;
export const STANDARD_SHIPPING = 200;
export const updateCart = (state: CartState) => {
    state.itemsPrice = Number(
      state.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0).toFixed(2)
    );

    state.shippingPrice = state.cartItems.length === 0 || state.itemsPrice > FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING;
    state.taxPrice = 0;

    state.totalPrice = (
      state.itemsPrice +
      state.shippingPrice +
      state.taxPrice
    ).toFixed(2);

    localStorage.setItem('cart', JSON.stringify(state));

    return state;
  };
