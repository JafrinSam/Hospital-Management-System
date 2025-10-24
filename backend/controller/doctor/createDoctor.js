import Doctor from "../models/Doctor.js";
import User from "../models/User.js";

export const createDoctor = async (req, res) => {
  try {
    const { name, age, gender, email, phone, address, specialization, experience, licenseNumber, department } = req.body;

    const user = await User.create({ name, age, gender, role: "Doctor", email, phone, address });

    const doctor = await Doctor.create({
      user: user._id,
      specialization,
      experience,
      licenseNumber,
      department,
    });

    res.status(201).json({ message: "Doctor created successfully", doctor });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find().populate("user");
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const doctor = await Doctor.findByIdAndUpdate(id, req.body, { new: true });
    res.json(doctor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    await Doctor.findByIdAndDelete(id);
    res.json({ message: "Doctor deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
