import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function IncomeVsExpenseChart({ data }) {
  const transactions = Array.isArray(data) ? data : [];

  const isDark = document.documentElement.classList.contains("dark");
  const textColor = isDark ? "#FFFFFF" : "#1F2937";

  if (!transactions.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
          Income vs Expense
        </h2>
        <p className="text-gray-600 dark:text-gray-400">No data available.</p>
      </div>
    );
  }

  let income = 0;
  let expenses = 0;

  transactions.forEach((t) => {
    if (t.amount >= 0) income += Number(t.amount);
    else expenses += Math.abs(Number(t.amount));
  });

  const hasData = income > 0 || expenses > 0;

  const chartData = {
    labels: hasData ? ["Income", "Expenses"] : ["No Data"],
    datasets: [
      {
        label: "Amount",
        data: hasData ? [income, expenses] : [1],
        backgroundColor: hasData
          ? ["#34D399", "#EF4444"]
          : ["#9CA3AF"],
        borderColor: hasData
          ? ["#059669", "#DC2626"]
          : ["#6B7280"],
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
    scales: {
      x: {
        ticks: { color: textColor },
        grid: { color: isDark ? "#374151" : "#E5E7EB" },
      },
      y: {
        ticks: { color: textColor },
        grid: { color: isDark ? "#374151" : "#E5E7EB" },
      },
    },
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
        Income vs Expense
      </h2>
      <Bar data={chartData} options={options} />
    </div>
  );
}