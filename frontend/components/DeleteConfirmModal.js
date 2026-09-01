"use client";

export default function DeleteConfirmModal({ task, onConfirm, onCancel, deleting }) {
  if (!task) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-sm p-6">
        <h2 className="text-lg font-semibold mb-2">Delete task?</h2>
        <p className="text-sm text-slate-600 mb-6">
          This will permanently delete <span className="font-medium">&quot;{task.title}&quot;</span>. This
          action cannot be undone.
        </p>
        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="flex-1 border border-slate-300 rounded-md py-2 text-sm font-medium"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={deleting}
            className="flex-1 bg-red-600 text-white rounded-md py-2 text-sm font-medium disabled:opacity-60"
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
