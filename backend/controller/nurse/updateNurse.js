import User from "../models/User.js";
import Nurse from "../models/Nurse.js";

export const updateNurse = async (req, res) => {
  try {
    const { id } = req.params; // Nurse ID
    const { userData, nurseData } = req.body;

    const nurse = await Nurse.findById(id);
    if (!nurse) return res.status(404).json({ error: "Nurse not found" });

    // Update nurse fields
    if (nurseData) Object.assign(nurse, nurseData);
    await nurse.save();

    // Update user fields
    if (userData) {
      const user = await User.findById(nurse.user);
      Object.assign(user, userData);
      await user.save();
    }

    const updatedNurse = await Nurse.findById(id).populate("user");
    res.json({ message: "Nurse updated successfully", updatedNurse });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
