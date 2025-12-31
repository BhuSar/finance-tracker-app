import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import TransactionTable from "../components/TransactionTable";

import {
  getTransactions,
  addTransaction,
  deleteTransaction,
  updateTransaction,
  getSummary,
  getAIInsights,
  getAISavings,
} from "../services/api";

import CategoryBreakdownChart from "../charts/CategoryBreakdownChart";
import IncomeVsExpenseChart from "../charts/IncomeVsExpenseChart";
import ExpensesPieChart from "../charts/ExpensesPieChart";

export default function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({ income: 0, expenses: 0, balance: 0 });

  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");

  const [aiInsights, setAiInsights] = useState("");
  const [aiSavings, setAiSavings] = useState("");

  const [error, setError] = useState("");

  const loadAll = async () => {
    try {
      setError("");
      const [tx, sum] = await Promise.all([getTransactions(), getSummary()]);
      setTransactions(Array.isArray(tx) ? tx : []);
      setSummary(sum || { income: 0, expenses: 0, balance: 0 });
    } catch (e) {
      setError(e.message || "Failed to load data");
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    setError("");

    if (!category.trim()) return setError("Category is required.");
    const amt = Number(amount);
    if (Number.isNaN(amt) || amt === 0) return setError("Amount must be a number (not 0).");

    try {
      await addTransaction({ category: category.trim(), amount: amt });
      setCategory("");
      setAmount("");
      await loadAll();
    } catch (e) {
      setError(e.message || "Failed to add transaction");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTransaction(id);
      await loadAll();
    } catch (e) {
      setError(e.message || "Failed to delete");
    }
  };

  const handleUpdate = async (id, payload) => {
    try {
      await updateTransaction(id, payload);
      await loadAll();
    } catch (e) {
      setError(e.message || "Failed to update");
    }
  };

  const refreshInsights = async () => {
    try {
      const res = await getAIInsights();
      setAiInsights(res?.insights || res?.message || String(res || ""));
    } catch (e) {
      setError(e.message || "Failed to load AI insights");
    }
  };

  const refreshSavings = async () => {
    try {
      const res = await getAISavings();
      setAiSavings(res?.savings || res?.message || String(res || ""));
    } catch (e) {
      setError(e.message || "Failed to load savings suggestions");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 dark:bg-gray-950 dark:text-gray-100">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 py-6 space-y-4">
        {error ? (
          <div className="rounded-lg border border-red-300 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200 p-3">
            {error}
          </div>
        ) : null}

        {/* AI */}
        <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold">AI Insights</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                {aiInsights ? aiInsights : "Add transactions and refresh."}
              </div>
            </div>
            <button
              onClick={refreshInsights}
              className="px-3 py-1.5 rounded-md text-sm bg-blue-600 text-white hover:bg-blue-700"
            >
              Refresh
            </button>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold">Savings Suggestions</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                {aiSavings ? aiSavings : "Add transactions to generate tips."}
              </div>
            </div>
            <button
              onClick={refreshSavings}
              className="px-3 py-1.5 rounded-md text-sm bg-green-600 text-white hover:bg-green-700"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 p-4">
            <div className="text-sm text-gray-600 dark:text-gray-300">Income</div>
            <div className="text-2xl font-bold text-green-600">${summary.income || 0}</div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 p-4">
            <div className="text-sm text-gray-600 dark:text-gray-300">Expenses</div>
            <div className="text-2xl font-bold text-red-600">${summary.expenses || 0}</div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 p-4">
            <div className="text-sm text-gray-600 dark:text-gray-300">Balance</div>
            <div className="text-2xl font-bold text-blue-600">${summary.balance || 0}</div>
          </div>
        </div>

        {/* Add Transaction */}
        <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 p-4">
          <div className="font-semibold mb-3">Add Transaction</div>

          <form onSubmit={handleAdd} className="space-y-3">
            <input
              className="w-full rounded-md border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400
                         dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:placeholder:text-gray-500
                         px-3 py-2"
              placeholder="Category (e.g., Food)"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
            <input
              className="w-full rounded-md border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400
                         dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:placeholder:text-gray-500
                         px-3 py-2"
              placeholder="Amount (e.g., -25 or 1000)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />

            <button className="w-full px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700">
              Add Transaction
            </button>
          </form>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 p-4">
            <div className="font-semibold mb-2">Category Breakdown</div>
            <CategoryBreakdownChart transactions={transactions} />
          </div>

          <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 p-4">
            <div className="font-semibold mb-2">Income vs Expense</div>
            <IncomeVsExpenseChart transactions={transactions} />
          </div>

          <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 p-4">
            <div className="font-semibold mb-2">Expense Breakdown</div>
            <ExpensesPieChart transactions={transactions} />
          </div>
        </div>

        {/* Transactions */}
        <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 p-4">
          <div className="font-semibold mb-2">Transactions</div>
          <TransactionTable
            transactions={transactions}
            onDelete={handleDelete}
            onUpdate={handleUpdate}
          />
        </div>
      </div>
    </div>
  );
}