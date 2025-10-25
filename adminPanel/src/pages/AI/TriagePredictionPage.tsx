import React, { useState } from "react";
import axios from "axios";

type Patient = {
  triage_code: number;
  gender: string;
  age: number;
  ChiefComplaint: string;
  BlooddpressurSystol: number;
  BlooddpressurDiastol: number;
  PulseRate: number;
  RespiratoryRate: number;
  Temperature: number;
  O2Saturation: number;
  AVPU: number;
};

export default function TriageAdminPage() {
const [patients, setPatients] = useState<Patient[]>([
  {
    "triage_code": 501,
    "gender": "Male",
    "age": 25,
    "ChiefComplaint": "Routine Checkup",
    "BlooddpressurSystol": 120,
    "BlooddpressurDiastol": 78,
    "PulseRate": 70,
    "RespiratoryRate": 16,
    "Temperature": 36.7,
    "O2Saturation": 98,
    "AVPU": 1
  },
  {
    "triage_code": 502,
    "gender": "Female",
    "age": 40,
    "ChiefComplaint": "Headache",
    "BlooddpressurSystol": 125,
    "BlooddpressurDiastol": 80,
    "PulseRate": 72,
    "RespiratoryRate": 16,
    "Temperature": 36.8,
    "O2Saturation": 97,
    "AVPU": 1
  },
  {
    "triage_code": 503,
    "gender": "Male",
    "age": 60,
    "ChiefComplaint": "Follow-up visit",
    "BlooddpressurSystol": 130,
    "BlooddpressurDiastol": 82,
    "PulseRate": 75,
    "RespiratoryRate": 18,
    "Temperature": 37.0,
    "O2Saturation": 96,
    "AVPU": 1
  },
  {
    "triage_code": 601,
    "gender": "Female",
    "age": 70,
    "ChiefComplaint": "Fever and cough",
    "BlooddpressurSystol": 150,
    "BlooddpressurDiastol": 90,
    "PulseRate": 105,
    "RespiratoryRate": 22,
    "Temperature": 39.5,
    "O2Saturation": 92,
    "AVPU": 1
  },
  {
    "triage_code": 602,
    "gender": "Male",
    "age": 55,
    "ChiefComplaint": "Chest discomfort",
    "BlooddpressurSystol": 145,
    "BlooddpressurDiastol": 88,
    "PulseRate": 110,
    "RespiratoryRate": 24,
    "Temperature": 37.4,
    "O2Saturation": 93,
    "AVPU": 1
  },
  {
    "triage_code": 603,
    "gender": "Female",
    "age": 68,
    "ChiefComplaint": "Shortness of breath",
    "BlooddpressurSystol": 135,
    "BlooddpressurDiastol": 84,
    "PulseRate": 98,
    "RespiratoryRate": 26,
    "Temperature": 38.2,
    "O2Saturation": 91,
    "AVPU": 1
  },
  {
    "triage_code": 701,
    "gender": "Male",
    "age": 80,
    "ChiefComplaint": "Collapse / unconscious",
    "BlooddpressurSystol": 78,
    "BlooddpressurDiastol": 48,
    "PulseRate": 50,
    "RespiratoryRate": 10,
    "Temperature": 36.4,
    "O2Saturation": 85,
    "AVPU": 3
  },
  {
    "triage_code": 702,
    "gender": "Female",
    "age": 50,
    "ChiefComplaint": "Severe respiratory distress",
    "BlooddpressurSystol": 190,
    "BlooddpressurDiastol": 115,
    "PulseRate": 140,
    "RespiratoryRate": 36,
    "Temperature": 39.0,
    "O2Saturation": 82,
    "AVPU": 2
  },
  {
    "triage_code": 703,
    "gender": "Male",
    "age": 30,
    "ChiefComplaint": "Major trauma",
    "BlooddpressurSystol": 95,
    "BlooddpressurDiastol": 60,
    "PulseRate": 45,
    "RespiratoryRate": 6,
    "Temperature": 36.0,
    "O2Saturation": 88,
    "AVPU": 3
  }

  ]);


  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  // Handle input changes
  const handleChange = (index: number, field: keyof Patient, value: any) => {
    const updated = [...patients];
    updated[index][field] = value;
    setPatients(updated);
  };

  // Add a new patient
  const handleAdd = () => {
    setPatients([
      ...patients,
      {
        triage_code: Math.floor(Math.random() * 900 + 100),
        gender: "Male",
        age: 0,
        ChiefComplaint: "",
        BlooddpressurSystol: 0,
        BlooddpressurDiastol: 0,
        PulseRate: 0,
        RespiratoryRate: 0,
        Temperature: 36,
        O2Saturation: 0,
        AVPU: 1,
      },
    ]);
  };

  // Delete patient
  const handleDelete = (index: number) => {
    if (confirm("Delete this patient?")) {
      const updated = [...patients];
      updated.splice(index, 1);
      setPatients(updated);
    }
  };

  // Send data to AI model
  const handlePredict = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/predict?apply_update=false",
        patients
      );
      setResult(response.data);
    } catch (err) {
      console.error(err);
      alert("Error sending data to AI model");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-100 text-gray-900">
      <h1 className="text-2xl font-bold mb-4">Patient Triage Admin</h1>

      <button
        onClick={handleAdd}
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded mb-4"
      >
        Add New Patient
      </button>

      <table className="w-full border-collapse bg-white shadow rounded mb-4">
        <thead>
          <tr className="bg-blue-600 text-white">
            <th className="p-2 border">Code</th>
            <th className="p-2 border">Gender</th>
            <th className="p-2 border">Age</th>
            <th className="p-2 border">Complaint</th>
            <th className="p-2 border">BP S/D</th>
            <th className="p-2 border">Pulse</th>
            <th className="p-2 border">Resp</th>
            <th className="p-2 border">Temp</th>
            <th className="p-2 border">O2</th>
            <th className="p-2 border">AVPU</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((p, i) => (
            <tr key={i} className="text-center border-b hover:bg-gray-50">
              <td className="p-2">
                <input
                  type="number"
                  value={p.triage_code}
                  onChange={(e) => handleChange(i, "triage_code", Number(e.target.value))}
                  className="w-16 p-1 border rounded"
                />
              </td>
              <td className="p-2">
                <select
                  value={p.gender}
                  onChange={(e) => handleChange(i, "gender", e.target.value)}
                  className="p-1 border rounded"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </td>
              <td className="p-2">
                <input
                  type="number"
                  value={p.age}
                  onChange={(e) => handleChange(i, "age", Number(e.target.value))}
                  className="w-16 p-1 border rounded"
                />
              </td>
              <td className="p-2">
                <input
                  type="text"
                  value={p.ChiefComplaint}
                  onChange={(e) => handleChange(i, "ChiefComplaint", e.target.value)}
                  className="w-full p-1 border rounded"
                />
              </td>
              <td className="p-2">
                <input
                  type="number"
                  value={p.BlooddpressurSystol}
                  onChange={(e) =>
                    handleChange(i, "BlooddpressurSystol", Number(e.target.value))
                  }
                  className="w-16 p-1 border rounded"
                />
                /
                <input
                  type="number"
                  value={p.BlooddpressurDiastol}
                  onChange={(e) =>
                    handleChange(i, "BlooddpressurDiastol", Number(e.target.value))
                  }
                  className="w-16 p-1 border rounded"
                />
              </td>
              <td className="p-2">
                <input
                  type="number"
                  value={p.PulseRate}
                  onChange={(e) => handleChange(i, "PulseRate", Number(e.target.value))}
                  className="w-16 p-1 border rounded"
                />
              </td>
              <td className="p-2">
                <input
                  type="number"
                  value={p.RespiratoryRate}
                  onChange={(e) => handleChange(i, "RespiratoryRate", Number(e.target.value))}
                  className="w-16 p-1 border rounded"
                />
              </td>
              <td className="p-2">
                <input
                  type="number"
                  value={p.Temperature}
                  onChange={(e) => handleChange(i, "Temperature", Number(e.target.value))}
                  className="w-16 p-1 border rounded"
                />
              </td>
              <td className="p-2">
                <input
                  type="number"
                  value={p.O2Saturation}
                  onChange={(e) => handleChange(i, "O2Saturation", Number(e.target.value))}
                  className="w-16 p-1 border rounded"
                />
              </td>
              <td className="p-2">
                <input
                  type="number"
                  value={p.AVPU}
                  onChange={(e) => handleChange(i, "AVPU", Number(e.target.value))}
                  className="w-16 p-1 border rounded"
                />
              </td>
              <td className="p-2">
                <button
                  onClick={() => handleDelete(i)}
                  className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        onClick={handlePredict}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded mb-4"
      >
        {loading ? "Predicting..." : "Send to AI Model"}
      </button>

      {result && (
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-bold mb-2">AI Prediction Result</h2>
          <pre className="whitespace-pre-wrap">{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
