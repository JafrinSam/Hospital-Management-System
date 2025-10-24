import User from "../models/User.js";
import Doctor from "../models/Doctor.js";

export const updateDoctor = async (req, res) => {
  try {
    const { id } = req.params; // Doctor ID
    const { userData, doctorData } = req.body;

    const doctor = await Doctor.findById(id);
    if (!doctor) return res.status(404).json({ error: "Doctor not found" });

    // Update doctor fields
    if (doctorData) Object.assign(doctor, doctorData);
    await doctor.save();

    // Update user fields
    if (userData) {
      const user = await User.findById(doctor.user);
      Object.assign(user, userData);
      await user.save();
    }

    const updatedDoctor = await Doctor.findById(id).populate("user");
    res.json({ message: "Doctor updated successfully", updatedDoctor });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
