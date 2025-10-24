import React from 'react';
import { Plus, Search } from 'lucide-react';

interface PatientFiltersProps {
  q: string;
  setQ: (q: string) => void;
  statusFilter: string;
  setStatusFilter: (s: string) => void;
  onCreate: () => void;
}

export function PatientFilters({ q, setQ, statusFilter, setStatusFilter, onCreate }: PatientFiltersProps) {
  return (
    <div className="flex items-center mb-4 flex-wrap gap-2">
      <div className="flex items-center flex-1 bg-gray-800 rounded">
        <Search className="ml-2 w-5 h-5 text-white" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by name or email"
          className="p-2 rounded-r text-white bg-gray-800 flex-1"
        />
      </div>
      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        className="p-2 rounded bg-cyan text-white"
      >
        <option value="">All Status</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>
      <button onClick={onCreate} className="px-3 py-2 bg-green-600 rounded flex items-center">
        <Plus className="w-4 h-4 mr-1" /> Add Patient
      </button>
    </div>
  );
}