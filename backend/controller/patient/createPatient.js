import Patient from "../models/Patient.js";
import User from "../models/User.js";

export const createPatient = async (req, res) => {
  try {
    const { name, age, gender, email, phone, address, aadharCardNumber, bloodGroup } = req.body;

    const user = await User.create({ name, age, gender, role: "Patient", email, phone, address });

    const patient = await Patient.create({
      user: user._id,
      aadharCardNumber,
      bloodGroup,
    });

    res.status(201).json({ message: "Patient created successfully", patient });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.find().populate("user");
    res.json(patients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updatePatient = async (req, res) => {
  try {
    const { id } = req.params;
    const patient = await Patient.findByIdAndUpdate(id, req.body, { new: true });
    res.json(patient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deletePatient = async (req, res) => {
  try {
    const { id } = req.params;
    await Patient.findByIdAndDelete(id);
    res.json({ message: "Patient deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const getPatientById = async (req, res) => {
  try {
    const { id } = req.params; // Patient ID
    const patient = await Patient.findById(id).populate("user");
    if (!patient) return res.status(404).json({ error: "Patient not found" });
    res.json(patient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
