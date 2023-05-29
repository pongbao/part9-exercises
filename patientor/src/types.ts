export interface DiagnosisEntry {
  code: string;
  name: string;
  latin?: string;
}

export enum Gender {
  Male = "male",
  Female = "female",
  Other = "other",
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Entry {}

export interface PatientEntry {
  id: string;
  name: string;
  ssn: string;
  dateOfBirth: string;
  gender: string;
  occupation: string;
  entries: Array<Entry>;
}

export type NonSensitivePatientEntry = Omit<PatientEntry, "ssn" | "entries">;

export type NewPatientEntry = Omit<PatientEntry, "id" | "entries">;
