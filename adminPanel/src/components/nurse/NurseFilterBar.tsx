import React from "react";

export default function NurseFilterBar({ q, setQ, dept, setDept, departments }: {
  q: string; setQ: (v: string) => void; dept: string; setDept: (v: string) => void; departments: string[];
}) {
  return (
    <div className="flex gap-2 items-center">
      <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search nurses..." className="p-2 rounded bg-gray-800 text-white" />
      <select value={dept} onChange={e => setDept(e.target.value)} className="p-2 rounded bg-gray-800 text-white">
        <option value="">All Departments</option>
        {departments.map(d => <option key={d} value={d}>{d}</option>)}
      </select>
    </div>
  );
}
