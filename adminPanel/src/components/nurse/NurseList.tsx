import React, { useMemo, useState } from "react";
import { useNurse, Nurse } from "../../context/NurseContext";
import NurseCard from "./NurseCard";
import NurseFormModal from "./NurseFormModal";
import NurseFilterBar from "./NurseFilterBar";
import { PlusCircle } from "lucide-react";
import { exportToCsv } from "../../utils/export"; // small util we'll show later

export default function NurseList() {
  const { nurses, departments } = useNurse();
  const [q, setQ] = useState("");
  const [deptFilter, setDeptFilter] = useState<string>("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Nurse | null>(null);
  const [page, setPage] = useState(1);
  const limit = 8;

  const filtered = useMemo(() => {
    return nurses.filter((n) => {
      const matchesQ = !q || `${n.name} ${n.email} ${n.phone}`.toLowerCase().includes(q.toLowerCase());
      const matchesDept = !deptFilter || n.department === deptFilter;
      return matchesQ && matchesDept;
    });
  }, [nurses, q, deptFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / limit));
  const pageItems = filtered.slice((page - 1) * limit, page * limit);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <NurseFilterBar q={q} setQ={setQ} dept={deptFilter} setDept={setDeptFilter} departments={departments} />
        <div className="flex items-center gap-2">
          <button onClick={() => { exportToCsv(filtered, "nurses.csv"); }} className="px-3 py-2 bg-emerald-500 text-white rounded">Export CSV</button>
          <button onClick={() => { setEditing(null); setShowForm(true); }} className="px-3 py-2 bg-cyan/50 text-white rounded flex items-center gap-2">
            <PlusCircle /> Add Nurse
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {pageItems.map((n) => (
          <NurseCard key={n.id} nurse={n} onEdit={() => { setEditing(n); setShowForm(true); }} />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-3 mt-4">
        <button className="px-3 py-1 rounded bg-secondry_colour text-gray-200" onClick={() => setPage(p => Math.max(1, p-1))}>Prev</button>
        <div>Page {page} / {totalPages}</div>
        <button className="px-3 py-1 rounded bg-secondry_colour text-gray-200" onClick={() => setPage(p => Math.min(totalPages, p+1))}>Next</button>
      </div>

      {showForm && <NurseFormModal nurse={editing} onClose={() => setShowForm(false)} />}
    </div>
  );
}
