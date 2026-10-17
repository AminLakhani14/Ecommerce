import type { PayloadAction } from '@reduxjs/toolkit';
import type { CartState, CartItem, ShippingAddress } from '../../types';
import { createSlice } from '@reduxjs/toolkit';
import { updateCart } from '../../utils/cartUtils';

const initialState: CartState = localStorage.getItem('cart')
  ? JSON.parse(localStorage.getItem('cart')!)
  : { cartItems: [], shippingAddress: {}, itemsPrice: 0, shippingPrice: 0, taxPrice: 0, totalPrice: '0.00' };

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const itemToAdd = action.payload;
      if (itemToAdd.variants && itemToAdd.variants.length > 0 && !itemToAdd.size) {
        return state; 
      }

      const existItem = state.cartItems.find(
        (x) => x._id === itemToAdd._id && x.size === itemToAdd.size
      );

      if (existItem) {
        state.cartItems = state.cartItems.map((x) =>
          x._id === existItem._id && x.size === existItem.size ? itemToAdd : x
        );
      }else {
        state.cartItems.push(itemToAdd); 
      }
      return updateCart(state);
    },
    removeFromCart: (state, action: PayloadAction<{ id: string; size: string }>) => {
      const { id, size } = action.payload;

      const itemIndex = state.cartItems.findIndex(
        (item) => item._id === id && item.size === size
      );
      if (itemIndex > -1) {
        state.cartItems.splice(itemIndex, 1);
      }
      
      return updateCart(state);
    },
    saveShippingAddress: (state, action: PayloadAction<ShippingAddress>) => {
        state.shippingAddress = action.payload;
        return updateCart(state);
    },
    clearCartItems: (state) => {
      state.cartItems = [];
      return updateCart(state);
    },
  },
});

export const { 
  addToCart, 
  removeFromCart, 
  saveShippingAddress, 
  clearCartItems 
} = cartSlice.actions;

export default cartSlice.reducer;