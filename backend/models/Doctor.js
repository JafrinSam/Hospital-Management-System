// models/Doctor.js
const mongoose = require("mongoose");


const doctorSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  specialization: {
    type: String,
    required: true,
  },
  qualifications: [String],
  experienceYears: Number,
  department: String,
  licenseNumber: {
    type: String,
    required: true,
    unique: true,
  },
  availability: {
    days: [String], // e.g. ["Mon", "Wed", "Fri"]
    timeSlots: [String], // e.g. ["10:00-13:00", "16:00-18:00"]
  },
});

const Doctor = mongoose.model("Doctor", doctorSchema);
export default Doctor;
