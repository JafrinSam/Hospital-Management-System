import Nurse from "../models/Nurse.js";
import User from "../models/User.js";

export const createNurse = async (req, res) => {
  try {
    const { name, age, gender, email, phone, address, department, shift, experience } = req.body;

    const user = await User.create({ name, age, gender, role: "Nurse", email, phone, address });

    const nurse = await Nurse.create({
      user: user._id,
      department,
      shift,
      experience,
    });

    res.status(201).json({ message: "Nurse created successfully", nurse });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllNurses = async (req, res) => {
  try {
    const nurses = await Nurse.find().populate("user");
    res.json(nurses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateNurse = async (req, res) => {
  try {
    const { id } = req.params;
    const nurse = await Nurse.findByIdAndUpdate(id, req.body, { new: true });
    res.json(nurse);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteNurse = async (req, res) => {
  try {
    const { id } = req.params;
    await Nurse.findByIdAndDelete(id);
    res.json({ message: "Nurse deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
