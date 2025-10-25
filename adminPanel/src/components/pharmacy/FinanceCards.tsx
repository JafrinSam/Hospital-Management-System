// src/components/pharmacy/FinanceCards.tsx
import React, { useMemo } from "react";
import { usePharmacy } from "../../context/PharmacyContext";
import { Link } from "react-router-dom";

export default function FinanceCards() {
  const { products, transactions } = usePharmacy();

  const totals = useMemo(() => {
    const revenue = transactions
      .filter((t) => t.type === "sale")
      .reduce((s, t) => s + t.amount, 0);

    const costOfGoods = transactions
      .filter((t) => t.type === "sale")
      .reduce((s, t) => {
        const prod = products.find((p) => p.id === t.productId);
        return s + ((prod?.costPrice || 0) * t.qty);
      }, 0);

    const profit = revenue - costOfGoods;
    const stockValue = products.reduce(
      (s, p) => s + p.stock * (p.costPrice || 0),
      0
    );

    return { revenue, costOfGoods, profit, stockValue };
  }, [transactions, products]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="bg-cyan/50 p-4 rounded-lg">
        <div className="text-sm text-gray-200">Revenue</div>
        <div className="text-2xl font-bold">₹{totals.revenue.toFixed(2)}</div>
      </div>

      <div className="bg-cyan/50 p-4 rounded-lg">
        <div className="text-sm text-gray-200">COGS</div>
        <div className="text-2xl font-bold">₹{totals.costOfGoods.toFixed(2)}</div>
      </div>

      <div className="bg-cyan/50 p-4 rounded-lg">
        <div className="text-sm text-gray-200">Profit</div>
        <div className="text-2xl font-bold">₹{totals.profit.toFixed(2)}</div>
      </div>

      <div className="bg-cyan/50 p-4 rounded-lg">
        <div className="text-sm text-gray-200">Stock Value</div>
        <div className="text-2xl font-bold">₹{totals.stockValue.toFixed(2)}</div>
      </div>

      {/* --- Abstract Stock Info Section --- */}
      <div className="col-span-1 md:col-span-2 lg:col-span-4 mt-4 bg-cyan/90 p-6 rounded-lg flex justify-between items-center">
        <div>
          <h4 className="font-semibold mb-2 text-white">Stock Overview</h4>
          <p className="text-gray-200 text-sm">
            View detailed stock analytics and insights.
          </p>
        </div>
        <Link
          to="/pharmacy/stock-charts"
          className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-semibold transition-all"
        >
          View Full Charts →
        </Link>
      </div>
    </div>
  );
}
