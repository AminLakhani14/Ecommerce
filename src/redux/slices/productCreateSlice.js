import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// The Asynchronous Thunk Action
export const createProduct = createAsyncThunk(
    'products/create',
    async (formData, { rejectWithValue }) => {
      try {
        // The API call using axios
        const { data } = await axios.post('/api/products', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true, // <-- THIS IS THE CRITICAL FIX
        });
        return data;
      } catch (error) {
        console.error('Error in createProduct thunk:', error.response.data);
        return rejectWithValue(error.response.data);
      }
    }
  );

const productCreateSlice = createSlice({
  name: 'productCreate',
  initialState: {
    loading: false,
    success: false,
    error: null,
  },
  reducers: {
    // A reset action to clear the state after the component navigates away
    productCreateReset: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },
  // Handle the different states of the async thunk
  extraReducers: (builder) => {
    builder
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(createProduct.fulfilled, (state) => {
        state.loading = false;
        console.log('first')
        state.success = true;
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { productCreateReset } = productCreateSlice.actions;
export default productCreateSlice.reducer;