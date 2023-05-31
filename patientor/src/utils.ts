import {
  BaseEntryWithoutId,
  DiagnosisEntry,
  Discharge,
  EntryWithoutId,
  HealthCheckRating,
  NewPatientEntry,
  SickLeave,
} from "./types";
import { Gender } from "./types";

const isString = (text: unknown): text is string => {
  return typeof text === "string" || text instanceof String;
};

const parseName = (name: unknown): string => {
  if (!name || !isString(name)) {
    throw new Error("Incorrect or missing name");
  }

  return name;
};

const parseSSN = (ssn: unknown): string => {
  if (!ssn || !isString(ssn)) {
    throw new Error("Incorrect or missing ssn");
  }

  return ssn;
};

const parseOccupation = (occupation: unknown): string => {
  if (!occupation || !isString(occupation)) {
    throw new Error("Incorrect or missing occupation");
  }

  return occupation;
};

const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};

const parseDate = (date: unknown): string => {
  if (!date || !isString(date) || !isDate(date)) {
    throw new Error("Incorrect or missing date: " + date);
  }
  return date;
};

const isGender = (param: string): param is Gender => {
  return Object.values(Gender)
    .map((v) => v.toString())
    .includes(param);
};

const parseGender = (gender: unknown): Gender => {
  if (!isString(gender) || !isGender(gender)) {
    throw new Error("Incorrect or missing gender: " + gender);
  }
  return gender;
};

const toNewPatientEntry = (object: unknown): NewPatientEntry => {
  if (!object || typeof object !== "object") {
    throw new Error("Incorrect or missing data");
  }

  if (
    "name" in object &&
    "ssn" in object &&
    "dateOfBirth" in object &&
    "gender" in object &&
    "occupation" in object
  ) {
    const newEntry: NewPatientEntry = {
      name: parseName(object.name),
      ssn: parseSSN(object.ssn),
      dateOfBirth: parseDate(object.dateOfBirth),
      gender: parseGender(object.gender),
      occupation: parseOccupation(object.occupation),
    };

    return newEntry;
  }

  throw new Error("Incorrect data: some fields are missing");
};

const parseSpecialist = (specialist: unknown): string => {
  if (!specialist || !isString(specialist)) {
    throw new Error("Incorrect or missing specialist");
  }

  return specialist;
};

const parseDescription = (description: unknown): string => {
  if (!description || !isString(description)) {
    throw new Error("Incorrect or missing description");
  }

  return description;
};

const parseDiagnosisCodes = (
  diagnosisCodes: unknown
): Array<DiagnosisEntry["code"]> => {
  if (!Array.isArray(diagnosisCodes)) {
    throw new Error("Incorrect or missing diangosis codes");
  }
  const parsedCodes: Array<DiagnosisEntry["code"]> = [];
  diagnosisCodes.map((code: string) => {
    if (!isString(code)) {
      throw new Error("Incorrect code");
    }
    parsedCodes.push(code);
  });

  return parsedCodes;
};

const parseEmployerName = (employerName: unknown): string => {
  if (!employerName || !isString(employerName)) {
    throw new Error("Incorrect or missing employer name");
  }

  return employerName;
};

const parseCriteria = (criteria: unknown): string => {
  if (!criteria || !isString(criteria)) {
    throw new Error("Incorrect or missing discharge criteria");
  }

  return criteria;
};

const isHealthCheckRating = (param: number): param is HealthCheckRating => {
  return Object.values(HealthCheckRating)
    .map((v) => v)
    .includes(param);
};

const parseHealthCheckRating = (
  healthCheckRating: unknown
): HealthCheckRating => {
  if (
    !(typeof healthCheckRating === "number") ||
    !isHealthCheckRating(healthCheckRating)
  ) {
    throw new Error(
      "Incorrect or missing health check rating: " + healthCheckRating
    );
  }
  return healthCheckRating;
};

const parseSickLeave = (sickLeave: unknown): SickLeave => {
  if (
    !sickLeave ||
    typeof sickLeave !== "object" ||
    Object.keys(sickLeave).length !== 2
  ) {
    throw new Error("Incorrect or missing sick leave data");
  }
  const parsedSickLeave = {
    startDate: parseDate((sickLeave as SickLeave).startDate),
    endDate: parseDate((sickLeave as SickLeave).endDate),
  };
  return parsedSickLeave;
};

const parseDischarge = (discharge: unknown): Discharge => {
  if (
    !discharge ||
    typeof discharge !== "object" ||
    Object.keys(discharge).length !== 2
  ) {
    throw new Error("Incorrect or missing discharge data");
  }
  const parsedDischarge = {
    date: parseDate((discharge as Discharge).date),
    criteria: parseCriteria((discharge as Discharge).criteria),
  };
  return parsedDischarge;
};

export const toNewEntry = (object: unknown): EntryWithoutId => {
  if (!object || typeof object !== "object") {
    throw new Error("Incorrect or missing entry data");
  }

  if ("type" in object) {
    if ("date" in object && "specialist" in object && "description" in object) {
      let baseEntry: BaseEntryWithoutId;
      if ("diagnosisCodes" in object) {
        baseEntry = {
          date: parseDate(object.date),
          specialist: parseSpecialist(object.specialist),
          description: parseDescription(object.description),
          diagnosisCodes: parseDiagnosisCodes(object.diagnosisCodes),
        };
      } else {
        baseEntry = {
          date: parseDate(object.date),
          specialist: parseSpecialist(object.specialist),
          description: parseDescription(object.description),
        };
      }

      if (object.type === "HealthCheck") {
        if ("healthCheckRating" in object) {
          const healthCheckEntry: EntryWithoutId = {
            ...baseEntry,
            type: "HealthCheck",
            healthCheckRating: parseHealthCheckRating(object.healthCheckRating),
          };

          return healthCheckEntry;
        }
        throw new Error("Incorrect data: health check rating missing");
      } else if (object.type === "OccupationalHealthcare") {
        if ("employerName" in object) {
          const occupationalHealthcareEntry: EntryWithoutId =
            "sickLeave" in object
              ? {
                  ...baseEntry,
                  type: "OccupationalHealthcare",
                  employerName: parseEmployerName(object.employerName),
                  sickLeave: parseSickLeave(object.sickLeave),
                }
              : {
                  ...baseEntry,
                  type: "OccupationalHealthcare",
                  employerName: parseEmployerName(object.employerName),
                };
          return occupationalHealthcareEntry;
        }
        throw new Error("Incorrect data: employer name missing");
      } else if (object.type === "Hospital") {
        if ("discharge" in object) {
          const hospitalEntry: EntryWithoutId = {
            ...baseEntry,
            type: "Hospital",
            discharge: parseDischarge(object.discharge),
          };

          return hospitalEntry;
        }
        throw new Error("Incorrect data: discharge missing");
      }
    }
  }

  throw new Error("Incorrect data: some fields are missing");
};

export default toNewPatientEntry;
