import React, { useState } from "react";

type Props = {
  doctor?: any | null;
  onClose: () => void;
  onSubmit: (doctorData: any) => void;
};

export const DoctorFormModal = ({ doctor, onClose, onSubmit }: Props) => {
  const [form, setForm] = useState({
    id: doctor?._id || "",
    // --- USER FIELDS ---
    name: doctor?.userId?.name ?? "",
    age: doctor?.userId?.age ?? "",
    gender: doctor?.userId?.gender ?? "",
    email: doctor?.userId?.email ?? "",
    phone: doctor?.userId?.phone ?? "",
    address: doctor?.userId?.address ?? "",

    // --- DOCTOR FIELDS ---
    specialization: doctor?.specialization ?? "",
    experience: doctor?.experience ?? "",
    licenseNumber: doctor?.licenseNumber ?? "",
    department: doctor?.department ?? "",

    // --- AVAILABILITY ---
    availability: {
      days: doctor?.availability?.days ?? [],
      timeSlots: doctor?.availability?.timeSlots ?? [],
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAvailabilityChange = (field: "days" | "timeSlots", value: string) => {
    setForm({
      ...form,
      availability: {
        ...form.availability,
        [field]: value.split(",").map((item) => item.trim()),
      },
    });
  };

  const handleSubmit = () => {
    onSubmit(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-[#050a30] p-6 rounded-lg w-96 text-white space-y-4 shadow-lg">
        <h2 className="text-xl font-bold text-center mb-2">
          {doctor ? "Edit Doctor" : "Add Doctor"}
        </h2>

        {/* ===== USER DETAILS ===== */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter doctor's name"
            className="w-full p-2 rounded text-black"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Age</label>
          <input
            type="number"
            name="age"
            value={form.age}
            onChange={handleChange}
            placeholder="Enter age"
            className="w-full p-2 rounded text-black"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Gender</label>
          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            className="w-full p-2 rounded text-black"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Email</label>
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Enter email"
            className="w-full p-2 rounded text-black"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Phone</label>
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Enter phone number"
            className="w-full p-2 rounded text-black"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Address</label>
          <input
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Enter address"
            className="w-full p-2 rounded text-black"
          />
        </div>

        {/* ===== DOCTOR DETAILS ===== */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">Specialization</label>
          <input
            name="specialization"
            value={form.specialization}
            onChange={handleChange}
            placeholder="Enter specialization"
            className="w-full p-2 rounded text-black"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Experience (years)</label>
          <input
            type="number"
            name="experience"
            value={form.experience}
            onChange={handleChange}
            placeholder="Enter experience"
            className="w-full p-2 rounded text-black"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">License Number</label>
          <input
            name="licenseNumber"
            value={form.licenseNumber}
            onChange={handleChange}
            placeholder="Enter license number"
            className="w-full p-2 rounded text-black"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Department</label>
          <input
            name="department"
            value={form.department}
            onChange={handleChange}
            placeholder="Enter department"
            className="w-full p-2 rounded text-black"
          />
        </div>

        {/* ===== AVAILABILITY ===== */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">Available Days</label>
          <input
            name="days"
            value={form.availability.days.join(",")}
            onChange={(e) => handleAvailabilityChange("days", e.target.value)}
            placeholder="e.g., Mon,Tue,Wed"
            className="w-full p-2 rounded text-black"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Available Time Slots</label>
          <input
            name="timeSlots"
            value={form.availability.timeSlots.join(",")}
            onChange={(e) => handleAvailabilityChange("timeSlots", e.target.value)}
            placeholder="e.g., 09:00-12:00, 14:00-17:00"
            className="w-full p-2 rounded text-black"
          />
        </div>

        {/* ===== BUTTONS ===== */}
        <div className="flex justify-end space-x-2 pt-2">
          <button
            onClick={handleSubmit}
            className="bg-cyan text-black px-4 py-2 rounded font-semibold hover:bg-cyan-600"
          >
            Save
          </button>
          <button
            onClick={onClose}
            className="bg-gray-600 px-4 py-2 rounded font-semibold hover:bg-gray-500"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
