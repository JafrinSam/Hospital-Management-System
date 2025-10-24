import React, { useState, useEffect } from "react";
import { usePharmacy, Product } from "../../context/PharmacyContext";

export default function ProductFormModal({ product, onClose }: { product?: Product | null; onClose: () => void; }) {
  const { addProduct, updateProduct } = usePharmacy();
  const [form, setForm] = useState<Product>(product ?? {
    id: "",
    sku: "",
    name: "",
    brand: "",
    category: "",
    price: 0,
    costPrice: 0,
    stock: 0,
    minStock: 10,
    description: ""
  });

  useEffect(() => { if (product) setForm(product); }, [product]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) return alert("Name required");
    if (!form.id) addProduct({ ...form, id: undefined as any });
    else updateProduct(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <form onSubmit={submit} className="bg-[#050a30] text-white p-6 rounded w-full max-w-lg space-y-3">
        <h3 className="text-xl font-semibold">{product ? "Edit Product" : "Add Product"}</h3>
        <input value={form.sku} onChange={e => setForm({...form, sku: e.target.value})} placeholder="SKU" className="w-full p-2 rounded bg-gray-800" />
        <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Product name" className="w-full p-2 rounded bg-gray-800" required />
        <div className="grid grid-cols-2 gap-2">
          <input value={form.brand} onChange={e => setForm({...form, brand: e.target.value})} placeholder="Brand" className="p-2 rounded bg-gray-800" />
          <input value={form.category} onChange={e => setForm({...form, category: e.target.value})} placeholder="Category" className="p-2 rounded bg-gray-800" />
        </div>
        <div className="grid grid-cols-3 gap-2">
          <input type="number" value={form.price} onChange={e => setForm({...form, price: Number(e.target.value)})} placeholder="Price" className="p-2 rounded bg-gray-800" />
          <input type="number" value={form.costPrice} onChange={e => setForm({...form, costPrice: Number(e.target.value)})} placeholder="Cost" className="p-2 rounded bg-gray-800" />
          <input type="number" value={form.stock} onChange={e => setForm({...form, stock: Number(e.target.value)})} placeholder="Stock" className="p-2 rounded bg-gray-800" />
        </div>
        <input type="number" value={form.minStock} onChange={e => setForm({...form, minStock: Number(e.target.value)})} placeholder="Min stock threshold" className="w-full p-2 rounded bg-gray-800" />
        <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Description" className="w-full p-2 rounded bg-gray-800" />
        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="px-3 py-2 bg-gray-600 rounded">Cancel</button>
          <button type="submit" className="px-3 py-2 bg-cyan-600 rounded">Save</button>
        </div>
      </form>
    </div>
  );
}
