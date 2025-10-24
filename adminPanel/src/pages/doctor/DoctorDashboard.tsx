import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Edit, Trash2, Eye, Calendar } from "lucide-react";
import { DoctorFormModal } from "../../components/doctor/DoctorFormModal";
import { DoctorViewModal } from "../../components/doctor/DoctorViewModal";
import { useDoctor } from "../../context/DoctorContext";

export default function DoctorDashboard() {
  const navigate = useNavigate();

  const { doctors, addDoctor, updateDoctor, deleteDoctor } = useDoctor();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [viewing, setViewing] = useState<any>(null);

  const handleCreate = () => {
    setEditing(null);
    setShowForm(true);
  };

  const handleEdit = (doc: any) => {
    setEditing(doc);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this doctor?")) {
      deleteDoctor(id);
    }
  };

const handleView = (id: string) => {
  // (optional) Do any logic before navigation
  navigate(`/doctor/${id}`);
};
  const handleSubmit = (doc: any) => {
    if (editing) updateDoctor(doc);
    else addDoctor({ ...doc, id: Math.random().toString(36).substring(2, 9) });
    setShowForm(false);
  };

  return (
    <div className="p-6 text-white min-h-screen  space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-gray-600">Doctor Admin Panel</h1>
        <button
          onClick={handleCreate}
          className="bg-cyan-500 hover:bg-cyan-600 px-4 py-2 rounded"
        >
          Add Doctor
        </button>
      </div>

      {/* Doctor Table */}
      <div className="bg-cyan/90 p-3 rounded-lg overflow-x-auto">
        <table className="w-full text-left text-white">
          <thead className="text-sm border-b border-gray-700">
            <tr>
              <th className="py-2">Name</th>
              <th>Email</th>
              <th>Department</th>
              <th>In Time</th>
              <th>Out Time</th>
              <th>Patients Visited</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {doctors.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-6">
                  No doctors available
                </td>
              </tr>
            ) : (
              doctors.map((doc) => (
                <tr key={doc.id} className="border-b border-gray-700">
                  <td className="py-2">{doc.name}</td>
                  <td>{doc.email}</td>
                  <td>{doc.department}</td>
                  <td>{doc.inTime}</td>
                  <td>{doc.outTime}</td>
                  <td>{doc.patientsVisited}</td>
                  <td className="space-x-2 py-2">
                    <button
                      onClick={() => handleView(doc.id)}
                      className="text-cyan-400 hover:text-cyan-200"
                    >
                      <Eye className="w-4 h-4 inline" />
                    </button>
                    <button
                      onClick={() => handleEdit(doc)}
                      className="text-blue-400 hover:text-blue-200"
                    >
                      <Edit className="w-4 h-4 inline" />
                    </button>
                    <button
                      onClick={() => handleDelete(doc.id)}
                      className="text-red-400 hover:text-red-200"
                    >
                      <Trash2 className="w-4 h-4 inline" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      {showForm && (
        <DoctorFormModal
          doctor={editing}
          onClose={() => setShowForm(false)}
          onSubmit={handleSubmit}
        />
      )}
      {viewing && (
        <DoctorViewModal doctor={viewing} onClose={() => setViewing(null)} />
      )}
    </div>
  );
}
