import React from "react";
import ProductList from "../../components/pharmacy/ProductList";
import { PharmacyProvider } from "../../context/PharmacyContext";

export default function PharmacyProductsPage() {
  return (
    <PharmacyProvider>
      <div className="min-h-screen p-6 bg-[#050a30] text-white">
        <h1 className="text-3xl font-bold mb-4 text-cyan-300">Products</h1>
        <ProductList />
      </div>
    </PharmacyProvider>
  );
}
