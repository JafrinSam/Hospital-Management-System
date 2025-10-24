import React, { useState } from "react";
import { LabTestList } from "./LabTestList";
import { LabTestDetails } from "./LabTestDetails";

export const LabTests = () => {
  const [selectedTest, setSelectedTest] = useState(null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <LabTestList onSelect={setSelectedTest} />
      <LabTestDetails test={selectedTest} />
    </div>
  );
};
