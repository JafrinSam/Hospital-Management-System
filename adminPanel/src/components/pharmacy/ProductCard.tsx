import React from "react";
import { Product, usePharmacy } from "../../context/PharmacyContext";
import { Eye, Edit, Trash2, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";

export default function ProductCard({ product, onEdit }: { product: Product; onEdit?: (p: Product) => void; }) {
  const { deleteProduct, createRestockRequest } = usePharmacy();
  const low = product.minStock && product.stock <= product.minStock;

  return (
    <div className="bg-cyan/60 shadow-lg p-4 rounded-lg border border-white/10 ">
      <div className="flex justify-between">
        <div>
          <div className="text-lg font-semibold">{product.name}</div>
          <div className="text-sm text-gray-200">{product.brand} • {product.category}</div>
          <div className="text-sm text-gray-300 mt-2">SKU: {product.sku}</div>
        </div>
        <div className="text-right">
          <div className="text-xl font-bold">₹{product.price.toFixed(2)}</div>
          <div className={`text-sm mt-1 ${low ? "text-yellow-300" : "text-gray-300 text-2xl"}`}>
            Stock: {product.stock}{low && <span className="inline-flex items-center gap-1 ml-2"><AlertTriangle size={14}/> Low</span>}
          </div>
        </div>
      </div>

      <div className="mt-3 flex justify-between items-center">
        <div className="text-sm text-gray-300">{product.description}</div>
        <div className="flex gap-2">
          <Link to={`/pharmacy/products/${product.id}`} className="text-cyan-300"><Eye /></Link>
          <button onClick={() => onEdit && onEdit(product)} className="text-yellow-300"><Edit /></button>
          <button onClick={() => deleteProduct(product.id)} className="text-red-400"><Trash2 /></button>
          {low && <button onClick={() => createRestockRequest(product.id, Math.max(50, (product.minStock || 20) * 2))} className="px-2 py-1 bg-amber-500 text-black rounded ml-2">Request</button>}
        </div>
      </div>
    </div>
  );
}
