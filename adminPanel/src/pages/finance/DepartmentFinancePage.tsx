import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useFinance, Transaction } from "../../context/FinanceContext";
import { Card } from "../../ui/Card";
import { v4 as uuid } from "uuid";

export const DepartmentFinancePage = () => {
  const { departmentId } = useParams();
  const { departments, addTransaction, editTransaction, deleteTransaction } = useFinance();
  const dept = departments.find((d) => d.id === departmentId);

  const [form, setForm] = useState<Partial<Transaction>>({ type: "income" });

  if (!dept) return <p className="p-6 text-white">Department not found</p>;

  const handleAdd = () => {
    if (!form.amount || !form.description || !form.date) return;
    addTransaction({ ...form, id: uuid(), departmentId, type: form.type! } as Transaction);
    setForm({ type: "income" });
  };

  return (
    <div className="min-h-screen p-6 text-white">
      <Link to="/finance" className="text-cyan-300 mb-4 inline-block">&larr; Back to Finance Dashboard</Link>
      <h1 className="text-3xl font-bold text-cyan-300">{dept.name} Finance</h1>

      <div className="grid grid-cols-4 gap-4 my-6">
        <Card title="Revenue">₹{dept.revenue}</Card>
        <Card title="Expenses">₹{dept.expenses}</Card>
        <Card title="Profit">₹{dept.profit}</Card>
        <Card title="Investments">₹{dept.investments}</Card>
      </div>

      <Card title="Add Transaction">
        <div className="flex gap-2 flex-wrap">
          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value as "income" | "expense" })}
            className="p-2 rounded bg-gray-700 text-white"
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <input
            type="text"
            placeholder="Description"
            value={form.description || ""}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="p-2 rounded bg-gray-700 text-white"
          />
          <input
            type="number"
            placeholder="Amount"
            value={form.amount || ""}
            onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })}
            className="p-2 rounded bg-gray-700 text-white"
          />
          <input
            type="date"
            value={form.date || ""}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            className="p-2 rounded bg-gray-700 text-white"
          />
          <button onClick={handleAdd} className="bg-cyan-400 px-4 py-2 rounded text-black">
            Add
          </button>
        </div>
      </Card>

      <Card title="Transactions">
        <table className="w-full text-sm mt-4">
          <thead>
            <tr className="border-b border-gray-700 text-gray-300">
              <th>Date</th>
              <th>Type</th>
              <th>Description</th>
              <th>Amount</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {dept.transactions.map((t) => (
              <tr key={t.id} className="border-b border-gray-700">
                <td>{t.date}</td>
                <td className={t.type === "income" ? "text-green-400" : "text-red-400"}>{t.type}</td>
                <td>{t.description}</td>
                <td>₹{t.amount}</td>
                <td>
                  <button
                    onClick={() => deleteTransaction(t.id, dept.id)}
                    className="text-red-400 hover:text-red-200"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {!dept.transactions.length && (
              <tr>
                <td colSpan={5} className="text-center py-4 text-gray-400">No transactions</td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
};
