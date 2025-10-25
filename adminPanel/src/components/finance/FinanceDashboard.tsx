import React from "react";
import { useFinance } from "../../context/FinanceContext";
import { Card } from "../../ui/Card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Link } from "react-router-dom";

export const FinanceDashboard = () => {
  const { departments } = useFinance();

  const totalRevenue = departments.reduce((acc, d) => acc + d.revenue, 0);
  const totalExpenses = departments.reduce((acc, d) => acc + d.expenses, 0);
  const totalProfit = departments.reduce((acc, d) => acc + d.profit, 0);
  const totalInvestments = departments.reduce((acc, d) => acc + d.investments, 0);

  return (
    <div className="space-y-6 p-6 text-gray-600">
      <h1 className="text-3xl font-bold text-cyan-300">Hospital Finance Dashboard</h1>

      <div className="grid grid-cols-4 gap-4">
        <Card title="Total Revenue">₹{totalRevenue}</Card>
        <Card title="Total Expenses">₹{totalExpenses}</Card>
        <Card title="Total Profit">₹{totalProfit}</Card>
        <Card title="Total Investments">₹{totalInvestments}</Card>
      </div>

      <Card title="Department-wise Profit">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={departments}>
            <XAxis dataKey="name" stroke="#fff" />
            <YAxis stroke="#ffff" />
            <Tooltip />
            <Bar dataKey="profit" fill="#e7feff" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <div className="grid grid-cols-3 gap-4">
        {departments.map((d) => (
          <Link key={d.id} to={`/finance/department/${d.id}`}>
            <Card title={d.name}>
              <p>Revenue: ₹{d.revenue}</p>
              <p>Expenses: ₹{d.expenses}</p>
              <p>Profit: ₹{d.profit}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};
