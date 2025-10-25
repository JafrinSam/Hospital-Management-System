import React, { useState, useEffect } from 'react';
import { PatientStats } from '../../components/patients/PatientStats';
import { PatientFilters } from '../../components/patients/PatientFilters';
import { PatientTable } from '../../components/patients/PatientTable';
import { PatientFormModal } from '../../components/patients/PatientFormModal';
import { PatientDetailsModal } from '../../components/patients/PatientDetailsModal';

type Patient = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  status?: string;
  labTests?: string[];
  prescriptions?: string[];
  medications?: string[];
};

export default function PatientsAdminPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [stats, setStats] = useState({ totalPatients: 0, totalAppointments: 0, avgAppointmentsPerPatient: 0 });
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [editing, setEditing] = useState<Patient | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [viewing, setViewing] = useState<Patient | null>(null);

  // Dummy patients
  const dummyPatients: Patient[] = [
    {
      _id: '1',
      name: 'John Doe',
      email: 'john@karexpert.com',
      phone: '9876500001',
      status: 'active',
      labTests: ['Blood Test', 'X-Ray'],
      prescriptions: ['Paracetamol', 'Vitamin D'],
      medications: ['Ibuprofen'],
    },
    {
      _id: '2',
      name: 'Alice Smith',
      email: 'alice@karexpert.com',
      phone: '9876543210',
      status: 'active',
      labTests: ['MRI Scan'],
      prescriptions: ['Amoxicillin'],
      medications: ['Insulin'],
    },
  ];

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const filtered = dummyPatients.filter(
        (p) =>
          (!q || p.name.toLowerCase().includes(q.toLowerCase()) || p.email.toLowerCase().includes(q.toLowerCase())) &&
          (!statusFilter || p.status === statusFilter)
      );
      setPatients(filtered);
      setStats({
        totalPatients: dummyPatients.length,
        totalAppointments: 120,
        avgAppointmentsPerPatient: 3.2,
      });
      setLoading(false);
    }, 300);
  }, [q, statusFilter]);

  const handleCreate = () => { setEditing(null); setShowForm(true); };
  const handleEdit = (p: Patient) => { setEditing(p); setShowForm(true); };
  const handleDelete = (id: string) => { if (confirm('Delete patient?')) setPatients(prev => prev.filter(p => p._id !== id)); };
  const handleView = (id: string) => { const p = patients.find(p => p._id === id); if (p) setViewing(p); };
  const handleSubmit = (p: Patient) => {
    if (editing) setPatients(prev => prev.map(pt => pt._id === editing._id ? p : pt));
    else setPatients(prev => [...prev, {...p, _id: Math.random().toString(36).substring(2,8)}]);
    setShowForm(false);
  };

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Patient Admin — KareXpert</h1>
      <PatientStats stats={stats} />
      <PatientFilters q={q} setQ={setQ} statusFilter={statusFilter} setStatusFilter={setStatusFilter} onCreate={handleCreate} />
      <PatientTable patients={patients} loading={loading} onEdit={handleEdit} onDelete={handleDelete} onView={handleView} />
      {showForm && <PatientFormModal patient={editing} onClose={() => setShowForm(false)} onSubmit={handleSubmit} />}
      {viewing && <PatientDetailsModal patient={viewing} onClose={() => setViewing(null)} />}
    </div>
  );
}
