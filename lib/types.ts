import { DefaultSession } from "next-auth";

export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
}

export type Priority = "extreme" | "moderate" | "low";

export interface TodoApiResponse {
  id: number;
  title: string;
  description: string;
  todo_date: string;
  priority: Priority;
}

export interface PaginatedTodosResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: TodoApiResponse[];
}

export interface User {
  id: string;
  email: string;
  name?: string;
}
