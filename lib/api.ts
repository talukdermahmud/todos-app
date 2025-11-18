import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { PaginatedTodosResponse } from "./types";

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE,
    timeout: 10000, // 10 seconds timeout
    prepareHeaders: (headers, { getState }) => {
      // Add auth token if available
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (token) headers.set("authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  endpoints: (build) => ({
    signup: build.mutation({
      query: (credentials) => ({
        url: "/users/signup/",
        method: "POST",
        body: credentials,
      }),
    }),
    login: build.mutation({
      query: (credentials) => ({
        url: "/auth/login/",
        method: "POST",
        body: credentials,
      }),
    }),

    getMe: build.query({
      query: () => ({ url: "/users/me/" }),
    }),

    updateMe: build.mutation({
      query: (userData) => ({
        url: "/users/me/",
        method: "PATCH",
        body: userData,
      }),
    }),

    updateProfileImage: build.mutation({
      query: (formData) => ({
        url: "/users/me/",
        method: "PATCH",
        body: formData,
      }),
    }),

    changePassword: build.mutation({
      query: (passwords) => ({
        url: "/users/change-password/",
        method: "POST",
        body: passwords,
      }),
    }),

    getTodos: build.query<
      PaginatedTodosResponse,
      Record<string, string | number | undefined>
    >({
      query: (params = {}) => ({ url: "/todos/", params }),
    }),

    createTodo: build.mutation({
      query: (todo) => ({
        url: "/todos/",
        method: "POST",
        body: todo,
      }),
    }),
    updateTodo: build.mutation({
      query: ({ id, ...updates }) => ({
        url: `/todos/${id}/`,
        method: "PATCH",
        body: updates,
      }),
    }),
    deleteTodo: build.mutation({
      query: (id) => ({
        url: `/todos/${id}/`,
        method: "DELETE",
      }),
    }),

    reorderTodos: build.mutation({
      query: ({ id, ...order }) => ({
        url: `/todos/${id}/`,
        method: "PATCH",
        body: order,
      }),
    }),
  }),
});

export const {
  useSignupMutation,
  useLoginMutation,
  useGetMeQuery,
  useUpdateMeMutation,
  useUpdateProfileImageMutation,
  useChangePasswordMutation,
  useGetTodosQuery,
  useCreateTodoMutation,
  useUpdateTodoMutation,
  useDeleteTodoMutation,
  useReorderTodosMutation,
} = api;
