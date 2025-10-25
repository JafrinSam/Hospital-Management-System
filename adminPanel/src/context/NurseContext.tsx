import React, { createContext, useContext, useState } from "react";

/** Types **/
export type Shift = { id: string; day: string; start: string; end: string; ward?: string; notes?: string };
export type Nurse = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  department: string;
  role?: string;
  status?: "on-duty" | "off-duty" | "on-break";
  assignedTo?: string; // patient or ward
  experience?: number;
  rating?: number;
  shifts?: Shift[];
  notes?: string;
};

type NurseContextType = {
  nurses: Nurse[];
  addNurse: (n: Nurse) => void;
  updateNurse: (n: Nurse) => void;
  deleteNurse: (id: string) => void;
  assignShift: (nurseId: string, shift: Shift) => void;
  removeShift: (nurseId: string, shiftId: string) => void;
  setStatus: (nurseId: string, status: Nurse["status"]) => void;
  departments: string[];
};

const NurseContext = createContext<NurseContextType | undefined>(undefined);

/** Dummy initial data **/
const initialNurses: Nurse[] = [
  {
    id: "n1",
    name: "Anita Sharma",
    email: "anita@hospital.com",
    phone: "987650001",
    department: "ICU",
    role: "Senior Nurse",
    status: "on-duty",
    assignedTo: "Ward 3A",
    experience: 8,
    rating: 4.7,
    shifts: [
      { id: "s1", day: "Mon", start: "08:00", end: "16:00", ward: "3A" },
      { id: "s2", day: "Tue", start: "08:00", end: "16:00", ward: "3A" },
    ],
    notes: "Trainer for new nurses",
  },
  {
    id: "n2",
    name: "Priya Nair",
    email: "priya@hospital.com",
    phone: "987650002",
    department: "Emergency",
    role: "Nurse",
    status: "off-duty",
    assignedTo: "",
    experience: 4,
    rating: 4.3,
    shifts: [],
    notes: "",
  },
  {
    id: "n3",
    name: "Ravi Singh",
    email: "ravi@hospital.com",
    phone: "987650003",
    department: "Ward",
    role: "Charge Nurse",
    status: "on-break",
    assignedTo: "Ward 5B",
    experience: 6,
    rating: 4.6,
    shifts: [{ id: "s3", day: "Wed", start: "14:00", end: "22:00", ward: "5B" }],
  },
];

export const NurseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [nurses, setNurses] = useState<Nurse[]>(initialNurses);
  const departments = Array.from(new Set(initialNurses.map((n) => n.department))).sort();

  const addNurse = (n: Nurse) => setNurses((p) => [n, ...p]);
  const updateNurse = (n: Nurse) => setNurses((p) => p.map((x) => (x.id === n.id ? n : x)));
  const deleteNurse = (id: string) => setNurses((p) => p.filter((x) => x.id !== id));
  const assignShift = (nurseId: string, shift: Shift) =>
    setNurses((p) => p.map((n) => (n.id === nurseId ? { ...n, shifts: [...(n.shifts || []), shift] } : n)));
  const removeShift = (nurseId: string, shiftId: string) =>
    setNurses((p) => p.map((n) => (n.id === nurseId ? { ...n, shifts: (n.shifts || []).filter(s => s.id !== shiftId) } : n)));
  const setStatus = (nurseId: string, status: Nurse["status"]) =>
    setNurses((p) => p.map((n) => (n.id === nurseId ? { ...n, status } : n)));

  return (
    <NurseContext.Provider value={{ nurses, addNurse, updateNurse, deleteNurse, assignShift, removeShift, setStatus, departments }}>
      {children}
    </NurseContext.Provider>
  );
};

export const useNurse = () => {
  const ctx = useContext(NurseContext);
  if (!ctx) throw new Error("useNurse must be used within NurseProvider");
  return ctx;
};
