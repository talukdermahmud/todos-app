// These are moved to lib/types.ts for API types
import type {
  Priority,
  TodoApiResponse,
  PaginatedTodosResponse,
} from "../../lib/types";

export interface Task {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  priority: Priority;
}

export interface NewTaskForm {
  title: string;
  date: string;
  priority: Priority;
  description: string;
}

// Re-export for convenience
export type { TodoApiResponse, PaginatedTodosResponse };

export const PriorityColors: Record<
  Priority,
  { bg: string; badge: string; dot: string }
> = {
  extreme: {
    bg: "bg-red-50",
    badge: "bg-red-100 text-red-700",
    dot: "bg-red-500",
  },
  moderate: {
    bg: "bg-green-50",
    badge: "bg-green-100 text-green-700",
    dot: "bg-green-500",
  },
  low: {
    bg: "bg-yellow-50",
    badge: "bg-yellow-100 text-yellow-700",
    dot: "bg-yellow-500",
  },
};
