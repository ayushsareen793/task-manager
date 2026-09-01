"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { taskApi } from "@/lib/api";
import { isLoggedIn } from "@/lib/auth";

export default function TaskDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [task, setTask] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn()) {
      router.replace("/login");
      return;
    }

    taskApi
      .getOne(id)
      .then((res) => setTask(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id, router]);

  if (loading) return <p className="p-6 text-sm text-slate-500">Loading...</p>;
  if (error) return <p className="p-6 text-sm text-red-600">{error}</p>;
  if (!task) return null;

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <button
        onClick={() => router.push("/dashboard")}
        className="text-sm text-slate-500 mb-4 underline"
      >
        ← Back to dashboard
      </button>
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <h1 className="text-xl font-semibold mb-2">{task.title}</h1>
        <p className="text-slate-600 mb-4">{task.description}</p>
        <div className="flex gap-2 text-sm text-slate-500">
          <span>Status: {task.status}</span>
          <span>•</span>
          <span>Priority: {task.priority}</span>
        </div>
        {task.dueDate && (
          <p className="text-sm text-slate-400 mt-2">
            Due {new Date(task.dueDate).toLocaleDateString()}
          </p>
        )}
      </div>
    </div>
  );
}
