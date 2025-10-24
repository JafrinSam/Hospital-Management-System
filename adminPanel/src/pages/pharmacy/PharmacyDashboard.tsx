import React from "react";
import ProductList from "../../components/pharmacy/ProductList";
import RestockList from "../../components/pharmacy/RestockList";
import TransactionsTable from "../../components/pharmacy/TransactionsTable";
import FinanceCards from "../../components/pharmacy/FinanceCards";
import { PharmacyProvider } from "../../context/PharmacyContext";

export default function PharmacyDashboardPage() {
  return (
    <PharmacyProvider>
      <div className="min-h-screen p-6  text-gray-600 space-y-6">
        <h1 className="text-3xl font-bold text-cyan-300">Pharmacy Admin Panel</h1>

        <FinanceCards />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ProductList />
          </div>
          <div className="space-y-4">
            <RestockList />
            <TransactionsTable />
          </div>
        </div>
      </div>
    </PharmacyProvider>
  );
}
