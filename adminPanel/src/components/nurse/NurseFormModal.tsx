import React, { useState, useEffect } from "react";
import { Nurse, useNurse } from "../../context/NurseContext";
import { v4 as uuid } from "uuid";

export default function NurseFormModal({ nurse, onClose }: { nurse?: Nurse | null; onClose: () => void }) {
  const { addNurse, updateNurse, departments } = useNurse();
  const [form, setForm] = useState<Nurse>(nurse ?? {
    id: "",
    name: "",
    email: "",
    phone: "",
    department: departments[0] || "General",
    role: "Nurse",
    status: "off-duty",
    experience: 0,
    rating: 0,
    shifts: [],
    notes: ""
  });

  useEffect(() => { if (nurse) setForm(nurse); }, [nurse]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) return alert("Name required");
    if (!form.id) { form.id = uuid(); addNurse(form); } else updateNurse(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <form onSubmit={submit} className="bg-[#050a30] p-6 rounded-lg w-full max-w-md text-white space-y-3">
        <h3 className="text-xl font-semibold">{form.id ? "Edit Nurse" : "Add Nurse"}</h3>
        <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Name" className="w-full p-2 rounded bg-gray-800" />
        <input value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="Email" className="w-full p-2 rounded bg-gray-800" />
        <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="Phone" className="w-full p-2 rounded bg-gray-800" />
        <select value={form.department} onChange={e => setForm({...form, department: e.target.value})} className="w-full p-2 rounded bg-gray-800">
          {departments.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        <textarea value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} placeholder="Notes" className="w-full p-2 rounded bg-gray-800" />
        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="px-3 py-2 bg-gray-600 rounded">Cancel</button>
          <button type="submit" className="px-3 py-2 bg-cyan-600 rounded">Save</button>
        </div>
      </form>
    </div>
  );
}
