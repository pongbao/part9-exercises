import diagnoses from "../../data/diagnoses";
import { DiagnosisEntry } from "../types";

const getDiagnoses = (): Array<DiagnosisEntry> => {
  return diagnoses;
};

export default {
  getDiagnoses,
};
