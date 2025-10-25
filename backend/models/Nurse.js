// models/Nurse.js
const mongoose = require("mongoose");

const nurseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  department: String,
  shift: {
    type: String,
    enum: ["Morning", "Evening", "Night"],
  },
  experienceYears: Number,
  qualification: String,
  assignedWard: String,
});

const Nurse = mongoose.model("Nurse", nurseSchema);
export default Nurse;
