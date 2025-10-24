const express = reqire("express");
const {
updatePatient
} = require ("../controller/patient/updatePatient.js");
const {
createPatient,
  getAllPatients,
  getPatientById,
  deletePatient
} =  require("../controller/patient/createPatient.js");

const router = express.Router();

router.post("/", createPatient);
router.get("/", getAllPatients);
router.get("/:id", getPatientById);
router.put("/:id", updatePatient);
router.delete("/:id", deletePatient);

export default router;
