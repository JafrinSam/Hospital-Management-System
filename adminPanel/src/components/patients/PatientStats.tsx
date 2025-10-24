import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
}

export function StatCard({ title, value }: StatCardProps) {
  return (
    <div className="bg-secondry_colour p-4 rounded-lg flex-1">
      <div className="text-sm text-gray-200">{title}</div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  );
}

interface PatientStatsProps {
  stats: { totalPatients: number; totalAppointments: number; avgAppointmentsPerPatient: number };
}

export function PatientStats({ stats }: PatientStatsProps) {
  return (
    <div className="flex mb-4 flex-wrap gap-4">
      <StatCard title="Total Patients" value={stats.totalPatients} />
      <StatCard title="Total Appointments" value={stats.totalAppointments} />
      <StatCard title="Avg Appointments / Patient" value={stats.avgAppointmentsPerPatient.toFixed(2)} />
    </div>
  );
}
