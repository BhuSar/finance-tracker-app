import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function CategoryBreakdownChart({ transactions = [] }) {
  const data = useMemo(() => {
    const map = {};
    transactions.forEach((t) => {
      const amt = Number(t.amount) || 0;
      if (amt < 0) {
        const cat = t.category || "Other";
        map[cat] = (map[cat] || 0) + Math.abs(amt);
      }
    });
    return Object.entries(map).map(([category, total]) => ({ category, total }));
  }, [transactions]);

  if (!data.length)
    return (
      <p className="text-sm text-gray-500 dark:text-gray-400">
        No data available.
      </p>
    );

  return (
    <div className="w-full h-56">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="category" stroke="currentColor" />
          <YAxis stroke="currentColor" />
          <Tooltip />
          <Bar dataKey="total" fill="#22c55e" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}