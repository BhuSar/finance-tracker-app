import { motion } from "framer-motion";

export default function SummaryCards({ transactions }) {
  let income = 0;
  let expenses = 0;

  transactions.forEach((t) => {
    if (t.amount >= 0) {
      income += Number(t.amount);
    } else {
      expenses += Math.abs(Number(t.amount));
    }
  });

  const balance = income - expenses;

  const cardBase =
    "p-4 rounded-xl shadow-lg bg-[#111827] dark:bg-white transition";

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Income */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={cardBase}
      >
        <p className="text-gray-400 dark:text-gray-700">Income</p>
        <h2 className="text-2xl font-bold text-green-400 dark:text-green-600">
          ${income.toFixed(2)}
        </h2>
      </motion.div>

      {/* Expenses */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className={cardBase}
      >
        <p className="text-gray-400 dark:text-gray-700">Expenses</p>
        <h2 className="text-2xl font-bold text-red-400 dark:text-red-600">
          ${expenses.toFixed(2)}
        </h2>
      </motion.div>

      {/* Balance */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className={cardBase}
      >
        <p className="text-gray-400 dark:text-gray-700">Balance</p>
        <h2
          className={`text-2xl font-bold ${
            balance >= 0
              ? "text-blue-400 dark:text-blue-600"
              : "text-red-400 dark:text-red-600"
          }`}
        >
          ${balance.toFixed(2)}
        </h2>
      </motion.div>
    </div>
  );
}