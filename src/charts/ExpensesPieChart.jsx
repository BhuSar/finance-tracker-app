import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function ExpensesPieChart({ data }) {
  const transactions = Array.isArray(data) ? data : [];

  const isDark = document.documentElement.classList.contains("dark");
  const textColor = isDark ? "#FFFFFF" : "#1F2937";

  const expenses = transactions.filter((t) => t.amount < 0);

  if (!expenses.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
          Expense Breakdown
        </h2>
        <p className="text-gray-600 dark:text-gray-400">No expense data available.</p>
      </div>
    );
  }

  const categories = {};
  expenses.forEach((t) => {
    categories[t.category] =
      (categories[t.category] || 0) + Math.abs(Number(t.amount));
  });

  const labels = Object.keys(categories);
  const values = Object.values(categories);

  const chartData = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: ["#F87171", "#FB923C", "#FBBF24", "#A855F7", "#60A5FA"],
        borderColor: ["#DC2626", "#EA580C", "#D97706", "#7E22CE", "#3B82F6"],
        borderWidth: 1.5,
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
        Expense Breakdown
      </h2>
      <Doughnut data={chartData} options={options} />
    </div>
  );
}