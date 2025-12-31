import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

export default function IncomeVsExpenseChart({ transactions = [] }) {
  const data = useMemo(() => {
    let income = 0;
    let expense = 0;

    transactions.forEach((t) => {
      const amt = Number(t.amount) || 0;
      if (amt >= 0) income += amt;
      else expense += Math.abs(amt);
    });

    if (income === 0 && expense === 0) return [];

    return [
      { name: "Income", value: income, fill: "#22c55e" },
      { name: "Expense", value: expense, fill: "#ef4444" },
    ];
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
          <XAxis dataKey="name" stroke="currentColor" />
          <YAxis stroke="currentColor" />
          <Tooltip />
          <Bar dataKey="value">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}