import React, { createContext, useContext, useState } from "react";

const LabContext = createContext(null);

export const LabProvider = ({ children }) => {
  const [labs] = useState([
    {
      id: "lab1",
      name: "SRM Diagnostic Lab",
      category: "Pathology",
      staff: [
        { id: 1, name: "Dr. Meena", role: "Chief Pathologist" },
        { id: 2, name: "Rajesh Kumar", role: "Lab Technician" },
      ],
      equipment: [
        { id: 1, name: "Centrifuge", quantity: 2 },
        { id: 2, name: "Microscope", quantity: 4 },
      ],
      chemicals: [
        { name: "Ethanol", stock: "20L" },
        { name: "Buffer Solution", stock: "15L" },
      ],
      stats: { testsToday: 56, totalTests: 15430 },
      tests: [
        { id: 1, name: "Blood Sugar", conductedBy: "Rajesh", result: "Normal", cost: 300 },
        { id: 2, name: "Lipid Profile", conductedBy: "Meena", result: "High", cost: 800 },
      ],
    },
    {
      id: "lab2",
      name: "GreenLife Bio Lab",
      category: "Microbiology",
      staff: [
        { id: 1, name: "Dr. Aditya Rao", role: "Microbiologist" },
        { id: 2, name: "Kavya Menon", role: "Research Assistant" },
      ],
      equipment: [
        { id: 1, name: "Incubator", quantity: 2 },
        { id: 2, name: "Autoclave", quantity: 1 },
      ],
      chemicals: [
        { name: "Agar Medium", stock: "12L" },
        { name: "Distilled Water", stock: "30L" },
      ],
      stats: { testsToday: 34, totalTests: 7210 },
      tests: [
        { id: 1, name: "Bacteria Culture", conductedBy: "Kavya", result: "Growth Detected", cost: 500 },
      ],
    },
  ]);

  return <LabContext.Provider value={{ labs }}>{children}</LabContext.Provider>;
};

export const useLab = () => useContext(LabContext);
