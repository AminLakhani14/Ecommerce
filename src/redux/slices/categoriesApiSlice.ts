import { apiSlice } from './apiSlice';

export const categoriesApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getCategories: builder.query<string[], void>({
      query: () => '/api/categories',
      providesTags: ['Category'],
    }),
    createCategory: builder.mutation<{ name: string }, { name: string }>({
      query: body => ({ url: '/api/categories', method: 'POST', body }),
      invalidatesTags: ['Category'],
    }),
    deleteCategory: builder.mutation<{ message: string }, string>({
      query: name => ({ url: `/api/categories/${encodeURIComponent(name)}`, method: 'DELETE' }),
      invalidatesTags: ['Category', 'Product'],
    }),
  }),
});

export const { useGetCategoriesQuery, useCreateCategoryMutation, useDeleteCategoryMutation } = categoriesApiSlice;
