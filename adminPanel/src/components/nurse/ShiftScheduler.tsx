import React, { useState } from "react";
import { useNurse, Shift } from "../../context/NurseContext";
import { v4 as uuid } from "uuid";

/** Simple weekly scheduler — assign a shift to a nurse */
export default function ShiftScheduler() {
  const { nurses, assignShift, removeShift } = useNurse();
  const [nurseId, setNurseId] = useState(nurses[0]?.id || "");
  const [day, setDay] = useState("Mon");
  const [start, setStart] = useState("08:00");
  const [end, setEnd] = useState("16:00");
  const [ward, setWard] = useState("");

  const create = () => {
    if (!nurseId) return alert("Pick a nurse");
    const s: Shift = { id: uuid(), day, start, end, ward };
    assignShift(nurseId, s);
  };

  return (
    <div className="bg-white/5 p-4 rounded-lg">
      <h4 className="font-semibold mb-3">Shift Scheduler</h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        <select value={nurseId} onChange={e => setNurseId(e.target.value)} className="p-2 bg-gray-800 rounded">
          <option value="">Select Nurse</option>
          {nurses.map(n => <option key={n.id} value={n.id}>{n.name} — {n.department}</option>)}
        </select>
        <select value={day} onChange={e => setDay(e.target.value)} className="p-2 bg-gray-800 rounded">
          {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        <input type="time" value={start} onChange={e => setStart(e.target.value)} className="p-2 bg-gray-800 rounded" />
        <input type="time" value={end} onChange={e => setEnd(e.target.value)} className="p-2 bg-gray-800 rounded" />
        <input placeholder="Ward (e.g. 3A)" value={ward} onChange={e => setWard(e.target.value)} className="p-2 bg-gray-800 rounded" />
        <button onClick={create} className="px-3 py-2 bg-cyan-600 rounded">Assign Shift</button>
      </div>

      <div className="mt-4 space-y-2">
        {nurses.map(n => (
          <div key={n.id} className="bg-black/20 p-2 rounded">
            <div className="flex justify-between items-center">
              <div className="font-medium">{n.name}</div>
              <div className="text-sm text-gray-300">{(n.shifts || []).length} shifts</div>
            </div>
            <div className="mt-2 flex gap-2 flex-wrap">
              {(n.shifts || []).map(s => (
                <div key={s.id} className="bg-white/5 p-2 rounded flex items-center gap-2">
                  <div className="text-sm">{s.day} {s.start}-{s.end} {s.ward && `• ${s.ward}`}</div>
                  <button onClick={() => removeShift(n.id, s.id)} className="text-red-400 text-sm">Remove</button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
