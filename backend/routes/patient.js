import express from "express";
import {
updatePatient
} from "../controller/patient/updatePatient.js";
import {
createPatient,
  getAllPatients,
  getPatientById,
  deletePatient
} from "../controller/patient/createPatient.js";

const router = express.Router();

router.post("/", createPatient);
router.get("/", getAllPatients);
router.get("/:id", getPatientById);
router.put("/:id", updatePatient);
router.delete("/:id", deletePatient);

export default router;
