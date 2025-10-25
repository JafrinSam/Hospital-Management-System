import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

const apiUrl = import.meta.env.VITE_BACKEND_URL;

export interface Doctor {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  inTime: string;
  outTime: string;
  patientsVisited: number;
  schedule: string[];
  specialization?: string;
  qualifications?: string[];
  licenseNumber?: string;
  availability?: {
    days: string[];
    timeSlots: string[];
  };
}

interface DoctorContextType {
  doctors: Doctor[];
  addDoctor: (doctor: Doctor) => void;
  updateDoctor: (doctor: Doctor) => void;
  deleteDoctor: (id: string) => void;
  getDoctorById: (id: string) => Doctor | undefined;
  fetchDoctors: () => Promise<void>;
}

const DoctorContext = createContext<DoctorContextType | undefined>(undefined);

export const useDoctor = () => {
  const context = useContext(DoctorContext);
  if (!context) throw new Error("useDoctor must be used within a DoctorProvider");
  return context;
};

export const DoctorProvider = ({ children }: { children: ReactNode }) => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);


  // Fetch all doctors from backend
  const fetchDoctors = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/doctors`);
      const data = await res.json();
      
      setDoctors(data);
      console.log("Fetched doctors:", data);
    } catch (err) {
      console.error(err);
    }
  };


  // Fetch doctors from backend (optional)
  useEffect(() => {
    fetchDoctors()
  }, []);

const addDoctor = async (doctor: Doctor) => {
  try {
    await fetch(`${apiUrl}/api/doctors`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(doctor),
    });
    await fetchDoctors(); // refresh after adding
  } catch (err) {
    console.error(err);
  }
};

const updateDoctor = async (doctor: Doctor) => {
  try {
    await fetch(`${apiUrl}/api/doctors/${doctor.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(doctor),
    });
    await fetchDoctors(); // refresh after updating
  } catch (err) {
    console.error(err);
  }
};

const deleteDoctor = async (id: string) => {
  try {
    await fetch(`${apiUrl}/api/doctors/${id}`, { method: "DELETE" });
    await fetchDoctors(); // refresh after deleting
  } catch (err) {
    console.error(err);
  }
};

  const getDoctorById = (id: string) => doctors.find((d) => d.id === id);

  return (
    <DoctorContext.Provider value={{ doctors, addDoctor, updateDoctor, deleteDoctor, getDoctorById, fetchDoctors }}>
      {children}
    </DoctorContext.Provider>
  );
};
