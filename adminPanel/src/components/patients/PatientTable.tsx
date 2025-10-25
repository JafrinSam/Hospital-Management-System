import React from 'react';
import { Edit, Eye, Trash2 } from 'lucide-react';
import { useNavigate } from "react-router-dom";


type Patient = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  status?: string;
};

interface PatientTableProps {
  patients: Patient[];
  loading: boolean;
  onEdit: (p: Patient) => void;
  onDelete: (id: string) => void;
  onView: (id: string) => void;
}

export function PatientTable({ patients, loading, onEdit, onDelete, onView }: PatientTableProps) {
 // inside your table
const navigate = useNavigate();

  return (
    <div className="bg-cyan/90 p-3 rounded-lg">
      <table className="w-full text-left">
        <thead className="text-sm text-white border-b border-gray-700">
          <tr>
            <th className="py-2">Name</th>
            <th className="py-2">Email</th>
            <th className="py-2">Phone</th>
            <th className="py-2">Status</th>
            <th className="py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={5} className="py-6 text-center">Loading...</td>
            </tr>
          ) : patients.length === 0 ? (
            <tr>
              <td colSpan={5} className="py-6 text-center">No patients</td>
            </tr>
          ) : (
            patients.map((u) => (
                <tr key={u._id} className="border-t border-gray-700 text-sm text-white">
                  <td className="py-2">{u.name}</td>
                  <td className="py-2">{u.email}</td>
                  <td className="py-2">{u.phone}</td>
                  <td className="py-2">{u.status}</td>
                  <td className="py-2">
                    <button onClick={() => onEdit(u)} className="text-sm bg-blue-600 px-2 py-1 rounded mr-2">
                      <Edit className="w-4 h-4 mr-1"/>
                    </button>
                    <button onClick={() => navigate(`/patient/${u._id}`)} className="text-sm bg-gray-600 px-2 py-1 rounded mr-2">
                     <Eye className="w-4 h-4 mr-1" />
                    </button>
                    <button onClick={() => onDelete(u._id)} className="text-sm bg-red-600 px-2 py-1 rounded">
                      <Trash2 className="w-4 h-4 mr-1" />
                    </button>
                  </td>
                </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
