const express = require("express");
const router = express.Router();

const { createDoctor, getAllDoctors, deleteDoctor, getPatientById } = require("../controller/doctor/createDoctor");
const { updateDoctor } = require("../controller/doctor/updateDoctor.js");




router.post("/", createDoctor);
router.get("/", getAllDoctors);
router.get("/:id", getPatientById);
router.put("/:id", updateDoctor);
router.delete("/:id", deleteDoctor);

module.exports = router;