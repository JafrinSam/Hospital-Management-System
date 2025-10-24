import React from "react";
import { usePharmacy } from "../../context/PharmacyContext";

export default function RestockList() {
  const { restocks, products, processRestock } = usePharmacy();

  const findProduct = (id: string) => products.find(p => p.id === id);

  return (
    <div className="bg-white/70 shadow p-4 rounded-lg">
      <h3 className="font-semibold mb-3">Restock Requests</h3>
      {restocks.length === 0 && <div className="text-gray-400">No restock requests</div>}
      <ul className="space-y-2">
        {restocks.map(r => (
          <li key={r.id} className="flex justify-between items-center p-3 bg-secondry_colour/5 rounded">
            <div>
              <div className="font-medium">{findProduct(r.productId)?.name || r.productId}</div>
              <div className="text-sm text-gray-500">{r.qty} units • Requested {new Date(r.requestedAt).toLocaleString()}</div>
            </div>
            <div className="flex gap-2">
              <div className={`px-2 py-1 rounded text-sm ${r.status === 'pending' ? 'bg-yellow-500' : r.status === 'ordered' ? 'bg-blue-500' : 'bg-green-600'}`}>{r.status}</div>
              {r.status !== 'received' && <button onClick={() => processRestock(r.id)} className="px-3 py-1 bg-emerald-500 rounded text-black">Mark received</button>}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
