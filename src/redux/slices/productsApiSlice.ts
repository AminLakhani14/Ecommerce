import type { Product, ProductReviews, ProductSummary, ReviewEligibility } from '../../types';
import { apiSlice } from './apiSlice';

export const productsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAdminProducts: builder.query<Product[], void>({
      query: () => ({ url: '/api/products/admin' }),
      providesTags: ['Product'],
    }),
    getAdminProductDetails: builder.query<Product, string | undefined>({
      query: id => ({ url: `/api/products/admin/${id}` }),
      providesTags: (result, error, id) => [{ type: 'Product', id }],
    }),
    getProducts: builder.query<Product[], void>({
      query: () => ({ url: '/api/products' }),
      providesTags: ['Product'],
      keepUnusedDataFor: 60,
    }),
    getProductDetails: builder.query<Product, string | undefined>({
      query: (productId) => ({ url: `/api/products/${productId}` }),
      providesTags: (result, error, id) => [{ type: 'Product', id }],
      keepUnusedDataFor: 60,
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
    getHomepageProducts: builder.query<Record<string, ProductSummary[]>, void>({
      query: () => ({ url: '/api/products/homepage' }),
      providesTags: ['Product'],
      keepUnusedDataFor: 60,
    }),
    getProductsByCategory: builder.query<Product[], string | undefined>({
      query: (categoryName) => ({
        url: `/api/products/category/${encodeURIComponent(categoryName || '')}`,
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
    getProductReviews: builder.query<ProductReviews, string>({
      query: (productId) => ({ url: `/api/products/${productId}/reviews` }),
      providesTags: (result, error, id) => [{ type: 'Review', id }],
    }),
    getReviewEligibility: builder.query<ReviewEligibility, string>({
      query: (productId) => ({ url: `/api/products/${productId}/reviews/eligibility` }),
      providesTags: (result, error, id) => [{ type: 'Review', id }],
    }),
    createReview: builder.mutation<unknown, { productId: string; rating: number; title: string; comment: string }>({
      query: ({ productId, ...body }) => ({
        url: `/api/products/${productId}/reviews`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (result, error, { productId }) => [{ type: 'Review', id: productId }],
    }),
    getRelatedProducts: builder.query<ProductSummary[], string>({
      query: (productId) => ({ url: `/api/products/${productId}/related` }),
      providesTags: ['Product'],
    }),
    // --- END: ADDED NEW ENDPOINTS ---
  }),
});

// Export the new hooks alongside the old ones
export const {
  useGetAdminProductsQuery,
  useGetAdminProductDetailsQuery,
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
  useGetProductReviewsQuery,
  useGetReviewEligibilityQuery,
  useCreateReviewMutation,
  useGetRelatedProductsQuery,
} = productsApiSlice;
