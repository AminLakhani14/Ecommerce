import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './slices/apiSlice';
import cartSliceReducer from './slices/cartSlice';
import authSliceReducer from './slices/authSlice';
import productCreateReducer from './slices/productCreateSlice'; // <-- IMPORT THE NEW REDUCER

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    cart: cartSliceReducer,
    auth: authSliceReducer,
    productCreate: productCreateReducer, // <-- ADD THE NEW REDUCER
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});

export default store;