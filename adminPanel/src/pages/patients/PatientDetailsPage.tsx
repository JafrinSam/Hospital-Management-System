import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Activity, ClipboardList, Pill, FlaskConical } from "lucide-react";

type Appointment = {
  id: string;
  date: string;
  doctor: string;
  diagnosis: string;
  prescriptions: string[];
  medications: string[];
  labReports?: { test: string; result: string; status: string }[];
};

type Patient = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  appointments: Appointment[];
};

export default function PatientDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState<Patient | null>(null);

  // Dummy data (replace with API later)
  useEffect(() => {
    const dummy: Patient = {
      _id: id || "1",
      name: "John Doe",
      email: "john@karexpert.com",
      phone: "9876500001",
      status: "active",
      appointments: [
        {
          id: "a1",
          date: "2025-10-20",
          doctor: "Dr. Meera Patel",
          diagnosis: "Flu and Fever",
          prescriptions: ["Paracetamol 500mg", "Cough Syrup"],
          medications: ["Ibuprofen"],
          labReports: [
            { test: "CBC", result: "Normal", status: "Completed" },
            { test: "COVID Test", result: "Negative", status: "Completed" },
          ],
        },
        {
          id: "a2",
          date: "2025-09-14",
          doctor: "Dr. Rohan Sharma",
          diagnosis: "Back Pain",
          prescriptions: ["Pain Reliever", "Vitamin D3"],
          medications: ["Flexura D"],
        },
      ],
    };

    setPatient(dummy);
  }, [id]);

  if (!patient)
    return <div className="text-center mt-10 text-gray-300">Loading patient details...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-950 to-blue-900 text-white p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg border border-white/20"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <h1 className="text-3xl font-bold">Patient Details — {patient.name}</h1>
      </div>

      {/* Patient Info */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5" /> Personal Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-100">
          <p><span className="font-semibold">Name:</span> {patient.name}</p>
          <p><span className="font-semibold">Email:</span> {patient.email}</p>
          <p><span className="font-semibold">Phone:</span> {patient.phone}</p>
          <p><span className="font-semibold">Status:</span> {patient.status}</p>
        </div>
      </div>

      {/* Appointments Section */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold border-b border-white/20 pb-2 flex items-center gap-2">
          <ClipboardList className="w-6 h-6" /> Appointment History
        </h2>

        {patient.appointments.map((appt) => (
          <div
            key={appt.id}
            className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-lg"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {appt.date} — {appt.doctor}
              </h3>
              <span className="text-sm bg-white/20 px-2 py-1 rounded-md">
                {appt.diagnosis}
              </span>
            </div>

            {/* Prescriptions */}
            <div className="mb-3">
              <h4 className="font-semibold flex items-center gap-2 text-blue-200">
                <Pill className="w-4 h-4" /> Prescriptions
              </h4>
              <ul className="list-disc ml-6 text-gray-200">
                {appt.prescriptions.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
            </div>

            {/* Medications */}
            {appt.medications.length > 0 && (
              <div className="mb-3">
                <h4 className="font-semibold flex items-center gap-2 text-green-200">
                  <Pill className="w-4 h-4" /> Medications
                </h4>
                <ul className="list-disc ml-6 text-gray-200">
                  {appt.medications.map((m, i) => (
                    <li key={i}>{m}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Lab Reports */}
            {appt.labReports && appt.labReports.length > 0 && (
              <div>
                <h4 className="font-semibold flex items-center gap-2 text-yellow-200">
                  <FlaskConical className="w-4 h-4" /> Lab Reports
                </h4>
                <ul className="list-disc ml-6 text-gray-200">
                  {appt.labReports.map((r, i) => (
                    <li key={i}>
                      {r.test} — <span className="italic">{r.result}</span> (
                      {r.status})
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
