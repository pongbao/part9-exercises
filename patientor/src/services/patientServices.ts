import patients from "../../data/patients";
import { NonSensitivePatientEntry, PatientEntry } from "../types";

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

export default {
  getPatients,
  getNonSensitiveEntries,
};
