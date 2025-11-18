"use client";

import { Plus, Search, SlidersHorizontal } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import Loader from "../../components/Loader";
import {
  useCreateTodoMutation,
  useDeleteTodoMutation,
  useGetTodosQuery,
  useUpdateTodoMutation,
} from "../../lib/api";
import AddTaskModal from "./AddTaskModal";
import { NewTaskForm, PriorityColors, Task, TodoApiResponse } from "./types";

export default function Todos() {
  const { data: todos, isLoading, error, refetch } = useGetTodosQuery({});
  const [createTodo, { isLoading: isCreating }] = useCreateTodoMutation();
  const [updateTodo, { isLoading: isUpdating }] = useUpdateTodoMutation();
  const [deleteTodo, { isLoading: isDeleting }] = useDeleteTodoMutation();

  const [showModal, setShowModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [newTask, setNewTask] = useState<NewTaskForm>({
    title: "",
    date: "",
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

  const tasks: Task[] = todos?.results
    ? todos.results.map((todo: TodoApiResponse) => ({
        id: todo.id,
        title: todo.title,
        description: todo.description,
        dueDate: todo.todo_date,
        priority: todo.priority,
      }))
    : [];

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
      date: task.dueDate, // Assuming dueDate is the date string
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
        } else {
          // Create new
          await createTodo({
            title: newTask.title,
            description: newTask.description,
            todo_date: new Date(newTask.date).toISOString().split("T")[0], // Assuming API expects date string
            priority: newTask.priority,
          });
        }
        await refetch();
        setNewTask({
          title: "",
          date: "",
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
      }
    }
  };

  const handleDeleteTask = async (id: number) => {
    try {
      await deleteTodo(id);
      await refetch();
    } catch (error) {
      console.error("Failed to delete todo:", error);
    }
  };

  const filteredTasks = tasks.filter(
    (task) =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-50 p-8">
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
              className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            />
            <button className="absolute right-0 top-1/2 -translate-y-1/2 bg-[#5272FF] text-white p-2 rounded-lg hover:bg-[#5242FF]">
              <Search size={30} />
            </button>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-6 py-3 bg-white rounded-lg border border-gray-200 hover:border-indigo-300 transition-colors"
          >
            {showFilters ? "Sort by" : "Filter By"}
            <SlidersHorizontal size={20} />
          </button>
        </div>

        {/* Filter Dropdown */}
        {showFilters && (
          <div className="mb-6 bg-white p-4 rounded-lg shadow-md border border-gray-200">
            <h3 className="font-semibold mb-3">Date</h3>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300"
                />
                <span>Deadline Today</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300"
                />
                <span>Expires in 5 days</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300"
                />
                <span>Expires in 10 days</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300"
                />
                <span>Expires in 30 days</span>
              </label>
            </div>
          </div>
        )}

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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className={`bg-white rounded-lg p-6 shadow-md hover:shadow-xl transition-shadow border border-gray-100`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-gray-800 flex-1">
                      {task.title}
                    </h3>
                    <div className="flex items-center gap-2">
                      <div
                        className={`${
                          PriorityColors[task.priority].badge
                        } px-3 py-1 rounded-md text-sm font-medium flex items-center gap-1 `}
                      >
                        {task.priority.charAt(0).toUpperCase() +
                          task.priority.slice(1)}
                      </div>
                      <button className="text-gray-400 hover:text-gray-600  ">
                        <Image
                          src="/icons/list-icon.svg"
                          alt="List"
                          width={14}
                          height={9}
                          className="w-4 h-3"
                        />
                      </button>
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
              ))}
            </div>
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
              date: "",
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
