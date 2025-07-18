import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({ baseUrl: '' }); // Proxy will handle the domain

export const apiSlice = createApi({
  baseQuery,
  tagTypes: ['Product', 'Order', 'User'],
  endpoints: (builder) => ({}),
});