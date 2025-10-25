import React from 'react';
import { X } from 'lucide-react';

interface PatientDetailsModalProps {
  patient: any;
  onClose: () => void;
}

export function PatientDetailsModal({ patient, onClose }: PatientDetailsModalProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 overflow-auto p-4">
      <div className="bg-gray-900 p-6 rounded w-full max-w-3xl">
        <h3 className="text-xl mb-3">Patient Details: {patient.name}</h3>
        <div className="mb-4">
          <strong>Email:</strong> {patient.email}<br/>
          <strong>Phone:</strong> {patient.phone}<br/>
          <strong>Status:</strong> {patient.status}
        </div>
        <div className="mb-4">
          <h4 className="font-bold mb-2">Medical Records</h4>
          <div>
            <strong>Lab Tests:</strong>
            <ul className="list-disc ml-5">
              {patient.labTests?.map((lab: any, idx: number) => (
                <li key={idx}>{lab}</li>
              ))}
            </ul>
            <strong>Prescriptions:</strong>
            <ul className="list-disc ml-5">
              {patient.prescriptions?.map((p: any, idx: number) => (
                <li key={idx}>{p}</li>
              ))}
            </ul>
            <strong>Medications:</strong>
            <ul className="list-disc ml-5">
              {patient.medications?.map((m: any, idx: number) => (
                <li key={idx}>{m}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="flex justify-end">
        <button onClick={onClose} className="px-3 py-2 bg-gray-600 rounded flex items-center">
            <X className="w-4 h-4 mr-1" /> Close
        </button>
        </div>
      </div>
    </div>
  );
}
