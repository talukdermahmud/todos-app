import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE,
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
        url: "/auth/signup",
        method: "POST",
        body: credentials,
      }),
    }),
    login: build.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),
    getTodos: build.query({
      query: () => "/todos",
    }),
    createTodo: build.mutation({
      query: (todo) => ({
        url: "/todos",
        method: "POST",
        body: todo,
      }),
    }),
    updateTodo: build.mutation({
      query: ({ id, ...updates }) => ({
        url: `/todos/${id}`,
        method: "PUT",
        body: updates,
      }),
    }),
    deleteTodo: build.mutation({
      query: (id) => ({
        url: `/todos/${id}`,
        method: "DELETE",
      }),
    }),
    reorderTodos: build.mutation({
      query: (order) => ({
        url: "/todos/reorder",
        method: "PATCH",
        body: { order },
      }),
    }),
  }),
});

export const {
  useSignupMutation,
  useLoginMutation,
  useGetTodosQuery,
  useCreateTodoMutation,
  useUpdateTodoMutation,
  useDeleteTodoMutation,
  useReorderTodosMutation,
} = api;
