import React from "react";
import { Doctor } from "../../context/DoctorContext";
import { 
  Mail, 
  Phone, 
  GraduationCap, 
  Clock, 
  Calendar,
  Star,
  Briefcase,
  DollarSign,
  X,
  Stethoscope,
  AlertCircle,
  FileText
} from "lucide-react";

interface Props {
  doctor: Doctor;
  onClose: () => void;
  onEdit?: (doctor: Doctor) => void;
  onDelete?: (doctorId: string) => void;
}

export const DoctorViewModal = ({ doctor, onClose, onEdit, onDelete }: Props) => {
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'bg-green-500';
      case 'on leave': return 'bg-yellow-500';
      case 'inactive': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const calculateWorkingHours = (inTime: string, outTime: string) => {
    const [inHours, inMinutes] = inTime.split(':').map(Number);
    const [outHours, outMinutes] = outTime.split(':').map(Number);
    
    let hours = outHours - inHours;
    let minutes = outMinutes - inMinutes;
    
    if (minutes < 0) {
      hours--;
      minutes += 60;
    }
    
    return `${hours}h ${minutes}m`;
  };

  const getDepartmentColor = (department: string) => {
    const colors = {
      'cardiology': 'bg-red-100 text-red-800',
      'neurology': 'bg-blue-100 text-blue-800',
      'orthopedics': 'bg-green-100 text-green-800',
      'pediatrics': 'bg-yellow-100 text-yellow-800',
      'surgery': 'bg-purple-100 text-purple-800',
      'radiology': 'bg-indigo-100 text-indigo-800',
      'emergency': 'bg-orange-100 text-orange-800',
    };
    return colors[department as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div 
        className="bg-gradient-to-br  to-[#1e3a8a] rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative p-6 border-b border-blue-700/50">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white">
                <Stethoscope size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{doctor.name}</h2>
                <div className="flex items-center space-x-2 mt-1">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDepartmentColor(doctor.department)}`}>
                    {doctor.department}
                  </span>
                  {doctor.status && (
                    <span className={`px-3 py-1 rounded-full text-sm font-medium text-white ${getStatusColor(doctor.status)}`}>
                      {doctor.status}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors duration-200 bg-blue-900/30 hover:bg-blue-900/50 w-8 h-8 rounded-full flex items-center justify-center"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-blue-300 border-b border-blue-700/30 pb-2 flex items-center gap-2">
                <Mail size={18} />
                Contact Information
              </h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-600/20 rounded-lg flex items-center justify-center">
                    <Mail size={16} className="text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Email</p>
                    <p className="text-white">{doctor.email}</p>
                  </div>
                </div>
                
                {doctor.phone && (
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-600/20 rounded-lg flex items-center justify-center">
                      <Phone size={16} className="text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Phone</p>
                      <p className="text-white">{doctor.phone}</p>
                    </div>
                  </div>
                )}
                
                {doctor.qualification && (
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-600/20 rounded-lg flex items-center justify-center">
                      <GraduationCap size={16} className="text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Qualification</p>
                      <p className="text-white">{doctor.qualification}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Schedule Information */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-blue-300 border-b border-blue-700/30 pb-2 flex items-center gap-2">
                <Calendar size={18} />
                Schedule
              </h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-600/20 rounded-lg flex items-center justify-center">
                    <Clock size={16} className="text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">In Time</p>
                    <p className="text-white font-mono">{doctor.inTime}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-red-600/20 rounded-lg flex items-center justify-center">
                    <Clock size={16} className="text-red-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Out Time</p>
                    <p className="text-white font-mono">{doctor.outTime}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-600/20 rounded-lg flex items-center justify-center">
                    <Clock size={16} className="text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Working Hours</p>
                    <p className="text-white font-mono">
                      {calculateWorkingHours(doctor.inTime, doctor.outTime)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="bg-blue-900/20 rounded-xl p-4 border border-blue-700/30">
            <h3 className="text-lg font-semibold text-blue-300 mb-4 flex items-center gap-2">
              <Briefcase size={18} />
              Performance Metrics
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-white flex items-center justify-center gap-1">
                  <Stethoscope size={20} />
                  {doctor.patientsVisited || 0}
                </div>
                <div className="text-sm text-gray-400 mt-1">Patients Today</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white flex items-center justify-center gap-1">
                  <Star size={20} className="text-yellow-400" />
                  {doctor.rating ? `${doctor.rating}/5` : 'N/A'}
                </div>
                <div className="text-sm text-gray-400 mt-1">Rating</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white flex items-center justify-center gap-1">
                  <Briefcase size={20} />
                  {doctor.experience ? `${doctor.experience}y` : 'N/A'}
                </div>
                <div className="text-sm text-gray-400 mt-1">Experience</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white flex items-center justify-center gap-1">
                  <DollarSign size={20} />
                  {doctor.salary ? doctor.salary.toLocaleString() : 'N/A'}
                </div>
                <div className="text-sm text-gray-400 mt-1">Salary</div>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          {(doctor.specialization || doctor.notes) && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-blue-300 border-b border-blue-700/30 pb-2 flex items-center gap-2">
                <FileText size={18} />
                Additional Information
              </h3>
              <div className="space-y-2">
                {doctor.specialization && (
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-600/20 rounded-lg flex items-center justify-center">
                      <AlertCircle size={16} className="text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Specialization</p>
                      <p className="text-white">{doctor.specialization}</p>
                    </div>
                  </div>
                )}
                {doctor.notes && (
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-600/20 rounded-lg flex items-center justify-center mt-1">
                      <FileText size={16} className="text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-400 mb-1">Notes</p>
                      <p className="text-white text-sm bg-blue-900/30 rounded-lg p-3">
                        {doctor.notes}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end space-x-3 p-6 border-t border-blue-700/50 bg-blue-900/20 rounded-b-2xl">
          {onDelete && (
            <button
              onClick={() => onDelete(doctor.id)}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 font-medium flex items-center gap-2"
            >
              <X size={16} />
              Delete
            </button>
          )}
          {onEdit && (
            <button
              onClick={() => onEdit(doctor)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 font-medium flex items-center gap-2"
            >
              <FileText size={16} />
              Edit Doctor
            </button>
          )}
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200 font-medium flex items-center gap-2"
          >
            <X size={16} />
            Close
          </button>
        </div>
      </div>
    </div>
  );
};