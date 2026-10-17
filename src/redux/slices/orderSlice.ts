import type { Order, OrderInput } from '../../types';
import { getErrorMessage } from '../../utils/getErrorMessage';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Thunk to create an order
export const createOrder = createAsyncThunk<Order, OrderInput, { rejectValue: string }>(
  'order/create',
  async (orderData, { rejectWithValue, dispatch }) => {
    try {
      const { data } = await axios.post<Order>(`${(import.meta.env.VITE_API_URL || '').replace(/\/$/, '')}/api/orders`, orderData, { withCredentials: true });
      return data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState: {
    order: null,
    loading: false,
    error: null,
  } as { order: Order | null; loading: boolean; error: string | null },
  reducers: {
    orderReset: (state) => {
      state.order = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message || "Request failed";
      });
  },
});

export const { orderReset } = orderSlice.actions;
export default orderSlice.reducer;