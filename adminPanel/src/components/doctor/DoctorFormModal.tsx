import React, { useState } from 'react';
import { Doctor } from '../../context/DoctorContext';

type Props = {
  doctor?: Doctor | null;
  onClose: () => void;
  onSubmit: (doctor: Doctor) => void;
};

export const DoctorFormModal = ({ doctor, onClose, onSubmit }: Props) => {
  const [form, setForm] = useState<Doctor>({
    id: doctor?.id ?? '',
    name: doctor?.name ?? '',
    email: doctor?.email ?? '',
    phone: doctor?.phone ?? '',
    department: doctor?.department ?? '',
    inTime: doctor?.inTime ?? '09:00',
    outTime: doctor?.outTime ?? '17:00',
    patientsVisited: doctor?.patientsVisited ?? 0,
    schedule: doctor?.schedule ?? [],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!form.id) form.id = Math.random().toString(36).substring(2, 8);
    onSubmit(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
      <div className="bg-[#050a30] p-6 rounded-lg w-96 text-white space-y-4">
        <h2 className="text-xl font-bold">{doctor ? 'Edit Doctor' : 'Add Doctor'}</h2>
        <input name="name" value={form.name} onChange={handleChange} placeholder="Name" className="w-full p-2 rounded text-black"/>
        <input name="email" value={form.email} onChange={handleChange} placeholder="Email" className="w-full p-2 rounded text-black"/>
        <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" className="w-full p-2 rounded text-black"/>
        <input name="department" value={form.department} onChange={handleChange} placeholder="Department" className="w-full p-2 rounded text-black"/>
        <div className="flex space-x-2">
          <button onClick={handleSubmit} className="bg-cyan-400 px-4 py-2 rounded text-black">Save</button>
          <button onClick={onClose} className="bg-gray-600 px-4 py-2 rounded">Cancel</button>
        </div>
      </div>
    </div>
  );
};
