const Patient= require("../../models/Patient");
const User= require("../../models/userModel");

exports.updatePatient = async (req, res) => {
  try {
    const { id } = req.params; // Patient ID
    const { userData, patientData } = req.body;

    const patient = await Patient.findById(id);
    if (!patient) return res.status(404).json({ error: "Patient not found" });

    // Update patient fields
    if (patientData) Object.assign(patient, patientData);
    await patient.save();

    // Update user fields
    if (userData) {
      const user = await User.findById(patient.user);
      Object.assign(user, userData);
      await user.save();
    }

    const updatedPatient = await Patient.findById(id).populate("user");
    res.json({ message: "Patient updated successfully", updatedPatient });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
