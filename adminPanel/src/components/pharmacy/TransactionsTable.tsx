import React from "react";
import { usePharmacy } from "../../context/PharmacyContext";

export default function TransactionsTable() {
  const { transactions, products } = usePharmacy();

  const findProduct = (id: string) => products.find(p => p.id === id);

  return (
    <div className="bg-white/50 shadow p-4 rounded-lg overflow-auto">
      <h3 className="font-semibold mb-3">Transactions</h3>
      <table className="w-full text-sm">
        <thead className="text-gray-500">
          <tr>
            <th>Date</th>
            <th>Product</th>
            <th>Type</th>
            <th>Qty</th>
            <th>Amount</th>
            <th>Note</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map(t => (
            <tr key={t.id} className="border-t border-white/5">
              <td>{new Date(t.date).toLocaleString()}</td>
              <td>{findProduct(t.productId)?.name || t.productId}</td>
              <td className={t.type === "sale" ? "text-green-500" : t.type === "refund" ? "text-yellow-300" : "text-blue-300"}>{t.type}</td>
              <td>{t.qty}</td>
              <td>₹{t.amount.toFixed(2)}</td>
              <td>{t.note}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
