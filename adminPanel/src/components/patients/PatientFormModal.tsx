import React from 'react';
import { X, Save } from 'lucide-react';

type Patient = { _id?: string; name: string; email: string; phone?: string; status?: string; };

interface PatientFormModalProps {
  patient?: Patient | null;
  onClose: () => void;
  onSubmit: (p: Patient) => void;
}

export function PatientFormModal({ patient, onClose, onSubmit }: PatientFormModalProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    onSubmit({
      _id: patient?._id,
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      status: formData.get('status') as string,
    });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50">
      <div className="bg-gray-900 p-6 rounded w-[640px]">
        <h3 className="text-xl mb-3">{patient ? 'Edit Patient' : 'Add Patient'}</h3>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-3">
            <input name="name" defaultValue={patient?.name} placeholder="Name" className="p-2 rounded bg-gray-800" />
            <input name="email" defaultValue={patient?.email} placeholder="Email" className="p-2 rounded bg-gray-800" />
            <input name="phone" defaultValue={patient?.phone} placeholder="Phone" className="p-2 rounded bg-gray-800" />
            <select name="status" defaultValue={patient?.status || 'active'} className="p-2 rounded bg-gray-800">
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
            <div className="mt-4 flex justify-end">
            <button type="button" onClick={onClose} className="px-3 py-2 mr-2 bg-gray-600 rounded flex items-center">
                <X className="w-4 h-4 mr-1" /> Cancel
            </button>
            <button type="submit" className="px-3 py-2 bg-green-600 rounded flex items-center">
                <Save className="w-4 h-4 mr-1" /> Save
            </button>
            </div>
        </form>
      </div>
    </div>
  );
}
