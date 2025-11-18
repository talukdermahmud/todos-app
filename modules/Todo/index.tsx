"use client";

import { ArrowUpDown, Plus, Search, GripVertical } from "lucide-react";
import { CSS } from "@dnd-kit/utilities";
import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import Loader from "../../components/Loader";
import { useToaster } from "../../components/Toaster";
import {
  useCreateTodoMutation,
  useDeleteTodoMutation,
  useLazyGetTodosQuery,
  useUpdateTodoMutation,
} from "../../lib/api";
import AddTaskModal from "./AddTaskModal";
import { NewTaskForm, PriorityColors, Task, TodoApiResponse } from "./types";

export default function Todos() {
  const { showToast } = useToaster();
  const [triggerGetTodos, { data: todos, isLoading, error }] =
    useLazyGetTodosQuery();
  const [createTodo, { isLoading: isCreating }] = useCreateTodoMutation();
  const [updateTodo, { isLoading: isUpdating }] = useUpdateTodoMutation();
  const [deleteTodo, { isLoading: isDeleting }] = useDeleteTodoMutation();

  const [showModal, setShowModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const getTodayDateString = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const [newTask, setNewTask] = useState<NewTaskForm>({
    title: "",
    date: getTodayDateString(),
    priority: "moderate",
    description: "",
  });
  const [errors, setErrors] = useState({
    title: "",
    date: "",
    description: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [orderedTasks, setOrderedTasks] = useState<Task[]>([]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    triggerGetTodos({});
  }, []);

  const tasks = useMemo(
    () =>
      todos?.results
        ? todos.results.map((todo: TodoApiResponse) => ({
            id: todo.id,
            title: todo.title,
            description: todo.description,
            dueDate: todo.todo_date,
            priority: todo.priority,
          }))
        : [],
    [todos]
  );

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (selectedFilters.length === 0) return true;

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const taskDate = new Date(task.dueDate);
      taskDate.setHours(0, 0, 0, 0);

      return selectedFilters.some((filter) => {
        if (filter === "Deadline Today") {
          return taskDate.getTime() === today.getTime();
        }
        if (filter === "Expires in 5 days") {
          const limit = new Date(today);
          limit.setDate(today.getDate() + 5);
          return taskDate <= limit;
        }
        if (filter === "Expires in 10 days") {
          const limit = new Date(today);
          limit.setDate(today.getDate() + 10);
          return taskDate <= limit;
        }
        if (filter === "Expires in 30 days") {
          const limit = new Date(today);
          limit.setDate(today.getDate() + 30);
          return taskDate <= limit;
        }
        return false;
      });
    });
  }, [tasks, selectedFilters]);

  useEffect(() => {
    setOrderedTasks(filteredTasks);
  }, [filteredTasks]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }
    const oldIndex = orderedTasks.findIndex(
      (item) => item.id.toString() === active.id
    );
    const newIndex = orderedTasks.findIndex(
      (item) => item.id.toString() === over.id
    );

    const newOrderedTasks = arrayMove(orderedTasks, oldIndex, newIndex);
    setOrderedTasks(newOrderedTasks);

    // Update position in API
    const draggedTaskId = parseInt(active.id.toString());
    const draggedTask = orderedTasks.find((t) => t.id === draggedTaskId);
    if (draggedTask) {
      updateTodo({
        id: draggedTaskId,
        title: draggedTask.title,
        description: draggedTask.description,
        todo_date: draggedTask.dueDate,
        priority: draggedTask.priority,
        position: newIndex,
      })
        .unwrap()
        .then(() => {
          showToast("Todo position updated!", "success");
        })
        .catch((error) => {
          console.error("Failed to update position:", error);
          showToast("Failed to update position.", "error");
          setOrderedTasks(filteredTasks);
        });
    }
  };

  const handleSearch = async () => {
    await triggerGetTodos(searchQuery ? { search: searchQuery } : {});
    if (searchQuery.trim()) {
      showToast("Search completed", "success");
    }
  };

  const validateForm = () => {
    const newErrors = {
      title: "",
      date: "",
      description: "",
    };
    let isValid = true;

    if (!newTask.title.trim()) {
      newErrors.title = "Title is required";
      isValid = false;
    }
    if (!newTask.date) {
      newErrors.date = "Date is required";
      isValid = false;
    }
    if (!newTask.description.trim()) {
      newErrors.description = "Description is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleEditTask = (task: Task) => {
    setIsEditing(true);
    setEditingTaskId(task.id);
    setNewTask({
      title: task.title,
      date: task.dueDate,
      priority: task.priority,
      description: task.description,
    });
    setShowModal(true);
  };

  const handleAddOrUpdateTask = async () => {
    if (validateForm()) {
      try {
        if (isEditing && editingTaskId) {
          // Update
          await updateTodo({
            id: editingTaskId,
            title: newTask.title,
            description: newTask.description,
            todo_date: new Date(newTask.date).toISOString().split("T")[0],
            priority: newTask.priority,
          });
          showToast("Todo updated successfully!", "success");
        } else {
          // Create
          await createTodo({
            title: newTask.title,
            description: newTask.description,
            todo_date: new Date(newTask.date).toISOString().split("T")[0],
            priority: newTask.priority,
          });
          showToast("Todo created successfully!", "success");
        }
        await triggerGetTodos(searchQuery ? { search: searchQuery } : {});
        setNewTask({
          title: "",
          date: getTodayDateString(),
          priority: "moderate",
          description: "",
        });
        setErrors({
          title: "",
          date: "",
          description: "",
        });
        setShowModal(false);
        setIsEditing(false);
        setEditingTaskId(null);
      } catch (error) {
        console.error("Failed to save todo:", error);
        showToast("Failed to save todo. Please try again.", "error");
      }
    }
  };

  const handleDeleteTask = async (id: number) => {
    try {
      await deleteTodo(id);
      await triggerGetTodos(searchQuery ? { search: searchQuery } : {});
      showToast("Todo deleted successfully!", "success");
    } catch (error) {
      console.error("Failed to delete todo:", error);
      showToast("Failed to delete todo. Please try again.", "error");
    }
  };

  const SortableTask = ({ task }: { task: Task }) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({ id: task.id.toString() });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0.5 : 1,
    };

    return (
      <div ref={setNodeRef} style={style} className="relative">
        <div
          className={`bg-white rounded-lg p-6 shadow-md hover:shadow-xl transition-shadow border border-gray-100 ${
            PriorityColors[task.priority].border
          } pl-12`}
        >
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-semibold text-gray-800 flex-1">
              {task.title}
            </h3>
            <div className="flex items-center">
              <div
                className={`${
                  PriorityColors[task.priority].badge
                } px-3 py-1 rounded-md text-sm font-medium flex items-center gap-1 `}
              >
                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
              </div>
              <div
                {...listeners}
                {...attributes}
                className="cursor-grab active:cursor-grabbing p-2 text-gray-400 hover:text-gray-600 z-10"
              >
                <GripVertical size={20} />
              </div>
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-4 leading-relaxed">
            {task.description}
          </p>
          <div className="flex justify-between items-center pt-4">
            <span className="text-sm text-gray-500 flex items-center gap-1">
              Due {task.dueDate}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => handleEditTask(task)}
                className="cursor-pointer "
              >
                <Image
                  src="/icons/edit.svg"
                  alt="Edit"
                  width={32}
                  height={32}
                />
              </button>
              <button
                onClick={() => handleDeleteTask(task.id)}
                className="cursor-pointer"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <Loader size="sm" />
                ) : (
                  <Image
                    src="/icons/delete.svg"
                    alt="Delete"
                    width={32}
                    height={32}
                  />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen p-8">
      <div className="mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">
            Todos
            <div className="h-1 w-20 bg-[#5272FF] mt-2"></div>
          </h1>
          <button
            onClick={() => {
              setIsEditing(false);
              setEditingTaskId(null);
              setShowModal(true);
            }}
            disabled={isCreating}
            className="flex items-center gap-2 bg-[#5272FF] text-white px-6 py-3 rounded-lg hover:bg-[#5242FF] transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus size={20} />
            New Task
          </button>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex gap-4 mb-8">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search your task here..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
              className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            />
            <button
              onClick={handleSearch}
              className="absolute cursor-pointer right-0 top-1/2 -translate-y-1/2 bg-[#5272FF] text-white p-2 rounded-lg hover:bg-[#5242FF]"
            >
              <Search size={30} />
            </button>
          </div>
          <div className="relative">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-6 py-3 bg-white rounded-lg border border-gray-200 hover:border-indigo-300 transition-colors"
            >
              {showFilters ? "Filter By" : "Sort by"}
              <ArrowUpDown size={20} />
            </button>

            {/* Filter Dropdown */}
            {showFilters && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden z-50">
                <div className="p-2 px-4">
                  {/* Header */}
                  <div className="py-2 border-b border-gray-200 mb-2">
                    <h3 className="font-semibold text-gray-800">Date</h3>
                  </div>

                  {/* Options */}
                  <div className="">
                    {[
                      "Deadline Today",
                      "Expires in 5 days",
                      "Expires in 10 days",
                      "Expires in 30 days",
                    ].map((label) => (
                      <label
                        key={label}
                        className="flex items-start gap-3 cursor-pointer hover:bg-gray-50 pt-2 rounded-lg transition"
                      >
                        <div className="relative">
                          <input
                            type="checkbox"
                            checked={selectedFilters.includes(label)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedFilters((prev) => [...prev, label]);
                              } else {
                                setSelectedFilters((prev) =>
                                  prev.filter((f) => f !== label)
                                );
                              }
                            }}
                            className="w-5 h-5 rounded border-2 border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 appearance-none checked:bg-blue-600 checked:border-blue-600"
                            style={{
                              backgroundImage: `url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M5.707 7.293a1 1 0 0 0-1.414 1.414l2 2a1 1 0 0 0 1.414 0l4-4a1 1 0 0 0-1.414-1.414L7 8.586 5.707 7.293z'/%3e%3c/svg%3e")`,
                              backgroundSize: "contain",
                              backgroundRepeat: "no-repeat",
                              backgroundPosition: "center",
                            }}
                          />
                        </div>
                        <span className="text-gray-700 text-sm font-medium">
                          {label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tasks Display */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-lg shadow-md">
            <Loader size="lg" className="mb-4" />
            <h2 className="text-2xl text-gray-700">Loading your tasks...</h2>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl text-red-700">Failed to load tasks</h2>
            <p className="text-gray-600 mt-2">
              {error instanceof Error
                ? error.message
                : "Please try again later"}
            </p>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-lg shadow-md">
            <Image
              src="/icons/no projects.svg"
              width={240}
              height={216}
              alt="No tasks available"
              className="mb-4 cursor-pointer"
              onClick={() => setShowModal(true)}
            />
            <h2 className="text-2xl text-gray-700 mb-12">No todos yet</h2>
          </div>
        ) : (
          <div>
            <h2 className="text-xl font-semibold mb-4">Your Tasks</h2>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={orderedTasks.map((t) => t.id.toString())}
                strategy={verticalListSortingStrategy}
              >
                <div className="grid grid-cols-3 gap-4">
                  {orderedTasks.map((task) => (
                    <SortableTask key={task.id} task={task} />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>
        )}

        <AddTaskModal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setIsEditing(false);
            setEditingTaskId(null);
            setNewTask({
              title: "",
              date: getTodayDateString(),
              priority: "moderate",
              description: "",
            });
            setErrors({
              title: "",
              date: "",
              description: "",
            });
          }}
          newTask={newTask}
          setNewTask={setNewTask}
          onAddTask={handleAddOrUpdateTask}
          errors={errors}
          isLoading={isEditing ? isUpdating : isCreating}
          isEditing={isEditing}
        />
      </div>
    </div>
  );
}
