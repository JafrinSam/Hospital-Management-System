const User = require("../../models/userModel");
const Doctor = require("../../models/Doctor");

/**
 * ✅ Create Doctor (with linked User)
 */
exports.createDoctor = async (req, res) => {
  try {
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
      availability, // days, timeSlots
    } = req.body;

    // Step 1: Create User
    const user = await User.create({
      name,
      sex,
      age,
      email,
      phone,
      address,
      role: "Doctor",
    });

    // Step 2: Create Doctor linked to User
    const doctor = await Doctor.create({
      userId: user._id,
      specialization,
      experienceYears,
      licenseNumber,
      department,
      availability: {
        days: availability?.days || [],
        timeSlots: availability?.timeSlots || [],
      },
    });
    console.log("✅ Doctor created:", doctor);
    res.status(201).json({
      message: "Doctor created successfully",
      doctor,
    });
  } catch (error) {
    console.error("❌ Error creating doctor:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * ✅ Get All Doctors (with User details populated)
 */
exports.getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find().populate("userId");
    res.json(doctors);
  } catch (error) {
    console.error("❌ Error fetching doctors:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * ✅ Update Doctor + User (atomic update)
 */
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


exports.deleteDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    await Doctor.findByIdAndDelete(id);
    res.json({ message: "Doctor deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPatientById = async (req, res) => {
  try {
    const { id } = req.params; // Patient ID
    const patient = await Doctor.findById(id).populate("user");
    if (!patient) return res.status(404).json({ error: "doctor not found" });
    res.json(patient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
