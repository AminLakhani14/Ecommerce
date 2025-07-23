import { apiSlice } from './apiSlice';

export const productsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: () => ({ url: '/api/products' }),
      providesTags: ['Product'],
      keepUnusedDataFor: 5,
    }),
    getProductDetails: builder.query({
      query: (productId) => ({ url: `/api/products/${productId}` }),
      providesTags: (result, error, id) => [{ type: 'Product', id }],
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
      providesTags: ['Product'],
      keepUnusedDataFor: 5,
    }),
    getProductsByCategory: builder.query({
      query: (categoryName) => ({
        url: `/api/products/category/${categoryName}`,
      }),
      providesTags: ['Product'],
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
    getProductsBySubCategory: builder.query({
      query: (subCategoryName) => ({
        url: `/api/products/subcategory/${encodeURIComponent(subCategoryName)}`,
      }),
      providesTags: ['Product'],
    }),
    getProductsByFilter: builder.query({
      query: ({ category, subCategory }) => ({
        url: `/api/products/filter/${encodeURIComponent(category)}/${encodeURIComponent(subCategory)}`,
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