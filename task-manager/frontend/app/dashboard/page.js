"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { taskApi } from "@/lib/api";
import { isLoggedIn, getUser, clearAuth } from "@/lib/auth";
import TaskCard from "@/components/TaskCard";
import TaskForm from "@/components/TaskForm";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";

export default function DashboardPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [savingTask, setSavingTask] = useState(false);

  const [taskToDelete, setTaskToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.set("status", statusFilter);
      if (search) params.set("search", search);
      const query = params.toString() ? `?${params.toString()}` : "";
      const data = await taskApi.getAll(query);
      setTasks(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, search]);

  useEffect(() => {
    if (!isLoggedIn()) {
      router.replace("/login");
      return;
    }
    fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // refetch when filters change (debounced a little for search)
    const timeout = setTimeout(fetchTasks, 300);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, search]);

  const handleLogout = () => {
    clearAuth();
    router.replace("/login");
  };

  const handleCreateClick = () => {
    setEditingTask(null);
    setShowForm(true);
  };

  const handleEditClick = (task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleFormSubmit = async (formData) => {
    setSavingTask(true);
    setError("");
    try {
      if (editingTask) {
        await taskApi.update(editingTask._id, formData);
      } else {
        await taskApi.create(formData);
      }
      setShowForm(false);
      setEditingTask(null);
      fetchTasks();
    } catch (err) {
      setError(err.message);
    } finally {
      setSavingTask(false);
    }
  };

  const handleDeleteConfirm = async () => {
    setDeleting(true);
    try {
      await taskApi.remove(taskToDelete._id);
      setTaskToDelete(null);
      fetchTasks();
    } catch (err) {
      setError(err.message);
    } finally {
      setDeleting(false);
    }
  };

  const user = getUser();

  return (
    <div className="min-h-screen">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-slate-900">My Tasks</h1>
            {user && <p className="text-sm text-slate-500">Welcome, {user.name}</p>}
          </div>
          <button
            onClick={handleLogout}
            className="text-sm font-medium text-slate-600 border border-slate-300 rounded-md px-3 py-1.5 hover:bg-slate-50"
          >
            Log out
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            type="text"
            placeholder="Search tasks by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 border border-slate-300 rounded-md px-3 py-2 text-sm"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-slate-300 rounded-md px-3 py-2 text-sm"
          >
            <option value="">All statuses</option>
            <option>Pending</option>
            <option>In Progress</option>
            <option>Completed</option>
          </select>
          <button
            onClick={handleCreateClick}
            className="bg-slate-900 text-white rounded-md px-4 py-2 text-sm font-medium whitespace-nowrap"
          >
            + Add Task
          </button>
        </div>

        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
            {error}
          </div>
        )}

        {loading ? (
          <p className="text-slate-500 text-sm">Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-slate-300 rounded-lg">
            <p className="text-slate-500">No tasks yet. Create your first one!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onEdit={handleEditClick}
                onDelete={setTaskToDelete}
              />
            ))}
          </div>
        )}
      </main>

      {showForm && (
        <TaskForm
          initialTask={editingTask}
          submitting={savingTask}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingTask(null);
          }}
        />
      )}

      <DeleteConfirmModal
        task={taskToDelete}
        deleting={deleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setTaskToDelete(null)}
      />
    </div>
  );
}
