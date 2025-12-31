import { motion } from "framer-motion";

export default function AIInsights( { insights, loading, onRefresh }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#111827] dark:bg-white p-4 rounded-xl shadow-lg transition"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold text-white dark:text-black">
          AI Insights
        </h2>

        <button
          onClick={onRefresh}
          disabled={loading}
          className="px-3 py-1.5 text-sm rounded-lg bg-blue-600 hover:bg-blue-700
                      text-white transition disabled:opacity-50"
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* Insights Text */}
      <div className="text-gray-300 dark:text-gray-700 whitespace-pre-line leading-relaxed">
        {insights && insights.trim().length > 0
        ? insights 
      : "No insights yet. Add some transactions and click refresh!"}
      </div>
    </motion.div>
  );
}