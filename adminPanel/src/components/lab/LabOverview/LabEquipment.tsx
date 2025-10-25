import React from "react";
import { useLab } from "../../../context/LabContext";
import { FlaskConical, Box } from "lucide-react";
import { Card } from "../../../ui/Card";

export const LabEquipment = ({ lab }) => {

  return (
    <Card title="Equipment & Chemicals">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="font-semibold mb-2 flex items-center gap-2"><FlaskConical /> Equipment</h3>
          <ul className="text-sm text-gray-300 space-y-1">
            {lab.equipment.map(eq => (
              <li key={eq.id}>{eq.name} — {eq.quantity} pcs</li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-semibold mb-2 flex items-center gap-2"><Box /> Chemicals</h3>
          <ul className="text-sm text-gray-300 space-y-1">
            {lab.chemicals.map((c, i) => (
              <li key={i}>{c.name} — {c.stock}</li>
            ))}
          </ul>
        </div>
      </div>
    </Card>
  );
};
