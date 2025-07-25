import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const BASE_URL = 'https://ecommerce-backend-production-f46e.up.railway.app';

const baseQuery = fetchBaseQuery({ 
  baseUrl: BASE_URL, 
  credentials: 'include',
  prepareHeaders: (headers) => {
    return headers;
  },
});

// Custom base query with error handling
const baseQueryWithErrorHandling = async (args, api, extraOptions) => {
  try {
    const result = await baseQuery(args, api, extraOptions);
    return result;
  } catch (error) {
    console.error('API Error:', error);
    return {
      error: {
        status: 'FETCH_ERROR',
        error: error.message || 'Network error occurred',
      },
    };
  }
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithErrorHandling,
  tagTypes: ['Product', 'Order', 'User'],
  endpoints: (builder) => ({}),
});