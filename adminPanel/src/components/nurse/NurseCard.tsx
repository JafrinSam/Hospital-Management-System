import React from "react";
import { Nurse, useNurse } from "../../context/NurseContext";
import { Edit, Eye, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

export default function NurseCard({ nurse, onEdit }: { nurse: Nurse; onEdit?: () => void }) {
  const { deleteNurse, setStatus } = useNurse();

  return (
    <div className="bg-cyan p-4 rounded-lg border border-white/10 shadow-sm">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-gray-700">{nurse.name}</h3>
          <p className="text-sm text-gray-200">{nurse.role ?? "Nurse"} • {nurse.department}</p>
          <p className="text-xs text-gray-400 mt-2">{nurse.notes}</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className={`px-2 py-1 rounded text-xs ${nurse.status === "on-duty" ? "bg-green-500" : nurse.status === "on-break" ? "bg-yellow-500" : "bg-gray-300"}`}>{nurse.status}</div>
          <div className="flex gap-2">
            <Link to={`/nurses/${nurse.id}`} className="text-cyan-300"><Eye /></Link>
            <button onClick={onEdit} className="text-yellow-300"><Edit /></button>
            <button onClick={() => deleteNurse(nurse.id)} className="text-red-400"><Trash2 /></button>
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between text-sm text-gray-300">
        <div>
          <div>Phone: {nurse.phone || "—"}</div>
          <div>Email: {nurse.email || "—"}</div>
        </div>
        <div>
          <button onClick={() => setStatus(nurse.id, nurse.status === "on-duty" ? "off-duty" : "on-duty")} className="px-2 py-1 rounded bg-white/5">Toggle Duty</button>
        </div>
      </div>
    </div>
  );
}
