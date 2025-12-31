export default function FilterBar({ dateFilter, setDateFilter }) {
  const filters = ["Today", "This Week", "This Month", "All"];

  return (
    <div className="flex gap-3 flex-wrap justify-center md:justify-start mb-4">
      {filters.map((label) => (
        <button
          key={label}
          onClick={() => setDateFilter(label)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition
            ${
              dateFilter === label
                ? "bg-blue-600 text-white shadow"
                : "bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700"
            }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}