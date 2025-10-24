import React from "react";
import { useLab } from "../../../context/LabContext";
import { Users } from "lucide-react";
import { Card } from "../../../ui/Card";

export const LabTeam = ({ lab }) => {
  

  return (
    <Card title="Team Members">
      <ul className="space-y-2">
        {lab.staff.map((member) => (
          <li key={member.id} className="flex items-center gap-2">
            <Users className="w-5 h-5 text-cyan-300" />
            <div>
              <p className="font-medium">{member.name}</p>
              <p className="text-sm text-gray-300">{member.role}</p>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
};
