// models/Staff.js
import mongoose from "mongoose";

const staffSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  position: {
    type: String, // e.g., "Receptionist", "Cleaner", "Accountant"
    required: true,
  },
  department: String,
  shift: {
    type: String,
    enum: ["Morning", "Evening", "Night"],
  },
  salary: Number,
  dateOfJoining: {
    type: Date,
    default: Date.now,
  },
});

const Staff = mongoose.model("Staff", staffSchema);
export default Staff;
