import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getSummary, getTransactions, addTransaction, deleteTransaction, updateTransaction, getAIInsights, getAISavings } from "../services/api";
import CategoryBreakdownChart from "../charts/CategoryBreakdownChart";
import IncomeVsExpenseChart from "../charts/IncomeVsExpenseChart";
import ExpensesPieChart from "../charts/ExpensesPieChart";

export default function Dashboard() {
  const [token] = useState(localStorage.getItem("authToken"));

  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({ income: 0, expenses: 0, balance: 0 });

  // FORM STATE
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");

  // EDIT MODE
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  // AI INSIGHTS
  const [aiInsights, setAiInsights] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);

  // AI SAVINGS SUGGESTIONS
  const [aiSavings, setAISavings] = useState("");
  const [loadingSavings, setLoadingSavings] = useState(false);

  async function loadData() {
    if (!token) return;

    const trans = await getTransactions(token);
    const sum = await getSummary(token);

    setTransactions(Array.isArray(trans) ? trans : []);
    setSummary(sum || { income: 0, expenses: 0, balance: 0 });
  }

  useEffect(() => {
    loadData();
  }, []);

  // LOAD AI INSIGHTS
  async function loadAIInsights() {
    setLoadingAI(true);
    const result = await getAIInsights(token);
    setAiInsights(result.insights);
    setLoadingAI(false);
  }

  async function loadAISavings() {
    setLoadingSavings(true);
    const result = await getAISavings(token);
    setAISavings(result.suggestions);
    setLoadingSavings(false);
  }

  // ADD TRANSACTION
  async function handleAddTransaction(e) {
    e.preventDefault();
    if (!category || !amount) return;

    const type = amount >= 0 ? "income" : "expense";

    await addTransaction(
      { category, amount: Number(amount), type },
      token
    );

    setCategory("");
    setAmount("");
    loadData();
  }

  async function handleDelete(id) {
    await deleteTransaction(id, token);
    loadData();
  }

  async function handleEditSave(e) {
    e.preventDefault();

    const type = amount >= 0 ? "income" : "expense";

    await updateTransaction(
      editId,
      { category, amount: Number(amount), type },
      token
    );

    setCategory("");
    setAmount("");
    setEditMode(false);
    setEditId(null);
    loadData();
  }

  function startEdit(t) {
    setEditMode(true);
    setEditId(t._id);
    setCategory(t.category);
    setAmount(t.amount);
  }

  function cancelEdit() {
    setEditMode(false);
    setEditId(null);
    setCategory("");
    setAmount("");
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 pb-20">
        {/* AI INSIGHTS */}
        <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow mb-6 transition mt-4">
          <div className="flex justify-between items-center">
            <h2 className="text-gray-900 dark:text-gray-100 font-semibold">
              AI Insights
            </h2>

            <button
              onClick={loadAIInsights}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1 rounded"
            >
              {loadingAI ? "Loading..." : "Refresh"}
            </button>
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 whitespace-pre-line">
            {aiInsights ||
              "No insights yet — add some transactions and click Refresh!"}
          </p>
        </div>

        {/* SAVINGS SUGGESTIONS */}
        <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow mb-6 transition">
          <div className="flex justify-between items-center">
            <h2 className="text-gray-900 dark:text-gray-100 font-semibold">
              Savings Suggestions
            </h2>

            <button
              onClick={loadAISavings}
              className="bg-green-600 hover:bg-green-700 text-white text-sm px-3 py-1 rounded"
            >
              {loadingSavings ? "Loading..." : "Refresh"}
            </button>
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 whitespace-pre-line">

            {aiSavings || "Add more transactions and click Refresh to generate smart savings tips."}
          </p>
        </div>

        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow transition">
            <p className="text-green-600 dark:text-green-400 font-bold">Income</p>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              ${summary.income}
            </h3>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow transition">
            <p className="text-red-600 dark:text-red-400 font-bold">Expenses</p>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              ${summary.expenses}
            </h3>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow transition">
            <p className="text-blue-600 dark:text-blue-400 font-bold">
              Balance
            </p>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              ${summary.balance}
            </h3>
          </div>
        </div>

        {/* ADD / EDIT FORM */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-6 transition">
          <h3 className="text-gray-900 dark:text-gray-100 font-semibold mb-3">
            {editMode ? "Edit Transaction" : "Add Transaction"}
          </h3>

          <form
            onSubmit={editMode ? handleEditSave : handleAddTransaction}
            className="space-y-3"
          >
            <input
              type="text"
              placeholder="Category"
              className="w-full p-3 rounded bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />

            <input
              type="number"
              placeholder="Amount (positive = income, negative = expense)"
              className="w-full p-3 rounded bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-semibold"
            >
              {editMode ? "Save Changes" : "Add Transaction"}
            </button>

            {editMode && (
              <button
                type="button"
                onClick={cancelEdit}
                className="w-full bg-gray-500 hover:bg-gray-600 text-white py-2 rounded font-semibold"
              >
                Cancel
              </button>
            )}
          </form>
        </div>

        {/* CHARTS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <CategoryBreakdownChart data={transactions} />
          <IncomeVsExpenseChart data={transactions} />
          <ExpensesPieChart data={transactions} />
        </div>

        {/* TRANSACTIONS LIST */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow transition">
          <h3 className="text-gray-900 dark:text-gray-100 font-semibold mb-3">
            Transactions
          </h3>

          {transactions.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-300">
              No transactions yet.
            </p>
          ) : (
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {transactions.map((t) => (
                <li
                  key={t._id}
                  className="py-3 flex justify-between items-center text-gray-900 dark:text-gray-100"
                >
                  <span>
                    {t.amount < 0 ? "-" : "+"}${Math.abs(t.amount)} (
                    {t.category})
                  </span>

                  <div className="flex gap-2">
                    <button
                      onClick={() => startEdit(t)}
                      className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(t._id)}
                      className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}