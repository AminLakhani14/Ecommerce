import type { Product, UserInfo, Order, OrderInput } from '../../types';
import { apiSlice } from './apiSlice';

export const productsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<Product[], void>({
      query: () => ({ url: '/api/products' }),
      providesTags: ['Product'],
      keepUnusedDataFor: 5,
    }),
    getProductDetails: builder.query<Product, string | undefined>({
      query: (productId) => ({ url: `/api/products/${productId}` }),
      providesTags: (result, error, id) => [{ type: 'Product', id }],
      keepUnusedDataFor: 5,
    }),
    // --- START: ADDED NEW ENDPOINTS ---
    createProduct: builder.mutation<Product, FormData>({
      query: (data) => ({
        url: '/api/products',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Product'], // Invalidate cache to refetch product list
    }),
    getHomepageProducts: builder.query<Record<string, Product[]>, void>({
      query: () => ({ url: '/api/products/homepage' }),
      providesTags: ['Product'],
      keepUnusedDataFor: 5,
    }),
    getProductsByCategory: builder.query<Product[], string | undefined>({
      query: (categoryName) => ({
        url: `/api/products/category/${categoryName}`,
      }),
      providesTags: ['Product'],
    }),
    updateProduct: builder.mutation<Product, { productId: string | undefined; formData: FormData }>({
      query: (data) => ({
        url: `/api/products/${data.productId}`,
        method: 'PUT',
        body: data.formData,
      }),
      invalidatesTags: ['Product'],
    }),
    deleteProduct: builder.mutation<{ message: string }, string>({
      query: (productId) => ({
        url: `/api/products/${productId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Product'],
    }),
    getSaleProducts: builder.query<Product[], void>({
      query: () => ({ url: '/api/products/sale' }),
      providesTags: ['Product'],
    }),
    getProductsBySubCategory: builder.query<Product[], string | undefined>({
      query: (subCategoryName) => ({
        url: `/api/products/subcategory/${encodeURIComponent(subCategoryName || '')}`,
      }),
      providesTags: ['Product'],
    }),
    getProductsByFilter: builder.query<Product[], { category: string | undefined; subCategory: string | undefined }>({
      query: ({ category, subCategory }) => ({
        url: `/api/products/filter/${encodeURIComponent(category || '')}/${encodeURIComponent(subCategory || '')}`,
      }),
      providesTags: ['Product'],
    }),
    // --- END: ADDED NEW ENDPOINTS ---
  }),
});

// Export the new hooks alongside the old ones
export const {
  useGetProductsQuery,
  useGetProductDetailsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetHomepageProductsQuery,
  useGetProductsByCategoryQuery,
  useGetSaleProductsQuery,
  useGetProductsBySubCategoryQuery,
  useGetProductsByFilterQuery, 
} = productsApiSlice;