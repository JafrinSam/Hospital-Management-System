// models/User.js
const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    lowercase: true,
    unique: true,
    sparse: true,
  },
  phone: {
    type: String,
    match: /^[6-9]\d{9}$/,
    required: true,
  },
  role: {
    type: String,
    enum: ["Patient", "Doctor", "Nurse", "Staff", "Admin"],
    required: true,
  },
  sex: {
    type: String,
    enum: ["Male", "Female", "Other"],
  },
  age: {
    type: Number,
    min: 0,
  },
  address: {
    street: String,
    city: String,
    state: String,
    pincode: { type: String, match: /^[1-9][0-9]{5}$/ },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("User", userSchema);
export default User;
