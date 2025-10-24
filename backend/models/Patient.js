// models/Patient.js
const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  aadharCardNumber: {
    type: String,
    required: true,
    unique: true,
    match: /^[0-9]{12}$/,
  },
  bloodGroup: {
    type: String,
    enum: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-", "Unknown"],
    default: "Unknown",
  },
  occupation: String,
  emergencyContact: {
    name: String,
    relation: String,
    phone: { type: String, match: /^[6-9]\d{9}$/ },
  },
  medicalHistory: [String],
  currentMedications: [String],
  status: {
    type: String,
    enum: ["Active", "Discharged", "Deceased"],
    default: "Active",
  },
  registeredDate: {
    type: Date,
    default: Date.now,
  },
});

const Patient = mongoose.model("Patient", patientSchema);
module.exports=Patient;
