import { apiSlice } from './apiSlice';

export const productsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: () => ({ url: '/api/products' }),
      keepUnusedDataFor: 5,
    }),
    getProductDetails: builder.query({
      query: (productId) => ({ url: `/api/products/${productId}` }),
      keepUnusedDataFor: 5,
    }),
    // --- START: ADDED NEW ENDPOINTS ---
    createProduct: builder.mutation({
      query: (data) => ({
        url: '/api/products',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Product'], // Invalidate cache to refetch product list
    }),
    getHomepageProducts: builder.query({
      query: () => ({ url: '/api/products/homepage' }),
      keepUnusedDataFor: 5,
    }),
    getProductsByCategory: builder.query({
      query: (categoryName) => ({
        url: `/api/products/category/${categoryName}`,
      }),
      providesTags: (result, error, categoryName) => [{ type: 'Product', id: categoryName }],
    }),
    updateProduct: builder.mutation({
      query: (data) => ({
        url: `/api/products/${data.productId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Product'],
    }),
    deleteProduct: builder.mutation({
      query: (productId) => ({
        url: `/api/products/${productId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Product'],
    }),
    getSaleProducts: builder.query({
      query: () => ({ url: '/api/products/sale' }),
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
} = productsApiSlice;