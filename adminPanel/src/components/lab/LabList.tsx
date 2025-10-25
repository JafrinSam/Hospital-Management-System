import React from "react";
import { useLab } from "../../context/LabContext";
import { LabCard } from "./LabCard";

export const LabList = () => {
  const { labs } = useLab();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {labs.map((lab) => (
        <LabCard key={lab.id} lab={lab} />
      ))}
    </div>
  );
};
