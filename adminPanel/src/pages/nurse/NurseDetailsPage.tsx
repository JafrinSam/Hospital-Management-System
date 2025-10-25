import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useNurse } from "../../context/NurseContext";
import { ArrowLeft, Mail, Phone, Clock } from "lucide-react";

export default function NurseDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { nurses } = useNurse();
  const nurse = nurses.find(n => n.id === id);

  if (!nurse) return <div className="p-6">Nurse not found</div>;

  return (
    <div className="p-6 min-h-screen bg-[#050a30] text-white">
      <button onClick={() => navigate(-1)} className="text-cyan-300 mb-4 flex items-center gap-2"><ArrowLeft /> Back</button>
      <div className="max-w-4xl bg-[#000c66] p-6 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">{nurse.name}</h2>
            <p className="text-sm text-gray-300">{nurse.role} • {nurse.department}</p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-[#050a30] rounded">
            <h4 className="font-semibold mb-2">Contact</h4>
            <p><Mail className="inline mr-2" /> {nurse.email}</p>
            <p><Phone className="inline mr-2" /> {nurse.phone}</p>
          </div>

          <div className="p-4 bg-[#050a30] rounded">
            <h4 className="font-semibold mb-2">Status</h4>
            <p>Status: <span className={`px-2 py-1 rounded ${nurse.status === "on-duty" ? "bg-green-600" : nurse.status === "on-break" ? "bg-yellow-500" : "bg-gray-600"}`}>{nurse.status}</span></p>
            <p>Assigned: {nurse.assignedTo || "—"}</p>
            <p>Experience: {nurse.experience || "—"} years</p>
          </div>
        </div>

        <div className="mt-4">
          <h4 className="font-semibold mb-2">Shifts</h4>
          <div className="space-y-2">
            {(nurse.shifts || []).map(s => (
              <div key={s.id} className="p-2 bg-black/20 rounded">{s.day} • {s.start} - {s.end} {s.ward && `• ${s.ward}`}</div>
            ))}
            {(!nurse.shifts || nurse.shifts.length === 0) && <div className="text-gray-400">No shifts assigned</div>}
          </div>
        </div>

        <div className="mt-4">
          <h4 className="font-semibold mb-2">Notes</h4>
          <div className="p-3 bg-black/10 rounded">{nurse.notes || "No notes"}</div>
        </div>
      </div>
    </div>
  );
}
