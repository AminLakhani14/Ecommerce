import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({ 
  baseUrl: '', // Proxy will handle the domain
  credentials: 'include', // Include cookies for authentication
  prepareHeaders: (headers) => {
    // Add any custom headers if needed
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
    // Return a structured error response
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