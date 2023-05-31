import express from "express";
import patientService from "../services/patientService";
import toNewPatientEntry, { toNewEntry } from "../utils";

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

router.post("/:id/entries", (req, res) => {
  const newEntry = toNewEntry(req.body);
  const addedEntry = patientService.addPatientEntry(newEntry, req.params.id);
  res.json(addedEntry);
});

export default router;
