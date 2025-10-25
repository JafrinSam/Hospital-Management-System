import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { usePharmacy } from "../../context/PharmacyContext";

export default function PharmacyProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { products } = usePharmacy();
  const product = products.find(p => p.id === id);
  const navigate = useNavigate();

  if (!product) return <div className="p-6 text-white">Product not found</div>;

  return (
    <div className="min-h-screen p-6  text-gray-600">
      <button onClick={() => navigate(-1)} className="text-cyan-300 mb-4">← Back</button>

      <div className="bg-white/50 p-6 rounded-lg">
        <h2 className="text-2xl font-bold">{product.name}</h2>
        <p className="text-sm text-gray-400 font-semibold">SKU: {product.sku} • {product.brand} • {product.category}</p>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-3 bg-cyan/50 rounded">
            <div className="text-sm text-gray-700 ">Price</div>
            <div className="text-xl font-bold">₹{product.price.toFixed(2)}</div>
            <div className="text-sm text-white">Cost: ₹{(product.costPrice||0).toFixed(2)}</div>
          </div>
          <div className="p-3 bg-cyan/50 rounded">
            <div className="text-sm text-gray-700">Stock</div>
            <div className="text-xl font-bold">{product.stock}</div>
            <div className="text-sm text-white">Min threshold: {product.minStock}</div>
          </div>
          <div className="p-3 bg-cyan/50 rounded">
            <div className="text-sm text-gray-700">Description</div>
            <div className="text-sm text-gray-200 mt-2">{product.description}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
