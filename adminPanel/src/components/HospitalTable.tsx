import { useState } from 'react';
import api from '../api/axiosClient';

interface Props {
  hospitals: any[];
  refresh: () => void;
}

export default function HospitalTable({ hospitals, refresh }: Props) {
  const [name, setName] = useState('');

  const addHospital = async () => {
    if (!name) return;
    await api.post('/superadmin/hospitals', { name });
    setName('');
    refresh();
  };

  const deleteHospital = async (id: string) => {
    if (!confirm('Delete this hospital?')) return;
    await api.delete(`/superadmin/hospitals/${id}`);
    refresh();
  };

  return (
    <div>
      <div className="flex mb-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="p-2 rounded bg-secondry_colour/10 flex-1 text-black placeholder-black/50 placeholder:text-sm placeholder:text-bold"
          placeholder="New hospital name"
        />
        <button
          onClick={addHospital}
          className="ml-2 bg-green-500 px-3 py-2 rounded hover:bg-green-600"
        >
          Add
        </button>
      </div>
      <table className="w-full border-2 bg-secondry_colour text-white rounded-lg">
        <thead>
          <tr className="text-left border-b border-gray-700">
            <th className="p-2">Name</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {hospitals.map((h) => (
            <tr key={h._id} className="border-b border-gray-700">
              <td className="p-2">{h.name}</td>
              <td className="p-2">
                <button
                  onClick={() => deleteHospital(h._id)}
                  className="bg-red-500 px-2 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
