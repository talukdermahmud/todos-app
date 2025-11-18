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
  { bg: string; badge: string; dot: string; border?: string }
> = {
  extreme: {
    bg: "bg-red-50",
    badge: "bg-[#FEE2E2] text-red-700",
    dot: "bg-red-500",
    border: "border-red-500/15",
  },
  moderate: {
    bg: "bg-green-50",
    badge: "bg-[#DCFCE7] text-green-700",
    dot: "bg-green-500",
    border: "border-green-500/15",
  },
  low: {
    bg: "bg-yellow-50",
    badge: "bg-[#FEF9C3] text-yellow-700",
    dot: "bg-yellow-500",
    border: "border-yellow-500/15",
  },
};
