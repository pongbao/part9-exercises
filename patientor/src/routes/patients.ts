import express from "express";
import patientService from "../services/patientService";
import toNewPatientEntry from "../utils";

const router = express.Router();

router.get("/", (_req, res) => {
  res.send(patientService.getNonSensitiveEntries());
});

router.get("/:id", (req, res) => {
  const patients = patientService.getPatients();
  res.send(patients.find((patient) => patient.id === req.params.id));
});

router.post("/", (req, res) => {
  const newPatientEntry = toNewPatientEntry(req.body);
  const addedEntry = patientService.addPatient(newPatientEntry);
  res.json(addedEntry);
});

export default router;
