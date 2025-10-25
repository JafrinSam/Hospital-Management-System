import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDoctor } from "../../context/DoctorContext";
import {
  ArrowLeft,
  Mail,
  Phone,
  Clock,
  Calendar,
  Star,
  Briefcase,
  Stethoscope,
  Edit,
  Trash2,
  AlertCircle,
  FileText,
} from "lucide-react";

export default function DoctorDetails() {
  const { id } = useParams<{ id: string }>();
  const { doctors, deleteDoctor } = useDoctor();
  const navigate = useNavigate();

  const doctor = doctors.find((doc) => doc._id === id);
  console.log("Doctor Details - Fetched doctor:", doctor);

  const calculateWorkingHours = (timeSlots?: string[]) => {
    if (!timeSlots || timeSlots.length === 0) return "N/A";
    return timeSlots.join(", ");
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${doctor?.userId?.name}?`)) {
      deleteDoctor(doctor!._id);
      navigate("/doctors");
    }
  };

  const handleEdit = () => {
    navigate(`/doctors/edit/${doctor!._id}`);
  };

  if (!doctor) {
    return (
      <div className="min-h-screen bg-[#050a30] flex items-center justify-center p-4">
        <div className="bg-cyan/20 rounded-2xl shadow-xl p-8 text-center max-w-md w-full text-white">
          <div className="w-16 h-16 bg-[#7ec8e3]/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="text-[#7ec8e3]" size={32} />
          </div>
          <h2 className="text-2xl font-bold mb-2">Doctor Not Found</h2>
          <p className="text-[#7ec8e3] mb-6">
            The doctor you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-[#7ec8e3] text-[#050a30] rounded-lg hover:bg-[#0000ff] hover:text-white transition-colors duration-200 font-medium flex items-center justify-center gap-2 w-full"
          >
            <ArrowLeft size={20} />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 text-gray-600">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-[#7ec8e3] hover:text-[#0000ff] transition-colors duration-200 font-medium"
          >
            <ArrowLeft size={20} />
            Back to Doctors
          </button>
          <div className="flex gap-3">
            <button
              onClick={handleEdit}
              className="px-4 py-2 bg-cyan/50 text-white rounded-lg hover:bg-[#000c66] transition-colors duration-200 font-medium flex items-center gap-2"
            >
              <Edit size={16} />
              Edit Doctor
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium flex items-center gap-2"
            >
              <Trash2 size={16} />
              Delete
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Profile */}
          <div className="lg:col-span-2">
            <div className="bg-cyan rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-cyan p-6 text-white">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-[#7ec8e3]/20 rounded-full flex items-center justify-center">
                    <Stethoscope size={32} />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold">
                      {doctor.userId?.name || "Unknown Doctor"}
                    </h1>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="px-3 py-1 rounded-full text-sm font-medium border bg-cyan/20 text-white border-[#7ec8e3]">
                        {doctor.department || "General"}
                      </span>
                      <span className="px-3 py-1 rounded-full text-sm font-medium border bg-cyan/20 text-white border-[#7ec8e3]">
                        {doctor.specialization || "Specialist"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="p-6 bg-cyan/50 text-[#7ec8e3] border-t border-[#7ec8e3]/30">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-white">
                  <Mail size={20} className="text-[#7ec8e3]" />
                  Contact Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-white/10 rounded-lg">
                    <Mail className="text-[#7ec8e3]" size={20} />
                    <div>
                      <p className="text-sm text-[#7ec8e3]/80">Email</p>
                      <p className="font-medium text-white">
                        {doctor.userId?.email || "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-white/10 rounded-lg">
                    <Phone className="text-[#7ec8e3]" size={20} />
                    <div>
                      <p className="text-sm text-[#7ec8e3]/80">Phone</p>
                      <p className="font-medium text-white">
                        {doctor.userId?.phone || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Availability */}
              <div className="p-6 border-t border-[#7ec8e3]/30 bg-cyan">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <Calendar size={20} className="text-[#7ec8e3]" />
                  Availability
                </h3>

                {doctor.availability &&
                (doctor.availability.days.length > 0 ||
                  doctor.availability.timeSlots.length > 0) ? (
                  <>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {doctor.availability.days.map((day, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-[#7ec8e3]/20 text-white rounded-full text-sm"
                        >
                          {day}
                        </span>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {doctor.availability.timeSlots.map((slot, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 p-3 bg-white/10 rounded-lg"
                        >
                          <Clock className="text-[#7ec8e3]" size={20} />
                          <div>
                            <p className="text-sm text-[#7ec8e3]/80">Slot</p>
                            <p className="font-medium text-white font-mono">
                              {slot}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <p className="text-[#7ec8e3]/80">No availability data found.</p>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-[#000c66]/60 rounded-2xl p-6 text-[#7ec8e3] shadow-lg">
              <h3 className="text-xl font-semibold mb-4 text-white flex items-center gap-2">
                <Briefcase size={20} className="text-[#7ec8e3]" />
                License Information
              </h3>
              <div className="p-3 bg-[#050a30]/30 rounded-lg">
                <p className="text-sm text-[#7ec8e3]/80">License Number</p>
                <p className="font-medium text-white">
                  {doctor.licenseNumber || "N/A"}
                </p>
              </div>
            </div>

            <div className="bg-[#000c66]/60 rounded-2xl shadow-lg p-6 text-white">
              <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full px-4 py-3 bg-[#0000ff]/70 text-white rounded-lg hover:bg-[#7ec8e3] hover:text-[#050a30] transition-colors duration-200 font-medium flex items-center justify-center gap-2">
                  <Calendar size={16} />
                  View Schedule
                </button>
                <button className="w-full px-4 py-3 bg-[#7ec8e3] text-[#050a30] rounded-lg hover:bg-[#0000ff] hover:text-white transition-colors duration-200 font-medium flex items-center justify-center gap-2">
                  <FileText size={16} />
                  Generate Report
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
