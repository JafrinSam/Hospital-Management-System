import React from "react";
import { useNurse } from "../../context/NurseContext";

/** Simple live duty list */
export default function DutyMonitor() {
  const { nurses, setStatus } = useNurse();

  return (
    <div className="bg-white/5 p-4 rounded-lg">
      <h3 className="font-semibold mb-3">Duty Monitor</h3>
      <ul className="space-y-2">
        {nurses.map(n => (
          <li key={n.id} className="flex justify-between items-center p-2 bg-black/20 rounded">
            <div>
              <div className="font-medium">{n.name}</div>
              <div className="text-sm text-gray-100">{n.department} • {n.assignedTo || "Unassigned"}</div>
            </div>
            <div className="flex items-center gap-2">
              <div className={`px-2 py-1 rounded text-xs ${n.status === "on-duty" ? "bg-green-600" : n.status === "on-break" ? "bg-yellow-500" : "bg-gray-500"}`}>{n.status}</div>
              <select value={n.status} onChange={e => setStatus(n.id, e.target.value as any)} className="p-1 rounded bg-gray-800 text-white text-xs">
                <option value="on-duty">On Duty</option>
                <option value="on-break">On Break</option>
                <option value="off-duty">Off Duty</option>
              </select>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
