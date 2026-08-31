"use client";

const statusColors = {
  Pending: "bg-amber-100 text-amber-700",
  "In Progress": "bg-blue-100 text-blue-700",
  Completed: "bg-green-100 text-green-700",
};

const priorityColors = {
  Low: "bg-slate-100 text-slate-600",
  Medium: "bg-orange-100 text-orange-700",
  High: "bg-red-100 text-red-700",
};

export default function TaskCard({ task, onEdit, onDelete }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 flex flex-col gap-2">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-slate-900">{task.title}</h3>
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${priorityColors[task.priority]}`}>
          {task.priority}
        </span>
      </div>

      <p className="text-sm text-slate-600 line-clamp-3">{task.description}</p>

      <div className="flex items-center justify-between mt-2">
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusColors[task.status]}`}>
          {task.status}
        </span>
        {task.dueDate && (
          <span className="text-xs text-slate-400">
            Due {new Date(task.dueDate).toLocaleDateString()}
          </span>
        )}
      </div>

      <div className="flex gap-2 mt-3 pt-3 border-t border-slate-100">
        <button
          onClick={() => onEdit(task)}
          className="flex-1 text-sm font-medium text-slate-700 border border-slate-300 rounded-md py-1.5 hover:bg-slate-50"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(task)}
          className="flex-1 text-sm font-medium text-red-600 border border-red-200 rounded-md py-1.5 hover:bg-red-50"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
