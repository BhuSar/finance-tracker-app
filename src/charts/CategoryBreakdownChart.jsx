import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function CategoryBreakdownChart({ data }) {
  const transactions = Array.isArray(data) ? data : [];

  const isDark = document.documentElement.classList.contains("dark");
  const textColor = isDark ? "#FFFFFF" : "#1F2937";

  if (!transactions.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
          Category Breakdown
        </h2>
        <p className="text-gray-600 dark:text-gray-400">No data available.</p>
      </div>
    );
  }

  const categories = {};
  transactions.forEach((t) => {
    categories[t.category] =
      (categories[t.category] || 0) + Number(t.amount);
  });

  const labels = Object.keys(categories);
  const values = Object.values(categories);

  const chartData = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: [
          "#60A5FA",
          "#34D399",
          "#FBBF24",
          "#F87171",
          "#A78BFA",
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        labels: {
          color: textColor,
        },
      },
    },
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
        Category Breakdown
      </h2>
      <Pie data={chartData} options={options} />
    </div>
  );
}