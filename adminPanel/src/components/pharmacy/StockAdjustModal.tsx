import React, { useState } from "react";
import { usePharmacy } from "../../context/PharmacyContext";

export default function StockAdjustModal({ productId, onClose }: { productId: string; onClose: () => void; }) {
  const { products, adjustStock } = usePharmacy();
  const product = products.find(p => p.id === productId)!;
  const [qty, setQty] = useState<number>(0);
  const [reason, setReason] = useState("");

  const submit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!qty) return alert("Qty required");
    adjustStock(productId, qty, reason);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <form onSubmit={submit} className="bg-[#050a30] text-white p-6 rounded w-full max-w-md space-y-3">
        <h3 className="text-xl font-semibold">Adjust Stock — {product.name}</h3>
        <input type="number" value={qty} onChange={e => setQty(Number(e.target.value))} className="w-full p-2 rounded bg-gray-800" placeholder="Use negative numbers to decrement" />
        <input value={reason} onChange={e => setReason(e.target.value)} className="w-full p-2 rounded bg-gray-800" placeholder="Reason (optional)" />
        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="px-3 py-2 bg-gray-600 rounded">Cancel</button>
          <button type="submit" className="px-3 py-2 bg-cyan-600 rounded">Apply</button>
        </div>
      </form>
    </div>
  );
}
