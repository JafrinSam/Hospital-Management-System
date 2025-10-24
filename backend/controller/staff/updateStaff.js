import User from "../models/User.js";
import Staff from "../models/Staff.js";

export const updateStaff = async (req, res) => {
  try {
    const { id } = req.params; // Staff ID
    const { userData, staffData } = req.body;

    const staff = await Staff.findById(id);
    if (!staff) return res.status(404).json({ error: "Staff not found" });

    // Update staff fields
    if (staffData) Object.assign(staff, staffData);
    await staff.save();

    // Update user fields
    if (userData) {
      const user = await User.findById(staff.user);
      Object.assign(user, userData);
      await user.save();
    }

    const updatedStaff = await Staff.findById(id).populate("user");
    res.json({ message: "Staff updated successfully", updatedStaff });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
