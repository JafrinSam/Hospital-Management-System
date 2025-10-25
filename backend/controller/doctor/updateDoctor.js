const User = require("../../models/userModel");
const Doctor = require("../../models/Doctor.js");
exports.updateDoctor = async (req, res) => {
  try {
    const { id } = req.params; // Doctor ID
    const {
      name,
      sex,
      age,
      email,
      phone,
      address,
      specialization,
      experienceYears,
      licenseNumber,
      department,
      availability,
    } = req.body;

    // Step 1: Find Doctor
    const doctor = await Doctor.findById(id);
    if (!doctor) return res.status(404).json({ error: "Doctor not found" });

    // Step 2: Update linked User
    await User.findByIdAndUpdate(
      doctor.userId,
      {
        name,
        sex,
        age,
        email,
        phone,
        address,
      },
      { new: true }
    );

    // Step 3: Update Doctor fields
    const updatedDoctor = await Doctor.findByIdAndUpdate(
      id,
      {
        specialization,
        experienceYears,
        licenseNumber,
        department,
        availability: {
          days: availability?.days || [],
          timeSlots: availability?.timeSlots || [],
        },
      },
      { new: true }
    ).populate("userId");

    console.log("✅ Doctor updated:", updatedDoctor);

    res.json({
      message: "Doctor updated successfully",
      doctor: updatedDoctor,
    });
  } catch (error) {
    console.error("❌ Error updating doctor:", error);
    res.status(500).json({ error: error.message });
  }
};
