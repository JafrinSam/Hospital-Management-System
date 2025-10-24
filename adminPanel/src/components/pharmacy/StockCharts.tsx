// src/pages/pharmacy/StockCharts.tsx
import React, { useMemo } from "react";
import { usePharmacy } from "../../context/PharmacyContext";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LineChart,
  Line,
} from "recharts";
import { Link } from "react-router-dom";

export default function StockCharts() {
  const { products, transactions } = usePharmacy();

  const stockData = useMemo(
    () => products.map((p) => ({ name: p.name, stock: p.stock })),
    [products]
  );

  const salesData = useMemo(() => {
    const grouped: Record<string, number> = {};
    transactions.forEach((t) => {
      if (t.type === "sale") {
        grouped[t.date] = (grouped[t.date] || 0) + t.amount;
      }
    });
    return Object.entries(grouped).map(([date, amount]) => ({ date, amount }));
  }, [transactions]);

  return (
    <div className="p-6 min-h-screen  text-gray-600">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Pharmacy Stock & Finance Charts</h2>
        <Link
          to="/pharmacy"
          className="text-cyan-400 hover:text-cyan-200 transition"
        >
          ← Back to Dashboard
        </Link>
      </div>

      {/* Stock Bar Chart */}
      <div className="bg-white/50 shadow p-6 rounded-lg mb-8">
        <h3 className="text-lg font-semibold mb-3">Current Stock Levels</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={stockData}>
            <XAxis dataKey="name" stroke="#7ec8e3" />
            <YAxis stroke="#7ec8e3" />
            <Tooltip />
            <Legend />
            <Bar dataKey="stock" fill="#00bcd4" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Sales Line Chart */}
      <div className="bg-white/50 shadow p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-3">Sales Over Time</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={salesData}>
            <XAxis dataKey="date" stroke="#7ec8e3" />
            <YAxis stroke="#7ec8e3" />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="amount" stroke="#06b6d4" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
