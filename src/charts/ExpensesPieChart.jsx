import { useMemo } from "react";
import {
  PieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const COLORS = [
  "#3b82f6",
  "#22c55e",
  "#f97316",
  "#a855f7",
  "#ef4444",
  "#06b6d4",
];

export default function ExpensesPieChart({ transactions = [] }) {
  const data = useMemo(() => {
    const map = {};
    transactions.forEach((t) => {
      const amt = Number(t.amount) || 0;
      if (amt < 0) {
        const cat = t.category || "Other";
        map[cat] = (map[cat] || 0) + Math.abs(amt);
      }
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [transactions]);

  if (!data.length)
    return (
      <p className="text-sm text-gray-500 dark:text-gray-400">
        No expense data available.
      </p>
    );

  return (
    <div className="w-full h-56">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            outerRadius={80}
            label
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}