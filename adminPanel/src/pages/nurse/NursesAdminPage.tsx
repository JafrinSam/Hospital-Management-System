import React from "react";
import NurseList from "../../components/nurse/NurseList";
import DutyMonitor from "../../components/nurse/DutyMonitor";
import ShiftScheduler from "../../components/nurse/ShiftScheduler";
import { NurseProvider } from "../../context/NurseContext";

export default function NursesAdminPage() {
  return (
    <NurseProvider>
      <div className="min-h-screen p-6  text-gray-600 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-cyan-300">Nurse Admin Panel</h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <NurseList />
          </div>
          <div className="space-y-4">
            <DutyMonitor />
            <ShiftScheduler />
          </div>
        </div>
      </div>
    </NurseProvider>
  );
}
