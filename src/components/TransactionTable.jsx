import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

export default function TransactionTable({ transactions, onDelete }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#111827] dark:bg-white p-4 rounded-xl shadow-lg"
    >
      <h2 className="text-lg font-semibold mb-3">Transactions</h2>

      {transactions.length === 0 ? (
        <p className="text-gray-400 dark:text-gray-600">
          No transactions yet.
        </p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-700 dark:border-gray-300">
              <th className="text-left py-2">Date</th>
              <th className="text-left">Name</th>
              <th className="text-left">Category</th>
              <th className="text-left">Amount</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            <AnimatePresence>
              {transactions.map((t) => (
                <motion.tr
                  key={t.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="border-b border-gray-800 dark:border-gray-300"
                >
                  <td className="py-2">
                    {new Date(t.date).toLocaleDateString()}
                  </td>
                  <td>{t.name}</td>
                  <td>{t.category}</td>
                  <td
                    className={
                      t.amount >= 0
                        ? "text-green-400 dark:text-green-600"
                        : "text-red-400 dark:text-red-600"
                    }
                  >
                    ${t.amount.toFixed(2)}
                  </td>

                  <td>
                    <button
                      onClick={() => {
                        onDelete(t.id);
                        toast.success("Deleted");
                      }}
                      className="text-red-400 hover:text-red-600 dark:text-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      )}
    </motion.div>
  );
}