import type { Product, UserInfo, Order, OrderInput } from '../../types';
import { apiSlice } from './apiSlice';

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<UserInfo, { email: string; password: string }>({
      query: (data) => ({
        url: `/api/users/login`,
        method: 'POST',
        body: data,
      }),
    }),
    register: builder.mutation<UserInfo, { name: string; email: string; password: string }>({
      query: (data) => ({
        url: `/api/users/register`,
        method: 'POST',
        body: data,
      }),
    }),
    logout: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: `/api/users/logout`,
        method: 'POST',
      }),
    }),
    updateProfile: builder.mutation<UserInfo, { name: string; email: string; password?: string; _id?: string }>({
      query: (data) => ({
        url: `/api/users/profile`,
        method: 'PUT',
        body: data,
      }),
    }),
  }),
});

export const { useLoginMutation, useLogoutMutation, useRegisterMutation, useUpdateProfileMutation } = usersApiSlice;