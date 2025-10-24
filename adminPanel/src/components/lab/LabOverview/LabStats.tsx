import React from "react";
import { useLab } from "../../../context/LabContext";
import { Activity, FlaskRound } from "lucide-react";
import { Card } from "../../../ui/Card";

export const LabStats = ({ lab }) => {
  

  return (
    <Card title="Lab Statistics">
      <div className="flex justify-around text-center ">
        <div>
          <Activity className="w-6 h-6 mx-auto mb-1" />
          <p className="text-2xl font-bold">{lab.stats.testsToday}</p>
          <p className="text-sm text-gray-300">Tests Today</p>
        </div>
        <div>
          <FlaskRound className="w-6 h-6 mx-auto mb-1" />
          <p className="text-2xl font-bold">{lab.stats.totalTests}</p>
          <p className="text-sm text-gray-300">Total Tests</p>
        </div>
      </div>
    </Card>
  );
};
