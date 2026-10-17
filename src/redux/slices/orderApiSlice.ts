import type { Product, UserInfo, Order, OrderInput } from '../../types';
import { apiSlice } from './apiSlice';

export const orderApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // This mutation will handle creating the order
    createOrder: builder.mutation<Order, OrderInput>({
      query: (order) => ({
        url: '/api/orders',
        method: 'POST',
        body: order,
      }),
    }),
    
    // This query will get the details of a specific order
    getOrderDetails: builder.query<Order, string | undefined>({
      query: (orderId) => ({
        url: `/api/orders/${orderId}`,
      }),
      keepUnusedDataFor: 5,
    }),

    getMyOrders: builder.query<Order[], void>({
      query: () => ({
        url: `/api/orders/myorders`,
      }),
      keepUnusedDataFor: 5,
    }),

    getOrders: builder.query<Order[], void>({
      query: () => ({
        url: '/api/orders',
      }),
      providesTags: ['Order'], // Tagging for auto-refetch
      keepUnusedDataFor: 5,
    }),
    deliverOrder: builder.mutation<Order, string>({
      query: (orderId) => ({
        url: `/api/orders/${orderId}/deliver`,
        method: 'PUT',
      }),
      invalidatesTags: ['Order'], // Invalidate the order list on update
    }),
    cancelOrder: builder.mutation<Order, string>({
      query: (orderId) => ({
        url: `/api/orders/${orderId}/cancel`,
        method: 'PUT',
      }),
      invalidatesTags: ['Order'], // Invalidate the order list
    }),
    // This mutation will simulate the payment
    payOrder: builder.mutation<Order, string | undefined>({
      query: (orderId) => ({
        url: `/api/orders/${orderId}/pay`,
        method: 'PUT',
      }),
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetOrderDetailsQuery,
  usePayOrderMutation,
  useGetMyOrdersQuery,
  useGetOrdersQuery,
  useDeliverOrderMutation,
  useCancelOrderMutation, 
} = orderApiSlice;