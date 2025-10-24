import React from 'react';
import { useDoctor, Doctor } from '../../context/DoctorContext';
import { Edit, Trash2, Eye } from 'lucide-react';

type Props = {
  onView: (doctor: Doctor) => void;
  onEdit: (doctor: Doctor) => void;
};

export const DoctorList = ({ onView, onEdit }: Props) => {
  const { doctors, deleteDoctor } = useDoctor();

  return (
    <div className="bg-[#050a30] p-4 rounded-lg text-white">
      <h2 className="text-xl font-bold mb-2">Doctors</h2>
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-gray-600">
            <th>Name</th>
            <th>Email</th>
            <th>Department</th>
            <th>Patients Visited</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {doctors.map(d => (
            <tr key={d.id} className="border-b border-gray-700">
              <td>{d.name}</td>
              <td>{d.email}</td>
              <td>{d.department}</td>
              <td>{d.patientsVisited ?? 0}</td>
              <td className="space-x-2">
                <button onClick={() => onView(d)} className="text-cyan-400">
                  <Eye className="w-4 h-4 inline" />
                </button>
                <button onClick={() => onEdit(d)} className="text-yellow-400">
                  <Edit className="w-4 h-4 inline" />
                </button>
                <button onClick={() => deleteDoctor(d.id)} className="text-red-400">
                  <Trash2 className="w-4 h-4 inline" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
