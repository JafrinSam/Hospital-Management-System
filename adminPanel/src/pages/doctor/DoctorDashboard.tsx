import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Edit, Trash2, Eye, Calendar } from "lucide-react";
import { DoctorFormModal } from "../../components/doctor/DoctorFormModal";
import { DoctorViewModal } from "../../components/doctor/DoctorViewModal";
import { useDoctor } from "../../context/DoctorContext";



const apiUrl = import.meta.env.VITE_BACKEND_URL;
export default function DoctorDashboard() {
  const {fetchDoctors } = useDoctor()
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
  console.log("Viewing doctor with ID:", id);
  navigate(`${id}`);
};


const handleSubmit = async (doc: any) => {
  try {
    console.log("Submitting doctor data:", doc);
    // API call to backend
    if (editing) {
      await fetch(`${apiUrl}/api/doctors/${doc.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(doc),
      });
       await fetchDoctors();
    } else {
      await fetch(`${apiUrl}/api/doctors`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(doc),
      });
      await fetchDoctors();
    }
    setShowForm(false);
    // Refresh doctor list
  } catch (err) {
    console.error(err);
    alert("Failed to save doctor");
  }
};
 console.log("Rendering DoctorDashboard with doctors:", doctors);

  return (
    <div className="p-6 text-white min-h-screen  space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-gray-600">Doctor Admin Panel</h1>
        <button
          onClick={handleCreate}
          className="bg-cyan hover:bg-cyan-600 px-4 py-2 rounded"
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
              <th>Time slot </th>
              <th>day availability</th>
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
                  <td className="py-2">{doc.userId.name}</td>
                  <td>{doc.userId.email}</td>
                  <td>{doc.department}</td>
                  <td className="py-2">
                    {doc.availability?.timeSlots?.length ? (
                      <div className="flex flex-wrap gap-1">
                        {doc.availability.timeSlots.map((slot, i) => (
                          <span
                            key={i}
                            className="bg-green-900 text-white px-2 py-0.5 rounded-full text-xs"
                          >
                            {slot}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-400 text-sm">N/A</span>
                    )}
                  </td>

                  <td className="py-2">
                  {doc.availability?.days?.length ? (
                    <div className="flex flex-wrap gap-1">
                      {doc.availability.days.map((day, i) => (
                        <span
                          key={i}
                          className="bg-blue-900 text-white px-2 py-0.5 rounded-full text-xs"
                        >
                          {day}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-gray-400 text-sm">N/A</span>
                  )}
                </td>

                  <td className="space-x-2 py-2">
                    <button
                      onClick={() => handleView(doc._id)}
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
