import Staff from "../models/Staff.js";
import User from "../models/User.js";

export const createStaff = async (req, res) => {
  try {
    const { name, age, gender, email, phone, address, position, department, salary } = req.body;

    const user = await User.create({ name, age, gender, role: "Staff", email, phone, address });

    const staff = await Staff.create({
      user: user._id,
      position,
      department,
      salary,
    });

    res.status(201).json({ message: "Staff created successfully", staff });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllStaff = async (req, res) => {
  try {
    const staff = await Staff.find().populate("user");
    res.json(staff);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateStaff = async (req, res) => {
  try {
    const { id } = req.params;
    const staff = await Staff.findByIdAndUpdate(id, req.body, { new: true });
    res.json(staff);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteStaff = async (req, res) => {
  try {
    const { id } = req.params;
    await Staff.findByIdAndDelete(id);
    res.json({ message: "Staff deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
