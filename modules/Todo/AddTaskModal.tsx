import { Trash2 } from "lucide-react";
import Loader from "../../components/Loader";
import { NewTaskForm, PriorityColors } from "./types";

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  newTask: NewTaskForm;
  setNewTask: (task: NewTaskForm) => void;
  onAddTask: () => void;
  errors: { title: string; date: string; description: string };
  isLoading?: boolean;
  isEditing?: boolean;
}

export default function AddTaskModal({
  isOpen,
  onClose,
  newTask,
  setNewTask,
  onAddTask,
  errors,
  isLoading = false,
  isEditing = false,
}: AddTaskModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/74 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-8 max-w-lg w-full shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-base font-bold text-gray-800">
            {isEditing ? "Edit Task" : "Add New Task"}
            <div className="h-1 w-20 bg-[#5272FF] mt-2"></div>
          </h2>

          <button
            onClick={onClose}
            className="text-black hover:text-black/70 cursor-pointer transition-colors font-semibold text-sm underline"
          >
            Go Back
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Title
            </label>
            <input
              type="text"
              value={newTask.title}
              onChange={(e) =>
                setNewTask({ ...newTask, title: e.target.value })
              }
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {errors.title && (
              <span className="text-red-500 text-sm">{errors.title}</span>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Date
            </label>
            <div className="relative w-full">
              <input
                type="date"
                value={newTask.date}
                onChange={(e) =>
                  setNewTask({ ...newTask, date: e.target.value })
                }
                placeholder="Select a date"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 [&::-webkit-calendar-picker-indicator]:display-none"
              />
            </div>
            {errors.date && (
              <span className="text-red-500 text-sm">{errors.date}</span>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Priority
            </label>
            <div className="flex gap-6">
              {(["extreme", "moderate", "low"] as const).map((priority) => (
                <label
                  key={priority}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <span className="flex items-center gap-2!">
                    <span
                      className={`w-2 h-2 ${PriorityColors[priority].dot} rounded-full`}
                    ></span>
                    {priority.charAt(0).toUpperCase() + priority.slice(1)}
                  </span>
                  <input
                    type="checkbox"
                    name="priority"
                    checked={newTask.priority === priority}
                    onChange={() => setNewTask({ ...newTask, priority })}
                    className="w-4 h-4"
                  />
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Task Description
            </label>
            <textarea
              value={newTask.description}
              onChange={(e) =>
                setNewTask({ ...newTask, description: e.target.value })
              }
              placeholder="Start writing here....."
              rows={5}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            ></textarea>
            {errors.description && (
              <span className="text-red-500 text-sm">{errors.description}</span>
            )}
          </div>

          <div className="flex justify-between items-center gap-3 pt-4">
            <button
              onClick={onAddTask}
              disabled={isLoading}
              className="flex bg-[#5272FF] w-[90px] justify-center items-center cursor-pointer text-white py-3 px-2 rounded-lg font-semibold hover:bg-[#5242FF] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? <Loader size="sm" /> : isEditing ? "Update" : "Done"}
            </button>
            <button
              onClick={onClose}
              className="bg-red-500 cursor-pointer text-white p-3 rounded-lg hover:bg-red-600 transition-colors"
            >
              <Trash2 size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
