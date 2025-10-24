import React from "react";
import { LabList } from "../../components/lab/LabList";
import { LabProvider } from "../../context/LabContext";

export default function AdminLabPanel() {
  return (

      <div className="min-h-screen  text-gray-600 p-6 space-y-6">
        <h1 className="text-3xl font-bold text-cyan-300 mb-4">Lab Admin Panel</h1>
        <LabList />
      </div>

  );
}
