import { v1 as uuid } from "uuid";

import patients from "../../data/patients";
import {
  Entry,
  EntryWithoutId,
  NewPatientEntry,
  NonSensitivePatientEntry,
  PatientEntry,
} from "../types";

const getPatients = (): Array<PatientEntry> => {
  return patients;
};

const getNonSensitiveEntries = (): Array<NonSensitivePatientEntry> => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation,
  }));
};

const addPatient = (entry: NewPatientEntry): PatientEntry => {
  const newPatientEntry = {
    id: uuid(),
    entries: [],
    ...entry,
  };

  patients.push(newPatientEntry);
  return newPatientEntry;
};

const addPatientEntry = (newEntry: EntryWithoutId, id: string): Entry => {
  const entryToAdd = {
    id: uuid(),
    ...newEntry,
  };

  const patient = patients.find((patient) => patient.id === id);
  if (patient) {
    patient.entries.push(entryToAdd);
    return entryToAdd;
  }
  throw new Error("Patient not found");
};

export default {
  getPatients,
  getNonSensitiveEntries,
  addPatient,
  addPatientEntry,
};
