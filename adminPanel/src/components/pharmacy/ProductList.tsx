import React, { useMemo, useState } from "react";
import { usePharmacy } from "../../context/PharmacyContext";
import ProductCard from "./ProductCard";
import ProductFormModal from "./ProductFormModal";
import StockAdjustModal from "./StockAdjustModal";
import { PlusCircle } from "lucide-react";
import { exportToCsv } from "../../utils/export";

export default function ProductList() {
  const { products } = usePharmacy();
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [showStockModal, setShowStockModal] = useState(false);
  const [stockProduct, setStockProduct] = useState<string | null>(null);

  const categories = Array.from(new Set(products.map(p => p.category || "Uncategorized")));

  const filtered = useMemo(() => products.filter(p => {
    const mq = q.trim().toLowerCase();
    if (mq && !(`${p.name} ${p.sku} ${p.brand}`.toLowerCase().includes(mq))) return false;
    if (category && (p.category || "") !== category) return false;
    return true;
  }), [products, q, category]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center gap-4">
        <div className="flex gap-2">
          <input placeholder="Search products..." value={q} onChange={e => setQ(e.target.value)} className="p-2 rounded bg-gray-800 text-white" />
          <select value={category} onChange={e => setCategory(e.target.value)} className="p-2 rounded bg-gray-800 text-white">
            <option value="">All categories</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="flex gap-2">
          <button onClick={() => exportToCsv(filtered, "products.csv")} className="px-3 py-2 bg-emerald-500 rounded text-white">Export CSV</button>
          <button onClick={() => { setEditing(null); setShowForm(true); }} className="px-3 py-2 bg-cyan rounded text-white flex items-center gap-2"><PlusCircle/> Add Product</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(p => <ProductCard key={p.id} product={p} onEdit={(prod) => { setEditing(prod); setShowForm(true); }} />)}
      </div>

      {showForm && <ProductFormModal product={editing} onClose={() => setShowForm(false)} />}
      {showStockModal && stockProduct && <StockAdjustModal productId={stockProduct} onClose={() => { setShowStockModal(false); setStockProduct(null); }} />}
    </div>
  );
}
