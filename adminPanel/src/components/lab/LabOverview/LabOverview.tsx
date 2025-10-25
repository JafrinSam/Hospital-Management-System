import React from "react";
import { LabStats } from "./LabStats";
import { LabTeam } from "./LabTeam";
import { LabEquipment } from "./LabEquipment";

export const LabOverview = ({ lab }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    <div className="md:col-span-1"><LabStats lab={lab}/></div>
    <div className="md:col-span-1"><LabTeam lab={lab}/></div>
    <div className="md:col-span-1"><LabEquipment lab={lab}/></div>
  </div>
);
