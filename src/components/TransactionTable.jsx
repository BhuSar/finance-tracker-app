import { useState } from "react";

export default function TransactionTable({ transactions = [], onDelete, onUpdate }) {
  const [editId, setEditId] = useState(null);
  const [editCategory, setEditCategory] = useState("");
  const [editAmount, setEditAmount] = useState("");

  const startEdit = (t) => {
    setEditId(t._id);
    setEditCategory(t.category || "");
    setEditAmount(String(t.amount ?? ""));
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditCategory("");
    setEditAmount("");
  };

  const saveEdit = async () => {
    if (!editId) return;
    await onUpdate(editId, { category: editCategory, amount: Number(editAmount) });
    cancelEdit();
  };

  if (!transactions.length) {
    return <div className="text-sm text-gray-500 dark:text-gray-400">No transactions yet.</div>;
  }

  return (
    <div className="space-y-2">
      {transactions.map((t) => {
        const isEditing = editId === t._id;

        return (
          <div
            key={t._id}
            className="flex items-center justify-between rounded-md border border-gray-200 bg-white
                       dark:border-gray-800 dark:bg-gray-950 px-3 py-2"
          >
            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-2">
                  <input
                    className="w-full rounded-md border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400
                               dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500
                               px-2 py-1"
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    placeholder="Category"
                  />
                  <input
                    className="w-full rounded-md border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400
                               dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500
                               px-2 py-1"
                    value={editAmount}
                    onChange={(e) => setEditAmount(e.target.value)}
                    placeholder="Amount"
                  />
                </div>
              ) : (
                <>
                  <div className="font-medium text-gray-900 dark:text-gray-100">{t.category}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">${t.amount}</div>
                </>
              )}
            </div>

            <div className="flex gap-2 ml-3">
              {isEditing ? (
                <>
                  <button
                    onClick={saveEdit}
                    className="px-3 py-1.5 rounded-md text-sm bg-blue-600 text-white hover:bg-blue-700"
                  >
                    Save
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="px-3 py-1.5 rounded-md text-sm bg-gray-300 text-gray-900
                               dark:bg-gray-700 dark:text-gray-100 hover:opacity-90"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => startEdit(t)}
                    className="px-3 py-1.5 rounded-md text-sm bg-amber-500 text-white hover:bg-amber-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(t._id)}
                    className="px-3 py-1.5 rounded-md text-sm bg-red-600 text-white hover:bg-red-700"
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}