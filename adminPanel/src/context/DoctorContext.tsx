import React, { createContext, useContext, useState } from 'react';

export type Doctor = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  department?: string;
  inTime?: string;
  outTime?: string;
  patientsVisited?: number;
  schedule?: { day: string; inTime: string; outTime: string }[];
};

type DoctorContextType = {
  doctors: Doctor[];
  addDoctor: (doc: Doctor) => void;
  updateDoctor: (doc: Doctor) => void;
  deleteDoctor: (id: string) => void;
};

const DoctorContext = createContext<DoctorContextType | null>(null);

export const DoctorProvider = ({ children }: { children: React.ReactNode }) => {
  const [doctors, setDoctors] = useState<Doctor[]>([
    {
      id: '1',
      name: 'Dr. John Doe',
      email: 'john@hospital.com',
      phone: '9876543210',
      department: 'Cardiology',
      inTime: '09:00',
      outTime: '17:00',
      patientsVisited: 20,
      schedule: [
        { day: 'Monday', inTime: '09:00', outTime: '17:00' },
        { day: 'Tuesday', inTime: '09:00', outTime: '17:00' },
      ],
    },
  ]);

  const addDoctor = (doc: Doctor) => setDoctors(prev => [...prev, doc]);
  const updateDoctor = (doc: Doctor) =>
    setDoctors(prev => prev.map(d => (d.id === doc.id ? doc : d)));
  const deleteDoctor = (id: string) =>
    setDoctors(prev => prev.filter(d => d.id !== id));

  return (
    <DoctorContext.Provider value={{ doctors, addDoctor, updateDoctor, deleteDoctor }}>
      {children}
    </DoctorContext.Provider>
  );
};

export const useDoctor = () => {
  const context = useContext(DoctorContext);
  if (!context) throw new Error("useDoctor must be used within DoctorProvider");
  return context;
};
