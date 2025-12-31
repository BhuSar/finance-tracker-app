import { motion } from "framer-motion";

export default function SavingsSuggestions({ suggestions, loading, onRefresh }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#111827] dark:bg-white p-4 rounded-xl shadow-lg transition"
        >
            {/* Header */}
            <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold text-white dark:text-black">
                    Savings Suggestions
                </h2>

                <button 
                    onClick={onRefresh}
                    disabled={loading}
                    className="px-3 py-1.5 text-sm rounded-lg bg-emerald-600 hover:bg-emerald-700
                                text-white transition disabled:opacity-50"
                    >
                    {loading ? "Loading..." : "Refresh"}
                    </button>
            </div>

            {/* Suggestions Text */}
            <div className="text-gray-300 dark:text-gray-700 whitespace-pre-line leading-relaxed">
                {suggestions && suggestions.trim().length > 0
                    ? suggestions
                    : "No savings tips yet. Add some transactions and click refresh!"}
            </div>
        </motion.div>
    );
}