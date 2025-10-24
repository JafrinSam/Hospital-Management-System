import React from "react";
import { Card } from "../../../ui/Card";
import { FlaskConical } from "lucide-react";

export const LabTestDetails = ({ test }) => {
  if (!test) return null;

  return (
    <Card title="Test Details">
      <div className="space-y-2 text-gray-200">
        <p><strong>Test Name:</strong> {test.name}</p>
        <p><strong>Conducted By:</strong> {test.conductedBy}</p>
        <p><strong>Result:</strong> {test.result}</p>
        <p><strong>Cost:</strong> ₹{test.cost}</p>
        <div className="flex items-center gap-2 text-gray-200 mt-3">
          <FlaskConical className="w-5 h-5" /> Test verified by the system
        </div>
      </div>
    </Card>
  );
};
