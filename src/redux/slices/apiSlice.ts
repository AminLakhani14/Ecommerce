import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';

const BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  credentials: "include",
  prepareHeaders: (headers) => {
    return headers;
  },
});

// Custom base query with error handling
const baseQueryWithErrorHandling: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (args, api, extraOptions) => {
  try {
    const result = await baseQuery(args, api, extraOptions);
    return result;
  } catch (error) {
    console.error("API Error:", error);
    return {
      error: {
        status: "FETCH_ERROR",
        error: error instanceof Error ? error.message : "Network error occurred",
      },
    };
  }
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithErrorHandling,
  tagTypes: ["Product", "Order", "User"],
  endpoints: (builder) => ({}),
});
